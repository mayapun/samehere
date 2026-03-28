import os
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from supabase import create_client
from fastapi.middleware.cors import CORSMiddleware
import random

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
MIN_SIMILARITY_SCORE = 0.4

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


class CreateStoryRequest(BaseModel):
    body: str
    title: str | None = None


@app.get("/")
def root():
    return {"ok": True, "message": "SameHere Python search API is running"}

@app.post("/search")
def search_stories(payload: SearchRequest):
    try:
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
        matches = [
            match for match in matches
            if match.get("similarity") is not None
            and match["similarity"] >= MIN_SIMILARITY_SCORE
        ]

        return {
            "ok": True,
            "query": query,
            "matches": matches,
        }

    except Exception as e:
        print("SEARCH ERROR:", e)
        return {
            "ok": False,
            "error": str(e),
            "matches": [],
        }

@app.post("/stories")
def create_story(payload: CreateStoryRequest):
    body = payload.body.strip()

    if not body:
        return {"ok": False, "error": "Story body is required."}

    title = payload.title.strip() if payload.title else generate_title_from_body(body)

    embedding = model.encode(body).tolist()

    response = (
        supabase.table("stories")
        .insert(
            {
                "title": title,
                "body": body,
                "next_step": generate_gentle_step(body),
                "source_type": "user",
                "status": "approved",
                "consent_to_share": True,
                "is_public": True,
                "embedding": embedding,
            }
        )
        .execute()
    )

    created_rows = response.data or []

    return {
        "ok": True,
        "message": "Story created successfully.",
        "story": created_rows[0] if created_rows else None,
    }

def generate_title_from_body(body: str) -> str:
    words = body.strip().split()

    if not words:
        return "Shared experience"

    short_title = " ".join(words[:6])

    if len(words) > 6:
        short_title += "..."

    return short_title

def generate_gentle_step(body: str) -> str:
    text = body.lower()

    connection_tips = [
        "Reach out to one trusted person with one honest sentence.",
        "Send a small message to someone safe, even if it is just 'hey'.",
        "Let yourself ask for connection in one small way today.",
    ]

    grounding_tips = [
        "Take one slow breath and notice your shoulders unclenching.",
        "Write down one thing that feels heaviest right now.",
        "Step away for five quiet minutes without trying to solve everything.",
    ]

    anxiety_tips = [
        "Name 3 things you can see and take one slower breath.",
        "Focus only on the next ten minutes instead of the whole day.",
        "Place your feet on the floor and notice one steady thing around you.",
    ]

    reflection_tips = [
        "Write one honest sentence about what hurts most right now.",
        "Let yourself name the feeling without judging it.",
        "Remind yourself that difficult emotions do not make you weak.",
    ]

    rest_tips = [
        "Take five minutes of rest without needing to earn it.",
        "Choose one task that can wait until tomorrow.",
        "Give yourself permission to pause before responding to anything else.",
    ]

    general_tips = [
        "Take one gentle pause and notice what you need most right now.",
        "Be kind to yourself for the next few minutes instead of demanding clarity.",
        "Let one small next step be enough for today.",
    ]

    if any(word in text for word in ["alone", "lonely", "isolated", "disconnected"]):
        return random.choice(connection_tips)

    if any(word in text for word in ["anxious", "panic", "worry", "overthinking", "nervous"]):
        return random.choice(anxiety_tips)

    if any(word in text for word in ["overwhelmed", "pressure", "expectations", "stress"]):
        return random.choice(grounding_tips)

    if any(word in text for word in ["tired", "burnout", "burned out", "exhausted", "drained"]):
        return random.choice(rest_tips)

    if any(word in text for word in ["sad", "hurt", "grief", "heartbreak", "crying"]):
        return random.choice(reflection_tips)

    return random.choice(general_tips)