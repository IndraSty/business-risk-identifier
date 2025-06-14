from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from enum import Enum
import base64
import time
from loguru import logger

# Assuming you have the FileProcessorService from previous code
from app.services.openai_service import FileProcessorService

router = APIRouter(prefix="/api/v1/file-processor", tags=["File Processor"])


class FileType(str, Enum):
    PDF = "pdf"
    TXT = "txt"
    DOCX = "docx"
    DOC = "doc"


class FileProcessRequest(BaseModel):
    """Request model for file processing via base64"""

    file_data: str = Field(..., description="Base64 encoded file content")
    file_type: FileType = Field(..., description="Type of the uploaded file")
    filename: Optional[str] = Field(None, description="Original filename (optional)")

    @validator("file_data")
    def validate_base64(cls, v):
        try:
            # Test if it's valid base64
            base64.b64decode(v)
            return v
        except Exception:
            raise ValueError("Invalid base64 encoded data")


class FileProcessResponse(BaseModel):
    """Response model for file processing"""

    success: bool
    filename: Optional[str]
    file_type: str
    file_size_mb: float
    processing_time_ms: int
    extracted_text: str
    text_length: int
    word_count: int
    line_count: int
    error_message: Optional[str] = None


@router.post("/process-base64", response_model=FileProcessResponse)
async def process_file_base64(request: FileProcessRequest):
    """
    Process file from base64 encoded data

    This endpoint accepts base64 encoded file data and extracts text content.
    Useful for testing file processing capabilities.
    """
    start_time = time.time()

    try:
        logger.info(
            f"Processing file: {request.filename or 'unnamed'} ({request.file_type.value})"
        )

        # Initialize file processor
        file_processor = FileProcessorService()

        # Validate file size
        if not file_processor.validate_file_size(request.file_data, max_size_mb=10):
            raise HTTPException(status_code=413, detail="File size exceeds 10MB limit")

        # Calculate file size
        file_size_bytes = len(request.file_data) * 3 / 4
        file_size_mb = file_size_bytes / (1024 * 1024)

        # Extract text from file
        extracted_text = file_processor.extract_text_from_base64(
            request.file_data, request.file_type.value, request.filename
        )

        # Calculate processing time
        processing_time = int((time.time() - start_time) * 1000)

        # Calculate text statistics
        word_count = len(extracted_text.split())
        line_count = len(extracted_text.splitlines())

        logger.info(
            f"Successfully processed file: {len(extracted_text)} characters extracted"
        )

        return FileProcessResponse(
            success=True,
            filename=request.filename,
            file_type=request.file_type.value,
            file_size_mb=round(file_size_mb, 2),
            processing_time_ms=processing_time,
            extracted_text=extracted_text,
            text_length=len(extracted_text),
            word_count=word_count,
            line_count=line_count,
        )

    except ValueError as e:
        logger.error(f"File processing error: {e}")
        processing_time = int((time.time() - start_time) * 1000)

        return FileProcessResponse(
            success=False,
            filename=request.filename,
            file_type=request.file_type.value,
            file_size_mb=0,
            processing_time_ms=processing_time,
            extracted_text="",
            text_length=0,
            word_count=0,
            line_count=0,
            error_message=str(e),
        )

    except Exception as e:
        logger.error(f"Unexpected error processing file: {e}")
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")


