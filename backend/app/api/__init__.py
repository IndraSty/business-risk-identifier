from fastapi import APIRouter

from .health_routes import router as health_router
from .risk_routes import router as risk_router

# Create main API router
api_router = APIRouter()

# Include all route modules
api_router.include_router(health_router)
api_router.include_router(risk_router)

# Export the main router
__all__ = ["api_router"]