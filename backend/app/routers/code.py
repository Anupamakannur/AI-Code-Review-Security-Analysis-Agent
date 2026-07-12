from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
from datetime import datetime
import os

from app.models import CodeSubmitRequest, SyntaxValidationResponse, CodeSubmitResponse, ValidationDetail
from app.services.syntax_validator import validate_code
from app.services.database import db_service

router = APIRouter(prefix="/api/code", tags=["code"])

@router.post("/validate", response_model=SyntaxValidationResponse)
def validate_syntax(request: CodeSubmitRequest):
    errors = validate_code(request.code, request.language)
    is_valid = len(errors) == 0
    return SyntaxValidationResponse(
        is_valid=is_valid,
        errors=errors,
        language=request.language
    )

@router.post("/paste-code", response_model=CodeSubmitResponse)
def paste_code(request: CodeSubmitRequest):
    # Validate first
    errors = validate_code(request.code, request.language)
    is_valid = len(errors) == 0
    
    # Save to database
    submission_id = db_service.save_submission(
        code=request.code,
        language=request.language,
        filename=request.filename,
        is_valid=is_valid,
        errors=errors
    )
    
    msg = "Code submitted successfully." if is_valid else "Code submitted with syntax errors."
    
    return CodeSubmitResponse(
        id=submission_id,
        is_valid=is_valid,
        errors=errors,
        message=msg,
        timestamp=datetime.utcnow().isoformat()
    )

@router.post("/upload", response_model=CodeSubmitResponse)
async def upload_file(
    file: UploadFile = File(...),
    language: str = Form(...)
):
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()
    
    # Validate extension
    lang = language.lower()
    if lang in ["python", "py"] and ext != ".py":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension {ext} for language {language}. Expected .py"
        )
    elif lang == "java" and ext != ".java":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension {ext} for language {language}. Expected .java"
        )
        
    try:
        contents = await file.read()
        code_str = contents.decode("utf-8")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not parse file content: {str(e)}"
        )
        
    # Validate
    errors = validate_code(code_str, language)
    is_valid = len(errors) == 0
    
    # Save to database
    submission_id = db_service.save_submission(
        code=code_str,
        language=language,
        filename=filename,
        is_valid=is_valid,
        errors=errors
    )
    
    msg = f"File {filename} uploaded and processed successfully." if is_valid else f"File {filename} uploaded but contains syntax errors."
    
    return CodeSubmitResponse(
        id=submission_id,
        is_valid=is_valid,
        errors=errors,
        message=msg,
        timestamp=datetime.utcnow().isoformat()
    )

@router.get("/submissions")
def get_submissions():
    return db_service.get_all_submissions()

@router.get("/stats")
def get_stats():
    stats = db_service.get_stats()
    # Add document count from RAG service to stats
    from app.services.rag_service import rag_service
    stats["indexed_chunks"] = rag_service.get_document_count()
    return stats
