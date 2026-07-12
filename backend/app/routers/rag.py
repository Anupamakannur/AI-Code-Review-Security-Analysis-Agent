from fastapi import APIRouter, HTTPException, status
from app.models import RAGQueryRequest, RAGQueryResponse, IngestResponse
from app.services.rag_service import rag_service

router = APIRouter(prefix="/api/rag", tags=["rag"])

@router.get("/status")
def get_rag_status():
    count = rag_service.get_document_count()
    return {
        "status": "ready" if count > 0 else "empty",
        "indexed_chunks": count,
        "kb_dir": rag_service.kb_dir
    }

@router.post("/ingest", response_model=IngestResponse)
def trigger_ingestion():
    try:
        files_count = rag_service.ingest_documents()
        total_chunks = rag_service.get_document_count()
        return IngestResponse(
            status="success",
            documents_indexed=files_count,
            message=f"Successfully processed {files_count} documents into {total_chunks} vector chunks."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to ingest documents: {str(e)}"
        )

@router.post("/query", response_model=RAGQueryResponse)
def query_knowledge_base(request: RAGQueryRequest):
    try:
        results = rag_service.query_kb(request.query, request.top_k)
        return RAGQueryResponse(
            query=request.query,
            results=results
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search knowledge base: {str(e)}"
        )
