import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Project from '../models/Project.js';

dotenv.config();

const mockProjects = [
  {
    projectName: 'Downtown Office Complex',
    projectInfo: {
      projectDuration: '18-24 months',
      projectType: 'Commercial Building',
      hasCyberLegalTeam: 'Yes',
      companyScale: 'Large',
      projectPhase: 'Construction',
      layer1Teams: '5-10',
      layer2Teams: '10-20',
      layer3Teams: '20+',
      teamOverlap: 'High',
      hasITTeam: 'Yes',
      devicesWithFirewall: '75-100%',
      networkType: 'Hybrid',
      phishingFailRate: '10-25%',
      governanceLevel: 'High',
      allowPasswordReuse: 'No',
      usesMFA: 'Yes',
      regulatoryRequirements: 'High',
      stakeholderCount: '20+',
      thirdPartyVendors: '10-20',
      remoteWorkLevel: 'Medium',
      cloudServices: 'Extensive',
      dataClassification: 'Implemented',
      bmsIntegration: 'Full',
      accessControl: 'Role-based',
      securityMonitoring: '24/7',
      incidentResponse: 'Established',
      backupStrategy: 'Automated',
      securityCertifications: 'ISO 27001',
      securityAwareness: 'Regular',
      securityTeamSize: '5-10',
      thirdPartySecurityReq: 'Required',
      securityBudget: 'High'
    },
    riskResults: {
      ransomware: { score: 0.25, level: 'low', recommendations: ['Maintain current backup strategy', 'Continue security training'] },
      phishing: { score: 0.35, level: 'medium', recommendations: ['Increase phishing simulations', 'Enhance email filtering'] },
      dataBreach: { score: 0.20, level: 'low', recommendations: ['Keep access controls updated', 'Regular security audits'] },
      insiderAttack: { score: 0.30, level: 'medium', recommendations: ['Implement user behavior analytics', 'Regular access reviews'] },
      supplyChain: { score: 0.40, level: 'medium', recommendations: ['Vendor security assessments', 'Supply chain monitoring'] }
    },
    mitigationStrategy: {
      initialRisk: 0.30,
      finalRisk: 0.15,
      totalReduction: 0.15,
      totalReductionPercentage: 50,
      implementationPriority: 'high',
      rounds: [
        {
          roundNumber: 1,
          features: ['securityMonitoring', 'incidentResponse', 'backupStrategy'],
          currentRisk: 0.30,
          projectedRisk: 0.22,
          riskReduction: 0.08,
          reductionPercentage: 26.67,
          recommendations: [
            {
              featureGroup: 'Security Operations',
              featureName: 'Security Monitoring',
              currentOption: 'Business hours',
              recommendedOption: '24/7',
              optionIndex: 3,
              description: 'Upgrade to 24/7 security monitoring',
              enhancedDescription: 'Implement round-the-clock security monitoring with automated threat detection and response capabilities',
              costLevel: 3,
              importance: 'Critical'
            }
          ]
        },
        {
          roundNumber: 2,
          features: ['accessControl', 'dataClassification'],
          currentRisk: 0.22,
          projectedRisk: 0.15,
          riskReduction: 0.07,
          reductionPercentage: 31.82,
          recommendations: [
            {
              featureGroup: 'Access Management',
              featureName: 'Access Control',
              currentOption: 'Basic',
              recommendedOption: 'Role-based',
              optionIndex: 2,
              description: 'Implement role-based access control',
              enhancedDescription: 'Deploy comprehensive RBAC system with regular access reviews and privilege management',
              costLevel: 2,
              importance: 'High'
            }
          ]
        }
      ]
    },
    conversations: [
      {
        id: 1,
        title: 'Initial Risk Assessment Discussion',
        lastUpdated: new Date(),
        messages: [
          { id: 1, text: 'What are the main cyber risks for our office complex project?', sender: 'user', timestamp: new Date() },
          { id: 2, text: 'Based on your project profile, the main cyber risks include: 1) Supply chain attacks due to multiple vendors, 2) Phishing targeting project stakeholders, 3) Potential insider threats from the large team size. Your current security measures are strong, which helps mitigate these risks.', sender: 'ai', timestamp: new Date() }
        ]
      }
    ]
  },
  {
    projectName: 'Smart Manufacturing Facility',
    projectInfo: {
      projectDuration: '24+ months',
      projectType: 'Industrial Facility',
      hasCyberLegalTeam: 'Yes',
      companyScale: 'Large',
      projectPhase: 'Planning',
      layer1Teams: '10-20',
      layer2Teams: '20+',
      layer3Teams: '20+',
      teamOverlap: 'Medium',
      hasITTeam: 'Yes',
      devicesWithFirewall: '50-75%',
      networkType: 'Segmented',
      phishingFailRate: '25-50%',
      governanceLevel: 'Medium',
      allowPasswordReuse: 'Yes',
      usesMFA: 'Partial',
      regulatoryRequirements: 'Medium',
      stakeholderCount: '20+',
      thirdPartyVendors: '20+',
      remoteWorkLevel: 'Low',
      cloudServices: 'Moderate',
      dataClassification: 'Partial',
      bmsIntegration: 'Partial',
      accessControl: 'Basic',
      securityMonitoring: 'Business hours',
      incidentResponse: 'Basic',
      backupStrategy: 'Manual',
      securityCertifications: 'None',
      securityAwareness: 'Annual',
      securityTeamSize: '1-5',
      thirdPartySecurityReq: 'Optional',
      securityBudget: 'Medium'
    },
    riskResults: {
      ransomware: { score: 0.65, level: 'high', recommendations: ['Implement automated backups', 'Network segmentation'] },
      phishing: { score: 0.70, level: 'high', recommendations: ['Mandatory security training', 'Deploy anti-phishing tools'] },
      dataBreach: { score: 0.55, level: 'medium', recommendations: ['Implement data classification', 'Encryption at rest'] },
      insiderAttack: { score: 0.60, level: 'high', recommendations: ['Access control improvements', 'Activity monitoring'] },
      supplyChain: { score: 0.75, level: 'critical', recommendations: ['Vendor assessments', 'Supply chain security requirements'] }
    },
    mitigationStrategy: {
      initialRisk: 0.65,
      finalRisk: 0.35,
      totalReduction: 0.30,
      totalReductionPercentage: 46.15,
      implementationPriority: 'high',
      rounds: [
        {
          roundNumber: 1,
          features: ['allowPasswordReuse', 'usesMFA', 'phishingFailRate'],
          currentRisk: 0.65,
          projectedRisk: 0.50,
          riskReduction: 0.15,
          reductionPercentage: 23.08,
          recommendations: []
        },
        {
          roundNumber: 2,
          features: ['backupStrategy', 'securityMonitoring'],
          currentRisk: 0.50,
          projectedRisk: 0.35,
          riskReduction: 0.15,
          reductionPercentage: 30.00,
          recommendations: []
        }
      ]
    },
    conversations: []
  },
  {
    projectName: 'Residential Tower Development',
    projectInfo: {
      projectDuration: '12-18 months',
      projectType: 'Residential Building',
      hasCyberLegalTeam: 'No',
      companyScale: 'Medium',
      projectPhase: 'Design',
      layer1Teams: '1-5',
      layer2Teams: '5-10',
      layer3Teams: '10-20',
      teamOverlap: 'Low',
      hasITTeam: 'Outsourced',
      devicesWithFirewall: '25-50%',
      networkType: 'Basic',
      phishingFailRate: '50%+',
      governanceLevel: 'Low',
      allowPasswordReuse: 'Yes',
      usesMFA: 'No',
      regulatoryRequirements: 'Low',
      stakeholderCount: '10-20',
      thirdPartyVendors: '5-10',
      remoteWorkLevel: 'High',
      cloudServices: 'Basic',
      dataClassification: 'None',
      bmsIntegration: 'None',
      accessControl: 'Password only',
      securityMonitoring: 'None',
      incidentResponse: 'None',
      backupStrategy: 'None',
      securityCertifications: 'None',
      securityAwareness: 'None',
      securityTeamSize: 'None',
      thirdPartySecurityReq: 'None',
      securityBudget: 'Low'
    },
    riskResults: {
      ransomware: { score: 0.85, level: 'critical', recommendations: ['Urgent: Implement backup strategy', 'Deploy endpoint protection'] },
      phishing: { score: 0.90, level: 'critical', recommendations: ['Immediate security training needed', 'Email security gateway'] },
      dataBreach: { score: 0.80, level: 'critical', recommendations: ['Implement access controls', 'Data encryption required'] },
      insiderAttack: { score: 0.75, level: 'high', recommendations: ['User activity monitoring', 'Principle of least privilege'] },
      supplyChain: { score: 0.70, level: 'high', recommendations: ['Vendor security requirements', 'Third-party risk assessment'] }
    },
    mitigationStrategy: {
      initialRisk: 0.80,
      finalRisk: 0.45,
      totalReduction: 0.35,
      totalReductionPercentage: 43.75,
      implementationPriority: 'high',
      rounds: []
    },
    conversations: []
  }
];

