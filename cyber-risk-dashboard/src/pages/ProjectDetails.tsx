import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress,
  Tabs,
  Tab,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Area, AreaChart } from 'recharts';
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Chat as ChatIcon,
  Timeline as TimelineIcon,
  TrendingDown as TrendingDownIcon,
  Build as BuildIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  PlayArrow as PlayArrowIcon,
  Person as PersonIcon,
  SmartToy as SmartToyIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Adjust as TargetIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { projectService } from '../services/projectService';

interface ProjectData {
  id: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  projectInfo: any;
  riskResults: any;
  mitigationStrategy: any;
  conversations: any[];
  appliedRecommendations?: any[];
  lockedRecommendations?: any[];
  enhancedDescriptions?: any[];
  selectedRound?: number;
  changeableProperties?: any[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// ExtendedJsPDF interface removed - using 'any' casting for autoTable support

// Enhanced Message Content Component for better formatting
const MessageContent = ({ message }: { message: any }) => {
  const formatMessageText = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    
    const formatRegex = /<strong[^>]*>(.*?)<\/strong>|<em>(.*?)<\/em>|(\*[^*]*(?:IMMEDIATE|URGENT|CRITICAL)[^*]*\*)|(\n• .*?)(?=\n|$)|(\n\d+\. .*?)(?=\n|$)/g;
    
    let match;
    while ((match = formatRegex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        const beforeText = text.slice(currentIndex, match.index);
        if (beforeText.trim()) {
          parts.push(<span key={`text-${match.index}`}>{beforeText}</span>);
        }
      }
      
      if (match[1]) {
        parts.push(<strong key={`bold-${match.index}`}>{match[1]}</strong>);
      } else if (match[2]) {
        parts.push(<em key={`italic-${match.index}`}>{match[2]}</em>);
      } else if (match[3]) {
        parts.push(
          <Box 
            key={`urgent-${match.index}`}
            component="span" 
            sx={{ 
              color: '#d32f2f', 
              fontWeight: 'bold',
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
              display: 'inline-block',
              margin: '2px 0',
              fontSize: '0.9em'
            }}
          >
            {match[3]}
          </Box>
        );
      } else if (match[4]) {
        parts.push(
          <Box key={`bullet-${match.index}`} component="div" sx={{ ml: 2, my: 0.5, lineHeight: 1.4 }}>
            {match[4].trim()}
          </Box>
        );
      } else if (match[5]) {
        parts.push(
          <Box key={`numbered-${match.index}`} component="div" sx={{ ml: 2, my: 0.5, lineHeight: 1.4 }}>
            {match[5].trim()}
          </Box>
        );
      }
      
      currentIndex = match.index + match[0].length;
    }
    
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      if (remainingText.trim()) {
        parts.push(<span key="remaining">{remainingText}</span>);
      }
    }
    
    if (parts.length === 0) {
      return text
        .split(/(\*\*.*?\*\*|\*.*?\*)/g)
        .map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={`fallback-bold-${index}`}>{part.slice(2, -2)}</strong>;
          } else if (part.startsWith('*') && part.endsWith('*') && !part.includes('IMMEDIATE') && !part.includes('URGENT') && !part.includes('CRITICAL')) {
            return <em key={`fallback-italic-${index}`}>{part.slice(1, -1)}</em>;
          }
          return <span key={`fallback-text-${index}`}>{part}</span>;
        });
    }
    
    return parts;
  };

  const lines = message.text.split('\n');
  const formattedContent = lines.map((line: string, lineIndex: number) => {
    if (line.trim() === '') {
      return <br key={`br-${lineIndex}`} />;
    }
    
    const formattedLine = formatMessageText(line);
    return (
      <Box key={`line-${lineIndex}`} component="span" sx={{ display: 'block', mb: line.includes('•') || line.match(/^\d+\./) ? 0 : 0.5 }}>
        {formattedLine}
      </Box>
    );
  });

  return <>{formattedContent}</>;
};

// Styled components for premium design
const PremiumCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(99, 102, 241, 0.2)'
    : '1px solid rgba(79, 70, 229, 0.15)',
  borderRadius: '16px',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(99, 102, 241, 0.2)'
      : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(79, 70, 229, 0.1)',
  }
}));

