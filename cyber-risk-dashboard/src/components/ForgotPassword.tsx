import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { isValidEmail, validatePassword } from '../utils/validation';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPassword = ({ open, onClose }: ForgotPasswordProps) => {
  const { forgotPassword, resetPassword, error, clearError, isLoading } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const steps = ['Enter Email', 'Verify OTP', 'Reset Password'];

  // Clear any existing auth errors when dialog opens
  useEffect(() => {
    if (open) {
      clearError();
      setLocalError('');
    }
  }, [open, clearError]);

  const handleClose = () => {
    setActiveStep(0);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setLocalError('');
    setSuccess(false);
    clearError();
    onClose();
  };

  const handleEmailSubmit = async () => {
    setLocalError('');
    
    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }
    
    if (!isValidEmail(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    clearError();
    
    try {
      await forgotPassword(email);
      setActiveStep(1);
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Forgot password failed:', err);
    }
  };

  const handleOtpSubmit = async () => {
    setLocalError('');
    
    if (!otp.trim()) {
      setLocalError('OTP is required');
      return;
    }
    
    if (otp.length !== 6) {
      setLocalError('OTP must be 6 digits');
      return;
    }

    setActiveStep(2);
  };

  const handlePasswordReset = async () => {
    setLocalError('');
    
    if (!newPassword.trim()) {
      setLocalError('New password is required');
      return;
    }
    
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setLocalError(passwordValidation.errors.join(', '));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    clearError();
    
    try {
      await resetPassword(email, otp, newPassword);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Password reset failed:', err);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter your email address and we'll send you a verification code.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label="Email Address"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!(localError && localError.includes('email'))}
              helperText={localError && localError.includes('email') ? localError : ''}
              onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We've sent a 6-digit verification code to {email}. Enter it below.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label="Verification Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              error={!!(localError && localError.includes('OTP'))}
              helperText={localError && localError.includes('OTP') ? localError : ''}
              onKeyPress={(e) => e.key === 'Enter' && handleOtpSubmit()}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Choose a new strong password for your account.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <PasswordStrengthIndicator password={newPassword} />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!(confirmPassword && newPassword !== confirmPassword)}
              helperText={confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match' : ''}
              sx={{ mt: 2 }}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordReset()}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  const getActionButton = () => {
    if (success) {
      return null;
    }

    switch (activeStep) {
      case 0:
        return (
          <Button
            onClick={handleEmailSubmit}
            variant="contained"
            disabled={isLoading || !email}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Sending...' : 'Send Code'}
          </Button>
        );
      case 1:
        return (
          <Button
            onClick={handleOtpSubmit}
            variant="contained"
            disabled={!otp || otp.length !== 6}
          >
            Verify Code
          </Button>
        );
      case 2:
        return (
          <Button
            onClick={handlePasswordReset}
            variant="contained"
            disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {success ? 'Password Reset Successful' : 'Reset Password'}
      </DialogTitle>
      <DialogContent>
        {success ? (
          <Alert severity="success" sx={{ mt: 1 }}>
            Your password has been reset successfully! You can now sign in with your new password.
          </Alert>
        ) : (
          <>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {getStepContent(activeStep)}
            
            {(error || localError) && (
              <Alert 
                severity="error" 
                sx={{ mt: 2 }}
                onClose={() => {
                  if (error) clearError();
                  if (localError) setLocalError('');
                }}
              >
                {error || localError}
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {success ? 'Close' : 'Cancel'}
        </Button>
        {getActionButton()}
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPassword; 