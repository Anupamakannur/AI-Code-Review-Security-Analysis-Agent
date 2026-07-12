from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import code, rag
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("main")

app = FastAPI(
    title="AI Code Review & Security Analysis Agent - Backend",
    description="Milestone 1: Code Submission Module & Secure Coding RAG Knowledge Base",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(code.router)
app.include_router(rag.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "milestone": 1,
        "message": "AI Code Review & Security Analysis Agent backend API is active."
    }

if __name__ == "__main__":
    import uvicorn
    from app.config import HOST, PORT
    logger.info(f"Starting server on {HOST}:{PORT}...")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
