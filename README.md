# Smart Study Generator Agent

**AI-powered personalized learning assistant** — built with React, TypeScript, Python FastAPI, IBM watsonx.ai, IBM Langflow, and IBM Orchestrate.

---

## Features

| Feature | Description | IBM Service |
|---|---|---|
| **AI Study Notes** | Generate detailed notes, summaries, outlines from any topic | IBM watsonx.ai (Granite) |
| **Flashcard Generator** | Create and flip AI-generated spaced-repetition flashcards | IBM watsonx.ai |
| **Practice Quizzes** | Multi-choice quizzes with instant explanations | IBM watsonx.ai |
| **AI Chat Assistant** | Voice + text Q&A assistant with subject context | IBM watsonx.ai + Langflow |
| **Concept Maps** | SVG knowledge graphs for visual learners | IBM watsonx.ai |
| **Study Planner** | Week-by-week exam plans with spaced repetition | IBM watsonx.ai |
| **Exam Predictor** | Readiness score, weak areas, topic frequency analysis | IBM watsonx.ai |
| **Progress Analytics** | Charts, streaks, milestones, subject distribution | Backend analytics |
| **Document Processing** | PDF / DOCX / Image OCR text extraction | PyMuPDF + Tesseract |
| **Dark Mode** | Full system-aware dark/light toggle | — |

---

## Architecture

```
smart-study-generator-agent/
├── frontend/               # React 18 + TypeScript + Vite + Tailwind CSS
│   └── src/
│       ├── contexts/       # AuthContext, ThemeContext
│       ├── lib/            # Axios API client
│       ├── components/     # Layout, Sidebar
│       └── pages/          # 11 full-featured pages
└── backend/                # Python FastAPI
    ├── main.py             # All routes, IBM integrations
    ├── requirements.txt
    └── .env.example
```

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9
- **Python** ≥ 3.10
- **Git**

### 1 · Clone & Configure

```bash
git clone <your-repo-url>
cd smart-study-generator-agent
```

Copy the backend environment file and fill in credentials:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# Required for live AI features
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
IBM_WATSONX_API_KEY=your-ibm-cloud-api-key
IBM_WATSONX_PROJECT_ID=your-watsonx-project-id
IBM_WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2

# Optional – Langflow workflow orchestration
IBM_LANGFLOW_URL=http://localhost:7860

# Optional – IBM Orchestrate
IBM_ORCHESTRATE_URL=
IBM_ORCHESTRATE_API_KEY=

# Optional – PostgreSQL (uses in-memory storage if not set)
DATABASE_URL=postgresql://postgres:password@localhost:5432/smart_study_db

# Security
SECRET_KEY=change-this-to-a-long-random-string
```

> **Note:** The app runs fully in **Demo Mode** without IBM credentials. All UI features work; AI responses will be informational placeholders until credentials are configured.

---

### 2 · Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS / Linux)
source venv/bin/activate

# Install required dependencies
pip install -r requirements.txt

# Optional: enable PDF extraction
pip install pymupdf

# Optional: enable DOCX extraction
pip install python-docx

# Optional: enable Image OCR (also requires Tesseract binary)
pip install pillow pytesseract
# Windows: download Tesseract from https://github.com/UB-Mannheim/tesseract/wiki
# macOS:   brew install tesseract
# Ubuntu:  sudo apt install tesseract-ocr
```

Start the backend:

```bash
# From the backend/ directory, with venv active
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend is available at: **http://localhost:8000**
Interactive API docs: **http://localhost:8000/docs**

---

### 3 · Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start dev server
npm run dev
```

Frontend is available at: **http://localhost:5173**

---

### 4 · Open the App

1. Navigate to **http://localhost:5173**
2. Click **Create Account** and register with any email + password
3. Explore the dashboard — the IBM status banner shows whether live AI is active
4. Upload a PDF or enter a topic in **Generate Notes** to create AI study materials

---

## IBM Credentials Setup

### IBM watsonx.ai

