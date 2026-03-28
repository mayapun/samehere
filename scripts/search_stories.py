import os
from sentence_transformers import SentenceTransformer
from supabase import create_client


SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    raise ValueError("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.")

if not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.")


supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
MIN_SIMILARITY_SCORE = 0.4

def main():
    query = "I feel overwhelmed by family expectations and pressure."

    query_embedding = model.encode(query).tolist()

    response = supabase.rpc(
        "match_stories",
        {
            "query_embedding": query_embedding,
            "match_count": 3,
        },
    ).execute()

    matches = response.data or []

    print(f"\nQuery: {query}\n")
    print(f"Found {len(matches)} matches.\n")

    for i, match in enumerate(matches, start=1):
        print(f"{i}. {match['title']}")
        print(f"   Similarity: {match['similarity']:.4f}")
        print(f"   Next step: {match['next_step']}")
        print()


if __name__ == "__main__":
    main()