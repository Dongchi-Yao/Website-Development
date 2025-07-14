import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import EmailVerification from './EmailVerification';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Verifying authentication...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check email verification status (skip for admins)
  if (user && user.isEmailVerified === false && user.role !== 'admin') {
    if (!showEmailVerification) {
      setShowEmailVerification(true);
    }
    
    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            gap: 2,
            textAlign: 'center',
            p: 3,
          }}
        >
          <Typography variant="h5" color="warning.main">
            Email Verification Required
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please verify your email address to access the application.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check your inbox for a verification code or request a new one.
          </Typography>
        </Box>
        
        <EmailVerification
          open={showEmailVerification}
          onClose={() => setShowEmailVerification(false)}
          email={user.email}
          onSuccess={() => {
            setShowEmailVerification(false);
            // The user context will be updated automatically by the verifyEmail function
            // and the component will re-render to show the protected content
          }}
        />
      </Box>
    );
  }

  // Check admin requirement
  if (requireAdmin && user?.role !== 'admin') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
          textAlign: 'center',
          p: 3,
        }}
      >
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You don't have permission to access this page.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Admin privileges required.
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 