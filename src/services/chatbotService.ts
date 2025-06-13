import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ProjectInfo {
  projectDuration: string;
  projectType: string;
  hasCyberLegalTeam: string;
  companyScale: string;
  projectPhase: string;
  layer1Teams: string;
  layer2Teams: string;
  layer3Teams: string;
  teamOverlap: string;
  hasITTeam: string;
  devicesWithFirewall: string;
  networkType: string;
  phishingFailRate: string;
  governanceLevel: string;
  allowPasswordReuse: string;
  usesMFA: string;
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

export interface RiskAnalysis {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface RiskResults {
  ransomware: RiskAnalysis;
  phishing: RiskAnalysis;
  dataBreach: RiskAnalysis;
  insiderAttack: RiskAnalysis;
  supplyChain: RiskAnalysis;
}

export interface ChatContext {
  projectInfo: ProjectInfo;
  riskResults: RiskResults;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface Conversation {
  id: number;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyCb4rKzI2MYbWPsGaf6Fw0Amh3JPLiUBnY");

// Specialized instructions for the risk analysis chatbot
const SYSTEM_INSTRUCTIONS = `You are a specialized AI assistant focused on cybersecurity risk analysis and assessment for construction projects. You will be provided with detailed project information and risk assessment results.

Your role is to:
1. Analyze and explain risk assessment results in detail
2. Provide actionable recommendations for risk mitigation
3. Use professional cybersecurity terminology while remaining clear
4. Consider industry best practices and standards
5. Highlight critical security concerns and priorities
6. Provide step-by-step guidance for implementing security measures
7. Reference relevant compliance requirements when applicable
8. Maintain confidentiality of sensitive information
9. Ask clarifying questions when needed for better analysis
10. Stay focused on cybersecurity and risk management topics

You should actively use the project context provided to you, including:
- Project characteristics (duration, type, scale, phase)
- Team structure (cyber/legal team presence, IT team, team organization)
- Technical setup (firewalls, network type, security measures)
- Security practices (governance, password policies, MFA)
- Additional factors (regulatory requirements, stakeholders, vendors)

When analyzing risks, consider how these project-specific factors influence each risk category.`;

class ChatbotService {
  private model;
  private chat;
  private context?: ChatContext;
  private lastInitializedContext?: string; // Hash of the last context used

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  private hashContext(context?: ChatContext): string {
    if (!context) return '';
    return JSON.stringify({
      projectInfo: context.projectInfo,
      riskResults: context.riskResults
    });
  }

  private buildSystemPrompt(context?: ChatContext): string {
    let prompt = SYSTEM_INSTRUCTIONS;

    if (context) {
      // Add project information in a structured way
      prompt += "\n\nPROJECT CONTEXT:\n";
      prompt += "=================\n";
      
      // Group project information by category
      const projectGroups = {
        "Basic Project Information": [
          "projectDuration", "projectType", "companyScale", "projectPhase"
        ],
        "Team Structure": [
          "hasCyberLegalTeam", "hasITTeam", "securityTeamSize",
          "layer1Teams", "layer2Teams", "layer3Teams",
          "teamOverlap"
        ],
        "Technical Infrastructure": [
          "devicesWithFirewall", "networkType", "bmsIntegration",
          "cloudServices"
        ],
        "Security Measures": [
          "governanceLevel", "allowPasswordReuse", "usesMFA",
          "accessControl", "securityMonitoring", "incidentResponse",
          "backupStrategy", "securityCertifications", "securityAwareness"
        ],
        "Risk Factors": [
          "phishingFailRate", "regulatoryRequirements", "stakeholderCount",
          "thirdPartyVendors", "remoteWorkLevel", "thirdPartySecurityReq",
          "securityBudget", "dataClassification"
        ]
      };

      // Add each group of information
      for (const [group, fields] of Object.entries(projectGroups)) {
        prompt += `\n${group}:\n${"-".repeat(group.length + 1)}\n`;
        fields.forEach(field => {
          const value = context.projectInfo[field as keyof ProjectInfo];
          if (value && value !== '') {
            prompt += `${field}: ${value}\n`;
          }
        });
      }

      // Add risk assessment results with detailed formatting
      prompt += "\n\nRISK ASSESSMENT RESULTS:\n";
      prompt += "=======================\n";
      Object.entries(context.riskResults).forEach(([riskType, analysis]) => {
        prompt += `\n${riskType.toUpperCase()} RISK:\n`;
        prompt += `Risk Level: ${analysis.level.toUpperCase()}\n`;
        prompt += `Risk Score: ${analysis.score}%\n`;
        if (analysis.recommendations.length > 0) {
          prompt += "Recommendations:\n";
          analysis.recommendations.forEach(rec => {
            prompt += `- ${rec}\n`;
          });
        }
      });

      prompt += "\nINSTRUCTIONS FOR USING THIS CONTEXT:\n";
      prompt += "================================\n";
      prompt += "1. Reference specific project details when discussing risks and recommendations\n";
      prompt += "2. Consider how the team structure and technical setup influence each risk\n";
      prompt += "3. Tailor recommendations based on the current security measures in place\n";
      prompt += "4. Account for the project's scale and phase when prioritizing actions\n";
      prompt += "5. Consider regulatory requirements and third-party factors in your analysis\n";
      prompt += "\nIMPORTANT: This context has been updated. Please acknowledge any changes in risk levels or project details in your responses.";
    }

    return prompt;
  }

  async initialize(context?: ChatContext) {
    try {
      const contextHash = this.hashContext(context);
      
      // Only reinitialize if the context has changed
      if (contextHash === this.lastInitializedContext) {
        console.log('Context unchanged, skipping reinitialization');
        return true;
      }

      this.context = context;
      this.lastInitializedContext = contextHash;

      console.log('Initializing chatbot with new context:', context ? {
        projectType: context.projectInfo.projectType,
        companyScale: context.projectInfo.companyScale,
        projectPhase: context.projectInfo.projectPhase,
        riskScores: Object.entries(context.riskResults).map(([type, analysis]) => 
          `${type}: ${analysis.score}% (${analysis.level})`
        )
      } : 'No context provided');

      // Create a new chat with the system prompt including context
      this.chat = this.model.startChat({
        history: [{
          role: "user",
          parts: [{ text: this.buildSystemPrompt(context) }],
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      return true;
    } catch (error) {
      console.error("Error initializing chatbot:", error);
      return false;
    }
  }

  async sendMessage(message: string) {
    try {
      if (!this.chat) {
        throw new Error("Chat not initialized");
      }

      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  async getContext() {
    return {
      systemInstructions: this.buildSystemPrompt(this.context),
      context: this.context
    };
  }
}

export default ChatbotService; 