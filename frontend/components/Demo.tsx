"use client";

import { useRef, useState } from "react";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { generatePDFReport } from "@/lib/pdfExport";
import { allowedTypes, mockApiResponse, templateContent } from "@/constants";
import DemoInput from "./shared/DemoInput";
import DemoResults from "./shared/DemoResults";
import { getFileIcon } from "@/lib/utils";
import { useRiskAnalysis } from "@/context/RiskAnalysisContext";
import { ApiRequest, ApiResponse, RiskData } from "@/types";

export default function Demo() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [industry, setIndustry] = useState<string>("");
  const [companySize, setCompanySize] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("");
  const [analyzeFocus, setAnalyzeFocus] = useState<string>("");
  const [analyzeData, setAnalyzeData] = useState<ApiResponse>();
  const [extractedText, setExtractedText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [isTextExtracted, setIsTextExtracted] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [fileInfo, setFileInfo] = useState({
    name: "",
    type: "",
    size: 0,
    icon: "",
  });
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const {
    error,
    extractDocument,
    analyzeDocumentWithFile,
    resetError,
    clearResults,
  } = useRiskAnalysis();

  const handleAnalyze = async () => {
    if (!selectedFile || !industry || !companySize || !isTextExtracted) {
      if (!isTextExtracted) {
        toast.error("Please extract text from the file first!");
      } else {
        toast.error("Please complete all required fields!");
      }
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setShowResults(false);
    toast.success("Starting document analysis...");

    // Start progress simulation
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          return prev; // Stop at 90% until API completes
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    try {
      // Prepare document data for API
      const documentData: ApiRequest = {
        industry,
        document_content: extractedText,
        document_type: documentType,
        analysis_focus: analyzeFocus,
        company_scale: companySize,
      };

      // Call the actual API
      const response = await analyzeDocumentWithFile(
        documentData,
        selectedFile
      );

      if (response) {
        // Complete the progress
        setAnalysisProgress(100);
        setShowResults(true);
        console.log("Results: ", response);
        setAnalyzeData(response);
        const riskCount = response.identified_risk?.length || 0;
        toast.success(
          `Analysis complete! ${riskCount} risk${riskCount !== 1 ? "s" : ""} ${
            riskCount === 1 ? "has" : "have"
          } been identified.`
        );
      } else {
        throw new Error("No response received from analysis service");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Analysis failed";
      toast.error(`Analysis failed: ${errorMessage}`);
      setShowResults(false);
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    }
  };

  const validateFile = (file: File) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return "File size must be less than 10MB";
    }

    // Check file type
    if (!allowedTypes[file.type]) {
      return "Only PDF, DOCX, DOC, and TXT files are allowed";
    }

    return null;
  };

  const handleFileSelect = (file) => {
    const validationError = validateFile(file);

    if (validationError) {
      toast.error(validationError);
      return;
    }
    setSelectedFile(file);
    setFileInfo({
      name: file.name,
      type: file.type,
      size: file.size,
      icon: getFileIcon(file.type),
    });
    setIsTextExtracted(false);
    setExtractionProgress(0);
    toast.success("File selected successfully!");
  };

  const handleAreaClick = () => {
    if (!isExtractingText) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (isExtractingText) return;

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    if (!isExtractingText) {
      setSelectedFile(undefined);
      setFileInfo({
        name: "",
        type: "",
        size: 0,
        icon: "",
      });
      setIsTextExtracted(false);
      clearResults();
      setExtractionProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExtractText = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    if (error) {
      resetError();
    }
    setIsExtractingText(true);
    setExtractionProgress(0);
    const loadingToastId = toast.loading(
      "Extracting text from the document..."
    );

    const extractionInterval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 90) {
          // Stop at 90%, let real API finish
          clearInterval(extractionInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const response = await extractDocument({ file: selectedFile });
      setExtractedText(response.extracted_text);
      setIsExtractingText(false);
      setIsTextExtracted(true);
      setExtractionProgress(100);
      clearInterval(extractionInterval);
      toast.dismiss(loadingToastId);
      const charCount = response.extracted_text.length || 0;
      toast.success(
        `Text extracted successfully! ${charCount.toLocaleString()} characters found.`
      );
    } catch (error) {
      clearInterval(extractionInterval);
      toast.dismiss(loadingToastId);

      toast.error("Failed to extract text from document");
    }
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(templateContent);
    toast.success("Template copied to clipboard!");
    setIsTemplateDialogOpen(false);
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(analyzeData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "risk-analysis-result.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    toast.success("JSON file downloaded successfully!");
  };

  const handleExportPDF = async () => {
    if (!analyzeData) {
      toast.error("No analysis data available to export.");
      return;
    }

    setIsExportingPDF(true);

    const pdfPromise = generatePDFReport(analyzeData).then((pdf) => {
      pdf.save(`risk-analysis-report-${fileInfo.name}.pdf`);
      return pdf;
    });

    toast.promise(pdfPromise, {
      loading: "Generating PDF report...",
      success: "PDF report exported successfully!",
      error: "Failed to export PDF. Please try again.",
    });

    try {
      await pdfPromise;
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="demo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Try the Business Risk Analysis Demo
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Upload your business document and see how our AI identifies
            potential risks in seconds
          </motion.p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Input Section */}
          <DemoInput
            analysisProgress={analysisProgress}
            companySize={companySize}
            extractionProgress={extractionProgress}
            handleAnalyze={handleAnalyze}
            handleCopyTemplate={handleCopyTemplate}
            handleExtractText={handleExtractText}
            handleFileInputChange={handleFileInputFileChange}
            handleAreaClick={handleAreaClick}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            fileInfo={fileInfo}
            handleRemoveFile={handleRemoveFile}
            fileInputRef={fileInputRef}
            industry={industry}
            isAnalyzing={isAnalyzing}
            isExtractingText={isExtractingText}
            isTemplateDialogOpen={isTemplateDialogOpen}
            isTextExtracted={isTextExtracted}
            setCompanySize={setCompanySize}
            documentType={documentType}
            setDocumentType={setDocumentType}
            setIndustry={setIndustry}
            setAnalyzeFocus={setAnalyzeFocus}
            analyzeFocus={analyzeFocus}
            setIsTemplateDialogOpen={setIsTemplateDialogOpen}
            itemVariants={itemVariants}
            selectedFile={selectedFile}
            templateContent={templateContent}
          />

          {/* Results Section */}
          <DemoResults
            analyzeData={analyzeData}
            handleDownloadJSON={handleDownloadJSON}
            handleExportPDF={handleExportPDF}
            isExportingPDF={isExportingPDF}
            showResults={showResults}
            itemVariants={itemVariants}
          />
        </motion.div>
      </div>
    </section>
  );
}
