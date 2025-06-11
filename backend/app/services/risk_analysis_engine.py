import time
from datetime import datetime
from typing import Dict, Any, List
from collections import Counter
from loguru import logger

from app.models import (
    DocumentInput,
    RiskAnalysisResponse,
    DocumentAnalysis,
    IdentifiedRisk,
    RiskSummary,
    RiskDistribution,
    RiskCategory,
    RiskSeverity,
    RiskProbability,
)
from app.services.openai_service import openai_service
from app.config import settings


class RiskAnalysisEngine:
    """Main engine for comprehensive risk analysis"""

    def __init__(self):
        self.openai_service = openai_service

    async def analyze_documents(
        self, document_input: DocumentInput
    ) -> RiskAnalysisResponse:
        """Main method to perform complete risk analysis"""
        start_time = time.time()

        try:
            logger.info(
                f"Starting risk analysis for {document_input.document_type.value}"
            )

            # Step 1: Analyze document content
            ai_response = await self.openai_service.analyze_document_risks(
                document_input
            )

            # Step 2: Process AI response into structured analysis
            document_analysis = self._create_document_analysis(document_input)
            identified_risks = self._process_identified_risks(
                ai_response.get("identified_risks", [])
            )
            risk_summary = self._create_risk_summary(identified_risks, ai_response)

            # Step 3: Calculate processing time
            processing_time = time.time() - start_time

            # Step 4: Create final response object
            response = RiskAnalysisResponse(
                document_analysis=document_analysis,
                identified_risks=identified_risks,
                risk_summary=risk_summary,
                processing_time=processing_time,
            )

            logger.info(f"Risk analysis completed in {processing_time:.2f}s")
            return response

        except Exception as e:
            logger.error(f"Risk analysis failed: {e}")
            raise

    def _create_document_analysis(
        self, document_input: DocumentInput
    ) -> DocumentAnalysis:
        """Create a metadata analysis of the document"""
        return DocumentAnalysis(
            document_type=document_input.document_type,
            industry=document_input.industry,
            company_scale=document_input.company_scale,
            analysis_timestamp=datetime.now(),
            document_length=len(document_input.document_content),
        )

    def _process_identified_risks(
        self, raw_risk: List[Dict[str, Any]]
    ) -> List[IdentifiedRisk]:
        """Process and validate identified risks from AI response"""
        processed_risks = []

        for i, risk_data in enumerate(raw_risk):
            try:
                # Generate risk ID if not provided
                risk_id = risk_data.get("risk_id", f"RISK_{i+1:03d}")

                # Validate and map category
                category = self._map_risk_category(
                    risk_data.get("category", "operational")
                )

                # Validate and map severity/probability
                severity = self._map_risk_severity(risk_data.get("severity", "medium"))
                probability = self._map_risk_probability(
                    risk_data.get("probability", "medium")
                )

                # Calculate or validate risk score
                risk_score = self._calculate_risk_score(
                    risk_data.get("risk_score"), severity, probability
                )

                # Filter out Low-score risks
                if risk_score < settings.min_risk_score_threshold:
                    continue

                # Create IdentifiedRisk object
                risk = IdentifiedRisk(
                    risk_id=risk_id,
                    title=risk_data.get("title", "Unspecified Risk"),
                    description=risk_data.get("description", "No description provided"),
                    category=category,
                    severity=severity,
                    probability=probability,
                    risk_score=risk_score,
                    impact_areas=risk_data.get("impact_areas", []),
                    mitigation_recommendations=risk_data.get(
                        "mitigation_recommendations", []
                    ),
                    context_evidence=risk_data.get("context_evidence", "")[
                        :200
                    ],  # Limit length
                )

                processed_risks.append(risk)

            except Exception as e:
                logger.warning(f"Failed to process risk {i+1}: {e}")
                continue

        # Sort by risk score (highest first)
        processed_risks.sort(key=lambda x: x.risk_score, reverse=True)

        # limit to max risks
        return processed_risks[: settings.default_max_risks]

    def _create_risk_summary(
        self, risks: List[IdentifiedRisk], ai_response: Dict[str, Any]
    ) -> RiskSummary:
        """Create comprehensive risk summary"""
        if not risks:
            return RiskSummary(
                total_risks=0,
                risk_distribution=RiskDistribution(),
                top_categories=[],
                overall_risk_score=0.0,
                key_concerns=[],
            )

        # Calculate risk distribution
        severity_counts = Counter(risk.severity.value for risk in risks)
        risk_distribution = RiskDistribution(
            critical=severity_counts.get("critical", 0),
            high=severity_counts.get("high", 0),
            medium=severity_counts.get("medium", 0),
            low=severity_counts.get("low", 0),
        )

        # Get top categories
        category_counts = Counter(risk.category.value for risk in risks)
        top_categories = [cat for cat, _ in category_counts.most_common(3)]

        # Calculate overall risk score (weighted average)
        total_score = sum(risk.risk_score for risk in risks)
        overall_risk_score = total_score / len(risks) if risks else 0.0

        # Extract key concerns
        key_concerns = ai_response.get("key_concerns", [])
        if not key_concerns and risks:
            # Generate key concerns from top risks
            key_concerns = [risk.title for risk in risks[:3]]

        return RiskSummary(
            total_risks=len(risks),
            risk_distribution=risk_distribution,
            top_categories=top_categories,
            overall_risk_score=round(overall_risk_score, 1),
            key_concerns=key_concerns[:5],  # Limit to 5 key concerns
        )

    def _map_risk_category(self, category: str) -> RiskCategory:
        """Map string category to RiskCategory enum"""
        category_mapping = {
            "market": RiskCategory.MARKET,
            "operational": RiskCategory.OPERATIONAL,
            "financial": RiskCategory.FINANCIAL,
            "regulatory": RiskCategory.REGULATORY,
            "strategic": RiskCategory.STRATEGIC,
            "technology": RiskCategory.TECHNOLOGY,
            "legal": RiskCategory.LEGAL,
        }
        return category_mapping.get(category.lower(), RiskCategory.OPERATIONAL)

    def _map_risk_severity(self, severity: str) -> RiskSeverity:
        """Map string severity to RiskSeverity enum"""
        severity_mapping = {
            "low": RiskSeverity.LOW,
            "medium": RiskSeverity.MEDIUM,
            "high": RiskSeverity.HIGH,
            "critical": RiskSeverity.CRITICAL,
        }
        return severity_mapping.get(severity.lower(), RiskSeverity.MEDIUM)

    def _map_risk_probability(self, probability: str) -> RiskProbability:
        """Map string probability to RiskProbability enum"""
        probability_mapping = {
            "low": RiskProbability.LOW,
            "medium": RiskProbability.MEDIUM,
            "high": RiskProbability.HIGH,
        }
        return probability_mapping.get(probability.lower(), RiskProbability.MEDIUM)

    def _calculate_risk_score(
        self, provided_score: Any, severity: RiskSeverity, probability: RiskProbability
    ) -> float:
        """Calculate risk score if not provided or validate existing score"""
        if provided_score is not None:
            try:
                score = float(provided_score)
                if 0 <= score <= 10:
                    return round(score, 1)
            except (ValueError, TypeError):
                pass

        # Calculate score based on severity and probability
        severity_weights = {
            RiskSeverity.LOW: 2,
            RiskSeverity.MEDIUM: 5,
            RiskSeverity.HIGH: 8,
            RiskSeverity.CRITICAL: 10,
        }

        probability_weights = {
            RiskProbability.LOW: 0.3,
            RiskProbability.MEDIUM: 0.6,
            RiskProbability.HIGH: 0.9,
        }

        calculated_score = severity_weights[severity] * probability_weights[probability]
        return round(calculated_score, 1)

    async def health_check(self) -> Dict[str, Any]:
        """Health check for the risk analysis engine"""
        try:
            # Test OpenAI connection
            openai_status = await self.openai_service.validate_api_connection()

            return {
                "status": "healthy" if openai_status else "unhealthy",
                "openai_connection": openai_status,
                "model_info": self.openai_service.get_model_info(),
                "timestamp": datetime.now(),
            }
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {"status": "unhealthy", "error": str(e), "timestamp": datetime.now()}


# Global engine instance
risk_analysis_engine = RiskAnalysisEngine()
