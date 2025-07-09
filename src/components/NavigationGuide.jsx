import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMobile } from "../hooks/useMobile";
import SwipeIcon from '@mui/icons-material/Swipe';

const NavigationGuide = ({ isVisible, onClose }) => {
  const mobile = useMobile();
  const [showGuide, setShowGuide] = useState(false);

  // SVG Icon component
  const IconSVG = ({ type, size = 20 }) => {
    const iconProps = {
      width: size,
      height: size,
      fill: "currentColor",
      viewBox: "0 0 24 24"
    };

    switch (type) {
      case "mouse":
        return (
          <svg {...iconProps}>
            <path d="M12 2C10.34 2 9 3.34 9 5v6c0 1.66 1.34 3 3 3s3-1.34 3-3V5c0-1.66-1.34-3-3-3zm0 2c.55 0 1 .45 1 1v2h-2V5c0-.55.45-1 1-1zm-1 5h2v2c0 .55-.45 1-1 1s-1-.45-1-1V9z"/>
          </svg>
        );
      case "keyboard":
        return (
          <svg {...iconProps}>
            <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>
          </svg>
        );
      case "target":
        return (
          <svg {...iconProps}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        );
      case "settings":
        return (
          <svg {...iconProps}>
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
          </svg>
        );
      case "escape":
        return (
          <svg {...iconProps}>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        );
      case "touch":
        return <SwipeIcon style={{ fontSize: size, color: "currentColor" }} />;
      case "drag":
        return (
          <svg {...iconProps}>
            <path d="M20 9H15l3.5-3.5c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L12 9.17 6.91 4.09c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L9 9H4c-.55 0-1 .45-1 1s.45 1 1 1h5l-3.5 3.5c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 14.83l5.09 5.08c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L15 15h5c.55 0 1-.45 1-1s-.45-1-1-1z"/>
          </svg>
        );
      default:
        return (
          <svg {...iconProps}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
    }
  };

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => setShowGuide(true), 100);
      // Khóa scroll khi NavigationGuide hiện ra
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      return () => clearTimeout(timer);
    } else {
      setShowGuide(false);
      // Mở khóa scroll khi NavigationGuide ẩn đi
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }, [isVisible]);

  const handleClose = () => {
    setShowGuide(false);
    setTimeout(() => onClose(), 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.85)",
      backdropFilter: "blur(15px)",
      zIndex: 1300, // Lower z-index to not block hotspot labels
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: showGuide ? 1 : 0,
      transition: "all 0.4s ease",
      // Mobile-specific improvements
      WebkitBackdropFilter: "blur(15px)", // Safari support
      touchAction: "none", // Prevent scrolling behind modal
    },
    container: {
      background: "#fff",
      borderRadius: mobile.isMobile ? "8px" : "10px",
      padding: mobile.isMobile ? "12px" : "20px",
      maxWidth: mobile.isMobile ? "90vw" : "440px",
      width: mobile.isMobile ? "90%" : "100%",
      maxHeight: mobile.isMobile ? "auto" : "90vh",
      overflowY: mobile.isMobile ? "visible" : "auto",
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      border: "1px solid #ececec",
      position: "relative",
      animation: showGuide
        ? mobile.isMobile
          ? "slideInFromBottom 0.5s cubic-bezier(0.4, 0, 0.2, 1) both"
          : "bounceIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) both"
        : 'none',
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    header: {
      textAlign: "center",
      marginBottom: mobile.isMobile ? "20px" : "20px",
      animation: showGuide ? "fadeInUp 0.6s ease-out 0.2s both" : 'none',
    },
    title: {
      fontSize: mobile.isMobile ? "24px" : "28px",
      fontWeight: "800",
      color: "#1a1a1a",
      margin: 0,
      textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      letterSpacing: "-0.02em",
    },
    subtitle: {
      fontSize: mobile.isMobile ? "15px" : "16px",
      color: "#6c757d",
      marginTop: mobile.isMobile ? "8px" : "12px",
      fontWeight: "500",
      animation: showGuide ? "fadeInUp 0.6s ease-out 0.3s both" : 'none',
    },
    content: {
      display: "flex",
      flexDirection: mobile.isMobile ? "column" : "row",
      gap: mobile.isMobile ? "8px" : "16px",
      justifyContent: mobile.isMobile ? undefined : "center",
      alignItems: mobile.isMobile ? undefined : "flex-start",
    },
    column: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      flex: 1,
    },
    instructionItem: {
      display: "flex",
      alignItems: "center",
      gap: mobile.isMobile ? "8px" : "12px",
      padding: mobile.isMobile ? "10px" : "16px 18px",
      background: "#f7f7f7",
      borderRadius: mobile.isMobile ? "6px" : "5px",
      border: "1px solid #ececec",
      boxShadow: "none",
      cursor: mobile.isMobile ? "default" : "pointer",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      transformStyle: mobile.isMobile ? "flat" : "preserve-3d",
      WebkitTapHighlightColor: "transparent",
      touchAction: "manipulation",
      minHeight: mobile.isMobile ? undefined : "90px",
      flex: 1,
    },
    icon: {
      width: mobile.isMobile ? "36px" : "40px",
      height: mobile.isMobile ? "36px" : "40px",
      background: "#fff",
      borderRadius: mobile.isMobile ? "6px" : "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: mobile.isMobile ? "18px" : "20px",
      fontWeight: "bold",
      color: "#1a1a1a",
      flexShrink: 0,
      border: "1px solid #ececec",
      boxShadow: "none",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      transformStyle: mobile.isMobile ? "flat" : "preserve-3d",
      WebkitTapHighlightColor: "transparent",
    },
    text: {
      color: "#2c3e50",
      fontSize: mobile.isMobile ? "16px" : "18px",
      fontWeight: "600",
      lineHeight: "1.5",
      textShadow: "0 1px 2px rgba(255, 255, 255, 0.8)",
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      letterSpacing: "-0.01em",
    },
    closeButton: {
      position: "absolute",
      top: mobile.isMobile ? "16px" : "20px",
      right: mobile.isMobile ? "16px" : "20px",
      width: mobile.isMobile ? "36px" : "40px",
      height: mobile.isMobile ? "36px" : "40px",
      background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #e9ecef 100%)",
      border: "1px solid rgba(0, 0, 0, 0.08)",
      borderRadius: "50%",
      color: "#6c757d",
      fontSize: mobile.isMobile ? "16px" : "18px",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      transformStyle: "preserve-3d",
    },
    footer: {
      marginTop: mobile.isMobile ? "24px" : "28px",
      textAlign: "center",
      animation: showGuide ? "fadeInUp 0.6s ease-out 0.8s both" : 'none',
    },
   
    keysContainer: {
      display: "flex",
      gap: mobile.isMobile ? "6px" : "8px",
      marginTop: mobile.isMobile ? "6px" : "8px",
      flexWrap: "wrap",
    },
    keyBadge: {
      background: "#fff",
      border: "1px solid #ececec",
      borderRadius: mobile.isMobile ? "6px" : "5px",
      padding: mobile.isMobile ? "4px 10px" : "5px 14px",
      fontSize: mobile.isMobile ? "12px" : "13px",
      fontWeight: "600",
      color: "#6c757d",
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
      textShadow: "none",
      boxShadow: "none",
      transition: "all 0.2s ease",
      minHeight: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }
  };

  const instructions = mobile.isMobile ? [
    {
      iconType: "touch",
      text: "Swipe up/down to navigate between scenes",
      keys: ["SWIPE"]
    },
   {
      iconType: "settings",
      text: "Adjust scroll speed in top-right corner",
      keys: ["SLOW", "FAST"]
    }
    
  ] : [
    {
      iconType: "mouse",
      text: "Scroll up/down to navigate through scenes",
      keys: ["SCROLL"]
    },
    {
      iconType: "keyboard",
      text: "Use arrow keys for precise movement",
      keys: ["← →"]
    },
    
  
    {
      iconType: "settings",
      text: "Adjust scroll speed in top-right corner",
      keys: ["SLOW", "FAST"]
    },
    {
      iconType: "escape",
      text: "Press ESC key to exit explore mode",
      keys: ["ESC"]
    }
  ];

  return createPortal(
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          style={styles.closeButton}
          onClick={handleClose}
          onMouseEnter={!mobile.isMobile ? (e) => {
            e.target.style.background = "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)";
            e.target.style.transform = "scale(1.1) translateZ(4px) rotateX(5deg)";
            e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)";
            e.target.style.color = "#dc3545";
          } : undefined}
          onMouseLeave={!mobile.isMobile ? (e) => {
            e.target.style.background = "linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #e9ecef 100%)";
            e.target.style.transform = "scale(1) translateZ(0) rotateX(0deg)";
            e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)";
            e.target.style.color = "#6c757d";
          } : undefined}
        >
          ✕
        </button>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Navigation Guide</h2>
        </div>

        {/* Instructions */}
        <div style={styles.content}>
          {mobile.isMobile ? (
            instructions.map((instruction, index) => (
              <div
                key={index}
                style={{
                  ...styles.instructionItem,
                  animation: showGuide ? `fadeInUp 0.5s ease-out ${index * 0.1 + 0.4}s both` : 'none',
                }}
                onMouseEnter={!mobile.isMobile ? (e) => {
                  e.stopPropagation();
                  const currentTarget = e.currentTarget;
                  currentTarget.style.transform = "translateY(-4px) translateZ(8px) rotateX(2deg)";
                  currentTarget.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.12), 0 5px 15px rgba(0, 0, 0, 0.08)";
                  currentTarget.style.background = "rgba(0, 0, 0, 0.04)";

                  // Icon 3D effect
                  const icon = currentTarget.querySelector('.instruction-icon');
                  if (icon) {
                    icon.style.transform = "translateZ(12px) rotateY(5deg) scale(1.05)";
                    icon.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)";
                  }
                } : undefined}
                onMouseLeave={!mobile.isMobile ? (e) => {
                  e.stopPropagation();
                  const currentTarget = e.currentTarget;
                  currentTarget.style.transform = "translateY(0) translateZ(0) rotateX(0deg)";
                  currentTarget.style.boxShadow = "none";
                  currentTarget.style.background = "rgba(0, 0, 0, 0.02)";

                  // Reset icon
                  const icon = currentTarget.querySelector('.instruction-icon');
                  if (icon) {
                    icon.style.transform = "translateZ(0) rotateY(0deg) scale(1)";
                    icon.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)";
                  }
                } : undefined}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={styles.icon} className="instruction-icon">
                  <IconSVG type={instruction.iconType} size={mobile.isMobile ? 24 : 26} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.text}>
                    {instruction.text}
                  </div>
                  {instruction.keys && (
                    <div style={styles.keysContainer}>
                      {instruction.keys.map((key, keyIndex) => (
                        <span key={keyIndex} style={styles.keyBadge}>
                          {key}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            // PC: luôn chia 2 cột, mỗi cột 2 mục, các item luôn bằng nhau
            <div style={{ display: "flex", gap: "18px", width: "100%", alignItems: "stretch" }}>
              {[0, 1].map(col => (
                <div key={col} style={{ display: "flex", flexDirection: "column", gap: "18px", flex: 1 }}>
                  {instructions.slice(col * 2, col * 2 + 2).map((instruction, index) => (
                    <div
                      key={index}
                      style={{ ...styles.instructionItem, animation: showGuide ? `fadeInUp 0.5s ease-out ${(col * 2 + index) * 0.1 + 0.4}s both` : 'none', height: "100%" }}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        const currentTarget = e.currentTarget;
                        currentTarget.style.transform = "translateY(-4px) translateZ(8px) rotateX(2deg)";
                        currentTarget.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.12), 0 5px 15px rgba(0, 0, 0, 0.08)";
                        currentTarget.style.background = "rgba(0, 0, 0, 0.04)";
                        const icon = currentTarget.querySelector('.instruction-icon');
                        if (icon) {
                          icon.style.transform = "translateZ(12px) rotateY(5deg) scale(1.05)";
                          icon.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        const currentTarget = e.currentTarget;
                        currentTarget.style.transform = "translateY(0) translateZ(0) rotateX(0deg)";
                        currentTarget.style.boxShadow = "none";
                        currentTarget.style.background = "rgba(0, 0, 0, 0.02)";
                        const icon = currentTarget.querySelector('.instruction-icon');
                        if (icon) {
                          icon.style.transform = "translateZ(0) rotateY(0deg) scale(1)";
                          icon.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)";
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={styles.icon} className="instruction-icon">
                        <IconSVG type={instruction.iconType} size={26} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={styles.text}>
                          {instruction.text}
                        </div>
                        {instruction.keys && (
                          <div style={styles.keysContainer}>
                            {instruction.keys.map((key, keyIndex) => (
                              <span key={keyIndex} style={styles.keyBadge}>
                                {key}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
};

export default NavigationGuide;
