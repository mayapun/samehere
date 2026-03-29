# SameHere Project Setup Guide

Welcome! Follow these steps to set up the SameHere project locally.

---

## 1. Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.10+ recommended)
- **pip** (Python package manager)
- **virtualenv** (recommended for Python)
- **Ollama** (for running Llama models locally)
- **Supabase** account (for database)

---

## 2. Clone the Repository
```sh
git clone <your-repo-url>
cd samehere
```

---

## 3. Environment Variables
1. Copy the example env file (if provided) or create a `.env.local` file in the root directory:
   ```sh
   cp .env.local.example .env.local
   # or create manually
   touch .env.local
   ```
2. Fill in the following variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key (optional, for OpenAI integration)
   ```

---

## 4. Install Node.js Dependencies
```sh
npm install
```

---

## 5. Set Up Python Backend
1. Create and activate a virtual environment:
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install Python dependencies:
   ```sh
   pip install -r requirements.txt
   ```

---

## 6. Set Up Supabase
- Create a Supabase project at https://app.supabase.com
- Create a `stories` table with columns: `title`, `body`, `next_step`, `source_type`, `status`, `consent_to_share`, `is_public`
- Get your Supabase URL and Service Role Key and add them to `.env.local`

---

## 7. Seed the Database (Optional)
To add starter stories:
```sh
cd scripts
source ../venv/bin/activate
python seed_stories.py
cd ..
```

---

## 8. Install Ollama and Llama Model
1. **Install Ollama:**
   - [Download and install Ollama](https://ollama.com/download) for your OS.
   - Or via Homebrew (macOS):
     ```sh
     brew install ollama
     ```
2. **Start Ollama and pull the Llama 3 model:**
   ```sh
   ollama serve &
   ollama pull llama3.2:3b
   ```

---

## 9. Run the Backend API
```sh
source venv/bin/activate
uvicorn scripts.api:app --reload
```

---

## 10. Run the Frontend (Next.js)
```sh
npm run dev
```

- The app will be available at http://localhost:3000

---

## 11. Usage Notes
- The backend expects Ollama to be running and the Llama model loaded.
- The frontend communicates with the backend at `http://127.0.0.1:8000`.
- For OpenAI features, set your `OPENAI_API_KEY` in `.env.local`.

---

## 12. Troubleshooting
- If you get `zsh: command not found: ollama`, ensure Ollama is installed and in your PATH.
- If Python modules are missing, run `pip install -r requirements.txt` in your venv.
- If you see Supabase errors, check your env variables and Supabase table setup.

---


Enjoy building and contributing to SameHere!
