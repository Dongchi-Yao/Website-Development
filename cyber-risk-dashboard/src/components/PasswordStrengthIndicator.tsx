import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { getPasswordStrength } from '../utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const strength = getPasswordStrength(password);
  
  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'strong':
        return '#22c55e';
      default:
        return '#e5e7eb';
    }
  };

  const getStrengthValue = () => {
    switch (strength) {
      case 'weak':
        return 33;
      case 'medium':
        return 66;
      case 'strong':
        return 100;
      default:
        return 0;
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'weak':
        return 'Weak';
      case 'medium':
        return 'Medium';
      case 'strong':
        return 'Strong';
      default:
        return '';
    }
  };

  if (!password) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Password Strength
        </Typography>
        <Typography variant="caption" sx={{ color: getStrengthColor(), fontWeight: 'bold' }}>
          {getStrengthText()}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={getStrengthValue()}
        sx={{
          height: 4,
          borderRadius: 2,
          backgroundColor: '#e5e7eb',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getStrengthColor(),
          },
        }}
      />
    </Box>
  );
};

export default PasswordStrengthIndicator; 