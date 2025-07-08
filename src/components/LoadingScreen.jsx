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

export default function LoadingScreen({ text = "Loading 3D Experience...", variant = "default" }) {
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
          : "linear-gradient(135deg, #1a2332 0%, #0f1419 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          mb: { xs: 3, sm: 4 },
          animation: `${fadeIn} 1s ease-out 0.2s both`,
        }}
      >
        <img
          src="/airsmart.svg"
          alt="AirSmart Logo"
          style={{
            width: "60px",
            height: "60px",
          }}
        />
      </Box>

      {/* Loading Spinner */}
      <Box
        sx={{
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
          border: "3px solid rgba(255, 255, 255, 0.1)",
          borderTop: variant === "compare"
            ? "3px solid rgba(59, 130, 246, 0.8)"
            : "3px solid rgba(100, 150, 255, 0.8)",
          borderRadius: "50%",
          animation: `${spin} 1s linear infinite`,
          mb: { xs: 2, sm: 3 },
        }}
      />

      {/* Loading Text */}
      <Typography
        variant="body2"
        sx={{
          color: "rgba(255, 255, 255, 0.6)",
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
