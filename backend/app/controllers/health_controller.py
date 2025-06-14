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
            "version": settings.APP_VERSION,
            "status": "operational",
            "docs": "/docs" if settings.DEBUG else "disabled",
            "endpoints": {
                "health": "/health",
                "analyze_risk": "/api/v1/analyze-risk",
                "docs": "/docs" if settings.DEBUG else None,
            },
            "timestamp": time.time(),
        }

    @staticmethod
    async def get_health_status() -> Dict[str, Any]:
        """Get comprehensive health status"""
        try:
            logger.info("Performing health check")

            # Get engine health status
            health_data = await risk_analysis_engine.health_check()

            # Add additional system info
            health_data.update(
                {
                    "api_version": settings.APP_VERSION,
                    "environment": settings.ENVIRONMENT,
                    "model_config": {
                        "model": settings.OPENAI_MODEL,
                        "max_tokens": settings.OPENAI_MAX_TOKENS,
                        "temperature": settings.OPENAI_TEMPERATURE,
                    },
                    "limits": {
                        "max_document_length": settings.MAX_DOCUMENT_LENGTH,
                        "max_risks_per_analysis": settings.DEFAULT_MAX_RISKS,
                        "min_risk_score_threshold": settings.DEFAULT_MIN_RISK_SCORE,
                    },
                }
            )

            logger.info(f"Health check completed: {health_data['status']}")
            return health_data

        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": time.time(),
                "api_version": settings.APP_VERSION,
            }

    @staticmethod
    async def get_api_info() -> Dict[str, Any]:
        """Get detailed API information and configuration"""
        return {
            "api": {
                "title": settings.APP_NAME,
                "version": settings.APP_VERSION,
                "description": settings.APP_DESCRIPTION,
                "environment": settings.ENVIRONMENT,
            },
            "features": {
                "supported_documents": ["meeting_transcript", "business_plan"],
                "risk_categories": [
                    "market",
                    "operational",
                    "financial",
                    "regulatory",
                    "strategic",
                    "technology",
                    "legal",
                ],
                "risk_severities": ["low", "medium", "high", "critical"],
                "company_scales": ["startup", "sme", "enterprise"],
            },
            "limits": {
                "max_document_length": settings.MAX_DOCUMENT_LENGTH,
                "max_risks_per_analysis": settings.DEFAULT_MAX_RISKS,
                "min_risk_score_threshold": settings.DEFAULT_MIN_RISK_SCORE,
                "request_timeout": settings.OPENAI_TIMEOUT,
            },
            "model": {
                "provider": "OpenAI",
                "model": settings.OPENAI_MODEL,
                "max_tokens": settings.OPENAI_MAX_TOKENS,
                "temperature": settings.OPENAI_TEMPERATURE,
            },
        }
