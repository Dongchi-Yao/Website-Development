import React from 'react';
import { Box, Alert, Tabs, Tab } from '@mui/material';
import type { 
  RiskMitigationStrategy, 
  RiskMitigationRecommendation,
} from '../../services/riskMitigationService';
import { StrategyOverview } from './StrategyOverview';
import { RoundDetails } from './RoundDetails';

interface RiskMitigationSectionProps {
  strategy: RiskMitigationStrategy;
  selectedRound: number;
  onRoundChange: (round: number) => void;
  appliedRecommendations: Set<string>;
  applyingRecommendation: string | null;
  onApplyRecommendation: (recommendation: RiskMitigationRecommendation) => void;
  onToggleRecommendation: (recommendation: RiskMitigationRecommendation) => void;
  lockedRecommendations: Set<string>;
  onToggleLock: (recommendationId: string) => void;
  onAskChatbot: (recommendation: RiskMitigationRecommendation, enhanced?: RiskMitigationRecommendation | null) => void;
  isUpdatingStrategy: boolean;
  enhancedDescriptions: Map<string, RiskMitigationRecommendation>;
  loadingRecommendations: Set<string>;
}

export const RiskMitigationSection: React.FC<RiskMitigationSectionProps> = ({
  strategy,
  selectedRound,
  onRoundChange,
  appliedRecommendations,
  applyingRecommendation,
  onApplyRecommendation,
  onToggleRecommendation,
  lockedRecommendations,
  onToggleLock,
  onAskChatbot,
  isUpdatingStrategy,
  enhancedDescriptions,
  loadingRecommendations,
}) => {

  const currentRound = strategy.rounds.find(r => r.roundNumber === selectedRound);
  const hasNextRound = selectedRound > 0 && selectedRound < strategy.rounds.length;

  const handleContinueToNextRound = () => {
    if (strategy && selectedRound > 0 && selectedRound < strategy.rounds.length) {
      onRoundChange(selectedRound + 1);
    }
  };

  // Create tabs for rounds
  const roundTabs = [
    { label: 'Overview', value: 0 },
    ...strategy.rounds.map(round => ({
      label: `Round ${round.roundNumber}`,
      value: round.roundNumber
    }))
  ];

  return (
    <Box>
      {/* Tabs for switching between overview and rounds */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={selectedRound} 
          onChange={(e, newValue) => onRoundChange(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {roundTabs.map(tab => (
            <Tab 
              key={tab.value} 
              label={tab.label} 
              value={tab.value}
              sx={{ textTransform: 'none' }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Content based on selected tab */}
      {selectedRound === 0 ? (
        <StrategyOverview
          strategy={strategy}
          selectedRound={selectedRound}
          isUpdatingStrategy={isUpdatingStrategy}
          onRoundSelect={onRoundChange}
        />
      ) : currentRound ? (
        <RoundDetails
          round={currentRound}
          isUpdatingStrategy={isUpdatingStrategy}
          appliedRecommendations={appliedRecommendations}
          lockedRecommendations={lockedRecommendations}
          enhancedDescriptions={enhancedDescriptions}
          onApplyRecommendation={onApplyRecommendation}
          onUnapplyRecommendation={onToggleRecommendation}
          onToggleRecommendationLock={onToggleLock}
          onAskChatAboutRecommendation={onAskChatbot}
          onContinueToNextRound={handleContinueToNextRound}
          applyingRecommendation={applyingRecommendation}
          hasNextRound={hasNextRound}
        />
      ) : (
        <Alert severity="warning">
          Round {selectedRound} not found.
        </Alert>
      )}
    </Box>
  );
}; 