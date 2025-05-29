import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Divider,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import InfoIcon from '@mui/icons-material/Info';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ProjectInfo {
  // Section 1: Basic Project Information
  projectDuration: string;
  projectType: string;
  hasCyberLegalTeam: string;
  companyScale: string;
  projectPhase: string;

  // Section 2: Project Structure
  layer1Teams: string;
  layer2Teams: string;
  layer3Teams: string;
  layer4Teams: string;
  layer5Teams: string;
  layer6Teams: string;
  layer7Teams: string;
  layer8Teams: string;
  teamOverlap: string;

  // Section 3: Technical Factors
  hasITTeam: string;
  devicesWithFirewall: string;
  networkType: string;
  phishingFailRate: string;

  // Section 4: Security Practices
  governanceLevel: string;
  allowPasswordReuse: string;
  usesMFA: string;

  // Additional fields
  regulatoryRequirements: string;
  stakeholderCount: string;
  thirdPartyVendors: string;
  remoteWorkLevel: string;
  cloudServices: string;
  dataClassification: string;
  bmsIntegration: string;
  accessControl: string;
  securityMonitoring: string;
  incidentResponse: string;
  backupStrategy: string;
  securityCertifications: string;
  securityAwareness: string;
  securityTeamSize: string;
  thirdPartySecurityReq: string;
  securityBudget: string;
}

