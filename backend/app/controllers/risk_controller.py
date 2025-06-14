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
            # Check if we have either content or file data
            has_content = (
                document_input.document_content
                and len(document_input.document_content.strip()) > 0
            )
            has_file = (
                document_input.file_data
                and document_input.file_data.strip()  # Check for non-empty string
                and document_input.file_type
            )

            if not has_content and not has_file:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Either document content or file data must be provided",
                )

            # If we have direct content (not file), validate it
            if has_content and not has_file:
                # Check document length
                if len(document_input.document_content) > settings.MAX_DOCUMENT_LENGTH:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"Document too large. Maximum length: {settings.MAX_DOCUMENT_LENGTH} characters",
                    )

                # Check minimum content length
                if len(document_input.document_content.strip()) < 50:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Document content too short. Minimum length: 50 characters",
                    )

                # Validate content quality (basic check)
                if document_input.document_content.strip().count(" ") < 10:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Document content appears to be incomplete or invalid",
                    )

            # If file upload, validate file data and metadata
            elif has_file:
                # 1. Validate filename
                if not document_input.filename or document_input.filename.strip() == "":
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Filename is required for file uploads",
                    )

                # 2. Validate file type against allowed types
                allowed_types = ["pdf", "doc", "docx", "txt"]
                if (
                    document_input.file_type.value.lower() not in allowed_types
                ):  # Use .value for enum
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Unsupported file type. Allowed types: {', '.join(allowed_types)}",
                    )

            # If both content and file are provided, validate both
            elif has_content and has_file:
                logger.warning("Both content and file provided. Validating both.")

                # Validate content
                if len(document_input.document_content) > settings.MAX_DOCUMENT_LENGTH:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"Document content too large. Maximum length: {settings.MAX_DOCUMENT_LENGTH} characters",
                    )

            logger.info(
                f"Document validation passed: {document_input.document_type}, "
                f"Input type: {'file' if has_file else 'text'}, "
                f"Content length: {len(document_input.document_content) if has_content else 'N/A (file)'} chars"
            )

            return document_input

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Document validation error: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Document validation failed: {str(e)}",
            )

    @staticmethod
    async def analyze_document_risks(
        document_input: DocumentInput,
    ) -> RiskAnalysisResponse:
        """Main method to analyze document for risks"""
        try:
            # Log analysis start
            logger.info(
                f"Starting risk analysis - Type: {document_input.document_type.value}, "
                f"Industry: {document_input.industry or 'General'}, "
                f"Scale: {document_input.company_scale.value}"
            )

            # Perform risk analysis
            result = await risk_analysis_engine.analyze_document(document_input)

            # Log successful analysis
            logger.info(
                f"Risk analysis completed successfully - "
                f"Risks found: {result.risk_summary.total_risks}, "
                f"Processing time: {result.processing_time}s, "
                f"Overall score: {result.risk_summary.overall_risk_score}"
            )

            return result

        except ValueError as e:
            logger.error(f"Risk analysis validation error: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Analysis failed due to invalid input: {str(e)}",
            )

        except RuntimeError as e:
            logger.error(f"Risk analysis runtime error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Analysis failed due to system error: {str(e)}",
            )

        except Exception as e:
            logger.error(f"Unexpected error during risk analysis: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred during analysis",
            )

    @staticmethod
    async def get_analysis_stats() -> Dict[str, Any]:
        """Get analysis statistics and system info"""
        try:
            # Get system health for context
            health_data = await risk_analysis_engine.health_check()

            return {
                "system_status": health_data["status"],
                "supported_features": {
                    "document_types": ["meeting_transcript", "business_plan"],
                    "risk_categories": [
                        "market",
                        "operational",
                        "financial",
                        "regulatory",
                        "strategic",
                        "technology",
                        "legal",
                    ],
                    "analysis_capabilities": [
                        "Risk identification and scoring",
                        "Industry-specific analysis",
                        "Mitigation recommendations",
                        "Evidence extraction",
                        "Risk prioritization",
                    ],
                },
                "configuration": {
                    "max_risks_per_analysis": settings.DEFAULT_MAX_RISKS,
                    "min_risk_score_threshold": settings.DEFAULT_MIN_RISK_SCORE,
                    "model": settings.OPENAI_MODEL,
                    "max_document_length": settings.MAX_DOCUMENT_LENGTH,
                },
                "model_info": health_data.get("model_info", {}),
                "last_updated": health_data.get("timestamp"),
            }

        except Exception as e:
            logger.error(f"Failed to get analysis stats: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve analysis statistics",
            )
