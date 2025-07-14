import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Alert,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  LinearProgress,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Sort as SortIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as CostIcon,
  PriorityHigh as PriorityIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  SmartToy as SmartToyIcon,
  TrendingDown as TrendingDownIcon,
  PlayArrow as PlayArrowIcon,
  Check as CheckIcon,
  Undo as UndoIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import type { RiskMitigationRound, RiskMitigationRecommendation } from '../../services/riskMitigationService';
import { motion, AnimatePresence } from 'framer-motion';

interface RoundDetailsProps {
  round: RiskMitigationRound;
  isUpdatingStrategy: boolean;
  appliedRecommendations: Set<string>;
  lockedRecommendations: Set<string>;
  enhancedDescriptions: Map<string, RiskMitigationRecommendation>;
  onApplyRecommendation: (recommendation: RiskMitigationRecommendation) => void;
  onUnapplyRecommendation: (recommendation: RiskMitigationRecommendation) => void;
  onToggleRecommendationLock: (recommendationId: string) => void;
  onAskChatAboutRecommendation: (recommendation: RiskMitigationRecommendation, enhanced?: RiskMitigationRecommendation | null) => void;
  onContinueToNextRound: () => void;
  applyingRecommendation: string | null;
  hasNextRound: boolean;
  currentRiskScore?: number; // Reliable risk calculation from Risk Analysis Results
  initialRisk?: number; // Initial risk before any mitigation (remains constant)
}

type SortOption = 'default' | 'riskReduction' | 'cost' | 'priority';
type SortDirection = 'asc' | 'desc';

