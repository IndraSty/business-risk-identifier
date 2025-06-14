'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Download, FileDown, AlertTriangle, CheckCircle, XCircle, Loader2, BarChart3, PieChart, TrendingUp, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, HorizontalBarChart, Pie } from 'recharts';

// Mock API response data
const mockApiResponse = {
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

const COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e'
};

const CATEGORY_COLORS = {
  financial: '#3b82f6',
  market: '#8b5cf6',
  operational: '#10b981',
  compliance: '#f59e0b',
  technology: '#06b6d4'
};

export default function Demo() {
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [companySize, setCompanySize] = useState<string>('');
  const [documentType, setdocumentType] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleAnalyze = () => {
    if (!selectedFile || !industry || !companySize) {
      toast.error('Please complete all required fields!');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setShowResults(false);
    toast.success('Starting document analysis...');
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      setAnalysisProgress(100);
      toast.success('Analysis complete! 6 risks have been identified.');
    }, 3000);
  };

  const handleFileSelect = () => {
    setSelectedFile('meeting-transcript.pdf');
    toast.success('File selected successfully!');
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(mockApiResponse, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'risk-analysis-result.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('JSON file downloaded successfully!');
  };

  const handleExportPDF = () => {
    toast.success('PDF report exported successfully!');
  };

  const getRiskIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'low': return <CheckCircle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Prepare chart data
  const riskScoreData = mockApiResponse.identified_risk.map(risk => ({
    name: risk.title.substring(0, 20) + '...',
    score: risk.risk_score,
    category: risk.category
  }));

  const riskDistributionData = Object.entries(mockApiResponse.risk_summary.risk_distribution).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
    color: COLORS[key as keyof typeof COLORS]
  }));

  const categoryData = mockApiResponse.identified_risk.reduce((acc: any, risk) => {
    acc[risk.category] = (acc[risk.category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count: count,
    color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]
  }));

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
        ease: 'easeOut',
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
            Try the Risk Analysis Demo Instantly
            </motion.h2>
            <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
            Upload your business document and see how our AI identifies potential risks in seconds.
            </motion.p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Input Section */}
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
                  <label className="text-sm font-semibold text-gray-700">Browse Document</label>
                  <motion.div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag & drop file or click to upload</p>
                    <p className="text-sm text-gray-500">PDF, DOCX, TXT (max 10MB)</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={handleFileSelect}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Select Demo File
                    </Button>
                  </motion.div>
                  <AnimatePresence>
                    {selectedFile && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-800 font-medium">{selectedFile}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Industry Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Business Industry</label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose You're Business Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology & Software</SelectItem>
                      <SelectItem value="finance">Finance & Banking</SelectItem>
                      <SelectItem value="healthcare">Healthcare & Pharmaceuticals</SelectItem>
                      <SelectItem value="retail">Retail & E-commerce</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Document Type */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Document Type</label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting_transcript">Meeting Transcript</SelectItem>
                      <SelectItem value="business_plan">Business Plan</SelectItem>
                      <SelectItem value="financial_report">Financial Report</SelectItem>
                      <SelectItem value="project_proposal">Project Proposal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Size */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Company Size</label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose Company Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                      <SelectItem value="small">Small Business (11-50 employees)</SelectItem>
                      <SelectItem value="medium">Medium Enterprise (51-250 employees)</SelectItem>
                      <SelectItem value="large">Large Enterprise (250+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!selectedFile || !industry || !companySize || isAnalyzing}
                    className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isAnalyzing ? (
                      <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing... {Math.round(analysisProgress)}%
                      </>
                    ) : (
                      'Start Risk Analysis'
                    )}
                  </Button>
                </motion.div>

                {/* Progress Bar */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress Analisis</span>
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

          {/* Results Section */}
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
                        <p className="text-sm">Upload a document and click &quot;Start Risk Analysis&quot;</p>
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
                            <h3 className="text-lg font-bold text-gray-900">Analysis Summary</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {mockApiResponse.processing_time.toFixed(1)}s
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{mockApiResponse.risk_summary.total_risks}</div>
                            <div className="text-sm text-gray-600">Total Risks</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-red-600">{mockApiResponse.risk_summary.overall_risk_score}</div>
                            <div className="text-sm text-gray-600">Risk Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">{mockApiResponse.risk_summary.risk_distribution.critical + mockApiResponse.risk_summary.risk_distribution.high}</div>
                            <div className="text-sm text-gray-600">High Priority</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{mockApiResponse.document_analysis.document_length}</div>
                            <div className="text-sm text-gray-600">Chars Analyzed</div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Tabs for different views */}
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="charts">Visualization</TabsTrigger>
                          <TabsTrigger value="details">Risk Details</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                          {/* Risk Distribution Cards */}
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(mockApiResponse.risk_summary.risk_distribution).map(([severity, count]) => (
                              count > 0 && (
                                <motion.div
                                  key={severity}
                                  className={`p-4 rounded-xl border ${getRiskColor(severity)}`}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.4, duration: 0.3 }}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    {getRiskIcon(severity)}
                                    <span className="font-semibold capitalize">{severity}</span>
                                  </div>
                                  <div className="text-2xl font-bold">{count}</div>
                                    <div className="text-sm opacity-75">Risks</div>
                                </motion.div>
                              )
                            ))}
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
                              {mockApiResponse.risk_summary.key_concerns.map((concern, index) => (
                                <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                                  {concern}
                                </li>
                              ))}
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
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="w-4 h-4 rounded-full" 
                                      style={{ backgroundColor: item.color }}
                                    ></div>
                                    <span className="text-sm font-medium">{item.category}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="h-2 rounded-full" 
                                        style={{ 
                                          backgroundColor: item.color,
                                          width: `${(item.count / mockApiResponse.risk_summary.total_risks) * 100}%`
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-bold w-6">{item.count}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        </TabsContent>

                        <TabsContent value="details" className="space-y-3">
                          {mockApiResponse.identified_risk.map((risk, index) => (
                            <motion.div
                              key={risk.risk_id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${getRiskColor(risk.severity)} ${
                                selectedRisk === risk.risk_id ? 'ring-2 ring-blue-500' : ''
                              }`}
                              onClick={() => setSelectedRisk(selectedRisk === risk.risk_id ? null : risk.risk_id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {getRiskIcon(risk.severity)}
                                  <span className="font-semibold">{risk.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium capitalize">{risk.severity}</span>
                                  <span className="text-xs bg-white/50 px-2 py-1 rounded-full">{risk.risk_score}/10</span>
                                </div>
                              </div>
                              <p className="text-sm mb-2">{risk.description}</p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {risk.impact_areas.map((area, i) => (
                                  <span key={i} className="text-xs bg-white/30 px-2 py-1 rounded-full">
                                    {area}
                                  </span>
                                ))}
                              </div>
                              <AnimatePresence>
                                {selectedRisk === risk.risk_id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 pt-3 border-t border-current/20 space-y-3"
                                  >
                                    <div>
                                        <p className="text-sm font-medium mb-1">Context Evidence:</p>
                                      <p className="text-sm italic">{risk.context_evidence}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium mb-2">Mitigation Recommendations:</p>
                                      <ul className="text-sm space-y-1">
                                        {risk.mitigation_recommendations.map((rec, i) => (
                                          <li key={i} className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0"></div>
                                            {rec}
                                          </li>
                                        ))}
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
                        >
                          <FileDown className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}