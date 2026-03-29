# SameHere

SameHere is an emotional support web app that helps people feel less alone through shared lived experiences.

Users can either:

- **Find stories like mine** by describing what they are going through, then receiving semantically similar stories and one gentle next step
- **Share my story** by submitting a story that gets stored and becomes searchable later

## Why SameHere?

Sometimes support from close people is not enough. They care, but they may not have gone through the same experience.

SameHere is built around the idea that hearing from people who have truly been there can feel more relatable, more human, and more comforting than generic advice.

The app creates a dedicated space for:

- shared stories
- gentle next steps
- relevant support resources

## Features

- Semantic search over lived-experience stories
- Gentle next-step generation based on similar stories
- Story submission flow for future discoverability
- Horizontal story carousel for results
- Home screen with separate **Find** and **Post** modes
- Fallback gentle-step flow even when no close story matches are found

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- FastAPI
- Python

### Database
- Supabase Postgres
- pgvector

### AI / Search
- sentence-transformers (`all-MiniLM-L6-v2`) for embeddings
- Ollama for local gentle-step generation

## Architecture Overview

### Frontend
The frontend is built in Next.js and provides the user-facing experience.

Main responsibilities:
- welcome/home screen
- mode selection
- story search input
- story submission form
- result carousel
- gentle-step display

Main file:
- `app/page.tsx`

### Backend
The FastAPI backend handles:
- searching similar stories
- storing new stories
- generating a gentle next step

Endpoints:
- `POST /search`
- `POST /stories`
- `POST /gentle-step`

Main file:
- `scripts/api.py`

### Database
Stories are stored in Supabase Postgres.

The `stories` table includes fields such as:
- `id`
- `user_id`
- `title`
- `body`
- `next_step`
- `source_type`
- `status`
- `consent_to_share`
- `is_public`
- `created_at`
- `embedding`

Semantic retrieval is powered by:
- `pgvector`
- a Postgres matching function such as `match_stories(...)`

## Project Structure

```bash
.
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   └── supabase/
│       └── server.ts
├── scripts/
│   ├── api.py
│   ├── embed_stories.py
│   ├── search_stories.py
│   └── seed_stories.py
├── .env.local
└── README.md
```

## Team Members

- Dilmaya Pun
- Manas Karki