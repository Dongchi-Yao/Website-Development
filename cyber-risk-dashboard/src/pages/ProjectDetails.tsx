import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';

const ProjectDetails = () => {
  const { projectId } = useParams();
  
  // Sample data for each project
  const projectData = {
    'project-a': {
      title: "Project A",
      description: "Enterprise Infrastructure Security Assessment",
      date: "March 2024",
      riskScore: 72,
      analysis: {
        topicModeling: {
          topics: [
            { topic: "Network Security", confidence: 0.85 },
            { topic: "Access Control", confidence: 0.78 },
            { topic: "Data Protection", confidence: 0.92 }
          ],
          summary: "Analysis revealed critical concerns in network segmentation and access control mechanisms."
        },
        riskIdentification: {
          threats: [
            { threat: "Unauthorized Access", severity: "High", likelihood: "Medium" },
            { threat: "Data Breach", severity: "Critical", likelihood: "Low" },
            { threat: "System Downtime", severity: "Medium", likelihood: "Medium" }
          ],
          summary: "AI analysis identified potential vulnerabilities in authentication systems and data handling procedures."
        },
        riskQuantification: {
          metrics: [
            { metric: "Security Controls", score: 85 },
            { metric: "Vulnerability Management", score: 70 },
            { metric: "Incident Response", score: 65 }
          ],
          summary: "Quantitative assessment shows strong security controls but needs improvement in incident response capabilities."
        }
      }
    },
    'project-b': {
      title: "Project B",
      description: "Cloud Migration Risk Analysis",
      date: "April 2024",
      riskScore: 65,
      analysis: {
        topicModeling: {
          topics: [
            { topic: "Cloud Security", confidence: 0.88 },
            { topic: "Data Migration", confidence: 0.82 },
            { topic: "Compliance", confidence: 0.75 }
          ],
          summary: "Analysis highlighted concerns in cloud security configurations and data migration processes."
        },
        riskIdentification: {
          threats: [
            { threat: "Cloud Misconfiguration", severity: "High", likelihood: "High" },
            { threat: "Data Loss", severity: "Critical", likelihood: "Medium" },
            { threat: "Compliance Violation", severity: "High", likelihood: "Low" }
          ],
          summary: "AI analysis identified potential risks in cloud configuration and data migration procedures."
        },
        riskQuantification: {
          metrics: [
            { metric: "Cloud Security", score: 75 },
            { metric: "Data Protection", score: 60 },
            { metric: "Compliance", score: 70 }
          ],
          summary: "Quantitative assessment indicates moderate cloud security measures with room for improvement in data protection."
        }
      }
    },
    'project-c': {
      title: "Project C",
      description: "IoT Security Framework Implementation",
      date: "Q2 2024",
      riskScore: 58,
      analysis: {
        topicModeling: {
          topics: [
            { topic: "IoT Security", confidence: 0.90 },
            { topic: "Device Management", confidence: 0.85 },
            { topic: "Network Integration", confidence: 0.78 }
          ],
          summary: "Analysis revealed significant concerns in IoT device security and network integration."
        },
        riskIdentification: {
          threats: [
            { threat: "Device Compromise", severity: "Critical", likelihood: "High" },
            { threat: "Network Breach", severity: "High", likelihood: "Medium" },
            { threat: "Data Interception", severity: "High", likelihood: "High" }
          ],
          summary: "AI analysis identified critical vulnerabilities in IoT device security and network communication."
        },
        riskQuantification: {
          metrics: [
            { metric: "Device Security", score: 55 },
            { metric: "Network Protection", score: 60 },
            { metric: "Data Security", score: 65 }
          ],
          summary: "Quantitative assessment shows significant gaps in IoT device security and network protection measures."
        }
      }
    }
  };

  const project = projectData[projectId as keyof typeof projectData];

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" color="error">Project not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {project.title}
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {project.description}
      </Typography>
      <Typography color="text.secondary" paragraph>
        Analysis Date: {project.date}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>Overall Risk Score</Typography>
        <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={project.riskScore} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: project.riskScore > 70 ? 'success.main' : 
                                   project.riskScore > 50 ? 'warning.main' : 'error.main'
                  }
                }} 
              />
            </Box>
            <Typography variant="h4" color="primary">
              {project.riskScore}%
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Stepper activeStep={-1} alternativeLabel sx={{ mb: 4 }}>
        <Step>
          <StepLabel>Topic Modeling</StepLabel>
        </Step>
        <Step>
          <StepLabel>Risk Identification</StepLabel>
        </Step>
        <Step>
          <StepLabel>Risk Quantification</StepLabel>
        </Step>
      </Stepper>

      <Grid container spacing={3}>
        {/* Topic Modeling Results */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChatIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Topic Modeling</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {project.analysis.topicModeling.topics.map((topic, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">{topic.topic}</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={topic.confidence * 100} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {project.analysis.topicModeling.summary}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Identification Results */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Risk Identification</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {project.analysis.riskIdentification.threats.map((threat, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">{threat.threat}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip 
                      label={`Severity: ${threat.severity}`} 
                      color={threat.severity === 'Critical' ? 'error' : 
                             threat.severity === 'High' ? 'warning' : 'default'}
                      size="small"
                    />
                    <Chip 
                      label={`Likelihood: ${threat.likelihood}`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
              ))}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {project.analysis.riskIdentification.summary}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Quantification Results */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Risk Quantification</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {project.analysis.riskQuantification.metrics.map((metric, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">{metric.metric}</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={metric.score} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: metric.score > 70 ? 'success.main' : 
                                       metric.score > 50 ? 'warning.main' : 'error.main'
                      }
                    }}
                  />
                </Box>
              ))}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {project.analysis.riskQuantification.summary}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProjectDetails; 