const GlassPanel = styled(Paper)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(30, 41, 59, 0.85)'
    : 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(20px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(99, 102, 241, 0.2)'
    : '1px solid rgba(79, 70, 229, 0.15)',
  borderRadius: '12px',
}));

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [showNumbers, setShowNumbers] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const projectData = await projectService.getProject(projectId!);
      setProject(projectData);
    } catch (err) {
      console.error('Failed to fetch project:', err);
      setError('Failed to load project details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircleIcon />;
      case 'medium': return <WarningIcon />;
      case 'high': return <ErrorIcon />;
      case 'critical': return <ErrorIcon />;
      default: return <SecurityIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Load project in Risk Quantification page
  const handleLoadInRiskQuantification = () => {
    // Store project data in localStorage for the Risk Quantification page to pick up
    const projectDataForLoad = {
      projectName: project?.projectName,
      projectInfo: project?.projectInfo,
      riskResults: project?.riskResults,
      mitigationStrategy: project?.mitigationStrategy,
      conversations: project?.conversations,
      appliedRecommendations: project?.appliedRecommendations,
      lockedRecommendations: project?.lockedRecommendations,
      enhancedDescriptions: project?.enhancedDescriptions,
      selectedRound: project?.selectedRound,
      changeableProperties: project?.changeableProperties
    };
    localStorage.setItem('loadedProjectData', JSON.stringify(projectDataForLoad));
    navigate('/risk-quantification?loadProject=true');
  };



  
  const exportPremiumPDF = () => {
      if (!project) {
          console.error('No project data available for PDF export');
          alert('No project data available for PDF export');
          return;
      }
  
      try {
          const doc = new jsPDF();
          const pageWidth = doc.internal.pageSize.width;
          const pageHeight = doc.internal.pageSize.height;
          const margin = 15; // Reduced margin for more content space
          const contentWidth = pageWidth - (margin * 2);
  
          // A more sophisticated and mature color palette
          const colors = {
              primary: [30, 41, 59] as [number, number, number],      // Slate 900 (Deep Navy/Charcoal)
              primaryLight: [51, 65, 85] as [number, number, number],   // Slate 700
              accent: [20, 184, 166] as [number, number, number],      // Teal 500 (Muted & Professional)
              accentLight: [45, 212, 191] as [number, number, number], // Teal 400
              text: [15, 23, 42] as [number, number, number],          // Slate 950 (Almost Black)
              textSecondary: [71, 85, 105] as [number, number, number], // Slate 600
              background: [241, 245, 249] as [number, number, number],  // Slate 100 (Light Gray)
              white: [255, 255, 255] as [number, number, number],
              success: [22, 163, 74] as [number, number, number],      // Green 600
              warning: [217, 119, 6] as [number, number, number],      // Amber 600
              error: [220, 38, 38] as [number, number, number],        // Red 600
          };
  
          // Centralized font settings
          const fonts = {
              body: 'helvetica',
              bold: 'helvetica'
          };
  
          // Utility to safely handle potentially null/undefined text
          const safeText = (text: any, fallback = 'N/A'): string => {
              if (text === undefined || text === null) return fallback;
              // Keep markdown characters for later processing
              return String(text).replace(/[^\x20-\x7E\n\r\t*<>]/g, '').trim();
          };
  
          const drawHeaderOnEveryPage = () => {
              // Header Background
              doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
              doc.rect(0, 0, pageWidth, 40, 'F');
              doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
              doc.rect(0, 40, pageWidth, 2, 'F');
  
              // Logo
              doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
              doc.setFont(fonts.bold, 'bold');
              doc.setFontSize(10);
              doc.text('CYBER RISK', margin, 20);
              doc.setFont(fonts.body, 'normal');
              doc.setFontSize(8);
              doc.text('ASSESSMENT PLATFORM', margin, 27);
  
              // Main Title
              doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
              doc.setFont(fonts.bold, 'bold');
              doc.setFontSize(16);
              doc.text('Cybersecurity Risk Assessment', pageWidth / 2, 25, { align: 'center' });
  
              // Report Metadata (Right Aligned - No Overlap)
              const reportDate = new Date().toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
              });
              doc.setFont(fonts.body, 'normal');
              doc.setFontSize(8);
              doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
              doc.text(`Project: ${safeText(project.projectName)}`, pageWidth - margin, 15, { align: 'right' });
              doc.text(`Date: ${reportDate}`, pageWidth - margin, 22, { align: 'right' });
              doc.text(`Report ID: ${Date.now().toString().slice(-8)}`, pageWidth - margin, 29, { align: 'right' });
          };
  
          const drawFooterOnEveryPage = (data: any) => {
              const pageCount = (doc as any).internal.getNumberOfPages();
              doc.setFont(fonts.body, 'normal');
              doc.setFontSize(8);
              doc.setTextColor(colors.textSecondary[0], colors.textSecondary[1], colors.textSecondary[2]);
  
              // Footer Line
              doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
              doc.setLineWidth(0.5);
              doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
              
              // Footer Text
              const footerText = 'Confidential | Professional Security Assessment';
              doc.text(footerText, margin, pageHeight - 10);
              const pageNumText = `Page ${data.pageNumber} of ${pageCount}`;
              doc.text(pageNumText, pageWidth - margin, pageHeight - 10, { align: 'right' });
          };
  
          const addSectionHeader = (title: string, subtitle: string) => {
              const currentY = (doc as any).lastAutoTable?.finalY || 50;
              
              autoTable(doc, {
                  startY: currentY + 15,
                  body: [[{ content: title, styles: { cellPadding: { top: 8, bottom: 2, left: 8 } } }]],
                  theme: 'plain',
                  styles: {
                      font: fonts.bold,
                      fontStyle: 'bold',
                      fontSize: 14,
                      textColor: colors.primary,
                  },
                  didDrawCell: (data: any) => {
                      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
                      doc.rect(margin, data.cell.y, 3, data.cell.height, 'F');
                  },
              });
              
              autoTable(doc, {
                  startY: (doc as any).lastAutoTable.finalY,
                  body: [[{ content: subtitle, styles: { cellPadding: { top: 0, bottom: 8, left: 8 } } }]],
                  theme: 'plain',
                  styles: {
                      font: fonts.body,
                      fontSize: 10,
                      textColor: colors.textSecondary,
                  },
              });
          };
  
          // --- START PDF GENERATION ---
          
          const startY = 50;
          
          autoTable(doc, {
              startY: startY,
              body: [
                  [
                      { content: `Initial Risk\n${((project.mitigationStrategy?.initialRisk || 0) * 100).toFixed(1)}%`, styles: { halign: 'center' } },
                      { content: `Current Risk\n${(calculateCurrentRisk()).toFixed(1)}%`, styles: { halign: 'center' } },
                      { content: `Projected Risk\n${((project.mitigationStrategy?.finalRisk || 0) * 100).toFixed(1)}%`, styles: { halign: 'center' } },
                  ]
              ],
              theme: 'grid',
              styles: { font: fonts.bold, fontSize: 12, fontStyle: 'bold', cellPadding: 8, valign: 'middle' },
              didDrawCell: (data) => {
                  if (data.section === 'body') {
                      doc.setFont(fonts.body, 'normal');
                      doc.setFontSize(10);
                      doc.setTextColor(...colors.textSecondary);
                      const textParts = data.cell.text[0].split('\n');
                      if (textParts.length > 1) {
                          doc.text(textParts[1], data.cell.x + data.cell.width / 2, data.cell.y + 15, { align: 'center' });
                      }
                  }
              },
              didDrawPage: (data) => {
                  drawHeaderOnEveryPage();
                  drawFooterOnEveryPage(data);
              }
          });
  
          if (project.riskResults) {
              addSectionHeader('Risk Analysis', 'Detailed breakdown of identified threats');
              const riskBody = Object.entries(project.riskResults)
                  .filter(([key]) => !['_id', 'id'].includes(key))
                  .map(([riskType, analysis]: [string, any]) => {
                      const score = analysis?.score || 0;
                      return [
                          riskType.replace(/([A-Z])/g, ' $1').trim(),
                          `${score.toFixed(1)}%`,
                          analysis?.level?.toUpperCase() || 'N/A',
                          score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low',
                      ];
                  });
              autoTable(doc, {
                  startY: (doc as any).lastAutoTable.finalY + 5,
                  head: [['Risk Category', 'Score', 'Level', 'Priority']],
                  body: riskBody,
                  theme: 'striped',
                  headStyles: { fillColor: colors.primary },
                  didDrawCell: (data) => {
                      if (data.section === 'body' && data.column.index === 3) {
                          const priority = data.cell.raw;
                          doc.setTextColor(...(priority === 'High' ? colors.error : priority === 'Medium' ? colors.warning : colors.success));
                          doc.setFont(fonts.body, 'bold');
                      }
                  },
              });
          }
  
          // --- MITIGATION ROADMAP (FIXED) ---
          if (project.mitigationStrategy?.rounds?.length > 0) {
              addSectionHeader('Implementation Roadmap', 'Phased approach to risk mitigation');
              
              project.mitigationStrategy.rounds.forEach((round: any, index: number) => {
                  // Create enhanced descriptions map for quick lookup
                  const enhancedDescriptions = project.enhancedDescriptions || [];
                  const enhancedMap = new Map();
                  enhancedDescriptions.forEach((item: any) => {
                      if (item.key) {
                          enhancedMap.set(item.key, item);
                      }
                  });
                  
                  // Swap first and second recommendations if there are at least 2
                  const recommendations = round.recommendations || [];
                  const reorderedRecommendations = [...recommendations];
                  if (reorderedRecommendations.length >= 2) {
                      [reorderedRecommendations[0], reorderedRecommendations[1]] = [reorderedRecommendations[1], reorderedRecommendations[0]];
                  }
                  
                  const recommendationsBody = reorderedRecommendations.map((rec: any, recIndex: number) => {
                      const isApplied = (project.appliedRecommendations || []).includes(`${rec.featureGroup}-${rec.recommendedOption}`);
                      
                      // Get risk reduction from enhanced descriptions
                      const enhancedKey = `${rec.featureGroup}-${rec.featureName}-${rec.description}`;
                      const enhanced = enhancedMap.get(enhancedKey);
                      const riskReduction = enhanced?.calculatedRiskReduction || rec.riskReductionPercentage || 0;
                      
                      return [
                          recIndex + 1,
                          safeText(rec.featureName),
                          safeText(rec.currentOption),
                          safeText(rec.recommendedOption),
                          isApplied ? 'Applied' : 'Pending',
                          `${riskReduction.toFixed(1)}%`
                      ];
                  });
  
                  // A single table with phase header first, then column headers, then recommendations
                  autoTable(doc, {
                      startY: (doc as any).lastAutoTable.finalY + 10,
                      body: [
                          // Phase header row first, spanning all 6 columns
                          [{
                              content: `Phase ${round.roundNumber || index + 1}    Risk: ${((round.currentRisk || 0) * 100).toFixed(1)}% ➔ ${((round.projectedRisk || 0) * 100).toFixed(1)}%`,
                              colSpan: 6,
                              styles: {
                                  fillColor: colors.primaryLight,
                                  textColor: colors.white,
                                  fontStyle: 'bold',
                                  halign: 'left'
                              }
                          }],
                          // Column header row
                          [
                              { content: '#', styles: { fillColor: colors.textSecondary, textColor: colors.white, fontStyle: 'bold' } },
                              { content: 'Recommendation', styles: { fillColor: colors.textSecondary, textColor: colors.white, fontStyle: 'bold' } },
                              { content: 'Current', styles: { fillColor: colors.textSecondary, textColor: colors.white, fontStyle: 'bold' } },
                              { content: 'Proposed', styles: { fillColor: colors.textSecondary, textColor: colors.white, fontStyle: 'bold' } },
                              { content: 'Status', styles: { fillColor: colors.textSecondary, textColor: colors.white, fontStyle: 'bold' } },
                              { content: 'Reduction', styles: { fillColor: colors.textSecondary, textColor: colors.white, fontStyle: 'bold' } }
                          ],
                          // The rest of the body is the recommendations
                          ...recommendationsBody
                      ],
                      theme: 'grid',
                      columnStyles: {
                          0: { cellWidth: 8, halign: 'center' },
                          1: { cellWidth: 60 },
                          4: { halign: 'center' },
                          5: { halign: 'right' }
                      },
                      didDrawCell: (data: any) => {
                          if (data.section === 'body' && data.row.index > 0) { // Skip the phase header row
                              if (data.column.index === 4) { // Status column
                                  const status = data.cell.text[0];
                                  doc.setTextColor(...(status === 'Applied' ? colors.success : colors.warning));
                                  doc.setFont(fonts.body, 'bold');
                              }
                          }
                      }
                  });
              });
          }
  
          // --- CONSULTATION HISTORY (FIXED) ---
          if (project.conversations && project.conversations.length > 0) {
              addSectionHeader('Consultation History', 'Complete log of AI-powered analysis');
  
                                  // Simplified text rendering - just clean the text and let autoTable handle it
          const cleanText = (text: string) => {
              return text
                  .replace(/<strong>(.*?)<\/strong>/g, '$1')
                  .replace(/<em>(.*?)<\/em>/g, '$1')
                  .replace(/\*\*(.*?)\*\*/g, '$1')
                  .replace(/\*(.*?)\*/g, '$1')
                  .replace(/[^\x20-\x7E\n\r\t]/g, '')
                  .trim();
          };
  
              project.conversations.forEach((conversation: any) => {
                  autoTable(doc, {
                      startY: (doc as any).lastAutoTable.finalY + 10,
                      body: [[safeText(conversation.title)]],
                      theme: 'plain',
                      styles: { font: fonts.bold, fontSize: 11, fillColor: colors.background, cellPadding: 8 }
                  });
  
                                const messagesBody = (conversation.messages || []).map((msg: any) => ({
                  sender: msg.sender === 'user' ? 'User' : 'AI Assistant',
                  message: cleanText(safeText(msg.text, 'No content.'))
              }));

              autoTable(doc, {
                  startY: (doc as any).lastAutoTable.finalY,
                  body: messagesBody.map((m: { sender: string; message: string }) => [m.sender, m.message]),
                  theme: 'striped',
                  styles: { fontSize: 9, cellPadding: 4, valign: 'top' },
                  headStyles: { fillColor: colors.primaryLight, textColor: colors.white, fontSize: 10, fontStyle: 'bold' },
                  columnStyles: {
                      0: { cellWidth: 25, fontStyle: 'bold' },
                  },
                  didDrawCell: (data: any) => {
                      if (data.section === 'body') {
                          if (data.column.index === 0) { // Speaker column
                              const isUser = data.cell.text[0] === 'User';
                              const colorToUse = isUser ? colors.primary : colors.accent;
                              doc.setTextColor(colorToUse[0], colorToUse[1], colorToUse[2]);
                          }
                      }
                  }
              });
              });
          }
  
          const pageCount = (doc as any).internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
              doc.setPage(i);
              drawFooterOnEveryPage({ pageNumber: i });
          }
  
          const cleanProjectName = safeText(project.projectName, 'assessment').toLowerCase().replace(/\s/g, '-');
          const dateStr = new Date().toISOString().split('T')[0];
          doc.save(`cybersecurity-assessment-${cleanProjectName}-${dateStr}.pdf`);
  
      } catch (error) {
          console.error('Enhanced PDF Generation Error:', error);
          alert(`Failed to generate premium PDF report. See console for details.`);
      }
  };
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading project details...
        </Typography>
      </Container>
    );
  }

  if (error || !project) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Project not found'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/reports')}
        >
          Back to Reports
        </Button>
      </Container>
    );
  }

  // Calculate overall risk metrics
  const calculateOverallRisk = () => {
    if (!project.riskResults) return { score: 0, level: 'low' };
    
    const risks = Object.entries(project.riskResults)
      .filter(([key]) => key !== '_id' && key !== 'id')
      .map(([_, analysis]: [string, any]) => analysis?.score || 0);
    
    const avgScore = risks.length > 0 ? risks.reduce((a, b) => a + b, 0) / risks.length : 0;
    const level = avgScore >= 75 ? 'critical' : avgScore >= 50 ? 'high' : avgScore >= 25 ? 'medium' : 'low';
    
    return { score: avgScore, level };
  };

  const overallRisk = calculateOverallRisk();

  // Calculate current risk after applied recommendations
  const calculateCurrentRisk = () => {
    if (!project.mitigationStrategy) return overallRisk.score;
    
    // This would need to be calculated based on which recommendations were actually applied
    // For now, using initial risk as baseline
    return (project.mitigationStrategy.initialRisk || 0) * 100;
  };

  // Calculate projected risk reduction
  const calculateProjectedReduction = () => {
    if (!project.mitigationStrategy) return 0;
    
    const initial = (project.mitigationStrategy.initialRisk || 0) * 100;
    const final = (project.mitigationStrategy.finalRisk || 0) * 100;
    return initial - final;
  };

  // Prepare mitigation timeline data
  const getMitigationTimelineData = () => {
    if (!project.mitigationStrategy?.rounds) return [];
    
    return project.mitigationStrategy.rounds.map((round: any, index: number) => ({
      round: round.roundNumber || index + 1,
      currentRisk: ((round.currentRisk || 0) * 100),
      projectedRisk: ((round.projectedRisk || 0) * 100),
      reduction: round.reductionPercentage || 0
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/reports')}
            sx={{ mb: 2 }}
          >
            Back to Reports
          </Button>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                {project.projectName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Created: {formatDate(project.createdAt)} • Last updated: {formatDate(project.updatedAt)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {/* Overall Risk Card */}
                <Grid item xs={12} sm={6}>
                  <PremiumCard elevation={3}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="overline" color="text.secondary">
                        Overall Risk Score
                      </Typography>
                      <Typography variant="h2" fontWeight="bold" color={getRiskLevelColor(overallRisk.level) + '.main'}>
                        {overallRisk.score.toFixed(0)}%
                      </Typography>
                      <Chip 
                        label={overallRisk.level.toUpperCase()}
                        color={getRiskLevelColor(overallRisk.level) as any}
                        size="medium"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </PremiumCard>
                </Grid>
                
                {/* Action Buttons */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      onClick={handleLoadInRiskQuantification}
                      sx={{ flex: 1 }}
                    >
                      Load in Risk Tool
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={exportPremiumPDF}
                      sx={{ flex: 1 }}
                    >
                      Export Premium PDF
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </motion.div>

      {/* Enhanced Navigation Tabs */}
      <GlassPanel elevation={1} sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab icon={<InfoIcon />} iconPosition="start" label="Project Overview" />
          <Tab icon={<AssessmentIcon />} iconPosition="start" label="Risk Analysis" />
          <Tab icon={<BuildIcon />} iconPosition="start" label="Mitigation Strategy" />
          <Tab icon={<TimelineIcon />} iconPosition="start" label="Implementation Timeline" />
          <Tab icon={<ChatIcon />} iconPosition="start" label="Consultation History" />
        </Tabs>
      </GlassPanel>

      {/* Enhanced Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tabValue}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Project Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* Quick Stats */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <PremiumCard elevation={2}>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Project Type
                        </Typography>
                        <Typography variant="h6">
                          {project.projectInfo?.projectType || 'N/A'}
                        </Typography>
                      </CardContent>
                    </PremiumCard>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <PremiumCard elevation={2}>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Company Scale
                        </Typography>
                        <Typography variant="h6">
                          {project.projectInfo?.companyScale || 'N/A'}
                        </Typography>
                      </CardContent>
                    </PremiumCard>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <PremiumCard elevation={2}>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Project Phase
                        </Typography>
                        <Typography variant="h6">
                          {project.projectInfo?.projectPhase || 'N/A'}
                        </Typography>
                      </CardContent>
                    </PremiumCard>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <PremiumCard elevation={2}>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Duration
                        </Typography>
                        <Typography variant="h6">
                          {project.projectInfo?.projectDuration || 'N/A'}
                        </Typography>
                      </CardContent>
                    </PremiumCard>
                  </Grid>
                </Grid>
              </Grid>

              {/* Detailed Information Sections */}
              <Grid item xs={12} md={6}>
                <GlassPanel elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    🏗️ Project Structure
                  </Typography>
                  <List dense>
                    {[
                      { key: 'layer1Teams', label: 'Layer 1 Teams' },
                      { key: 'layer2Teams', label: 'Layer 2 Teams' },
                      { key: 'layer3Teams', label: 'Layer 3 Teams' },
                      { key: 'teamOverlap', label: 'Team Overlap' }
                    ].map(({ key, label }) => {
                      const value = project.projectInfo?.[key];
                      if (!value || value === '' || value === 'na') return null;
                      return (
                        <ListItem key={key}>
                          <ListItemText 
                            primary={label}
                            secondary={String(value)}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </GlassPanel>
              </Grid>

              <Grid item xs={12} md={6}>
                <GlassPanel elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom color="success.main">
                    🔐 Security Practices
                  </Typography>
                  <List dense>
                    {[
                      { key: 'governanceLevel', label: 'Governance Level' },
                      { key: 'usesMFA', label: 'Multi-Factor Authentication' },
                      { key: 'securityMonitoring', label: 'Security Monitoring' },
                      { key: 'incidentResponse', label: 'Incident Response' }
                    ].map(({ key, label }) => {
                      const value = project.projectInfo?.[key];
                      if (!value || value === '' || value === 'na') return null;
                      return (
                        <ListItem key={key}>
                          <ListItemText 
                            primary={label}
                            secondary={String(value)}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </GlassPanel>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Enhanced Risk Analysis Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {/* Risk Radar Chart */}
              <Grid item xs={12} md={6}>
                <GlassPanel elevation={2} sx={{ p: 3, height: '500px' }}>
                  <Typography variant="h6" gutterBottom align="center">
                    Risk Assessment Radar
                  </Typography>
                  <Box sx={{ height: '420px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={Object.entries(project.riskResults || {})
                        .filter(([risk]) => risk !== '_id' && risk !== 'id')
                        .map(([risk, analysis]: [string, any]) => ({
                          risk: risk.replace(/([A-Z])/g, ' $1').trim(),
                          score: (analysis?.score || 0),
                          fullMark: 100
                        }))}>
                        <PolarGrid gridType="polygon" />
                        <PolarAngleAxis dataKey="risk" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Risk Score"
                          dataKey="score"
                          stroke="#4F46E5"
                          fill="#4F46E5"
                          fillOpacity={0.6}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </GlassPanel>
              </Grid>

              {/* Risk Details */}
              <Grid item xs={12} md={6}>
                <GlassPanel elevation={2} sx={{ p: 3, height: '500px', overflow: 'auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Risk Breakdown
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showNumbers}
                          onChange={(e) => setShowNumbers(e.target.checked)}
                          color="primary"
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="caption" color="text.secondary">
                          Show Numbers
                        </Typography>
                      }
                    />
                  </Box>
                  <List>
                    {Object.entries(project.riskResults || {})
                      .filter(([riskType]) => riskType !== '_id' && riskType !== 'id')
                      .map(([riskType, analysis]: [string, any]) => {
                        if (!analysis || typeof analysis !== 'object') return null;
                        
                        const score = analysis.score || 0;
                        const level = analysis.level || 'low';
                        
                        return (
                          <ListItem key={riskType} sx={{ px: 0 }}>
                            <PremiumCard sx={{ width: '100%', mb: 1 }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {riskType.replace(/([A-Z])/g, ' $1').trim()}
                                  </Typography>
                                  <Chip 
                                    label={showNumbers ? `${score}%` : level.toUpperCase()}
                                    color={getRiskLevelColor(level) as any}
                                    size="small"
                                  />
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={score} 
                                  sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    bgcolor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 4,
                                      bgcolor: level === 'critical' ? 'error.main' : 
                                              level === 'high' ? 'warning.main' : 
                                              level === 'medium' ? 'warning.light' : 'success.main'
                                    }
                                  }}
                                />
                              </CardContent>
                            </PremiumCard>
                          </ListItem>
                        );
                      })}
                  </List>
                </GlassPanel>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Enhanced Mitigation Strategy Tab */}
          <TabPanel value={tabValue} index={2}>
            {project.mitigationStrategy ? (
              <Grid container spacing={3}>
                {/* Enhanced Strategy Overview */}
                <Grid item xs={12}>
                  <GlassPanel elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Mitigation Strategy Overview
                    </Typography>
                    <Grid container spacing={3}>
                      {/* Initial Risk */}
                      <Grid item xs={12} sm={6} md={2.4}>
                        <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'error.main', borderRadius: 2 }}>
                          <Typography variant="overline" color="text.secondary">
                            Initial Risk
                          </Typography>
                          <Typography variant="h4" color="error.main">
                            {((project.mitigationStrategy.initialRisk || 0) * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Total Reduction */}
                      <Grid item xs={12} sm={6} md={2.4}>
                        <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'primary.main', borderRadius: 2 }}>
                          <TrendingDownIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                          <Typography variant="h5" color="primary.main">
                            {(project.mitigationStrategy.totalReductionPercentage || 0).toFixed(1)}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Total Reduction
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Current Risk */}
                      <Grid item xs={12} sm={6} md={2.4}>
                        <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'warning.main', borderRadius: 2 }}>
                          <Typography variant="overline" color="text.secondary">
                            Current Risk
                          </Typography>
                          <Typography variant="h4" color="warning.main">
                            {calculateCurrentRisk().toFixed(1)}%
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Projected Reduction */}
                      <Grid item xs={12} sm={6} md={2.4}>
                        <Box sx={{ 
                          textAlign: 'center', 
                          p: 2, 
                          border: 2, 
                          borderColor: 'success.main', 
                          borderRadius: 2,
                          bgcolor: alpha('#4caf50', 0.1),
                          boxShadow: '0 0 10px rgba(76, 175, 80, 0.3)'
                        }}>
                          <TargetIcon sx={{ fontSize: 32, color: 'success.main' }} />
                          <Typography variant="h5" color="success.main" fontWeight="bold">
                            -{calculateProjectedReduction().toFixed(1)}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Projected Reduction
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Final Risk */}
                      <Grid item xs={12} sm={6} md={2.4}>
                        <Box sx={{ 
                          textAlign: 'center', 
                          p: 2, 
                          border: 2, 
                          borderColor: 'success.main', 
                          borderRadius: 2,
                          bgcolor: alpha('#4caf50', 0.1),
                          boxShadow: '0 0 10px rgba(76, 175, 80, 0.3)'
                        }}>
                          <Typography variant="overline" color="text.secondary">
                            Final Risk (Target)
                          </Typography>
                          <Typography variant="h4" color="success.main" fontWeight="bold">
                            {((project.mitigationStrategy.finalRisk || 0) * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </GlassPanel>
                </Grid>

                {/* Risk Reduction Chart */}
                <Grid item xs={12}>
                  <GlassPanel elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Risk Reduction Progress
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getMitigationTimelineData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="round" label={{ value: 'Implementation Round', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Risk Score (%)', angle: -90, position: 'insideLeft' }} />
                          <RechartsTooltip />
                          <Area 
                            type="monotone" 
                            dataKey="currentRisk" 
                            stroke="#4F46E5" 
                            fill="#4F46E5" 
                            fillOpacity={0.6}
                            name="Risk Score"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </GlassPanel>
                </Grid>
              </Grid>
            ) : (
              <Alert severity="info">
                No mitigation strategy has been developed for this project yet.
              </Alert>
            )}
          </TabPanel>

          {/* Enhanced Implementation Timeline Tab */}
          <TabPanel value={tabValue} index={3}>
            {project.mitigationStrategy?.rounds ? (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Implementation Timeline
                </Typography>
                
                <Stepper orientation="vertical">
                  {project.mitigationStrategy.rounds.map((round: any, index: number) => (
                    <Step key={index} active={true} completed={true}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            {round.roundNumber || index + 1}
                          </Avatar>
                        )}
                      >
                        <Typography variant="h6">
                          Round {round.roundNumber || index + 1} - {round.reductionPercentage?.toFixed(1)}% Risk Reduction
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <GlassPanel elevation={1} sx={{ p: 3, mb: 2 }}>
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">
                                Initial Risk
                              </Typography>
                              <Typography variant="h6" color="error.main">
                                {((round.currentRisk || 0) * 100).toFixed(1)}%
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">
                                Projected Risk
                              </Typography>
                              <Typography variant="h6" color="success.main">
                                {((round.projectedRisk || 0) * 100).toFixed(1)}%
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">
                                Recommendations
                              </Typography>
                              <Typography variant="h6" color="primary.main">
                                {round.recommendations?.length || 0}
                              </Typography>
                            </Grid>
                          </Grid>

                                                        {round.recommendations && round.recommendations.length > 0 && (() => {
                                // Prepare recommendation data once for all recommendations in this round
                                const appliedRecommendations = project.appliedRecommendations || [];
                                const enhancedDescriptions = project.enhancedDescriptions || [];
                                
                                // Create a map of enhanced descriptions for quick lookup
                                const enhancedMap = new Map();
                                enhancedDescriptions.forEach((item: any) => {
                                  if (item.key) {
                                    enhancedMap.set(item.key, item);
                                  }
                                });
                                
                                // Swap first and second recommendations if there are at least 2
                                const recommendations = round.recommendations || [];
                                const reorderedRecommendations = [...recommendations];
                                if (reorderedRecommendations.length >= 2) {
                                    [reorderedRecommendations[0], reorderedRecommendations[1]] = [reorderedRecommendations[1], reorderedRecommendations[0]];
                                }
                                
                                return (
                                  <Box>
                                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                      Implementation Recommendations:
                                    </Typography>
                                    <TableContainer component={GlassPanel} variant="outlined">
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Feature</TableCell>
                                            <TableCell>Current</TableCell>
                                            <TableCell>Recommended</TableCell>
                                            <TableCell>Applied</TableCell>
                                            <TableCell>Impact</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {reorderedRecommendations.slice(0, 10).map((rec: any, recIndex: number) => {
                                            // Check if recommendation is applied using the same ID format as in RiskQuantification
                                            const recommendationId = `${rec.featureGroup}-${rec.recommendedOption}`;
                                            const persistentId = `${rec.featureGroup}-${rec.currentOption}-to-${rec.recommendedOption}`;
                                            const isApplied = appliedRecommendations.includes(recommendationId) || 
                                                             appliedRecommendations.includes(persistentId);
                                            
                                            // Get risk reduction from enhanced descriptions
                                            const enhancedKey = `${rec.featureGroup}-${rec.featureName}-${rec.description}`;
                                            const enhanced = enhancedMap.get(enhancedKey);
                                            const riskReduction = enhanced?.calculatedRiskReduction || rec.riskReductionPercentage || 0;
                                            
                                            const impact = rec.importance === 'High' ? 'High' : rec.importance === 'Medium' ? 'Medium' : 'Low';
                                      
                                      return (
                                        <TableRow key={recIndex}>
                                          <TableCell>
                                            <Tooltip title={rec.description || ''}>
                                              <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                                {rec.featureName}
                                              </Typography>
                                            </Tooltip>
                                          </TableCell>
                                          <TableCell>
                                            <Chip label={rec.currentOption} size="small" variant="outlined" />
                                          </TableCell>
                                          <TableCell>
                                            <Chip label={rec.recommendedOption} size="small" color="primary" />
                                          </TableCell>
                                          <TableCell>
                                            <Chip 
                                              icon={isApplied ? <CheckIcon /> : <ClearIcon />}
                                              label={isApplied ? 'Applied' : 'Pending'}
                                              size="small" 
                                              color={isApplied ? 'success' : 'default'}
                                              variant={isApplied ? 'filled' : 'outlined'}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                              <Chip 
                                                label={impact} 
                                                size="small" 
                                                color={impact === 'High' ? 'error' : impact === 'Medium' ? 'warning' : 'default'}
                                              />
                                              {isApplied && riskReduction > 0 && (
                                                <Typography variant="caption" color="success.main">
                                                  -{riskReduction.toFixed(1)}%
                                                </Typography>
                                              )}
                                            </Box>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                                    {reorderedRecommendations.length > 10 && (
                                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        And {reorderedRecommendations.length - 10} more recommendations...
                                      </Typography>
                                    )}
                                  </Box>
                                );
                              })()}
                        </GlassPanel>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            ) : (
              <Alert severity="info">
                No implementation timeline available for this project.
              </Alert>
            )}
          </TabPanel>

          {/* Enhanced Consultation History Tab */}
          <TabPanel value={tabValue} index={4}>
            {project.conversations && project.conversations.length > 0 ? (
              <Box>
                {project.conversations.map((conversation: any, index: number) => (
                  <Accordion key={index} defaultExpanded={index === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ChatIcon color="primary" />
                        <Box>
                          <Typography variant="h6">{conversation.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(conversation.lastUpdated)} • {conversation.messages?.length || 0} messages
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                        {conversation.messages?.map((message: any, msgIndex: number) => (
                          <Box key={msgIndex} sx={{ mb: 3 }}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: msgIndex * 0.1 }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                                  alignItems: 'flex-start',
                                  gap: 2,
                                  width: '100%'
                                }}
                              >
                                <Avatar sx={{ 
                                  bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                                  width: 40,
                                  height: 40,
                                  flexShrink: 0
                                }}>
                                  {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                                </Avatar>
                                
                                <Box sx={{ 
                                  maxWidth: 'calc(100% - 60px)',
                                  minWidth: 0,
                                  width: 'fit-content'
                                }}>
                                  <GlassPanel
                                    elevation={2}
                                    sx={{
                                      p: 2,
                                      borderRadius: message.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                      background: (theme) => message.sender === 'user' 
                                        ? theme.palette.mode === 'dark'
                                          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                                          : 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)'
                                        : theme.palette.mode === 'dark'
                                          ? 'rgba(30, 41, 59, 0.8)'
                                          : 'rgba(255, 255, 255, 0.8)',
                                      border: (theme) => message.sender === 'user'
                                        ? `1px solid ${theme.palette.primary.main}40`
                                        : theme.palette.mode === 'dark'
                                          ? '1px solid rgba(100, 116, 139, 0.3)'
                                          : '1px solid rgba(226, 232, 240, 0.8)',
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                                        {message.sender === 'user' ? 'You' : 'Dr. CyberBuild'}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                                        {new Date(message.timestamp).toLocaleString()}
                                      </Typography>
                                    </Box>
                                    
                                    <Typography 
                                      variant="body2" 
                                      component="div"
                                      sx={{ 
                                        lineHeight: 1.6,
                                        wordBreak: 'break-word',
                                        '& strong': {
                                          fontWeight: 'bold',
                                          color: 'primary.main'
                                        },
                                        '& em': {
                                          fontStyle: 'italic'
                                        }
                                      }}
                                    >
                                      <MessageContent message={message} />
                                    </Typography>
                                  </GlassPanel>
                                </Box>
                              </Box>
                            </motion.div>
                          </Box>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ) : (
              <Alert severity="info">
                No consultation history available for this project.
              </Alert>
            )}
          </TabPanel>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};

export default ProjectDetails; 