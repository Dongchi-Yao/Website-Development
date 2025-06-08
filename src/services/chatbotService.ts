import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyCb4rKzI2MYbWPsGaf6Fw0Amh3JPLiUBnY");

// Specialized instructions for the risk analysis chatbot
const SYSTEM_INSTRUCTIONS = `You are a specialized AI assistant focused on cybersecurity risk analysis and assessment. Your responses should:
1. Analyze and explain risk assessment results in detail
2. Provide actionable recommendations for risk mitigation
3. Use professional cybersecurity terminology while remaining clear
4. Consider industry best practices and standards
5. Highlight critical security concerns and priorities
6. Provide step-by-step guidance for implementing security measures
7. Reference relevant compliance requirements when applicable
8. Maintain confidentiality of sensitive information
9. Ask clarifying questions when needed for better analysis
10. Stay focused on cybersecurity and risk management topics`;

class ChatbotService {
  private model;
  private chat;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
    this.chat = this.model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
  }

  async initialize(riskContext?: any) {
    try {
      // Send system instructions and risk context
      let contextPrompt = SYSTEM_INSTRUCTIONS;
      if (riskContext) {
        contextPrompt += "\n\nCurrent Risk Assessment Context:\n" + 
          Object.entries(riskContext)
            .map(([risk, analysis]: [string, any]) => 
              `${risk}: ${analysis.score}% (${analysis.level} risk) - ${analysis.recommendations.join(', ')}`)
            .join('\n');
      }
      await this.chat.sendMessage(contextPrompt);
      return true;
    } catch (error) {
      console.error("Error initializing chatbot:", error);
      return false;
    }
  }

  async sendMessage(message: string) {
    try {
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  async getContext() {
    return SYSTEM_INSTRUCTIONS;
  }
}

export default ChatbotService; 