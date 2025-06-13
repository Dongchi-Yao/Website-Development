import React, { useEffect, useState } from 'react';
import ChatbotService from '../services/chatbotService';
import type { ProjectInfo, RiskResults, Message, Conversation } from '../services/chatbotService';

const RiskQuantification: React.FC = () => {
  const [chatbotService, setChatbotService] = useState<ChatbotService | null>(null);
  const [isChatInitialized, setIsChatInitialized] = useState(false);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectDuration: '',
    projectType: '',
    hasCyberLegalTeam: '',
    companyScale: '',
    projectPhase: '',
    layer1Teams: '',
    layer2Teams: '',
    layer3Teams: '',
    layer4Teams: '',
    layer5Teams: '',
    layer6Teams: '',
    layer7Teams: '',
    layer8Teams: '',
    teamOverlap: '',
    hasITTeam: '',
    devicesWithFirewall: '',
    networkType: '',
    phishingFailRate: '',
    governanceLevel: '',
    allowPasswordReuse: '',
    usesMFA: '',
    regulatoryRequirements: '',
    stakeholderCount: '',
    thirdPartyVendors: '',
    remoteWorkLevel: '',
    cloudServices: '',
    dataClassification: '',
    bmsIntegration: '',
    accessControl: '',
    securityMonitoring: '',
    incidentResponse: '',
    backupStrategy: '',
    securityCertifications: '',
    securityAwareness: '',
    securityTeamSize: '',
    thirdPartySecurityReq: '',
    securityBudget: ''
  });
  const [riskResults, setRiskResults] = useState<RiskResults>({
    ransomware: { score: 0, level: 'low', recommendations: [] },
    phishing: { score: 0, level: 'low', recommendations: [] },
    dataBreach: { score: 0, level: 'low', recommendations: [] },
    insiderAttack: { score: 0, level: 'low', recommendations: [] },
    supplyChain: { score: 0, level: 'low', recommendations: [] }
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);

  const isFormComplete = () => {
    // Check if project info has any non-empty values
    const hasProjectInfo = Object.values(projectInfo).some(value => value !== '');

    // Check if risk results have any non-zero scores or non-empty recommendations
    const hasRiskResults = Object.values(riskResults).some(
      risk => risk.score > 0 || risk.recommendations.length > 0
    );

    return hasProjectInfo && hasRiskResults;
  };

  // Initialize chatbot when component mounts or risk results change
  useEffect(() => {
    const initializeChat = async () => {
      // Create new service if it doesn't exist
      if (!chatbotService) {
        const service = new ChatbotService();
        setChatbotService(service);
      }

      // Initialize or reinitialize with current context if we have complete data
      if (isFormComplete()) {
        const service = chatbotService || new ChatbotService();
        const success = await service.initialize({
          projectInfo,
          riskResults
        });
        setIsChatInitialized(success);

        // If this is the first initialization, create initial conversation
        if (success && conversations.length === 0) {
          const initialConversation: Conversation = {
            id: 1,
            title: 'Risk Analysis Chat',
            messages: [{
              id: 1,
              text: "Hello! I'm your AI risk analysis assistant. I can help you understand your cyber risk assessment results and provide guidance on improving your security posture. What would you like to know?",
              sender: 'ai',
              timestamp: new Date(),
            }],
            lastUpdated: new Date(),
          };
          setConversations([initialConversation]);
          setCurrentConversationId(1);
        }
      }
    };

    initializeChat();
  }, [riskResults]); // Only depend on riskResults changes

  // Handle new chat initialization
  const handleNewChat = async () => {
    if (!chatbotService) return;

    const newConversation: Conversation = {
      id: conversations.length + 1,
      title: 'Risk Analysis Chat',
      messages: [],
      lastUpdated: new Date(),
    };

    try {
      // Reinitialize the chatbot with current context
      await chatbotService.initialize(
        isFormComplete() ? {
          projectInfo,
          riskResults
        } : undefined
      );

      // Add initial AI message
      const initialMessage: Message = {
        id: 1,
        text: "Hello! I'm your AI risk analysis assistant. I can help you understand your cyber risk assessment results and provide guidance on improving your security posture. What would you like to know?",
        sender: 'ai',
        timestamp: new Date(),
      };

      newConversation.messages.push(initialMessage);
      
      setConversations([...conversations, newConversation]);
      setCurrentConversationId(newConversation.id);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default RiskQuantification; 