import { useState, useEffect } from "react";
import { Button } from '@mui/material';
import { useMobile } from "../hooks/useMobile";
import { useTheme } from '../theme/ThemeContext';

const MobileHomeButton = ({ onGoHome, resetViewFunction, isVisible = true }) => {
  const mobile = useMobile();
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Add CSS keyframes for animation - MUST be before any conditional returns
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInFromRight {
        0% {
          opacity: 0;
          transform: translateX(100px) scale(0.8);
        }
        100% {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
    `;
    if (!document.head.querySelector('style[data-mobile-home-button]')) {
      style.setAttribute('data-mobile-home-button', 'true');
      document.head.appendChild(style);
    }
  }, []);

  // Add entrance animation
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowButton(true), 500); // Delay to show after scene loads
      return () => clearTimeout(timer);
    } else {
      setShowButton(false);
    }
  }, [isVisible, mobile.isMobile]);

  const handleClick = () => {
    if (onGoHome) {
      onGoHome();
    }
  };

  // Only show on mobile and when visible
  if (!isVisible) return null;

  const containerStyle = {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 1500,
    opacity: showButton ? 1 : 0,
    animation: showButton ? "slideInFromRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) both" : "none",
    display: 'flex',
    gap: '10px',
    flexDirection: 'row'
  };

  const buttonBaseStyle = {
    background: theme.gradients.accent,
    color: theme.colors.text.inverse,
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    minWidth: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    }
  };

  return (
    <div style={containerStyle}>
      {/* Reset View Button */}
      {resetViewFunction && (
        <Button
          variant="contained"
          onClick={() => {
            if (resetViewFunction) {
              resetViewFunction();
            }
          }}
          sx={buttonBaseStyle}
          aria-label="Reset View"
        >
          {/* Reset Icon SVG */}
          <svg
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))" }}
          >
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
          {!mobile.isMobile && "Reset"}
        </Button>
      )}

      {/* Home Button */}
      <Button
        variant="contained"
        onClick={handleClick}
        sx={buttonBaseStyle}
        aria-label="Go to Homepage"
      >
        {/* Home Icon SVG */}
        <svg
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 24"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))" }}
        >
          <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
        </svg>
        {!mobile.isMobile && "Home"}
      </Button>
    </div>
  );
};

export default MobileHomeButton;
