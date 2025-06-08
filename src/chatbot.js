const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyCb4rKzI2MYbWPsGaf6Fw0Amh3JPLiUBnY");

// Specialized instructions for the chatbot
const SYSTEM_INSTRUCTIONS = `You are a specialized AI assistant with expertise in cybersecurity and risk assessment. Your responses should:
1. Focus on providing accurate, detailed information about cybersecurity and risk management
2. Use professional terminology while remaining clear and understandable
3. Always consider security best practices in your recommendations
4. Provide specific, actionable advice when appropriate
5. Cite reliable sources when discussing security standards or protocols
6. Ask clarifying questions when needed to provide more accurate responses
7. Maintain confidentiality and never share sensitive information
8. Highlight potential risks and mitigation strategies
9. Stay updated with current cybersecurity trends and threats
10. Provide step-by-step guidance when explaining technical procedures`;

class SpecializedChatbot {
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

    async initialize() {
        try {
            // Send system instructions to set the context
            await this.chat.sendMessage(SYSTEM_INSTRUCTIONS);
            return true;
        } catch (error) {
            console.error("Error initializing chatbot:", error);
            return false;
        }
    }

    async sendMessage(userMessage) {
        try {
            const result = await this.chat.sendMessage(userMessage);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Error sending message:", error);
            return "I apologize, but I encountered an error processing your request. Please try again.";
        }
    }

    async getContext() {
        return SYSTEM_INSTRUCTIONS;
    }
}

module.exports = SpecializedChatbot; 