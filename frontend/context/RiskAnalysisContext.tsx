"use client";

import { RiskAnalyzeService } from "@/services/risk_analyze_service";
import {
  ApiRequest,
  ApiResponse,
  ExtractedTextResponse,
  RiskData,
  UploadFileRequest,
} from "@/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

type WorkflowStage =
  | "idle"
  | "extracting"
  | "extracted"
  | "analyzing"
  | "analyzed";

interface RiskAnalysisState {
  isLoading: boolean;
  error: string | null;
  workflowStage: WorkflowStage;
  extractedText: ExtractedTextResponse | null;
  analysisData: ApiResponse | null;
  risks: RiskData[];
}

interface RiskAnalysisContextType extends RiskAnalysisState {
  analyzeDocument: (request: ApiRequest) => Promise<ApiResponse | undefined>;
  extractDocument: (request: UploadFileRequest) => Promise<ExtractedTextResponse>;
  analyzeDocumentWithFile: (
    documentData: Omit<ApiRequest, "file_data" | "file_type" | "filename">,
    file: File
  ) => Promise<ApiResponse | undefined>;
  clearResults: () => void;
  resetError: () => void;
  isExtracting: boolean;
  hasExtractedText: boolean;
  isAnalyzing: boolean;
  hasAnalysisResult: boolean;
  canAnalyze: boolean;
}

const RiskAnalysisContext = createContext<RiskAnalysisContextType | undefined>(
  undefined
);

interface RiskAnalysisProviderProps {
  children: ReactNode;
}

export const RiskAnalysisProvider: React.FC<RiskAnalysisProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<RiskAnalysisState>({
    isLoading: false,
    error: null,
    workflowStage: "idle",
    extractedText: null,
    analysisData: null,
    risks: [],
  });

  const extractDocument = async (
    request: UploadFileRequest
  ): Promise<ExtractedTextResponse> => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      workflowStage: "extracting",
      analysisData: null,
      risks: [],
    }));

    try {
      const response = await RiskAnalyzeService.ExtractTextFile(request);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        workflowStage: "extracted",
        extractedText: response,
        error: null,
      }));
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        workflowStage: "idle",
        error: errorMessage,
        extractedText: null,
        analysisData: null,
        risks: [],
      }));

      throw error;
    }
  };

  const analyzeDocument = async (request: ApiRequest): Promise<ApiResponse | undefined> => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      workflowStage: "analyzing",
      extractedText: null,
    }));

    try {
      const response = await RiskAnalyzeService.analyzeDocument(request);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        workflowStage: "analyzed",
        analysisData: response,
        risks: response.identified_risk,
        error: null,
      }));
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        workflowStage: "idle",
        error: errorMessage,
        analysisData: null,
        risks: [],
      }));
      return undefined;
    }
  };

  const analyzeDocumentWithFile = async (
    documentData: Omit<ApiRequest, "file_data" | "file_type" | "filename">,
    file: File
  ): Promise<ApiResponse | undefined> => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      workflowStage: "analyzing",
      extractedText: null,
    }));

    try {
      const response = await RiskAnalyzeService.analyzeDocumentWithFile(
        documentData,
        file
      );
      setState((prev) => ({
        ...prev,
        isLoading: false,
        workflowStage: "analyzed",
        analysisData: response,
        risks: response.identified_risk,
        error: null,
      }));
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        workflowStage: "idle",
        error: errorMessage,
        analysisData: null,
        risks: [],
      }));
    }
  };

  const clearResults = (): void => {
    setState({
      isLoading: false,
      error: null,
      workflowStage: "idle",
      extractedText: null,
      analysisData: null,
      risks: [],
    });
  };

  const resetError = (): void => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const value: RiskAnalysisContextType = {
    ...state,
    analyzeDocument,
    analyzeDocumentWithFile,
    extractDocument,
    clearResults,
    resetError,
    isExtracting: state.workflowStage === "extracting",
    hasExtractedText:
      state.workflowStage === "extracted" || state.workflowStage === "analyzed",
    isAnalyzing: state.workflowStage === "analyzing",
    hasAnalysisResult: state.workflowStage === "analyzed",
    canAnalyze:
      state.extractedText !== null &&
      state.workflowStage !== "analyzing" &&
      state.workflowStage !== "extracting",
  };

  return (
    <RiskAnalysisContext.Provider value={value}>
      {children}
    </RiskAnalysisContext.Provider>
  );
};

export const useRiskAnalysis = (): RiskAnalysisContextType => {
  const context = useContext(RiskAnalysisContext);
  if (context === undefined) {
    throw new Error(
      "useRiskAnalysis must be used within a RiskAnalysisProvider"
    );
  }
  return context;
};
