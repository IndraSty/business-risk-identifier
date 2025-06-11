from typing import Dict, Any
from fastapi import HTTPException, status
from loguru import logger

from app.models import DocumentInput, RiskAnalysisResponse
from app.services import risk_analysis_engine
from app.config import settings

class RiskController:
    """Controller for risk analysis endpoints"""
    
    @staticmethod
    async def validate_document_input(document_input: DocumentInput) -> DocumentInput:
        """Validate document input before processing"""
        try:
            # Check document length
            if len(document_input.document_content) > settings.max_document_length:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"Document too large. Maximum length: {settings.max_document_length} characters"
                )