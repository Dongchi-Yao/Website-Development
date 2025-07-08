export interface ProjectInfo {
  // Section 1: Basic Project Information
  projectDuration: string;
  projectType: string;
  hasCyberLegalTeam: string;
  companyScale: string;
  projectPhase: string;

  // Section 2: Project Structure
  layer1Teams: string;
  layer2Teams: string;
  layer3Teams: string;
  teamOverlap: string;

  // Section 3: Technical Factors
  hasITTeam: string;
  devicesWithFirewall: string;
  networkType: string;
  phishingFailRate: string;

  // Section 4: Security Practices
  governanceLevel: string;
  allowPasswordReuse: string;
  usesMFA: string;

  // Additional fields
  regulatoryRequirements: string;
  stakeholderCount: string;
  thirdPartyVendors: string;
  remoteWorkLevel: string;
  cloudServices: string;
  dataClassification: string;
  bmsIntegration: string;
  accessControl: string;
  securityMonitoring: string;
  incidentResponse: string;
  backupStrategy: string;
  securityCertifications: string;
  securityAwareness: string;
  securityTeamSize: string;
  thirdPartySecurityReq: string;
  securityBudget: string;
} 