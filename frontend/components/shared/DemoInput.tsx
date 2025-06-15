"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Copy,
  FileSearch,
  FileText,
  Loader2,
  BookTemplate as Template,
  Upload,
  X,
} from "lucide-react";

type DemoInputProps = {
  itemVariants?: any;
  templateContent?: string;
  isTemplateDialogOpen: boolean;
  setIsTemplateDialogOpen: (open: boolean) => void;
  handleCopyTemplate: () => void;
  handleFileInputChange: (event: any) => void;
  selectedFile?: File;
  isTextExtracted: boolean;
  isExtractingText: boolean;
  extractionProgress: number;
  handleExtractText: () => void;
  industry: string;
  fileInfo: {
    name: string;
    type: string;
    size: number;
    icon: string;
  };
  setIndustry: (value: string) => void;
  companySize: string;
  setCompanySize: (value: string) => void;
  documentType: string;
  setDocumentType: (value: string) => void;
  analyzeFocus: string;
  setAnalyzeFocus: (value: string) => void;
  handleAnalyze: () => void;
  isAnalyzing: boolean;
  analysisProgress: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleAreaClick: () => void;
  handleRemoveFile?: () => void;
  handleDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
};

const DemoInput: React.FC<DemoInputProps> = ({
  itemVariants,
  templateContent,
  isTemplateDialogOpen,
  setIsTemplateDialogOpen,
  handleCopyTemplate,
  handleFileInputChange,
  selectedFile,
  isTextExtracted,
  isExtractingText,
  extractionProgress,
  handleExtractText,
  industry,
  setIndustry,
  companySize,
  setCompanySize,
  documentType,
  setDocumentType,
  analyzeFocus,
  setAnalyzeFocus,
  handleAnalyze,
  isAnalyzing,
  analysisProgress,
  fileInputRef,
  handleAreaClick,
  handleDragOver,
  handleDrop,
  handleRemoveFile,
  fileInfo,
}) => {
  const allowedTypes = {
    "text/plain": ".txt",
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ".docx",
    "application/msword": ".doc",
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-900">
            Document Input & Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Select Document
              </label>
              <Dialog
                open={isTemplateDialogOpen}
                onOpenChange={setIsTemplateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Template className="w-3 h-3 mr-1" />
                    Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Business Document Template
                    </DialogTitle>
                    <DialogDescription>
                      Use this template as a guide to prepare your document for
                      analysis
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                        {templateContent}
                      </pre>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleCopyTemplate} className="flex-1">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Template
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsTemplateDialogOpen(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.docx,.doc"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isExtractingText}
            />

            {!selectedFile ? (
              <motion.div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  isExtractingText
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
                whileHover={!isExtractingText ? { scale: 1.02 } : {}}
                whileTap={!isExtractingText ? { scale: 0.98 } : {}}
                onClick={handleAreaClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2 font-medium">
                  Drag & drop file or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  PDF, DOCX, DOC, TXT (max 10MB)
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* File Info Display */}
                <div
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isExtractingText
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{fileInfo?.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">
                        {fileInfo?.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>
                          {allowedTypes[fileInfo?.type]?.toUpperCase()}
                        </span>
                        <span>{formatFileSize(fileInfo?.size)}</span>
                        {isTextExtracted && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            <span className="text-xs font-medium">
                              Extracted
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Remove Button */}
                    {!isExtractingText && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleRemoveFile}
                        className="p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Extract Text Button */}
                <motion.div
                  whileHover={
                    !isExtractingText && !isTextExtracted ? { scale: 1.02 } : {}
                  }
                  whileTap={
                    !isExtractingText && !isTextExtracted ? { scale: 0.98 } : {}
                  }
                >
                  <Button
                    onClick={handleExtractText}
                    disabled={isExtractingText || isTextExtracted}
                    className={`w-full py-3 font-semibold transition-all duration-200 ${
                      isTextExtracted
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    }`}
                  >
                    {isExtractingText ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Extracting... {Math.round(extractionProgress)}%
                      </>
                    ) : isTextExtracted ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Text Successfully Extracted
                      </>
                    ) : (
                      <>
                        <FileSearch className="w-4 h-4 mr-2" />
                        Extract Text from File
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Extraction Progress Bar */}
                <AnimatePresence>
                  {isExtractingText && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress Ekstraksi</span>
                        <span>{Math.round(extractionProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${extractionProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Extraction Success Info */}
                <AnimatePresence>
                  {isTextExtracted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Extraction successful! 1,297 characters found
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Document Type */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              Document Type <span className="text-red-500">*</span>
            </label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting_transcript">Meeting Transcript</SelectItem>
                <SelectItem value="business_plan">Business Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Industry Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              Industry Type <span className="text-red-500">*</span>
            </label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your business industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">
                  Technology & Software
                </SelectItem>
                <SelectItem value="finance">Finance & Banking</SelectItem>
                <SelectItem value="healthcare">
                  Healthcare & Pharmaceuticals
                </SelectItem>
                <SelectItem value="retail">Retail & E-commerce</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Company Size */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              Company Scale <span className="text-red-500">*</span>
            </label>
            <Select value={companySize} onValueChange={setCompanySize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">
                  Startup (1-10 employees)
                </SelectItem>
                <SelectItem value="small">
                  Small Business (11-50 employees)
                </SelectItem>
                <SelectItem value="medium">
                  Medium Enterprise (51-250 employees)
                </SelectItem>
                <SelectItem value="enterprise">
                  Large Enterprise (250+ employees)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Analysis Focus */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              Analysis Focus <span className="font-light">[Optional]</span>
            </label>
            <Select value={analyzeFocus} onValueChange={setAnalyzeFocus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select analyze focus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive risk assessment">
                  Comprehensive Risk Assessment
                </SelectItem>
                <SelectItem value="financial risk">Financial Risk</SelectItem>
                <SelectItem value="market & competitive risk">
                  Market & Competitive Risk
                </SelectItem>
                <SelectItem value="operational risk">
                  Operational Risk
                </SelectItem>
                <SelectItem value="technology & infrastructure risk">
                  Technology & Infrastructure Risk
                </SelectItem>
                <SelectItem value="regulatory & compliance risk">
                  Regulatory & Compliance Risk
                </SelectItem>
                <SelectItem value="strategic risk">Strategic Risk</SelectItem>
                <SelectItem value="human capital risk">
                  Human Capital Risk
                </SelectItem>
                <SelectItem value="reputational risk">
                  Reputational Risk
                </SelectItem>
                <SelectItem value="legal risk">Legal Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleAnalyze}
              disabled={
                !selectedFile ||
                !industry ||
                !companySize ||
                !isTextExtracted ||
                isAnalyzing
              }
              className={`w-full py-6 text-lg font-semibold transition-all duration-200 ${
                !selectedFile || !industry || !companySize || !isTextExtracted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing... {Math.round(analysisProgress)}%
                </>
              ) : (
                "Start Risk Analysis"
              )}
            </Button>
          </motion.div>

          {/* Analysis Progress Bar */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Analysis Progress</span>
                  <span>{Math.round(analysisProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DemoInput;
