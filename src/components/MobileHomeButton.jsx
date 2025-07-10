import { useState, useEffect } from "react";
import { useMobile } from "../hooks/useMobile";

const MobileHomeButton = ({ onGoHome, isVisible = true }) => {
  const mobile = useMobile();
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

  const styles = {
    button: {
      position: "fixed",
      top: "20px",
      right: "20px",
      width: "auto",
      minWidth: "80px",
      height: "48px",
      padding: "0 16px",
      background: "linear-gradient(135deg, #1a1a1a 0%, #2c3e50 50%, #34495e 100%)",
      border: "2px solid rgba(255, 255, 255, 0.15)",
      borderRadius: "24px",
      color: "white",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      zIndex: 1500, // Below NavigationGuide but above other elements
      boxShadow: isPressed
        ? "0 4px 15px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.15)"
        : "0 12px 35px rgba(0, 0, 0, 0.2), 0 6px 15px rgba(0, 0, 0, 0.15)",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      backdropFilter: "blur(15px)",
      WebkitBackdropFilter: "blur(15px)",
      WebkitTapHighlightColor: "transparent",
      touchAction: "manipulation",
      transform: isPressed ? "scale(0.92) translateY(2px)" : "scale(1) translateY(0)",
      // Add subtle glow effect
      filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.1))",
      // Entrance animation
      opacity: showButton ? 1 : 0,
      animation: showButton ? "slideInFromRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) both" : "none",
    },
    text: {
      fontSize: "14px",
      fontWeight: "600",
      letterSpacing: "0.5px",
      textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
    }
  };

  return (
    <button
      style={styles.button}
      onClick={handleClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
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
        <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
        <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" opacity="0.3" transform="translate(0.5, 0.5)"/>
      </svg>

      {/* Home Text */}
      <span style={styles.text}>Home</span>
    </button>
  );
};

export default MobileHomeButton;
