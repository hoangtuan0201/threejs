import { useState, useRef, useEffect } from 'react';
import { Box, Fab, Paper, Typography, TextField, IconButton, Stack } from '@mui/material';
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { useMobile } from '../hooks/useMobile';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'bot',
      message: 'Hi! How can I help you with AirSmart systems?',
      timestamp: new Date()
    }
  ]);
  
  const mobile = useMobile();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      message: message.trim(),
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        message: getBotResponse(message.trim()),
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, botResponse]);
    }, 1000);

    setMessage('');
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('thermostat') || lowerMessage.includes('temperature')) {
      return 'Our smart thermostat uses AI to learn your preferences and optimize energy efficiency.';
    }
    
    if (lowerMessage.includes('air purification') || lowerMessage.includes('filter')) {
      return 'Advanced HEPA H13 filtration with UV-C sterilization and real-time air quality monitoring.';
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'Please contact our sales team for custom quotes tailored to your needs.';
    }
    
    if (lowerMessage.includes('installation')) {
      return 'Professional installation takes 4-6 hours with 5-year warranty included.';
    }
    
    return 'Thanks for your question! Our AirSmart systems offer cutting-edge climate control technology.';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: mobile.getResponsiveValue('20px', '24px', '32px'),
        right: mobile.getResponsiveValue('20px', '24px', '32px'),
        zIndex: 1600,
      }}
    >
      {/* Chat Box - appears above the button */}
      {isOpen && (
        <Paper
          elevation={12}
          sx={{
            position: 'absolute',
            bottom: mobile.getResponsiveValue('80px', '90px', '100px'),
            right: 0,
            width: mobile.getResponsiveValue('300px', '350px', '380px'),
            height: mobile.getResponsiveValue('400px', '450px', '500px'),
            background: 'linear-gradient(135deg, #1a2332 0%, #0f1419 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out',
            '@keyframes slideUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px) scale(0.95)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
              }
            }
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <img
                src="/airsmart.svg"
                alt="AirSmart"
                style={{
                  width: '24px',
                  height: '24px',
                  filter: 'brightness(0) invert(1)',
                }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                  AirSmart Assistant
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Online
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '2px',
              },
            }}
          >
            {chatHistory.map((chat, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: chat.type === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '75%',
                    p: 1.5,
                    borderRadius: 2,
                    background: chat.type === 'user' 
                      ? 'linear-gradient(135deg, #444 0%, #666 50%, #444 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                    {chat.message}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.5)',
                      display: 'block',
                      mt: 0.5,
                      fontSize: '0.65rem'
                    }}
                  >
                    {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 1.5,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    borderRadius: 1.5,
                    fontSize: '0.85rem',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '0.85rem',
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!message.trim()}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #444 0%, #666 50%, #444 100%)',
                  color: 'white',
                  width: 36,
                  height: 36,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #555 0%, #777 50%, #555 100%)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      )}

      {/* Floating Chat Button */}
      <Fab
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          width: mobile.getResponsiveValue('56px', '64px', '64px'),
          height: mobile.getResponsiveValue('56px', '64px', '64px'),
          background: 'linear-gradient(135deg, #444 0%, #666 50%, #444 100%)',
          color: 'white',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #555 0%, #777 50%, #555 100%)',
            transform: 'scale(1.05)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          },
          // Add notification dot when closed
          '&::after': isOpen ? {} : {
            content: '""',
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '12px',
            height: '12px',
            background: '#ff4444',
            borderRadius: '50%',
            border: '2px solid white',
            animation: 'pulse 2s infinite',
          },
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '50%': {
              transform: 'scale(1.2)',
              opacity: 0.7,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1,
            }
          }
        }}
      >
        {isOpen ? (
          <CloseIcon sx={{ fontSize: mobile.getResponsiveValue('24px', '28px', '28px') }} />
        ) : (
          <img
            src="/airsmart.svg"
            alt="AirSmart Chat"
            style={{
              width: mobile.getResponsiveValue('28px', '32px', '32px'),
              height: mobile.getResponsiveValue('28px', '32px', '32px'),
              filter: 'brightness(0) invert(1)',
            }}
          />
        )}
      </Fab>
    </Box>
  );
};

export default FloatingChatButton;