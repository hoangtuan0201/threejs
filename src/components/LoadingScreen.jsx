import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export default function LoadingScreen({ text = "Loading 3D Experience...", variant = "default", progress = null }) {
  const [logoHidden, setLogoHidden] = useState(false);
  const { theme, isDark } = useTheme();
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: variant === "compare"
          ? "linear-gradient(oklch(0.2 0.0122 237.44) 0px, oklch(0.36 0.0088 219.71) 100%)"
          : theme.gradients.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      {/* Logo */}
      {!logoHidden && (
        <Box
          sx={{
            mb: { xs: 3, sm: 4 },
            animation: `${fadeIn} 1s ease-out 0.2s both`,
          }}
        >
          <img
            src="/airsmart.svg"
            alt="AirSmart Logo"
            onError={() => setLogoHidden(true)}
            style={{
              width: "60px",
              height: "60px",
            }}
          />
        </Box>
      )}

      {/* Loading Spinner or Progress */}
      {progress === null ? (
        <Box
          sx={{
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            border: `3px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderTop: variant === "compare"
              ? "3px solid rgba(59, 130, 246, 0.8)"
              : `3px solid ${isDark ? 'rgba(100, 150, 255, 0.8)' : 'rgba(26, 35, 50, 0.8)'}`,
            borderRadius: "50%",
            animation: `${spin} 1s linear infinite`,
            mb: { xs: 2, sm: 3 },
          }}
        />
      ) : (
        <Box
          sx={{
            position: "relative",
            width: 80,
            height: 80,
            mb: { xs: 2, sm: 3 },
          }}
        >
          {(() => {
            const progressPercent = Math.max(0, Math.min(100, Math.round(progress * 100)));
            const circumference = 2 * Math.PI * 36; // radius = 36
            const strokeDashoffset = circumference - (progressPercent / 100) * circumference;
            
            return (
              <svg 
                width="80" 
                height="80" 
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: "rotate(-90deg)"
                }}
              >
                {/* Background circle */}
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                  strokeWidth="4"
                />
                
                {/* Progress circle */}
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke={variant === "compare" ? "rgba(59,130,246,0.9)" : (isDark ? "rgba(100,150,255,0.9)" : "rgba(26,35,50,0.9)")}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: "stroke-dashoffset 0.3s ease"
                  }}
                />
              </svg>
            );
          })()}
          
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.text.primary,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {`${Math.max(0, Math.min(100, Math.round(progress * 100)))}%`}
          </Box>
        </Box>
      )}

      {/* Loading Text */}
      <Typography
        variant="body2"
        sx={{
          color: theme.colors.text.secondary,
          fontSize: { xs: "0.8rem", sm: "0.9rem" },
          fontWeight: 400,
          letterSpacing: "1px",
          animation: `${fadeIn} 1s ease-out 0.5s both`,
          textAlign: "center",
          px: 2,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
