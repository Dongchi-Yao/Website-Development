# Cyber Risk Dashboard for Construction Projects

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.10-blue.svg)](https://mui.com/)

A comprehensive web application for managing cybersecurity risks in construction projects, developed by the S.M.A.R.T. Construction Research Group at New York University Abu Dhabi.

## 🏗️ Overview

The Cyber Risk Dashboard is an innovative platform designed to help construction professionals proactively identify, assess, and mitigate cybersecurity threats throughout their project lifecycle. As construction projects become increasingly digitized, they face sophisticated cybersecurity threats from Building Information Modeling (BIM) systems to IoT-enabled equipment.

### Key Features

- **🔍 AI-Powered Risk Identification**: Interactive chatbot for identifying potential cyber threats
- **📊 Risk Quantification**: Comprehensive scoring system based on 46 project parameters
- **📝 Topic Modeling**: Upload documents to discover hidden cybersecurity topics and patterns
- **📋 Project Management**: Track multiple projects and generate detailed reports
- **🔒 User Authentication**: Secure login system with JWT tokens
- **📈 Detailed Analytics**: Visual insights and risk assessment reports

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (for backend functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Website-Development
   ```

2. **Navigate to the main application**
   ```bash
   cd cyber-risk-dashboard
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in the cyber-risk-dashboard directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:5173](http://localhost:5173) in your browser

## 🏛️ Architecture

### Frontend
- **React 18** with TypeScript for type safety
- **Material-UI** for consistent design system
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **Vite** for fast development and building

### Backend
- **Express.js** server with TypeScript
- **MongoDB** with Mongoose for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Project Structure
```
Website-Development/
├── cyber-risk-dashboard/           # Main React application
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                # Main application pages
│   │   ├── contexts/             # React contexts for state management
│   │   └── assets/               # Static assets
│   ├── backend/
│   │   ├── controllers/          # API route handlers
│   │   ├── models/              # Database models
│   │   └── middleware/          # Express middleware
│   ├── public/                  # Static files and research papers
│   └── scripts/                 # Build and deployment scripts
├── Webpages/                    # Legacy HTML pages
├── New models for the risk quant/ # Machine learning models
└── Language model/              # AI language model implementation
```

## 📱 Features & Modules

### 1. Risk Identification 💬
An AI-powered chatbot that helps identify potential cyber risks through natural language conversations.

**Features:**
- Interactive chat interface
- Conversation history
- Predefined risk categories
- Suggested questions
- Real-time responses

### 2. Risk Quantification 📊
Comprehensive risk assessment based on project characteristics across 5 categories:

**Assessment Categories:**
- **Cyber Governance** (7 factors)
- **Project Structure** (18 factors)
- **IT Factors** (9 factors)
- **OT Factors** (5 factors)
- **People Factors** (7 factors)

**Risk Types Evaluated:**
- Malware & Ransomware
- Phishing & Social Engineering
- Data Breaches
- Supply Chain Attacks
- Insider Threats

### 3. Topic Modeling 📄
Advanced text analysis to discover hidden cybersecurity topics in project documents.

**Capabilities:**
- Document upload support
- Text paste functionality
- AI-driven topic extraction
- Pattern identification
- Risk insight generation

### 4. Project Management 📋
Centralized dashboard for managing multiple construction projects.

**Features:**
- Project creation and editing
- Risk score tracking
- Progress monitoring
- Team collaboration tools

### 5. Reports & Analytics 📈
Comprehensive reporting system with research-backed insights.

**Available Reports:**
- Project risk assessments
- Industry benchmarking
- Trend analysis
- Custom report generation

## 🧪 Research Foundation

This platform is built on extensive academic research conducted by the S.M.A.R.T. Construction Research Group:

### Published Research Papers

1. **"Mitigating Malicious Insider Threats to Common Data Environments"** (2025)
   - *Journal of Cybersecurity and Privacy*

2. **"Enhancing cyber risk identification in the construction industry using language models"** (2024)
   - *Automation in Construction*

3. **"Integrating Machine Learning for Cyber Risk Analysis in Construction 4.0"** (2024)
   - *International Conference on Computing in Civil and Building Engineering*

4. **"Cyber Risk Assessment Framework for the Construction Industry Using Machine Learning Techniques"** (2024)
   - *Buildings Journal*

5. **"A corpus database for cybersecurity topic modeling in the construction industry"** (2023)
   - *ISARC. Proceedings of the International Symposium on Automation and Robotics in Construction*

### Research Team

- **Dr. Borja García de Soto** - Principal Investigator, Associate Professor
- **Dr. Dongchi (Daniel) Yao** - Postdoctoral Associate, Lead Researcher
- **Begad Elfackrany** - Research Assistant & Lead Developer

## 🤝 Industry Collaborations

The platform benefits from partnerships with leading construction companies:

- **ALEC Engineering** - Industry insights and validation
- **PetroChina** - Large-scale project testing
- **China State Construction Engineering Corporation** - Global construction standards

## 🛠️ Development

### Available Scripts

```bash
# Navigate to main application
cd cyber-risk-dashboard

# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend (if running separately)
cd backend
npm start           # Start Express server
```

### Development Guidelines

1. **Code Style**: Follow TypeScript best practices
2. **Components**: Use functional components with hooks
3. **Styling**: Utilize Material-UI's theming system
4. **State Management**: Leverage React Context for global state
5. **API Integration**: Use fetch with proper error handling

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `cyber-risk-dashboard` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/cyber-risk-dashboard
JWT_SECRET=your-secret-key

# API Configuration
API_BASE_URL=http://localhost:3001
PORT=3001

# Development
NODE_ENV=development
```

### Database Setup

The application uses MongoDB for data persistence. Ensure MongoDB is running and accessible at the configured URI.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Project Endpoints
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Risk Assessment Endpoints
- `POST /api/risk-assessment` - Submit risk assessment
- `GET /api/risk-assessment/:id` - Get assessment results

## 🚀 Deployment

### Production Build

```bash
# Navigate to main application
cd cyber-risk-dashboard

# Build frontend
npm run build

# Build backend (if applicable)
cd backend && npm run build
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY cyber-risk-dashboard/package*.json ./
RUN npm install --production
COPY cyber-risk-dashboard/ .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 Additional Resources

### Machine Learning Models
The `New models for the risk quant/` directory contains advanced machine learning models including:
- Mixture of Experts model for risk assessment
- Neural network architectures for threat prediction
- Training datasets and evaluation metrics

### Language Models
The `Language model/` directory includes:
- Fine-tuned GPT-4o-mini model for cybersecurity risk assessment
- Training prompts and response examples
- API integration examples

### Legacy Pages
The `Webpages/` directory contains the original HTML implementation for reference and comparison.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support & Contact

### S.M.A.R.T. Construction Research Group
- **Website**: [NYUAD S.M.A.R.T. Labs](https://nyuad.nyu.edu/en/research/faculty-labs-and-projects/smart-construction-research-group.html)
- **LinkedIn**: [S.M.A.R.T. Construction Research Group](https://www.linkedin.com/company/smart-construction-research-group/)
- **Email**: garcia.de.soto@nyu.edu
- **Phone**: +971 2-628-4978
- **Location**: New York University Abu Dhabi

### Research Areas (S.M.A.R.T.)
- **S**ustainable and resilient construction
- **M**odularization and lean construction
- **A**rtificial intelligence
- **R**obotic systems and automation
- **T**echnology integration and information modeling

## 🔮 Future Roadmap

- [ ] Integration with real-time threat intelligence feeds
- [ ] Advanced machine learning models for risk prediction
- [ ] Mobile application development
- [ ] API integration with major construction software platforms
- [ ] Enhanced visualization and dashboard capabilities
- [ ] Multi-language support
- [ ] Compliance frameworks integration (ISO 27001, NIST)
- [ ] Cloud deployment and scalability improvements
- [ ] Real-time collaboration features
- [ ] Advanced reporting and export capabilities

## 📊 Repository Structure

```
Website-Development/
├── README.md                       # This file
├── cyber-risk-dashboard/           # Main React application
├── Webpages/                      # Legacy HTML implementation
├── New models for the risk quant/ # ML models and algorithms
└── Language model/                # AI language model components
```

---

**Built with ❤️ by the S.M.A.R.T. Construction Research Group at NYU Abu Dhabi** 