export const RoundDetails: React.FC<RoundDetailsProps> = ({
  round,
  isUpdatingStrategy,
  appliedRecommendations,
  lockedRecommendations,
  enhancedDescriptions,
  onApplyRecommendation,
  onUnapplyRecommendation,
  onToggleRecommendationLock,
  onAskChatAboutRecommendation,
  onContinueToNextRound,
  applyingRecommendation,
  hasNextRound,
  currentRiskScore,
  initialRisk,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const [hoveredSort, setHoveredSort] = useState(false);
  const theme = useTheme();

  const handleSortClick = (option: SortOption) => {
    if (sortBy === option) {
      // Toggle direction if clicking the same option
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort option with default direction
      setSortBy(option);
      setSortDirection(option === 'cost' ? 'asc' : 'desc');
    }
  };

  const sortedRecommendations = useMemo(() => {
    const recommendations = [...round.recommendations];
    
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortBy) {
      case 'riskReduction':
        return recommendations.sort((a, b) => {
          // Check both riskReductionPercentage and calculatedRiskReduction from enhanced descriptions
          const aEnhanced = enhancedDescriptions.get(`${a.featureGroup}-${a.featureName}-${a.description}`);
          const bEnhanced = enhancedDescriptions.get(`${b.featureGroup}-${b.featureName}-${b.description}`);
          
          const aReduction = aEnhanced?.calculatedRiskReduction || a.riskReductionPercentage || 0;
          const bReduction = bEnhanced?.calculatedRiskReduction || b.riskReductionPercentage || 0;
          
          return (bReduction - aReduction) * multiplier;
        });
      case 'cost':
        return recommendations.sort((a, b) => {
          const aCost = enhancedDescriptions.get(`${a.featureGroup}-${a.featureName}-${a.description}`)?.costLevel || 0;
          const bCost = enhancedDescriptions.get(`${b.featureGroup}-${b.featureName}-${b.description}`)?.costLevel || 0;
          return (aCost - bCost) * multiplier;
        });
      case 'priority':
        return recommendations.sort((a, b) => {
          const aImportance = enhancedDescriptions.get(`${a.featureGroup}-${a.featureName}-${a.description}`)?.importance || '';
          const bImportance = enhancedDescriptions.get(`${b.featureGroup}-${b.featureName}-${b.description}`)?.importance || '';
          
          const getPriorityValue = (importance: string) => {
            if (importance.toLowerCase().includes('critical')) return 4;
            if (importance.toLowerCase().includes('high')) return 3;
            if (importance.toLowerCase().includes('medium')) return 2;
            return 1;
          };
          
          return (getPriorityValue(bImportance) - getPriorityValue(aImportance)) * multiplier;
        });
      default:
        return recommendations;
    }
  }, [round.recommendations, sortBy, sortDirection, enhancedDescriptions]);

  const appliedCount = round.recommendations.filter(rec => {
    const recommendationId = `${rec.featureGroup}-${rec.recommendedOption}`;
    const persistentId = `${rec.featureGroup}-${rec.currentOption}-to-${rec.recommendedOption}`;
    return appliedRecommendations.has(recommendationId) || appliedRecommendations.has(persistentId);
  }).length;

  const handleContinueToNextRound = () => {
    setShowContinueDialog(true);
  };

  const confirmContinueToNextRound = () => {
    setShowContinueDialog(false);
    onContinueToNextRound();
  };

  const getRecommendationId = (rec: RiskMitigationRecommendation) => 
    `${rec.featureGroup}-${rec.featureName}-${rec.description}`;

  const getCostDisplay = (costLevel?: number) => {
    if (!costLevel) return '$$';
    return '$'.repeat(Math.min(Math.max(costLevel, 1), 4));
  };

  const getCostColor = (costLevel?: number) => {
    if (!costLevel) return theme.palette.warning.main;
    switch (costLevel) {
      case 1: return theme.palette.success.main;
      case 2: return theme.palette.warning.main;
      case 3: return theme.palette.error.main;
      case 4: return theme.palette.error.dark;
      default: return theme.palette.warning.main;
    }
  };

  const getImportanceColor = (importance?: string) => {
    switch (importance?.toLowerCase()) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#ff9800';
    }
  };

  // Helper function to get risk reduction color based on percentage
  const getRiskReductionColor = (percentage: number) => {
    if (percentage >= 15) return theme.palette.success.dark; // Dark green for high reduction
    if (percentage >= 10) return theme.palette.success.main; // Green for good reduction
    if (percentage >= 5) return theme.palette.warning.main; // Orange for moderate reduction
    return theme.palette.error.main; // Red for low reduction
  };

  // Helper function to format risk reduction display with absolute and relative values
  const formatRiskReduction = (reductionPercentage: number | undefined, currentRisk: number) => {
    if (!reductionPercentage || reductionPercentage === 0) return null;
    
    // Use consistent risk calculation - prefer currentRiskScore over round.currentRisk
    const consistentCurrentRisk = currentRiskScore !== undefined ? currentRiskScore : currentRisk;
    
    // API returns:
    // - currentRisk as decimal (0.85 for 85% risk)
    // - reductionPercentage as relative percentage (25.0 for 25% reduction)
    
    // Convert current risk to percentage for calculation
    const currentRiskPercent = consistentCurrentRisk * 100; // 0.85 → 85%
    
    // Calculate absolute percentage point reduction
    // If current risk is 85% and we reduce by 25%, the absolute reduction is 85% × 25% = 21.25 percentage points
    const absolutePoints = (currentRiskPercent * reductionPercentage) / 100;
    
    // The relative change is already provided by the API
    const relativeChange = reductionPercentage;
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {absolutePoints.toFixed(1)} pts
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {relativeChange.toFixed(1)}% reduction
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Round {round.roundNumber} - Implementation Details
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>How Rounds Work:</strong> For risk reduction, the algorithm gives five rounds. In each round, there are several risk factors, each representing the next uncontrolled, highest-contributing factor from each group. By identifying the next highest-contributing factor from each group and assigning them to a round, the overall risk is reduced significantly after one or two rounds. Early rounds typically achieve the most significant risk reduction.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Round {round.roundNumber} Focus:</strong> This round targets {round.features.join(', ').toLowerCase()} to achieve a {round.reductionPercentage.toFixed(1)}% risk reduction. These changes work synergistically and should be implemented as a coordinated effort within the same timeframe for optimal security enhancement.
        </Typography>
      </Alert>
      
      {/* Round Stats */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          {/* First Row */}
          <Grid item xs={6} sm={2.4} sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Initial Risk</Typography>
            <Typography variant="h6" color="text.secondary">
              {initialRisk ? (initialRisk * 100).toFixed(0) : 'N/A'}%
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2.4} sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Current Risk</Typography>
            <Typography variant="h6">
              {((currentRiskScore !== undefined ? currentRiskScore : round.currentRisk) * 100).toFixed(0)}%
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2.4} sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Projected Risk</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600, mb: 0.5 }}>
                {(round.projectedRisk * 100).toFixed(0)}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                after round
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={2.4} sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Risk Reduction</Typography>
            <Box sx={{ color: getRiskReductionColor(round.reductionPercentage) }}>
              {formatRiskReduction(round.reductionPercentage, currentRiskScore !== undefined ? currentRiskScore : round.currentRisk)}
            </Box>
          </Grid>
          <Grid item xs={6} sm={2.4} sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Suggestions Applied</Typography>
            <Typography variant="h6">
              {appliedCount}/{round.recommendations.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Recommendations Header with Sorting */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Recommended Changes
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Modern Sort Pills with Animation */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 0.5,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 3,
              p: 0.5,
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={() => setHoveredSort(true)}
            onMouseLeave={() => setHoveredSort(false)}
          >
            <motion.div
              initial={{ width: 'auto' }}
              animate={{ width: hoveredSort ? 'auto' : '80px' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ display: 'flex', gap: '4px', overflow: 'hidden' }}
            >
              <Chip
                label="Default"
                size="small"
                onClick={() => handleSortClick('default')}
                sx={{
                  bgcolor: sortBy === 'default' ? theme.palette.primary.main : 'transparent',
                  color: sortBy === 'default' ? 'white' : 'text.secondary',
                  fontWeight: sortBy === 'default' ? 600 : 400,
                  '&:hover': {
                    bgcolor: sortBy === 'default' ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.1),
                    color: sortBy === 'default' ? 'white' : theme.palette.primary.main,
                  },
                  transition: 'all 0.2s ease',
                  minWidth: '70px',
                }}
              />
              
              <AnimatePresence>
                {hoveredSort && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: 0 }}
                    >
                      <Chip
                        icon={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TrendingDownIcon sx={{ 
                              fontSize: 16,
                              color: sortBy === 'riskReduction' ? 'inherit' : 'text.secondary',
                            }} />
                            {sortBy === 'riskReduction' && (
                              sortDirection === 'desc' ? 
                                <ArrowDownwardIcon sx={{ fontSize: 12, ml: 0.5, color: 'inherit' }} /> : 
                                <ArrowUpwardIcon sx={{ fontSize: 12, ml: 0.5, color: 'inherit' }} />
                            )}
                          </Box>
                        }
                        label="Risk Impact"
                        size="small"
                        onClick={() => handleSortClick('riskReduction')}
                        sx={{
                          bgcolor: sortBy === 'riskReduction' ? theme.palette.primary.main : 'transparent',
                          color: sortBy === 'riskReduction' ? 'white' : 'text.secondary',
                          fontWeight: sortBy === 'riskReduction' ? 600 : 400,
                          '&:hover': {
                            bgcolor: sortBy === 'riskReduction' ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.1),
                            color: sortBy === 'riskReduction' ? 'white' : theme.palette.primary.main,
                            '& .MuiChip-icon': {
                              color: sortBy === 'riskReduction' ? 'white' : theme.palette.primary.main,
                            }
                          },
                          transition: 'all 0.2s ease',
                          '& .MuiChip-icon': {
                            color: sortBy === 'riskReduction' ? 'white' : 'inherit',
                          }
                        }}
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      <Chip
                        icon={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CostIcon sx={{ 
                              fontSize: 16,
                              color: sortBy === 'cost' ? 'inherit' : 'text.secondary',
                            }} />
                            {sortBy === 'cost' && (
                              sortDirection === 'desc' ? 
                                <ArrowDownwardIcon sx={{ fontSize: 12, ml: 0.5, color: 'inherit' }} /> : 
                                <ArrowUpwardIcon sx={{ fontSize: 12, ml: 0.5, color: 'inherit' }} />
                            )}
                </Box>
                        }
                        label="Cost"
                        size="small"
                        onClick={() => handleSortClick('cost')}
                        sx={{
                          bgcolor: sortBy === 'cost' ? theme.palette.primary.main : 'transparent',
                          color: sortBy === 'cost' ? 'white' : 'text.secondary',
                          fontWeight: sortBy === 'cost' ? 600 : 400,
                          '&:hover': {
                            bgcolor: sortBy === 'cost' ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.1),
                            color: sortBy === 'cost' ? 'white' : theme.palette.primary.main,
                            '& .MuiChip-icon': {
                              color: sortBy === 'cost' ? 'white' : theme.palette.primary.main,
                            }
                          },
                          transition: 'all 0.2s ease',
                          '& .MuiChip-icon': {
                            color: sortBy === 'cost' ? 'white' : 'inherit',
                          }
                        }}
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                    >
                      <Chip
                        icon={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PriorityIcon sx={{ 
                              fontSize: 16,
                              color: sortBy === 'priority' ? 'inherit' : 'text.secondary',
                            }} />
                            {sortBy === 'priority' && (
                              sortDirection === 'desc' ? 
                                <ArrowDownwardIcon sx={{ fontSize: 12, ml: 0.5, color: 'inherit' }} /> : 
                                <ArrowUpwardIcon sx={{ fontSize: 12, ml: 0.5, color: 'inherit' }} />
                            )}
                </Box>
                        }
                        label="Priority"
                        size="small"
                        onClick={() => handleSortClick('priority')}
                        sx={{
                          bgcolor: sortBy === 'priority' ? theme.palette.primary.main : 'transparent',
                          color: sortBy === 'priority' ? 'white' : 'text.secondary',
                          fontWeight: sortBy === 'priority' ? 600 : 400,
                          '&:hover': {
                            bgcolor: sortBy === 'priority' ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.1),
                            color: sortBy === 'priority' ? 'white' : theme.palette.primary.main,
                            '& .MuiChip-icon': {
                              color: sortBy === 'priority' ? 'white' : theme.palette.primary.main,
                            }
                          },
                          transition: 'all 0.2s ease',
                          '& .MuiChip-icon': {
                            color: sortBy === 'priority' ? 'white' : 'inherit',
                          }
                        }}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
                </Box>
          
          {hasNextRound && (
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={handleContinueToNextRound}
              disabled={isUpdatingStrategy}
            >
              Continue to Next Round
            </Button>
          )}
        </Box>
      </Box>

      {/* Loading Animation Overlay */}
      {isUpdatingStrategy && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: alpha(theme.palette.background.default, 0.8),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                size={80}
                thickness={4}
                sx={{
                  color: theme.palette.primary.main,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <SecurityIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              </Box>
            </Box>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Applying Security Changes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recalculating risk scores and updating recommendations...
            </Typography>
          </Box>
        </Box>
      )}

      {/* Recommendations List */}
      <Box>
        {sortedRecommendations.map((recommendation, index) => {
          const recommendationId = `${recommendation.featureGroup}-${recommendation.recommendedOption}`;
          const persistentId = `${recommendation.featureGroup}-${recommendation.currentOption}-to-${recommendation.recommendedOption}`;
          const lockId = `${recommendation.featureGroup}-${recommendation.featureName}`;
          
          const isApplied = appliedRecommendations.has(recommendationId) || appliedRecommendations.has(persistentId);
          const isLocked = lockedRecommendations.has(lockId);
          const isApplying = applyingRecommendation === recommendationId;
          const enhancedRecommendation = enhancedDescriptions.get(`${recommendation.featureGroup}-${recommendation.featureName}-${recommendation.description}`);
          const isAlreadySet = recommendation.currentOption === recommendation.recommendedOption;
          
          return (
            <Card 
              key={`${recommendation.featureGroup}-${recommendation.featureName}-${index}`}
              variant="outlined" 
              sx={{
                mb: 2,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                ...(isApplied && !isAlreadySet && {
                  borderColor: theme.palette.success.main,
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  boxShadow: `0 0 10px ${alpha(theme.palette.success.main, 0.2)}`,
                }),
                ...(isLocked && {
                  border: 'none',
                  bgcolor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.3)
                    : alpha(theme.palette.grey[200], 0.5),
                  boxShadow: theme.palette.mode === 'dark'
                    ? `inset 3px 3px 6px ${alpha('#000', 0.5)}, inset -3px -3px 6px ${alpha('#fff', 0.05)}`
                    : `inset 3px 3px 6px ${alpha('#000', 0.15)}, inset -3px -3px 6px ${alpha('#fff', 0.7)}`,
                  transform: 'scale(0.98)',
                  opacity: 0.7,
                  cursor: 'default',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: theme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${alpha('#000', 0.2)} 0%, transparent 50%, ${alpha('#fff', 0.02)} 100%)`
                      : `linear-gradient(135deg, ${alpha('#000', 0.1)} 0%, transparent 50%, ${alpha('#fff', 0.5)} 100%)`,
                    pointerEvents: 'none',
                  },
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
                    bgcolor: theme.palette.success.main,
                  }}
                />
              )}
              
              {isLocked && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.5)
                      : alpha(theme.palette.grey[300], 0.8),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: theme.palette.mode === 'dark'
                      ? `inset 2px 2px 4px ${alpha('#000', 0.6)}, inset -2px -2px 4px ${alpha('#fff', 0.05)}`
                      : `inset 2px 2px 4px ${alpha('#000', 0.2)}, inset -2px -2px 4px ${alpha('#fff', 0.8)}`,
                  }}
                >
                  <LockIcon sx={{ 
                    color: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.text.primary, 0.5)
                      : alpha(theme.palette.text.primary, 0.4),
                    fontSize: 18 
                  }} />
                </Box>
              )}
              
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ flex: 1 }}>
                        {recommendation.featureName}
                      </Typography>
                      
                      <Tooltip title={isLocked ? "Unlock recommendation" : "Lock recommendation to prevent changes"} arrow>
                        <IconButton
                          size="small"
                          onClick={() => onToggleRecommendationLock(lockId)}
                          sx={{ 
                            color: isLocked 
                              ? theme.palette.warning.main
                              : theme.palette.text.secondary,
                            bgcolor: isLocked
                              ? alpha(theme.palette.warning.main, 0.1)
                              : 'transparent',
                            '&:hover': {
                              bgcolor: isLocked
                                ? alpha(theme.palette.warning.main, 0.2)
                                : alpha(theme.palette.action.hover, 0.8),
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                          }}
                        >
                          {isLocked ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {enhancedRecommendation?.enhancedDescription || recommendation.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        label={getCostDisplay(enhancedRecommendation?.costLevel || recommendation.costLevel)}
                        size="small"
                        sx={{
                          bgcolor: alpha(getCostColor(enhancedRecommendation?.costLevel || recommendation.costLevel), 0.1),
                          color: getCostColor(enhancedRecommendation?.costLevel || recommendation.costLevel),
                          fontWeight: 'bold',
                        }}
                      />
                      
                      <Chip
                        label={`Priority: ${enhancedRecommendation?.importance || recommendation.importance || 'Medium'}`}
                        size="small"
                        sx={{
                          bgcolor: alpha(getImportanceColor(enhancedRecommendation?.importance || recommendation.importance), 0.1),
                          color: getImportanceColor(enhancedRecommendation?.importance || recommendation.importance),
                        }}
                      />

                      {!isAlreadySet && (recommendation.riskReductionPercentage || enhancedRecommendation?.calculatedRiskReduction) && (
                        <Tooltip
                          title={
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                Risk Reduction Impact
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                This shows the absolute percentage point reduction in risk for this specific recommendation.
                              </Typography>
                              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                For example: If your current risk is 85% and this recommendation reduces it by 25%, that's a reduction of 21.3 percentage points (25% of 85%).
                              </Typography>
                            </Box>
                          }
                          arrow
                        >
                          <Chip
                            icon={<TrendingDownIcon fontSize="small" />}
                            label={`-${(((currentRiskScore !== undefined ? currentRiskScore : round.currentRisk) * 100) * (enhancedRecommendation?.calculatedRiskReduction || recommendation.riskReductionPercentage || 0) / 100).toFixed(1)} pts`}
                            size="small"
                            sx={{
                              bgcolor: alpha(getRiskReductionColor(enhancedRecommendation?.calculatedRiskReduction || recommendation.riskReductionPercentage || 0), 0.1),
                              color: getRiskReductionColor(enhancedRecommendation?.calculatedRiskReduction || recommendation.riskReductionPercentage || 0),
                              borderColor: getRiskReductionColor(enhancedRecommendation?.calculatedRiskReduction || recommendation.riskReductionPercentage || 0),
                              borderWidth: 1,
                              borderStyle: 'solid',
                              fontWeight: 'bold',
                              cursor: 'help',
                              '& .MuiChip-icon': {
                                color: getRiskReductionColor(enhancedRecommendation?.calculatedRiskReduction || recommendation.riskReductionPercentage || 0)
                              }
                            }}
                          />
                        </Tooltip>
                      )}
                      
                      {isAlreadySet && (
                        <Chip
                          icon={<CheckIcon fontSize="small" />}
                          label="No change needed"
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                            borderColor: theme.palette.success.main,
                            borderWidth: 1,
                            borderStyle: 'solid',
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Current
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {recommendation.currentOption}
                        </Typography>
                      </Box>
                      <ArrowForwardIcon color="action" fontSize="small" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Recommended
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight="bold">
                          {recommendation.recommendedOption}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 1,
                      height: '100%',
                      justifyContent: 'center'
                    }}>
                      {/* Apply/Unapply Button */}
                      <Button
                        variant={isAlreadySet ? "outlined" : isApplied ? "outlined" : "contained"}
                        color={isAlreadySet ? "success" : isApplied ? "warning" : "primary"}
                        fullWidth
                        disabled={isLocked || isApplying || isUpdatingStrategy || isAlreadySet}
                        onClick={() => {
                          if (isApplied && !isAlreadySet) {
                            onUnapplyRecommendation(recommendation);
                          } else if (!isApplied && !isAlreadySet) {
                            onApplyRecommendation(recommendation);
                          }
                        }}
                        startIcon={
                          isApplying ? <CircularProgress size={16} /> :
                          isAlreadySet ? <CheckIcon /> :
                          isApplied ? <UndoIcon /> : <PlayArrowIcon />
                        }
                        sx={{
                          ...(isAlreadySet && {
                            borderColor: theme.palette.success.main,
                            color: theme.palette.success.main,
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                            '&.Mui-disabled': {
                              borderColor: theme.palette.success.main,
                              color: theme.palette.success.main,
                              bgcolor: alpha(theme.palette.success.main, 0.05),
                            }
                          }),
                          ...(isApplied && !isAlreadySet && {
                            borderColor: theme.palette.warning.main,
                            color: theme.palette.warning.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.warning.main, 0.1),
                              borderColor: theme.palette.warning.dark,
                            }
                          })
                        }}
                      >
                        {isApplying ? (isApplied ? 'Reverting...' : 'Applying...') : 
                         isAlreadySet ? 'Already Set' :
                         isApplied ? 'Revert' : 'Apply Change'}
                      </Button>

                      {/* AI Insights Button */}
                      <Button
                        variant="outlined"
                        color="info"
                        fullWidth
                        onClick={() => onAskChatAboutRecommendation(recommendation, enhancedRecommendation)}
                        startIcon={<SmartToyIcon />}
                        size="small"
                        disabled={isLocked}
                        sx={{
                          ...(isLocked && {
                            opacity: 0.5,
                            cursor: 'not-allowed',
                          })
                        }}
                      >
                        Get AI Insights
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Apply All Button */}
      {(() => {
        const alreadySetCount = round.recommendations.filter(rec => 
          rec.currentOption === rec.recommendedOption
        ).length;
        const remainingCount = round.recommendations.length - appliedCount - alreadySetCount;
        
        return remainingCount > 0 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={() => {
                // Apply all unapplied recommendations that aren't already set
                sortedRecommendations.forEach(rec => {
                  const recId = `${rec.featureGroup}-${rec.recommendedOption}`;
                  const persistentId = `${rec.featureGroup}-${rec.currentOption}-to-${rec.recommendedOption}`;
                  const lockId = `${rec.featureGroup}-${rec.featureName}`;
                  const isAlreadySet = rec.currentOption === rec.recommendedOption;
                  const isApplied = appliedRecommendations.has(recId) || appliedRecommendations.has(persistentId);
                  const isLocked = lockedRecommendations.has(lockId);
                  
                  if (!isApplied && !isLocked && !isAlreadySet) {
                    onApplyRecommendation(rec);
                  }
                });
              }}
              disabled={isUpdatingStrategy}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)',
                boxShadow: '0 3px 5px 2px rgba(79, 70, 229, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4338ca 30%, #4f46e5 90%)',
                }
              }}
            >
              Apply All Recommendations ({remainingCount} remaining)
            </Button>
          </Box>
        );
      })()}

      {/* Continue to Next Round Dialog */}
      <Dialog open={showContinueDialog} onClose={() => setShowContinueDialog(false)}>
        <DialogTitle>Continue to Next Round?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            You have applied {appliedCount} out of {round.recommendations.length} recommendations in this round. 
            Would you like to continue to the next round of risk mitigation?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            You can always return to this round later to apply additional recommendations.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowContinueDialog(false)}>Cancel</Button>
          <Button onClick={confirmContinueToNextRound} variant="contained" color="primary">
            Continue to Next Round
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 