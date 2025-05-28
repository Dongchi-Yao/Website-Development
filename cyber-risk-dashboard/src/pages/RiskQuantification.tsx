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
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { motion } from 'framer-motion';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
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
  const [activeStep, setActiveStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectDuration: '', projectType: '', hasCyberLegalTeam: '', companyScale: '', projectPhase: '',
    layer1Teams: '', layer2Teams: '', layer3Teams: '', layer4Teams: '', layer5Teams: '', layer6Teams: '',
    layer7Teams: '', layer8Teams: '', teamOverlap: '', hasITTeam: '', devicesWithFirewall: '', networkType: '',
    phishingFailRate: '', governanceLevel: '', allowPasswordReuse: '', usesMFA: ''
  });

  // Mock risk analysis results (replace with actual analysis logic)
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

  const steps = [
    'Basic Project Information',
    'Project Structure',
    'Technical Factors',
    'Security Practices',
    'Review & Calculate'
  ];

  const handleInputChange = (field: keyof ProjectInfo) => (
    event: SelectChangeEvent<string>
  ) => {
    setProjectInfo({
      ...projectInfo,
      [field]: event.target.value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
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

  const handleSubmit = () => {
    // Here you would typically send the data to your backend for analysis
    setShowResults(true);
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF() as ExtendedJsPDF;
      
      // Define colors
      const primaryColor = [41, 128, 185];  // Blue
      const secondaryColor = [44, 62, 80];  // Dark Gray
      const accentColor = [231, 76, 60];    // Red
      const warningColor = [243, 156, 18];  // Orange
      const successColor = [46, 204, 113];  // Green

      // Add header with logo-like design
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Cyber Risk Assessment Report', 14, 25);

      // Add date and report info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.text(`Generated on: ${currentDate}`, 14, 50);

      // Add project summary section
      doc.setFillColor(244, 244, 244);
      doc.rect(10, 60, doc.internal.pageSize.width - 20, 40, 'F');
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...secondaryColor);
      doc.text('Project Overview', 14, 70);
      
      // Add project info in a clean format
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const projectSummary = [
        ['Project Type:', projectInfo.projectType],
        ['Duration:', projectInfo.projectDuration],
        ['Phase:', projectInfo.projectPhase],
        ['Company Scale:', projectInfo.companyScale]
      ];
      
      autoTable(doc, {
        startY: 75,
        head: [],
        body: projectSummary,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 60 },
          1: { cellWidth: 100 }
        },
        margin: { left: 14 }
      });

      // Add risk analysis section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Risk Analysis Results', 14, doc.lastAutoTable.finalY + 20);

      // Create risk score visualization
      const riskScores = Object.entries(riskResults).map(([risk, analysis]) => {
        const riskColor = analysis.level === 'critical' ? accentColor :
                         analysis.level === 'high' ? warningColor :
                         analysis.level === 'medium' ? primaryColor :
                         successColor;
        
        return [
          risk.charAt(0).toUpperCase() + risk.slice(1).replace(/([A-Z])/g, ' $1'),
          analysis.level.toUpperCase(),
          `${analysis.score}/100`,
          analysis.recommendations.join('\n'),
          riskColor
        ];
      });

      // Add risk analysis table with color coding
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 25,
        head: [['Risk Category', 'Risk Level', 'Risk Score', 'Recommendations']],
        body: riskScores.map(([name, level, score, recs]) => [name, level, score, recs]),
        theme: 'grid',
        styles: { 
          fontSize: 9,
          cellPadding: 5,
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        headStyles: { 
          fillColor: [...secondaryColor],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: 'bold' },
          1: { cellWidth: 30 },
          2: { cellWidth: 25 },
          3: { cellWidth: 95 }
        },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 1) {
            const level = data.cell.raw?.toString().toLowerCase();
            const fillColor = level === 'critical' ? accentColor :
                            level === 'high' ? warningColor :
                            level === 'medium' ? primaryColor :
                            successColor;
            
            doc.setFillColor(...fillColor);
            doc.circle(
              data.cell.x + 4,
              data.cell.y + data.cell.height / 2,
              2,
              'F'
            );
          }
        }
      });

      // Add risk score visualization
      doc.addPage();
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Risk Score Visualization', 14, 25);

      // Draw risk score gauges
      let startY = 60;
      riskScores.forEach(([name, level, score], index) => {
        const scoreNum = parseInt(score);
        doc.setFillColor(240, 240, 240);
        doc.rect(30, startY, 150, 15, 'F');
        
        const riskColor = level.toLowerCase() === 'critical' ? accentColor :
                         level.toLowerCase() === 'high' ? warningColor :
                         level.toLowerCase() === 'medium' ? primaryColor :
                         successColor;
        
        doc.setFillColor(...riskColor);
        doc.rect(30, startY, (scoreNum / 100) * 150, 15, 'F');
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(name as string, 30, startY - 5);
        doc.setFont('helvetica', 'normal');
        doc.text(`${score}`, 185, startY + 10);
        
        startY += 40;
      });

      // Add security recommendations section
      doc.addPage();
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Security Recommendations', 14, 25);

      // Add recommendations in a structured format
      startY = 60;
      riskScores.forEach(([name, level, score, recommendations], index) => {
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(name as string, 14, startY);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const recs = (recommendations as string).split('\n');
        recs.forEach((rec, recIndex) => {
          doc.setTextColor(0, 0, 0);
          doc.text(`• ${rec}`, 20, startY + 10 + (recIndex * 7));
        });
        
        startY += 40;
      });

      // Add footer to all pages
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        
        // Add footer line
        doc.setDrawColor(200, 200, 200);
        doc.line(
          20,
          doc.internal.pageSize.height - 20,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 20
        );
      }

      // Save the PDF
      doc.save('cyber-risk-assessment-report.pdf');
      setSnackbarMessage('Report exported successfully!');
      setShowSnackbar(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbarMessage('Error generating report. Please try again.');
      setShowSnackbar(true);
    }
  };

  const renderRiskAnalysis = () => {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Risk Analysis Results
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph align="center">
          Based on your project information, here's our risk assessment
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
          {Object.entries(riskResults).map(([risk, analysis]) => (
            <Card key={risk} elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {risk.charAt(0).toUpperCase() + risk.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Typography>
                  <Chip
                    icon={getRiskLevelIcon(analysis.level)}
                    label={analysis.level.toUpperCase()}
                    color={getRiskLevelColor(analysis.level)}
                    sx={{ ml: 2 }}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Risk Score: {analysis.score}/100
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={analysis.score}
                    color={getRiskLevelColor(analysis.level)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Recommendations:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {analysis.recommendations.map((recommendation: string, index: number) => (
                    <Typography
                      component="li"
                      key={index}
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {recommendation}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setShowResults(false)}
          >
            Back to Form
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportToPDF}
          >
            Export Report
          </Button>
        </Box>
      </Box>
    );
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Project Duration</InputLabel>
                <Select
                  value={projectInfo.projectDuration}
                  label="Project Duration"
                  onChange={handleInputChange('projectDuration')}
                >
                  <MenuItem value="<=3m">≤ 3 months</MenuItem>
                  <MenuItem value="3-6m">3 - 6 months</MenuItem>
                  <MenuItem value="6-12m">6 - 12 months</MenuItem>
                  <MenuItem value="12-24m">12 - 24 months</MenuItem>
                  <MenuItem value=">24m">{'>'}24 months</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Project Type</InputLabel>
                <Select
                  value={projectInfo.projectType}
                  label="Project Type"
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
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Dedicated Cybersecurity Legal Team</InputLabel>
                <Select
                  value={projectInfo.hasCyberLegalTeam}
                  label="Dedicated Cybersecurity Legal Team"
                  onChange={handleInputChange('hasCyberLegalTeam')}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="unsure">Unsure</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Company Scale</InputLabel>
                <Select
                  value={projectInfo.companyScale}
                  label="Company Scale"
                  onChange={handleInputChange('companyScale')}
                >
                  <MenuItem value="<=30">≤ 30</MenuItem>
                  <MenuItem value="31-60">31 - 60</MenuItem>
                  <MenuItem value="61-100">61 - 100</MenuItem>
                  <MenuItem value="101-150">101 - 150</MenuItem>
                  <MenuItem value=">150">{'>'}150</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Project Phase</InputLabel>
                <Select
                  value={projectInfo.projectPhase}
                  label="Project Phase"
                  onChange={handleInputChange('projectPhase')}
                >
                  <MenuItem value="planning">Planning and Bidding phase</MenuItem>
                  <MenuItem value="design">Design phase</MenuItem>
                  <MenuItem value="construction">Construction phase</MenuItem>
                  <MenuItem value="maintenance">Maintenance & Operation phase</MenuItem>
                  <MenuItem value="demolition">Demolition phase</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Number of Sub-teams at Different Layers
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The number of sub-teams at different layers of a project indicates the project's structural complexity and associated cyber risks. 
              Outer-layer sub-teams, often smaller with fewer cybersecurity resources, are generally more vulnerable, while inner-layer teams 
              are typically larger, better equipped, and more security-conscious. Understanding the distribution of sub-teams across layers is 
              crucial for implementing effective, targeted risk management strategies.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((layer) => (
                <Box key={layer} sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <FormControl fullWidth>
                    <InputLabel>Layer {layer} Teams</InputLabel>
                    <Select
                      value={projectInfo[`layer${layer}Teams` as keyof ProjectInfo]}
                      label={`Layer ${layer} Teams`}
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
                </Box>
              ))}
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Team Overlap
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The percentage of teams overlapping in different projects refers to the proportion of teams engaged simultaneously in multiple initiatives. 
                This overlap can elevate cyber risks due to shared resources and personnel, which may introduce security gaps and dependencies. 
                Increased team overlap heightens the likelihood of breaches and necessitates robust management strategies to address these vulnerabilities effectively.
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Team Overlap Percentage</InputLabel>
                <Select
                  value={projectInfo.teamOverlap}
                  label="Team Overlap Percentage"
                  onChange={handleInputChange('teamOverlap')}
                >
                  <MenuItem value="<=20">≤ 20%</MenuItem>
                  <MenuItem value="21-40">21% - 40%</MenuItem>
                  <MenuItem value="41-60">41% - 60%</MenuItem>
                  <MenuItem value="61-80">61% - 80%</MenuItem>
                  <MenuItem value="81-100">81% - 100%</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Dedicated IT Team</InputLabel>
                <Select
                  value={projectInfo.hasITTeam}
                  label="Dedicated IT Team"
                  onChange={handleInputChange('hasITTeam')}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="unsure">Unsure</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Devices with Firewall/IDS</InputLabel>
                <Select
                  value={projectInfo.devicesWithFirewall}
                  label="Devices with Firewall/IDS"
                  onChange={handleInputChange('devicesWithFirewall')}
                >
                  <MenuItem value="<=20">≤ 20%</MenuItem>
                  <MenuItem value="21-40">21% - 40%</MenuItem>
                  <MenuItem value="41-60">41% - 60%</MenuItem>
                  <MenuItem value="61-80">61% - 80%</MenuItem>
                  <MenuItem value="81-100">81% - 100%</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Network Type</InputLabel>
                <Select
                  value={projectInfo.networkType}
                  label="Network Type"
                  onChange={handleInputChange('networkType')}
                >
                  <MenuItem value="public">Public network</MenuItem>
                  <MenuItem value="private">Private network</MenuItem>
                  <MenuItem value="both">Both public and private network</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Choosing between a public or private network impacts a project's cybersecurity. Public networks can be vulnerable to attacks due to easier access, 
                while private networks offer enhanced security controls but may be costly and complex to manage. Each type requires specific security approaches.
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Phishing Test Failure Rate</InputLabel>
                <Select
                  value={projectInfo.phishingFailRate}
                  label="Phishing Test Failure Rate"
                  onChange={handleInputChange('phishingFailRate')}
                >
                  <MenuItem value="<=20">≤ 20%</MenuItem>
                  <MenuItem value="21-40">21% - 40%</MenuItem>
                  <MenuItem value="41-60">41% - 60%</MenuItem>
                  <MenuItem value="61-80">61% - 80%</MenuItem>
                  <MenuItem value="81-100">81% - 100%</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Governance Commitment Level</InputLabel>
                <Select
                  value={projectInfo.governanceLevel}
                  label="Governance Commitment Level"
                  onChange={handleInputChange('governanceLevel')}
                >
                  <MenuItem value="level1">Level 1</MenuItem>
                  <MenuItem value="level2">Level 2</MenuItem>
                  <MenuItem value="level3">Level 3</MenuItem>
                  <MenuItem value="level4">Level 4</MenuItem>
                  <MenuItem value="level5">Level 5</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Password Reuse Allowed</InputLabel>
                <Select
                  value={projectInfo.allowPasswordReuse}
                  label="Password Reuse Allowed"
                  onChange={handleInputChange('allowPasswordReuse')}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Uses MFA/Biometrics</InputLabel>
                <Select
                  value={projectInfo.usesMFA}
                  label="Uses MFA/Biometrics"
                  onChange={handleInputChange('usesMFA')}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Data Classification</InputLabel>
                <Select
                  value={projectInfo.dataClassification}
                  label="Data Classification"
                  onChange={handleInputChange('dataClassification')}
                >
                  <MenuItem value="public">Public Only</MenuItem>
                  <MenuItem value="internal">Internal Use</MenuItem>
                  <MenuItem value="confidential">Confidential</MenuItem>
                  <MenuItem value="restricted">Restricted</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>BMS Integration</InputLabel>
                <Select
                  value={projectInfo.bmsIntegration}
                  label="BMS Integration"
                  onChange={handleInputChange('bmsIntegration')}
                >
                  <MenuItem value="none">No BMS</MenuItem>
                  <MenuItem value="basic">Basic Integration</MenuItem>
                  <MenuItem value="advanced">Advanced Integration</MenuItem>
                  <MenuItem value="full">Full Integration</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      case 5:
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Access Control System</InputLabel>
                <Select
                  value={projectInfo.accessControl}
                  label="Access Control System"
                  onChange={handleInputChange('accessControl')}
                >
                  <MenuItem value="basic">Basic (Password Only)</MenuItem>
                  <MenuItem value="mfa">Multi-Factor Authentication</MenuItem>
                  <MenuItem value="biometric">Biometric</MenuItem>
                  <MenuItem value="advanced">Advanced (Zero Trust)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Security Monitoring</InputLabel>
                <Select
                  value={projectInfo.securityMonitoring}
                  label="Security Monitoring"
                  onChange={handleInputChange('securityMonitoring')}
                >
                  <MenuItem value="none">No Monitoring</MenuItem>
                  <MenuItem value="basic">Basic Monitoring</MenuItem>
                  <MenuItem value="24x7">24x7 Monitoring</MenuItem>
                  <MenuItem value="soc">Full SOC</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Incident Response Plan</InputLabel>
                <Select
                  value={projectInfo.incidentResponse}
                  label="Incident Response Plan"
                  onChange={handleInputChange('incidentResponse')}
                >
                  <MenuItem value="none">No Plan</MenuItem>
                  <MenuItem value="basic">Basic Plan</MenuItem>
                  <MenuItem value="documented">Documented & Tested</MenuItem>
                  <MenuItem value="mature">Mature & Regularly Updated</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Backup Strategy</InputLabel>
                <Select
                  value={projectInfo.backupStrategy}
                  label="Backup Strategy"
                  onChange={handleInputChange('backupStrategy')}
                >
                  <MenuItem value="none">No Backup</MenuItem>
                  <MenuItem value="basic">Basic Backup</MenuItem>
                  <MenuItem value="regular">Regular Backup</MenuItem>
                  <MenuItem value="continuous">Continuous Backup</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Security Certifications</InputLabel>
                <Select
                  value={projectInfo.securityCertifications}
                  label="Security Certifications"
                  onChange={handleInputChange('securityCertifications')}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="iso27001">ISO 27001</MenuItem>
                  <MenuItem value="soc2">SOC 2</MenuItem>
                  <MenuItem value="multiple">Multiple Standards</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      case 6:
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Security Training Program</InputLabel>
                <Select
                  value={projectInfo.securityTrainingFrequency}
                  label="Security Training Program"
                  onChange={handleInputChange('securityTrainingFrequency')}
                >
                  <MenuItem value="none">No Training</MenuItem>
                  <MenuItem value="onboarding">Onboarding Only</MenuItem>
                  <MenuItem value="annual">Annual Training</MenuItem>
                  <MenuItem value="quarterly">Quarterly Training</MenuItem>
                  <MenuItem value="continuous">Continuous Training</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Security Awareness Level</InputLabel>
                <Select
                  value={projectInfo.securityAwareness}
                  label="Security Awareness Level"
                  onChange={handleInputChange('securityAwareness')}
                >
                  <MenuItem value="low">Low Awareness</MenuItem>
                  <MenuItem value="moderate">Moderate Awareness</MenuItem>
                  <MenuItem value="high">High Awareness</MenuItem>
                  <MenuItem value="expert">Expert Level</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Security Team Size</InputLabel>
                <Select
                  value={projectInfo.securityTeamSize}
                  label="Security Team Size"
                  onChange={handleInputChange('securityTeamSize')}
                >
                  <MenuItem value="none">No Dedicated Team</MenuItem>
                  <MenuItem value="small">1-5 People</MenuItem>
                  <MenuItem value="medium">6-15 People</MenuItem>
                  <MenuItem value="large">{'>'} 15 People</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Third-party Security Requirements</InputLabel>
                <Select
                  value={projectInfo.thirdPartySecurityReq}
                  label="Third-party Security Requirements"
                  onChange={handleInputChange('thirdPartySecurityReq')}
                >
                  <MenuItem value="none">No Requirements</MenuItem>
                  <MenuItem value="basic">Basic Requirements</MenuItem>
                  <MenuItem value="moderate">Moderate Requirements</MenuItem>
                  <MenuItem value="strict">Strict Requirements</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Security Budget Allocation</InputLabel>
                <Select
                  value={projectInfo.securityBudget}
                  label="Security Budget Allocation"
                  onChange={handleInputChange('securityBudget')}
                >
                  <MenuItem value="minimal">{'<'} 1% of Project Budget</MenuItem>
                  <MenuItem value="low">1-3% of Project Budget</MenuItem>
                  <MenuItem value="moderate">3-5% of Project Budget</MenuItem>
                  <MenuItem value="high">{'>'} 5% of Project Budget</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      case 7:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Risk Assessment Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ width: '100%' }}>
                <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.default', width: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Project Details
                  </Typography>
                  {Object.entries(projectInfo).map(([key, value]) => (
                    <Typography key={key}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}
                    </Typography>
                  ))}
                </Paper>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Alert severity="info" sx={{ width: '100%' }}>
                  This is a preliminary risk assessment. For a comprehensive analysis, please consult with our security experts.
                </Alert>
              </Box>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Risk Quantification
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph align="center">
          Assess and quantify cyber risks in your construction project
        </Typography>

        {!showResults ? (
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Box>
          </Paper>
        ) : (
          renderRiskAnalysis()
        )}

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