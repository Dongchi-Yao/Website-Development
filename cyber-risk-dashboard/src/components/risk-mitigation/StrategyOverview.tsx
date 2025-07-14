import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Button,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingDown as TrendingDownIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import type { RiskMitigationStrategy } from '../../services/riskMitigationService';

interface StrategyOverviewProps {
  strategy: RiskMitigationStrategy;
  selectedRound: number;
  isUpdatingStrategy: boolean;
  onRoundSelect: (round: number) => void;
  currentRiskScore?: number; // Override for consistent risk calculation
}

export const StrategyOverview: React.FC<StrategyOverviewProps> = ({
  strategy,
  selectedRound,
  isUpdatingStrategy,
  onRoundSelect,
  currentRiskScore,
}) => {
  const theme = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getRiskLevelColor = (risk: number) => {
    if (risk >= 0.8) return theme.palette.error.main;
    if (risk >= 0.6) return theme.palette.warning.main;
    if (risk >= 0.3) return theme.palette.info.main;
    return theme.palette.success.main;
  };

  const getRiskLevelLabel = (risk: number) => {
    if (risk < 0.3) return 'Low';
    if (risk < 0.6) return 'Medium';
    if (risk < 0.85) return 'High';
    return 'Critical';
  };

  // Helper function to calculate and format risk reduction properly
  const formatRiskReduction = (round: any) => {
    // Use consistent current risk calculation
    const currentRisk = currentRiskScore !== undefined ? currentRiskScore : strategy.initialRisk;
    
    // Calculate absolute percentage point reduction
    const absoluteReduction = (currentRisk - round.projectedRisk) * 100;
    
    return absoluteReduction.toFixed(1);
  };

  // Helper function to calculate total risk reduction properly
  const formatTotalReduction = () => {
    // Use consistent current risk calculation
    const currentRisk = currentRiskScore !== undefined ? currentRiskScore : strategy.initialRisk;
    
    // Calculate absolute percentage point reduction from current to final
    const absoluteReduction = (currentRisk - strategy.finalRisk) * 100;
    
    return absoluteReduction.toFixed(1);
  };

  // Helper function to calculate implementation progress based on actual risk reduction
  const calculateImplementationProgress = () => {
    // Calculate progress based on actual risk reduction achieved
    // Progress = (Initial Risk - Current Risk) / (Initial Risk - Final Risk) * 100
    
    const initialRisk = strategy.initialRisk;
    const finalRisk = strategy.finalRisk;
    const currentRisk = currentRiskScore !== undefined ? currentRiskScore : initialRisk;
    
    // If no risk reduction is possible, return 0
    if (initialRisk <= finalRisk) return 0;
    
    // Calculate the total possible reduction
    const totalPossibleReduction = initialRisk - finalRisk;
    
    // Calculate the achieved reduction so far
    const achievedReduction = initialRisk - currentRisk;
    
    // Calculate progress as a percentage
    const progressPercentage = (achievedReduction / totalPossibleReduction) * 100;
    
    // Ensure progress is between 0 and 100
    return Math.max(0, Math.min(progressPercentage, 100));
  };

  const implementationProgress = calculateImplementationProgress();

  return (
    <Box>
      {/* Overall Strategy Summary */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon color="primary" />
          Risk Mitigation Strategy Overview
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Current Risk Level
              </Typography>
              <Typography variant="h4" sx={{ color: getRiskLevelColor(currentRiskScore !== undefined ? currentRiskScore : strategy.initialRisk), fontWeight: 'bold' }}>
                {currentRiskScore !== undefined ? (currentRiskScore * 100).toFixed(0) : (strategy.initialRisk * 100).toFixed(0)}%
              </Typography>
              <Chip 
                label={getRiskLevelLabel(currentRiskScore !== undefined ? currentRiskScore : strategy.initialRisk)} 
                size="small" 
                sx={{ 
                  mt: 1,
                  bgcolor: alpha(getRiskLevelColor(currentRiskScore !== undefined ? currentRiskScore : strategy.initialRisk), 0.1),
                  color: getRiskLevelColor(currentRiskScore !== undefined ? currentRiskScore : strategy.initialRisk),
                  fontWeight: 'bold'
                }} 
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Final Risk Level
              </Typography>
              <Typography variant="h4" sx={{ color: getRiskLevelColor(strategy.finalRisk), fontWeight: 'bold' }}>
                {(strategy.finalRisk * 100).toFixed(0)}%
              </Typography>
              <Chip 
                label={getRiskLevelLabel(strategy.finalRisk)} 
                size="small" 
                sx={{ 
                  mt: 1,
                  bgcolor: alpha(getRiskLevelColor(strategy.finalRisk), 0.1),
                  color: getRiskLevelColor(strategy.finalRisk),
                  fontWeight: 'bold'
                }} 
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Reduction
              </Typography>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                -{formatTotalReduction()}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <TrendingDownIcon color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                  Risk Decreased
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Implementation Priority
              </Typography>
              <Chip 
                label={strategy.implementationPriority.toUpperCase()} 
                color={
                  strategy.implementationPriority === 'high' ? 'error' :
                  strategy.implementationPriority === 'medium' ? 'warning' : 'success'
                }
                sx={{ mt: 2, fontWeight: 'bold' }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Risk Reduction Progress Bar */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Risk Reduction Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {implementationProgress.toFixed(1)}% Risk Reduced
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={implementationProgress} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              bgcolor: alpha(theme.palette.error.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                bgcolor: theme.palette.success.main,
              }
            }} 
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Initial Risk: {(strategy.initialRisk * 100).toFixed(0)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Target Risk: {(strategy.finalRisk * 100).toFixed(0)}%
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Rounds Overview */}
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Implementation Rounds
      </Typography>
      
      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        {strategy.rounds.map((round) => (
          <Grid item xs={12} md={6} lg={4} key={round.roundNumber}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid transparent',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  borderColor: theme.palette.primary.main,
                }
              }}
              onClick={() => onRoundSelect(round.roundNumber)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    Round {round.roundNumber}
                  </Typography>
                  <Chip 
                    label={`${round.recommendations.length} Actions`} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                {/* Risk Reduction Visual */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Current Risk
                      </Typography>
                      <Typography variant="h6" sx={{ color: getRiskLevelColor(currentRiskScore !== undefined ? currentRiskScore : round.currentRisk) }}>
                        {((currentRiskScore !== undefined ? currentRiskScore : round.currentRisk) * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                    
                    <ArrowForwardIcon color="action" sx={{ mx: 2 }} />
                    
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        After Round
                      </Typography>
                                          <Typography variant="h6" sx={{ color: getRiskLevelColor(round.projectedRisk) }}>
                      {(round.projectedRisk * 100).toFixed(0)}%
                    </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1), 
                    borderRadius: 2, 
                    p: 1.5,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
                      -{formatRiskReduction(round)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Risk Reduction
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Focus Areas */}
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Focus Areas:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {round.features.map((feature, idx) => (
                    <Chip 
                      key={idx} 
                      label={feature} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRoundSelect(round.roundNumber);
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 