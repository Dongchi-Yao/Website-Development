import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isValidEmail } from '../utils/validation';
import ForgotPassword from '../components/ForgotPassword';
import EmailVerification from '../components/EmailVerification';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated, error, clearError, user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
  });
  const [localError, setLocalError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  // Redirect if already authenticated and verified
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if email is verified (skip for admins)
      if (user.isEmailVerified === false && user.role !== 'admin') {
        setShowEmailVerification(true);
      } else {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  // Clear location state after displaying message
  useEffect(() => {
    if (location.state?.message) {
      // Clear the location state to prevent message from showing again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.message, location.pathname, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Only clear local validation errors when user starts typing
    if (localError) {
      setLocalError('');
    }
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setLocalError('Email is required');
      return false;
    }
    if (!isValidEmail(formData.email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }
    if (!formData.password.trim()) {
      setLocalError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear local validation errors
    setLocalError('');
    
    if (!validateForm()) {
      return;
    }
    
    // Clear auth errors only when we're about to make the API call
    clearError();
    
    try {
      await login(formData.email, formData.password);
      setShowSuccess(true);
      // Email verification check will be handled by useEffect when user state changes
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Login failed:', err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph align="center">
            Sign in to access your dashboard
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {successMessage && (
              <Alert 
                severity="success" 
                sx={{ mb: 2 }}
                onClose={() => setSuccessMessage('')}
              >
                {successMessage}
              </Alert>
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!(localError && localError.includes('email'))}
              helperText={localError && localError.includes('email') ? localError : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading || !formData.email || !formData.password}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/signup')}
                sx={{ mr: 2 }}
              >
                Don't have an account? Sign Up
              </Link>
              <br />
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  clearError();
                  setLocalError('');
                  setShowForgotPassword(true);
                }}
                sx={{ mt: 1 }}
              >
                Forgot Password?
              </Link>
            </Box>
          </Box>
        </Paper>

        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          message="Login successful! Redirecting..."
        />

        <ForgotPassword
          open={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />

        <EmailVerification
          open={showEmailVerification}
          onClose={() => setShowEmailVerification(false)}
          email={formData.email}
          onSuccess={() => {
            setShowEmailVerification(false);
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
          }}
        />
      </motion.div>
    </Container>
  );
};

export default Login; 