import os
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from supabase import create_client
from fastapi.middleware.cors import CORSMiddleware


SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    raise ValueError("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.")

if not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.")


supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str
    match_count: int = 3


@app.get("/")
def root():
    return {"ok": True, "message": "SameHere Python search API is running"}


@app.post("/search")
def search_stories(payload: SearchRequest):
    query = payload.query.strip()

    if not query:
        return {"ok": False, "error": "Query is required."}

    query_embedding = model.encode(query).tolist()

    response = supabase.rpc(
        "match_stories",
        {
            "query_embedding": query_embedding,
            "match_count": payload.match_count,
        },
    ).execute()

    matches = response.data or []

    return {
        "ok": True,
        "query": query,
        "matches": matches,
    }