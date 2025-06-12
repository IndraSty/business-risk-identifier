from pydantic import BaseSettings, Field, validator
from typing import List, Optional
import secrets
import os
from pathlib import Path

class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # Application Info
    APP_NAME: str = "Business Risk Identifier API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=True, env="DEBUG")
    
    # API Security
    API_KEY: str = Field(
        default_factory=lambda: secrets.token_urlsafe(32),
        env="API_KEY",
        description="API key for authenticating requests"
    )
    API_KEY_REQUIRED: bool = Field(default=True, env="API_KEY_REQUIRED")
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = Field(..., env="OPENAI_API_KEY")
    OPENAI_MODEL: str = Field(default="gpt-4", env="OPENAI_MODEL")
    OPENAI_MAX_TOKENS: int = Field(default=2000, env="OPENAI_MAX_TOKENS")
    OPENAI_TEMPERATURE: float = Field(default=0.3, env="OPENAI_TEMPERATURE")
    OPENAI_TIMEOUT: int = Field(default=60, env="OPENAI_TIMEOUT")
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = Field(
        default=["*"],
        env="ALLOWED_ORIGINS",
        description="List of allowed origins for CORS"
    )
    ALLOWED_HOSTS: List[str] = Field(
        default=["*"],
        env="ALLOWED_HOSTS",
        description="List of allowed hosts for production"
    )
    
    # Rate Limiting (for future implementation)
    RATE_LIMIT_PER_MINUTE: int = Field(default=60, env="RATE_LIMIT_PER_MINUTE")
    
    # Analysis Configuration
    DEFAULT_MAX_RISKS: int = Field(default=10, env="DEFAULT_MAX_RISKS")
    DEFAULT_MIN_RISK_SCORE: float = Field(default=3.0, env="DEFAULT_MIN_RISK_SCORE")
    MAX_DOCUMENT_LENGTH: int = Field(default=50000, env="MAX_DOCUMENT_LENGTH")
    
    # Logging Configuration
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    LOG_FORMAT: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        env="LOG_FORMAT"
    )
    
    # Database Configuration (for future implementation)
    DATABASE_URL: Optional[str] = Field(default=None, env="DATABASE_URL")
    REDIS_URL: Optional[str] = Field(default=None, env="REDIS_URL")
    
    # File Upload Configuration
    MAX_UPLOAD_SIZE: int = Field(default=10_000_000, env="MAX_UPLOAD_SIZE")  # 10MB
    ALLOWED_FILE_TYPES: List[str] = Field(
        default=["txt", "pdf", "docx"],
        env="ALLOWED_FILE_TYPES"
    )
    
    @validator("ENVIRONMENT")
    def validate_environment(cls, v):
        """Validate environment setting."""
        allowed_envs = ["development", "staging", "production"]
        if v not in allowed_envs:
            raise ValueError(f"Environment must be one of: {allowed_envs}")
        return v
    
    @validator("OPENAI_TEMPERATURE")
    def validate_temperature(cls, v):
        """Validate OpenAI temperature setting."""
        if not 0.0 <= v <= 1.0:
            raise ValueError("OpenAI temperature must be between 0.0 and 1.0")
        return v
    
    @validator("DEFAULT_MIN_RISK_SCORE")
    def validate_min_risk_score(cls, v):
        """Validate minimum risk score."""
        if not 0.0 <= v <= 10.0:
            raise ValueError("Minimum risk score must be between 0.0 and 10.0")
        return v
    
    @validator("ALLOWED_ORIGINS", pre=True)
    def parse_allowed_origins(cls, v):
        """Parse allowed origins from string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    @validator("ALLOWED_HOSTS", pre=True)
    def parse_allowed_hosts(cls, v):
        """Parse allowed hosts from string or list."""
        if isinstance(v, str):
            return [host.strip() for host in v.split(",")]
        return v
    
    @validator("ALLOWED_FILE_TYPES", pre=True)
    def parse_file_types(cls, v):
        """Parse allowed file types from string or list."""
        if isinstance(v, str):
            return [file_type.strip() for file_type in v.split(",")]
        return v
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.ENVIRONMENT == "development"
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.ENVIRONMENT == "production"
    
    @property
    def openai_config(self) -> dict:
        """Get OpenAI configuration as dictionary."""
        return {
            "api_key": self.OPENAI_API_KEY,
            "model": self.OPENAI_MODEL,
            "max_tokens": self.OPENAI_MAX_TOKENS,
            "temperature": self.OPENAI_TEMPERATURE,
            "timeout": self.OPENAI_TIMEOUT
        }
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        
        # Example values for documentation
        schema_extra = {
            "example": {
                "ENVIRONMENT": "development",
                "API_KEY": "your-secure-api-key-here",
                "OPENAI_API_KEY": "sk-your-openai-api-key-here",
                "OPENAI_MODEL": "gpt-4",
                "ALLOWED_ORIGINS": "http://localhost:3000,https://yourdomain.com",
                "RATE_LIMIT_PER_MINUTE": 60,
                "DEFAULT_MAX_RISKS": 10
            }
        }

# Create settings instance
settings = Settings()

# Export commonly used configurations
__all__ = ["settings", "Settings"]