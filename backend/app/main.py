from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.encoders import jsonable_encoder
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
    ],
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    # Startup
    logger.info("🚀 Business Risk Identifier API is starting up...")
    logger.info(f"🔧 Environment: {settings.ENVIRONMENT}")
    logger.info(
        f"🔑 OpenAI API configured: {'✅' if settings.OPENAI_API_KEY else '❌'}"
    )
    logger.info(f"🔐 API Key protection: {'✅' if settings.API_KEY_REQUIRED else '❌'}")

    yield

    # Shutdown
    logger.info("🛑 Business Risk Identifier API is shutting down...")


# Create FastAPI application instance
app = FastAPI(
    title="Business Risk Identifier API",
    description="""
    🎯 **Business Risk Identifier** - AI-powered business risk analysis tool
    
    Automatically analyze business documents to identify potential risks based on:
    - Industry context
    - Company scale  
    - Document type (meeting transcripts, business plans)
    
    ## Features
    - 🤖 AI-powered risk identification using OpenAI GPT
    - 📊 Structured risk analysis with categories and severity levels
    - 🎯 Industry-specific risk assessment
    - 📈 Risk scoring and mitigation recommendations
    - 🔍 Support for meeting transcripts and business plans
    
    ## Security
    - 🔐 API Key authentication for secure access
    - 🛡️ CORS protection and trusted host validation
    - 📝 Comprehensive request logging and monitoring
    
    ## Authentication
    All API endpoints (except health checks) require authentication:
    ```
    Authorization: Bearer YOUR_API_KEY
    ```
    - **Meeting Transcripts**: Board meetings, strategy sessions, project reviews
    - **Business Plans**: Strategic plans, project proposals, investment decks
    
    ## Risk Categories
    - Market & Competition
    - Operational & Process
    - Financial & Budget
    - Regulatory & Compliance
    - Strategic & Planning
    - Technology & IT
    - Legal & Contractual
    """,
    version="1.0.0",
    contact={
        "name": "Business Risk Identifier",
        "email": "support@businessrisk.id",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Trusted Host Middleware (Security)
if settings.ENVIRONMENT == "production":
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)


# Request Processing Time Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time to response headers."""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time, 4))
    return response


# Global Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with consistent error response format."""
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")

    error_response = ErrorResponse(error=f"HTTP {exc.status_code}", detail=exc.detail)

    return JSONResponse(
        status_code=exc.status_code, content=jsonable_encoder(error_response.dict())
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request validation errors."""
    logger.error(f"Validation Error: {exc.errors()}")

    errors = []
    for error in exc.errors():
        safe_error = error.copy()
        if "ctx" in safe_error and isinstance(safe_error["ctx"], dict):
            safe_error["ctx"] = {
                k: v.isoformat() if hasattr(v, "isoformat") else v
                for k, v in safe_error["ctx"].items()
            }
        errors.append(safe_error)

    error_response = ErrorResponse(
        error="Validation Error",
        detail=f"Request validation failed: {errors}",
    )

    return JSONResponse(
        status_code=422, content=jsonable_encoder(error_response.dict())
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle all other exceptions."""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)

    error_response = ErrorResponse(
        error="Internal Server Error",
        detail="An unexpected error occurred. Please try again later.",
    )

    return JSONResponse(
        status_code=500, content=jsonable_encoder(error_response.dict())
    )


# Include API routes with API key protection
app.include_router(api_router, dependencies=[Depends(verify_api_key)])


# Health check endpoint (additional simple one)
@app.get("/ping", include_in_schema=False)
async def ping():
    """Simple ping endpoint for basic health check."""
    return {"status": "pong", "timestamp": time.time()}


# Application info
@app.on_event("startup")
async def startup_event():
    """Log startup information."""
    logger.info("✅ Business Risk Identifier API successfully started")
    logger.info(f"📚 API Documentation available at: /docs")
    logger.info(f"🔗 ReDoc Documentation available at: /redoc")


if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if settings.ENVIRONMENT == "development" else False,
        log_level="info",
    )
