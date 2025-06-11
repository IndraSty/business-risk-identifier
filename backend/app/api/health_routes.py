from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
import logging

from ..controllers.health_controller import HealthController
from ..models.risk_model import ErrorResponse

# Configure logging
logger = logging.getLogger(__name__)

# Create router instance
router = APIRouter(
    tags=["Health & Info"],
    responses={
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)

@router.get(
    "/",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
    summary="Root Information",
    description="Get basic information about the Business Risk Identifier API",
    response_description="Basic API information and welcome message"
)
async def get_root_info():
    """Get root API information."""
    try:
        logger.info("Retrieving root API information")
        
        root_info = await HealthController.get_root_info()
        
        logger.info("Root information retrieved successfully")
        return root_info
        
    except Exception as e:
        logger.error(f"Error retrieving root information: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve API information. Please try again."
        )