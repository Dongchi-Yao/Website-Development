import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Slider,
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
} from '@mui/material';
import { motion } from 'framer-motion';
import AssessmentIcon from '@mui/icons-material/Assessment';

interface RiskFactors {
  dataSensitivity: number;
  systemComplexity: number;
  accessControl: number;
  networkSecurity: number;
  supplyChainRisk: number;
  complianceRequirements: number;
}

const RiskQuantification = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [riskFactors, setRiskFactors] = useState<RiskFactors>({
    dataSensitivity: 50,
    systemComplexity: 50,
    accessControl: 50,
    networkSecurity: 50,
    supplyChainRisk: 50,
    complianceRequirements: 50,
  });
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    projectType: '',
    budget: '',
    duration: '',
  });

  const steps = ['Project Information', 'Risk Assessment', 'Review & Calculate'];

  const handleRiskFactorChange = (factor: keyof RiskFactors) => (event: Event, newValue: number | number[]) => {
    setRiskFactors({
      ...riskFactors,
      [factor]: newValue as number,
    });
  };

  const handleProjectInfoChange = (field: keyof typeof projectInfo) => (
    event: React.ChangeEvent<HTMLInputElement>
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

  const calculateRiskScore = () => {
    const total = Object.values(riskFactors).reduce((sum, value) => sum + value, 0);
    return Math.round(total / Object.keys(riskFactors).length);
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return 'Low';
    if (score < 70) return 'Medium';
    return 'High';
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

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Name"
                  value={projectInfo.projectName}
                  onChange={handleProjectInfoChange('projectName')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Project Type</InputLabel>
                  <Select
                    value={projectInfo.projectType}
                    label="Project Type"
                    onChange={(e) => setProjectInfo({ ...projectInfo, projectType: e.target.value })}
                  >
                    <MenuItem value="residential">Residential</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="infrastructure">Infrastructure</MenuItem>
                    <MenuItem value="industrial">Industrial</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Budget"
                  value={projectInfo.budget}
                  onChange={handleProjectInfoChange('budget')}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Duration (months)"
                  value={projectInfo.duration}
                  onChange={handleProjectInfoChange('duration')}
                  type="number"
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={4}>
              {Object.entries(riskFactors).map(([factor, value]) => (
                <Grid item xs={12} key={factor}>
                  <Typography gutterBottom>
                    {factor.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </Typography>
                  <Slider
                    value={value}
                    onChange={handleRiskFactorChange(factor as keyof RiskFactors)}
                    valueLabelDisplay="auto"
                    step={10}
                    marks
                    min={0}
                    max={100}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">Low Risk</Typography>
                    <Typography variant="caption">High Risk</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Risk Assessment Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.default' }}>
                    <Typography variant="h6" gutterBottom>
                      Project Details
                    </Typography>
                    <Typography>Name: {projectInfo.projectName}</Typography>
                    <Typography>Type: {projectInfo.projectType}</Typography>
                    <Typography>Budget: ${projectInfo.budget}</Typography>
                    <Typography>Duration: {projectInfo.duration} months</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.default' }}>
                    <Typography variant="h6" gutterBottom>
                      Risk Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="h4">
                          {calculateRiskScore()}%
                        </Typography>
                        <Typography color="text.secondary">
                          Risk Level: {getRiskLevel(calculateRiskScore())}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="info">
                    This is a preliminary risk assessment. For a comprehensive analysis, please consult with our security experts.
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? undefined : handleNext}
              disabled={activeStep === steps.length - 1}
            >
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default RiskQuantification; 