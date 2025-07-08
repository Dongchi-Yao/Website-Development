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
  Divider,
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
  IconButton,
  Tooltip
} from '@mui/material';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Area, AreaChart } from 'recharts';
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
  Info as InfoIcon
} from '@mui/icons-material';
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
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
      {/* Header */}
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
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          {project.projectName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Created: {formatDate(project.createdAt)} • Last updated: {formatDate(project.updatedAt)}
        </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: getRiskLevelColor(overallRisk.level) + '.50' }}>
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
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Navigation Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab icon={<InfoIcon />} iconPosition="start" label="Project Overview" />
          <Tab icon={<AssessmentIcon />} iconPosition="start" label="Risk Analysis" />
          <Tab icon={<BuildIcon />} iconPosition="start" label="Mitigation Strategy" />
          <Tab icon={<TimelineIcon />} iconPosition="start" label="Implementation Timeline" />
          <Tab icon={<ChatIcon />} iconPosition="start" label="Consultation History" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* Project Overview */}
          <Grid container spacing={3}>
          {/* Quick Stats */}
            <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Project Type
                    </Typography>
                    <Typography variant="h6">
                      {project.projectInfo?.projectType || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Company Scale
                    </Typography>
                    <Typography variant="h6">
                      {project.projectInfo?.companyScale || 'N/A'}
              </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Project Phase
                          </Typography>
                    <Typography variant="h6">
                      {project.projectInfo?.projectPhase || 'N/A'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Duration
                    </Typography>
                    <Typography variant="h6">
                      {project.projectInfo?.projectDuration || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              </Grid>
            </Grid>

          {/* Detailed Information Sections */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
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
            </Paper>
            </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
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
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Risk Analysis */}
            <Grid container spacing={3}>
          {/* Risk Radar Chart */}
              <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '500px' }}>
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
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

          {/* Risk Details */}
              <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '500px', overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Risk Breakdown
              </Typography>
              <List>
                {Object.entries(project.riskResults || {})
                  .filter(([riskType]) => riskType !== '_id' && riskType !== 'id')
                    .map(([riskType, analysis]: [string, any]) => {
                    if (!analysis || typeof analysis !== 'object') return null;
                    
                    const score = analysis.score || 0;
                    const level = analysis.level || 'low';
                    
                    return (
                      <ListItem key={riskType} sx={{ px: 0 }}>
                        <Card sx={{ width: '100%', mb: 1 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                  {riskType.replace(/([A-Z])/g, ' $1').trim()}
                                </Typography>
                                <Chip 
                                label={`${score}%`}
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
                        </Card>
                      </ListItem>
                    );
                  })}
              </List>
            </Paper>
                </Grid>
              </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Mitigation Strategy */}
        {project.mitigationStrategy ? (
            <Grid container spacing={3}>
            {/* Strategy Overview */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                  Mitigation Strategy Overview
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="overline" color="text.secondary">
                        Initial Risk
                  </Typography>
                      <Typography variant="h4" color="error.main">
                      {((project.mitigationStrategy.initialRisk || 0) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <TrendingDownIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                      <Typography variant="h5" color="primary.main">
                      {(project.mitigationStrategy.totalReductionPercentage || 0).toFixed(1)}%
                    </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Reduction
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="overline" color="text.secondary">
                        Final Risk
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {((project.mitigationStrategy.finalRisk || 0) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                </Paper>
              </Grid>

            {/* Risk Reduction Chart */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
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
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">
            No mitigation strategy has been developed for this project yet.
          </Alert>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {/* Implementation Timeline */}
        {project.mitigationStrategy?.rounds ? (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Implementation History
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
                    <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
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

                      {round.recommendations && round.recommendations.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Implemented Recommendations:
                          </Typography>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Feature</TableCell>
                                  <TableCell>Current</TableCell>
                                  <TableCell>Recommended</TableCell>
                                  <TableCell>Impact</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {round.recommendations.slice(0, 5).map((rec: any, recIndex: number) => (
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
                                        label={rec.importance} 
                                        size="small" 
                                        color={rec.importance === 'High' ? 'error' : rec.importance === 'Medium' ? 'warning' : 'default'}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          {round.recommendations.length > 5 && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              And {round.recommendations.length - 5} more recommendations...
                            </Typography>
                          )}
                        </Box>
                      )}
                          </Paper>
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

      <TabPanel value={tabValue} index={4}>
        {/* Consultation History */}
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
                        <Paper 
                          elevation={1} 
                          sx={{ 
                            p: 2, 
                            bgcolor: message.sender === 'user' ? 'primary.50' : 'grey.50',
                            borderLeft: `4px solid ${message.sender === 'user' ? 'primary.main' : 'grey.400'}`
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar sx={{ 
                              width: 32, 
                              height: 32, 
                              mr: 1,
                              bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.600'
                            }}>
                              {message.sender === 'user' ? 'U' : 'AI'}
                            </Avatar>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {message.sender === 'user' ? 'You' : 'Dr. CyberBuild'}
                          </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                              {new Date(message.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {message.text}
                            </Typography>
                          </Paper>
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
    </Container>
  );
};

export default ProjectDetails; 