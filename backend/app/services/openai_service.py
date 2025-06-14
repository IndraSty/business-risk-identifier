import json
import asyncio
from typing import Dict, Any, Optional
from openai import OpenAI
from loguru import logger

from app.config import settings
from app.models import DocumentInput, RiskAnalysisResponse, DocumentType, CompanyScale
from .file_processing_service import FileProcessorService


class OpenAIService:
    """Service for OpenAI API integration and risk analysis"""

    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENAI_API_KEY,
            timeout=settings.OPENAI_TIMEOUT,
        )
        self.model = settings.OPENAI_MODEL
        self.max_tokens = settings.OPENAI_MAX_TOKENS
        self.temperature = settings.OPENAI_TEMPERATURE
        self.timeout = settings.OPENAI_TIMEOUT
        self.file_processor = FileProcessorService()

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

    def _process_document_input(self, document_input: DocumentInput) -> str:
        """Process document input and extract text content, return text string"""
        try:
            # If file data is provided, extract text from file
            if document_input.file_data and document_input.file_type:
                logger.info(
                    f"Processing uploaded file: {document_input.filename or 'unnamed'}"
                )

                # Validate file size (optional)
                if not self.file_processor.validate_file_size(
                    document_input.file_data, max_size_mb=10
                ):
                    raise ValueError("File size exceeds 10MB limit")

                # Extract text from file
                extracted_text = self.file_processor.extract_text_from_base64(
                    document_input.file_data,
                    document_input.file_type.value,
                    document_input.filename,
                )

                logger.info(
                    f"Successfully extracted {len(extracted_text)} characters from file"
                )

                # Update document_input with extracted content for future reference
                document_input.document_content = extracted_text

                return extracted_text

            # If no file, use existing document content
            elif document_input.document_content:
                return document_input.document_content

            # No content or file provided
            else:
                raise ValueError("No document content or file data provided")

        except Exception as e:
            logger.error(f"Error processing document input: {e}")
            raise

    def _build_user_prompt(
        self, document_input: DocumentInput, document_content: str
    ) -> str:
        """Build user prompt with document context"""
        prompt = f"""
    DOCUMENT ANALYSIS REQUEST:

    Document Type: {document_input.document_type.value}
    Industry Context: {document_input.industry or 'General Business'}
    Company Scale: {document_input.company_scale.value if document_input.company_scale else 'SME'}
    Analysis Focus: {document_input.analysis_focus or 'Comprehensive risk assessment'}
    """

        # Add file information if provided
        if document_input.filename and document_input.file_type:
            prompt += f"Source File: {document_input.filename} ({document_input.file_type.value.upper()})\n"

        prompt += f"""
    DOCUMENT CONTENT:
    {document_content}

    SPECIFIC INSTRUCTIONS:
    1. Identify TOP {settings.DEFAULT_MAX_RISKS} most significant risks
    2. Focus on risks with score ≥ {settings.DEFAULT_MIN_RISK_SCORE}
    3. Prioritize {document_input.document_type.value.replace('_', ' ')} specific risks
    4. Consider {document_input.company_scale.value if document_input.company_scale else 'SME'} company challenges
    """

        if document_input.industry:
            prompt += f"5. Apply {document_input.industry} industry risk patterns\n"

        if document_input.analysis_focus:
            prompt += f"6. Emphasize: {document_input.analysis_focus}\n"

        prompt += "\nProvide analysis in the specified JSON format only."

        return prompt

    def analyze_document_risks(self, document_input: DocumentInput) -> Dict[str, Any]:
        """Main method to analyze document and identify risks"""
        try:
            logger.info(
                f"Starting risk analysis for document type: {document_input.document_type.value}, "
                f"industry: {document_input.industry}, "
                f"scale: {document_input.company_scale.value if document_input.company_scale else 'SME'}, "
                f"has_file: {bool(document_input.file_data)}"
            )

            # Process document input (extract text from file if needed)
            document_content = self._process_document_input(document_input)

            # Validate content length
            if len(document_content.strip()) < 50:
                raise ValueError("Document content must be at least 50 characters long")

            # Build prompts
            system_prompt = self._build_system_prompt()
            user_prompt = self._build_user_prompt(document_input, document_content)

            # Call DeepSeek API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                response_format={"type": "json_object"},
            )

            # Parse Response
            content = response.choices[0].message.content
            risk_data = json.loads(content)

            logger.info(
                f"Successfully analyzed document, found {len(risk_data.get('identified_risks', []))} risks"
            )

            return risk_data

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse DeepSeek JSON response: {e}")
            raise ValueError("Invalid JSON response from AI model")

        except Exception as e:
            logger.error(f"DeepSeek API error: {e}")
            raise RuntimeError(f"Risk analysis failed: {str(e)}")

    async def validate_api_connection(self) -> bool:
        """Test DeepSeek API connection"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "Test connection"}],
                max_tokens=10,
            )
            logger.info("✅ DeepSeek API connection successful")
            return True
        except Exception as e:
            logger.error(f"❌ DeepSeek API connection failed: {e}")
            return False

    def get_model_info(self) -> Dict[str, Any]:
        """Get current model configuration"""
        return {
            "provider": "DeepSeek",
            "model": self.model,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "api_configured": bool(getattr(settings, "DEEPSEEK_API_KEY", None)),
        }


# Global service instance
openai_service = OpenAIService()
