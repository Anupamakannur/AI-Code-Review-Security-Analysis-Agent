from pydantic import BaseModel, Field
from typing import List, Optional

class CodeSubmitRequest(BaseModel):
    code: str
    language: str
    filename: Optional[str] = None

class ValidationDetail(BaseModel):
    line: int
    column: int
    message: str
    severity: str = "error" # "error" or "warning"

class SyntaxValidationResponse(BaseModel):
    is_valid: bool
    errors: List[ValidationDetail]
    language: str

class CodeSubmitResponse(BaseModel):
    id: str
    is_valid: bool
    errors: List[ValidationDetail]
    message: str
    timestamp: str

class RAGQueryRequest(BaseModel):
    query: str
    top_k: int = 4

class RAGSearchResult(BaseModel):
    text: str
    score: float
    source: str
    chunk_id: Optional[str] = None

class RAGQueryResponse(BaseModel):
    query: str
    results: List[RAGSearchResult]

class IngestResponse(BaseModel):
    status: str
    documents_indexed: int
    message: str
