import os
import re
import uuid
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

import chromadb
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer

from app.config import CHROMA_PERSIST_DIR, KNOWLEDGE_BASE_DIR, EMBEDDING_MODEL_NAME
from app.models import RAGSearchResult

logger = logging.getLogger("rag_service")
logger.setLevel(logging.INFO)

class RAGService:
    def __init__(self):
        self.persist_dir = CHROMA_PERSIST_DIR
        self.kb_dir = KNOWLEDGE_BASE_DIR
        self.model_name = EMBEDDING_MODEL_NAME
        
        # Ensure directories exist
        os.makedirs(self.persist_dir, exist_ok=True)
        os.makedirs(self.kb_dir, exist_ok=True)
        
        # Initialize embedding model lazily
        self._model = None
        self._chroma_client = None
        self._collection = None

    @property
    def model(self):
        if self._model is None:
            logger.info(f"Loading sentence-transformer model: {self.model_name}...")
            # This will download the model automatically on first run
            self._model = SentenceTransformer(self.model_name)
            logger.info("Model loaded successfully.")
        return self._model

    @property
    def chroma_client(self):
        if self._chroma_client is None:
            logger.info(f"Initializing ChromaDB client at: {self.persist_dir}")
            self._chroma_client = chromadb.PersistentClient(path=self.persist_dir)
        return self._chroma_client

    @property
    def collection(self):
        if self._collection is None:
            # Get or create collection
            self._collection = self.chroma_client.get_or_create_collection(
                name="secure_coding_rules",
                metadata={"hnsw:space": "cosine"} # Use cosine similarity
            )
        return self._collection

    def embed_text(self, text: str) -> List[float]:
        emb = self.model.encode(text, convert_to_numpy=True)
        return emb.tolist()

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        embs = self.model.encode(texts, convert_to_numpy=True)
        return [emb.tolist() for emb in embs]

    def load_document(self, file_path: Path) -> str:
        suffix = file_path.suffix.lower()
        content = ""
        
        if suffix == ".pdf":
            logger.info(f"Reading PDF: {file_path}")
            reader = PdfReader(file_path)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    content += text + "\n"
        elif suffix in [".md", ".txt"]:
            logger.info(f"Reading Text/Markdown: {file_path}")
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        else:
            logger.warning(f"Unsupported file type: {suffix}")
            
        return content

    def ingest_documents(self) -> int:
        kb_path = Path(self.kb_dir)
        if not kb_path.exists():
            logger.warning(f"Knowledge base directory {kb_path} does not exist.")
            return 0
            
        supported_extensions = ["*.md", "*.txt", "*.pdf"]
        files = []
        for ext in supported_extensions:
            files.extend(kb_path.glob(ext))
            
        if not files:
            logger.warning("No files found in knowledge base directory to ingest.")
            return 0
            
        logger.info(f"Found {len(files)} files to process in knowledge base.")
        
        all_chunks = []
        all_metadatas = []
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        
        for file_path in files:
            try:
                content = self.load_document(file_path)
                if not content.strip():
                    logger.warning(f"Document {file_path.name} is empty.")
                    continue
                    
                chunks = text_splitter.split_text(content)
                logger.info(f"Split {file_path.name} into {len(chunks)} chunks.")
                
                for idx, chunk in enumerate(chunks):
                    all_chunks.append(chunk)
                    all_metadatas.append({
                        "source": file_path.name,
                        "chunk_index": idx,
                        "source_path": str(file_path.resolve())
                    })
            except Exception as e:
                logger.error(f"Error processing document {file_path.name}: {e}")
                
        if not all_chunks:
            logger.warning("No text chunks generated.")
            return 0
            
        # Generate embeddings in batches to prevent memory spikes
        logger.info(f"Generating embeddings for {len(all_chunks)} chunks...")
        embeddings = self.embed_texts(all_chunks)
        
        ids = [str(uuid.uuid4()) for _ in range(len(all_chunks))]
        
        # Add to Chroma collection
        # Note: we overwrite/recreate elements by deleting existing files first if desired,
        # but to keep it simple, we can delete the current collection content and re-insert,
        # ensuring we don't duplicate when running ingest multiple times.
        try:
            # Get collection size before
            count_before = self.collection.count()
            if count_before > 0:
                logger.info("Clearing existing documents in collection before re-indexing...")
                # We can delete all items
                self.collection.delete(where={})
        except Exception as e:
            logger.warning(f"Failed to clear collection: {e}")
            
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=all_chunks,
            metadatas=all_metadatas
        )
        
        total_indexed = self.collection.count()
        logger.info(f"Successfully indexed {total_indexed} chunks in ChromaDB.")
        return len(files)

    def query_kb(self, query_text: str, top_k: int = 4) -> List[RAGSearchResult]:
        if not query_text.strip():
            return []
            
        logger.info(f"Querying knowledge base for: '{query_text}' with top_k={top_k}")
        
        try:
            # If collection is empty, return empty list
            if self.collection.count() == 0:
                logger.warning("RAG collection is empty. Please run ingestion first.")
                return []
                
            query_embedding = self.embed_text(query_text)
            
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            
            search_results = []
            if results and 'documents' in results and results['documents']:
                documents = results['documents'][0]
                metadatas = results['metadatas'][0]
                distances = results['distances'][0]
                ids = results['ids'][0]
                
                for idx in range(len(documents)):
                    # Convert distance to similarity score
                    # For cosine, distance = 1 - cosine_similarity. So score = 1 - distance
                    # Let's ensure score is within 0.0 - 1.0
                    distance = distances[idx]
                    score = max(0.0, min(1.0, 1.0 - distance))
                    
                    search_results.append(
                        RAGSearchResult(
                            text=documents[idx],
                            score=round(score, 4),
                            source=metadatas[idx].get("source", "Unknown"),
                            chunk_id=ids[idx]
                        )
                    )
            return search_results
        except Exception as e:
            logger.error(f"Error querying knowledge base: {e}")
            return []

    def get_document_count(self) -> int:
        try:
            return self.collection.count()
        except Exception as e:
            logger.error(f"Failed to count collection items: {e}")
            return 0

# Singleton instance
rag_service = RAGService()
