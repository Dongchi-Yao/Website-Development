import { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Chip, Button, CircularProgress, Alert, Grid, Card, CardContent, Switch, FormControlLabel, Tabs, Tab, IconButton, Snackbar } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import { useOrganization } from '../contexts/OrganizationContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface SavedProject {
  id: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  projectType: string;
  companyScale: string;
  averageRisk: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const Reports = () => {
  const navigate = useNavigate();
  const { user, isManager } = useAuth();
  const { projects: orgProjects, metrics: orgMetrics, fetchOrganizationProjects, isLoading: orgLoading } = useOrganization();
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useDummyData, setUseDummyData] = useState(false);
  const [viewMode, setViewMode] = useState<'personal' | 'organization'>(isManager() ? 'organization' : 'personal');
  const [codeCopied, setCodeCopied] = useState(false);

  // Dummy data for presentation
  const dummyProjects: SavedProject[] = [
    {
      id: 'dummy-1',
      projectName: 'Smart City Infrastructure Hub',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      projectType: 'Smart Infrastructure',
      companyScale: 'Large',
      averageRisk: 0.25,
      riskLevel: 'low'
    },
    {
      id: 'dummy-2',
      projectName: 'Corporate Office Complex',
      createdAt: '2024-01-18T09:15:00Z',
      updatedAt: '2024-01-25T11:20:00Z',
      projectType: 'Commercial Building',
      companyScale: 'Medium',
      averageRisk: 0.45,
      riskLevel: 'medium'
    },
    {
      id: 'dummy-3',
      projectName: 'Residential Tower Development',
      createdAt: '2024-02-02T16:00:00Z',
      updatedAt: '2024-02-08T13:30:00Z',
      projectType: 'Residential Building',
      companyScale: 'Large',
      averageRisk: 0.35,
      riskLevel: 'medium'
    },
    {
      id: 'dummy-4',
      projectName: 'IoT Manufacturing Plant',
      createdAt: '2024-02-10T08:45:00Z',
      updatedAt: '2024-02-15T17:10:00Z',
      projectType: 'Industrial Facility',
      companyScale: 'Large',
      averageRisk: 0.65,
      riskLevel: 'high'
    },
    {
      id: 'dummy-5',
      projectName: 'Data Center Expansion',
      createdAt: '2024-02-20T12:20:00Z',
      updatedAt: '2024-02-25T10:55:00Z',
      projectType: 'Critical Infrastructure',
      companyScale: 'Large',
      averageRisk: 0.75,
      riskLevel: 'critical'
    },
    {
      id: 'dummy-6',
      projectName: 'Small Business Office',
      createdAt: '2024-03-01T14:10:00Z',
      updatedAt: '2024-03-05T09:40:00Z',
      projectType: 'Commercial Building',
      companyScale: 'Small',
      averageRisk: 0.20,
      riskLevel: 'low'
    },
    {
      id: 'dummy-7',
      projectName: 'Smart Hospital Network',
      createdAt: '2024-03-08T11:25:00Z',
      updatedAt: '2024-03-12T15:15:00Z',
      projectType: 'Healthcare Facility',
      companyScale: 'Large',
      averageRisk: 0.55,
      riskLevel: 'medium'
    },
    {
      id: 'dummy-8',
      projectName: 'Warehouse Automation Hub',
      createdAt: '2024-03-15T07:30:00Z',
      updatedAt: '2024-03-20T16:45:00Z',
      projectType: 'Industrial Facility',
      companyScale: 'Medium',
      averageRisk: 0.40,
      riskLevel: 'medium'
    },
    {
      id: 'dummy-9',
      projectName: 'School District IT Infrastructure',
      createdAt: '2024-03-22T13:15:00Z',
      updatedAt: '2024-03-28T12:30:00Z',
      projectType: 'Educational Facility',
      companyScale: 'Medium',
      averageRisk: 0.30,
      riskLevel: 'low'
    },
    {
      id: 'dummy-10',
      projectName: 'Financial Services Building',
      createdAt: '2024-04-01T10:00:00Z',
      updatedAt: '2024-04-05T14:20:00Z',
      projectType: 'Commercial Building',
      companyScale: 'Large',
      averageRisk: 0.70,
      riskLevel: 'high'
    }
  ];

  useEffect(() => {
    console.log('Reports useEffect - user:', user);
    console.log('Reports useEffect - user.organization:', user?.organization);
    console.log('Reports useEffect - viewMode:', viewMode);
    
    if (!useDummyData) {
      if (viewMode === 'personal') {
        fetchSavedProjects();
      } else if (viewMode === 'organization' && user?.organization) {
        fetchOrganizationProjects();
      }
    } else {
      setIsLoading(false);
      setError(null);
    }
  }, [useDummyData, viewMode, user?.organization]);

  const fetchSavedProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const projects = await projectService.getUserProjects();
      setSavedProjects(projects);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load your projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (useDummyData) {
      // Don't actually delete dummy data, just show a message
      alert('Demo mode: Project deletion disabled for dummy data');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectService.deleteProject(projectId);
      setSavedProjects(projects => projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project. Please try again.');
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      case 'unknown': return 'default';
      default: return 'default';
    }
  };

  // Get the current projects data based on view mode
  const currentProjects = useDummyData 
    ? dummyProjects 
    : (viewMode === 'organization' ? orgProjects : savedProjects);

  // Dashboard metrics calculations
  const getDashboardMetrics = () => {
    if (!currentProjects || currentProjects.length === 0) {
      return {
        totalProjects: 0,
        totalRiskMitigated: 0,
        averageRiskScore: 0,
        highRiskProjects: 0,
        riskDistribution: [],
        projectTypeDistribution: [],
        companyScaleDistribution: [],
        monthlyTrends: []
      };
    }

    const totalProjects = currentProjects.length;
    
    // Calculate total risk score with proper null checks
    const totalRiskScore = currentProjects.reduce((sum, project) => {
      const risk = project.averageRisk || 0;
      return sum + (isNaN(risk) ? 0 : risk);
    }, 0);
    
    const averageRiskScore = totalProjects > 0 ? totalRiskScore / totalProjects : 0;
    const highRiskProjects = currentProjects.filter(p => 
      p.riskLevel === 'high' || p.riskLevel === 'critical'
    ).length;
    
    // Calculate total risk mitigated (percentage reduction from baseline)
    const totalRiskMitigated = currentProjects.reduce((sum, project) => {
      const risk = project.averageRisk || 0;
      const validRisk = isNaN(risk) ? 0 : risk;
      // Risk score is already 0-1, so mitigated = 1 - risk
      const riskMitigated = 1 - validRisk;
      return sum + riskMitigated;
    }, 0) / totalProjects; // Average risk mitigation across all projects

    // Risk level distribution
    const riskCounts = currentProjects.reduce((acc, project) => {
      const level = project.riskLevel || 'unknown';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const riskDistribution = Object.entries(riskCounts).map(([level, count]) => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      value: count,
      color: level === 'low' ? '#4caf50' : level === 'medium' ? '#ff9800' : '#f44336'
    }));

    // Project type distribution
    const typeCounts = currentProjects.reduce((acc, project) => {
      const type = project.projectType || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const projectTypeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: count
    }));

    // Company scale distribution
    const scaleCounts = currentProjects.reduce((acc, project) => {
      const scale = project.companyScale || 'Unknown';
      acc[scale] = (acc[scale] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const companyScaleDistribution = Object.entries(scaleCounts).map(([scale, count]) => ({
      name: scale,
      projects: count
    }));

    // Monthly trends (last 6 months)
    const monthlyData = currentProjects.reduce((acc, project) => {
      if (!project.createdAt) return acc;
      
      const month = new Date(project.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!acc[month]) {
        acc[month] = { month, projects: 0, avgRisk: 0, totalRisk: 0 };
      }
      acc[month].projects += 1;
      
      const risk = project.averageRisk || 0;
      const validRisk = isNaN(risk) ? 0 : risk;
      acc[month].totalRisk += validRisk;
      acc[month].avgRisk = acc[month].totalRisk / acc[month].projects;
      return acc;
    }, {} as Record<string, any>);

    const monthlyTrends = Object.values(monthlyData).slice(-6);

    return {
      totalProjects,
      totalRiskMitigated: Math.round((isNaN(totalRiskMitigated) ? 0 : totalRiskMitigated) * 100), // Convert to percentage
      averageRiskScore: Math.round((isNaN(averageRiskScore) ? 0 : averageRiskScore) * 100), // Convert to percentage
      highRiskProjects,
      riskDistribution,
      projectTypeDistribution,
      companyScaleDistribution,
      monthlyTrends
    };
  };

  const metrics = getDashboardMetrics();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleProjectClick = (projectId: string) => {
    if (useDummyData) {
      alert('Demo mode: Project navigation disabled for dummy data');
      return;
    }
    // Navigate to project details page
    navigate(`/project-details/${projectId}`);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1">
              Reports & Research
            </Typography>
            {user?.organization && (
              <Typography variant="subtitle1" color="text.secondary">
                {user.organization.name}
              </Typography>
            )}
          </Box>
          
          {/* Dev Tool Toggle */}
          <Paper elevation={2} sx={{ p: 2, bgcolor: 'grey.50', border: '2px dashed', borderColor: 'grey.300' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DeveloperModeIcon color="primary" />
              <FormControlLabel
                control={
                  <Switch
                    checked={useDummyData}
                    onChange={(e) => setUseDummyData(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {useDummyData ? 'Demo Data' : 'Live Data'}
                  </Typography>
                }
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {useDummyData ? 'Showing presentation data' : 'Showing real user data'}
            </Typography>
          </Paper>
        </Box>
        
        {/* View Mode Tabs - Only show for managers */}
        {isManager() && user?.organization && (
          <>
            <Paper elevation={1} sx={{ mb: 4 }}>
              <Tabs
                value={viewMode}
                onChange={(e, newValue) => setViewMode(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab
                  icon={<PersonIcon />}
                  iconPosition="start"
                  label="My Projects"
                  value="personal"
                />
                <Tab
                  icon={<GroupIcon />}
                  iconPosition="start"
                  label="Organization Overview"
                  value="organization"
                />
              </Tabs>
            </Paper>
            
            {/* Organization Management Card - Only in organization view */}
            {viewMode === 'organization' && user.organization && (
              <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'primary.50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Organization Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Share the organization code with team members to invite them
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupAddIcon color="primary" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Organization Code
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
                              {user.organization?.code || ''}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => {
                                if (user.organization?.code) {
                                  navigator.clipboard.writeText(user.organization.code);
                                  setCodeCopied(true);
                                  setTimeout(() => setCodeCopied(false), 2000);
                                }
                              }}
                              title="Copy organization code"
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              </Paper>
            )}
          </>
        )}
        
        {/* Dashboard Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Dashboard Overview
          </Typography>
          
          {(viewMode === 'personal' ? isLoading : orgLoading) && !useDummyData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (!useDummyData && error) ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : currentProjects.length === 0 ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No data available yet
              </Typography>
              <Typography color="text.secondary">
                Complete risk assessments to see your dashboard metrics
              </Typography>
            </Paper>
          ) : (
            <Box>
              {/* Key Metrics Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={3}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {metrics.totalProjects}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Projects
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={3}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {metrics.totalRiskMitigated}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Risk Mitigated
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={3}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <AssessmentIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                        {metrics.averageRiskScore}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Risk Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={3}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <SecurityIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                        {metrics.highRiskProjects}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        High Risk Projects
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Charts */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Risk Level Distribution */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                      Risk Level Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={metrics.riskDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {metrics.riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Project Type Distribution */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                      Projects by Type
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={metrics.projectTypeDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1976d2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Company Scale Distribution */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                      Projects by Company Scale
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={metrics.companyScaleDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="projects" fill="#4caf50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Monthly Trends */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                      Monthly Risk Trends
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={metrics.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="projects" stroke="#1976d2" name="Projects Created" />
                        <Line type="monotone" dataKey="avgRisk" stroke="#f44336" name="Avg Risk Score" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        {/* Projects Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            {viewMode === 'organization' ? 'Organization Projects' : 'Your Saved Projects'}
          </Typography>
          
          {(viewMode === 'personal' ? isLoading : orgLoading) && !useDummyData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (!useDummyData && error) ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : currentProjects.length === 0 ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No saved projects yet
              </Typography>
              <Typography color="text.secondary">
                Complete a risk assessment to save your first project
              </Typography>
            </Paper>
          ) : (
            <Box>
              {viewMode === 'organization' && orgMetrics && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {/* User Performance Overview */}
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Projects by Team Member
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {orgMetrics.projectsByUser && Object.keys(orgMetrics.projectsByUser).length > 0 ? (
                          Object.entries(orgMetrics.projectsByUser).map(([userName, count]) => (
                            <Box key={userName} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">{userName}</Typography>
                              <Chip label={`${count} project${count > 1 ? 's' : ''}`} size="small" />
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No project data available
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                  
                  {/* Average Risk by User */}
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Average Risk Score by Team Member
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {orgMetrics.averageRiskByUser && Object.keys(orgMetrics.averageRiskByUser).length > 0 ? (
                          Object.entries(orgMetrics.averageRiskByUser).map(([userName, avgRisk]) => {
                            const riskValue = typeof avgRisk === 'number' && !isNaN(avgRisk) ? avgRisk : 0;
                            return (
                              <Box key={userName} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2">{userName}</Typography>
                                  <Typography variant="body2" color={riskValue < 0.4 ? 'success.main' : riskValue < 0.7 ? 'warning.main' : 'error.main'}>
                                    {(riskValue * 100).toFixed(1)}%
                                  </Typography>
                                </Box>
                                <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                                  <Box
                                    sx={{
                                      width: `${riskValue * 100}%`,
                                      bgcolor: riskValue < 0.4 ? 'success.main' : riskValue < 0.7 ? 'warning.main' : 'error.main',
                                      borderRadius: 1,
                                      height: '100%',
                                      transition: 'width 0.5s ease-in-out'
                                    }}
                                  />
                                </Box>
                              </Box>
                            );
                          })
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No risk data available
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {currentProjects.map((project: any) => (
                  <Paper 
                    key={project.id} 
                    elevation={2} 
                    sx={{ 
                      p: 3,
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {project.projectName || 'Unnamed Project'}
                        </Typography>
                        {viewMode === 'organization' && project.userId && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <PersonIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {project.userId.name || 'Unknown User'} ({project.userId.email || 'No email'})
                            </Typography>
                          </Box>
                        )}
                        <Typography color="text.secondary" gutterBottom>
                          {project.updatedAt ? formatDate(project.updatedAt) : 'No date'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {project.projectType || 'Unknown Type'} • {project.companyScale || 'Unknown Scale'} Company
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip 
                          label={`${(project.riskLevel || 'unknown').toUpperCase()} RISK`}
                          size="small"
                          color={getRiskLevelColor(project.riskLevel || 'unknown') as any}
                        />
                        {viewMode === 'personal' && (
                          <Button
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Average Risk Score: {((project.averageRisk || 0) * 100).toFixed(1)}%
                      </Typography>
                      {viewMode === 'organization' && (
                        <Typography variant="caption" color="text.secondary">
                          Last updated: {project.updatedAt ? new Date(project.updatedAt).toLocaleTimeString() : 'Unknown'}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Container>
      
      {/* Snackbar for code copy notification */}
      <Snackbar
        open={codeCopied}
        autoHideDuration={2000}
        onClose={() => setCodeCopied(false)}
        message="Organization code copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default Reports; 