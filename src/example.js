const SpecializedChatbot = require('./chatbot');

async function main() {
    // Create a new instance of the chatbot
    const chatbot = new SpecializedChatbot();
    
    // Initialize the chatbot with specialized instructions
    await chatbot.initialize();
    
    // Example usage
    try {
        // Example question about cybersecurity
        const response = await chatbot.sendMessage(
            "What are the key components of a robust cybersecurity strategy for a small business?"
        );
        console.log("Chatbot Response:", response);
        
    } catch (error) {
        console.error("Error in main:", error);
    }
}

main(); 