async function createMockData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing mock data
    await User.deleteMany({ email: { $in: ['manager@construction.com', 'user1@construction.com', 'user2@construction.com'] } });
    await Organization.deleteOne({ code: 'DEMO01' });
    
    // Create organization
    const organization = await Organization.create({
      name: 'Demo Construction Corp',
      code: 'DEMO01',
      description: 'A demonstration construction company for showcasing the platform',
      industry: 'Construction',
      size: 'Large',
      manager: new mongoose.Types.ObjectId(), // Temporary, will update
      members: []
    });

    console.log('Created organization:', organization.name, 'Code:', organization.code);

    // Create manager account
    const manager = await User.create({
      name: 'John Manager',
      email: 'manager@construction.com',
      password: 'Demo123!',
      role: 'manager',
      organization: organization._id,
      isEmailVerified: true
    });

    // Update organization with manager
    organization.manager = manager._id;
    organization.members = [manager._id];
    await organization.save();

    console.log('Created manager account:', manager.email);

    // Create user accounts
    const user1 = await User.create({
      name: 'Alice Engineer',
      email: 'user1@construction.com',
      password: 'Demo123!',
      role: 'user',
      organization: organization._id,
      isEmailVerified: true
    });

    const user2 = await User.create({
      name: 'Bob Contractor',
      email: 'user2@construction.com',
      password: 'Demo123!',
      role: 'user',
      organization: organization._id,
      isEmailVerified: true
    });

    // Add users to organization
    await organization.addMember(user1._id);
    await organization.addMember(user2._id);

    console.log('Created user accounts:', user1.email, user2.email);

    // Create projects for each user
    // Manager gets 2 projects
    for (let i = 0; i < 2; i++) {
      const projectData = { ...mockProjects[i] };
      await Project.create({
        userId: manager._id,
        organization: organization._id,
        ...projectData,
        createdAt: new Date(Date.now() - (30 - i * 10) * 24 * 60 * 60 * 1000), // 30 and 20 days ago
        updatedAt: new Date(Date.now() - (25 - i * 10) * 24 * 60 * 60 * 1000)  // 25 and 15 days ago
      });
    }

    // User1 gets 2 projects
    for (let i = 0; i < 2; i++) {
      const projectData = { ...mockProjects[i] };
      projectData.projectName = projectData.projectName + ' - Alice';
      await Project.create({
        userId: user1._id,
        organization: organization._id,
        ...projectData,
        createdAt: new Date(Date.now() - (20 - i * 5) * 24 * 60 * 60 * 1000), // 20 and 15 days ago
        updatedAt: new Date(Date.now() - (15 - i * 5) * 24 * 60 * 60 * 1000)  // 15 and 10 days ago
      });
    }

    // User2 gets 1 project
    const projectData = { ...mockProjects[2] };
    projectData.projectName = projectData.projectName + ' - Bob';
    await Project.create({
      userId: user2._id,
      organization: organization._id,
      ...projectData,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)   // 5 days ago
    });

    console.log('Created mock projects for all users');

    console.log('\n=== Mock Account Credentials ===');
    console.log('\nOrganization Code: DEMO01');
    console.log('\nManager Account:');
    console.log('Email: manager@construction.com');
    console.log('Password: Demo123!');
    console.log('\nUser Account 1:');
    console.log('Email: user1@construction.com');
    console.log('Password: Demo123!');
    console.log('\nUser Account 2:');
    console.log('Email: user2@construction.com');
    console.log('Password: Demo123!');
    console.log('\n================================\n');

    console.log('Mock data creation completed successfully!');
    
  } catch (error) {
    console.error('Error creating mock data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
createMockData(); 
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Project from '../models/Project.js';

dotenv.config();

const mockProjects = [
  {
    projectName: 'Downtown Office Complex',
    projectInfo: {
      projectDuration: '18-24 months',
      projectType: 'Commercial Building',
      hasCyberLegalTeam: 'Yes',
      companyScale: 'Large',
      projectPhase: 'Construction',
      layer1Teams: '5-10',
      layer2Teams: '10-20',
      layer3Teams: '20+',
      teamOverlap: 'High',
      hasITTeam: 'Yes',
      devicesWithFirewall: '75-100%',
      networkType: 'Hybrid',
      phishingFailRate: '10-25%',
      governanceLevel: 'High',
      allowPasswordReuse: 'No',
      usesMFA: 'Yes',
      regulatoryRequirements: 'High',
      stakeholderCount: '20+',
      thirdPartyVendors: '10-20',
      remoteWorkLevel: 'Medium',
      cloudServices: 'Extensive',
      dataClassification: 'Implemented',
      bmsIntegration: 'Full',
      accessControl: 'Role-based',
      securityMonitoring: '24/7',
      incidentResponse: 'Established',
      backupStrategy: 'Automated',
      securityCertifications: 'ISO 27001',
      securityAwareness: 'Regular',
      securityTeamSize: '5-10',
      thirdPartySecurityReq: 'Required',
      securityBudget: 'High'
    },
    riskResults: {
      ransomware: { score: 0.25, level: 'low', recommendations: ['Maintain current backup strategy', 'Continue security training'] },
      phishing: { score: 0.35, level: 'medium', recommendations: ['Increase phishing simulations', 'Enhance email filtering'] },
      dataBreach: { score: 0.20, level: 'low', recommendations: ['Keep access controls updated', 'Regular security audits'] },
      insiderAttack: { score: 0.30, level: 'medium', recommendations: ['Implement user behavior analytics', 'Regular access reviews'] },
      supplyChain: { score: 0.40, level: 'medium', recommendations: ['Vendor security assessments', 'Supply chain monitoring'] }
    },
    mitigationStrategy: {
      initialRisk: 0.30,
      finalRisk: 0.15,
      totalReduction: 0.15,
      totalReductionPercentage: 50,
      implementationPriority: 'high',
      rounds: [
        {
          roundNumber: 1,
          features: ['securityMonitoring', 'incidentResponse', 'backupStrategy'],
          currentRisk: 0.30,
          projectedRisk: 0.22,
          riskReduction: 0.08,
          reductionPercentage: 26.67,
          recommendations: [
            {
              featureGroup: 'Security Operations',
              featureName: 'Security Monitoring',
              currentOption: 'Business hours',
              recommendedOption: '24/7',
              optionIndex: 3,
              description: 'Upgrade to 24/7 security monitoring',
              enhancedDescription: 'Implement round-the-clock security monitoring with automated threat detection and response capabilities',
              costLevel: 3,
              importance: 'Critical'
            }
          ]
        },
        {
          roundNumber: 2,
          features: ['accessControl', 'dataClassification'],
          currentRisk: 0.22,
          projectedRisk: 0.15,
          riskReduction: 0.07,
          reductionPercentage: 31.82,
          recommendations: [
            {
              featureGroup: 'Access Management',
              featureName: 'Access Control',
              currentOption: 'Basic',
              recommendedOption: 'Role-based',
              optionIndex: 2,
              description: 'Implement role-based access control',
              enhancedDescription: 'Deploy comprehensive RBAC system with regular access reviews and privilege management',
              costLevel: 2,
              importance: 'High'
            }
          ]
        }
      ]
    },
    conversations: [
      {
        id: 1,
        title: 'Initial Risk Assessment Discussion',
        lastUpdated: new Date(),
        messages: [
          { id: 1, text: 'What are the main cyber risks for our office complex project?', sender: 'user', timestamp: new Date() },
          { id: 2, text: 'Based on your project profile, the main cyber risks include: 1) Supply chain attacks due to multiple vendors, 2) Phishing targeting project stakeholders, 3) Potential insider threats from the large team size. Your current security measures are strong, which helps mitigate these risks.', sender: 'ai', timestamp: new Date() }
        ]
      }
    ]
  },
  {
    projectName: 'Smart Manufacturing Facility',
    projectInfo: {
      projectDuration: '24+ months',
      projectType: 'Industrial Facility',
      hasCyberLegalTeam: 'Yes',
      companyScale: 'Large',
      projectPhase: 'Planning',
      layer1Teams: '10-20',
      layer2Teams: '20+',
      layer3Teams: '20+',
      teamOverlap: 'Medium',
      hasITTeam: 'Yes',
      devicesWithFirewall: '50-75%',
      networkType: 'Segmented',
      phishingFailRate: '25-50%',
      governanceLevel: 'Medium',
      allowPasswordReuse: 'Yes',
      usesMFA: 'Partial',
      regulatoryRequirements: 'Medium',
      stakeholderCount: '20+',
      thirdPartyVendors: '20+',
      remoteWorkLevel: 'Low',
      cloudServices: 'Moderate',
      dataClassification: 'Partial',
      bmsIntegration: 'Partial',
      accessControl: 'Basic',
      securityMonitoring: 'Business hours',
      incidentResponse: 'Basic',
      backupStrategy: 'Manual',
      securityCertifications: 'None',
      securityAwareness: 'Annual',
      securityTeamSize: '1-5',
      thirdPartySecurityReq: 'Optional',
      securityBudget: 'Medium'
    },
    riskResults: {
      ransomware: { score: 0.65, level: 'high', recommendations: ['Implement automated backups', 'Network segmentation'] },
      phishing: { score: 0.70, level: 'high', recommendations: ['Mandatory security training', 'Deploy anti-phishing tools'] },
      dataBreach: { score: 0.55, level: 'medium', recommendations: ['Implement data classification', 'Encryption at rest'] },
      insiderAttack: { score: 0.60, level: 'high', recommendations: ['Access control improvements', 'Activity monitoring'] },
      supplyChain: { score: 0.75, level: 'critical', recommendations: ['Vendor assessments', 'Supply chain security requirements'] }
    },
    mitigationStrategy: {
      initialRisk: 0.65,
      finalRisk: 0.35,
      totalReduction: 0.30,
      totalReductionPercentage: 46.15,
      implementationPriority: 'high',
      rounds: [
        {
          roundNumber: 1,
          features: ['allowPasswordReuse', 'usesMFA', 'phishingFailRate'],
          currentRisk: 0.65,
          projectedRisk: 0.50,
          riskReduction: 0.15,
          reductionPercentage: 23.08,
          recommendations: []
        },
        {
          roundNumber: 2,
          features: ['backupStrategy', 'securityMonitoring'],
          currentRisk: 0.50,
          projectedRisk: 0.35,
          riskReduction: 0.15,
          reductionPercentage: 30.00,
          recommendations: []
        }
      ]
    },
    conversations: []
  },
  {
    projectName: 'Residential Tower Development',
    projectInfo: {
      projectDuration: '12-18 months',
      projectType: 'Residential Building',
      hasCyberLegalTeam: 'No',
      companyScale: 'Medium',
      projectPhase: 'Design',
      layer1Teams: '1-5',
      layer2Teams: '5-10',
      layer3Teams: '10-20',
      teamOverlap: 'Low',
      hasITTeam: 'Outsourced',
      devicesWithFirewall: '25-50%',
      networkType: 'Basic',
      phishingFailRate: '50%+',
      governanceLevel: 'Low',
      allowPasswordReuse: 'Yes',
      usesMFA: 'No',
      regulatoryRequirements: 'Low',
      stakeholderCount: '10-20',
      thirdPartyVendors: '5-10',
      remoteWorkLevel: 'High',
      cloudServices: 'Basic',
      dataClassification: 'None',
      bmsIntegration: 'None',
      accessControl: 'Password only',
      securityMonitoring: 'None',
      incidentResponse: 'None',
      backupStrategy: 'None',
      securityCertifications: 'None',
      securityAwareness: 'None',
      securityTeamSize: 'None',
      thirdPartySecurityReq: 'None',
      securityBudget: 'Low'
    },
    riskResults: {
      ransomware: { score: 0.85, level: 'critical', recommendations: ['Urgent: Implement backup strategy', 'Deploy endpoint protection'] },
      phishing: { score: 0.90, level: 'critical', recommendations: ['Immediate security training needed', 'Email security gateway'] },
      dataBreach: { score: 0.80, level: 'critical', recommendations: ['Implement access controls', 'Data encryption required'] },
      insiderAttack: { score: 0.75, level: 'high', recommendations: ['User activity monitoring', 'Principle of least privilege'] },
      supplyChain: { score: 0.70, level: 'high', recommendations: ['Vendor security requirements', 'Third-party risk assessment'] }
    },
    mitigationStrategy: {
      initialRisk: 0.80,
      finalRisk: 0.45,
      totalReduction: 0.35,
      totalReductionPercentage: 43.75,
      implementationPriority: 'high',
      rounds: []
    },
    conversations: []
  }
];

async function createMockData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing mock data
    await User.deleteMany({ email: { $in: ['manager@construction.com', 'user1@construction.com', 'user2@construction.com'] } });
    await Organization.deleteOne({ code: 'DEMO01' });
    
    // Create organization
    const organization = await Organization.create({
      name: 'Demo Construction Corp',
      code: 'DEMO01',
      description: 'A demonstration construction company for showcasing the platform',
      industry: 'Construction',
      size: 'Large',
      manager: new mongoose.Types.ObjectId(), // Temporary, will update
      members: []
    });

    console.log('Created organization:', organization.name, 'Code:', organization.code);

    // Create manager account
    const manager = await User.create({
      name: 'John Manager',
      email: 'manager@construction.com',
      password: 'Demo123!',
      role: 'manager',
      organization: organization._id,
      isEmailVerified: true
    });

    // Update organization with manager
    organization.manager = manager._id;
    organization.members = [manager._id];
    await organization.save();

    console.log('Created manager account:', manager.email);

    // Create user accounts
    const user1 = await User.create({
      name: 'Alice Engineer',
      email: 'user1@construction.com',
      password: 'Demo123!',
      role: 'user',
      organization: organization._id,
      isEmailVerified: true
    });

    const user2 = await User.create({
      name: 'Bob Contractor',
      email: 'user2@construction.com',
      password: 'Demo123!',
      role: 'user',
      organization: organization._id,
      isEmailVerified: true
    });

    // Add users to organization
    await organization.addMember(user1._id);
    await organization.addMember(user2._id);

    console.log('Created user accounts:', user1.email, user2.email);

    // Create projects for each user
    // Manager gets 2 projects
    for (let i = 0; i < 2; i++) {
      const projectData = { ...mockProjects[i] };
      await Project.create({
        userId: manager._id,
        organization: organization._id,
        ...projectData,
        createdAt: new Date(Date.now() - (30 - i * 10) * 24 * 60 * 60 * 1000), // 30 and 20 days ago
        updatedAt: new Date(Date.now() - (25 - i * 10) * 24 * 60 * 60 * 1000)  // 25 and 15 days ago
      });
    }

    // User1 gets 2 projects
    for (let i = 0; i < 2; i++) {
      const projectData = { ...mockProjects[i] };
      projectData.projectName = projectData.projectName + ' - Alice';
      await Project.create({
        userId: user1._id,
        organization: organization._id,
        ...projectData,
        createdAt: new Date(Date.now() - (20 - i * 5) * 24 * 60 * 60 * 1000), // 20 and 15 days ago
        updatedAt: new Date(Date.now() - (15 - i * 5) * 24 * 60 * 60 * 1000)  // 15 and 10 days ago
      });
    }

    // User2 gets 1 project
    const projectData = { ...mockProjects[2] };
    projectData.projectName = projectData.projectName + ' - Bob';
    await Project.create({
      userId: user2._id,
      organization: organization._id,
      ...projectData,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)   // 5 days ago
    });

    console.log('Created mock projects for all users');

    console.log('\n=== Mock Account Credentials ===');
    console.log('\nOrganization Code: DEMO01');
    console.log('\nManager Account:');
    console.log('Email: manager@construction.com');
    console.log('Password: Demo123!');
    console.log('\nUser Account 1:');
    console.log('Email: user1@construction.com');
    console.log('Password: Demo123!');
    console.log('\nUser Account 2:');
    console.log('Email: user2@construction.com');
    console.log('Password: Demo123!');
    console.log('\n================================\n');

    console.log('Mock data creation completed successfully!');
    
  } catch (error) {
    console.error('Error creating mock data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
createMockData(); 