interface RiskAnalysis {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

interface RiskResults {
  ransomware: RiskAnalysis;
  phishing: RiskAnalysis;
  dataBreach: RiskAnalysis;
  insiderAttack: RiskAnalysis;
  supplyChain: RiskAnalysis;
}

interface AutoTableUserOptions {
  startY: number;
  head: string[][];
  body: (string | number)[][];
  theme: string;
  styles: { fontSize: number };
  headStyles: { fillColor: number[] };
  columnStyles?: { [key: number]: { cellWidth: number } };
}

interface ExtendedJsPDF extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const RiskQuantification = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0); // -1 for left, 1 for right
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectDuration: '', projectType: '', hasCyberLegalTeam: '', companyScale: '', projectPhase: '',
    layer1Teams: '', layer2Teams: '', layer3Teams: '', layer4Teams: '', layer5Teams: '', layer6Teams: '',
    layer7Teams: '', layer8Teams: '', teamOverlap: '', hasITTeam: '', devicesWithFirewall: '', networkType: '',
    phishingFailRate: '', governanceLevel: '', allowPasswordReuse: '', usesMFA: '',
    regulatoryRequirements: '', stakeholderCount: '', thirdPartyVendors: '', remoteWorkLevel: '',
    cloudServices: '', dataClassification: '', bmsIntegration: '', accessControl: '',
    securityMonitoring: '', incidentResponse: '', backupStrategy: '', securityCertifications: '',
    securityAwareness: '', securityTeamSize: '', thirdPartySecurityReq: '', securityBudget: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [riskResults, setRiskResults] = useState<RiskResults>({
    ransomware: {
      score: 65,
      level: 'high',
      recommendations: [
        'Implement regular backup procedures',
        'Deploy advanced endpoint protection',
        'Conduct regular security awareness training'
      ]
    },
    phishing: {
      score: 45,
      level: 'medium',
      recommendations: [
        'Implement email filtering solutions',
        'Enhance security awareness training',
        'Deploy multi-factor authentication'
      ]
    },
    dataBreach: {
      score: 75,
      level: 'high',
      recommendations: [
        'Implement data encryption at rest and in transit',
        'Enhance access control mechanisms',
        'Regular security audits and monitoring'
      ]
    },
    insiderAttack: {
      score: 35,
      level: 'medium',
      recommendations: [
        'Implement user behavior analytics',
        'Enhance access control and monitoring',
        'Regular security training for employees'
      ]
    },
    supplyChain: {
      score: 85,
      level: 'critical',
      recommendations: [
        'Implement vendor risk assessment program',
        'Enhance supply chain security controls',
        'Regular security audits of third-party vendors'
      ]
    }
  });

  const sections = ['Basic Info', 'Structure', 'Technical', 'Security'];
  const sectionDescriptions = [
    'General project information and organizational context',
    'Team structure and organizational hierarchy analysis',
    'Technical infrastructure and security measures assessment',
    'Security policies and authentication practices evaluation'
  ];

  const generateRandomRisk = (): RiskAnalysis => {
    const score = Math.floor(Math.random() * 100);
    let level: 'low' | 'medium' | 'high' | 'critical';
    
    if (score <= 25) level = 'low';
    else if (score <= 50) level = 'medium';
    else if (score <= 75) level = 'high';
    else level = 'critical';

    return {
      score,
      level,
      recommendations: [] // Keep existing recommendations
    };
  };

  const updateRiskScores = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setRiskResults({
        ransomware: generateRandomRisk(),
        phishing: generateRandomRisk(),
        dataBreach: generateRandomRisk(),
        insiderAttack: generateRandomRisk(),
        supplyChain: generateRandomRisk()
      });
      setIsLoading(false);
    }, 600); // 0.6s delay for smooth animation
  };

  const handleInputChange = (field: keyof ProjectInfo) => (
    event: SelectChangeEvent<string>
  ) => {
    const updatedProjectInfo = {
      ...projectInfo,
      [field]: event.target.value,
    };
    setProjectInfo(updatedProjectInfo);
    
    // Only update risk scores if form is complete
    // We need to check completeness with the updated data
    const requiredFields = [
      'projectDuration', 'projectType', 'hasCyberLegalTeam', 'companyScale', 'projectPhase',
      'teamOverlap', 'hasITTeam', 'devicesWithFirewall', 'networkType', 'phishingFailRate',
      'governanceLevel', 'allowPasswordReuse', 'usesMFA'
    ];
    
    const basicFieldsComplete = requiredFields.every(field => 
      updatedProjectInfo[field as keyof ProjectInfo] && updatedProjectInfo[field as keyof ProjectInfo] !== ''
    );
    
    const hasAtLeastOneTeam = [1, 2, 3, 4, 5, 6, 7, 8].some(layer => {
      const value = updatedProjectInfo[`layer${layer}Teams` as keyof ProjectInfo];
      return value && value !== 'na' && value !== '';
    });
    
    if (basicFieldsComplete && hasAtLeastOneTeam) {
      updateRiskScores();
    }
  };

  const handleNext = () => {
    setSlideDirection(1);
    setActiveSection((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const handleBack = () => {
    setSlideDirection(-1);
    setActiveSection((prev) => Math.max(prev - 1, 0));
  };

  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'low':
        return '#4caf50';
      case 'medium':
        return '#ff9800';
      case 'high':
        return '#f44336';
      case 'critical':
        return '#d32f2f';
      default:
        return '#757575';
    }
  };

  const getRiskLevelColor = (level: string): 'success' | 'warning' | 'error' | 'info' => {
    switch (level) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
      case 'critical':
        return 'error';
      default:
        return 'info';
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircleIcon />;
      case 'medium':
        return <WarningIcon />;
      case 'high':
        return <ErrorIcon />;
      case 'critical':
        return <ErrorIcon />;
      default:
        return <SecurityIcon />;
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF() as ExtendedJsPDF;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Modern color palette
      const colors = {
        primary: [79, 70, 229] as [number, number, number], // Indigo
        primaryLight: [129, 140, 248] as [number, number, number],
        secondary: [71, 85, 105] as [number, number, number],
        accent: [16, 185, 129] as [number, number, number],
        success: [34, 197, 94] as [number, number, number],
        warning: [245, 158, 11] as [number, number, number],
        error: [239, 68, 68] as [number, number, number],
        critical: [185, 28, 28] as [number, number, number],
        text: [15, 23, 42] as [number, number, number],
        textLight: [100, 116, 139] as [number, number, number],
        background: [248, 250, 252] as [number, number, number],
        white: [255, 255, 255] as [number, number, number],
        gray: [226, 232, 240] as [number, number, number]
      };

      let currentY = margin;

      // Helper function to check if we need a new page
      const checkPageBreak = (neededSpace: number) => {
        if (currentY + neededSpace > pageHeight - 50) {
          doc.addPage();
          currentY = margin;
          return true;
        }
        return false;
      };

      // Modern header
      const addModernHeader = (title: string, subtitle?: string) => {
        checkPageBreak(70);
        
        // Header background
        doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.rect(0, currentY, pageWidth, 50, 'F');
        
        // Title
        doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin, currentY + 20);
        
        // Subtitle
        if (subtitle) {
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.text(subtitle, margin, currentY + 35);
        }
        
        currentY += 60;
      };

      // Section header
      const addSectionHeader = (text: string) => {
        checkPageBreak(35);
        
        // Section background
        doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
        doc.rect(margin, currentY, contentWidth, 25, 'F');
        
        // Accent line
        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.rect(margin, currentY, 4, 25, 'F');
        
        // Section text
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(text, margin + 15, currentY + 16);
        
        currentY += 35;
      };

      // Field row with modern styling
      const addFieldRow = (label: string, value: string, isHighlight = false) => {
        checkPageBreak(18);
        
        // Background for highlighted items
        if (isHighlight) {
          doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
          doc.rect(margin + 5, currentY - 2, contentWidth - 10, 14, 'F');
        }
        
        // Label
        doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(label.toUpperCase(), margin + 10, currentY + 8);
        
        // Value
        const displayValue = value || 'Not specified';
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Value background
        doc.setFillColor(colors.gray[0], colors.gray[1], colors.gray[2]);
        doc.rect(margin + 100, currentY + 1, contentWidth - 115, 10, 'F');
        doc.text(displayValue, margin + 105, currentY + 8);
        
        currentY += 18;
      };

      // Main Header
      addModernHeader(
        'CYBER RISK ASSESSMENT',
        'Comprehensive Security Analysis & Risk Evaluation Report'
      );

      // Executive Summary
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.rect(margin, currentY, contentWidth, 40, 'F');
      doc.setDrawColor(colors.gray[0], colors.gray[1], colors.gray[2]);
      doc.rect(margin, currentY, contentWidth, 40);
      
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('EXECUTIVE SUMMARY', margin + 10, currentY + 15);
      
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
      doc.text(`Report Generated: ${currentDate}`, margin + 10, currentY + 25);
      
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text('This assessment evaluates cybersecurity risks across organizational,', margin + 10, currentY + 32);
      doc.text('technical, and procedural domains.', margin + 10, currentY + 37);
      
      currentY += 50;

      // Project Overview Section
      addSectionHeader('PROJECT OVERVIEW');
      addFieldRow('Project Duration', projectInfo.projectDuration);
      addFieldRow('Project Type', projectInfo.projectType);
      addFieldRow('Current Phase', projectInfo.projectPhase);
      addFieldRow('Organization Size', projectInfo.companyScale, true);
      addFieldRow('Legal Team', projectInfo.hasCyberLegalTeam);

      // Organizational Structure Section
      addSectionHeader('ORGANIZATIONAL STRUCTURE');
      let hasTeamData = false;
      for (let i = 1; i <= 8; i++) {
        const value = projectInfo[`layer${i}Teams` as keyof ProjectInfo];
        if (value && value !== 'na') {
          addFieldRow(`Layer ${i} Teams`, value);
          hasTeamData = true;
        }
      }
      if (!hasTeamData) {
        doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
        doc.setFontSize(10);
        doc.text('No team structure data specified', margin + 10, currentY);
        currentY += 15;
      }
      if (projectInfo.teamOverlap) {
        addFieldRow('Team Overlap', projectInfo.teamOverlap, true);
      }

      // Technical Infrastructure Section
      addSectionHeader('TECHNICAL INFRASTRUCTURE');
      addFieldRow('IT Team', projectInfo.hasITTeam);
      addFieldRow('Network Architecture', projectInfo.networkType, true);
      addFieldRow('Firewall Coverage', projectInfo.devicesWithFirewall);
      addFieldRow('Phishing Resilience', projectInfo.phishingFailRate);

      // Security Practices Section
      addSectionHeader('SECURITY PRACTICES');
      addFieldRow('Governance Maturity', projectInfo.governanceLevel, true);
      addFieldRow('Multi-Factor Auth', projectInfo.usesMFA);
      addFieldRow('Password Policy', projectInfo.allowPasswordReuse);

      // Start Risk Analysis on new page
      doc.addPage();
      currentY = margin;

      // Risk Analysis Header
      addModernHeader('RISK ANALYSIS RESULTS', 'Detailed Security Risk Assessment');

      // Risk Score Overview
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.rect(margin, currentY, contentWidth, 30, 'F');
      doc.setDrawColor(colors.gray[0], colors.gray[1], colors.gray[2]);
      doc.rect(margin, currentY, contentWidth, 30);
      
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('RISK SCORE OVERVIEW', margin + 10, currentY + 20);
      
      currentY += 40;

      // Risk table header
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(margin, currentY, contentWidth, 15, 'F');
      
      doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Risk Category', margin + 10, currentY + 10);
      doc.text('Score', margin + 80, currentY + 10);
      doc.text('Level', margin + 120, currentY + 10);
      
      currentY += 20;

      // Risk rows
      Object.entries(riskResults).forEach(([risk, analysis], index) => {
        checkPageBreak(25);
        
        const riskColor = analysis.level === 'critical' ? colors.critical :
                         analysis.level === 'high' ? colors.error :
                         analysis.level === 'medium' ? colors.warning :
                         colors.success;
        
        // Row background
        const rowColor = index % 2 === 0 ? colors.background : colors.white;
        doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
        doc.rect(margin, currentY - 2, contentWidth, 18, 'F');
        
        // Risk category
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const riskName = risk.charAt(0).toUpperCase() + risk.slice(1).replace(/([A-Z])/g, ' $1');
        doc.text(riskName, margin + 10, currentY + 8);
        
        // Progress bar background
        const barWidth = 30;
        const barHeight = 8;
        const barX = margin + 80;
        const barY = currentY + 2;
        
        doc.setFillColor(colors.gray[0], colors.gray[1], colors.gray[2]);
        doc.rect(barX, barY, barWidth, barHeight, 'F');
        
        // Progress bar fill
        doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
        const fillWidth = (analysis.score / 100) * barWidth;
        doc.rect(barX, barY, fillWidth, barHeight, 'F');
        
        // Score text
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.setFontSize(8);
        doc.text(`${analysis.score}%`, barX, currentY + 14);
        
        // Risk level
        doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(analysis.level.toUpperCase(), margin + 120, currentY + 8);
        
        currentY += 20;
      });

      // Recommendations Section
      currentY += 20;
      addSectionHeader('STRATEGIC RECOMMENDATIONS');
      
      const recommendations = [
        { priority: 'HIGH', text: 'Implement Zero Trust Architecture', impact: 'Critical security enhancement' },
        { priority: 'HIGH', text: 'Deploy Advanced Threat Detection', impact: 'Real-time threat monitoring' },
        { priority: 'MED', text: 'Enhance Security Training Program', impact: 'Reduce human error risks' },
        { priority: 'MED', text: 'Regular Penetration Testing', impact: 'Proactive vulnerability assessment' },
        { priority: 'LOW', text: 'Update Incident Response Plan', impact: 'Improved crisis management' }
      ];

      recommendations.forEach((rec, index) => {
        checkPageBreak(20);
        
        const priorityColor = rec.priority === 'HIGH' ? colors.error :
                             rec.priority === 'MED' ? colors.warning : colors.accent;
        
        // Recommendation background
        doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
        doc.rect(margin + 5, currentY - 2, contentWidth - 10, 16, 'F');
        
        // Priority badge
        doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
        doc.rect(margin + 10, currentY + 2, 20, 8, 'F');
        doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(rec.priority, margin + 13, currentY + 7);
        
        // Recommendation text
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${rec.text}`, margin + 40, currentY + 6);
        
        // Impact description
        doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(rec.impact, margin + 40, currentY + 12);
        
        currentY += 20;
      });

      // Footer for all pages
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer background
        doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
        doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
        
        // Footer content
        doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        
        // Company branding
        doc.setFont('helvetica', 'bold');
        doc.text('CYBER RISK DASHBOARD', margin, pageHeight - 12);
        
        // Page number (centered)
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2 - 10,
          pageHeight - 12
        );
        
        // Date (right)
        doc.text(
          new Date().toLocaleDateString(), 
          pageWidth - margin - 30, 
          pageHeight - 12
        );
        
        // Decorative line
        doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.setLineWidth(1);
        doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
      }

      // Save the PDF
      doc.save('cyber-risk-assessment-modern.pdf');
      setSnackbarMessage('Modern professional report exported successfully! 🎉');
      setShowSnackbar(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbarMessage('Error generating report. Please try again.');
      setShowSnackbar(true);
    }
  };

  const RiskIndicator = ({ 
    risk, 
    analysis 
  }: { 
    risk: string; 
    analysis: RiskAnalysis;
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Typography variant="subtitle2" align="center">
          {risk.charAt(0).toUpperCase() + risk.slice(1)}
        </Typography>
        <Box
          sx={{
            width: 70,
            height: 70,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isLoading ? (
            <CircularProgress 
              size={70}
              thickness={4}
              sx={{ 
                color: getRiskColor(analysis.level),
                position: 'absolute'
              }}
            />
          ) : (
            <>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  bgcolor: getRiskColor(analysis.level),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <motion.div
                  key={analysis.score} // Force animation on score change
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {analysis.score}%
                </motion.div>
              </Box>
            </>
          )}
        </Box>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Typography
            variant="caption"
            sx={{ 
              color: getRiskColor(analysis.level),
              fontWeight: 'bold'
            }}
          >
            {analysis.level.toUpperCase()}
          </Typography>
        </motion.div>
      </Box>
    </motion.div>
  );

  const renderRiskIndicators = () => {
    const completionPercentage = getCompletionPercentage();
    const formComplete = isFormComplete();

    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        {!formComplete ? (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Complete Assessment to View Risk Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please fill in all required fields to generate your cyber risk assessment
            </Typography>
            
            {/* Progress indicator */}
            <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="body2" color="primary.main" fontWeight="bold">
                  {completionPercentage}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={completionPercentage} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }} 
              />
            </Box>
            
            {/* Missing fields indicator */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="caption" color="text.secondary">
                {completionPercentage < 100 ? (
                  <>
                    <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    Complete all sections to unlock risk analysis
                  </>
                ) : (
                  <>
                    <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle', color: 'success.main' }} />
                    All required fields completed!
                  </>
                )}
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Risk Analysis Results
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              alignItems: 'center',
              width: '100%'
            }}>
              {Object.entries(riskResults).map(([risk, analysis]) => (
                <RiskIndicator key={risk} risk={risk} analysis={analysis} />
              ))}
            </Box>
          </>
        )}
      </Box>
    );
  };

  const FormFieldWithTooltip = ({ 
    label, 
    tooltip, 
    children 
  }: { 
    label: string; 
    tooltip: string; 
    children: React.ReactNode;
  }) => (
    <Box sx={{ flex: '1 1 300px', minWidth: 0, position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" component="span">
          {label}
        </Typography>
        <Tooltip title={tooltip} arrow placement="top">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      {children}
    </Box>
  );

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0
    })
  };

  const renderCurrentSection = () => {
    const sectionContent = [
      // Basic Info Section
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <FormFieldWithTooltip
          label="Project Duration"
          tooltip="The total planned duration of your project from start to completion"
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.projectDuration}
              onChange={handleInputChange('projectDuration')}
            >
              <MenuItem value="<=3m">≤ 3 months</MenuItem>
              <MenuItem value="3-6m">3 - 6 months</MenuItem>
              <MenuItem value="6-12m">6 - 12 months</MenuItem>
              <MenuItem value="12-24m">12 - 24 months</MenuItem>
              <MenuItem value=">24m">{'>'}24 months</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Project Type"
          tooltip="The primary category that best describes your project"
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.projectType}
              onChange={handleInputChange('projectType')}
            >
              <MenuItem value="transportation">Transportation Infrastructure Projects</MenuItem>
              <MenuItem value="government">Government Projects</MenuItem>
              <MenuItem value="healthcare">Healthcare Projects</MenuItem>
              <MenuItem value="commercial">Large-Scale Commercial Projects</MenuItem>
              <MenuItem value="residential">Residential Projects</MenuItem>
              <MenuItem value="other">Other types</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Cybersecurity Legal Team"
          tooltip="Whether your organization has dedicated legal expertise for cybersecurity matters"
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.hasCyberLegalTeam}
              onChange={handleInputChange('hasCyberLegalTeam')}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
              <MenuItem value="unsure">Unsure</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Company Scale"
          tooltip="The total number of employees in your organization"
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.companyScale}
              onChange={handleInputChange('companyScale')}
            >
              <MenuItem value="<=30">≤ 30</MenuItem>
              <MenuItem value="31-60">31 - 60</MenuItem>
              <MenuItem value="61-100">61 - 100</MenuItem>
              <MenuItem value="101-150">101 - 150</MenuItem>
              <MenuItem value=">150">{'>'}150</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Project Phase"
          tooltip="The current phase of your project in its lifecycle"
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.projectPhase}
              onChange={handleInputChange('projectPhase')}
            >
              <MenuItem value="planning">Planning and Bidding phase</MenuItem>
              <MenuItem value="design">Design phase</MenuItem>
              <MenuItem value="construction">Construction phase</MenuItem>
              <MenuItem value="maintenance">Maintenance & Operation phase</MenuItem>
              <MenuItem value="demolition">Demolition phase</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>
      </Box>,
      
      // Structure Section
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 2,
            width: '100%'
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((layer) => (
            <FormFieldWithTooltip
              key={layer}
              label={`Layer ${layer} Teams`}
              tooltip={`Number of teams operating at layer ${layer} of your project structure. Higher layers typically have more direct access to critical systems.`}
            >
              <FormControl fullWidth size="small">
                <Select
                  value={projectInfo[`layer${layer}Teams` as keyof ProjectInfo]}
                  onChange={handleInputChange(`layer${layer}Teams` as keyof ProjectInfo)}
                >
                  <MenuItem value="<=10">≤ 10</MenuItem>
                  <MenuItem value="11-20">11 - 20</MenuItem>
                  <MenuItem value="21-30">21 - 30</MenuItem>
                  <MenuItem value="31-40">31 - 40</MenuItem>
                  <MenuItem value=">40">{'>'}40</MenuItem>
                  <MenuItem value="na">N/A</MenuItem>
                </Select>
              </FormControl>
            </FormFieldWithTooltip>
          ))}
        </Box>

        <Box sx={{ mt: 2 }}>
          <FormFieldWithTooltip
            label="Team Overlap"
            tooltip="Percentage of teams that work across multiple projects simultaneously, which can impact security coordination and resource allocation"
          >
            <FormControl fullWidth size="small">
              <Select
                value={projectInfo.teamOverlap}
                onChange={handleInputChange('teamOverlap')}
              >
                <MenuItem value="<=20">≤ 20%</MenuItem>
                <MenuItem value="21-40">21% - 40%</MenuItem>
                <MenuItem value="41-60">41% - 60%</MenuItem>
                <MenuItem value="61-80">61% - 80%</MenuItem>
                <MenuItem value="81-100">81% - 100%</MenuItem>
              </Select>
            </FormControl>
          </FormFieldWithTooltip>
        </Box>
      </Box>,
      
      // Technical Section
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <FormFieldWithTooltip
          label="Dedicated IT Team"
          tooltip="Whether your organization has a dedicated team for managing IT infrastructure and security"
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.hasITTeam}
              onChange={handleInputChange('hasITTeam')}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
              <MenuItem value="unsure">Unsure</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Devices with Firewall/IDS"
          tooltip="Percentage of devices in your organization that have active firewall or intrusion detection systems"
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.devicesWithFirewall}
              onChange={handleInputChange('devicesWithFirewall')}
            >
              <MenuItem value="<=20">≤ 20%</MenuItem>
              <MenuItem value="21-40">21% - 40%</MenuItem>
              <MenuItem value="41-60">41% - 60%</MenuItem>
              <MenuItem value="61-80">61% - 80%</MenuItem>
              <MenuItem value="81-100">81% - 100%</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Network Type"
          tooltip="The type of network infrastructure used in your project. Public networks are more accessible but potentially more vulnerable"
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.networkType}
              onChange={handleInputChange('networkType')}
            >
              <MenuItem value="public">Public network</MenuItem>
              <MenuItem value="private">Private network</MenuItem>
              <MenuItem value="both">Both public and private network</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Phishing Test Failure Rate"
          tooltip="Percentage of employees who failed recent phishing simulation tests"
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.phishingFailRate}
              onChange={handleInputChange('phishingFailRate')}
            >
              <MenuItem value="<=20">≤ 20%</MenuItem>
              <MenuItem value="21-40">21% - 40%</MenuItem>
              <MenuItem value="41-60">41% - 60%</MenuItem>
              <MenuItem value="61-80">61% - 80%</MenuItem>
              <MenuItem value="81-100">81% - 100%</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>
      </Box>,
      
      // Security Section
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <FormFieldWithTooltip
          label="Governance Level"
          tooltip="The maturity level of your organization's security governance framework"
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.governanceLevel}
              onChange={handleInputChange('governanceLevel')}
            >
              <MenuItem value="level1">Level 1</MenuItem>
              <MenuItem value="level2">Level 2</MenuItem>
              <MenuItem value="level3">Level 3</MenuItem>
              <MenuItem value="level4">Level 4</MenuItem>
              <MenuItem value="level5">Level 5</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Password Reuse"
          tooltip="Whether your organization allows users to reuse passwords across different systems"
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.allowPasswordReuse}
              onChange={handleInputChange('allowPasswordReuse')}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="MFA/Biometrics"
          tooltip="Whether your organization uses multi-factor authentication or biometric verification"
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.usesMFA}
              onChange={handleInputChange('usesMFA')}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>
      </Box>
    ];

    const arrowButtonStyle = (disabled: boolean) => ({
      bgcolor: disabled ? 'background.paper' : '#4f46e5', // New indigo color
      color: disabled ? 'action.disabled' : 'white',
      '&:hover': {
        bgcolor: disabled ? 'background.paper' : '#3c35b5' // Darker shade for hover
      },
      boxShadow: 2,
      transition: 'all 0.2s ease',
      width: 40,
      height: 40,
      '& .MuiSvgIcon-root': {
        fontSize: 20,
        ml: (direction: 'left' | 'right') => direction === 'left' ? -1 : 1
      }
    });

    return (
      <Box sx={{ position: 'relative', overflow: 'visible', mx: 3 }}>
        <Box sx={{ 
          position: 'absolute', 
          left: -20, 
          top: '50%', 
          transform: 'translateY(-50%)', 
          zIndex: 2 
        }}>
          <IconButton 
            onClick={handleBack}
            disabled={activeSection === 0}
            sx={arrowButtonStyle(activeSection === 0)}
          >
            <ArrowBackIosIcon sx={{ ml: -1 }} />
          </IconButton>
        </Box>
        
        <Box sx={{ 
          position: 'relative', 
          px: { xs: 4, sm: 6 },
          mx: 2
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {sections[activeSection]}
            </Typography>
            <Typography 
              variant="subtitle2" 
              color="text.secondary"
              sx={{ 
                maxWidth: '600px', 
                mx: 'auto',
                lineHeight: 1.4,
                fontWeight: 'normal'
              }}
            >
              {sectionDescriptions[activeSection]}
            </Typography>
          </Box>
          
          <AnimatePresence initial={false} custom={slideDirection} mode="wait">
            <motion.div
              key={activeSection}
              custom={slideDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 400, damping: 25 },
                opacity: { duration: 0.15 }
              }}
              style={{
                width: '100%',
                position: 'relative',
                zIndex: 1
              }}
            >
              {sectionContent[activeSection]}
            </motion.div>
          </AnimatePresence>
        </Box>

        <Box sx={{ 
          position: 'absolute', 
          right: -20, 
          top: '50%', 
          transform: 'translateY(-50%)', 
          zIndex: 2 
        }}>
          <IconButton 
            onClick={handleNext}
            disabled={activeSection === sections.length - 1}
            sx={arrowButtonStyle(activeSection === sections.length - 1)}
          >
            <ArrowForwardIosIcon sx={{ ml: 1 }} />
          </IconButton>
        </Box>
      </Box>
    );
  };

  // Function to check if all required fields are filled
  const isFormComplete = (): boolean => {
    const requiredFields = [
      'projectDuration', 'projectType', 'hasCyberLegalTeam', 'companyScale', 'projectPhase',
      'teamOverlap', 'hasITTeam', 'devicesWithFirewall', 'networkType', 'phishingFailRate',
      'governanceLevel', 'allowPasswordReuse', 'usesMFA'
    ];
    
    // Check if all required fields have values
    const basicFieldsComplete = requiredFields.every(field => 
      projectInfo[field as keyof ProjectInfo] && projectInfo[field as keyof ProjectInfo] !== ''
    );
    
    // Check if at least one layer team is specified (not all "na")
    const hasAtLeastOneTeam = [1, 2, 3, 4, 5, 6, 7, 8].some(layer => {
      const value = projectInfo[`layer${layer}Teams` as keyof ProjectInfo];
      return value && value !== 'na' && value !== '';
    });
    
    return basicFieldsComplete && hasAtLeastOneTeam;
  };

  // Get completion percentage for progress indicator
  const getCompletionPercentage = (): number => {
    const requiredFields = [
      'projectDuration', 'projectType', 'hasCyberLegalTeam', 'companyScale', 'projectPhase',
      'teamOverlap', 'hasITTeam', 'devicesWithFirewall', 'networkType', 'phishingFailRate',
      'governanceLevel', 'allowPasswordReuse', 'usesMFA'
    ];
    
    const filledBasicFields = requiredFields.filter(field => 
      projectInfo[field as keyof ProjectInfo] && projectInfo[field as keyof ProjectInfo] !== ''
    ).length;
    
    const hasAtLeastOneTeam = [1, 2, 3, 4, 5, 6, 7, 8].some(layer => {
      const value = projectInfo[`layer${layer}Teams` as keyof ProjectInfo];
      return value && value !== 'na' && value !== '';
    });
    
    const totalRequired = requiredFields.length + 1; // +1 for team requirement
    const totalFilled = filledBasicFields + (hasAtLeastOneTeam ? 1 : 0);
    
    return Math.round((totalFilled / totalRequired) * 100);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Risk Quantification
        </Typography>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3,
            mb: 4,
            minHeight: 'auto',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'visible'
          }}
        >
          {renderCurrentSection()}
        </Paper>

        {renderRiskIndicators()}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Tooltip 
            title={!isFormComplete() ? "Complete all required fields to export report" : "Export PDF report"}
            arrow
          >
            <span>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={exportToPDF}
                disabled={!isFormComplete()}
              >
                Export Report
              </Button>
            </span>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            disabled
          >
            Save
          </Button>
        </Box>

        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSnackbar(false)}
          message={snackbarMessage}
        />
      </motion.div>
    </Container>
  );
};

export default RiskQuantification; 