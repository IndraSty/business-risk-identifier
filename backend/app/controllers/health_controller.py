import time
from typing import Any, Dict
from loguru import logger

from app.config import settings
from app.services import risk_analysis_engine

class HealthController:
    """Controller for health check endpoints"""
    
    @staticmethod
    async def get_root_info() -> Dict[str, Any]:
        """Get basic API information"""
        return {
            "message": "Business Risk Identifier API",
            "version": settings.api_version,
            "status": "operational",
            "docs": "/docs" if settings.debug else "disabled",
            "endpoints": {
                "health": "/health",
                "analyze_risk": "/api/v1/analyze-risk",
                "docs": "/docs" if settings.debug else None
            },
            "timestamp": time.time()
        }
        
    @staticmethod
    async def get_health_status() -> Dict[str, Any]:
        """Get comprehensive health status"""
        try:
            logger.info("Performing health check")
            
            # Get engine health status
            health_data = await risk_analysis_engine.health_check()
            
            # Add additional system info
            health_data.update({
                "api_version": settings.api_version,
                "environment": settings.environment,
                "model_config": {
                    "model": settings.openai_model,
                    "max_tokens": settings.openai_max_tokens,
                    "temperature": settings.openai_temperature
                },
                "limits": {
                    "max_document_length": settings.max_document_length,
                    "max_risks_per_analysis": settings.default_max_risks,
                    "min_risk_score_threshold": settings.min_risk_score_threshold
                }
            })
            
            logger.info(f"Health check completed: {health_data['status']}")
            return health_data
        
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": time.time(),
                "api_version": settings.api_version
            }
            
    @staticmethod
    async def get_api_info() -> Dict[str, Any]:
        """Get detailed API information and configuration"""
        return {
            "api": {
                "title": settings.api_title,
                "version": settings.api_version,
                "description": settings.api_description,
                "environment": settings.environment
            },
            "features": {
                "supported_documents": ["meeting_transcript", "business_plan"],
                "risk_categories": [
                    "market", "operational", "financial", 
                    "regulatory", "strategic", "technology", "legal"
                ],
                "risk_severities": ["low", "medium", "high", "critical"],
                "company_scales": ["startup", "sme", "enterprise"]
            },
            "limits": {
                "max_document_length": settings.max_document_length,
                "max_risks_per_analysis": settings.default_max_risks,
                "min_risk_score_threshold": settings.min_risk_score_threshold,
                "request_timeout": settings.request_timeout
            },
            "model": {
                "provider": "OpenAI",
                "model": settings.openai_model,
                "max_tokens": settings.openai_max_tokens,
                "temperature": settings.openai_temperature
            }
        }