import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Organization {
  _id: string;
  name: string;
  code: string;
  manager: string;
  members: string[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  organization?: Organization;
  profilePicture?: string;
  isEmailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string,
    organizationAction: 'create' | 'join',
    organizationName?: string,
    organizationCode?: string
  ) => Promise<{ user: User; token: string; organization?: Organization }>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string, confirmationText: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  error: string | null;
  isAdmin: () => boolean;
  isManager: () => boolean;
  uploadProfilePicture: (file: File) => Promise<void>;
  deleteProfilePicture: () => Promise<void>;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [error, setError] = React.useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  // Check if user is authenticated on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const user = await response.json();
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user, token }
            });
          } else {
            localStorage.removeItem('token');
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'AUTH_LOGOUT' });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear error on successful login
        setError(null);
        localStorage.setItem('token', data.token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: {
              _id: data._id,
              name: data.name,
              email: data.email,
              role: data.role,
              organization: data.organization,
              profilePicture: data.profilePicture,
              isEmailVerified: data.isEmailVerified,
            },
            token: data.token,
          },
        });
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      setError(errorMessage);
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string,
    organizationAction: 'create' | 'join',
    organizationName?: string,
    organizationCode?: string
  ) => {
    try {
      dispatch({ type: 'AUTH_START' });
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          organizationAction,
          organizationName,
          organizationCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Don't store token or log in the user automatically
        // Just return the data for the component to handle
        dispatch({ type: 'AUTH_LOGOUT' }); // Reset loading state without logging in
        return data; // Return the full response including organization
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      setError(errorMessage);
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update user's email verification status
        if (state.user && state.user.email === email) {
          dispatch({
            type: 'UPDATE_USER',
            payload: { ...state.user, isEmailVerified: true }
          });
        }
      } else {
        throw new Error(data.message || 'Email verification failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during email verification';
      setError(errorMessage);
      throw error;
    }
  };

  const resendVerification = async (email: string) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while resending verification';
      setError(errorMessage);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send password reset email');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while sending password reset email';
      setError(errorMessage);
      throw error;
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while resetting password';
      setError(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'AUTH_LOGOUT' });
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const isAdmin = () => {
    return state.user?.role === 'admin';
  };

  const isManager = () => {
    return state.user?.role === 'manager' || state.user?.role === 'admin';
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch(`${API_BASE_URL}/auth/upload-profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: data.user,
            token: state.token!,
          },
        });
      } else {
        throw new Error(data.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      throw error;
    }
  };

  const deleteProfilePicture = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/delete-profile-picture`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${state.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: data.user,
            token: state.token!,
          },
        });
      } else {
        throw new Error(data.message || 'Failed to delete profile picture');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while changing password';
      setError(errorMessage);
      throw error;
    }
  };

  const deleteAccount = async (password: string, confirmationText: string) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify({ password, confirmationText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      // Clear localStorage and logout user
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while deleting account';
      setError(errorMessage);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    deleteAccount,
    logout,
    clearError,
    error,
    isAdmin,
    isManager,
    uploadProfilePicture,
    deleteProfilePicture,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};