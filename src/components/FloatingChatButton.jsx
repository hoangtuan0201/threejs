import { useState, useRef, useEffect } from 'react';
import { Box, Fab, Paper, Typography, TextField, IconButton, Stack, CircularProgress } from '@mui/material';
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { useMobile } from '../hooks/useMobile';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    
    // Add user message
    const userMessageObj = {
      type: 'user',
      message: userMessage,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessageObj]);
    setMessage('');
    setIsLoading(true);

    try {
      // Call the AI API
      const response = await fetch('https://ai-airsmart.onrender.com/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add bot response
      const botResponse = {
        type: 'bot',
        message: data.answer || 'I apologize, but I couldn\'t process your request at the moment.',
        timestamp: new Date(),
        sourceCount: data.source_count || 0
      };
      
      setChatHistory(prev => [...prev, botResponse]);
      
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      // Add error message
      const errorResponse = {
        type: 'bot',
        message: 'I\'m sorry, I\'m having trouble connecting to the server right now. Please try again later.',
        timestamp: new Date(),
        isError: true
      };
      
      setChatHistory(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
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
                  color: 'white',
                }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                  AirSmart Assistant
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {isLoading ? 'Thinking...' : 'Online'}
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
                      : chat.isError
                      ? 'rgba(255, 86, 86, 0.2)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: `1px solid ${chat.isError ? 'rgba(255, 86, 86, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
                    {chat.message}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.65rem'
                      }}
                    >
                      {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    {chat.sourceCount > 0 && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.4)',
                          fontSize: '0.6rem',
                          fontStyle: 'italic'
                        }}
                      >
                        {chat.sourceCount} sources
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <CircularProgress size={16} sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    AI is thinking...
                  </Typography>
                </Box>
              </Box>
            )}
            
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
                disabled={isLoading}
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
                    '&.Mui-disabled': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
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
                disabled={!message.trim() || isLoading}
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
                {isLoading ? (
                  <CircularProgress size={16} sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                ) : (
                  <SendIcon fontSize="small" />
                )}
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
              color: 'white',
            }}
          />
        )}
      </Fab>
    </Box>
  );
};

export default FloatingChatButton;