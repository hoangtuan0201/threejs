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
              <Box sx={{ height: 25, color: theme.colors.text.primary, display: 'flex', alignItems: 'center' }}> 
                <svg 
                  version="1.1" 
                  xmlns="http://www.w3.org/2000/svg" 
                  xmlnsXlink="http://www.w3.org/1999/xlink" 
                  viewBox="0 0 325 49" 
                  xmlSpace="preserve" 
                  style={{ height: '90%', width: 'auto', fill: 'currentColor' }} 
                > 
                  <g> 
                    <path 
                        d="M21.998,0.728L0,48.256h4.711L23.887,6.235l19.121,42.021h4.904L25.943,0.728H21.998z M51.19,48.256h4.469V0.728H51.19V48.256z M288.098,0.728l1.944,4.191h14.272v43.309h4.469V4.919h14.272L325,0.728 C325,0.728,288.098,0.728,288.098,0.728z M127.107,22.261L127.107,22.261c-8.52-1.755-13.147-3.809-13.147-9.671v-0.128 c0-4.794,4.575-8.274,10.847-8.274c5.009-0.092,9.862,1.742,13.559,5.123l0.384,0.355l2.844-3.535l0.384-0.329 c-4.529-3.855-10.324-5.897-16.269-5.733c-8.82,0-15.451,5.485-15.451,12.739v0.136c0,7.341,4.656,11.286,16.08,13.588 c8.274,1.672,12.739,3.644,12.739,9.395v0.136c0,5.15-4.629,8.735, -11.258,8.735c-6.15,0.136-12.075-2.32-16.326-6.766l-0.384-0.355 l-2.931,3.37l0.384,0.329c5.112,4.932,11.963,7.649,19.066,7.561c9.369,0,15.916-5.424,15.916-13.204v-0.134 c-0.002-7.089-4.686-11.093-15.67-13.34V22.261z M191.619,0.728L173.21,27.847L154.8,0.728h-4.026v47.534h4.329V8.974 l18.024,26.239l18.024-26.239v39.283h4.469V0.728H191.619z M220.929,0.728l-21.998,47.528h4.711l19.198-41.994l19.121,41.994h4.904 L224.9,0.728H220.929z M283.901,48.262l-17.969-23.338h1.562c2.455,0.065,4.909-0.156,7.313-0.658 c5.013-1.343,8.026-4.766,8.026-9.505v-0.173c0-6.053-4.794-9.669-12.848-9.669h-15.367v43.309h-4.469V0.728H270.2 c4.933-0.255,9.766,1.449,13.45,4.739c2.356,2.397,3.674,5.624,3.671,8.985v0.136c0,7.205-4.904,12.245-13.204,13.669 l15.477,19.997L283.901,48.262z M99.133,48.262L81.167,24.916h1.562c2.455,0.065,4.909-0.156,7.313-0.658 c5.013-1.343,8.026-4.766,8.026-9.505v-0.165c0-6.053-4.794-9.669-12.848-9.669H69.853v43.309h-4.469V0.728h20.052 c4.933-0.255,9.766,1.449,13.45,4.739c2.358,2.396,3.679,5.623,3.677,8.985v0.136c0,7.205-4.904,12.245-13.204,13.669 l15.477,19.997L99.133,48.262z"
                        fill="currentColor" 
                      /> 
                  </g> 
                </svg>  
              </Box>
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

            {/* <Button
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
            </Button> */}

           

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
                Customize AirSmart
              </Button>
               {/* <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/x-ray")}
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
                minHeight: { xs: 48, sm: 44 },
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
              X-Ray Mode
            </Button> */}
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