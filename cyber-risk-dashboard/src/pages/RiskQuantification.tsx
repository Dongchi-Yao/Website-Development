import { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  Avatar,
  ListItemAvatar,
  Drawer,
  Dialog,
  DialogContent,
  DialogTitle,
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
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import InfoIcon from '@mui/icons-material/Info';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { styled } from '@mui/material/styles';
import ChatbotService from '../services/chatbotService';
import { alpha } from '@mui/material/styles';
import visualImage from '../assets/visual.png';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import RiskContextBadge from '../components/RiskContextBadge';

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

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Conversation {
  id: number;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

interface RiskReduction {
  parameter: string;
  currentValue: string;
  suggestedValue: string;
  impact: string;
  riskReduction: number;
  changeable: boolean;
  parameterKey: string;
}

interface ChangeableProperty {
  key: string;
  label: string;
  description: string;
  changeable: boolean;
}

interface RiskMitigationRound {
  roundNumber: number;
  features: string[];
  currentRisk: number;
  projectedRisk: number;
  riskReduction: number;
  reductionPercentage: number;
  recommendations: RiskMitigationRecommendation[];
}

interface RiskMitigationRecommendation {
  featureGroup: string;
  featureName: string;
  currentOption: string;
  recommendedOption: string;
  optionIndex: number;
  description: string;
}

interface RiskMitigationStrategy {
  initialRisk: number;
  finalRisk: number;
  totalReduction: number;
  totalReductionPercentage: number;
  rounds: RiskMitigationRound[];
  implementationPriority: 'high' | 'medium' | 'low';
}

// API service for risk calculation
const riskApiService = {
  calculateRisk: async (projectInfo: ProjectInfo): Promise<RiskResults> => {
    try {
      // Convert project info to model input array exactly matching the training data values
      const modelInput = [
        // 1.1 Project Duration (0-4 scale)
        ['<=3m', '3-6m', '6-12m', '12-24m', '>24m']
          .indexOf(projectInfo.projectDuration),

        // 1.2 Project Type (0-5 scale)
        ['transportation', 'government', 'healthcare', 'commercial', 'residential', 'other']
          .indexOf(projectInfo.projectType),

        // 1.3 Has Cyber Legal Team (0-2 scale)
        ['yes', 'no', 'unsure'].indexOf(projectInfo.hasCyberLegalTeam),

        // 1.4 Company Scale (0-4 scale)
        ['<=30', '31-60', '61-100', '101-150', '>150']
          .indexOf(projectInfo.companyScale),

        // 1.5 Project Phase (0-4 scale)
        ['planning', 'design', 'construction', 'maintenance', 'demolition']
          .indexOf(projectInfo.projectPhase),

        // 2.1.1 Layer 1 Teams (0-5 scale)
        ['<=10', '11-20', '21-30', '31-40', '>40', 'na']
          .indexOf(projectInfo.layer1Teams),

        // 2.1.2 Layer 2 Teams (0-5 scale)
        ['<=10', '11-20', '21-30', '31-40', '>40', 'na']
          .indexOf(projectInfo.layer2Teams),

        // 2.1.3 Layer 3 Teams (0-5 scale)
        ['<=10', '11-20', '21-30', '31-40', '>40', 'na']
          .indexOf(projectInfo.layer3Teams),

        // 2.2 Team Overlap (0-4 scale)
        ['<=20', '21-40', '41-60', '61-80', '81-100']
          .indexOf(projectInfo.teamOverlap),

        // 3.1 Has IT Team (0-2 scale)
        ['yes', 'no', 'unsure'].indexOf(projectInfo.hasITTeam),

        // 3.2 Devices with Firewall (0-4 scale)
        ['<=20', '21-40', '41-60', '61-80', '81-100']
          .indexOf(projectInfo.devicesWithFirewall),

        // 3.3 Network Type (0-2 scale)
        ['public', 'private', 'both'].indexOf(projectInfo.networkType),

        // 3.4 Phishing Fail Rate (0-4 scale)
        ['<=20', '21-40', '41-60', '61-80', '81-100']
          .indexOf(projectInfo.phishingFailRate),

        // 4.1 Governance Level (0-4 scale)
        ['level1', 'level2', 'level3', 'level4', 'level5']
          .indexOf(projectInfo.governanceLevel),

        // 4.2 Allow Password Reuse (0-1 scale)
        ['yes', 'no'].indexOf(projectInfo.allowPasswordReuse),

        // 4.3 Uses MFA (0-1 scale)
        ['yes', 'no'].indexOf(projectInfo.usesMFA)
      ];

      // Validate that we have exactly 16 numbers
      if (modelInput.length !== 16) {
        throw new Error(`Invalid input: expected 16 numbers, got ${modelInput.length}`);
      }

      // Validate that all inputs are numbers and within their expected ranges
      const validations = [
        { value: modelInput[0], min: 0, max: 4, name: "1.1 Project Duration" },
        { value: modelInput[1], min: 0, max: 5, name: "1.2 Project Type" },
        { value: modelInput[2], min: 0, max: 2, name: "1.3 Cyber Legal Team" },
        { value: modelInput[3], min: 0, max: 4, name: "1.4 Company Scale" },
        { value: modelInput[4], min: 0, max: 4, name: "1.5 Project Phase" },
        { value: modelInput[5], min: 0, max: 5, name: "2.1.1 Layer 1 Teams" },
        { value: modelInput[6], min: 0, max: 5, name: "2.1.2 Layer 2 Teams" },
        { value: modelInput[7], min: 0, max: 5, name: "2.1.3 Layer 3 Teams" },
        { value: modelInput[8], min: 0, max: 4, name: "2.2 Team Overlap" },
        { value: modelInput[9], min: 0, max: 2, name: "3.1 IT Team" },
        { value: modelInput[10], min: 0, max: 4, name: "3.2 Devices with Firewall" },
        { value: modelInput[11], min: 0, max: 2, name: "3.3 Network Type" },
        { value: modelInput[12], min: 0, max: 4, name: "3.4 Phishing Fail Rate" },
        { value: modelInput[13], min: 0, max: 4, name: "4.1 Governance Level" },
        { value: modelInput[14], min: 0, max: 1, name: "4.2 Password Reuse" },
        { value: modelInput[15], min: 0, max: 1, name: "4.3 MFA" }
      ];

      for (const validation of validations) {
        if (typeof validation.value !== 'number' || isNaN(validation.value)) {
          throw new Error(`Invalid input: ${validation.name} must be a number`);
        }
        if (validation.value < validation.min || validation.value > validation.max) {
          throw new Error(`Invalid input: ${validation.name} must be between ${validation.min} and ${validation.max}`);
        }
      }

      console.log('Sending data to API:', modelInput);
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_data: modelInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      const probabilities = data.probabilities;
      
      // Convert probabilities to risk levels and recommendations
      const convertToRiskLevel = (prob: number): 'low' | 'medium' | 'high' | 'critical' => {
        if (prob < 0.3) return 'low';
        if (prob < 0.6) return 'medium';
        if (prob < 0.85) return 'high';
        return 'critical';
      };

      const getRecommendations = (riskType: string, level: string): string[] => {
        const baseRecommendations = {
          low: ['Regular monitoring and basic security measures'],
          medium: ['Enhanced security protocols', 'Regular staff training'],
          high: ['Immediate security assessment', 'Advanced protection measures', 'Incident response plan'],
          critical: ['Urgent security overhaul', 'Expert consultation', 'Comprehensive risk mitigation plan']
        };
        return baseRecommendations[level as keyof typeof baseRecommendations];
      };
      
      return {
        ransomware: {
          score: Math.round(probabilities[0] * 100),
          level: convertToRiskLevel(probabilities[0]),
          recommendations: getRecommendations('ransomware', convertToRiskLevel(probabilities[0]))
        },
        phishing: {
          score: Math.round(probabilities[1] * 100),
          level: convertToRiskLevel(probabilities[1]),
          recommendations: getRecommendations('phishing', convertToRiskLevel(probabilities[1]))
        },
        dataBreach: {
          score: Math.round(probabilities[2] * 100),
          level: convertToRiskLevel(probabilities[2]),
          recommendations: getRecommendations('dataBreach', convertToRiskLevel(probabilities[2]))
        },
        insiderAttack: {
          score: Math.round(probabilities[3] * 100),
          level: convertToRiskLevel(probabilities[3]),
          recommendations: getRecommendations('insiderAttack', convertToRiskLevel(probabilities[3]))
        },
        supplyChain: {
          score: Math.round(probabilities[4] * 100),
          level: convertToRiskLevel(probabilities[4]),
          recommendations: getRecommendations('supplyChain', convertToRiskLevel(probabilities[4]))
        }
      };
    } catch (error) {
      console.error('Risk calculation error:', error);
      throw error;
    }
  },

  checkHealth: async (): Promise<{ status: string; modelLoaded?: boolean }> => {
    const response = await fetch('http://localhost:8000/health');
    return response.json();
  }
};

const TooltipContent = styled('div')({
  '& p': {
    margin: '8px 0',
  },
  '& ul': {
    margin: '4px 0',
    paddingLeft: '20px',
  },
  '& li': {
    margin: '4px 0',
  }
});

const PulsingLoader = styled(CircularProgress)(({ theme }) => ({
  animation: 'pulse 1.5s ease-in-out infinite',
  '@keyframes pulse': {
    '0%': {
      opacity: 1,
      transform: 'scale(1)',
    },
    '50%': {
      opacity: 0.7,
      transform: 'scale(1.1)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
}));

const TypingAnimation = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '8px 12px',
  '& .dot': {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: theme.palette.text.secondary,
    animation: 'typing 1.4s infinite ease-in-out',
    '&:nth-of-type(1)': { animationDelay: '0s' },
    '&:nth-of-type(2)': { animationDelay: '0.2s' },
    '&:nth-of-type(3)': { animationDelay: '0.4s' },
  },
  '@keyframes typing': {
    '0%, 60%, 100%': {
      transform: 'scale(1)',
      opacity: 0.5,
    },
    '30%': {
      transform: 'scale(1.2)',
      opacity: 1,
    },
  },
}));

const RiskQuantification = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0); // -1 for left, 1 for right
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectDuration: '', projectType: '', hasCyberLegalTeam: '', companyScale: '', projectPhase: '',
    layer1Teams: '', layer2Teams: '', layer3Teams: '', teamOverlap: '', hasITTeam: '', devicesWithFirewall: '', networkType: '',
    phishingFailRate: '', governanceLevel: '', allowPasswordReuse: '', usesMFA: '',
    regulatoryRequirements: '', stakeholderCount: '', thirdPartyVendors: '', remoteWorkLevel: '',
    cloudServices: '', dataClassification: '', bmsIntegration: '', accessControl: '',
    securityMonitoring: '', incidentResponse: '', backupStrategy: '', securityCertifications: '',
    securityAwareness: '', securityTeamSize: '', thirdPartySecurityReq: '', securityBudget: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [riskResults, setRiskResults] = useState<RiskResults>({
    ransomware: {
      score: 0,
      level: 'low',
      recommendations: []
    },
    phishing: {
      score: 0,
      level: 'low',
      recommendations: []
    },
    dataBreach: {
      score: 0,
      level: 'low',
      recommendations: []
    },
    insiderAttack: {
      score: 0,
      level: 'low',
      recommendations: []
    },
    supplyChain: {
      score: 0,
      level: 'low',
      recommendations: []
    }
  });

  const [useRandomResults, setUseRandomResults] = useState(false);
  const [devMode, setDevMode] = useState(false);

  // Chatbot state
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      title: 'Risk Analysis Chat',
      messages: [{
        id: 1,
        text: "Hello! I'm **Dr. CyberBuild**, your expert construction cybersecurity consultant. I specialize in analyzing cyber risks for construction projects and providing actionable security strategies. Once you complete your risk assessment, I'll have comprehensive insights about your project to offer specialized guidance. How can I assist you today?",
        sender: 'ai',
        timestamp: new Date(),
      }],
      lastUpdated: new Date(),
    }
  ]);
  const [currentConversationId, setCurrentConversationId] = useState(1);
  const [chatInput, setChatInput] = useState('');
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);

  // Risk reduction state
  const [riskReductions, setRiskReductions] = useState<RiskReduction[]>([]);
  const [isAnalyzingReductions, setIsAnalyzingReductions] = useState(false);
  const [riskMitigationStrategy, setRiskMitigationStrategy] = useState<RiskMitigationStrategy | null>(null);
  const [selectedRound, setSelectedRound] = useState<number>(0);
  const [preservedRound, setPreservedRound] = useState<number>(0);
  const [appliedRecommendations, setAppliedRecommendations] = useState<Set<string>>(new Set());
  const [applyingRecommendation, setApplyingRecommendation] = useState<string | null>(null);
  const [isUpdatingStrategy, setIsUpdatingStrategy] = useState(false);

  // Changeable properties state
  const [changeableProperties, setChangeableProperties] = useState<ChangeableProperty[]>([
    {
      key: 'usesMFA',
      label: 'Multi-Factor Authentication',
      description: 'Enable MFA for system access',
      changeable: true
    },
    {
      key: 'allowPasswordReuse',
      label: 'Password Reuse Policy',
      description: 'Implement password reuse restrictions',
      changeable: true
    },
    {
      key: 'devicesWithFirewall',
      label: 'Firewall Coverage',
      description: 'Increase firewall deployment across devices',
      changeable: true
    },
    {
      key: 'governanceLevel',
      label: 'Governance Level',
      description: 'Improve security governance practices',
      changeable: true
    },
    {
      key: 'hasITTeam',
      label: 'IT Team Presence',
      description: 'Establish dedicated IT team',
      changeable: false
    },
    {
      key: 'networkType',
      label: 'Network Infrastructure',
      description: 'Modify network architecture',
      changeable: false
    },
    {
      key: 'phishingFailRate',
      label: 'Security Training Effectiveness',
      description: 'Improve security awareness training',
      changeable: true
    }
  ]);

  // Active tab state for the new section
  const [activeTab, setActiveTab] = useState(0);

  // Add new state for chatbot service
  const [chatbotService, setChatbotService] = useState<ChatbotService | null>(null);
  const [isChatInitialized, setIsChatInitialized] = useState(false);
  const [isVisualDialogOpen, setIsVisualDialogOpen] = useState(false);
  const [showRiskNumbers, setShowRiskNumbers] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const sections = ['Basic Info', 'Structure', 'Technical', 'Security'];
  const sectionDescriptions = [
    'The Overall Information of the Project - This section collects the overall information of the project through all phases. It is suggested that a project manager familiar with the overall project finish this section.',
    'The Structure of a Construction Project - The statistical structural features of a project, such as the number of teams and teams overlapping, provide valuable insights into the project\'s composition and communication patterns. It is suggested to finish this section by a project manager.',
    'IT Factors - The IT features set focuses on digital assets, such as hardware, software, and data, and the people who operate on them. When completing this section, please focus on the phase of the project you are involved in and consider both your team and any subcontractors. It is advisable to collaborate with an IT professional.',
    'Management and Human Factors - These factors include leadership commitment, workforce knowledge, corporate governance, ethical practices, and stakeholder engagement. They establish a strong cybersecurity foundation and promote a culture of security within the project. It is suggested to be completed by a project manager from your company involved in this project.'
  ];

  const generateRandomResults = (): RiskResults => {
    const generateRandomAnalysis = (): RiskAnalysis => {
      const score = Math.floor(Math.random() * 101);
      let level: 'low' | 'medium' | 'high' | 'critical';
      if (score < 30) level = 'low';
      else if (score < 60) level = 'medium';
      else if (score < 85) level = 'high';
      else level = 'critical';

      const recommendations = [
        'Implement basic cybersecurity measures',
        'Conduct regular security audits',
        'Update security policies and procedures'
      ];

      return { score, level, recommendations };
    };

    return {
      ransomware: generateRandomAnalysis(),
      phishing: generateRandomAnalysis(),
      dataBreach: generateRandomAnalysis(),
      insiderAttack: generateRandomAnalysis(),
      supplyChain: generateRandomAnalysis()
    };
  };

  const updateRiskScores = async () => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      if (useRandomResults) {
        const results = generateRandomResults();
        setRiskResults(results);
      } else {
        const results = await riskApiService.calculateRisk(projectInfo);
        setRiskResults(results);
      }
    } catch (error) {
      console.error('Risk calculation failed:', error);
      setApiError((error as Error).message || 'Failed to calculate risk scores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProjectInfo) => async (
    event: SelectChangeEvent<string>
  ) => {
    const updatedProjectInfo = {
      ...projectInfo,
      [field]: event.target.value,
    };
    setProjectInfo(updatedProjectInfo);
    
    // Only update risk scores if form is complete
    const requiredFields = [
      'projectDuration', 'projectType', 'hasCyberLegalTeam', 'companyScale', 'projectPhase',
      'teamOverlap', 'hasITTeam', 'devicesWithFirewall', 'networkType', 'phishingFailRate',
      'governanceLevel', 'allowPasswordReuse', 'usesMFA'
    ];
    
    const basicFieldsComplete = requiredFields.every(field => 
      updatedProjectInfo[field as keyof ProjectInfo] && updatedProjectInfo[field as keyof ProjectInfo] !== ''
    );
    
    const hasAtLeastOneTeam = [1, 2, 3].some(layer => {
      const value = updatedProjectInfo[`layer${layer}Teams` as keyof ProjectInfo];
      return value && value !== 'na' && value !== '';
    });
    
    if (basicFieldsComplete && hasAtLeastOneTeam) {
      setIsLoading(true);
      setApiError(null);
      
      try {
        if (useRandomResults) {
          const results = generateRandomResults();
          setRiskResults(results);
        } else {
          const results = await riskApiService.calculateRisk(updatedProjectInfo);
          setRiskResults(results);
        }
        
        // Also regenerate mitigation strategy if it exists
        if (riskMitigationStrategy) {
          console.log('🔄 Form field changed - regenerating mitigation strategy');
          await generateMitigationWithUpdatedData(updatedProjectInfo);
        }
        
      } catch (error) {
        console.error('Risk calculation failed:', error);
        setApiError((error as Error).message || 'Failed to calculate risk scores');
      } finally {
        setIsLoading(false);
      }
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
      for (let i = 1; i <= 3; i++) {
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
    } catch (error) {
      console.error('Error generating PDF:', error);
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
      <Card
        sx={{
            position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          background: `linear-gradient(135deg, ${getRiskColor(analysis.level)}15, ${getRiskColor(analysis.level)}05)`,
          border: `2px solid ${getRiskColor(analysis.level)}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${getRiskColor(analysis.level)}40`,
          }
        }}
      >
        <CardContent sx={{ p: 2, textAlign: 'center' }}>
          {/* Risk Category Title */}
          <Typography 
            variant="subtitle1" 
            fontWeight="bold" 
              sx={{ 
              mb: 1.5,
              color: 'text.primary',
              fontSize: '0.95rem'
            }}
          >
            {risk.charAt(0).toUpperCase() + risk.slice(1).replace(/([A-Z])/g, ' $1')}
          </Typography>

          {/* Risk Level/Score Display */}
          <Box sx={{ position: 'relative', mb: 1.5 }}>
              <Box
                sx={{
                width: 60,
                height: 60,
                  borderRadius: '50%',
                background: `linear-gradient(135deg, ${getRiskColor(analysis.level)}, ${getRiskColor(analysis.level)}CC)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                margin: '0 auto',
                boxShadow: `0 4px 20px ${getRiskColor(analysis.level)}40`,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 2,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                }
                }}
              >
                <motion.div
                key={showRiskNumbers ? analysis.score : analysis.level}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {showRiskNumbers ? (
          <Typography
                    variant="h4" 
                    component="div" 
            sx={{ 
                      lineHeight: 1, 
                      fontWeight: 'bold',
                      fontSize: '1.8rem'
            }}
          >
                    {Math.round(analysis.score)}%
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
            {analysis.level.toUpperCase()}
          </Typography>
                )}
        </motion.div>
      </Box>
          </Box>

          {/* Risk Level Badge */}
          <Chip
            label={analysis.level.toUpperCase()}
            size="small"
            sx={{
              bgcolor: getRiskColor(analysis.level),
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              '& .MuiChip-label': {
                px: 1.5
              }
            }}
          />
        </CardContent>

        {/* Decorative Corner Element */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 30,
            height: 30,
            background: `linear-gradient(135deg, ${getRiskColor(analysis.level)}, transparent)`,
            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
            opacity: 0.3
          }}
        />
      </Card>
    </motion.div>
  );

  // Calculate average risk score
  const calculateAverageRisk = (): { score: number; level: 'low' | 'medium' | 'high' | 'critical' } => {
    const scores = Object.values(riskResults).map(r => r.score);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    let level: 'low' | 'medium' | 'high' | 'critical';
    if (avgScore < 30) level = 'low';
    else if (avgScore < 60) level = 'medium';
    else if (avgScore < 85) level = 'high';
    else level = 'critical';
    
    return { score: avgScore, level };
  };

  // Prepare data for spider chart
  const getSpiderChartData = () => {
    return [
      {
        risk: 'Ransomware',
        value: riskResults.ransomware.score,
        level: riskResults.ransomware.level,
        fullMark: 100
      },
      {
        risk: 'Phishing',
        value: riskResults.phishing.score,
        level: riskResults.phishing.level,
        fullMark: 100
      },
      {
        risk: 'Data Breach',
        value: riskResults.dataBreach.score,
        level: riskResults.dataBreach.level,
        fullMark: 100
      },
      {
        risk: 'Insider Attack',
        value: riskResults.insiderAttack.score,
        level: riskResults.insiderAttack.level,
        fullMark: 100
      },
      {
        risk: 'Supply Chain',
        value: riskResults.supplyChain.score,
        level: riskResults.supplyChain.level,
        fullMark: 100
      }
    ];
  };

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
            <Typography variant="h5" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssessmentIcon color="primary" />
              Risk Analysis Results
            </Typography>

            {/* Average Risk Score */}
            <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
              <Typography variant="h6" gutterBottom align="center">
                Overall Risk Assessment
              </Typography>
              {(() => {
                const avgRisk = calculateAverageRisk();
                return (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: '100%', position: 'relative' }}>
                      <LinearProgress
                        variant="determinate"
                        value={avgRisk.score}
                        sx={{
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 10,
                            backgroundColor: getRiskColor(avgRisk.level),
                          }
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: 'white',
                          fontWeight: 'bold',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                        }}
                      >
                        {avgRisk.level.toUpperCase()} RISK
                      </Typography>
                    </Box>
                  </Box>
                );
              })()}
            </Box>

            {/* Spider Chart and Individual Risk Levels */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: 4,
              width: '100%',
              maxWidth: 1200
            }}>
              {/* Spider Chart */}
            <Box sx={{ 
              display: 'flex', 
                flexDirection: 'column', 
              alignItems: 'center',
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 2
              }}>
                <Typography variant="h6" gutterBottom>
                  Risk Profile Overview
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={getSpiderChartData()}>
                    <PolarGrid gridType="polygon" />
                    <PolarAngleAxis 
                      dataKey="risk" 
                      tick={{ fontSize: 12, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10 }}
                      tickCount={5}
                    />
                    <Radar
                      name="Risk Level"
                      dataKey="value"
                      stroke="#4f46e5"
                      fill="#4f46e5"
                      fillOpacity={0.3}
                      strokeWidth={3}
                      dot={{ fill: '#4f46e5', strokeWidth: 2, r: 6 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>

              {/* Individual Risk Levels */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 2,
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 2
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Risk Categories
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showRiskNumbers}
                        onChange={(e) => setShowRiskNumbers(e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        Show Numbers
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />
                </Box>

                {/* AI Disclaimer */}
                {showRiskNumbers && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mb: 2,
                      '& .MuiAlert-message': { fontSize: '0.8rem' }
                    }}
                    icon={<SmartToyIcon fontSize="small" />}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                      <strong>Note:</strong> Risk levels (Low, Medium, High, Critical) provide more reliable guidance than specific percentages. 
                      Use numerical scores as relative indicators rather than absolute measurements.
                    </Typography>
                  </Alert>
                )}

                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                  gap: 2,
                  maxWidth: 600,
                  mx: 'auto'
            }}>
              {Object.entries(riskResults).map(([risk, analysis]) => (
                <RiskIndicator key={risk} risk={risk} analysis={analysis} />
              ))}
                </Box>
              </Box>
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
    tooltip: React.ReactNode; 
    children: React.ReactNode;
  }) => (
    <Box sx={{ flex: '1 1 300px', minWidth: 0, position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" component="span">
          {label}
        </Typography>
        <Tooltip 
          title={
            <TooltipContent>
              {tooltip}
            </TooltipContent>
          } 
          arrow 
          placement="top"
        >
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
          tooltip={
            <>
              <Typography variant="body2">
                The total planned duration of your project from start to completion.
              </Typography>
              <Typography variant="body2">
                This helps assess the exposure window for potential cyber threats and the complexity of maintaining security over time.
              </Typography>
            </>
          }
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
          tooltip={
            <>
              <Typography variant="body2">
                Project type categorizes construction projects based on characteristics, industry sectors, or focus areas.
              </Typography>
              <Typography variant="body2">
                Different project types involve varying levels of risk and cybersecurity challenges due to factors like data type, scale, critical infrastructure, and information sensitivity.
              </Typography>
              <Typography variant="body2">Categories:</Typography>
              <ul>
                <li>Transportation Infrastructure: roads, bridges, tunnels, airports, railways</li>
                <li>Government Facilities: office buildings, courthouses, police stations</li>
                <li>Healthcare Infrastructure: hospitals, clinics, medical centers</li>
                <li>Commercial Construction: shopping centers, office buildings, hotels</li>
                <li>Residential Construction: apartment buildings, housing estates</li>
              </ul>
            </>
          }
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.projectType}
              onChange={handleInputChange('projectType')}
            >
              <MenuItem value="transportation">Transportation Infrastructure Projects</MenuItem>
              <MenuItem value="government">Government Facilities Projects</MenuItem>
              <MenuItem value="healthcare">Healthcare Infrastructure Projects</MenuItem>
              <MenuItem value="commercial">Commercial Construction Projects</MenuItem>
              <MenuItem value="residential">Residential Construction Projects</MenuItem>
              <MenuItem value="other">Other types</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Cybersecurity Legal Team"
          tooltip={
            <>
              <Typography variant="body2">
                A dedicated cybersecurity legal team ensures compliance, guides legal requirements, and supports incident response efforts.
              </Typography>
              <Typography variant="body2">Their responsibilities include:</Typography>
              <ul>
                <li>Contract and vendor management</li>
                <li>Risk mitigation</li>
                <li>Intellectual property protection</li>
                <li>Legal compliance oversight</li>
              </ul>
              <Typography variant="body2">
                Having such a team is crucial for compliance, data privacy, incident response, and legal protection.
              </Typography>
            </>
          }
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
          tooltip={
            <>
              <Typography variant="body2">
                Company scale is a critical risk factor. The total number of employees in your organization affects cybersecurity risk management capabilities, resource allocation, and the complexity of security implementation.
              </Typography>
              <Typography variant="body2">
                Understanding scale helps identify areas needing additional security controls to manage cybersecurity risks effectively.
              </Typography>
            </>
          }
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
          tooltip={
            <>
              <Typography variant="body2">
                Cyber risks differ by construction phase.
              </Typography>
              <Typography variant="body2">Examples of phase-specific risks:</Typography>
              <ul>
                <li>Planning/Design: Attackers stealing project information for espionage</li>
                <li>Construction: Targeting vulnerable networks or systems</li>
                <li>Each phase presents unique cybersecurity challenges and threat vectors</li>
              </ul>
            </>
          }
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
        <>
          <Alert 
            severity="info" 
            sx={{ mb: 2 }}
            iconMapping={{
              info: <></>, // Remove the default info icon
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <IconButton 
                size="small" 
                color="info"
                onClick={() => setIsVisualDialogOpen(true)}
                sx={{ p: 0.25, mt: -0.25 }}
              >
                <InfoIcon fontSize="small" />
              </IconButton>
              <Box sx={{ flex: 1 }}>
          <Typography variant="body2">
                  <strong>Project Structure Analysis:</strong> Every construction project can be thought of as having layers, which represent different teams and their relationships:
          </Typography>
                <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                  <li>
                    <Typography variant="body2">
                      Layer 1 (innermost): Main project teams with direct control and typically stronger cybersecurity resources
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Layer 2 & 3: Sub-teams or sub-contractors, often with varying levels of cybersecurity capabilities
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      If your project doesn't have sub-teams or sub-contractors, you would only use Layer 1
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Click the info icon for a visual reference diagram
                    </Typography>
                  </li>
                </Box>
              </Box>
            </Box>
        </Alert>

          <Dialog
            open={isVisualDialogOpen}
            onClose={() => setIsVisualDialogOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }
            }}
          >
            <DialogTitle sx={{ 
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <SecurityIcon color="info" />
              Project Structure Visualization
            </DialogTitle>
            <DialogContent>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                p: 2 
              }}>
                <img 
                  src={visualImage}
                  alt="Project Structure Visualization" 
                  style={{ 
                    width: '100%',
                    maxWidth: '800px',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 3, maxWidth: '600px', textAlign: 'center' }}>
                  This diagram illustrates how project teams are organized in layers. The innermost layer (Layer 1) represents main project teams, while outer layers (Layer 2 & 3) represent sub-teams and sub-contractors with varying levels of cybersecurity capabilities.
                </Typography>
              </Box>
            </DialogContent>
          </Dialog>
        </>
        
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 2,
            width: '100%'
          }}
        >
          {[1, 2, 3].map((layer) => (
            <FormFieldWithTooltip
              key={layer}
              label={`Layer ${layer} Teams`}
              tooltip={
                <>
                  <Typography variant="body2">
                    Number of teams in Layer {layer}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                    {layer === 1 ? (
                      'These are your main project teams that have direct control and typically stronger cybersecurity resources. Every project has at least one Layer 1 team.'
                    ) : layer === 2 ? (
                      'These are your first-level sub-teams or sub-contractors. Select "Not Applicable" if you don\'t have any sub-teams.'
                    ) : (
                      'These are your second-level sub-teams or sub-contractors. Select "Not Applicable" if you don\'t have this level of sub-teams.'
                    )}
                  </Typography>
                  <Typography variant="body2">Key points:</Typography>
                  <ul>
                    <li>Select the number of teams in this layer</li>
                    <li>Choose "Not Applicable" if you don't have teams in this layer</li>
                    <li>For large projects, provide your best estimate</li>
                    <li>Include both internal teams and contractors in your count</li>
                  </ul>
                </>
              }
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
                  <MenuItem value="na">Not Applicable</MenuItem>
                </Select>
              </FormControl>
            </FormFieldWithTooltip>
          ))}
        </Box>

        <Box sx={{ mt: 2 }}>
          <FormFieldWithTooltip
            label="Team Overlap Percentage"
            tooltip={
              <>
                <Typography variant="body2">
                  The percentage of teams working on multiple projects simultaneously (overlap) increases cyber risks through shared resources, people, and potential security gaps.
                </Typography>
                <Typography variant="body2">
                  Please indicate the percentage of project teams that overlap in different projects.
                </Typography>
                <Typography variant="body2">
                  If you're unsure about teams beyond your company, please provide information for your company and subcontractors involved in the project.
                </Typography>
              </>
            }
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
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          <Typography variant="body2">
            <strong>IT Factors Focus:</strong> Please consider the selected phase of the project that you are involved in when answering the questions in this section. The questions are tailored to your selected phase rather than the overall project. Consider both your team and any subcontractors.
          </Typography>
        </Alert>

        <FormFieldWithTooltip
          label="Dedicated IT Team"
          tooltip={
            <>
              <Typography variant="body2">
                This factor evaluates the presence of a dedicated IT team specifically assigned to the project, consisting of professionals from your company and subcontractors.
              </Typography>
              <Typography variant="body2">
                The IT team members can be either from your company or from your subcontractors for the project.
              </Typography>
              <Typography variant="body2">Their involvement promotes:</Typography>
              <ul>
                <li>Effective IT management</li>
                <li>Timely response to security incidents</li>
                <li>Proactive implementation of cybersecurity measures</li>
              </ul>
            </>
          }
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
          tooltip={
            <>
              <Typography variant="body2">
                The percentage of digital devices with firewalls or intrusion detection systems measures network security coverage.
              </Typography>
              <Typography variant="body2">Scope:</Typography>
              <ul>
                <li>All devices connected to project network</li>
                <li>Both company and subcontractor devices</li>
                <li>Active firewall protection</li>
                <li>Intrusion detection systems</li>
              </ul>
              <Typography variant="body2">This metric helps assess:</Typography>
              <ul>
                <li>Network security level</li>
                <li>Adherence to cybersecurity best practices</li>
                <li>Vulnerability exposure</li>
              </ul>
            </>
          }
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
          tooltip={
            <>
              <Typography variant="body2">
                The network type used for the project by your company or your subcontractors.
              </Typography>
              <Typography variant="body2">Types:</Typography>
              <ul>
                <li>Public Network: Open network (like internet), accessible to general public</li>
                <li>Private Network: Restricted network with enhanced security and control</li>
                <li>Hybrid: Combination of both networks</li>
              </ul>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Note: Public networks are more accessible but potentially more vulnerable to cyber threats.
              </Typography>
            </>
          }
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
          tooltip={
            <>
              <Typography variant="body2">
                The percentage of individuals who fail phishing tests after completing mandatory training.
              </Typography>
              <Typography variant="body2">
                Please include all personnel from your company and subcontractors, regardless of their project involvement.
              </Typography>
              <Typography variant="body2">
                The rate measures the percentage of individuals who fail a phishing test for a second time after completing the required training.
              </Typography>
              <Typography variant="body2">
                Phishing tests are simulated attacks designed to assess individuals' susceptibility to phishing emails or other malicious tactics.
              </Typography>
            </>
          }
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
          tooltip={
            <>
              <Typography variant="body2">
                The average level of commitment to corporate governance, ethical practices and cybersecurity policy among your team and subcontractors.
              </Typography>
              <Typography variant="body2">
                This reflects adherence to principles, transparency, accountability, ethical decision-making, and compliance. Strong commitment builds trust, protects stakeholders, and drives project success.
              </Typography>
              <Typography variant="body2">Levels:</Typography>
              <ul>
                <li>Level 1 - Low Commitment: Limited adherence, lack of transparency</li>
                <li>Level 2 - Moderate Commitment: Basic commitment, some transparency</li>
                <li>Level 3 - Average Commitment: Standard cybersecurity measures</li>
                <li>Level 4 - Above Average Commitment: Advanced cybersecurity measures</li>
                <li>Level 5 - Exemplary Commitment: State-of-the-art cybersecurity measures</li>
              </ul>
            </>
          }
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.governanceLevel}
              onChange={handleInputChange('governanceLevel')}
            >
              <MenuItem value="level1">Level 1 - Low Commitment</MenuItem>
              <MenuItem value="level2">Level 2 - Moderate Commitment</MenuItem>
              <MenuItem value="level3">Level 3 - Average Commitment</MenuItem>
              <MenuItem value="level4">Level 4 - Above Average Commitment</MenuItem>
              <MenuItem value="level5">Level 5 - Exemplary Commitment</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Password Reuse Policy"
          tooltip={
            <>
              <Typography variant="body2">
                This assesses whether password reuse is allowed for project-related software, systems, or accounts.
              </Typography>
              <Typography variant="body2">Applies to:</Typography>
              <ul>
                <li>Project management tools</li>
                <li>Email systems</li>
                <li>Internal networks</li>
                <li>File storage</li>
                <li>Other project-related accounts</li>
              </ul>
              <Typography variant="body2">
                Please consider your team and your subcontractors.
              </Typography>
              <Typography variant="body2">Password reuse risks include:</Typography>
              <ul>
                <li>Increased vulnerability to credential stuffing attacks</li>
                <li>Broader system compromise if one password is breached</li>
              </ul>
            </>
          }
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.allowPasswordReuse}
              onChange={handleInputChange('allowPasswordReuse')}
            >
              <MenuItem value="yes">Yes, password reuse is allowed</MenuItem>
              <MenuItem value="no">No, password reuse is not allowed</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Multi-Factor Authentication"
          tooltip={
            <>
              <Typography variant="body2">
                Does internet access within your construction project require Multi-Factor Authentication (MFA) or utilize other methods such as biometrics or face recognition?
              </Typography>
              <Typography variant="body2">
                Please consider your team and your subcontractors.
              </Typography>
              <Typography variant="body2">Benefits:</Typography>
              <ul>
                <li>Adds extra layer of security</li>
                <li>Requires multiple forms of identification</li>
                <li>Protects against unauthorized access</li>
                <li>Enhances overall cybersecurity measures</li>
              </ul>
            </>
          }
        >
          <FormControl fullWidth>
            <Select
              value={projectInfo.usesMFA}
              onChange={handleInputChange('usesMFA')}
            >
              <MenuItem value="yes">Yes, MFA/Biometrics required</MenuItem>
              <MenuItem value="no">No, MFA/Biometrics not required</MenuItem>
            </Select>
          </FormControl>
        </FormFieldWithTooltip>
      </Box>
    ];

    const arrowButtonStyle = (disabled: boolean) => ({
      bgcolor: disabled ? 'background.paper' : '#4f46e5', // New indigo color
      color: disabled ? 'text.disabled' : 'white',
      '&:hover': {
        bgcolor: disabled ? 'background.paper' : '#3c35b5', // Darker shade for hover
        boxShadow: disabled ? 2 : 4,
      },
      boxShadow: 2,
      transition: 'all 0.2s ease',
      width: 44,
      height: 44,
      border: `1px solid ${disabled ? 'rgba(0, 0, 0, 0.12)' : '#4f46e5'}`,
      '& .MuiSvgIcon-root': {
        fontSize: 24,
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
    const hasAtLeastOneTeam = [1, 2, 3].some(layer => {
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
    
    const hasAtLeastOneTeam = [1, 2, 3].some(layer => {
      const value = projectInfo[`layer${layer}Teams` as keyof ProjectInfo];
      return value && value !== 'na' && value !== '';
    });
    
    const totalRequired = requiredFields.length + 1; // +1 for team requirement
    const totalFilled = filledBasicFields + (hasAtLeastOneTeam ? 1 : 0);
    
    return Math.round((totalFilled / totalRequired) * 100);
  };

  // Chatbot functions
  const currentConversation = conversations.find(conv => conv.id === currentConversationId);

  // Initialize chatbot when component mounts or risk results change
  useEffect(() => {
    const initializeChat = async () => {
      console.log('🔄 Chatbot initialization triggered:', {
        hasService: !!chatbotService,
        isFormComplete: isFormComplete(),
        isChatInitialized,
        hasProjectInfo: !!projectInfo.projectType,
        hasRiskResults: Object.values(riskResults).some(r => r.score > 0),
        hasStrategy: !!riskMitigationStrategy
      });

      if (!chatbotService) {
        const service = new ChatbotService();
        setChatbotService(service);
        if (isFormComplete()) {
          console.log('🤖 Initializing chatbot with full data');
          const success = await service.initialize(projectInfo, riskResults, riskMitigationStrategy || undefined);
        setIsChatInitialized(success);
        } else {
          console.log('🤖 Initializing chatbot without data');
          const success = await service.initialize();
          setIsChatInitialized(success);
        }
      } else if (isFormComplete() && !isChatInitialized) {
        console.log('🤖 Re-initializing chatbot with full data');
        const success = await chatbotService.initialize(projectInfo, riskResults, riskMitigationStrategy || undefined);
        setIsChatInitialized(success);
      }
    };

    initializeChat();
  }, [riskResults, riskMitigationStrategy, isFormComplete()]);

  // Update handleChatSend to use the chatbot service
  const handleChatSend = async () => {
    if (!chatInput.trim() || !currentConversation || !chatbotService) return;

    const userMessage: Message = {
      id: currentConversation.messages.length + 1,
      text: chatInput,
      sender: 'user',
      timestamp: new Date(),
    };

    // Update UI immediately with user message
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, userMessage],
          lastUpdated: new Date(),
        };
      }
      return conv;
    }));

    const userInputText = chatInput;
    setChatInput('');
    
    // Show typing animation
    setIsAiTyping(true);

    try {
      // Get response from Gemini
      const aiResponseText = await chatbotService.sendMessage(userInputText);
      
      const aiMessage: Message = {
        id: currentConversation.messages.length + 2,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      // Update conversation with AI response
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, aiMessage],
            lastUpdated: new Date(),
          };
        }
        return conv;
      }));
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      // Add error message to conversation
      const errorMessage: Message = {
        id: currentConversation.messages.length + 2,
        text: "I apologize, but I encountered an error processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, errorMessage],
            lastUpdated: new Date(),
          };
        }
        return conv;
      }));
    } finally {
      // Hide typing animation
      setIsAiTyping(false);
    }
  };

  // Update handleNewChat to reinitialize the chatbot
  const handleNewChat = async () => {
    if (!chatbotService) return;

    const newConversation: Conversation = {
      id: conversations.length + 1,
      title: 'Risk Analysis Chat',
      messages: [],
      lastUpdated: new Date(),
    };

    try {
      // Reinitialize the chatbot with complete project context
      if (isFormComplete()) {
        await chatbotService.initialize(projectInfo, riskResults, riskMitigationStrategy || undefined);
      } else {
        await chatbotService.initialize();
      }

      // Add initial AI message
      const initialMessage: Message = {
        id: 1,
        text: "Hello! I'm Dr. CyberBuild, your expert construction cybersecurity consultant. I have analyzed your project data and I'm ready to provide specialized guidance on enhancing your cybersecurity posture. What would you like to discuss?",
        sender: 'ai',
        timestamp: new Date(),
      };

      newConversation.messages.push(initialMessage);
      
      setConversations([...conversations, newConversation]);
      setCurrentConversationId(newConversation.id);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  // Generate mitigation strategy with specific project info (used after applying changes)
  const generateMitigationWithUpdatedData = async (updatedProjectInfo: ProjectInfo) => {
    try {
      // Convert project info to model input array exactly matching the training data values
      const modelInput = [
        // 1.1 Project Duration (0-4 scale)
        ['<=3m', '3-6m', '6-12m', '12-24m', '>24m']
          .indexOf(updatedProjectInfo.projectDuration),

        // 1.2 Project Type (0-5 scale)
        ['transportation', 'government', 'healthcare', 'commercial', 'residential', 'other']
          .indexOf(updatedProjectInfo.projectType),

        // 1.3 Has Cyber Legal Team (0-2 scale)
        ['yes', 'no', 'unsure'].indexOf(updatedProjectInfo.hasCyberLegalTeam),

        // 1.4 Company Scale (0-4 scale)
        ['<=30', '31-60', '61-100', '101-150', '>150']
          .indexOf(updatedProjectInfo.companyScale),

        // 1.5 Project Phase (0-4 scale)
        ['planning', 'design', 'construction', 'maintenance', 'demolition']
          .indexOf(updatedProjectInfo.projectPhase),

        // 2.1.1 Layer 1 Teams (0-5 scale)
        ['<=10', '11-20', '21-30', '31-40', '>40', 'na']
          .indexOf(updatedProjectInfo.layer1Teams),

        // 2.1.2 Layer 2 Teams (0-5 scale)
        ['<=10', '11-20', '21-30', '31-40', '>40', 'na']
          .indexOf(updatedProjectInfo.layer2Teams),

        // 2.1.3 Layer 3 Teams (0-5 scale)
        ['<=10', '11-20', '21-30', '31-40', '>40', 'na']
          .indexOf(updatedProjectInfo.layer3Teams),

        // 2.2 Team Overlap (0-4 scale)
        ['<=20', '21-40', '41-60', '61-80', '81-100']
          .indexOf(updatedProjectInfo.teamOverlap),

        // 3.1 Has IT Team (0-2 scale)
        ['yes', 'no', 'unsure'].indexOf(updatedProjectInfo.hasITTeam),

        // 3.2 Devices with Firewall (0-4 scale)
        ['<=20', '21-40', '41-60', '61-80', '81-100']
          .indexOf(updatedProjectInfo.devicesWithFirewall),

        // 3.3 Network Type (0-2 scale)
        ['public', 'private', 'both'].indexOf(updatedProjectInfo.networkType),

        // 3.4 Phishing Fail Rate (0-4 scale)
        ['<=20', '21-40', '41-60', '61-80', '81-100']
          .indexOf(updatedProjectInfo.phishingFailRate),

        // 4.1 Governance Level (0-4 scale)
        ['level1', 'level2', 'level3', 'level4', 'level5']
          .indexOf(updatedProjectInfo.governanceLevel),

        // 4.2 Allow Password Reuse (0-1 scale)
        ['yes', 'no'].indexOf(updatedProjectInfo.allowPasswordReuse),

        // 4.3 Uses MFA (0-1 scale)
        ['yes', 'no'].indexOf(updatedProjectInfo.usesMFA)
      ];

      // Call the mitigation strategy API
      const response = await fetch('http://localhost:8000/mitigation-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_data: modelInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Mitigation API Error:', errorData);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const strategy = await response.json();
      console.log('🔄 Mitigation Strategy Response (Updated Data):', strategy);
      console.log('🔄 Updated form data sent to API:', modelInput);
      
      // Convert API response to our interface format
      const convertedStrategy: RiskMitigationStrategy = {
        initialRisk: strategy.initialRisk,
        finalRisk: strategy.finalRisk,
        totalReduction: strategy.totalReduction,
        totalReductionPercentage: strategy.totalReductionPercentage,
        implementationPriority: strategy.implementationPriority,
        rounds: strategy.rounds.map((round: any) => ({
          roundNumber: round.roundNumber,
          features: round.features,
          currentRisk: round.currentRisk,
          projectedRisk: round.projectedRisk,
          riskReduction: round.riskReduction,
          reductionPercentage: round.reductionPercentage,
          recommendations: round.recommendations.map((rec: any) => ({
            featureGroup: rec.featureGroup,
            featureName: rec.featureName,
            currentOption: rec.currentOption,
            recommendedOption: rec.recommendedOption,
            optionIndex: rec.optionIndex,
            description: rec.description
          }))
        }))
      };

      console.log('🔄 Setting updated strategy:', {
        oldInitialRisk: riskMitigationStrategy?.initialRisk,
        newInitialRisk: convertedStrategy.initialRisk,
        oldTotalReduction: riskMitigationStrategy?.totalReductionPercentage,
        newTotalReduction: convertedStrategy.totalReductionPercentage
      });
      
      setRiskMitigationStrategy(convertedStrategy);
      
      // Update chatbot context with new strategy
      if (chatbotService && isChatInitialized) {
        try {
          await chatbotService.updateContext(updatedProjectInfo, undefined, convertedStrategy);
        } catch (error) {
          console.error('Failed to update chatbot context:', error);
        }
      }
      
      // Preserve the current round - no round changes during silent updates
       
     } catch (error) {
       console.error('Risk mitigation analysis failed:', error);
       throw error;
     }
   };

  // Risk mitigation analysis
  const analyzeRiskMitigation = async () => {
    if (!isFormComplete()) return;

    setIsAnalyzingReductions(true);
    
    try {
      // Convert project info to model input array exactly matching the training data values
      const modelInput = [
        // 1.1 Project Duration (0-4 scale)
        ['<=3m', '3-6m', '6-12m', '12-24m', '>24m']
          .indexOf(projectInfo.projectDuration),

        // 1.2 Project Type (0-5 scale)
        ['transportation', 'government', 'healthcare', 'commercial', 'residential', 'other']
          .indexOf(projectInfo.projectType),

        // 1.3 Has Cyber Legal Team (0-2 scale)
        ['yes', 'no', 'unsure'].indexOf(projectInfo.hasCyberLegalTeam),

        // 1.4 Company Scale (0-4 scale)
        ['<=30', '31-60', '61-100', '101-150', '>150']
          .indexOf(projectInfo.companyScale),

        // 1.5 Project Phase (0-4 scale)
        ['planning', 'design', 'construction', 'maintenance', 'demolition']
          .indexOf(projectInfo.projectPhase),

        // 2.1.1 Layer 1 Teams (0-5 scale)
        ['<=10', '11-20', '21-30', '31-40', '>40', 'na']
          .indexOf(projectInfo.layer1Teams),

        // 2.1.2 Layer 2 Teams (0-5 scale)
        ['<=10', '11-20', '21-30', '31-40', '>40', 'na']
          .indexOf(projectInfo.layer2Teams),

        // 2.1.3 Layer 3 Teams (0-5 scale)
        ['<=10', '11-20', '21-30', '31-40', '>40', 'na']
          .indexOf(projectInfo.layer3Teams),

        // 2.2 Team Overlap (0-4 scale)
        ['<=20', '21-40', '41-60', '61-80', '81-100']
          .indexOf(projectInfo.teamOverlap),

        // 3.1 Has IT Team (0-2 scale)
        ['yes', 'no', 'unsure'].indexOf(projectInfo.hasITTeam),

        // 3.2 Devices with Firewall (0-4 scale)
        ['<=20', '21-40', '41-60', '61-80', '81-100']
          .indexOf(projectInfo.devicesWithFirewall),

        // 3.3 Network Type (0-2 scale)
        ['public', 'private', 'both'].indexOf(projectInfo.networkType),

        // 3.4 Phishing Fail Rate (0-4 scale)
        ['<=20', '21-40', '41-60', '61-80', '81-100']
          .indexOf(projectInfo.phishingFailRate),

        // 4.1 Governance Level (0-4 scale)
        ['level1', 'level2', 'level3', 'level4', 'level5']
          .indexOf(projectInfo.governanceLevel),

        // 4.2 Allow Password Reuse (0-1 scale)
        ['yes', 'no'].indexOf(projectInfo.allowPasswordReuse),

        // 4.3 Uses MFA (0-1 scale)
        ['yes', 'no'].indexOf(projectInfo.usesMFA)
      ];

      // Call the mitigation strategy API
      const response = await fetch('http://localhost:8000/mitigation-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_data: modelInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Mitigation API Error:', errorData);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const strategy = await response.json();
      console.log('📊 Initial Mitigation Strategy Response:', strategy);
      console.log('📊 Form data sent to API:', modelInput);
      
             // Convert API response to our interface format
       const convertedStrategy: RiskMitigationStrategy = {
        initialRisk: strategy.initialRisk,
        finalRisk: strategy.finalRisk,
        totalReduction: strategy.totalReduction,
        totalReductionPercentage: strategy.totalReductionPercentage,
        implementationPriority: strategy.implementationPriority,
        rounds: strategy.rounds.map((round: any) => ({
          roundNumber: round.roundNumber,
          features: round.features,
          currentRisk: round.currentRisk,
          projectedRisk: round.projectedRisk,
          riskReduction: round.riskReduction,
          reductionPercentage: round.reductionPercentage,
          recommendations: round.recommendations.map((rec: any) => ({
            featureGroup: rec.featureGroup,
            featureName: rec.featureName,
            currentOption: rec.currentOption,
            recommendedOption: rec.recommendedOption,
            optionIndex: rec.optionIndex,
            description: rec.description
          }))
        }))
      };

      setRiskMitigationStrategy(convertedStrategy);
      
      // Reset applied recommendations when manually refreshing
      setAppliedRecommendations(new Set());
      
      // Reset to overview when refreshing manually
      setSelectedRound(0);
      
    } catch (error) {
      console.error('Risk mitigation analysis failed:', error);
    } finally {
      setIsAnalyzingReductions(false);
    }
  };

  // Apply recommendation to form
  const applyRecommendation = async (recommendation: RiskMitigationRecommendation) => {
    const recommendationId = `${recommendation.featureGroup}-${recommendation.recommendedOption}`;
    setApplyingRecommendation(recommendationId);
    
    try {
      // Map feature groups to form fields
      const fieldMapping: { [key: string]: keyof ProjectInfo } = {
      '1.3': 'hasCyberLegalTeam',
      '2.1.1': 'layer1Teams',
      '2.1.2': 'layer2Teams', 
      '2.1.3': 'layer3Teams',
      '2.2': 'teamOverlap',
      '3.1': 'hasITTeam',
      '3.2': 'devicesWithFirewall',
      '3.3': 'networkType',
      '3.4': 'phishingFailRate',
      '4.1': 'governanceLevel',
      '4.2': 'allowPasswordReuse',
      '4.3': 'usesMFA'
    };

    const fieldKey = fieldMapping[recommendation.featureGroup];
    if (!fieldKey) {
      console.warn(`No field mapping found for feature group: ${recommendation.featureGroup}`);
      return;
    }

    // Map recommended options to form values
    const getFormValue = (featureGroup: string, recommendedOption: string): string => {
      switch (featureGroup) {
        case '1.3': // Cybersecurity Legal Team
          return recommendedOption === 'Yes' ? 'yes' : 'no';
        case '2.1.1': // Layer 1 Teams
        case '2.1.2': // Layer 2 Teams  
        case '2.1.3': // Layer 3 Teams
          if (recommendedOption === '>40') return '>40';
          if (recommendedOption === '31-40') return '31-40';
          if (recommendedOption === '21-30') return '21-30';
          if (recommendedOption === '11-20') return '11-20';
          if (recommendedOption === '≤10') return '<=10';
          return 'na';
        case '2.2': // Team Overlap
          if (recommendedOption === '≤20%') return '<=20';
          if (recommendedOption === '21-40%') return '21-40';
          if (recommendedOption === '41-60%') return '41-60';
          if (recommendedOption === '61-80%') return '61-80';
          return '81-100';
        case '3.1': // IT Team
          return recommendedOption === 'Yes' ? 'yes' : recommendedOption === 'No' ? 'no' : 'unsure';
        case '3.2': // Firewall Coverage
          if (recommendedOption === '81-100%') return '81-100';
          if (recommendedOption === '61-80%') return '61-80';
          if (recommendedOption === '41-60%') return '41-60';
          if (recommendedOption === '21-40%') return '21-40';
          return '<=20';
        case '3.3': // Network Type
          if (recommendedOption === 'Private network') return 'private';
          if (recommendedOption === 'Public network') return 'public';
          return 'both';
        case '3.4': // Phishing Failure Rate
          if (recommendedOption === '≤20%') return '<=20';
          if (recommendedOption === '21-40%') return '21-40';
          if (recommendedOption === '41-60%') return '41-60';
          if (recommendedOption === '61-80%') return '61-80';
          return '81-100';
        case '4.1': // Governance Level
          if (recommendedOption === 'Level 5') return 'level5';
          if (recommendedOption === 'Level 4') return 'level4';
          if (recommendedOption === 'Level 3') return 'level3';
          if (recommendedOption === 'Level 2') return 'level2';
          return 'level1';
        case '4.2': // Password Reuse
          return recommendedOption === 'Not Allowed' ? 'no' : 'yes';
        case '4.3': // MFA
          return recommendedOption === 'Yes' ? 'yes' : 'no';
        default:
          return '';
      }
    };

    const newValue = getFormValue(recommendation.featureGroup, recommendation.recommendedOption);
    
        // Update the form
    const updatedProjectInfo = {
      ...projectInfo,
      [fieldKey]: newValue
    };
    
    setProjectInfo(updatedProjectInfo);

    // Recalculate risk analysis with updated data
    setIsLoading(true);
    setApiError(null);
    
    try {
      if (useRandomResults) {
        const results = generateRandomResults();
        setRiskResults(results);
      } else {
        const results = await riskApiService.calculateRisk(updatedProjectInfo);
        setRiskResults(results);
      }
      
      // Delay the strategy refresh to allow for smooth UI transitions
      setTimeout(async () => {
        const currentRound = selectedRound; // Capture current round before update
        setPreservedRound(currentRound); // Store it separately
        setIsUpdatingStrategy(true);
        
        try {
          console.log('🔧 Refreshing strategy with updated data...', updatedProjectInfo);
          
          // Also recalculate the base risk results to ensure everything is in sync
          if (!useRandomResults) {
            const freshRiskResults = await riskApiService.calculateRisk(updatedProjectInfo);
            setRiskResults(freshRiskResults);
            console.log('🔧 Updated risk results:', freshRiskResults);
          }
          
          // Generate new strategy with the updated form data
          await generateMitigationWithUpdatedData(updatedProjectInfo);
          // Restore the round immediately and consistently
          setSelectedRound(currentRound);
          setIsUpdatingStrategy(false);
        } catch (error) {
          console.error('Strategy update failed:', error);
          setSelectedRound(currentRound); // Restore even on error
          setIsUpdatingStrategy(false);
        }
      }, 1500); // Longer delay to let the user see the "Applied" state
      
      // Mark recommendation as applied with more specific tracking
      const persistentId = `${recommendation.featureGroup}-${recommendation.currentOption}-to-${recommendation.recommendedOption}`;
      setAppliedRecommendations(prev => new Set([...prev, recommendationId, persistentId]));
      
      console.log(`Applied recommendation: ${recommendation.featureName} → ${recommendation.recommendedOption}`);
    } catch (error) {
      console.error('Risk recalculation failed:', error);
      setApiError((error as Error).message || 'Failed to recalculate risk scores');
    } finally {
      setIsLoading(false);
      setApplyingRecommendation(null);
    }
  } catch (error) {
    console.error('Error applying recommendation:', error);
    setApplyingRecommendation(null);
  }
  };

  // Handle changeable property toggle
  const toggleChangeableProperty = (key: string) => {
    setChangeableProperties(prev => 
      prev.map(prop => 
        prop.key === key ? { ...prop, changeable: !prop.changeable } : prop
      )
    );
    // Re-analyze if we have existing results
    if (riskReductions.length > 0) {
      analyzeRiskMitigation();
    }
  };

  // Trigger risk mitigation analysis when form is completed
  useEffect(() => {
    if (isFormComplete() && !riskMitigationStrategy) {
      // This is the initial load - analyzeRiskMitigation already sets to overview
      analyzeRiskMitigation();
    }
  }, [riskResults]);

  // Dev function to auto-fill form with sample data
  const autoFillForm = () => {
    const sampleData: ProjectInfo = {
      // Section 1: Basic Project Information
      projectDuration: '12-24m',
      projectType: 'commercial',
      hasCyberLegalTeam: 'no',
      companyScale: '61-100',
      projectPhase: 'construction',

      // Section 2: Project Structure
      layer1Teams: '11-20',
      layer2Teams: '21-30',
      layer3Teams: '<=10',
      teamOverlap: '41-60',

      // Section 3: Technical Factors
      hasITTeam: 'unsure',
      devicesWithFirewall: '21-40',
      networkType: 'both',
      phishingFailRate: '61-80',

      // Section 4: Security Practices
      governanceLevel: 'level2',
      allowPasswordReuse: 'yes',
      usesMFA: 'no',

      // Additional fields (not used in calculation but part of interface)
      regulatoryRequirements: '',
      stakeholderCount: '',
      thirdPartyVendors: '',
      remoteWorkLevel: '',
      cloudServices: '',
      dataClassification: '',
      bmsIntegration: '',
      accessControl: '',
      securityMonitoring: '',
      incidentResponse: '',
      backupStrategy: '',
      securityCertifications: '',
      securityAwareness: '',
      securityTeamSize: '',
      thirdPartySecurityReq: '',
      securityBudget: ''
    };

    setProjectInfo(sampleData);
    
    if (devMode) {
      console.log('🛠️ Dev Mode: Form auto-filled with sample data', sampleData);
    }
  };

  // Dev function to clear all form data
  const clearForm = () => {
    setProjectInfo({
      projectDuration: '', projectType: '', hasCyberLegalTeam: '', companyScale: '', projectPhase: '',
      layer1Teams: '', layer2Teams: '', layer3Teams: '', teamOverlap: '', hasITTeam: '', devicesWithFirewall: '', networkType: '',
      phishingFailRate: '', governanceLevel: '', allowPasswordReuse: '', usesMFA: '',
      regulatoryRequirements: '', stakeholderCount: '', thirdPartyVendors: '', remoteWorkLevel: '',
      cloudServices: '', dataClassification: '', bmsIntegration: '', accessControl: '',
      securityMonitoring: '', incidentResponse: '', backupStrategy: '', securityCertifications: '',
      securityAwareness: '', securityTeamSize: '', thirdPartySecurityReq: '', securityBudget: ''
    });
    setRiskReductions([]);
    
    if (devMode) {
      console.log('🛠️ Dev Mode: Form cleared');
    }
  };

  // Export chat functionality
  const handleExportChat = () => {
    if (!currentConversation) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let yOffset = 20;

    // Add header with logo and title
    doc.setFillColor(79, 70, 229); // Primary indigo color
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Add title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Analysis Chat Export', pageWidth / 2, 25, { align: 'center' });
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 35, { align: 'center' });
    
    // Reset text color for content
    doc.setTextColor(0, 0, 0);
    yOffset = 60;

    // Add risk context section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Assessment Context', margin, yOffset);
    yOffset += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const riskSummary = Object.entries(riskResults)
      .map(([risk, analysis]) => `${risk}: ${analysis.score}% (${analysis.level})`)
      .join(', ');
    const wrappedRiskSummary = doc.splitTextToSize(riskSummary, contentWidth);
    doc.text(wrappedRiskSummary, margin, yOffset);
    yOffset += wrappedRiskSummary.length * 5 + 15;

    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yOffset, pageWidth - margin, yOffset);
    yOffset += 15;

    // Add conversation content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Conversation History', margin, yOffset);
    yOffset += 20;

    currentConversation.messages.forEach((message, index) => {
      const sender = message.sender === 'user' ? 'You' : 'AI Assistant';
      const timestamp = message.timestamp.toLocaleString();
      
      // Add message header
      if (message.sender === 'user') {
        doc.setFillColor(79, 70, 229); // Primary indigo for user
      } else {
        doc.setFillColor(6, 182, 212); // Secondary cyan for AI
      }
      doc.roundedRect(margin, yOffset, contentWidth, 15, 3, 3, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(sender, margin + 5, yOffset + 10);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(timestamp, pageWidth - margin - 5, yOffset + 10, { align: 'right' });
      
      yOffset += 20;

      // Add message content
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      const splitText = doc.splitTextToSize(message.text, contentWidth - 10);
      doc.text(splitText, margin + 5, yOffset);
      yOffset += splitText.length * 6 + 15;

      // Add separator line
      if (index < currentConversation.messages.length - 1) {
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, yOffset, pageWidth - margin, yOffset);
        yOffset += 10;
      }

      // Add new page if needed
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });

    // Add footer
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} of ${totalPages} | Risk Analysis Chat Export | ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`risk-analysis-chat-${currentConversation.id}-${new Date().toISOString().split('T')[0]}.pdf`);
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

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}>
          <Tooltip title="Enable development tools: auto-fill form, clear form, and show debug info" arrow>
            <FormControlLabel
              control={
                <Switch
                  checked={devMode}
                  onChange={(e) => setDevMode(e.target.checked)}
                  color="secondary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <DeveloperModeIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Dev Mode
                  </Typography>
                </Box>
              }
            />
          </Tooltip>
          {devMode && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useRandomResults}
                    onChange={(e) => setUseRandomResults(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    {useRandomResults ? 'Using Random Results' : 'Using AI Model'}
                  </Typography>
                }
              />
              <Divider orientation="vertical" flexItem />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={autoFillForm}
                  color="success"
                >
                  Auto-Fill Form
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearForm}
                  color="error"
                >
                  Clear Form
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Dev Info Panel */}
        {devMode && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>🛠️ Dev Mode Active</strong> | 
              Form Completion: {getCompletionPercentage()}% | 
              Form Valid: {isFormComplete() ? '✅' : '❌'} | 
              Risk Results: {Object.values(riskResults).some(r => r.score > 0) ? '✅' : '❌'}
            </Typography>
          </Alert>
        )}
        
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

        {/* Risk Analysis Tools Section - appears after form completion */}
        {isFormComplete() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoFixHighIcon color="primary" />
                Risk Analysis Tools
              </Typography>
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                  <Tab 
                    label="Risk Reduction" 
                    icon={<TrendingDownIcon />} 
                    iconPosition="start"
                    sx={{ textTransform: 'none' }}
                  />
                  <Tab 
                    label="AI Assistant" 
                    icon={<SmartToyIcon />} 
                    iconPosition="start"
                    sx={{ textTransform: 'none' }}
                  />
                </Tabs>
              </Box>

              {/* Risk Reduction Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Risk Mitigation Strategy
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    AI-powered analysis of optimal security improvements organized in implementation rounds for maximum risk reduction:
                  </Typography>

                  {(isAnalyzingReductions && !isUpdatingStrategy && !riskMitigationStrategy) ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                      <CircularProgress sx={{ mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        Analyzing optimal risk mitigation strategy...
                    </Typography>
                    </Box>
                  ) : riskMitigationStrategy ? (
                    <Box sx={{ position: 'relative' }}>
                      {/* Subtle overlay during strategy updates */}
                      <AnimatePresence>
                        {isUpdatingStrategy && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(255, 255, 255, 0.7)',
                              backdropFilter: 'blur(2px)',
                              zIndex: 10,
                          display: 'flex', 
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 8,
                            }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                          gap: 2,
                              p: 3,
                              borderRadius: 2,
                              bgcolor: 'white',
                              boxShadow: 2
                            }}>
                              <CircularProgress size={24} />
                              <Typography variant="body2" color="text.secondary">
                                Updating strategy...
                              </Typography>
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <Box>
                      {/* Strategy Overview */}
                      <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AutoFixHighIcon />
                          Mitigation Strategy Overview
                           </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" fontWeight="bold">
                                {(riskMitigationStrategy.totalReductionPercentage).toFixed(1)}%
                                     </Typography>
                              <Typography variant="body2">Total Risk Reduction</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" fontWeight="bold">
                                {riskMitigationStrategy.rounds.length}
                                         </Typography>
                              <Typography variant="body2">Implementation Rounds</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" fontWeight="bold">
                                {(riskMitigationStrategy.initialRisk * 100).toFixed(0)}%
                                         </Typography>
                              <Typography variant="body2">Initial Risk</Typography>
                                       </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" fontWeight="bold">
                                {(riskMitigationStrategy.finalRisk * 100).toFixed(0)}%
                                         </Typography>
                              <Typography variant="body2">Final Risk</Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>

                      {/* Round Selection */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Implementation Rounds
                                         </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label="Overview"
                            onClick={() => !isUpdatingStrategy && setSelectedRound(0)}
                            color={selectedRound === 0 ? "primary" : "default"}
                            variant={selectedRound === 0 ? "filled" : "outlined"}
                            disabled={isUpdatingStrategy}
                          />
                          {riskMitigationStrategy.rounds.map((round) => (
                            <Chip
                              key={round.roundNumber}
                              label={`Round ${round.roundNumber}`}
                              onClick={() => !isUpdatingStrategy && setSelectedRound(round.roundNumber)}
                              color={selectedRound === round.roundNumber ? "primary" : "default"}
                              variant={selectedRound === round.roundNumber ? "filled" : "outlined"}
                              disabled={isUpdatingStrategy}
                            />
                          ))}
                                       </Box>
                                     </Box>

                      {/* Round Content */}
                      {(isUpdatingStrategy ? preservedRound : selectedRound) === 0 ? (
                        // Overview of all rounds
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Implementation Roadmap
                                     </Typography>
                          {riskMitigationStrategy.rounds.map((round, index) => (
                            <Card key={round.roundNumber} sx={{ mb: 2 }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                  <Typography variant="h6">
                                    Round {round.roundNumber}
                                     </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                     <Chip
                                      label={`-${round.reductionPercentage.toFixed(1)}%`}
                                       color="success"
                            size="small"
                                    />
                                    <Button
                                      size="small"
                                      onClick={() => setSelectedRound(round.roundNumber)}
                                    >
                                      View Details
                                    </Button>
                                   </Box>
                                 </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  Focus Areas: {round.features.join(', ')}
                                </Typography>
                                <Box sx={{ position: 'relative', mb: 1 }}>
                                  {/* Multi-segment progress bar */}
                                  <Box
                            sx={{
                                      height: 12,
                                      borderRadius: 6,
                                      bgcolor: 'grey.200',
                                      position: 'relative',
                                      overflow: 'hidden',
                                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                                    }}
                                  >
                                                                         {/* Risk level after round implementation */}
                                     <Box
                                       sx={{
                                         height: '100%',
                                         width: `${(round.projectedRisk * 100)}%`,
                                         background: (() => {
                                           const riskPercent = round.projectedRisk * 100;
                                           if (riskPercent < 30) {
                                             return 'linear-gradient(90deg, #4caf50, #66bb6a)'; // Low risk - Green
                                           } else if (riskPercent < 60) {
                                             return 'linear-gradient(90deg, #ff9800, #ffb74d)'; // Medium risk - Orange
                                           } else if (riskPercent < 85) {
                                             return 'linear-gradient(90deg, #f44336, #ef5350)'; // High risk - Red
                                           } else {
                                             return 'linear-gradient(90deg, #d32f2f, #c62828)'; // Critical risk - Dark Red
                                           }
                                         })(),
                                        borderRadius: 6,
                                        position: 'relative',
                                        transition: 'all 0.3s ease-in-out',
                                        '&::after': {
                                          content: '""',
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          bottom: 0,
                                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                          animation: 'shimmer 2s infinite',
                                          '@keyframes shimmer': {
                                            '0%': { transform: 'translateX(-100%)' },
                                            '100%': { transform: 'translateX(100%)' }
                                          }
                              }
                            }}
                          />
                                    
                                    {/* Progress text overlay */}
                                    <Box
                              sx={{ 
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                           color: 'white',
                                           fontWeight: 'bold',
                                           fontSize: '0.7rem',
                                           textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                           zIndex: 1
                                         }}
                                       >
                                         {(round.projectedRisk * 100).toFixed(0)}% Risk
                            </Typography>
                          </Box>
                        </Box>
                                  
                                                                     {/* Risk level indicators */}
                                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                     <Typography variant="caption" color="text.secondary">
                                       Reduction: {round.reductionPercentage.toFixed(1)}% → {(round.projectedRisk * 100).toFixed(0)}% risk remaining
                      </Typography>
                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                       <Box
                                         sx={{
                                           width: 8,
                                           height: 8,
                                           borderRadius: '50%',
                                           bgcolor: (() => {
                                             const riskPercent = round.projectedRisk * 100;
                                             if (riskPercent < 30) return '#4caf50';      // Low risk - Green
                                             else if (riskPercent < 60) return '#ff9800'; // Medium risk - Orange  
                                             else if (riskPercent < 85) return '#f44336'; // High risk - Red
                                             else return '#d32f2f';                       // Critical risk - Dark Red
                                           })()
                                         }}
                                       />
                                       <Typography variant="caption" color="text.secondary">
                                         {(() => {
                                           const riskPercent = round.projectedRisk * 100;
                                           if (riskPercent < 30) return 'Low Risk';
                                           else if (riskPercent < 60) return 'Medium Risk';
                                           else if (riskPercent < 85) return 'High Risk';
                                           else return 'Critical Risk';
                                         })()}
                                         </Typography>
                                       </Box>
                                       </Box>
                                     </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                  Risk: {(round.currentRisk * 100).toFixed(0)}% → {(round.projectedRisk * 100).toFixed(0)}%
                                     </Typography>
                              </CardContent>
                               </Card>
                             ))}
                           </Box>
                      ) : (
                        // Specific round details
                        (() => {
                          const currentRoundNumber = isUpdatingStrategy ? preservedRound : selectedRound;
                          const round = riskMitigationStrategy.rounds.find(r => r.roundNumber === currentRoundNumber);
                          if (!round) return null;

                          return (
                         <Box>
                              <Typography variant="h6" gutterBottom>
                                Round {round.roundNumber} - Implementation Details
                           </Typography>
                              
                              {/* Round Stats */}
                              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                                <Grid container spacing={2}>
                                  <Grid item xs={6} sm={3}>
                                    <Typography variant="body2" color="text.secondary">Risk Reduction</Typography>
                                    <Typography variant="h6" color="success.main">
                                      -{round.reductionPercentage.toFixed(1)}%
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={3}>
                                    <Typography variant="body2" color="text.secondary">Current Risk</Typography>
                                    <Typography variant="h6">
                                      {(round.currentRisk * 100).toFixed(0)}%
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={3}>
                                    <Typography variant="body2" color="text.secondary">Projected Risk</Typography>
                                    <Typography variant="h6" color="primary.main">
                                      {(round.projectedRisk * 100).toFixed(0)}%
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={3}>
                                    <Typography variant="body2" color="text.secondary">Focus Areas</Typography>
                                    <Typography variant="h6">
                                      {round.features.length}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Paper>

                              {/* Recommendations */}
                              <Typography variant="subtitle1" gutterBottom>
                                Recommended Changes
                           </Typography>
                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {round.recommendations.map((rec, index) => {
                                  const recommendationId = `${rec.featureGroup}-${rec.recommendedOption}`;
                                  const persistentId = `${rec.featureGroup}-${rec.currentOption}-to-${rec.recommendedOption}`;
                                  // Check if this recommendation was applied via user interaction only
                                  const isApplied = appliedRecommendations.has(recommendationId) || 
                                                  appliedRecommendations.has(persistentId);
                                  
                                  return (
                                    <motion.div
                                      key={index}
                                      layout
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ 
                                        opacity: 1, 
                                        y: 0,
                                        scale: isApplied ? [1, 1.02, 1] : 1,
                                      }}
                                      transition={{ 
                                        duration: 0.3,
                                        delay: index * 0.1,
                                        scale: { duration: 0.5, times: [0, 0.5, 1] }
                                      }}
                                    >
                                                                             <Card 
                                         variant="outlined" 
                                         sx={{
                                           position: 'relative',
                                           overflow: 'hidden',
                                           ...(isApplied && {
                                   bgcolor: (theme) => theme.palette.mode === 'dark' 
                                               ? 'rgba(76, 175, 80, 0.15)' 
                                               : 'success.light',
                                             borderColor: 'success.main',
                                             boxShadow: (theme) => theme.palette.mode === 'dark'
                                               ? '0 0 20px rgba(76, 175, 80, 0.4)'
                                               : '0 0 20px rgba(76, 175, 80, 0.3)',
                                             color: (theme) => theme.palette.mode === 'dark' 
                                               ? 'success.light' 
                                               : 'inherit',
                                           })
                                         }}
                                      >
                                                                                 {isApplied && (
                                           <Box
                                             sx={{
                                               position: 'absolute',
                                               top: 0,
                                               left: 0,
                                               right: 0,
                                               height: 4,
                                               bgcolor: 'success.main',
                                               background: (theme) => theme.palette.mode === 'dark'
                                                 ? 'linear-gradient(90deg, #66bb6a, #a5d6a7, #66bb6a)'
                                                 : 'linear-gradient(90deg, #4caf50, #81c784, #4caf50)',
                                               backgroundSize: '200% 100%',
                                               animation: 'shimmer 2s infinite',
                                               '@keyframes shimmer': {
                                                 '0%': { backgroundPosition: '-200% 0' },
                                                 '100%': { backgroundPosition: '200% 0' }
                                               }
                                             }}
                                           />
                                         )}
                                        <CardContent>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                   <Box sx={{ flex: 1 }}>
                                     <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            {rec.featureName}
                                     </Typography>
                                          <Typography 
                                            variant="body2" 
                                            sx={{ 
                                              mb: 2,
                                              color: isApplied 
                                                ? (theme) => theme.palette.mode === 'dark' 
                                                  ? 'rgba(255, 255, 255, 0.8)' 
                                                  : 'text.secondary'
                                                : 'text.secondary'
                                            }}
                                          >
                                            {rec.description}
                                          </Typography>
                                        </Box>
                                        {(() => {
                                          const recommendationId = `${rec.featureGroup}-${rec.recommendedOption}`;
                                          const persistentId = `${rec.featureGroup}-${rec.currentOption}-to-${rec.recommendedOption}`;
                                          const isApplied = appliedRecommendations.has(recommendationId) || 
                                                          appliedRecommendations.has(persistentId);
                                          const isAlreadySet = rec.currentOption === rec.recommendedOption;
                                          const isApplying = applyingRecommendation === recommendationId;
                                          
                                          return (
                                            <Button
                                              variant={isApplied ? "outlined" : isAlreadySet ? "outlined" : "contained"}
                                              color={isApplied ? "success" : "primary"}
                                              size="small"
                                              onClick={() => !isApplied && !isAlreadySet && !isApplying && !isUpdatingStrategy && applyRecommendation(rec)}
                                              disabled={isApplied || isAlreadySet || isApplying || isUpdatingStrategy}
                                              sx={{ 
                                                ml: 2, 
                                                minWidth: 120,
                                                transition: 'all 0.3s ease-in-out',
                                                ...(isApplied && {
                                                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                                                    ? 'rgba(76, 175, 80, 0.2)'
                                                    : 'success.light',
                                                  color: (theme) => theme.palette.mode === 'dark'
                                                    ? 'success.light'
                                                    : 'success.main',
                                                  borderColor: 'success.main',
                                                  '&:hover': {
                                                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                                                      ? 'rgba(76, 175, 80, 0.25)'
                                                      : 'success.light',
                                                  }
                                                }),
                                                ...(isAlreadySet && !isApplied && {
                                                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                                                    ? 'rgba(158, 158, 158, 0.12)'
                                                    : 'grey.100',
                                                  color: (theme) => theme.palette.mode === 'dark'
                                                    ? 'grey.400'
                                                    : 'grey.600',
                                                  borderColor: (theme) => theme.palette.mode === 'dark'
                                                    ? 'grey.700'
                                                    : 'grey.300',
                                                  '&:hover': {
                                                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                                                      ? 'rgba(158, 158, 158, 0.15)'
                                                      : 'grey.200',
                                                  }
                                                })
                                              }}
                                                                                             startIcon={
                                                 isApplying ? (
                                                   <PulsingLoader size={16} color="inherit" />
                                                 ) : isApplied ? (
                                                   <motion.div
                                                     initial={{ rotate: 0, scale: 0 }}
                                                     animate={{ rotate: 360, scale: 1 }}
                                                     transition={{ 
                                                       duration: 0.6, 
                                                       type: "spring", 
                                                       stiffness: 200,
                                                       delay: 0.1 
                                                     }}
                                                   >
                                                     <CheckIcon />
                                                   </motion.div>
                                                 ) : null
                                               }
                                            >
                                              {isApplying ? (
                                                <motion.div
                                                  initial={{ opacity: 0 }}
                                                  animate={{ opacity: 1 }}
                                                  transition={{ duration: 0.2 }}
                                                >
                                                  Applying...
                                                </motion.div>
                                              ) : isApplied ? (
                                                <motion.div
                                                  initial={{ scale: 0.8, opacity: 0 }}
                                                  animate={{ scale: 1, opacity: 1 }}
                                                  transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                                                >
                                                  Applied
                                                </motion.div>
                                              ) : isAlreadySet ? (
                                                "Already Set"
                                              ) : (
                                                "Apply Change"
                                              )}
                                            </Button>
                                          );
                                        })()}
                                      </Box>
                                      <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                       <Box>
                                         <Typography variant="caption" color="text.secondary" display="block">
                                           Current
                                         </Typography>
                                          <Typography variant="body2" fontWeight="medium">
                                            {rec.currentOption}
                                         </Typography>
                                       </Box>
                                        <Box sx={{ color: 'primary.main' }}>
                                          →
                                       </Box>
                                       <Box>
                                         <Typography variant="caption" color="text.secondary" display="block">
                                           Recommended
                                         </Typography>
                                          <Typography variant="body2" color="primary.main" fontWeight="bold">
                                            {rec.recommendedOption}
                                         </Typography>
                                       </Box>
                                     </Box>
                                        </CardContent>
                               </Card>
                                     </motion.div>
                                   );
                                 })}
                           </Box>
                         </Box>
                          );
                        })()
                       )}

                       <Button
                         variant="outlined"
                        onClick={analyzeRiskMitigation}
                        disabled={isAnalyzingReductions}
                        startIcon={isAnalyzingReductions ? <CircularProgress size={16} /> : null}
                        sx={{ alignSelf: 'flex-start', mt: 3 }}
                       >
                         {isAnalyzingReductions ? 'Refreshing...' : 'Refresh Analysis'}
                       </Button>
                     </Box>
                     </Box>
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Complete the risk assessment to generate a personalized mitigation strategy.
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}

              {/* AI Assistant Tab */}
              {activeTab === 1 && (
                <Box>
                                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                     <Typography variant="h6">
                       AI Risk Analysis Assistant
                     </Typography>
                     <Box sx={{ display: 'flex', gap: 1 }}>
                       <Button
                         variant="outlined"
                         size="small"
                         startIcon={<AddIcon />}
                         onClick={handleNewChat}
                       >
                         New Chat
                       </Button>
                       <Button
                         variant="outlined"
                         size="small"
                         startIcon={<HistoryIcon />}
                         onClick={() => setIsChatSidebarOpen(true)}
                       >
                         History
                       </Button>
                       <Tooltip 
                         title={!currentConversation || currentConversation.messages.length <= 1 
                           ? "Start a conversation to export chat history" 
                           : "Export conversation as PDF with risk context"}
                         arrow
                       >
                         <span>
                           <Button
                             variant="outlined"
                             size="small"
                             startIcon={<DownloadIcon />}
                             onClick={handleExportChat}
                             disabled={!currentConversation || currentConversation.messages.length <= 1}
                           >
                             Export Chat
                           </Button>
                         </span>
                       </Tooltip>
                     </Box>
                   </Box>

                  <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* Chat Interface */}
                    <Box sx={{ flex: 2 }}>
                      <Paper elevation={1} sx={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
                          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SmartToyIcon />
                            Risk Analysis Chat
                          </Typography>
                        </Box>
                        
                        <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                          {currentConversation?.messages.map((message) => (
                            <ListItem
                              key={message.id}
                              sx={{
                                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                                alignItems: 'flex-start',
                                mb: 2,
                                px: 0,
                              }}
                            >
                              <ListItemAvatar sx={{ minWidth: 48 }}>
                                <Avatar sx={{ 
                                  bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                                  width: 36,
                                  height: 36
                                }}>
                                  {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                                </Avatar>
                              </ListItemAvatar>
                                                             <Paper
                                 elevation={1}
                                 sx={{
                                   p: 2,
                                   maxWidth: '75%',
                                   bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                                   border: message.sender === 'ai' ? 1 : 0,
                                   borderColor: message.sender === 'ai' ? 'divider' : 'transparent',
                                   ml: message.sender === 'user' ? 0 : 1,
                                   mr: message.sender === 'user' ? 1 : 0,
                                 }}
                               >
                                 <Typography 
                                   variant="body2" 
                                   sx={{ 
                                     mb: 1,
                                     color: message.sender === 'user' ? 'white' : 'text.primary',
                                     '& strong': {
                                       fontWeight: 'bold',
                                       color: message.sender === 'user' ? 'white' : 'primary.main'
                                     },
                                     '& em': {
                                       fontStyle: 'italic'
                                     },
                                     whiteSpace: 'pre-wrap'
                                   }}
                                   dangerouslySetInnerHTML={{
                                     __html: message.text
                                       .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                       .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                       .replace(/^[\s]*[-*]\s+/gm, '• ')
                                       .replace(/^[\s]*(\d+)\.\s+/gm, '$1. ')
                                   }}
                                 />
                                 <Typography 
                                   variant="caption" 
                                   sx={{ 
                                     color: message.sender === 'user' ? 'grey.300' : 'text.secondary',
                                     fontSize: '0.7rem'
                                   }}
                                 >
                                   {message.timestamp.toLocaleTimeString()}
                                 </Typography>
                               </Paper>
                            </ListItem>
                          ))}
                          
                          {/* Typing Animation */}
                          {isAiTyping && (
                            <ListItem
                              sx={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                mb: 2,
                                px: 0,
                              }}
                            >
                              <ListItemAvatar sx={{ minWidth: 48 }}>
                                <Avatar sx={{ 
                                  bgcolor: 'secondary.main',
                                  width: 36,
                                  height: 36
                                }}>
                                  <SmartToyIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <Paper
                                elevation={1}
                                sx={{
                                  p: 1,
                                  bgcolor: 'background.paper',
                                  border: 1,
                                  borderColor: 'divider',
                                  ml: 1,
                                  borderRadius: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}
                              >
                                <TypingAnimation>
                                  <Box className="dot" />
                                  <Box className="dot" />
                                  <Box className="dot" />
                                </TypingAnimation>
                                <Typography variant="caption" color="text.secondary">
                                  Dr. CyberBuild is thinking...
                                </Typography>
                              </Paper>
                            </ListItem>
                          )}
                        </List>

                        <Divider />
                        
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              placeholder={isAiTyping ? "Dr. CyberBuild is responding..." : "Ask about your risk assessment results..."}
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && !isAiTyping && handleChatSend()}
                              disabled={isAiTyping}
                            />
                            <Button
                              variant="contained"
                              endIcon={isAiTyping ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                              onClick={handleChatSend}
                              disabled={!chatInput.trim() || isAiTyping}
                            >
                              {isAiTyping ? 'Thinking...' : 'Send'}
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>

                    {/* Chat Suggestions */}
                    <Box sx={{ flex: 1 }}>
                      <Paper elevation={1} sx={{ p: 2, height: '500px', overflow: 'auto' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Quick Questions
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Click any question to ask the AI assistant:
                        </Typography>
                        
                        <List dense>
                          {[
                            'Analyze my construction project cyber risks',
                            'What are the most critical vulnerabilities?',
                            'How should I secure my project network?',
                            'What vendor security requirements should I enforce?',
                            'How can I protect BIM and project data?',
                            'What incident response plan do I need?',
                            'How do I secure construction site IoT devices?',
                            'What compliance standards apply to my project?'
                          ].map((question, index) => (
                            <ListItem
                              key={index}
                              button
                              onClick={() => setChatInput(question)}
                              sx={{ 
                                borderRadius: 1, 
                                mb: 1,
                                '&:hover': { bgcolor: 'action.hover' }
                              }}
                            >
                              <ListItemText 
                                primary={question}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>

                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Risk Context
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {Object.entries(riskResults).map(([risk, analysis]) => (
                            <Box
                              key={risk}
                              onClick={() => setChatInput(`Tell me more about my ${risk} risk score of ${analysis.score}%`)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <RiskContextBadge
                                riskType={risk.replace(/([A-Z])/g, ' $1').trim()}
                                score={analysis.score}
                            />
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
          </motion.div>
        )}

        {/* Chat History Drawer */}
        <Drawer
          anchor="right"
          open={isChatSidebarOpen}
          onClose={() => setIsChatSidebarOpen(false)}
        >
          <Box sx={{ width: 350, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Chat History
            </Typography>
            <List>
              {conversations.map((conversation) => (
                <ListItem
                  key={conversation.id}
                  button
                  selected={conversation.id === currentConversationId}
                  onClick={() => {
                    setCurrentConversationId(conversation.id);
                    setIsChatSidebarOpen(false);
                  }}
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemText
                    primary={conversation.title}
                    secondary={conversation.lastUpdated.toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

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
      </motion.div>
    </Container>
  );
};

export default RiskQuantification; 