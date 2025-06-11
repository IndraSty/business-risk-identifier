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
                
            # Check minimum content length
            if len(document_input.document_content.strip()) < 50:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Document content too short. Minimum length: 50 characters"
                )
            
            # validate content quality (basic check)
            if document_input.document_content.strip().count(' ') < 10:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Document content appears to be incomplete or invalid"
                )
                
            logger.info(f"Document validation passed: {document_input.document_type.value}, "
                       f"Length: {len(document_input.document_content)} chars")
            
            return document_input
        
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Document validation error: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Document validation failed: {str(e)}"
            )
            
    
    @staticmethod
    async def analyze_document_risks(document_input: DocumentInput) -> RiskAnalysisResponse:
        """Main method to analyze document for risks"""
        try:
            # Log analysis start
            logger.info(f"Starting risk analysis - Type: {document_input.document_type.value}, "
                       f"Industry: {document_input.industry or 'General'}, "
                       f"Scale: {document_input.company_scale.value}")
            
            # Perform risk analysis
            result = await risk_analysis_engine.analyze_document(document_input)
            
            # Log successful analysis
            logger.info(f"Risk analysis completed successfully - "
                       f"Risks found: {result.risk_summary.total_risks}, "
                       f"Processing time: {result.processing_time}s, "
                       f"Overall score: {result.risk_summary.overall_risk_score}")
            
            return result
        
        except ValueError as e:
            logger.error(f"Risk analysis validation error: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Analysis failed due to invalid input: {str(e)}"
            )
            
        except RuntimeError as e:
            logger.error(f"Risk analysis runtime error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Analysis failed due to system error: {str(e)}"
            )
            
        except Exception as e:
            logger.error(f"Unexpected error during risk analysis: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred during analysis"
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
                        "market", "operational", "financial",
                        "regulatory", "strategic", "technology", "legal"
                    ],
                    "analysis_capabilities": [
                        "Risk identification and scoring",
                        "Industry-specific analysis",
                        "Mitigation recommendations",
                        "Evidence extraction",
                        "Risk prioritization"
                    ]
                },
                "configuration": {
                    "max_risks_per_analysis": settings.default_max_risks,
                    "min_risk_score_threshold": settings.min_risk_score_threshold,
                    "model": settings.openai_model,
                    "max_document_length": settings.max_document_length
                },
                "model_info": health_data.get("model_info", {}),
                "last_updated": health_data.get("timestamp")
            }
            
        except Exception as e:
            logger.error(f"Failed to get analysis stats: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve analysis statistics"
            )