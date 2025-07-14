# Authentication System Setup Guide

## Overview
Your cyber risk dashboard now has a complete authentication system using MongoDB, JWT tokens, and React Context for state management.

## Backend Setup

### 1. Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/cyber-risk-dashboard
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cyber-risk-dashboard

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Port
PORT=50003

# Python Service URL (for AI model)
PYTHON_SERVICE_URL=http://localhost:50004
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/cyber-risk-dashboard`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get connection string and add to `.env`

### 3. Install Dependencies
Make sure all backend dependencies are installed. From the project root:

```bash
npm install
```

### 4. Start the Backend Server
```bash
cd backend
node server.js
```

The server should start on port 50003 and connect to MongoDB.

## Frontend Features

### Authentication Context
- **Location**: `src/contexts/AuthContext.tsx`
- **Features**: Login, register, logout, token management, user state
- **Storage**: JWT tokens stored in localStorage
- **Auto-refresh**: Validates token on app start

### Protected Routes
- **Location**: `src/components/ProtectedRoute.tsx`
- **Protected Pages**: Risk Quantification, Reports, Project Details
- **Features**: Automatic redirect to login, loading states, admin role checking

### Login/Signup Pages
- **Login**: `src/pages/Login.tsx`
- **Signup**: `src/pages/Signup.tsx`
- **Features**: Form validation, error handling, loading states, automatic redirect

### Navigation Updates
- **Location**: `src/components/Navbar.tsx`
- **Features**: User avatar, dropdown menu, logout, conditional login/signup buttons

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
GET  /api/auth/profile  - Get user profile (protected)
```

### Request/Response Examples

#### Register
```javascript
// Request
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Response
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt-token-here"
}
```

#### Login
```javascript
// Request
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

// Response
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt-token-here"
}
```

## User Roles
- **user**: Default role, access to all user features
- **admin**: Admin privileges (can be extended for admin-only features)

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected route middleware
- Input validation
- Error handling
- Token expiration (30 days)

## How to Use

### 1. Start the Application
```bash
# Terminal 1: Start backend
cd backend
node server.js

# Terminal 2: Start frontend
npm run dev
```

### 2. Register a New User
1. Go to `/signup`
2. Fill in the registration form
3. Automatically logged in and redirected to dashboard

### 3. Login
1. Go to `/login`
2. Enter credentials
3. Redirected to the page you were trying to access (or home)

### 4. Access Protected Features
- Risk Quantification tool
- Reports dashboard
- Project details

### 5. Logout
- Click on user avatar in navbar
- Select "Logout" from dropdown menu

## Troubleshooting

### Common Issues

#### "Authentication failed" or "Token invalid"
- Check if backend server is running
- Verify MongoDB connection
- Clear localStorage and try logging in again

#### "Network Error" or "Failed to fetch"
- Ensure backend is running on port 5000
- Check CORS configuration in server.js
- Verify API URLs in frontend code

#### "User already exists"
- Try logging in instead of registering
- Use a different email address

### Development Tips

#### Reset User State
```javascript
// In browser console
localStorage.removeItem('token');
location.reload();
```

#### Check JWT Token
```javascript
// In browser console
console.log(localStorage.getItem('token'));
```

#### MongoDB Connection Test
```javascript
// In backend directory
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cyber-risk-dashboard')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));
"
```

## Next Steps

### Recommended Enhancements
1. **Password Reset**: Add forgot password functionality
2. **Email Verification**: Verify email addresses on registration
3. **Session Management**: Add refresh tokens
4. **Profile Management**: Allow users to update their profiles
5. **Admin Panel**: Add admin interface for user management
6. **Audit Logging**: Track user actions and login attempts

### Production Considerations
1. Use strong JWT secrets (environment variables)
2. Set up proper MongoDB cluster with authentication
3. Enable HTTPS/SSL
4. Add rate limiting
5. Set up proper error logging
6. Configure CORS for production domains
7. Add input sanitization
8. Implement account lockout after failed attempts

## File Structure
```
cyber-risk-dashboard/
├── backend/
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── riskController.js     # Risk calculation logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── models/
│   │   └── User.js               # User MongoDB schema
│   └── server.js                 # Express server setup
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication state management
│   ├── components/
│   │   ├── ProtectedRoute.tsx    # Route protection component
│   │   └── Navbar.tsx            # Updated navigation with auth
│   ├── pages/
│   │   ├── Login.tsx             # Login form
│   │   └── Signup.tsx            # Registration form
│   └── App.tsx                   # Updated with AuthProvider
└── AUTHENTICATION_SETUP.md       # This guide
```

🎉 **Your authentication system is now fully implemented and ready to use!** 