import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the backend directory
dotenv.config();

// Temporary hardcoded environment variables for testing
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://admin:2TF9E1VHSZowbXCe@cluster0.fmd7bmj.mongodb.net/cyber-risk-dashboard?retryWrites=true&w=majority&appName=Cluster0';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'f287206e307ea2ff6502b258681f61cb3a980c6d29f73b5ff25af03601479be6';
}

// Debug environment variables (remove in production)
console.log('Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (profile pictures)
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
import { 
  register, 
  login, 
  getProfile, 
  promoteToAdmin, 
  initializeAdmin, 
  uploadProfilePicture, 
  deleteProfilePicture,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteAccount
} from './controllers/authController.js';
import { 
  calculateRisk, 
  healthCheck, 
  generateMitigationStrategy, 
  calculateRecommendationRiskReduction,
  streamRiskProbabilities
} from './controllers/riskController.js';
import { saveProject, getUserProjects, getProject, updateProject, deleteProject } from './controllers/projectController.js';
import { 
  getOrganization, 
  getOrganizationProjects, 
  updateOrganization, 
  removeMember, 
  getOrganizationStats 
} from './controllers/organizationController.js';
import { protect, admin, manager } from './middleware/authMiddleware.js';
import { uploadProfilePicture as uploadPictureMiddleware } from './middleware/uploadMiddleware.js';

// Auth routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/verify-email', verifyEmail);
app.post('/api/auth/resend-verification', resendVerification);
app.post('/api/auth/forgot-password', forgotPassword);
app.post('/api/auth/reset-password', resetPassword);
app.get('/api/auth/profile', protect, getProfile);
app.put('/api/auth/change-password', protect, changePassword);
app.delete('/api/auth/delete-account', protect, deleteAccount);

// Profile picture routes
app.post('/api/auth/upload-profile-picture', protect, (req, res, next) => {
  uploadPictureMiddleware(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, uploadProfilePicture);
app.delete('/api/auth/delete-profile-picture', protect, deleteProfilePicture);

// Admin routes
app.post('/api/auth/promote-admin', protect, admin, promoteToAdmin);
app.get('/api/auth/init-admin', initializeAdmin);

// Risk quantification routes
app.post('/api/risk/calculate', calculateRisk);
app.get('/api/risk/health', healthCheck);
app.post('/api/risk/mitigation-strategy', generateMitigationStrategy);
app.post('/api/risk/recommendation-risk-reduction', calculateRecommendationRiskReduction);
app.get('/api/risk/stream', streamRiskProbabilities);

// Project routes
app.post('/api/projects', protect, saveProject);
app.get('/api/projects', protect, getUserProjects);
app.get('/api/projects/:projectId', protect, getProject);
app.put('/api/projects/:projectId', protect, updateProject);
app.delete('/api/projects/:projectId', protect, deleteProject);

// Organization routes
app.get('/api/organizations/:organizationId', protect, getOrganization);
app.get('/api/organizations/:organizationId/projects', protect, getOrganizationProjects);
app.get('/api/organizations/:organizationId/stats', protect, getOrganizationStats);
app.put('/api/organizations/:organizationId', protect, updateOrganization);
app.delete('/api/organizations/:organizationId/members/:userId', protect, removeMember);

// Add diagnostic endpoint (remove in production)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/debug/user', protect, (req, res) => {
  res.json({
    user: req.user,
    hasOrganization: !!req.user?.organization,
    organizationId: req.user?.organization?._id || req.user?.organization,
    organizationType: typeof req.user?.organization
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 50003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
