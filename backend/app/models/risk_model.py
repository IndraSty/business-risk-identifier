from datetime import datetime
from typing import Optional, List, Dict
from enum import Enum
from pydantic import BaseModel, Field, field_validator, model_validator
import io
import base64


class DocumentType(str, Enum):
    # Enum for document types
    MEETING_TRANSCRIPT = "meeting_transcript"
    BUSINESS_PLAN = "business_plan"


class CompanyScale(str, Enum):
    # Enum for company scale
    STARTUP = "startup"
    SMALL = "small"
    MEDIUM = "medium"
    ENTERPRISE = "enterprise"


class RiskCategory(str, Enum):
    # Enum for risk categories
    MARKET = "market"
    OPERATIONAL = "operational"
    FINANCIAL = "financial"
    REGULATORY = "regulatory"
    STRATEGIC = "strategic"
    TECHNOLOGY = "technology"
    LEGAL = "legal"


class RiskSeverity(str, Enum):
    # Enum for risk severity
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RiskProbability(str, Enum):
    # Enum for risk probability
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


# Input Models
class FileType(str, Enum):
    PDF = "pdf"
    TXT = "txt"
    DOCX = "docx"
    DOC = "doc"


class DocumentInput(BaseModel):
    # Existing fields
    document_content: Optional[str] = Field(
        None,
        min_length=50,
        description="Content of the document to be analyzed (optional if file_data provided)",
    )
    document_type: DocumentType = Field(
        ...,
        description="Type of the document being analyzed",
    )
    industry: Optional[str] = Field(
        None,
        description="Industry context for risk analysis",
    )
    company_scale: Optional[CompanyScale] = Field(
        ...,
        description="Scale/size of the company for risk analysis",
    )
    analysis_focus: Optional[str] = Field(
        None,
        description="Specific focus area for risk analysis, e.g., 'financial risks', 'operational risks'",
    )

    file_data: Optional[str] = Field(
        None,
        description="Base64 encoded file content (optional if document_content provided)",
    )
    file_type: Optional[FileType] = Field(
        None,
        description="Type of uploaded file",
    )
    filename: Optional[str] = Field(
        None,
        description="Original filename",
    )

    @field_validator("document_content")
    def validate_content(cls, v):
        if v and len(v.strip()) < 50:
            raise ValueError("Document content must be at least 50 characters long.")
        return v.strip() if v else v

    @field_validator("file_type", mode="before")
    def validate_file_type(cls, v):
        """Convert empty string to None for file_type"""
        if v == "":
            return None
        return v

    @field_validator("file_data", mode="before")
    def validate_file_data(cls, v):
        """Convert empty string to None for file_data"""
        if v == "":
            return None
        return v

    @field_validator("filename", mode="before")
    def validate_filename(cls, v):
        """Convert empty string to None for filename"""
        if v == "":
            return None
        return v

    @model_validator(mode="after")
    def validate_content_or_file(self):
        """Ensure either document_content or file_data is provided"""
        values = dict(self)
        document_content = values.get("document_content")
        file_data = values.get("file_data")
        file_type = values.get("file_type")

        if not document_content and not file_data:
            raise ValueError("Either document_content or file_data must be provided")

        if file_data and not file_type:
            raise ValueError("file_type must be specified when file_data is provided")

        return self

    # class Config:
    #     use_enum_values = True


# Output Models
class DocumentAnalysis(BaseModel):
    # Model for document analysis metadata
    document_type: DocumentType
    industry: Optional[str] = None
    company_scale: CompanyScale
    analysis_timestamp: datetime = Field(default_factory=datetime.now)
    document_length: int = Field(
        description="Number of characters in the document content"
    )


class IdentifiedRisk(BaseModel):
    # Model for individual risk identification
    risk_id: str = Field(
        ...,
        description="Unique identifier for the identified risk",
    )
    title: str = Field(
        ...,
        min_length=5,
        max_length=100,
        description="Title of the identified risk",
    )
    description: str = Field(
        ...,
        min_length=20,
        max_length=500,
        description="Detailed description of the identified risk",
    )
    category: RiskCategory = Field(
        ...,
        description="Category classification of the identified risk",
    )
    severity: RiskSeverity = Field(
        ...,
        description="Severity level of the identified risk",
    )
    probability: RiskProbability = Field(
        ...,
        description="Probability of occurrence of the identified risk",
    )
    risk_score: float = Field(
        ...,
        ge=0.0,
        le=10.0,
        description="Calculated risk score (0-10)",
    )
    impact_areas: list[str] = Field(
        default_factory=list, description="Areas that would be impacted by this risk"
    )
    mitigation_recommendations: List[str] = Field(
        default_factory=list,
        description="Recommendations for mitigating the identified risk",
    )
    context_evidence: Optional[str] = Field(
        None,
        max_length=200,
        description="Quote or evidence from document supporting this risk",
    )

    @field_validator("risk_score")
    def validate_risk_score(cls, v):
        return round(v, 1)  # Round to 1 decimal place


class RiskDistribution(BaseModel):
    # model for risk distribution statistics by severity
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0


class RiskSummary(BaseModel):
    # model for risk summary statistics
    total_risks: int = Field(
        ge=0,
        description="Total number of identified risks",
    )
    risk_distribution: RiskDistribution
    top_categories: List[str] = Field(
        default_factory=list, description="Most common risk categories"
    )
    overall_risk_score: float = Field(
        ge=0.0, le=10.0, description="Overall risk score for the document"
    )
    key_concerns: list[str] = Field(
        default_factory=list, description="Key areas of concern identified"
    )

    @field_validator("overall_risk_score")
    def validate_overall_score(cls, v):
        return round(v, 1)


class RiskAnalysisResponse(BaseModel):
    # Main response model for risk analysis
    document_analysis: DocumentAnalysis
    identified_risk: List[IdentifiedRisk] = Field(default_factory=list)
    risk_summary: RiskSummary
    processing_time: Optional[float] = Field(
        None, description="Time taken to process the analysis in seconds"
    )


# Error Models
class ErrorResponse(BaseModel):
    # Model for error responses
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)


# Configuration Model
class AnalysisConfig(BaseModel):
    # Configuration for risk analysis
    max_risks: int = Field(default=10, ge=1, le=20)
    min_risk_score: float = Field(default=3.0, ge=0.0, le=10.0)
    include_evidence: bool = Field(default=True)
    detailed_mitigation: bool = Field(default=True)
