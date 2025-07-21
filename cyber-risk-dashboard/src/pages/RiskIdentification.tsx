import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Drawer,
} from '@mui/material';
import { motion } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import DownloadIcon from '@mui/icons-material/Download';
import { jsPDF } from 'jspdf';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Conversation {
  id: number;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

const RiskIdentification = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      title: 'New Conversation',
      messages: [{
        id: 1,
        text: "Hello! I'm your AI risk identification assistant. I can help you identify potential cyber risks in your construction project. What would you like to know?",
        sender: 'ai',
        timestamp: new Date(),
      }],
      lastUpdated: new Date(),
    }
  ]);
  const [currentConversationId, setCurrentConversationId] = useState(1);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Add new state for risk probabilities
  const [riskProbabilities, setRiskProbabilities] = useState<{
    ransomware: number;
    phishing: number;
    dataBreach: number;
    insiderAttack: number;
    supplyChain: number;
  } | null>(null);

  // Subscribe to risk probability updates
  useEffect(() => {
          const eventSource = new EventSource('/api/risk/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRiskProbabilities(data);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const currentConversation = conversations.find(conv => conv.id === currentConversationId);

  const handleSend = () => {
    if (!input.trim() || !currentConversation) return;

    const newMessage: Message = {
      id: currentConversation.messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastUpdated: new Date(),
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: currentConversation.messages.length + 2,
        text: "I'm analyzing your input. This is a simulated response. In the actual implementation, this would be connected to an AI model for real risk analysis.",
        sender: 'ai',
        timestamp: new Date(),
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, aiResponse],
            lastUpdated: new Date(),
          };
        }
        return conv;
      }));
    }, 1000);
  };

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: conversations.length + 1,
      title: 'New Conversation',
      messages: [{
        id: 1,
        text: "Hello! I'm your AI risk identification assistant. I can help you identify potential cyber risks in your construction project. What would you like to know?",
        sender: 'ai',
        timestamp: new Date(),
      }],
      lastUpdated: new Date(),
    };
    setConversations([...conversations, newConversation]);
    setCurrentConversationId(newConversation.id);
  };

  const handleExportChat = () => {
    if (!currentConversation) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let yOffset = 20;

    // Add header with logo and title
    doc.setFillColor(25, 118, 210); // Primary blue color
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Add title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Identification Chat Export', pageWidth / 2, 25, { align: 'center' });
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 35, { align: 'center' });
    
    // Reset text color for content
    doc.setTextColor(0, 0, 0);
    yOffset = 60;

    // Add conversation content
    currentConversation.messages.forEach((message, index) => {
      const sender = message.sender === 'user' ? 'You' : 'AI Assistant';
      const timestamp = message.timestamp.toLocaleString();
      
      // Add message header
      if (message.sender === 'user') {
        doc.setFillColor(25, 118, 210); // Blue for user
      } else {
        doc.setFillColor(66, 66, 66); // Gray for AI
      }
      doc.roundedRect(margin, yOffset, contentWidth, 15, 3, 3, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(sender, margin + 5, yOffset + 10);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(timestamp, pageWidth - margin - 5, yOffset + 10, { align: 'right' });
      
      yOffset += 20;

      // Add message content
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(message.text, contentWidth - 10);
      doc.text(splitText, margin + 5, yOffset);
      yOffset += splitText.length * 7 + 15;

      // Add separator line
      if (index < currentConversation.messages.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yOffset, pageWidth - margin, yOffset);
        yOffset += 10;
      }

      // Add new page if needed
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });

    // Add footer
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`risk-identification-chat-${currentConversation.id}.pdf`);
  };

  // Add risk probability display component
  const RiskProbabilityDisplay = () => {
    if (!riskProbabilities) return null;

    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Risk Levels
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {Object.entries(riskProbabilities).map(([risk, probability]) => (
            <Chip
              key={risk}
              label={`${risk}: ${Math.round(probability * 100)}%`}
              color={probability > 0.7 ? 'error' : probability > 0.4 ? 'warning' : 'success'}
              sx={{ fontWeight: 'bold' }}
            />
          ))}
        </Box>
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3" component="h1">
            Risk Identification
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleNewChat}
            >
              New Chat
            </Button>
            <Button
              variant="outlined"
              startIcon={<HistoryIcon />}
              onClick={() => setIsSidebarOpen(true)}
            >
              History
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportChat}
            >
              Export Chat
            </Button>
          </Box>
        </Box>

        <RiskProbabilityDisplay />

        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ flex: '2' }}>
            <Paper elevation={3} sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">Risk Identification Chat</Typography>
              </Box>
              
              <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {currentConversation?.messages.map((message) => (
                  <ListItem
                    key={message.id}
                    sx={{
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main' }}>
                        {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                        color: message.sender === 'user' ? 'white' : '#000',
                        '& .MuiTypography-root': {
                          color: message.sender === 'user' ? 'white' : '#000',
                        },
                      }}
                    >
                      <Typography variant="body1" sx={message.sender === 'ai' ? { color: '#000' } : {}}>{message.text}</Typography>
                      <Typography variant="caption" color={message.sender === 'user' ? 'grey.300' : 'text.secondary'}>
                        {message.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </ListItem>
                ))}
              </List>

              <Divider />
              
              <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<SendIcon />}
                      onClick={handleSend}
                      sx={{ height: '100%' }}
                    >
                      Send
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ flex: '1' }}>
            <Paper elevation={3} sx={{ p: 3, height: '600px', overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Risk Categories
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Common Construction Cyber Risks:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {[
                    'Data Breaches',
                    'Ransomware',
                    'IoT Vulnerabilities',
                    'Supply Chain',
                    'Phishing',
                    'Access Control',
                    'Network Security',
                    'Compliance',
                  ].map((risk) => (
                    <Chip
                      key={risk}
                      label={risk}
                      variant="outlined"
                      onClick={() => setInput(`Tell me about ${risk} risks`)}
                    />
                  ))}
                </Box>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Suggested Questions:
              </Typography>
              <List>
                {[
                  'What are the most common cyber risks in construction?',
                  'How can I protect my project data?',
                  'What IoT security measures should I implement?',
                  'How do I assess supply chain cyber risks?',
                ].map((question, index) => (
                  <ListItem
                    key={index}
                    sx={{ py: 1, cursor: 'pointer' }}
                    onClick={() => setInput(question)}
                  >
                    <ListItemText primary={question} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>

        <Drawer
          anchor="right"
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        >
          <Box sx={{ width: 350, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Previous Conversations
            </Typography>
            <List>
              {conversations.map((conversation) => (
                <ListItem
                  key={conversation.id}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: conversation.id === currentConversationId ? 'action.selected' : 'transparent',
                  }}
                  onClick={() => {
                    setCurrentConversationId(conversation.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <ListItemText
                    primary={conversation.title}
                    secondary={conversation.lastUpdated.toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </motion.div>
    </Container>
  );
};

export default RiskIdentification; 