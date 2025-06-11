from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import logging
import time
from typing import Dict, Any
import uvicorn

from .api import api_router
from .config.settings import settings
from .models.risk_model import ErrorResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
    ]
)
logger = logging.getLogger(__name__)

# Security Configuration
security = HTTPBearer()

async def verify_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verify API key from Authorization header.
    """
    if not settings.API_KEY_REQUIRED:
        return True
        
    if not credentials or not credentials.credentials:
        logger.warning("Missing API key in request")
        raise HTTPException(
            status_code=401,
            detail="API key is required. Please provide valid API key in Authorization header.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if credentials.credentials != settings.API_KEY:
        logger.warning(f"Invalid API key attempted: {credentials.credentials[:8]}...")
        raise HTTPException(
            status_code=401,
            detail="Invalid API key. Please check your API key and try again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return True