1. Sign in to [IBM Cloud](https://cloud.ibm.com)
2. Create a **Watson Machine Learning** service instance
3. Create a **watsonx.ai** project at [dataplatform.cloud.ibm.com](https://dataplatform.cloud.ibm.com)
4. Generate an API key at **Manage → Access (IAM) → API Keys**
5. Copy the project ID from your watsonx.ai project settings
6. Set these in `backend/.env`:
   ```env
   IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
   IBM_WATSONX_API_KEY=<your-api-key>
   IBM_WATSONX_PROJECT_ID=<your-project-id>
   ```

Supported Models (configurable in Settings page):
- `ibm/granite-13b-instruct-v2` (default)
- `ibm/granite-34b-code-instruct`
- `meta-llama/llama-3-70b-instruct`
- `mistralai/mixtral-8x7b-instruct-v01`

### IBM Langflow

IBM Langflow orchestrates multi-step AI workflows for study generation, Q&A, and summarization.

```bash
# Install Langflow
pip install langflow

# Run local Langflow server
langflow run --host 0.0.0.0 --port 7860
```

Set in `backend/.env`:
```env
IBM_LANGFLOW_URL=http://localhost:7860
```

When configured, the app will route generation requests through Langflow flows before falling back to direct watsonx.ai calls.

### IBM Orchestrate

IBM Orchestrate handles multi-agent task coordination. Set credentials in `backend/.env`:
```env
IBM_ORCHESTRATE_URL=https://your-orchestrate-instance.ibm.com
IBM_ORCHESTRATE_API_KEY=your-orchestrate-api-key
```

---

## PostgreSQL Setup (Production)

The app uses in-memory storage by default. For persistent storage:

```bash
# Install PostgreSQL adapter dependencies
pip install sqlalchemy asyncpg alembic

# Start PostgreSQL (Docker)
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=smart_study_db \
  -p 5432:5432 \
  postgres:16

# Set in backend/.env
DATABASE_URL=postgresql://postgres:password@localhost:5432/smart_study_db
```

---

## Production Build

```bash
# Build frontend for production
cd frontend
npm run build
# Output: frontend/dist/

# Run backend in production
cd backend
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Compose (Full Stack)

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    env_file: ./backend/.env

  frontend:
    build: ./frontend
    ports: ["5173:80"]
    depends_on: [backend]

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: smart_study_db
      POSTGRES_PASSWORD: password
    volumes: ["pgdata:/var/lib/postgresql/data"]

volumes:
  pgdata:
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/materials/upload` | Upload PDF/DOCX/image |
| `GET` | `/api/materials` | List all materials |
| `POST` | `/api/generate/notes` | Generate AI study notes |
| `POST` | `/api/flashcards/generate` | Generate flashcard set |
| `POST` | `/api/quizzes/generate` | Generate practice quiz |
| `POST` | `/api/assistant/chat` | AI chat message |
| `POST` | `/api/planner/create` | Create study plan |
| `GET` | `/api/predictor/{subject}` | Exam readiness prediction |
| `GET` | `/api/analytics/overview` | Progress analytics |
| `GET` | `/api/health` | Health check + IBM status |

Full interactive docs at: **http://localhost:8000/docs**

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Charts | Recharts |
| Markdown | react-markdown |
| HTTP client | Axios |
| Backend | Python 3.11+, FastAPI, Uvicorn |
| AI | IBM watsonx.ai (Granite foundation models) |
| AI Orchestration | IBM Langflow |
| Agent Coordination | IBM Orchestrate |
| PDF Extraction | PyMuPDF (fitz) |
| OCR | Tesseract + pytesseract |
| DOCX | python-docx |
| Database | PostgreSQL (in-memory fallback) |
| Auth | JWT-style token (production: python-jose) |

---

## Demo Mode vs Live Mode

| Feature | Demo Mode (no IBM creds) | Live Mode (IBM configured) |
|---|---|---|
| UI & Navigation | ✅ Fully functional | ✅ Fully functional |
| Document upload | ✅ With text extraction | ✅ With text extraction |
| AI Note Generation | ⚠ Placeholder response shown | ✅ Real IBM Granite generation |
| AI Chat | ⚠ Placeholder response | ✅ Real IBM watsonx.ai |
| Flashcard AI | ⚠ Demo cards | ✅ AI-generated cards |
| Quiz AI | ⚠ Demo questions | ✅ AI-generated quiz |
| Exam Prediction | ⚠ Static demo data | ✅ AI analysis |
| Study Planner | ⚠ Demo plan content | ✅ AI-personalized plan |
| Charts & Analytics | ✅ Real data from backend | ✅ Real data from backend |

---

## License

MIT
