import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(".env.local")

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    raise ValueError("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.")

if not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

stories = [
    {
        "title": "Smiling through burnout at work",
        "body": "Lately I have been acting cheerful in meetings while feeling completely drained underneath. I still get my work done, but it feels like I am performing okay rather than actually being okay.",
        "next_step": "Take one short pause today without trying to make it productive.",
    },
    {
        "title": "Feeling left behind by close friends",
        "body": "My friends are not doing anything wrong, but I still feel like I am slowly becoming less central in their lives. It is painful because there is no single moment to point to, just a quiet shift I can feel.",
        "next_step": "Name what you are grieving instead of pretending the distance does not hurt.",
    },
    {
        "title": "Pressure to be the successful child",
        "body": "A lot of my choices feel tied to making my family proud, and sometimes I cannot tell whether I am motivated or just scared of disappointing them. It is exhausting to carry ambition and fear at the same time.",
        "next_step": "Write down one hope that belongs to you, not just to other people.",
    },
    {
        "title": "Crying only when no one is around",
        "body": "I hold myself together all day, and then the moment I am finally alone everything spills out. I think part of me has learned that breaking down only feels safe in private.",
        "next_step": "Let yourself acknowledge that holding it in all day takes real energy.",
    },
    {
        "title": "Feeling guilty for needing reassurance",
        "body": "Sometimes I want to ask for comfort, but then I judge myself for being needy. I end up sitting with the feeling alone because asking feels embarrassing.",
        "next_step": "Ask for reassurance in one small honest sentence.",
    },
    {
        "title": "Missing a version of myself I used to be",
        "body": "I keep thinking about how much lighter I used to feel. It is strange to miss a former version of yourself and not know exactly how to get back there.",
        "next_step": "Name one part of yourself you still recognize, even now.",
    },
    {
        "title": "Always productive, never settled",
        "body": "I stay busy all the time, but I do not actually feel calm or accomplished. It feels like I am constantly moving just to avoid being alone with my thoughts.",
        "next_step": "Pause for five minutes without turning it into another task.",
    },
    {
        "title": "Feeling like I outgrew my old life",
        "body": "Some parts of my past no longer fit me, but moving forward has not felt clean or exciting the way I expected. It feels more like grief mixed with growth.",
        "next_step": "Let yourself admit that change can feel painful and right at the same time.",
    },
    {
        "title": "When weekends no longer feel restful",
        "body": "I wait all week for rest, but when the weekend comes I still feel tense and behind. It is hard to relax when my nervous system feels like it never really powers down.",
        "next_step": "Choose one hour this week that is not for catching up.",
    },
    {
        "title": "Feeling awkward in every social setting",
        "body": "I walk away from conversations replaying everything I said and wondering if I came across the wrong way. Even good interactions somehow turn into self-criticism later.",
        "next_step": "Let one interaction stay unfinished in your mind without analyzing it.",
    },
    {
        "title": "Being the helper but not the held one",
        "body": "I am often the one people come to when they need support, but I do not always feel like I have the same place to land. It makes me feel useful, but also lonely.",
        "next_step": "Think of one person who feels safe enough to receive a smaller truth from you.",
    },
    {
        "title": "Feeling disconnected from my body",
        "body": "Sometimes stress makes me feel like I am just floating above myself, going through motions without really being present. It is not panic exactly, just disconnection.",
        "next_step": "Notice one physical sensation right now without trying to change it.",
    },
    {
        "title": "Trying to recover from public failure",
        "body": "I made a mistake that other people saw, and I cannot stop replaying the embarrassment of it. What hurts most is not just the mistake, but how exposed I felt.",
        "next_step": "Separate the event from your worth in one written sentence.",
    },
    {
        "title": "Feeling forgotten by someone I still care about",
        "body": "It hurts when someone who mattered to me seems to keep moving while I still feel the absence of them. I keep wanting closure from someone who may never offer it.",
        "next_step": "Write the thing you still wish they understood.",
    },
    {
        "title": "Ashamed that small things feel hard",
        "body": "Some days basic things like replying to messages or cleaning my room feel much harder than they should. Then I feel ashamed for struggling with things other people make look easy.",
        "next_step": "Pick one small task and let completing only that be enough.",
    },
    {
        "title": "Feeling too much and saying too little",
        "body": "Inside, I feel things very intensely, but I often say almost nothing because I do not know how to explain it without sounding dramatic. So I come across calm when I actually feel overwhelmed.",
        "next_step": "Write one sentence that is more true than what you usually say out loud.",
    },
    {
        "title": "Starting over after emotional exhaustion",
        "body": "I keep telling myself this is a fresh start, but I still feel tired from everything that came before. It is hard to feel hopeful when your body still remembers the stress.",
        "next_step": "Let this next chapter begin slowly instead of perfectly.",
    },
    {
        "title": "Feeling like everyone needs something from me",
        "body": "Lately it feels like there is always another message, task, responsibility, or expectation waiting for me. Even when people mean well, I feel stretched thin by being needed.",
        "next_step": "Name one demand that does not need an immediate response.",
    },
    {
        "title": "When praise does not really sink in",
        "body": "People tell me I am doing well, but it slides right past me. Criticism sticks for days, but praise barely stays for a few seconds.",
        "next_step": "Write down one kind thing someone said and let it stay visible today.",
    },
    {
        "title": "Feeling homesick for people, not just places",
        "body": "Sometimes what I miss most is not where I used to live, but who I was around and how known I felt there. It is hard to explain missing a whole feeling of belonging.",
        "next_step": "Reach toward one memory that makes you feel rooted rather than more lost.",
    },
    {
        "title": "Resenting the life I worked hard for",
        "body": "This is the kind of life I once thought I wanted, which makes it harder to admit that parts of it now feel empty or exhausting. Gratitude and resentment keep living side by side.",
        "next_step": "Name one part of your life that feels heavy without forcing yourself to justify it.",
    },
    {
        "title": "Feeling guilty for pulling away",
        "body": "I have not had the energy to respond to people the way I normally do, and now I feel guilty on top of already feeling low. Avoiding everyone made sense at first, but now it also feels isolating.",
        "next_step": "Send one simple message that does not try to explain everything.",
    },
    {
        "title": "Trying to rebuild after a long hard season",
        "body": "Things are technically more stable now, but I do not feel instantly okay just because the crisis part is over. I think I expected relief to arrive faster than it did.",
        "next_step": "Let recovery be slower than survival had to be.",
    },
    {
        "title": "Feeling invisible in group settings",
        "body": "The more people there are, the easier it is for me to disappear into being agreeable and quiet. I leave group situations feeling like I was physically present but emotionally absent.",
        "next_step": "Notice one moment when you silenced yourself and what you wish you had said.",
    },
    {
        "title": "Comparing my healing to other people’s",
        "body": "When I see other people moving on more quickly, I start to feel weak for still being affected. It makes me rush myself in ways that do not actually help.",
        "next_step": "Replace one comparison thought with a kinder timeline for yourself.",
    },
    {
        "title": "Missing someone I chose to leave",
        "body": "I know leaving was the right decision, but I still miss them sometimes. That confuses me because I want my choices to feel cleaner than they actually do.",
        "next_step": "Let yourself miss them without treating that feeling like a mistake.",
    },
    {
        "title": "Feeling unsafe when things are finally calm",
        "body": "When life gets quiet, I almost do not trust it. Part of me stays alert, like I am waiting for the next thing to go wrong.",
        "next_step": "Notice one sign of safety around you without forcing yourself to fully relax.",
    },
    {
        "title": "Trying not to disappoint my younger self",
        "body": "I think part of my sadness comes from feeling like I am not becoming who I once thought I would be. It is hard carrying both present pressure and old dreams.",
        "next_step": "Ask what your younger self might need from you besides achievement.",
    },
    {
        "title": "Feeling emotionally crowded",
        "body": "There are so many feelings happening at once that I do not know where to start. Stress, sadness, irritation, and fear all seem to pile up until I just feel overloaded.",
        "next_step": "Pick the strongest feeling and let it be the only one you name right now.",
    },
    {
        "title": "Tired of pretending I can handle everything",
        "body": "I am used to acting like I have things under control, and it is getting harder to keep that up. The performance of coping is becoming almost as exhausting as the actual stress.",
        "next_step": "Say one thing out loud that you usually only carry alone."
    }
]
def main():
    existing_response = supabase.table("stories").select("title").execute()
    existing_titles = {row["title"] for row in (existing_response.data or []) if row.get("title")}

    inserted_count = 0
    skipped_count = 0

    for story in stories:
        if story["title"] in existing_titles:
            skipped_count += 1
            continue

        supabase.table("stories").insert(
            {
                "title": story["title"],
                "body": story["body"],
                "next_step": story["next_step"],
                "source_type": "seeded",
                "status": "approved",
                "consent_to_share": True,
                "is_public": True,
            }
        ).execute()

        inserted_count += 1
        print(f"Inserted: {story['title']}")

    print(f"\nDone. Inserted {inserted_count}, skipped {skipped_count} duplicates.")


if __name__ == "__main__":
    main()