import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Collapse,
  Alert,
  LinearProgress,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ChatBubbleOutline as ChatIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as CostIcon,
  PriorityHigh as PriorityIcon,
} from '@mui/icons-material';
import type { RiskMitigationRecommendation } from '../../services/riskMitigationService';
import { riskMitigationService } from '../../services/riskMitigationService';

interface RecommendationCardProps {
  recommendation: RiskMitigationRecommendation;
  index: number;
  isApplied: boolean;
  isLocked: boolean;
  onApply: (recommendation: RiskMitigationRecommendation) => void;
  onUnapply: (recommendation: RiskMitigationRecommendation) => void;
  onToggleLock: (recommendationId: string) => void;
  onAskChat: (recommendation: RiskMitigationRecommendation) => void;
  isApplying: boolean;
  enhancedRecommendation?: RiskMitigationRecommendation | null;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  index,
  isApplied,
  isLocked,
  onApply,
  onUnapply,
  onToggleLock,
  onAskChat,
  isApplying,
  enhancedRecommendation,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [riskReduction, setRiskReduction] = useState<number | null>(null);
  const [riskReductionPercentage, setRiskReductionPercentage] = useState<number | null>(null);
  const [loadingRiskReduction, setLoadingRiskReduction] = useState(false);

  useEffect(() => {
    // Load risk reduction data if not already available
    if (!recommendation.riskReduction && !loadingRiskReduction) {
      loadRiskReduction();
    } else if (recommendation.riskReduction) {
      setRiskReduction(recommendation.riskReduction);
      setRiskReductionPercentage(recommendation.riskReductionPercentage || 0);
    }
  }, [recommendation]);

  const loadRiskReduction = async () => {
    setLoadingRiskReduction(true);
    try {
      const response = await riskMitigationService.calculateRecommendationRiskReduction({
        featureGroup: recommendation.featureGroup,
        featureName: recommendation.featureName,
        currentOption: recommendation.currentOption,
        recommendedOption: recommendation.recommendedOption,
      });
      
      setRiskReduction(response.riskReduction);
      setRiskReductionPercentage(response.riskReductionPercentage);
    } catch (error) {
      console.error('Failed to load risk reduction:', error);
    } finally {
      setLoadingRiskReduction(false);
    }
  };

  const getCostDisplay = (costLevel?: number) => {
    if (!costLevel) return 'N/A';
    return '$'.repeat(costLevel);
  };

  const getCostColor = (costLevel?: number) => {
    if (!costLevel) return 'default';
    if (costLevel <= 1) return 'success';
    if (costLevel <= 2) return 'warning';
    return 'error';
  };

  const getImportanceColor = (importance?: string) => {
    if (!importance) return 'default';
    if (importance.toLowerCase().includes('high')) return 'error';
    if (importance.toLowerCase().includes('medium')) return 'warning';
    return 'success';
  };

  const handleApply = () => {
    if (isApplied) {
      onUnapply(recommendation);
    } else {
      onApply(recommendation);
    }
  };

  const handleToggleLock = () => {
    const recommendationId = `${recommendation.featureGroup}-${recommendation.featureName}-${recommendation.description}`;
    onToggleLock(recommendationId);
  };

  const handleAskChat = () => {
    onAskChat(recommendation);
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        border: isApplied ? '2px solid #4caf50' : '1px solid #e0e0e0',
        bgcolor: isApplied ? '#f8fff8' : 'background.paper',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {recommendation.featureName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {recommendation.description}
            </Typography>
            
            {/* Current vs Recommended */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Chip 
                label={`Current: ${recommendation.currentOption}`}
                variant="outlined"
                size="small"
                color="default"
              />
              <Typography variant="body2" color="text.secondary">
                →
              </Typography>
              <Chip 
                label={`Recommended: ${recommendation.recommendedOption}`}
                variant="filled"
                size="small"
                color="primary"
              />
            </Box>

            {/* Cost and Importance */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Tooltip title="Implementation Cost">
                <Chip
                  icon={<CostIcon />}
                  label={getCostDisplay(enhancedRecommendation?.costLevel)}
                  color={getCostColor(enhancedRecommendation?.costLevel) as any}
                  size="small"
                  variant="outlined"
                />
              </Tooltip>
              {enhancedRecommendation?.importance && (
                <Tooltip title="Implementation Priority">
                  <Chip
                    icon={<PriorityIcon />}
                    label={enhancedRecommendation.importance}
                    color={getImportanceColor(enhancedRecommendation.importance) as any}
                    size="small"
                    variant="outlined"
                  />
                </Tooltip>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={isLocked ? "Unlock recommendation" : "Lock recommendation"}>
                <IconButton size="small" onClick={handleToggleLock}>
                  {isLocked ? <LockIcon color="primary" /> : <LockOpenIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Ask AI about this recommendation">
                <IconButton size="small" onClick={handleAskChat}>
                  <ChatIcon />
                </IconButton>
              </Tooltip>
              <IconButton 
                size="small" 
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Button
              variant={isApplied ? "outlined" : "contained"}
              color={isApplied ? "success" : "primary"}
              size="small"
              onClick={handleApply}
              disabled={isApplying}
              sx={{ minWidth: 100 }}
            >
              {isApplying ? 'Applying...' : isApplied ? 'Applied' : 'Apply'}
            </Button>

            {/* Risk Reduction Ring */}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {(() => {
                const percent = enhancedRecommendation?.riskReductionPercentage ?? recommendation.riskReductionPercentage ?? 0;
                let color = '#4caf50'; // green
                if (percent < 10) color = '#f44336'; // red
                else if (percent < 20) color = '#ff9800'; // orange
                return (
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 0.5 }}>
                    <svg width={54} height={54}>
                      <circle
                        cx={27}
                        cy={27}
                        r={24}
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth={6}
                      />
                      <circle
                        cx={27}
                        cy={27}
                        r={24}
                        fill="none"
                        stroke={color}
                        strokeWidth={6}
                        strokeDasharray={2 * Math.PI * 24}
                        strokeDashoffset={2 * Math.PI * 24 * (1 - percent / 100)}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
                      />
                    </svg>
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color }}>
                        {percent.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                );
              })()}
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Risk Reduction
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Enhanced Description */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            {enhancedRecommendation?.enhancedDescription ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Enhanced Analysis:</strong> {enhancedRecommendation.enhancedDescription}
                </Typography>
              </Alert>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Click "Ask AI" to get detailed analysis of this recommendation.
              </Typography>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}; 