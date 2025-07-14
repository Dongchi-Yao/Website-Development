import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: Number,
  text: String,
  sender: {
    type: String,
    enum: ['user', 'ai']
  },
  timestamp: Date
});

const conversationSchema = new mongoose.Schema({
  id: Number,
  title: String,
  messages: [messageSchema],
  lastUpdated: Date
});

const riskAnalysisSchema = new mongoose.Schema({
  score: Number,
  level: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical']
  },
  recommendations: [String]
});

const riskResultsSchema = new mongoose.Schema({
  ransomware: riskAnalysisSchema,
  phishing: riskAnalysisSchema,
  dataBreach: riskAnalysisSchema,
  insiderAttack: riskAnalysisSchema,
  supplyChain: riskAnalysisSchema
});

const riskMitigationRecommendationSchema = new mongoose.Schema({
  featureGroup: String,
  featureName: String,
  currentOption: String,
  recommendedOption: String,
  optionIndex: Number,
  description: String,
  enhancedDescription: String,
  costLevel: Number,
  importance: String
});

const riskMitigationRoundSchema = new mongoose.Schema({
  roundNumber: Number,
  features: [String],
  currentRisk: Number,
  projectedRisk: Number,
  riskReduction: Number,
  reductionPercentage: Number,
  recommendations: [riskMitigationRecommendationSchema]
});

const riskMitigationStrategySchema = new mongoose.Schema({
  initialRisk: Number,
  finalRisk: Number,
  totalReduction: Number,
  totalReductionPercentage: Number,
  rounds: [riskMitigationRoundSchema],
  implementationPriority: {
    type: String,
    enum: ['high', 'medium', 'low']
  }
});

const projectInfoSchema = new mongoose.Schema({
  // Section 1: Basic Project Information
  projectDuration: String,
  projectType: String,
  hasCyberLegalTeam: String,
  companyScale: String,
  projectPhase: String,

  // Section 2: Project Structure
  layer1Teams: String,
  layer2Teams: String,
  layer3Teams: String,
  teamOverlap: String,

  // Section 3: Technical Factors
  hasITTeam: String,
  devicesWithFirewall: String,
  networkType: String,
  phishingFailRate: String,

  // Section 4: Security Practices
  governanceLevel: String,
  allowPasswordReuse: String,
  usesMFA: String,

  // Additional fields
  regulatoryRequirements: String,
  stakeholderCount: String,
  thirdPartyVendors: String,
  remoteWorkLevel: String,
  cloudServices: String,
  dataClassification: String,
  bmsIntegration: String,
  accessControl: String,
  securityMonitoring: String,
  incidentResponse: String,
  backupStrategy: String,
  securityCertifications: String,
  securityAwareness: String,
  securityTeamSize: String,
  thirdPartySecurityReq: String,
  securityBudget: String
});

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null
  },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  projectInfo: projectInfoSchema,
  riskResults: riskResultsSchema,
  mitigationStrategy: riskMitigationStrategySchema,
  conversations: [conversationSchema],
  
  // Recommendation Management Fields
  appliedRecommendations: {
    type: [String],
    default: []
  },
  lockedRecommendations: {
    type: [String],
    default: []
  },
  enhancedDescriptions: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  selectedRound: {
    type: Number,
    default: 0
  },
  changeableProperties: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;