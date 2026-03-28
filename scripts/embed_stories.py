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


def main():
    response = supabase.table("stories").select("id, body, embedding").execute()
    stories = response.data or []

    if not stories:
        print("No stories found.")
        return

    print(f"Found {len(stories)} stories.")

    for story in stories:
        story_id = story["id"]
        body = (story.get("body") or "").strip()

        if not body:
            print(f"Skipping story {story_id}: empty body")
            continue

        embedding = model.encode(body).tolist()

        supabase.table("stories").update(
            {"embedding": embedding}
        ).eq("id", story_id).execute()

        print(f"Updated story {story_id} with embedding length {len(embedding)}")

    print("Done embedding stories.")


if __name__ == "__main__":
    main()