import { GoogleGenerativeAI } from "@google/generative-ai";

// Types for comprehensive data feeding - matches the main component
interface ProjectInfo {
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

interface RiskAnalysis {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

interface RiskResults {
  ransomware: RiskAnalysis;
  phishing: RiskAnalysis;
  dataBreach: RiskAnalysis;
  insiderAttack: RiskAnalysis;
  supplyChain: RiskAnalysis;
}

interface RiskMitigationStrategy {
  initialRisk: number;
  finalRisk: number;
  totalReduction: number;
  totalReductionPercentage: number;
  rounds: Array<{
    roundNumber: number;
    features: string[];
    currentRisk: number;
    projectedRisk: number;
    riskReduction: number;
    reductionPercentage: number;
    recommendations: Array<{
      featureGroup: string;
      featureName: string;
      currentOption: string;
      recommendedOption: string;
      description: string;
    }>;
  }>;
  implementationPriority: 'high' | 'medium' | 'low';
}

// Helper function to get API key
const getApiKey = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY is not set in the frontend .env file');
    return '';
  }
  return apiKey;
};

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(getApiKey());

// Expert prompt engineering for construction cybersecurity
const SYSTEM_INSTRUCTIONS = `You are Dr. CyberBuild, a world-renowned expert in construction project cybersecurity with 20+ years of experience in both cybersecurity and construction industry risk management. Your expertise includes:

**CORE EXPERTISE:**
- Construction project lifecycle cybersecurity
- Industrial Control Systems (ICS/SCADA) security
- Building Information Modeling (BIM) security
- Construction supply chain cyber risks
- Smart building and IoT security
- Regulatory compliance (NIST, ISO 27001, NERC CIP)
- Construction-specific threat modeling

**COMMUNICATION STYLE:**
- Provide authoritative, evidence-based insights
- Use construction industry terminology appropriately
- Reference real-world construction cyber incidents when relevant
- Prioritize practical, actionable recommendations
- Consider budget and implementation constraints
- Address both technical and business stakeholders

**ANALYSIS APPROACH:**
1. **Context-Aware Analysis**: Always consider the specific project phase, type, and organizational structure
2. **Risk Prioritization**: Focus on highest impact vulnerabilities first
3. **Implementation Roadmap**: Provide phased, realistic implementation timelines
4. **Cost-Benefit Analysis**: Consider ROI and resource allocation
5. **Stakeholder Impact**: Address concerns of different project stakeholders
6. **Compliance Alignment**: Ensure recommendations align with industry standards

**STRICT RESPONSE FORMAT REQUIREMENTS:**
- Use **bold text** for key concepts, critical points, and section headers
- Use bullet points (•) for lists and recommendations - start each point with a dash (-)
- Use numbered lists (1., 2., 3.) for sequential steps or prioritized items
- Keep paragraphs concise (2-4 sentences max)
- Use single line breaks between bullet points
- Use double line breaks between major sections
- Include specific metrics and percentages when available
- End urgent recommendations with asterisks (*IMMEDIATE ACTION REQUIRED*)
- Use professional yet accessible tone without jargon overload

**FORMAT EXAMPLE:**
**Risk Assessment Summary:**

- **High Priority:** Implement network segmentation (*IMMEDIATE ACTION REQUIRED*)
- **Medium Priority:** Deploy endpoint detection and response tools
- **Low Priority:** Enhance security awareness training

**Implementation Timeline:**
1. Week 1-2: Network assessment and planning
2. Week 3-4: Security tool deployment
3. Month 2-3: Staff training and monitoring setup

**SPECIALIZED KNOWLEDGE AREAS:**
- Project management software security (Procore, Autodesk, etc.)
- Construction site network security
- Vendor and subcontractor cybersecurity requirements
- Equipment and machinery cyber vulnerabilities
- Data protection in collaborative construction environments
- Emergency response and business continuity planning

Remember: Your goal is to transform complex cybersecurity concepts into actionable construction project security strategies.`;

