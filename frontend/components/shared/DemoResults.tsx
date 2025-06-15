"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Download,
  FileDown,
  FileText,
  Loader2,
  PieChart,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { CATEGORY_COLORS, COLORS } from "@/constants";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts";
import { Button } from "../ui/button";
import { ApiResponse } from "@/types";

interface DemoResultsProps {
  showResults: boolean;
  handleDownloadJSON: () => void;
  handleExportPDF: () => void;
  isExportingPDF: boolean;
  analyzeData: ApiResponse | undefined;
  itemVariants?: Variants | undefined;
}
const DemoResults: React.FC<DemoResultsProps> = (props) => {
  const {
    showResults,
    handleDownloadJSON,
    handleExportPDF,
    isExportingPDF,
    itemVariants,
    analyzeData,
  } = props;
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const getRiskIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-5 h-5" />;
      case "high":
        return <AlertTriangle className="w-5 h-5" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5" />;
      case "low":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Prepare chart data
  const riskScoreData = analyzeData?.identified_risk.map((risk) => ({
    name: risk.title.substring(0, 20) + "...",
    score: risk.risk_score,
    category: risk.category,
  }));

  const riskDistributionData = Object.entries(
    analyzeData?.risk_summary?.risk_distribution || {}
  ).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
    color: COLORS[key as keyof typeof COLORS],
  }));

  const categoryData = (analyzeData?.identified_risk || []).reduce(
    (acc: any, risk) => {
      acc[risk.category] = (acc[risk.category] || 0) + 1;
      return acc;
    },
    {}
  );

  const categoryChartData = Object.entries(categoryData).map(
    ([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count: count,
      color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS],
    })
  );
  return (
    <motion.div variants={itemVariants}>
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-900">
            Risk Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-gray-500"
              >
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Analysis results will appear here</p>
                <p className="text-sm">
                  Upload a document, extract text, and click &quot;Start Risk
                  Analysis&quot;
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Analysis Summary */}
                <motion.div
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Analysis Summary
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {analyzeData?.processing_time.toFixed(1)}s
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {analyzeData?.risk_summary.total_risks}
                      </div>
                      <div className="text-sm text-gray-600">Total Risks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {analyzeData?.risk_summary.overall_risk_score}
                      </div>
                      <div className="text-sm text-gray-600">Risk Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        {(analyzeData?.risk_summary?.risk_distribution
                          ?.critical || 0) +
                          (analyzeData?.risk_summary?.risk_distribution?.high ||
                            0)}
                      </div>
                      <div className="text-sm text-gray-600">High Priority</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {analyzeData?.document_analysis.document_length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Chars Analyzed
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tabs for different views */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="charts">Visualization</TabsTrigger>
                    <TabsTrigger value="details">Risk Details</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {/* Risk Distribution Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(
                        analyzeData?.risk_summary.risk_distribution
                      ).map(
                        ([severity, count]) =>
                          count > 0 && (
                            <motion.div
                              key={severity}
                              className={`p-4 rounded-xl border ${getRiskColor(
                                severity
                              )}`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4, duration: 0.3 }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {getRiskIcon(severity)}
                                <span className="font-semibold capitalize">
                                  {severity}
                                </span>
                              </div>
                              <div className="text-2xl font-bold">{count}</div>
                              <div className="text-sm opacity-75">Risks</div>
                            </motion.div>
                          )
                      )}
                    </div>

                    {/* Key Concerns */}
                    <motion.div
                      className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Key Concerns
                      </h4>
                      <ul className="space-y-2">
                        {analyzeData?.risk_summary.key_concerns.map(
                          (concern, index) => (
                            <li
                              key={index}
                              className="text-sm text-yellow-700 flex items-start gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                              {concern}
                            </li>
                          )
                        )}
                      </ul>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="charts" className="space-y-6">
                    {/* Risk Score Bar Chart */}
                    <motion.div
                      className="bg-white rounded-xl p-4 border"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Risk Score per Risk
                      </h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={riskScoreData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" fontSize={12} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="score" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </motion.div>

                    {/* Risk Distribution Pie Chart */}
                    <motion.div
                      className="bg-white rounded-xl p-4 border"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Risk Level Distribution
                      </h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsPieChart>
                          <Pie
                            data={riskDistributionData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {riskDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </motion.div>

                    {/* Category Distribution */}
                    <motion.div
                      className="bg-white rounded-xl p-4 border"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Risks per Category
                      </h4>
                      <div className="space-y-3">
                        {categoryChartData.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span className="text-sm font-medium">
                                {item.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    backgroundColor: item.color,
                                    width: `${
                                      (item.count /
                                        (analyzeData?.risk_summary.total_risks || 0)) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold w-6">
                                {item.count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-3">
                    {analyzeData?.identified_risk.map((risk, index) => (
                      <motion.div
                        key={risk.risk_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${getRiskColor(
                          risk.severity
                        )} ${
                          selectedRisk === risk.risk_id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedRisk(
                            selectedRisk === risk.risk_id ? null : risk.risk_id
                          )
                        }
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getRiskIcon(risk.severity)}
                            <span className="font-semibold">{risk.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium capitalize">
                              {risk.severity}
                            </span>
                            <span className="text-xs bg-white/50 px-2 py-1 rounded-full">
                              {risk.risk_score}/10
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mb-2">{risk.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {risk.impact_areas.map((area, i) => (
                            <span
                              key={i}
                              className="text-xs bg-white/30 px-2 py-1 rounded-full"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                        <AnimatePresence>
                          {selectedRisk === risk.risk_id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-current/20 space-y-3"
                            >
                              <div>
                                <p className="text-sm font-medium mb-1">
                                  Context Evidence:
                                </p>
                                <p className="text-sm italic">
                                  {risk.context_evidence}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  Mitigation Recommendations:
                                </p>
                                <ul className="text-sm space-y-1">
                                  {risk.mitigation_recommendations.map(
                                    (rec, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2"
                                      >
                                        <div className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0"></div>
                                        {rec}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>

                {/* Export Buttons */}
                <motion.div
                  className="flex gap-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleDownloadJSON}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download JSON
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleExportPDF}
                    disabled={isExportingPDF}
                  >
                    {isExportingPDF ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4 mr-2" />
                        Export PDF
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DemoResults;
