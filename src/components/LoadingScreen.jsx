import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/system";

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

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #1a2332 0%, #0f1419 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        animation: `${fadeIn} 0.5s ease-out`,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          mb: 4,
          animation: `${fadeIn} 1s ease-out 0.2s both`,
        }}
      >
        <img 
          src="/airsmart.svg" 
          alt="AirSmart Logo" 
          style={{
            width: "80px",
            height: "80px",
          }}
        />
      </Box>

      {/* Loading Spinner */}
      <Box
        sx={{
          width: 40,
          height: 40,
          border: "3px solid rgba(255, 255, 255, 0.1)",
          borderTop: "3px solid rgba(100, 150, 255, 0.8)",
          borderRadius: "50%",
          animation: `${spin} 1s linear infinite`,
          mb: 3,
        }}
      />

      {/* Loading Text */}
      <Typography
        variant="body2"
        sx={{
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: "0.9rem",
          fontWeight: 400,
          letterSpacing: "1px",
          animation: `${fadeIn} 1s ease-out 0.5s both`,
        }}
      >
        Loading 3D Experience...
      </Typography>
    </Box>
  );
}
