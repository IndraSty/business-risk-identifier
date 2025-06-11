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
        
@router.get(
    "/health",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
    summary="Health Check",
    description="Check the health status of the Business Risk Identifier API and its dependencies",
    response_description="Detailed health status including API, database, and external service status"
)
async def get_health_status():
    """Get health status of the API and its dependencies."""
    try:
        logger.info("Performing health status check")
        
        health_status = await HealthController.get_health_status()
        
        # Check if any critical components are unhealthy
        if health_status.get("status") == "unhealthy":
            logger.warning("Health check indicates unhealthy status")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Service is currently unhealthy"
            )
        
        logger.info("Health check completed successfully")
        return health_status
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error during health check: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Health check failed. Please try again."
        )

@router.get(
    "/api/info",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
    summary="API Information",
    description="Get detailed information about the API including version, features, and usage guidelines",
    response_description="Comprehensive API information and documentation"
)
async def get_api_info():
    """Get detailed information about the API."""
    try:
        logger.info("Retrieving detailed API information")
        
        api_info = await HealthController.get_api_info()
        
        logger.info("API information retrieved successfully")
        return api_info
        
    except Exception as e:
        logger.error(f"Error retrieving API information: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve API information. Please try again."
        )