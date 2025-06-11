import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application configuration settings"""
    
    # OpenAI Configuration
    openai_api_key: str
    openai_model: str = "gpt-4o-mini"  # Using cheaper model for free tier
    openai_max_tokens: int = 2000
    openai_temperature: float = 0.3
    
    # API Configuration
    api_title: str = "Business Risk Identifier API"
    api_version: str = "1.0.0"
    api_description: str = "AI-powered business risk analysis from documents"
    
    # Application Configuration
    max_document_length: int = 50000  # Maximum characters in document
    default_max_risks: int = 10
    min_risk_score_threshold: float = 3.0
    
    # Rate Limiting (for free tier)
    max_requests_per_minute: int = 3
    request_timeout: int = 30
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        

# Global settings instance
settings = Settings()

# Validation function
def validate_settings():
    """Validate critical settings"""
    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY is required")
    
    if not settings.openai_api_key.startswith("sk-"):
        raise ValueError("Invalid OpenAI API key format")
    
    if settings.openai_temperature < 0 or settings.openai_temperature > 1:
        raise ValueError("OpenAI temperature must be between 0 and 1")
    
    print(f"✅ Settings validated successfully")
    print(f"🤖 Using OpenAI model: {settings.openai_model}")
    print(f"🌍 Environment: {settings.environment}")


# Initialize validation
try:
    validate_settings()
except Exception as e:
    print(f"❌ Settings validation failed: {e}")
    raise