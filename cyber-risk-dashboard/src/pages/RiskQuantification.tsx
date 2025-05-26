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
  // Category 1: Overall Project Information
  country: string;
  budget: string;
  cybersecurityBudget: string;
  duration: string;
  totalPeople: string;
  projectType: string;
  hasLegalTeam: string;

  // Category 2: Project Structure
  deliveryMethod: string;
  layer1Teams: string;
  layer2Teams: string;
  layer3Teams: string;
  layer4Teams: string;
  layer5Teams: string;
  layer6Teams: string;
  layer7Teams: string;
  layer8Teams: string;
  layer1Channels: string;
  layer2Channels: string;
  layer3Channels: string;
  layer4Channels: string;
  layer5Channels: string;
  layer6Channels: string;
  layer7Channels: string;
  layer8Channels: string;
  teamOverlap: string;

  // Category 3: IT Factors
  companyScale: string;
  projectPhase: string;
  hasITTeam: string;
  criticalAssets: string;
  userEndpoints: string;
  devicesWithFirewall: string;
  networkType: string;
  phishingTestFailRate: string;
  mttr: string;

  // Category 4: OT Factors
  otEquipment: string;
  physicalAccessControl: string;
  otIsolation: string;
  otEquipmentAge: string;
  hmiAuthentication: string;

  // Category 5: Management and Human Factors
  governanceCommitment: string;
  securityTrainingFrequency: string;
  passwordReuse: string;
  mfaRequired: string;
  sensitiveInfoAccess: string;
  teamVariability: string;
  socioeconomicLevel: string;
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
    // Initialize all fields with empty strings
    country: '', budget: '', cybersecurityBudget: '', duration: '', totalPeople: '',
    projectType: '', hasLegalTeam: '', deliveryMethod: '', layer1Teams: '', layer2Teams: '',
    layer3Teams: '', layer4Teams: '', layer5Teams: '', layer6Teams: '', layer7Teams: '',
    layer8Teams: '', layer1Channels: '', layer2Channels: '', layer3Channels: '', layer4Channels: '',
    layer5Channels: '', layer6Channels: '', layer7Channels: '', layer8Channels: '', teamOverlap: '',
    companyScale: '', projectPhase: '', hasITTeam: '', criticalAssets: '', userEndpoints: '',
    devicesWithFirewall: '', networkType: '', phishingTestFailRate: '', mttr: '', otEquipment: '',
    physicalAccessControl: '', otIsolation: '', otEquipmentAge: '', hmiAuthentication: '',
    governanceCommitment: '', securityTrainingFrequency: '', passwordReuse: '', mfaRequired: '',
    sensitiveInfoAccess: '', teamVariability: '', socioeconomicLevel: ''
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
    'Overall Project Information',
    'Project Structure',
    'IT Factors',
    'OT Factors',
    'Management & Human Factors',
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
      
      // Add title
      doc.setFontSize(20);
      doc.text('Risk Analysis Report', 14, 20);
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add project summary
      doc.setFontSize(14);
      doc.text('Project Information', 14, 40);
      doc.setFontSize(10);
      
      // Create project info table
      const projectInfoData = Object.entries(projectInfo).map(([key, value]) => [
        key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value || 'Not specified'
      ]);
      
      autoTable(doc, {
        startY: 45,
        head: [['Field', 'Value']],
        body: projectInfoData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      // Add risk analysis
      doc.setFontSize(14);
      doc.text('Risk Analysis Results', 14, doc.lastAutoTable.finalY + 15);

      // Create risk analysis table
      const riskAnalysisData = Object.entries(riskResults).map(([risk, analysis]) => [
        risk.charAt(0).toUpperCase() + risk.slice(1).replace(/([A-Z])/g, ' $1'),
        analysis.level.toUpperCase(),
        `${analysis.score}/100`,
        analysis.recommendations.join('\n')
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Risk Type', 'Level', 'Score', 'Recommendations']],
        body: riskAnalysisData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        columnStyles: {
          3: { cellWidth: 60 }
        }
      });

      // Add footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      doc.save('risk-analysis-report.pdf');
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
                <InputLabel>Country (Continent)</InputLabel>
                <Select
                  value={projectInfo.country}
                  label="Country (Continent)"
                  onChange={handleInputChange('country')}
                >
                  <MenuItem value="asia">Asia</MenuItem>
                  <MenuItem value="europe">Europe</MenuItem>
                  <MenuItem value="africa">Africa</MenuItem>
                  <MenuItem value="north_america">North America</MenuItem>
                  <MenuItem value="south_america">South America</MenuItem>
                  <MenuItem value="antarctica">Antarctica</MenuItem>
                  <MenuItem value="oceania">Oceania</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Project Budget</InputLabel>
                <Select
                  value={projectInfo.budget}
                  label="Project Budget"
                  onChange={handleInputChange('budget')}
                >
                  <MenuItem value="<=100k">≤ $100,000</MenuItem>
                  <MenuItem value="100k-500k">$100,000 - $500,000</MenuItem>
                  <MenuItem value="500k-1m">$500,000 - $1 million</MenuItem>
                  <MenuItem value="1m-5m">$1 million - $5 million</MenuItem>
                  <MenuItem value=">5m">{'>'} $5 million</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Cybersecurity Budget %</InputLabel>
                <Select
                  value={projectInfo.cybersecurityBudget}
                  label="Cybersecurity Budget %"
                  onChange={handleInputChange('cybersecurityBudget')}
                >
                  <MenuItem value="<=1%">≤ 1%</MenuItem>
                  <MenuItem value="1%-2%">1% - 2%</MenuItem>
                  <MenuItem value="2%-3%">2% - 3%</MenuItem>
                  <MenuItem value="3%-4%">3% - 4%</MenuItem>
                  <MenuItem value="4%-5%">4% - 5%</MenuItem>
                  <MenuItem value=">5%">{'>'} 5%</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Project Duration</InputLabel>
                <Select
                  value={projectInfo.duration}
                  label="Project Duration"
                  onChange={handleInputChange('duration')}
                >
                  <MenuItem value="<=6m">≤ 6 months</MenuItem>
                  <MenuItem value="6m-1y">6 months - 1 year</MenuItem>
                  <MenuItem value="1y-2y">1-2 years</MenuItem>
                  <MenuItem value="2y-3y">2-3 years</MenuItem>
                  <MenuItem value=">3y">{'>'} 3 years</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Total People Involved</InputLabel>
                <Select
                  value={projectInfo.totalPeople}
                  label="Total People Involved"
                  onChange={handleInputChange('totalPeople')}
                >
                  <MenuItem value="<=50">≤ 50</MenuItem>
                  <MenuItem value="51-100">51-100</MenuItem>
                  <MenuItem value="101-200">101-200</MenuItem>
                  <MenuItem value="201-500">201-500</MenuItem>
                  <MenuItem value=">500">{'>'} 500</MenuItem>
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
                  <MenuItem value="residential">Residential</MenuItem>
                  <MenuItem value="commercial">Commercial</MenuItem>
                  <MenuItem value="industrial">Industrial</MenuItem>
                  <MenuItem value="infrastructure">Infrastructure</MenuItem>
                  <MenuItem value="mixed">Mixed Use</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Has Legal Team</InputLabel>
                <Select
                  value={projectInfo.hasLegalTeam}
                  label="Has Legal Team"
                  onChange={handleInputChange('hasLegalTeam')}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Project Delivery Method</InputLabel>
                <Select
                  value={projectInfo.deliveryMethod}
                  label="Project Delivery Method"
                  onChange={handleInputChange('deliveryMethod')}
                >
                  <MenuItem value="dbb">Design-Bid-Build (DBB)</MenuItem>
                  <MenuItem value="db">Design-Build (DB)</MenuItem>
                  <MenuItem value="cmar">Construction Manager at Risk (CMAR)</MenuItem>
                  <MenuItem value="cmmp">Construction Management Multi-Prime (CMMP)</MenuItem>
                  <MenuItem value="ppp">Public-Private Partnership (PPP or P3)</MenuItem>
                  <MenuItem value="ipd">Integrated Project Delivery (IPD)</MenuItem>
                  <MenuItem value="dbom">Design/Build/Operate/Maintain (DBOM)</MenuItem>
                  <MenuItem value="other">Other types</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Layer 1 Teams</InputLabel>
                <Select
                  value={projectInfo.layer1Teams}
                  label="Layer 1 Teams"
                  onChange={handleInputChange('layer1Teams')}
                >
                  <MenuItem value="1-2">1-2 teams</MenuItem>
                  <MenuItem value="3-4">3-4 teams</MenuItem>
                  <MenuItem value="5-6">5-6 teams</MenuItem>
                  <MenuItem value="7-8">7-8 teams</MenuItem>
                  <MenuItem value=">8">{'>'} 8 teams</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Layer 1 Communication Channels</InputLabel>
                <Select
                  value={projectInfo.layer1Channels}
                  label="Layer 1 Communication Channels"
                  onChange={handleInputChange('layer1Channels')}
                >
                  <MenuItem value="1-2">1-2 channels</MenuItem>
                  <MenuItem value="3-4">3-4 channels</MenuItem>
                  <MenuItem value="5-6">5-6 channels</MenuItem>
                  <MenuItem value="7-8">7-8 channels</MenuItem>
                  <MenuItem value=">8">{'>'} 8 channels</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Team Overlap</InputLabel>
                <Select
                  value={projectInfo.teamOverlap}
                  label="Team Overlap"
                  onChange={handleInputChange('teamOverlap')}
                >
                  <MenuItem value="none">No overlap</MenuItem>
                  <MenuItem value="low">Low overlap</MenuItem>
                  <MenuItem value="medium">Medium overlap</MenuItem>
                  <MenuItem value="high">High overlap</MenuItem>
                  <MenuItem value="very_high">Very high overlap</MenuItem>
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
                  <MenuItem value=">150">{'>'} 150</MenuItem>
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
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="construction">Construction</MenuItem>
                  <MenuItem value="commissioning">Commissioning</MenuItem>
                  <MenuItem value="operation">Operation</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Has IT Team</InputLabel>
                <Select
                  value={projectInfo.hasITTeam}
                  label="Has IT Team"
                  onChange={handleInputChange('hasITTeam')}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Critical Assets</InputLabel>
                <Select
                  value={projectInfo.criticalAssets}
                  label="Critical Assets"
                  onChange={handleInputChange('criticalAssets')}
                >
                  <MenuItem value="<=5">≤ 5</MenuItem>
                  <MenuItem value="6-10">6-10</MenuItem>
                  <MenuItem value="11-20">11-20</MenuItem>
                  <MenuItem value="21-30">21-30</MenuItem>
                  <MenuItem value=">30">{'>'} 30</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>User Endpoints</InputLabel>
                <Select
                  value={projectInfo.userEndpoints}
                  label="User Endpoints"
                  onChange={handleInputChange('userEndpoints')}
                >
                  <MenuItem value="<=50">≤ 50</MenuItem>
                  <MenuItem value="51-100">51-100</MenuItem>
                  <MenuItem value="101-200">101-200</MenuItem>
                  <MenuItem value="201-500">201-500</MenuItem>
                  <MenuItem value=">500">{'>'} 500</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Devices with Firewall</InputLabel>
                <Select
                  value={projectInfo.devicesWithFirewall}
                  label="Devices with Firewall"
                  onChange={handleInputChange('devicesWithFirewall')}
                >
                  <MenuItem value="<=25%">≤ 25%</MenuItem>
                  <MenuItem value="26-50%">26-50%</MenuItem>
                  <MenuItem value="51-75%">51-75%</MenuItem>
                  <MenuItem value="76-90%">76-90%</MenuItem>
                  <MenuItem value=">90%">{'>'} 90%</MenuItem>
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
                  <MenuItem value="isolated">Isolated</MenuItem>
                  <MenuItem value="segmented">Segmented</MenuItem>
                  <MenuItem value="integrated">Integrated</MenuItem>
                  <MenuItem value="cloud">Cloud-based</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Phishing Test Fail Rate</InputLabel>
                <Select
                  value={projectInfo.phishingTestFailRate}
                  label="Phishing Test Fail Rate"
                  onChange={handleInputChange('phishingTestFailRate')}
                >
                  <MenuItem value="<=5%">≤ 5%</MenuItem>
                  <MenuItem value="6-10%">6-10%</MenuItem>
                  <MenuItem value="11-20%">11-20%</MenuItem>
                  <MenuItem value="21-30%">21-30%</MenuItem>
                  <MenuItem value=">30%">{'>'} 30%</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Mean Time to Respond (MTTR)</InputLabel>
                <Select
                  value={projectInfo.mttr}
                  label="Mean Time to Respond (MTTR)"
                  onChange={handleInputChange('mttr')}
                >
                  <MenuItem value="<=1h">≤ 1 hour</MenuItem>
                  <MenuItem value="1-4h">1-4 hours</MenuItem>
                  <MenuItem value="4-8h">4-8 hours</MenuItem>
                  <MenuItem value="8-24h">8-24 hours</MenuItem>
                  <MenuItem value=">24h">{'>'} 24 hours</MenuItem>
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
                <InputLabel>OT Equipment Count</InputLabel>
                <Select
                  value={projectInfo.otEquipment}
                  label="OT Equipment Count"
                  onChange={handleInputChange('otEquipment')}
                >
                  <MenuItem value="<=30">≤ 30</MenuItem>
                  <MenuItem value="31-60">31-60</MenuItem>
                  <MenuItem value="61-90">61-90</MenuItem>
                  <MenuItem value="91-120">91-120</MenuItem>
                  <MenuItem value="121-150">121-150</MenuItem>
                  <MenuItem value=">150">{'>'} 150</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Physical Access Control</InputLabel>
                <Select
                  value={projectInfo.physicalAccessControl}
                  label="Physical Access Control"
                  onChange={handleInputChange('physicalAccessControl')}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                  <MenuItem value="comprehensive">Comprehensive</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>OT Isolation</InputLabel>
                <Select
                  value={projectInfo.otIsolation}
                  label="OT Isolation"
                  onChange={handleInputChange('otIsolation')}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
                  <MenuItem value="full">Full</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>OT Equipment Age</InputLabel>
                <Select
                  value={projectInfo.otEquipmentAge}
                  label="OT Equipment Age"
                  onChange={handleInputChange('otEquipmentAge')}
                >
                  <MenuItem value="<=2y">≤ 2 years</MenuItem>
                  <MenuItem value="2-5y">2-5 years</MenuItem>
                  <MenuItem value="5-10y">5-10 years</MenuItem>
                  <MenuItem value="10-15y">10-15 years</MenuItem>
                  <MenuItem value=">15y">{'>'} 15 years</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>HMI Authentication</InputLabel>
                <Select
                  value={projectInfo.hmiAuthentication}
                  label="HMI Authentication"
                  onChange={handleInputChange('hmiAuthentication')}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                  <MenuItem value="comprehensive">Comprehensive</MenuItem>
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
                <InputLabel>Governance Commitment Level</InputLabel>
                <Select
                  value={projectInfo.governanceCommitment}
                  label="Governance Commitment Level"
                  onChange={handleInputChange('governanceCommitment')}
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
                <InputLabel>Security Training Frequency</InputLabel>
                <Select
                  value={projectInfo.securityTrainingFrequency}
                  label="Security Training Frequency"
                  onChange={handleInputChange('securityTrainingFrequency')}
                >
                  <MenuItem value="never">Never</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                  <MenuItem value="biannual">Biannual</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Password Reuse</InputLabel>
                <Select
                  value={projectInfo.passwordReuse}
                  label="Password Reuse"
                  onChange={handleInputChange('passwordReuse')}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="very_high">Very High</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>MFA Required</InputLabel>
                <Select
                  value={projectInfo.mfaRequired}
                  label="MFA Required"
                  onChange={handleInputChange('mfaRequired')}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
                  <MenuItem value="full">Full</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Sensitive Info Access</InputLabel>
                <Select
                  value={projectInfo.sensitiveInfoAccess}
                  label="Sensitive Info Access"
                  onChange={handleInputChange('sensitiveInfoAccess')}
                >
                  <MenuItem value="unrestricted">Unrestricted</MenuItem>
                  <MenuItem value="limited">Limited</MenuItem>
                  <MenuItem value="restricted">Restricted</MenuItem>
                  <MenuItem value="strict">Strict</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Team Variability</InputLabel>
                <Select
                  value={projectInfo.teamVariability}
                  label="Team Variability"
                  onChange={handleInputChange('teamVariability')}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="very_high">Very High</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Socioeconomic Level</InputLabel>
                <Select
                  value={projectInfo.socioeconomicLevel}
                  label="Socioeconomic Level"
                  onChange={handleInputChange('socioeconomicLevel')}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium_low">Medium-Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="medium_high">Medium-High</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      case 5:
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