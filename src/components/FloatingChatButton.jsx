import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Fab, Paper, Typography, TextField, IconButton, Stack, CircularProgress } from '@mui/material';
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { useMobile } from '../hooks/useMobile';
import { useTheme } from '../theme/ThemeContext';

const FloatingChatButton = ({ onFocusChange }) => {
  const { theme } = useTheme();
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
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);


  const scrollToBottom = () => {
    // Try multiple methods to ensure scrolling works
    if (messagesEndRef.current) {
      // Method 1: scrollIntoView
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });

      // Method 2: Direct scroll on container
      const messagesContainer = chatContainerRef.current?.querySelector('[data-messages-container]');
      if (messagesContainer) {
        setTimeout(() => {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Handle click outside to unfocus chat
  const handleClickOutside = useCallback((event) => {
    if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
      // User clicked outside chat - unfocus but don't close
      if (onFocusChange) {
        onFocusChange(false);
      }
    }
  }, [isOpen, onFocusChange]);

  // Focus chat when opened and handle scroll isolation
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.focus();
        }
      }, 100);

      // Notify parent that chat is focused
      if (onFocusChange) {
        onFocusChange(true);
      }



      // Add listener with slight delay to avoid immediate trigger
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
      }, 100);

      // Enhanced scroll isolation
      const handleWheel = (e) => {
        e.stopPropagation();
        e.preventDefault();

        // Find the scrollable messages container
        const messagesContainer = chatContainerRef.current?.querySelector('[data-messages-container]');
        if (messagesContainer) {
          const delta = e.deltaY;
          messagesContainer.scrollTop += delta;
        }
      };

      const handleTouchMove = (e) => {
        e.stopPropagation();
      };

      const chatElement = chatContainerRef.current;

      // Add event listeners with proper options
      chatElement.addEventListener('wheel', handleWheel, { passive: false, capture: true });
      chatElement.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });

      return () => {
        if (chatElement) {
          chatElement.removeEventListener('wheel', handleWheel, { capture: true });
          chatElement.removeEventListener('touchmove', handleTouchMove, { capture: true });
        }
        // Clean up click outside listeners
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    } else {
      // Notify parent that chat is no longer focused when closed
      if (onFocusChange) {
        onFocusChange(false);
      }
    }
  }, [isOpen, onFocusChange, handleClickOutside]);

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
      // Call the AI API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('https://ai-airsmart.onrender.com/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
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

      let errorMessage = 'I\'m sorry, I\'m having trouble connecting to the server right now. Please try again later.';

      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please try again with a shorter message.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.';
      }

      // Add error message
      const errorResponse = {
        type: 'bot',
        message: errorMessage,
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

  const handleChatClick = (e) => {
    // Ensure chat stays focused and scrollable
    e.stopPropagation();
    if (chatContainerRef.current) {
      chatContainerRef.current.focus();
    }
    // Re-focus chat when clicked
    if (onFocusChange) {
      onFocusChange(true);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: mobile.getResponsiveValue('20px', '24px', '32px'),
        right: mobile.getResponsiveValue('20px', '24px', '32px'),
        zIndex: 2000, // Higher than 3D scene and other UI elements
        pointerEvents: 'none', // Allow clicks to pass through container
        '& > *': {
          pointerEvents: 'auto', // But enable clicks on children
        },
      }}
    >
      {/* Chat Box - appears above the button */}
      {isOpen && (
        <Paper
          ref={chatContainerRef}
          elevation={12}
          tabIndex={0}
          onClick={handleChatClick}
          sx={{
            position: 'absolute',
            bottom: mobile.getResponsiveValue('80px', '90px', '100px'),
            right: 0,
            width: mobile.getResponsiveValue('300px', '350px', '380px'),
            height: mobile.getResponsiveValue('400px', '450px', '500px'),
            background: theme.gradients.primary,
            border: `1px solid ${theme.colors.border.light}`,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out',
            outline: 'none', // Remove focus outline
            // Ensure scroll isolation from 3D scene
            pointerEvents: 'auto',
            zIndex: 1700, // Higher than 3D scene
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
              background: theme.colors.background.overlay,
              borderBottom: `1px solid ${theme.colors.border.light}`,
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
                <Typography variant="subtitle2" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  AirSmart Assistant
                </Typography>
                <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                  {isLoading ? 'Thinking...' : 'Online'}
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => {
                setIsOpen(false);
                // Notify parent that chat is no longer focused
                if (onFocusChange) {
                  onFocusChange(false);
                }
              }}
              sx={{ color: theme.colors.text.secondary }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            data-messages-container
            sx={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              p: 1.5,
              pr: mobile.getResponsiveValue('1.5', '2', '2.5'), // Extra padding for scrollbar on desktop
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              // Enhanced scroll behavior
              position: 'relative',
              scrollBehavior: 'smooth',
              // Force scroll container
              minHeight: 0,
              maxHeight: '100%',
              // Enhanced hover effects for desktop scrollbar
              '&:hover': {
                '&::-webkit-scrollbar': {
                  width: mobile.getResponsiveValue('4px', '10px', '14px'), // Expand on hover
                },
                '&::-webkit-scrollbar-thumb': {
                  visibility: 'visible',
                  opacity: 1,
                  background: theme.isDark
                    ? 'rgba(255, 255, 255, 0.6)'
                    : 'rgba(0, 0, 0, 0.6)',
                },
                '&::-webkit-scrollbar-track': {
                  background: theme.isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.08)',
                },
              },
              // Enhanced scrollbar for desktop - always visible
              '&::-webkit-scrollbar': {
                width: mobile.getResponsiveValue('4px', '8px', '12px'), // Thicker on desktop
                backgroundColor: 'transparent',
                display: mobile.getResponsiveValue('none', 'block', 'block'), // Show on tablet/desktop
              },
              '&::-webkit-scrollbar-track': {
                background: theme.isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '5px',
                margin: '4px 0', // Add margin to track
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.isDark
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'rgba(0, 0, 0, 0.3)',
                borderRadius: '5px',
                border: theme.isDark
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: theme.isDark
                    ? 'rgba(255, 255, 255, 0.5)'
                    : 'rgba(0, 0, 0, 0.5)',
                  border: theme.isDark
                    ? '1px solid rgba(255, 255, 255, 0.2)'
                    : '1px solid rgba(0, 0, 0, 0.2)',
                },
                '&:active': {
                  background: theme.isDark
                    ? 'rgba(255, 255, 255, 0.7)'
                    : 'rgba(0, 0, 0, 0.7)',
                },
              },
              // Firefox scrollbar
              scrollbarWidth: mobile.getResponsiveValue('thin', 'auto', 'auto'),
              scrollbarColor: theme.isDark
                ? 'rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.05)',
              // Ensure scrolling works
              '&:focus': {
                outline: 'none',
              },
            }}
            tabIndex={0}
            onWheel={(e) => {
              // Enhanced wheel handling with debug
              e.stopPropagation();
              e.preventDefault();

              const container = e.currentTarget;
              const delta = e.deltaY;



              // Apply scroll
              container.scrollTop += delta * 0.5; // Reduce sensitivity
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
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
                      ? theme.gradients.accent
                      : chat.isError
                      ? theme.isDark
                        ? 'rgba(255, 86, 86, 0.2)'
                        : 'rgba(255, 86, 86, 0.1)'
                      : theme.isDark
                        ? theme.colors.background.secondary
                        : '#f8f9fa',
                    color: chat.type === 'user'
                      ? theme.colors.text.inverse
                      : theme.colors.text.primary,
                    border: `1px solid ${
                      chat.isError
                        ? theme.isDark
                          ? 'rgba(255, 86, 86, 0.3)'
                          : 'rgba(255, 86, 86, 0.2)'
                        : theme.colors.border.light
                    }`,
                    boxShadow: theme.isDark
                      ? 'none'
                      : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography variant="body2" sx={{
                    fontSize: '0.85rem',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                    color: chat.type === 'user' ? theme.colors.text.inverse : theme.colors.text.primary
                  }}>
                    {chat.message}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: chat.type === 'user'
                          ? 'rgba(255, 255, 255, 0.7)'
                          : theme.colors.text.tertiary,
                        fontSize: '0.65rem'
                      }}
                    >
                      {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    {chat.sourceCount > 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: chat.type === 'user'
                            ? 'rgba(255, 255, 255, 0.6)'
                            : theme.colors.text.tertiary,
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
                    background: theme.isDark
                      ? theme.colors.background.secondary
                      : '#f8f9fa',
                    border: `1px solid ${theme.colors.border.light}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    boxShadow: theme.isDark
                      ? 'none'
                      : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CircularProgress size={16} sx={{ color: theme.colors.text.secondary }} />
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', color: theme.colors.text.secondary }}>
                    AI is thinking...
                  </Typography>
                </Box>
              </Box>
            )}
            
            <div ref={messagesEndRef} />



            {/* Manual scroll to bottom button - for testing */}
            {chatHistory.length > 3 && (
              <Box
                sx={{
                  position: 'sticky',
                  bottom: 8,
                  right: 8,
                  alignSelf: 'flex-end',
                  zIndex: 10,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    const container = chatContainerRef.current?.querySelector('[data-messages-container]');
                    if (container) {
                      container.scrollTop = container.scrollHeight;
                    }
                  }}
                  sx={{
                    background: theme.colors.background.secondary,
                    color: theme.colors.text.secondary,
                    width: 24,
                    height: 24,
                    '&:hover': {
                      background: theme.colors.background.tertiary,
                    },
                  }}
                >
                  ↓
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 1.5,
              borderTop: `1px solid ${theme.colors.border.light}`,
              background: theme.colors.background.overlay,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                ref={inputRef}
                fullWidth
                multiline
                maxRows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                variant="outlined"
                size="small"
                disabled={isLoading}
                autoFocus={isOpen}
                onFocus={(e) => {
                  // Prevent focus from affecting 3D scene
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  // Ensure input stays focused
                  e.stopPropagation();
                  e.target.focus();
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: theme.colors.text.primary,
                    borderRadius: 1.5,
                    fontSize: '0.85rem',
                    backgroundColor: theme.isDark
                      ? theme.colors.background.tertiary
                      : '#ffffff',
                    '& fieldset': {
                      borderColor: theme.colors.border.medium,
                    },
                    '&:hover fieldset': {
                      borderColor: theme.colors.border.dark,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.isDark
                        ? theme.colors.text.primary
                        : theme.colors.primary[600],
                      borderWidth: '2px',
                    },
                    '&.Mui-disabled': {
                      color: theme.colors.text.tertiary,
                      backgroundColor: theme.colors.background.tertiary,
                      '& fieldset': {
                        borderColor: theme.colors.border.light,
                      },
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    '&::placeholder': {
                      color: theme.colors.text.tertiary,
                      fontSize: '0.85rem',
                      opacity: 0.8,
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                size="small"
                sx={{
                  background: theme.gradients.accent,
                  color: theme.colors.text.inverse,
                  width: 36,
                  height: 36,
                  '&:hover': {
                    background: theme.gradients.secondary,
                  },
                  '&:disabled': {
                    background: theme.colors.background.tertiary,
                    color: theme.colors.text.tertiary,
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={16} sx={{ color: theme.colors.text.tertiary }} />
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
          background: theme.gradients.accent,
          color: theme.colors.text.inverse,
          boxShadow: theme.shadows.lg,
          transition: theme.transitions.normal,
          border: `2px solid ${theme.colors.border.light}`,
          '&:hover': {
            background: theme.gradients.secondary,
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