# Cyber Risk Dashboard - Startup Guide

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (running locally or MongoDB Atlas account)
3. **Python** (v3.8 or higher) - for the risk assessment service

## Backend Setup

### 1. Environment Configuration

Create a `.env` file in the `backend` directory with the following:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/cyber-risk-dashboard
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cyber-risk-dashboard?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port
PORT=5000

# Email Configuration (for email verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@cyberriskdashboard.com
```

### 2. Start the Backend Server

**Option 1: Using the provided scripts**

For Windows Command Prompt:
```bash
cd cyber-risk-dashboard
start_backend.bat
```

For PowerShell:
```powershell
cd cyber-risk-dashboard
.\start_backend.ps1
```

**Option 2: Manual start**
```bash
cd cyber-risk-dashboard/backend
npm install
npm start
```

The backend should start on `http://localhost:5000`

### 3. Start the Python Risk Service

In a new terminal:
```bash
cd cyber-risk-dashboard/backend/python_service
pip install -r requirements.txt
python app.py
```

The Python service should start on `http://localhost:5001`

## Frontend Setup

### 1. Start the Frontend

In a new terminal:
```bash
cd cyber-risk-dashboard
npm install
npm run dev
```

The frontend should start on `http://localhost:5173`

## Troubleshooting

### "Failed to load resource: net::ERR_CONNECTION_REFUSED"

This means the backend server is not running. Make sure to:
1. Start the backend server first
2. Check that MongoDB is running
3. Verify the `.env` file is properly configured

### "Email already registered"

This occurs when trying to register with an email that already exists in the database.

### Projects/Dashboard Loading Forever

This usually means:
1. Backend server is not running
2. MongoDB connection is not established
3. Authentication token is invalid

**Solution:**
1. Check backend console for errors
2. Verify MongoDB is running
3. Try logging out and logging back in

### MongoDB Connection Issues

If using local MongoDB:
```bash
# Start MongoDB
mongod
```

If using MongoDB Atlas:
1. Whitelist your IP address in Atlas
2. Ensure connection string is correct
3. Check network connectivity

## Default Admin Account

The system automatically grants admin privileges to:
- Email: `bigoo5505@gmail.com`

## Organization System

### Creating an Organization (Manager)
1. During signup, choose "Create Organization"
2. Enter organization name
3. Save the generated 6-character code
4. Share this code with team members

### Joining an Organization (User)
1. During signup, choose "Join Organization"
2. Enter the 6-character code provided by your manager
3. Complete registration

### Manager Capabilities
- View all projects within the organization
- See aggregated risk metrics
- Access team member statistics
- No platform-wide admin access

## Quick Test

1. Start backend: `cd backend && npm start`
2. Start Python service: `cd backend/python_service && python app.py`
3. Start frontend: `cd .. && npm run dev`
4. Open browser to `http://localhost:5173`
5. Create a new account with organization
6. Complete a risk assessment
7. View reports and analytics 
 