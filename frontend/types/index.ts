export interface RiskData {
  risk_id: string;
  title: string;
  description: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  probability: string;
  risk_score: number;
  impact_areas: string[];
  mitigation_recommendations: string[];
  context_evidence: string;
}

export type ApiRequest = {
  document_content: string;
  document_type: string;
  industry: string;
  company_scale: string;
  analysis_focus: string;
  file_data?: string;
  file_type?: string;
  filename?: string;
};

export interface ApiResponse {
  document_analysis: {
    document_type: string;
    industry: string;
    company_scale: string;
    analysis_timestamp: string;
    document_length: number;
  };
  identified_risk: RiskData[];
  risk_summary: {
    total_risks: number;
    risk_distribution: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    top_categories: string[];
    overall_risk_score: number;
    key_concerns: string[];
  };
  processing_time: number;
}

export interface AnalysisState {
  selectedFile: string;
  industry: string;
  companySize: string;
  isAnalyzing: boolean;
  showResults: boolean;
  selectedRisk: string | null;
  analysisProgress: number;
  activeTab: string;
  isExportingPDF: boolean;
  isExtractingText: boolean;
  isTextExtracted: boolean;
  extractionProgress: number;
  isTemplateDialogOpen: boolean;
  apiResponse: ApiResponse | null;
}

export type ExtractedTextResponse = {
  success: boolean;
  filename: string;
  file_type: string;
  file_size_mb: number;
  processing_time_ms: number;
  extracted_text: string;
  text_length: number;
  word_count: number;
  line_count: number;
  error_message: string;
};

export type UploadFileRequest = {
  file: File;
  max_size_mb?: number;
};
