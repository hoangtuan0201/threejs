import { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import ColorModeSelect from "../theme/ColorModeSelect.jsx";
import FileManagerPopup from "../components/FileManagerPopup";
import MoreFeaturesDialog from '../components/MoreFeaturesDialog';

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export default function Homepage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);



  const handleCloseFileManager = () => {
    setShowFileManager(false);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: theme.isDark
          ? 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)'
          : '#ffffff',
        backgroundSize: "400% 400%",
        animation: `${gradientShift} 15s ease infinite`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        overflow: "hidden",
        // Responsive padding
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 1, sm: 2 },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(100, 100, 100, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(150, 150, 150, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 120, 120, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        },
      }}
    >
      {/* Header Navigation */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          background: theme.colors.background.overlay,
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${theme.colors.border.light}`,
          py: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3, md: 4 },
          zIndex: 1001,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: 'pointer',
              
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  opacity: 0.8,
                }
              }}
              onClick={() => {
                // Scroll to top or refresh page to go to homepage
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img
                src="/airsmart.svg"
                alt="AirSmart Logo"
                style={{
                  width: "28px",
                  height: "28px",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: theme.colors.text.primary,
                  fontFamily: '"Untitled Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1.2rem" }, // Show smaller text on mobile
                  letterSpacing: "1px",
                  display: "block", // Always show text
                }}
              >
                AirSmart
              </Typography>
            </Box>

            {/* Color Mode Select */}
            <ColorModeSelect
              size="small"
              sx={{
                minWidth: 100,
                '& .MuiSelect-select': {
                  color: theme.colors.text.primary,
                  fontSize: '14px',
                  fontWeight: 500,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.colors.border.medium,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.colors.border.dark,
                },
                '& .MuiSvgIcon-root': {
                  color: theme.colors.text.secondary,
                }
              }}
            />
          </Box>
        </Container>
      </Box>

     

      <Container
        maxWidth="lg"
        sx={{
          textAlign: "center",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 8, sm: 10, md: 12 },
          pb: { xs: 4, sm: 6 }
        }}
      >
        {/* Main content */}
        <Box
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
            animation: isVisible ? `${fadeInUp} 1s ease-out` : "none",
          }}
        >
          {/* Hero Title */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: '"Untitled Sans", sans-serif',
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem", lg: "5rem" },
              fontWeight: 700,
              lineHeight: 1.1,
              mb: 3,
              background: theme.isDark
                ? `linear-gradient(90deg, transparent calc(50% - 58px), rgb(255, 255, 255) 50%, transparent calc(50% + 58px)),
                   linear-gradient(rgba(181, 181, 181, 0.643), rgba(181, 181, 181, 0.643))`
                : `linear-gradient(90deg, transparent calc(50% - 58px), rgb(0, 0, 0) 50%, transparent calc(50% + 58px)),
                   linear-gradient(rgba(100, 100, 100, 0.8), rgba(100, 100, 100, 0.8))`,
              backgroundSize: "200% 100%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: `${shimmer} 8s ease-in-out infinite`,
              textShadow: theme.isDark ? "0 0 40px rgba(255, 255, 255, 0.1)" : "0 0 40px rgba(0, 0, 0, 0.1)",
            }}
          >
            Smarter Comfort Starts Here
  
          
          </Typography>

          {/* Subtitle */}
         <Typography
            variant="h5"
            sx={{
              fontFamily: '"Untitled Sans", sans-serif',
              color: theme.colors.text.secondary,
              fontWeight: 400,
              mb: { xs: 4, sm: 6 },
              maxWidth: { xs: "100%", sm: "600px" },
              mx: "auto",
              lineHeight: 1.6,
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
              px: { xs: 1, sm: 0 },
              textTransform: "none", // Đảm bảo không viết hoa
            }}
          >
            We’ve created the world’s finest indoor environment system
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              <br />
            </Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}> </Box>
            That redefines air purification and climate control
          </Typography>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 3 }}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: { xs: 4, sm: 6 } }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/experience")}
              sx={{
                  background: theme.gradients.accent,
                color: theme.colors.text.inverse,
                fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                borderRadius: 2,
                textTransform: "none",
                px: { xs: 4, sm: 4 },
                py: { xs: 1.8, sm: 1.5 },
                minWidth: { xs: 200, sm: 200 },
                width: { xs: "100%", sm: "auto" },
                minHeight: { xs: 48, sm: 44 }, // Better touch targets on mobile
                position: "relative",
                overflow: "hidden",
                border: `1px solid ${theme.colors.border.light}`,
                boxShadow: theme.shadows.md,
                "&:hover": {
                  background: `
                    linear-gradient(135deg,
                      #555 0%,
                      #777 50%,
                      #555 100%
                    )
                  `,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 6px 25px rgba(68, 68, 68, 0.4)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Explore in 3D
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/compare")}
              sx={{
                color: theme.colors.text.primary,
                borderColor: theme.colors.border.medium,
                borderWidth: 2,
                fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                borderRadius: 2,
                textTransform: "none",
                px: { xs: 4, sm: 4 },
                py: { xs: 1.8, sm: 1.5 },
                minWidth: { xs: 200, sm: 200 },
                width: { xs: "100%", sm: "auto" },
                minHeight: { xs: 48, sm: 44 }, // Better touch targets on mobile
                background: theme.colors.background.overlay,
                backdropFilter: "blur(10px)",
                "&:hover": {
                  bgcolor: theme.colors.background.secondary,
                  borderColor: theme.colors.border.dark,
                  transform: "translateY(-1px)",
                  boxShadow: theme.shadows.md,
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Compare Systems
            </Button>


            <Button
              variant="outlined"
              size="large"
              onClick={() => setShowFileManager(true)}
              sx={{
                color: theme.colors.text.primary,
                borderColor: theme.colors.border.medium,
                borderWidth: 2,
                fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                borderRadius: 2,
                textTransform: "none",
                px: { xs: 4, sm: 4 },
                py: { xs: 1.8, sm: 1.5 },
                minWidth: { xs: 200, sm: 200 },
                width: { xs: "100%", sm: "auto" },
                minHeight: { xs: 48, sm: 44 }, // Better touch targets on mobile
                background: theme.colors.background.overlay,
                backdropFilter: "blur(10px)",
                "&:hover": {
                  bgcolor: theme.colors.background.secondary,
                  borderColor: theme.colors.border.dark,
                  transform: "translateY(-1px)",
                  boxShadow: theme.shadows.md,
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Download Brochure
            </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setShowMoreFeatures(true)}
                sx={{
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.medium,
                  borderWidth: 2,
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  borderRadius: 2,
                  textTransform: "none",
                  px: { xs: 4, sm: 4 },
                  py: { xs: 1.8, sm: 1.5 },
                  minWidth: { xs: 200, sm: 200 },
                  width: { xs: "100%", sm: "auto" },
                  minHeight: { xs: 48, sm: 44 }, // Better touch targets on mobile
                  background: theme.colors.background.overlay,
                  backdropFilter: "blur(10px)",
                  '&:hover': {
                    bgcolor: theme.colors.background.secondary,
                    borderColor: theme.colors.border.dark,
                    transform: "translateY(-1px)",
                    boxShadow: theme.shadows.md,
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                More Features...
              </Button>
          </Stack>

        </Box>
      </Container>

      {/* File Manager Popup */}
      <FileManagerPopup
        open={showFileManager}
        onClose={handleCloseFileManager}
        folderName="Brochures & Documents"
        userRole="Customer"
      />

      <MoreFeaturesDialog open={showMoreFeatures} onClose={() => setShowMoreFeatures(false)} />

    </Box>
  );
}