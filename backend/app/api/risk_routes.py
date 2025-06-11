from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
import logging

from ..models.risk_model import DocumentInput, RiskAnalysisResponse, ErrorResponse
from ..controllers.risk_controller import RiskController

# Configure logging
logger = logging.getLogger(__name__)

# Create router instance
router = APIRouter(
    prefix="/api/v1",
    tags=["Risk Analysis"],
    responses={
        404: {"model": ErrorResponse, "description": "Not found"},
        422: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)

@router.post(
    "/analyze",
    response_model=RiskAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Document for Business Risks",
    description="Analyze business documents (meeting transcripts, business plans) to identify potential risks",
    response_description="Detailed risk analysis with identified risks, categories, and mitigation recommendations"
)
async def analyze_document_risks(document_input: DocumentInput):
    """Analyze document content for business risks."""
    try:
        logger.info(f"Starting risk analysis for document type: {document_input.document_type}")
        
        # validate input first
        validated_input = await RiskController.validate_document_input(document_input)
        
        # Perform risk analysis
        analysis_result = await RiskController.analyze_document_risks(validated_input)
        
        logger.info(f"Risk analysis completed. Found {analysis_result.risk_summary.total_risks} risks")
        return analysis_result
    
    except ValueError as ve:
        logger.error(f"Validation error during risk analysis: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Input validation failed: {str(ve)}"
        )
        
    except Exception as e:
        logger.error(f"Unexpected error during risk analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during risk analysis. Please try again."
        )
        
@router.post(
    "/validate",
    response_model=DocumentInput,
    status_code=status.HTTP_200_OK,
    summary="Validate Document Input",
    description="Validate document input parameters before analysis",
    response_description="Validated document input parameters"
)
async def validate_document_input(document_input: DocumentInput):
    """Validate document input parameters before analysis."""
    try:
        logger.info("Validating document input parameters")
        
        validated_input = await RiskController.validate_document_input(document_input)
        
        logger.info("Document input validation successful")
        return validated_input
    
    except ValueError as ve:
        logger.error(f"Document validation failed: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Validation failed: {str(ve)}"
        )
        
    except Exception as e:
        logger.error(f"Unexpected error during validation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during validation. Please try again."
        )
        
@router.get(
    "/stats",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
    summary="Get Analysis Statistics",
    description="Get general statistics about risk analysis performed",
    response_description="Statistics about risk analysis usage and patterns"
)
async def get_analysis_stats():
    """Get statistics about risk analysis usage."""
    try:
        logger.info("Retrieving analysis statistics")
        
        stats = await RiskController.get_analysis_stats()
        
        logger.info("Analysis statistics retrieved successfully")
        return stats
        
    except Exception as e:
        logger.error(f"Error retrieving analysis statistics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve analysis statistics. Please try again."
        )