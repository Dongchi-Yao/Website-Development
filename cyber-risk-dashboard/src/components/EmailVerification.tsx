import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface EmailVerificationProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  open,
  onClose,
  email,
  onSuccess,
}) => {
  const { verifyEmail, resendVerification, error, clearError } = useAuth();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setError] = useState('');

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await verifyEmail(email, otp);
      setSuccess(true);
      
      // Auto-login after successful verification
      setTimeout(async () => {
        try {
          // You'll need to pass password from signup or ask user to login
          onSuccess();
          onClose();
        } catch (err) {
          // If auto-login fails, just proceed to login page
          onSuccess();
          onClose();
        }
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      clearError();
      await resendVerification(email);
    } catch (err) {
      console.error('Resend failed:', err);
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    setOtp('');
    clearError();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Verify Your Email</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          We've sent a verification code to <strong>{email}</strong>. Please enter the 6-digit code below.
        </Typography>

        <TextField
          fullWidth
          label="Verification Code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit code"
          inputProps={{ maxLength: 6 }}
          sx={{ mb: 2 }}
        />

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Didn't receive the code?
          </Typography>
          <Button
            onClick={handleResend}
            disabled={isResending}
            startIcon={isResending ? <CircularProgress size={16} /> : null}
          >
            {isResending ? 'Sending...' : 'Resend Code'}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleVerify}
          variant="contained"
          disabled={!otp.trim() || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailVerification;
