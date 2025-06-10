import json
import asyncio
from typing import Dict, Any, Optional
from openai import AsyncOpenAI
from loguru import logger

from app.config import settings
from app.models import (
    DocumentInput,
    RiskAnalysisResponse,
    DocumentType,
    CompanyScale
)

class OpenAIService:
    """Service for OpenAI API integration and risk analysis"""
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
        self.max_tokens = settings.openai_max_tokens
        self.temperature = settings.openai_temperature
        
    def _build_system_prompt(self) -> str:
        """Build comprehensive system prompt for risk analysis"""
        return """You are an expert business risk analyst with deep knowledge across multiple industries. Your task is to analyze business documents and identify potential risks with high accuracy and actionable insights.

ANALYSIS FRAMEWORK:
- Consider industry-specific risks and market dynamics
- Evaluate operational, financial, strategic, regulatory, and market risks
- Assess probability and impact based on document evidence
- Provide specific, actionable mitigation strategies

RISK SCORING METHODOLOGY:
- Risk Score = (Probability × Impact × Urgency) / 10
- Scale: 0-10 (0=negligible, 10=critical/immediate action required)
- Consider both quantitative and qualitative factors

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON format
- Include specific evidence quotes from the document
- Provide concrete, implementable recommendations
- Focus on most significant risks (minimum score: 3.0)

RESPONSE FORMAT:
{
    "identified_risks": [
        {
            "risk_id": "RISK_001",
            "title": "Concise Risk Title",
            "description": "Detailed risk description with context",
            "category": "market|operational|financial|regulatory|strategic|technology|legal",
            "severity": "low|medium|high|critical",
            "probability": "low|medium|high", 
            "risk_score": 7.5,
            "impact_areas": ["specific area 1", "specific area 2"],
            "mitigation_recommendations": ["specific action 1", "specific action 2"],
            "context_evidence": "Direct quote from document"
        }
    ],
    "key_concerns": ["primary concern 1", "primary concern 2"],
    "industry_insights": "Industry-specific risk considerations"
}"""

    def _build_user_prompt(self, document_input: DocumentInput) -> str:
        """Build user prompt with document context"""
        prompt = f"""
DOCUMENT ANALYSIS REQUEST:

Document Type: {document_input.document_type.value}
Industry Context: {document_input.industry or 'General Business'}
Company Scale: {document_input.company_scale.value}
Analysis Focus: {document_input.analysis_focus or 'Comprehensive risk assessment'}

DOCUMENT CONTENT:
{document_input.document_content}

SPECIFIC INSTRUCTIONS:
1. Identify TOP {settings.default_max_risks} most significant risks
2. Focus on risks with score ≥ {settings.min_risk_score_threshold}
3. Prioritize {document_input.document_type.value.replace('_', ' ')} specific risks
4. Consider {document_input.company_scale.value} company challenges
"""

        if document_input.industry:
            prompt += f"5. Apply {document_input.industry} industry risk patterns\n"
        
        if document_input.analysis_focus:
            prompt += f"6. Emphasize: {document_input.analysis_focus}\n"

        prompt += "\nProvide analysis in the specified JSON format only."
        
        return prompt