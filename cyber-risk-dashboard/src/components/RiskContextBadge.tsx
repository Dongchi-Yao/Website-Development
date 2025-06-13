import { Box, Typography } from '@mui/material';

interface RiskContextBadgeProps {
  riskType: string;
  score: number;
}

const RiskContextBadge = ({ riskType, score }: RiskContextBadgeProps) => {
  // Get risk level and color based on score
  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'LOW', color: '#4caf50' };      // Green
    if (score < 60) return { level: 'MEDIUM', color: '#ff9800' };    // Orange
    if (score < 85) return { level: 'HIGH', color: '#f44336' };      // Red
    return { level: 'CRITICAL', color: '#d32f2f' };                  // Dark Red
  };

  const { level, color } = getRiskLevel(score);

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 12px',
        borderRadius: '9999px',
        backgroundColor: color,
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: 600,
        lineHeight: 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          filter: 'brightness(1.1)',
          transform: 'translateY(-1px)',
        },
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: 'inherit',
          fontWeight: 'inherit',
          textTransform: 'none',
        }}
      >
        {riskType}: {score}%
      </Typography>
    </Box>
  );
};

export default RiskContextBadge; 