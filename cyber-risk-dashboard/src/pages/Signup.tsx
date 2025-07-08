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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isValidEmail, validatePassword } from '../utils/validation';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import EmailVerification from '../components/EmailVerification';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BusinessIcon from '@mui/icons-material/Business';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Signup = () => {
  const navigate = useNavigate();
  const { register, isLoading, isAuthenticated, error: authError, clearError } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    organizationAction: 'create' | 'join';
    organizationName: string;
    organizationCode: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationAction: 'create',
    organizationName: '',
    organizationCode: '',
  });
  const [localError, setLocalError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [organizationCodeCopied, setOrganizationCodeCopied] = useState(false);
  const [createdOrgCode, setCreatedOrgCode] = useState('');

  const steps = ['Personal Information', 'Organization Setup', 'Verification'];

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear local validation errors when user starts typing
    if (localError) {
      setLocalError('');
    }
  };

  const handleOrganizationActionChange = (
    event: React.MouseEvent<HTMLElement>,
    newAction: string | null,
  ) => {
    if (newAction !== null && (newAction === 'create' || newAction === 'join')) {
      setFormData(prev => ({
        ...prev,
        organizationAction: newAction as 'create' | 'join',
        organizationName: '',
        organizationCode: '',
      }));
      setLocalError('');
    }
  };

  const validatePersonalInfo = () => {
    // Validate email
    if (!isValidEmail(formData.email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setLocalError(passwordValidation.errors.join(', '));
      return false;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }

    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setLocalError('First name and last name are required');
      return false;
    }

    return true;
  };

  const validateOrganizationInfo = () => {
    if (formData.organizationAction === 'create') {
      if (!formData.organizationName.trim()) {
        setLocalError('Organization name is required');
        return false;
      }
    } else {
      if (!formData.organizationCode.trim()) {
        setLocalError('Organization code is required');
        return false;
      }
      if (formData.organizationCode.length !== 6) {
        setLocalError('Organization code must be 6 characters');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    setLocalError('');
    
    if (activeStep === 0) {
      if (!validatePersonalInfo()) {
        return;
      }
    } else if (activeStep === 1) {
      if (!validateOrganizationInfo()) {
        return;
      }
    }
    
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear local validation errors
    setLocalError('');
    
    if (!validatePersonalInfo() || !validateOrganizationInfo()) {
      return;
    }

    // Clear auth errors only when we're about to make the API call
    clearError();

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const result = await register(
        fullName, 
        formData.email, 
        formData.password,
        formData.organizationAction,
        formData.organizationAction === 'create' ? formData.organizationName : undefined,
        formData.organizationAction === 'join' ? formData.organizationCode : undefined
      );
      
      // Store organization code if created
      if (formData.organizationAction === 'create' && result.organization?.code) {
        setCreatedOrgCode(result.organization.code);
      }
      
      setRegisteredEmail(formData.email);
      setShowEmailVerification(true);
      setShowSuccess(true);
      setActiveStep(2);
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Registration failed:', err);
    }
  };

  const handleEmailVerificationSuccess = () => {
    setShowEmailVerification(false);
    // Redirect to login page after successful verification
    navigate('/login', { 
      state: { 
        message: 'Email verified successfully! Please log in.',
        email: formData.email 
      } 
    });
  };

  const handleCopyOrgCode = () => {
    if (createdOrgCode) {
      navigator.clipboard.writeText(createdOrgCode);
      setOrganizationCodeCopied(true);
      setTimeout(() => setOrganizationCodeCopied(false), 2000);
    }
  };

  const getPasswordRequirements = () => {
    const requirements = [
      { text: 'At least 8 characters long', met: formData.password.length >= 8 },
      { text: 'Contains at least one digit', met: /\d/.test(formData.password) },
      { text: 'Contains at least one uppercase letter', met: /[A-Z]/.test(formData.password) },
      { text: 'Contains at least one symbol', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) },
    ];
    return requirements;
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
            Create Account
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {activeStep === 0 && (
              <>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Box>
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!(localError && !isValidEmail(formData.email))}
                  helperText={localError && !isValidEmail(formData.email) ? 'Please enter a valid email address' : ''}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <PasswordStrengthIndicator password={formData.password} />
                
                {formData.password && (
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Password Requirements:
                    </Typography>
                    <List dense sx={{ py: 0 }}>
                      {getPasswordRequirements().map((req, index) => (
                        <ListItem key={index} sx={{ py: 0, minHeight: 'auto' }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            {req.met ? (
                              <CheckCircleIcon color="success" fontSize="small" />
                            ) : (
                              <CancelIcon color="error" fontSize="small" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={req.text}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontSize: '0.75rem',
                                color: req.met ? 'success.main' : 'error.main',
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!(formData.confirmPassword && formData.password !== formData.confirmPassword)}
                  helperText={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
                />
              </>
            )}

            {activeStep === 1 && (
              <>
                <Typography variant="h6" gutterBottom align="center">
                  Organization Setup
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph align="center">
                  Create a new organization or join an existing one
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <ToggleButtonGroup
                    value={formData.organizationAction}
                    exclusive
                    onChange={handleOrganizationActionChange}
                    aria-label="organization action"
                  >
                    <ToggleButton value="create" aria-label="create organization">
                      <BusinessIcon sx={{ mr: 1 }} />
                      Create Organization
                    </ToggleButton>
                    <ToggleButton value="join" aria-label="join organization">
                      <GroupAddIcon sx={{ mr: 1 }} />
                      Join Organization
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {formData.organizationAction === 'create' ? (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="organizationName"
                    label="Organization Name"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    helperText="Choose a name for your organization"
                  />
                ) : (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="organizationCode"
                    label="Organization Code"
                    name="organizationCode"
                    value={formData.organizationCode}
                    onChange={handleChange}
                    inputProps={{ maxLength: 6, style: { textTransform: 'uppercase' } }}
                    helperText="Enter the 6-character code provided by your organization manager"
                  />
                )}
              </>
            )}

            {activeStep === 2 && (
              <>
                <Typography variant="h6" gutterBottom align="center">
                  Verify Your Email
                </Typography>
                {createdOrgCode && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <Typography variant="body2" gutterBottom>
                      Organization created successfully!
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Organization Code: <strong>{createdOrgCode}</strong>
                      </Typography>
                      <IconButton size="small" onClick={handleCopyOrgCode}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    {organizationCodeCopied && (
                      <Typography variant="caption" color="success.main">
                        Copied to clipboard!
                      </Typography>
                    )}
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Share this code with team members to invite them to your organization.
                    </Typography>
                  </Alert>
                )}
                <Typography variant="body2" color="text.secondary" paragraph align="center">
                  We've sent a verification code to your email address. Please check your inbox.
                </Typography>
              </>
            )}
            
            {(authError || localError) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {authError || localError}
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              {activeStep > 0 && activeStep < 2 && (
                <Button onClick={handleBack}>
                  Back
                </Button>
              )}
              <Box sx={{ flex: 1 }} />
              {activeStep < 1 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!formData.email || !formData.password || !formData.firstName || !formData.lastName}
                >
                  Next
                </Button>
              )}
              {activeStep === 1 && (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              )}
            </Box>

            {activeStep === 0 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                >
                  Already have an account? Sign In
                </Link>
              </Box>
            )}
          </Box>
        </Paper>

        <Snackbar
          open={showSuccess && activeStep < 2}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          message="Account created successfully! Please verify your email."
        />

        <EmailVerification
          open={showEmailVerification}
          onClose={() => setShowEmailVerification(false)}
          email={registeredEmail}
          onSuccess={handleEmailVerificationSuccess}
        />
      </motion.div>
    </Container>
  );
};

export default Signup; 