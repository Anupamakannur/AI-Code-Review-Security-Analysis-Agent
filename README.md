# AI Code Review & Security Analysis Agent

This project is a full-stack application for reviewing submitted code and providing secure coding guidance. It combines a FastAPI backend with a React + Vite frontend to support:

- Syntax validation for Python and Java code
- Code submission through paste or file upload
- Submission history and basic statistics
- Retrieval-augmented generation (RAG) over a secure coding knowledge base
- A dashboard-style UI for code review and documentation

## Features

- Submit Python or Java code snippets directly from the UI
- Upload `.py` and `.java` files for validation
- Store and inspect prior submissions
- Query a knowledge base for OWASP and secure coding recommendations
- Ingest local markdown knowledge base files into a Chroma vector database

## Tech Stack

### Backend
- Python
- FastAPI
- Uvicorn
- ChromaDB
- sentence-transformers
- LangChain

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

## Project Structure

- `backend/app/` - FastAPI application, routers, services, models
- `backend/data/knowledge_base/` - Markdown knowledge base documents
- `backend/scripts/` - Utility scripts such as knowledge base seeding
- `frontend/src/` - React pages, components, and styles

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm

## Backend Setup

From the project root, run:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at:
- http://127.0.0.1:8000/

## Frontend Setup

From the project root, run:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will typically be available at:
- http://localhost:5173/

## Seed the Knowledge Base (Optional)

If you want to ingest the markdown knowledge base documents into ChromaDB:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python scripts/seed_kb.py
```

## API Overview

### Code endpoints
- `POST /api/code/validate`
- `POST /api/code/paste-code`
- `POST /api/code/upload`
- `GET /api/code/submissions`
- `GET /api/code/stats`

### RAG endpoints
- `GET /api/rag/status`
- `POST /api/rag/ingest`
- `POST /api/rag/query`

## Notes

- The project uses default local settings for development.
- Generated files such as `node_modules`, `.venv`, build output, and local Chroma data are ignored by Git.

## License

This project is intended for educational and demonstration purposes.