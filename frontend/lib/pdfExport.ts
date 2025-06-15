import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ApiResponse } from '@/types';

export const generatePDFReport = async (data: ApiResponse) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number, fontSize: number = 10) => {
    pdf.setFontSize(fontSize);
    return pdf.splitTextToSize(text, maxWidth);
  };

  // Title
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Risk Analysis Report', margin, yPosition);
  yPosition += 15;

  // Generated timestamp
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  pdf.text(`Generated on: ${currentDate}`, margin, yPosition);
  yPosition += 15;

  // Summary Section
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Summary', margin, yPosition);
  yPosition += 10;

  // Summary box
  const summaryBoxHeight = 40;
  pdf.setDrawColor(200, 200, 200);
  pdf.setFillColor(248, 249, 250);
  pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, summaryBoxHeight, 3, 3, 'FD');

  // Summary metrics in grid
  const metricsY = yPosition + 8;
  const colWidth = (pageWidth - 2 * margin) / 4;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);

  // Processing time (top right)
  pdf.text(`${Math.round(data.processing_time)} sec`, pageWidth - margin - 30, metricsY);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text('Processing Time', pageWidth - margin - 30, metricsY + 5);

  // Metrics row
  const metrics = [
    { value: data.risk_summary.total_risks.toString(), label: 'Total Risks' },
    { value: data.risk_summary.overall_risk_score.toString(), label: 'Avg. Risk Score' },
    { value: (data.risk_summary.risk_distribution.critical + data.risk_summary.risk_distribution.high).toString(), label: 'High Priority' },
    { value: data.document_analysis.document_length.toString(), label: 'Characters Analyzed' }
  ];

  metrics.forEach((metric, index) => {
    const x = margin + 10 + (index * colWidth);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(metric.value, x, metricsY + 15);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(metric.label, x, metricsY + 22);
  });

  yPosition += summaryBoxHeight + 20;

  // Risk Score Chart Section
  checkPageBreak(60);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Risk Score per Risiko', margin, yPosition);
  yPosition += 15;

  // Simple bar chart representation
  const chartHeight = 40;
  const chartWidth = pageWidth - 2 * margin;
  const maxScore = Math.max(...data.identified_risk.map(r => r.risk_score));
  
  data.identified_risk.forEach((risk, index) => {
    const barHeight = (risk.risk_score / maxScore) * chartHeight;
    const barWidth = chartWidth / data.identified_risk.length - 5;
    const x = margin + (index * (barWidth + 5));
    const y = yPosition + chartHeight - barHeight;
    
    // Bar color based on severity
    const colors = {
      critical: [239, 68, 68],
      high: [249, 115, 22],
      medium: [234, 179, 8],
      low: [34, 197, 94]
    };
    const color = colors[risk.severity as keyof typeof colors] || [156, 163, 175];
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.rect(x, y, barWidth, barHeight, 'F');
    
    // Risk score label
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.text(risk.risk_score.toString(), x + barWidth/2 - 3, y - 2);
    
    // Risk title (truncated) - FIXED: Removed angle parameter to make text horizontal
    const truncatedTitle = risk.title.length > 15 ? risk.title.substring(0, 12) + '...' : risk.title;
    pdf.text(truncatedTitle, x + barWidth/2, yPosition + chartHeight + 8, { 
      align: 'center',
      maxWidth: barWidth 
    });
  });

  yPosition += chartHeight + 25;

  // Risk Distribution Pie Chart (simplified as text)
  checkPageBreak(30);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Risk Distribution', margin, yPosition);
  yPosition += 10;

  Object.entries(data.risk_summary.risk_distribution).forEach(([severity, count]) => {
    if (count > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const percentage = ((count / data.risk_summary.total_risks) * 100).toFixed(1);
      pdf.text(`${severity.charAt(0).toUpperCase() + severity.slice(1)}: ${count} (${percentage}%)`, margin + 10, yPosition);
      yPosition += 6;
    }
  });

  yPosition += 15;

  // Identified Risks Section
  checkPageBreak(20);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Identified Risks', margin, yPosition);
  yPosition += 15;

  data.identified_risk.forEach((risk, index) => {
    checkPageBreak(80);
    
    // Risk title with severity
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    
    // Severity color
    const severityColors = {
      critical: [239, 68, 68],
      high: [249, 115, 22],
      medium: [234, 179, 8],
      low: [34, 197, 94]
    };
    const severityColor = severityColors[risk.severity as keyof typeof severityColors] || [0, 0, 0];
    
    pdf.setTextColor(0, 0, 0);
    pdf.text(risk.title, margin, yPosition);
    
    // Severity badge
    pdf.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
    pdf.setFontSize(10);
    pdf.text(risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1), pageWidth - margin - 30, yPosition);
    
    yPosition += 8;

    // Description
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    const descriptionLines = wrapText(risk.description, pageWidth - 2 * margin - 20);
    descriptionLines.forEach((line: string) => {
      pdf.text(line, margin + 10, yPosition);
      yPosition += 5;
    });
    yPosition += 3;

    // Context Evidence
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Context Evidence:', margin + 10, yPosition);
    yPosition += 5;
    
    pdf.setFont('helvetica', 'italic');
    const contextLines = wrapText(risk.context_evidence, pageWidth - 2 * margin - 20, 9);
    contextLines.forEach((line: string) => {
      pdf.text(line, margin + 10, yPosition);
      yPosition += 4;
    });
    yPosition += 5;

    // Mitigation Recommendations
    pdf.setFont('helvetica', 'bold');
    pdf.text('Mitigation Recommendations:', margin + 10, yPosition);
    yPosition += 5;
    
    pdf.setFont('helvetica', 'normal');
    risk.mitigation_recommendations.forEach((rec) => {
      const recLines = wrapText(`• ${rec}`, pageWidth - 2 * margin - 20, 9);
      recLines.forEach((line: string) => {
        pdf.text(line, margin + 10, yPosition);
        yPosition += 4;
      });
      yPosition += 2;
    });

    yPosition += 10;
  });

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
    pdf.text('Generated by RiskSight AI', margin, pageHeight - 10);
  }

  return pdf;
};