@router.post("/process-upload", response_model=FileProcessResponse)
async def process_file_upload(
    file: UploadFile = File(...), max_size_mb: Optional[int] = Form(10)
):
    """
    Process uploaded file directly

    This endpoint accepts direct file upload and extracts text content.
    Supports PDF, TXT, DOCX files up to specified size limit.
    """
    start_time = time.time()

    try:
        # Validate file type
        file_extension = file.filename.split(".")[-1].lower() if file.filename else ""
        if file_extension not in ["pdf", "txt", "docx", "doc"]:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file_extension}. Supported: PDF, TXT, DOCX",
            )

        # Read file content
        file_content = await file.read()

        # Check file size
        file_size_mb = len(file_content) / (1024 * 1024)
        if file_size_mb > max_size_mb:
            raise HTTPException(
                status_code=413,
                detail=f"File size ({file_size_mb:.2f}MB) exceeds limit ({max_size_mb}MB)",
            )

        logger.info(f"Processing uploaded file: {file.filename} ({file_size_mb:.2f}MB)")

        # Convert to base64 for processing
        file_base64 = base64.b64encode(file_content).decode("utf-8")

        # Initialize file processor
        file_processor = FileProcessorService()

        # Extract text from file
        extracted_text = file_processor.extract_text_from_base64(
            file_base64, file_extension, file.filename
        )

        # Calculate processing time
        processing_time = int((time.time() - start_time) * 1000)

        # Calculate text statistics
        word_count = len(extracted_text.split())
        line_count = len(extracted_text.splitlines())

        logger.info(
            f"Successfully processed upload: {len(extracted_text)} characters extracted"
        )

        return FileProcessResponse(
            success=True,
            filename=file.filename,
            file_type=file_extension,
            file_size_mb=round(file_size_mb, 2),
            processing_time_ms=processing_time,
            extracted_text=extracted_text,
            text_length=len(extracted_text),
            word_count=word_count,
            line_count=line_count,
        )

    except HTTPException:
        raise

    except ValueError as e:
        logger.error(f"File processing error: {e}")
        processing_time = int((time.time() - start_time) * 1000)

        return FileProcessResponse(
            success=False,
            filename=file.filename,
            file_type=file_extension if "file_extension" in locals() else "unknown",
            file_size_mb=round(file_size_mb, 2) if "file_size_mb" in locals() else 0,
            processing_time_ms=processing_time,
            extracted_text="",
            text_length=0,
            word_count=0,
            line_count=0,
            error_message=str(e),
        )

    except Exception as e:
        logger.error(f"Unexpected error processing upload: {e}")
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")


@router.get("/supported-formats")
async def get_supported_formats():
    """Get list of supported file formats and their details"""
    return {
        "supported_formats": [
            {
                "format": "PDF",
                "extension": ".pdf",
                "description": "Portable Document Format - extracts text from all pages",
                "max_size_mb": 10,
            },
            {
                "format": "TXT",
                "extension": ".txt",
                "description": "Plain text files - supports multiple encodings",
                "max_size_mb": 10,
            },
            {
                "format": "DOCX",
                "extension": ".docx",
                "description": "Microsoft Word documents - extracts text and tables",
                "max_size_mb": 10,
            },
            {
                "format": "DOC",
                "extension": ".doc",
                "description": "Legacy Microsoft Word documents",
                "max_size_mb": 10,
            },
        ],
        "processing_capabilities": [
            "Text extraction from documents",
            "Automatic encoding detection for text files",
            "Table content extraction from Word documents",
            "Multi-page processing for PDFs",
            "File size validation",
            "Processing time measurement",
        ],
    }


# Example usage and testing endpoints
@router.post("/test/sample-text")
async def test_sample_text():
    """
    Test endpoint with sample text processing

    Creates a sample text file and processes it to demonstrate functionality
    """
    sample_text = """
    BUSINESS RISK ANALYSIS SAMPLE DOCUMENT
    
    This is a sample business document for testing file processing capabilities.
    
    Key Business Risks Identified:
    1. Market Competition Risk - High probability of new competitors entering the market
    2. Operational Risk - Dependency on single supplier for critical components  
    3. Financial Risk - Cash flow constraints due to seasonal demand patterns
    4. Regulatory Risk - Upcoming changes in industry regulations
    5. Technology Risk - Legacy systems requiring modernization
    
    Risk Mitigation Strategies:
    - Diversify supplier base to reduce dependency
    - Implement cash flow forecasting and management
    - Invest in technology upgrade roadmap
    - Monitor regulatory changes and ensure compliance
    
    This document contains sufficient content to test text extraction and analysis capabilities.
    """

    # Convert to base64
    text_base64 = base64.b64encode(sample_text.encode("utf-8")).decode("utf-8")

    request = FileProcessRequest(
        file_data=text_base64,
        file_type=FileType.TXT,
        filename="sample_business_risks.txt",
    )

    return await process_file_base64(request)
