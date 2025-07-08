import User from '../models/User.js';
import Organization from '../models/Organization.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { isValidEmail, validatePassword } from '../utils/validation.js';
import { sendOTPEmail, sendWelcomeEmail } from '../utils/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const register = async (req, res) => {
  try {
    const { email, password, name, organizationAction, organizationName, organizationCode } = req.body;

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'Password requirements not met',
        errors: passwordValidation.errors 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Validate organization action
    if (!organizationAction || !['create', 'join'].includes(organizationAction)) {
      return res.status(400).json({ message: 'Please specify whether to create or join an organization' });
    }

    let organization = null;
    let userRole = 'user';
    let orgCode = null;

    // Handle organization creation or joining
    if (organizationAction === 'create') {
      if (!organizationName || organizationName.trim().length === 0) {
        return res.status(400).json({ message: 'Organization name is required' });
      }
      
      // Generate organization code but don't create organization yet
      orgCode = await Organization.generateUniqueCode();
      userRole = 'manager';
    } else if (organizationAction === 'join') {
      if (!organizationCode || organizationCode.trim().length === 0) {
        return res.status(400).json({ message: 'Organization code is required' });
      }

      // Find organization by code
      organization = await Organization.findOne({ code: organizationCode.toUpperCase() });
      if (!organization) {
        return res.status(404).json({ message: 'Invalid organization code' });
      }
    }

    // Determine user role - admin for specific email
    const role = email.toLowerCase() === 'bigoo5505@gmail.com' ? 'admin' : userRole;

    // Create new user (without organization first)
    const user = await User.create({
      name,
      email,
      password,
      role,
      organization: organizationAction === 'join' ? organization._id : undefined
    });

    // Now handle organization creation after user exists
    if (organizationAction === 'create') {
      // Create new organization with the user as manager
      organization = await Organization.create({
        name: organizationName.trim(),
        code: orgCode,
        manager: user._id,
        members: [user._id]
      });
      
      // Update user with organization
      user.organization = organization._id;
      await user.save();
    } else if (organizationAction === 'join') {
      // Add user to existing organization
      await organization.addMember(user._id);
    }

    // Generate and send verification OTP
    const otp = user.generateOTP();
    await user.save();

    // Send verification email
    const emailSent = await sendOTPEmail(email, otp, 'verification');
    if (!emailSent) {
      console.warn('Failed to send verification email to:', email);
    }

    // Send welcome email
    await sendWelcomeEmail(email, name);

    // Don't generate token for unverified users
    // const token = generateToken(user._id);

    // Populate organization data
    await user.populate('organization');

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      profilePicture: user.profilePicture,
      isEmailVerified: user.isEmailVerified,
      // Don't include token
      message: 'Account created successfully. Please check your email for verification code.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Find user by email and populate organization
    const user = await User.findOne({ email }).populate('organization');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      profilePicture: user.profilePicture,
      isEmailVerified: user.isEmailVerified,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify email with OTP
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Mark email as verified and clear OTP
    user.isEmailVerified = true;
    user.clearOTP();
    await user.save();

    res.json({ 
      message: 'Email verified successfully',
      isEmailVerified: true 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Resend verification email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send verification email
    const emailSent = await sendOTPEmail(email, otp, 'verification');
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.json({ message: 'Verification code sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Forgot password - send reset OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    // Generate OTP for password reset
    const otp = user.generateOTP();
    await user.save();

    // Send password reset email
    const emailSent = await sendOTPEmail(email, otp, 'reset');
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send password reset email' });
    }

    res.json({ message: 'Password reset code sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset password with OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'Password requirements not met',
        errors: passwordValidation.errors 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    // Update password and clear OTP
    user.password = newPassword;
    user.clearOTP();
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('organization');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Promote user to admin (admin only)
export const promoteToAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Only allow specific admin email to use this endpoint
    if (req.user.email !== 'bigoo5505@gmail.com') {
      return res.status(403).json({ message: 'Unauthorized: Only the main admin can promote users' });
    }
    
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User promoted to admin', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Initialize admin user (development helper)
export const initializeAdmin = async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'bigoo5505@gmail.com' });
    
    if (existingAdmin) {
      // Update to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        return res.json({ message: 'Existing user promoted to admin', user: existingAdmin });
      }
      return res.json({ message: 'Admin user already exists', user: existingAdmin });
    }
    
    // This is a development endpoint - in production, you should create admin manually
    res.status(400).json({ 
      message: 'Admin user does not exist. Please register normally first with the email bigoo5505@gmail.com' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('User ID:', req.user?.id);
    console.log('File:', req.file);

    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Delete old profile picture if it exists
    const user = await User.findById(req.user.id);
    console.log('Found user:', user?.email);
    
    if (user.profilePicture) {
      const oldImagePath = path.join(__dirname, '../uploads/profile-pictures', path.basename(user.profilePicture));
      console.log('Deleting old image:', oldImagePath);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user with new profile picture path
    const profilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;
    console.log('New profile picture path:', profilePicturePath);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: profilePicturePath },
      { new: true }
    ).select('-password');

    console.log('User updated successfully');
    res.json({
      message: 'Profile picture uploaded successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete profile picture
export const deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.profilePicture) {
      // Delete file from filesystem
      const imagePath = path.join(__dirname, '../uploads/profile-pictures', path.basename(user.profilePicture));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Update user in database
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { profilePicture: null },
        { new: true }
      ).select('-password');

      res.json({
        message: 'Profile picture deleted successfully',
        user: updatedUser
      });
    } else {
      res.status(400).json({ message: 'No profile picture to delete' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }