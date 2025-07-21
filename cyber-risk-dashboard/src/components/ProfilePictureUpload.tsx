import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Typography,
  Paper,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfilePictureUploadProps {
  size?: number;
  showEditButton?: boolean;
  externalOpen?: boolean;
  onExternalClose?: () => void;
  showAvatar?: boolean;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  size = 120,
  showEditButton = true,
  externalOpen = false,
  onExternalClose,
  showAvatar = true,
}) => {
  const { user, uploadProfilePicture, deleteProfilePicture } = useAuth();
  const [open, setOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';

  // Handle external open state
  useEffect(() => {
    if (externalOpen) {
      setOpen(true);
    }
  }, [externalOpen]);

  const handleFileSelect = (file: File) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, GIF, etc.)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      await uploadProfilePicture(selectedFile);
      
      // Show success animation
      setUploadSuccess(true);
      
      // Close dialog after animation
      setTimeout(() => {
        setOpen(false);
        setPreview(null);
        setSelectedFile(null);
        setUploadSuccess(false);
        if (onExternalClose) {
          onExternalClose();
        }
      }, 1500);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setUploading(true);
    setError(null);

    try {
      await deleteProfilePicture();
      setOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    setUploadSuccess(false);
    if (onExternalClose) {
      onExternalClose();
    }
  };

  // Use external open state if provided
  const isDialogOpen = externalOpen || open;

  const getProfilePictureUrl = () => {
    if (user?.profilePicture) {
      return `${API_BASE_URL}${user.profilePicture}`;
    }
    return undefined;
  };

  return (
    <>
      {showAvatar && (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            key={user?.profilePicture || 'no-profile-pic'}
            src={getProfilePictureUrl()}
            sx={{
              width: size,
              height: size,
              fontSize: size * 0.4,
              bgcolor: 'primary.main',
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          
          {showEditButton && (
            <Tooltip title="Change profile picture">
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: size * 0.25,
                  height: size * 0.25,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
                onClick={() => setOpen(true)}
              >
                <EditIcon sx={{ fontSize: size * 0.15 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Profile Picture
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <AnimatePresence mode="wait">
            {uploadSuccess ? (
              // Success Animation
              <motion.div
                key="success"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ textAlign: 'center', padding: '2rem' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                >
                  <CheckCircleIcon 
                    sx={{ 
                      fontSize: 80, 
                      color: 'success.main',
                      mb: 2,
                      filter: 'drop-shadow(0 4px 12px rgba(76, 175, 80, 0.3))'
                    }} 
                  />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Typography variant="h5" color="success.main" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Upload Successful!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Your profile picture has been updated
                  </Typography>
                </motion.div>
                
                {/* Confetti-like particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      scale: 0, 
                      x: 0, 
                      y: 0,
                      opacity: 1
                    }}
                    animate={{ 
                      scale: [0, 1, 0], 
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200,
                      opacity: [1, 1, 0]
                    }}
                    transition={{ 
                      duration: 1.2, 
                      delay: 0.3 + i * 0.1,
                      ease: "easeOut"
                    }}
                    style={{
                      position: 'absolute',
                      width: '8px',
                      height: '8px',
                      backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#E91E63'][i % 4],
                      borderRadius: '50%',
                      top: '50%',
                      left: '50%',
                      pointerEvents: 'none'
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              // Regular Upload Interface
              <motion.div
                key="upload"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Current Profile Picture */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Current Picture
                    </Typography>
                    <Avatar
                      key={user?.profilePicture || 'no-profile-pic-dialog'}
                      src={getProfilePictureUrl()}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        fontSize: 48,
                        bgcolor: 'primary.main',
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </Box>

                  {/* Upload Area */}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Upload New Picture
                    </Typography>
                    
                    <Paper
                      sx={{
                        border: `2px dashed ${dragOver ? 'primary.main' : 'grey.300'}`,
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        bgcolor: dragOver ? 'primary.light' : 'grey.50',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.light',
                        },
                      }}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      
                      <CloudUploadIcon 
                        sx={{ 
                          fontSize: 48, 
                          color: 'primary.main',
                          mb: 1 
                        }} 
                      />
                      <Typography variant="body1" gutterBottom>
                        Drop an image here or click to browse
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Supports JPG, PNG, GIF (max 5MB)
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Preview */}
                  <AnimatePresence>
                    {preview && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Preview
                          </Typography>
                          <Avatar
                            src={preview}
                            sx={{
                              width: 120,
                              height: 120,
                              mx: 'auto',
                              border: '2px solid',
                              borderColor: 'primary.main',
                            }}
                          />
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          {user?.profilePicture && (
            <Button
              onClick={handleDelete}
              disabled={uploading}
              color="error"
              variant="outlined"
              startIcon={uploading ? <CircularProgress size={16} /> : <DeleteIcon />}
            >
              Delete Current
            </Button>
          )}
          
          <Box sx={{ flex: 1 }} />
          
          <Button onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            variant="contained"
            startIcon={uploading ? <CircularProgress size={16} /> : <PhotoCameraIcon />}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfilePictureUpload; 