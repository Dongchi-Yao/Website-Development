# Email Configuration & Authentication Setup Guide

## Overview
This guide covers the setup for email verification, password reset functionality, and enhanced authentication features.

## Email Service Configuration

### 1. Gmail Setup (Recommended for Development)

#### Option A: Gmail App Password (Recommended)
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings > Security > App Passwords
3. Generate an app password for "Mail"
4. Use this app password in your `.env` file

#### Option B: Gmail Less Secure Apps (Not Recommended)
1. Enable "Less secure app access" in Gmail settings
2. Note: This option is being phased out by Google

### 2. Environment Variables
Add these to your `backend/.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Existing variables
MONGODB_URI=mongodb://localhost:27017/cyber-risk-dashboard
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
PORT=50003
```

### 3. Alternative Email Services

#### SendGrid (Production Recommended)
```javascript
// In backend/utils/emailService.js
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });
};
```

#### AWS SES
```javascript
// In backend/utils/emailService.js
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.AWS_SES_USER,
      pass: process.env.AWS_SES_PASSWORD,
    },
  });
};
```

## New Authentication Features

### 1. Email Validation
- Real-time email format validation
- Clear error messages for invalid emails
- Frontend and backend validation

### 2. Strong Password Requirements
- Minimum 8 characters
- At least one digit
- At least one uppercase letter
- At least one symbol
- Real-time password strength indicator
- Visual password requirements checklist

### 3. Email Verification with OTP
- 6-digit verification codes
- 10-minute expiration
- Resend functionality
- Automatic verification after registration

### 4. Forgot Password Functionality
- Email-based password reset
- OTP verification
- Strong password enforcement
- Step-by-step reset process

## API Endpoints

### New Authentication Endpoints

```javascript
// Email verification
POST /api/auth/verify-email
Body: { email: string, otp: string }

// Resend verification
POST /api/auth/resend-verification
Body: { email: string }

// Forgot password
POST /api/auth/forgot-password
Body: { email: string }

// Reset password
POST /api/auth/reset-password
Body: { email: string, otp: string, newPassword: string }
```

### Updated Endpoints

```javascript
// Registration now includes validation
POST /api/auth/register
Body: { name: string, email: string, password: string }
Response: { message: string, isEmailVerified: boolean, ... }

// Login now includes email validation
POST /api/auth/login
Body: { email: string, password: string }
Response: { isEmailVerified: boolean, ... }
```

## Frontend Components

### New Components
- `PasswordStrengthIndicator`: Shows password strength with color-coded progress bar
- `EmailVerification`: Modal for entering OTP codes
- `ForgotPassword`: Multi-step password reset dialog

### Updated Components
- `Login.tsx`: Added email validation and forgot password link
- `Signup.tsx`: Added password requirements, strength indicator, and email verification
- `AuthContext.tsx`: Added new authentication methods

## User Experience Flow

### Registration Flow
1. User fills out registration form
2. Real-time validation of email and password
3. Account created and verification email sent
4. Email verification modal appears
5. User enters OTP code
6. Account verified and user logged in

### Login Flow
1. User enters email and password
2. Email format validated in real-time
3. Clear error messages for invalid credentials
4. Successful login redirects to dashboard

### Password Reset Flow
1. User clicks "Forgot password"
2. Enters email address
3. Receives OTP via email
4. Enters OTP code
5. Sets new password with strength requirements
6. Password reset complete

## Testing the Setup

### 1. Test Email Configuration
```bash
# Start the backend server
cd backend
node server.js
```

### 2. Test Registration
1. Go to `/signup`
2. Fill out the form with a valid email
3. Check your email for verification code
4. Enter the code in the verification modal

### 3. Test Password Reset
1. Go to `/login`
2. Click "Forgot password"
3. Enter your email
4. Check your email for reset code
5. Follow the reset process

## Troubleshooting

### Email Not Sending
1. Check email credentials in `.env`
2. Verify Gmail app password is correct
3. Check if 2FA is enabled
4. Review server logs for errors

### OTP Not Working
1. Check if OTP has expired (10 minutes)
2. Verify email address matches
3. Check server logs for OTP generation

### Password Validation Issues
1. Ensure password meets all requirements
2. Check frontend validation logic
3. Verify backend validation is working

## Security Considerations

### Email Security
- Use app passwords, not regular passwords
- Enable 2FA on email accounts
- Consider using dedicated email services for production

### OTP Security
- 6-digit codes with 10-minute expiration
- One-time use only
- Rate limiting on OTP generation

### Password Security
- Strong password requirements enforced
- Password hashing with bcrypt
- No password storage in logs

## Production Deployment

### Email Service
- Use SendGrid, AWS SES, or similar for production
- Set up proper SPF/DKIM records
- Monitor email delivery rates

### Environment Variables
- Use secure environment variable management
- Rotate secrets regularly
- Use different credentials for each environment

### Monitoring
- Monitor authentication attempts
- Track email delivery success rates
- Log security events

## Support

For issues with email setup or authentication features:
1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test email configuration with a simple test script
4. Ensure MongoDB is running and accessible 