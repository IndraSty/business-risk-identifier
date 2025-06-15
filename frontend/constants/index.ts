export const COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e'
};

export const CATEGORY_COLORS = {
  financial: '#3b82f6',
  market: '#8b5cf6',
  operational: '#10b981',
  compliance: '#f59e0b',
  technology: '#06b6d4'
};

export const allowedTypes = {
    'text/plain': '.txt',
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/msword': '.doc'
  };

export const templateContent = `📄 Example Template: Business Meeting Transcript

Meeting Transcript
Company: PT. RISKSIGHT AI
Date: June 12, 2024
Participants:
• Reza (CEO)
• Lita (CTO)
• Dimas (CFO)
• Maya (Product Lead)

Agenda:
• Financial Condition
• Market Competition
• Technology Infrastructure Readiness
• HR and Product Development

Discussion:

Reza:
"We only have about 4 months of runway left if we don't get additional funding. We need to find new investors quickly or look for other monetization strategies."

Dimas:
"Yes, our cash flow has declined since Q1. And operational costs have increased with the recent hiring."

Lita:
"There is a potential bottleneck in the development team. We're short on people for several key features."

Maya:
"A competitor from Singapore just launched a similar product with advanced analytics features. They're starting to take our market share in the retail sector."

Reza:
"We also need to think about how to ensure our backend system can handle if user growth doubles."

Additional Notes:
• No legal framework yet for local data compliance regulations.
• High dependency on one senior engineer for all deployments.

📝 Use a document like this so the AI can optimally identify potential business risks.`;

// Mock API response data
export const mockApiResponse = {
  document_analysis: {
    document_type: "meeting_transcript",
    industry: "technology",
    company_scale: "sme",
    analysis_timestamp: "2025-01-13T11:08:11.838962",
    document_length: 1297
  },
  identified_risk: [
    {
      risk_id: "RISK_001",
      title: "Insufficient Operational Runway",
      description: "Current funding only covers 4 months of operations with no confirmed additional funding sources, creating liquidity risk and potential business discontinuity.",
      category: "financial",
      severity: "critical",
      probability: "high",
      risk_score: 9,
      impact_areas: ["cash flow", "business continuity", "employee retention"],
      mitigation_recommendations: [
        "Accelerate investor outreach with updated financial projections",
        "Implement immediate cost optimization measures",
        "Develop contingency plans for extended runway scenarios"
      ],
      context_evidence: "Pendanaan saat ini cukup untuk 4 bulan operasional. Diperlukan investor tambahan atau strategi monetisasi baru."
    },
    {
      risk_id: "RISK_002",
      title: "Intensified Market Competition",
      description: "Emerging competition from established corporations entering the data analytics space threatens market share and pricing power.",
      category: "market",
      severity: "high",
      probability: "high",
      risk_score: 8.4,
      impact_areas: ["market positioning", "revenue streams", "client retention"],
      mitigation_recommendations: [
        "Differentiate through specialized financial analytics offerings",
        "Accelerate product roadmap implementation",
        "Enhance client success programs to improve retention"
      ],
      context_evidence: "Persaingan semakin ketat dari perusahaan besar yang mulai masuk ke pasar serupa."
    },
    {
      risk_id: "RISK_003",
      title: "Technical Resource Constraints",
      description: "Development delays in core features due to understaffing threaten product roadmap execution and client deliverables.",
      category: "operational",
      severity: "high",
      probability: "high",
      risk_score: 8.1,
      impact_areas: ["product development", "client satisfaction", "technical debt"],
      mitigation_recommendations: [
        "Prioritize hiring for critical engineering roles",
        "Implement agile resource allocation processes",
        "Explore strategic outsourcing for non-core functions"
      ],
      context_evidence: "Tim teknis mengalami keterlambatan dalam pengembangan fitur utama karena keterbatasan SDM."
    },
    {
      risk_id: "RISK_004",
      title: "Regulatory Compliance Gap",
      description: "Lack of comprehensive compliance framework for data protection regulations may impact enterprise client acquisition.",
      category: "compliance",
      severity: "medium",
      probability: "medium",
      risk_score: 6.5,
      impact_areas: ["client acquisition", "legal exposure", "market expansion"],
      mitigation_recommendations: [
        "Engage compliance consultant for framework development",
        "Implement data governance policies",
        "Obtain relevant certifications (ISO 27001, SOC 2)"
      ],
      context_evidence: "Belum ada framework compliance yang komprehensif untuk regulasi perlindungan data."
    },
    {
      risk_id: "RISK_005",
      title: "Key Personnel Dependency",
      description: "Over-reliance on key technical personnel creates single points of failure in critical business operations.",
      category: "operational",
      severity: "medium",
      probability: "medium",
      risk_score: 5.8,
      impact_areas: ["knowledge management", "business continuity", "team scalability"],
      mitigation_recommendations: [
        "Implement knowledge documentation processes",
        "Cross-train team members on critical systems",
        "Develop succession planning for key roles"
      ],
      context_evidence: "Ketergantungan tinggi pada beberapa personel kunci dalam operasional bisnis."
    },
    {
      risk_id: "RISK_006",
      title: "Technology Infrastructure Scalability",
      description: "Current infrastructure may not support projected growth in user base and data processing requirements.",
      category: "technology",
      severity: "medium",
      probability: "medium",
      risk_score: 5.2,
      impact_areas: ["system performance", "user experience", "operational costs"],
      mitigation_recommendations: [
        "Conduct infrastructure capacity planning",
        "Implement cloud-native scaling solutions",
        "Establish performance monitoring and alerting"
      ],
      context_evidence: "Infrastruktur saat ini mungkin tidak mendukung pertumbuhan yang diproyeksikan."
    }
  ],
  risk_summary: {
    total_risks: 6,
    risk_distribution: {
      critical: 1,
      high: 2,
      medium: 3,
      low: 0
    },
    top_categories: ["financial", "market", "operational"],
    overall_risk_score: 7.0,
    key_concerns: [
      "Immediate liquidity crisis requiring urgent funding solutions",
      "Capacity to maintain competitive differentiation against larger players",
      "Compliance infrastructure scalability for enterprise client demands"
    ]
  },
  processing_time: 32.26
};