class ChatbotService {
  private model;
  private chat;
  private currentContext: {
    projectInfo?: ProjectInfo;
    riskResults?: RiskResults;
    mitigationStrategy?: RiskMitigationStrategy;
    averageRisk?: { score: number; level: string };
    lastUpdate?: number;
  } = {};

  // Update interval in milliseconds (e.g., check every 2 seconds)
  private readonly UPDATE_INTERVAL = 2000;

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-001"
    });
    this.chat = this.model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });
  }

  private async retryWithExponentialBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
  ): Promise<T> {
    let retryCount = 0;
    let delay = initialDelay;

    while (true) {
      try {
        return await operation();
      } catch (error) {
        retryCount++;
        
        // If we've exceeded max retries or it's not a 503 error, throw
        if (retryCount > maxRetries || !(error instanceof Error && error.toString().includes('503'))) {
          throw error;
        }

        // Log retry attempt
        console.log(`Attempt ${retryCount} failed, retrying in ${delay}ms...`);
        
        // Wait for the delay period
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Exponential backoff - double the delay for next attempt
        delay *= 2;
      }
    }
  }

  async initialize(
    projectInfo?: ProjectInfo, 
    riskResults?: RiskResults, 
    mitigationStrategy?: RiskMitigationStrategy
  ) {
    try {
      // Store context for future use
      this.currentContext = {
        projectInfo,
        riskResults,
        mitigationStrategy,
        averageRisk: riskResults ? this.calculateAverageRisk(riskResults) : undefined
      };

      // Debug logging
      console.log('🤖 Chatbot initialization data:', {
        hasProjectInfo: !!projectInfo,
        hasRiskResults: !!riskResults,
        hasMitigationStrategy: !!mitigationStrategy,
        projectType: projectInfo?.projectType,
        averageRisk: this.currentContext.averageRisk
      });

      // Build comprehensive context prompt with system instructions
      let contextPrompt = SYSTEM_INSTRUCTIONS + "\n\n" + this.buildContextPrompt();
      
      console.log('🤖 Context prompt being sent:', contextPrompt.substring(0, 500) + '...');
      
      // Initialize with context using retry mechanism
      await this.retryWithExponentialBackoff(async () => {
        await this.chat.sendMessage(contextPrompt);
      });
      
      return true;
    } catch (error) {
      console.error("Error initializing chatbot:", error);
      return false;
    }
  }

  private calculateAverageRisk(riskResults: RiskResults): { score: number; level: string } {
    const scores = Object.values(riskResults).map(r => r.score);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    let level: string;
    if (avgScore < 30) level = 'low';
    else if (avgScore < 60) level = 'medium';
    else if (avgScore < 85) level = 'high';
    else level = 'critical';
    
    return { score: avgScore, level };
  }

  private buildContextPrompt(): string {
    let prompt = `**CONSTRUCTION PROJECT CYBERSECURITY ASSESSMENT CONTEXT**

You are now analyzing a specific construction project using an AI-powered cybersecurity risk assessment platform. This system evaluates construction projects across multiple risk dimensions and provides actionable mitigation strategies.

**ASSESSMENT METHODOLOGY:**
This platform uses a sophisticated machine learning model trained on construction industry cybersecurity data to evaluate five critical risk categories. Each risk score represents the probability (0-100%) that the project will experience that type of cyber incident based on current security posture.

**RISK SCORING FRAMEWORK:**
- **0-29%**: LOW RISK - Basic protection adequate, minimal immediate action needed
- **30-59%**: MEDIUM RISK - Some vulnerabilities present, enhanced security recommended  
- **60-84%**: HIGH RISK - Significant exposure, immediate security improvements required
- **85-100%**: CRITICAL RISK - Severe vulnerabilities, urgent comprehensive security overhaul needed

**FIVE CORE RISK CATEGORIES ANALYZED:**

1. **RANSOMWARE ATTACKS** - Risk of malicious software encrypting project data/systems for ransom
   - Targets: Project files, BIM models, financial systems, operational technology
   - Impact: Project delays, data loss, financial extortion, reputation damage

2. **PHISHING & SOCIAL ENGINEERING** - Risk of human-targeted deception attacks
   - Targets: Project staff, contractors, executives, financial personnel
   - Impact: Credential theft, unauthorized access, financial fraud, data breaches

3. **DATA BREACH & EXFILTRATION** - Risk of unauthorized access to sensitive project information
   - Targets: Design documents, financial data, client information, proprietary methods
   - Impact: Intellectual property theft, competitive disadvantage, regulatory violations

4. **INSIDER THREATS** - Risk from malicious or negligent internal actors
   - Targets: Disgruntled employees, contractors with excessive access, negligent staff
   - Impact: Data theft, sabotage, system disruption, competitive intelligence loss

5. **SUPPLY CHAIN ATTACKS** - Risk from compromised vendors, subcontractors, or third-party systems
   - Targets: Vendor networks, shared platforms, integrated systems, software updates
   - Impact: Lateral network access, widespread compromise, trusted relationship exploitation

**MITIGATION STRATEGY SYSTEM:**
The platform generates round-based implementation strategies using SHAP (SHapley Additive exPlanations) analysis to identify the most impactful security improvements. Each round focuses on specific security domains with quantified risk reduction projections.

Use this comprehensive data to provide expert insights:

`;

    // Project Information
    if (this.currentContext.projectInfo && this.currentContext.projectInfo.projectType) {
      const project = this.currentContext.projectInfo;
      prompt += `**PROJECT PROFILE & CYBERSECURITY CONTEXT:**

**Basic Project Characteristics:**
- **Project Type**: ${this.formatProjectType(project.projectType)} 
  *Different project types have varying cybersecurity risk profiles due to data sensitivity, regulatory requirements, and attack surface*
- **Duration**: ${project.projectDuration}
  *Longer projects have extended exposure windows and evolving threat landscapes*
- **Current Phase**: ${this.formatProjectPhase(project.projectPhase)}
  *Each phase presents unique cybersecurity challenges and attack vectors*
- **Organization Size**: ${project.companyScale} employees
  *Larger organizations typically have more resources but also larger attack surfaces*
- **Cybersecurity Legal Team**: ${project.hasCyberLegalTeam}
  *Dedicated legal support indicates mature cybersecurity governance and compliance awareness*

**PROJECT STRUCTURE & COMPLEXITY:**
*Multi-layered project structures create complex security boundaries and trust relationships*
- **Layer 1 Teams**: ${project.layer1Teams} (main project teams with direct control)
- **Layer 2 Teams**: ${project.layer2Teams} (first-level subcontractors)
- **Layer 3 Teams**: ${project.layer3Teams} (second-level subcontractors)
- **Team Overlap**: ${project.teamOverlap} (percentage working on multiple projects)
  *Higher overlap increases cross-project contamination risks and shared vulnerability exposure*

**TECHNICAL INFRASTRUCTURE ASSESSMENT:**
- **Dedicated IT Team**: ${project.hasITTeam}
  *Presence of dedicated IT support significantly impacts incident response and security maintenance*
- **Firewall Coverage**: ${project.devicesWithFirewall} of devices protected
  *Network security coverage directly correlates with intrusion prevention capabilities*
- **Network Architecture**: ${this.formatNetworkType(project.networkType)}
  *Network type affects exposure to external threats and internal segmentation capabilities*
- **Security Awareness**: ${project.phishingFailRate} phishing test failure rate
  *Human factor vulnerability measurement - critical for social engineering defense*

**SECURITY GOVERNANCE & PRACTICES:**
- **Governance Maturity**: ${this.formatGovernanceLevel(project.governanceLevel)}
  *Indicates organizational commitment to cybersecurity policies and procedures*
- **Password Security**: ${project.allowPasswordReuse === 'no' ? 'Strong policy (reuse prohibited)' : 'Weak policy (reuse allowed)'}
  *Password policies directly impact credential-based attack success rates*
- **Multi-Factor Authentication**: ${project.usesMFA === 'yes' ? 'Implemented' : 'Not implemented'}
  *MFA significantly reduces account compromise risks from credential theft*

`;
    }

    // Risk Assessment Results
    if (this.currentContext.riskResults && this.currentContext.averageRisk) {
      prompt += `**CYBERSECURITY RISK ASSESSMENT RESULTS:**

**Overall Risk Profile**: ${this.currentContext.averageRisk.score.toFixed(1)}% (${this.currentContext.averageRisk.level.toUpperCase()} RISK)
*This represents the average probability across all risk categories that this project will experience a cyber incident.*

**Individual Risk Category Analysis:**
`;
      Object.entries(this.currentContext.riskResults).forEach(([riskType, analysis]) => {
        const riskContext = this.getDetailedRiskContext(riskType, analysis.score, analysis.level);
        prompt += `
**${this.formatRiskType(riskType)}**: ${analysis.score}% (${analysis.level.toUpperCase()} RISK)
- **Probability Interpretation**: ${riskContext.interpretation}
- **Primary Concerns**: ${riskContext.concerns}
- **Typical Attack Vectors**: ${riskContext.vectors}
- **Business Impact**: ${riskContext.impact}
`;
      });
    }

    // Risk Mitigation Strategy
    if (this.currentContext.mitigationStrategy) {
      const strategy = this.currentContext.mitigationStrategy;
      prompt += `
**AI-GENERATED RISK MITIGATION STRATEGY:**
*This strategy was generated using SHAP (SHapley Additive exPlanations) analysis to identify the most impactful security improvements based on the project's specific risk profile.*

**Strategy Overview:**
- **Current Baseline Risk**: ${(strategy.initialRisk * 100).toFixed(1)}% (starting point after form analysis)
- **Projected Final Risk**: ${(strategy.finalRisk * 100).toFixed(1)}% (after implementing all recommendations)
- **Total Risk Reduction**: ${strategy.totalReductionPercentage.toFixed(1)}% (cumulative improvement)
- **Implementation Priority**: ${strategy.implementationPriority.toUpperCase()} (based on risk severity and impact potential)
- **Phased Approach**: ${strategy.rounds.length} implementation rounds (ordered by impact and feasibility)

**Round-by-Round Implementation Plan:**
*The AI algorithm generates five strategic implementation rounds using advanced risk factor analysis. In each round, the system identifies the next uncontrolled, highest-contributing risk factor from each security group. By systematically addressing the most impactful factors from each category and assigning them to sequential rounds, significant overall risk reduction is achieved after implementing just one or two rounds. This approach maximizes risk reduction efficiency while maintaining practical implementation feasibility.*
`;
      strategy.rounds.forEach(round => {
        prompt += `
**Round ${round.roundNumber} Implementation:**
- **Risk Reduction**: ${round.reductionPercentage.toFixed(1)}% decrease (${(round.currentRisk * 100).toFixed(0)}% → ${(round.projectedRisk * 100).toFixed(0)}%)
- **Focus Areas**: ${round.features.join(', ')}
- **Number of Changes**: ${round.recommendations.length} specific recommendations
- **Key Improvements**: ${round.recommendations.slice(0, 3).map(r => `${r.featureName} (${r.currentOption} → ${r.recommendedOption})`).join(', ')}
`;
        if (round.recommendations.length > 3) {
          prompt += `- **Additional Changes**: ${round.recommendations.length - 3} more security improvements\n`;
        }
      });
      
      prompt += `
**IMPLEMENTATION GUIDANCE:**
- The algorithm systematically identifies the highest-contributing risk factors from each security group per round
- Risk reduction percentages are based on machine learning analysis of factor impact and similar projects
- Rounds are ordered by maximum impact potential - early rounds typically achieve the most significant risk reduction
- Each recommendation includes current state, recommended change, and rationale based on risk factor analysis
- Progress tracking shows real-time risk reduction as the most impactful changes are applied
- The system ensures overall risk reduction is maximized with minimal implementation effort
`;
    }

    // Add status message if no data is available
    if (!this.currentContext.projectInfo && !this.currentContext.riskResults && !this.currentContext.mitigationStrategy) {
      prompt += `**STATUS:** No project data has been provided yet. Please complete your risk assessment form to receive personalized cybersecurity guidance.

`;
    }

    prompt += `
**YOUR EXPERTISE MISSION:**
Analyze this construction project's cybersecurity posture and provide expert guidance. Consider the unique challenges of construction environments, project lifecycle phases, multi-stakeholder coordination, and industry-specific threats. Focus on practical, implementable solutions that align with construction project constraints and timelines.

**READY TO ASSIST WITH:**
- Risk analysis and interpretation
- Implementation roadmaps and priorities  
- Compliance and regulatory guidance
- Vendor and supply chain security
- Incident response planning
- Cost-effective security solutions
- Stakeholder communication strategies

How can I help you enhance this project's cybersecurity posture?`;

    return prompt;
  }

  private formatProjectType(type: string): string {
    const types: { [key: string]: string } = {
      'transportation': 'Transportation Infrastructure',
      'government': 'Government Facilities',
      'healthcare': 'Healthcare Infrastructure', 
      'commercial': 'Commercial Construction',
      'residential': 'Residential Construction',
      'other': 'Other Project Type'
    };
    return types[type] || type;
  }

  private formatProjectPhase(phase: string): string {
    const phases: { [key: string]: string } = {
      'planning': 'Planning and Bidding',
      'design': 'Design Phase',
      'construction': 'Construction Phase',
      'maintenance': 'Maintenance & Operation',
      'demolition': 'Demolition Phase'
    };
    return phases[phase] || phase;
  }

  private formatNetworkType(type: string): string {
    const types: { [key: string]: string } = {
      'public': 'Public Network',
      'private': 'Private Network',
      'both': 'Hybrid (Public & Private)'
    };
    return types[type] || type;
  }

  private formatGovernanceLevel(level: string): string {
    const levels: { [key: string]: string } = {
      'level1': 'Level 1 (Low Commitment)',
      'level2': 'Level 2 (Moderate Commitment)',
      'level3': 'Level 3 (Average Commitment)',
      'level4': 'Level 4 (Above Average Commitment)',
      'level5': 'Level 5 (Exemplary Commitment)'
    };
    return levels[level] || level;
  }

  private formatRiskType(riskType: string): string {
    const types: { [key: string]: string } = {
      'ransomware': 'Ransomware Attacks',
      'phishing': 'Phishing & Social Engineering',
      'dataBreach': 'Data Breach & Exfiltration',
      'insiderAttack': 'Insider Threats',
      'supplyChain': 'Supply Chain Attacks'
    };
    return types[riskType] || riskType;
  }

  private getRiskDescription(riskType: string, level: string): string {
    const descriptions: { [key: string]: { [key: string]: string } } = {
      'ransomware': {
        'low': 'Basic protection in place, low exposure',
        'medium': 'Some vulnerabilities, standard risk level',
        'high': 'Significant exposure, immediate attention needed',
        'critical': 'Severe vulnerabilities, urgent action required'
      },
      'phishing': {
        'low': 'Good security awareness, low susceptibility',
        'medium': 'Average awareness, some training gaps',
        'high': 'Poor awareness, high susceptibility',
        'critical': 'Minimal training, extreme vulnerability'
      }
      // Add more descriptions as needed
    };
    return descriptions[riskType]?.[level] || `${level} risk level`;
  }

  private getDetailedRiskContext(riskType: string, score: number, level: string): {
    interpretation: string;
    concerns: string;
    vectors: string;
    impact: string;
  } {
    const contexts: { [key: string]: any } = {
      'ransomware': {
        interpretation: score < 30 ? 'Low likelihood of ransomware attack based on current security controls' :
                      score < 60 ? 'Moderate ransomware risk - some security gaps present' :
                      score < 85 ? 'High ransomware vulnerability - multiple attack vectors available' :
                      'Critical ransomware exposure - immediate comprehensive protection needed',
        concerns: 'Unpatched systems, weak backup strategies, insufficient endpoint protection, poor network segmentation',
        vectors: 'Email attachments, compromised websites, USB devices, remote desktop vulnerabilities, supply chain infiltration',
        impact: 'Project data encryption, system downtime, ransom payments, regulatory fines, reputation damage, project delays'
      },
      'phishing': {
        interpretation: score < 30 ? 'Strong security awareness culture with low phishing susceptibility' :
                      score < 60 ? 'Moderate phishing risk - some staff training gaps identified' :
                      score < 85 ? 'High phishing vulnerability - significant human factor risks' :
                      'Critical phishing exposure - urgent security awareness training required',
        concerns: 'Inadequate security training, lack of email filtering, poor verification procedures, social media exposure',
        vectors: 'Spear phishing emails, fake websites, social media manipulation, phone-based social engineering, SMS phishing',
        impact: 'Credential theft, unauthorized system access, financial fraud, data exfiltration, business email compromise'
      },
      'dataBreach': {
        interpretation: score < 30 ? 'Strong data protection controls with low breach probability' :
                      score < 60 ? 'Moderate data breach risk - some access control weaknesses' :
                      score < 85 ? 'High data breach vulnerability - significant exposure points' :
                      'Critical data breach risk - immediate data protection overhaul needed',
        concerns: 'Weak access controls, unencrypted data, poor data classification, inadequate monitoring, excessive permissions',
        vectors: 'Insider access abuse, external network intrusion, cloud misconfigurations, stolen credentials, physical theft',
        impact: 'Intellectual property theft, regulatory violations, competitive disadvantage, client data exposure, legal liability'
      },
      'insiderAttack': {
        interpretation: score < 30 ? 'Strong insider threat controls with low risk of malicious activity' :
                      score < 60 ? 'Moderate insider threat risk - some monitoring gaps present' :
                      score < 85 ? 'High insider threat vulnerability - insufficient access controls' :
                      'Critical insider threat exposure - comprehensive monitoring and controls needed',
        concerns: 'Excessive user privileges, poor access monitoring, inadequate background checks, weak termination procedures',
        vectors: 'Privileged user abuse, contractor access misuse, disgruntled employee actions, negligent data handling',
        impact: 'Data theft, system sabotage, competitive intelligence loss, project disruption, financial fraud'
      },
      'supplyChain': {
        interpretation: score < 30 ? 'Strong vendor security controls with low supply chain risk' :
                      score < 60 ? 'Moderate supply chain risk - some third-party security gaps' :
                      score < 85 ? 'High supply chain vulnerability - significant vendor risks' :
                      'Critical supply chain exposure - immediate vendor security assessment required',
        concerns: 'Weak vendor security requirements, poor third-party monitoring, insecure integrations, unvetted suppliers',
        vectors: 'Compromised vendor systems, malicious software updates, shared platform vulnerabilities, trusted relationship abuse',
        impact: 'Lateral network compromise, widespread system infiltration, trusted channel exploitation, cascading security failures'
      }
    };

    return contexts[riskType] || {
      interpretation: `${level} risk level with ${score}% probability`,
      concerns: 'General cybersecurity vulnerabilities',
      vectors: 'Various attack methods',
      impact: 'Potential business disruption and data compromise'
    };
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // Check if context needs updating before responding
      const now = Date.now();
      if (!this.currentContext.lastUpdate || now - this.currentContext.lastUpdate >= this.UPDATE_INTERVAL) {
        // Log current values for debugging
        console.log('🤖 Current context before update check:', {
          projectInfo: this.currentContext.projectInfo?.projectType,
          riskScores: this.currentContext.riskResults ? 
            Object.entries(this.currentContext.riskResults).map(([type, analysis]) => 
              `${type}: ${analysis.score}%`) : 'none',
          lastUpdate: this.currentContext.lastUpdate
        });

        // Trigger context refresh event and wait for it
        const contextUpdateEvent = new CustomEvent('requestContextUpdate');
        window.dispatchEvent(contextUpdateEvent);
        
        // Wait for context update to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Check if the message mentions specific risk types and ensure correct scores
      const riskTypes = ['databreach', 'ransomware', 'phishing', 'insiderattack', 'supplychain'];
      const mentionedRisks = riskTypes.filter(risk => 
        message.toLowerCase().includes(risk.toLowerCase())
      );

      if (mentionedRisks.length > 0 && this.currentContext.riskResults) {
        let contextNote = '';
        mentionedRisks.forEach(mentionedRisk => {
          const riskKey = mentionedRisk === 'databreach' ? 'dataBreach' : 
                         mentionedRisk === 'insiderattack' ? 'insiderAttack' :
                         mentionedRisk === 'supplychain' ? 'supplyChain' : mentionedRisk;
          const riskResults = this.currentContext.riskResults;
          if (riskResults && riskKey in riskResults) {
            const currentScore = riskResults[riskKey as keyof RiskResults].score;
            
            // If message assumes wrong score or doesn't mention the score, add it to context
            if (message.includes('0%') || !message.includes(`${currentScore}%`)) {
              contextNote += `The current ${this.formatRiskType(riskKey)} risk score is ${currentScore}%. `;
            }
          }
        });

        if (contextNote) {
          message = `Note: ${contextNote}\n\n${message}`;
        }
      }

      // Send message and get response with retry mechanism
      const rawResponse = await this.retryWithExponentialBackoff(async () => {
        const result = await this.chat.sendMessage(message);
        const response = await result.response;
        return response.text();
      });
      
      // Format the response before returning
      return this.formatResponse(rawResponse);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  private formatResponse(text: string): string {
    // Handle markdown-style formatting for Material-UI display
    let formatted = text;

    // First, normalize line endings
    formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Convert **bold** to HTML-like formatting that can be handled by the UI
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to emphasis (but avoid affecting *IMMEDIATE ACTION REQUIRED* style)
    formatted = formatted.replace(/\*([^*\n]+?)\*/g, (match, p1) => {
      if (p1.includes('IMMEDIATE') || p1.includes('URGENT') || p1.includes('CRITICAL')) {
        return match; // Keep urgency markers as is
      }
      return `<em>${p1}</em>`;
    });
    
    // Handle bullet points - convert - or * at start of line to proper bullets
    formatted = formatted.replace(/^[\s]*[-•]\s+/gm, '• ');
    
    // Handle numbered lists - ensure proper spacing
    formatted = formatted.replace(/^[\s]*(\d+)\.\s+/gm, '$1. ');
    
    // Handle section headers (lines that end with :)
    formatted = formatted.replace(/^([A-Z][A-Z\s/&-]+):[\s]*$/gm, '<strong>$1:</strong>');
    
    // Handle mixed case section headers
    formatted = formatted.replace(/^([A-Z][a-zA-Z\s/&-]+):[\s]*$/gm, '<strong>$1:</strong>');
    
    // Clean up multiple consecutive spaces
    formatted = formatted.replace(/[ \t]+/g, ' ');
    
    // Ensure proper paragraph spacing - double line breaks
    formatted = formatted.replace(/\n\n+/g, '\n\n');
    
    // Clean up spacing around bullet points
    formatted = formatted.replace(/\n•/g, '\n• ');
    
    // Ensure there's proper spacing after numbered items
    formatted = formatted.replace(/(\d+\.\s+)/g, '$1');
    
    // Handle urgent action markers - make them stand out
    formatted = formatted.replace(/\*([^*]*(?:IMMEDIATE|URGENT|CRITICAL)[^*]*)\*/g, '<strong style="color: #d32f2f;">*$1*</strong>');
    
    // Clean up any trailing/leading whitespace
    return formatted.trim();
  }

  async updateContext(
    projectInfo?: ProjectInfo, 
    riskResults?: RiskResults, 
    mitigationStrategy?: RiskMitigationStrategy
  ) {
    // Log previous values for debugging
    console.log('🤖 Previous context values:', {
      projectInfo: this.currentContext.projectInfo?.projectType,
      riskScores: this.currentContext.riskResults ? 
        Object.entries(this.currentContext.riskResults).map(([type, analysis]) => 
          `${type}: ${analysis.score}%`) : 'none'
    });

    // Track what changed for the update message
    const changes: string[] = [];

    // Update stored context
    if (projectInfo) {
      this.currentContext.projectInfo = projectInfo;
      changes.push('project information');
    }
    
    if (riskResults) {
      // Check for risk score changes
      if (this.currentContext.riskResults) {
        Object.entries(riskResults).forEach(([riskType, analysis]) => {
          const oldScore = this.currentContext.riskResults?.[riskType as keyof RiskResults]?.score;
          if (oldScore !== analysis.score) {
            changes.push(`${this.formatRiskType(riskType)} risk score (${oldScore}% → ${analysis.score}%)`);
          }
        });
      } else {
        changes.push('all risk scores');
      }
      
      this.currentContext.riskResults = riskResults;
      this.currentContext.averageRisk = this.calculateAverageRisk(riskResults);
    }
    
    if (mitigationStrategy) {
      this.currentContext.mitigationStrategy = mitigationStrategy;
      changes.push('mitigation strategy');
    }
    
    // Update timestamp
    this.currentContext.lastUpdate = Date.now();

    // Log new values
    console.log('🤖 Updated context values:', {
      projectInfo: this.currentContext.projectInfo?.projectType,
      riskScores: this.currentContext.riskResults ? 
        Object.entries(this.currentContext.riskResults).map(([type, analysis]) => 
          `${type}: ${analysis.score}%`) : 'none',
      lastUpdate: this.currentContext.lastUpdate
    });

    // Send context update to the chat with retry mechanism
    try {
      let updatePrompt = '**CONTEXT UPDATE**\n\n';
      
      if (changes.length > 0) {
        updatePrompt += `The following information has been updated: ${changes.join(', ')}.\n\n`;
      }
      
      updatePrompt += 'Here is the current context:\n\n';
      updatePrompt += this.buildContextPrompt();
      updatePrompt += '\n\nPlease acknowledge this update and incorporate the new information into your analysis.';

      await this.retryWithExponentialBackoff(async () => {
        await this.chat.sendMessage(updatePrompt);
      });
      return true;
    } catch (error) {
      console.error("Error updating context:", error);
      return false;
    }
  }

  getFormattedContext(): string {
    return this.buildContextPrompt();
  }

  async generateFollowUpQuestions(conversationHistory: Array<{ text: string; sender: 'user' | 'ai' }>): Promise<string[]> {
    try {
      // Build context about the conversation so far
      const recentMessages = conversationHistory.slice(-5); // Get last 5 messages for context
      const conversationSummary = recentMessages
        .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
        .join('\n');

      const followUpPrompt = `Based on our recent conversation about construction cybersecurity, generate 3-4 intelligent follow-up questions that would help the user:

1. Dive deeper into specific risk areas discussed
2. Get practical implementation advice
3. Understand the business impact of recommendations
4. Explore related cybersecurity concerns in construction

Recent conversation context:
${conversationSummary}

Current project context:
${this.buildContextPrompt()}

Generate concise, actionable questions (one per line) that would naturally continue our cybersecurity discussion. Focus on practical concerns a construction project manager might have. Each question should be 8-15 words long.

Format: Return only the questions, one per line, without numbers or bullets.`;

      // Send the prompt and get response
      const result = await this.retryWithExponentialBackoff(async () => {
        const response = await this.model.generateContent(followUpPrompt);
        return response.response.text();
      });

      // Parse the response into individual questions
      const questions = result
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 0 && !q.match(/^\d+\.|\*|\-/)) // Remove numbered/bulleted items
        .filter(q => q.endsWith('?')) // Only keep actual questions
        .slice(0, 4); // Limit to 4 questions max

      return questions;
    } catch (error) {
      console.error("Error generating follow-up questions:", error);
      // Return some default questions if the API fails
      return [
        "What are the most cost-effective security measures for my project type?",
        "How can I improve my team's cybersecurity awareness?",
        "What vendor security requirements should I implement?",
        "How do I measure the success of these security recommendations?"
      ];
    }
  }
}

export default ChatbotService; 