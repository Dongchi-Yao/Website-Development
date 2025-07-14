import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Avatar,
  Grid,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Lock as LockIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { validatePassword } from '../utils/validation';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

const AccountSettings: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, changePassword, deleteAccount, error, clearError } = useAuth();
  
  // Change password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Delete account state
  const [deleteForm, setDeleteForm] = useState({
    password: '',
    confirmationText: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (passwordError) setPasswordError('');
    if (passwordSuccess) setPasswordSuccess(false);
    if (error) clearError();
  };

  const handleDeleteFormChange = (field: string, value: string) => {
    setDeleteForm(prev => ({ ...prev, [field]: value }));
    if (deleteError) setDeleteError('');
    if (error) clearError();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);
    
    // Validate form
    if (!passwordForm.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    if (!passwordForm.newPassword) {
      setPasswordError('New password is required');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Validate password strength
    const validation = validatePassword(passwordForm.newPassword);
    if (!validation.isValid) {
      setPasswordError(validation.errors[0]);
      return;
    }
    
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }
    
    try {
      setPasswordLoading(true);
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      // Error handled by context
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setDeleteError('');
    
    if (!deleteForm.password) {
      setDeleteError('Password is required');
      return;
    }
    
    if (deleteForm.confirmationText !== 'DELETE') {
      setDeleteError('Please type "DELETE" to confirm');
      return;
    }
    
    try {
      setDeleteLoading(true);
      await deleteAccount(deleteForm.password, deleteForm.confirmationText);
      // User will be automatically logged out and redirected
      navigate('/');
    } catch (err) {
      // Error handled by context
    } finally {
      setDeleteLoading(false);
    }
  };

  const passwordValidation = validatePassword(passwordForm.newPassword);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Account Settings
        </Typography>

        <Grid container spacing={3}>
          {/* Account Information */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <PersonIcon />
                  </Avatar>
                }
                title="Account Information"
                subheader="Your personal account details"
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">{user?.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{user?.email}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      Role
                    </Typography>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {user?.role}
                    </Typography>
                  </Grid>
                  {user?.organization && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Organization
                      </Typography>
                      <Typography variant="body1">{user.organization.name}</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Change Password Section */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                    <LockIcon />
                  </Avatar>
                }
                title="Change Password"
                subheader="Update your account password"
              />
              <CardContent>
                <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        type="password"
                        label="Current Password"
                        fullWidth
                        value={passwordForm.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type="password"
                        label="New Password"
                        fullWidth
                        value={passwordForm.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        required
                      />
                      {passwordForm.newPassword && (
                        <Box sx={{ mt: 1 }}>
                          <PasswordStrengthIndicator password={passwordForm.newPassword} />
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type="password"
                        label="Confirm New Password"
                        fullWidth
                        value={passwordForm.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        required
                      />
                    </Grid>
                  </Grid>

                  {(passwordError || error) && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {passwordError || error}
                    </Alert>
                  )}

                  {passwordSuccess && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      Password changed successfully!
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3 }}
                    disabled={passwordLoading || !passwordValidation.isValid}
                    startIcon={passwordLoading ? <CircularProgress size={20} /> : <LockIcon />}
                  >
                    {passwordLoading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Delete Account Section */}
          <Grid item xs={12}>
            <Card sx={{ borderColor: theme.palette.error.main, borderWidth: 1 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                    <DeleteIcon />
                  </Avatar>
                }
                title="Delete Account"
                subheader="Permanently delete your account and all associated data"
              />
              <CardContent>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Warning:</strong> This action cannot be undone. Deleting your account will:
                  </Typography>
                  <ul>
                    <li>Remove all your projects and data</li>
                    <li>Remove you from your organization</li>
                    <li>Delete your profile picture</li>
                    <li>Make your account permanently inaccessible</li>
                  </ul>
                </Alert>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Delete Account Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: theme.palette.error.main }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon />
              Delete Account
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Are you sure you want to delete your account? This action cannot be undone.
            </Typography>

            <TextField
              type="password"
              label="Enter your password"
              fullWidth
              value={deleteForm.password}
              onChange={(e) => handleDeleteFormChange('password', e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              label="Type 'DELETE' to confirm"
              fullWidth
              value={deleteForm.confirmationText}
              onChange={(e) => handleDeleteFormChange('confirmationText', e.target.value)}
              placeholder="DELETE"
              required
            />

            {(deleteError || error) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {deleteError || error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSubmit}
              color="error"
              variant="contained"
              disabled={deleteLoading || !deleteForm.password || deleteForm.confirmationText !== 'DELETE'}
              startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default AccountSettings; 