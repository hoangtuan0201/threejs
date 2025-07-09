import { useState, useEffect, Suspense } from "react";
import { Box, Typography, Button, Container, Card, CardContent, IconButton } from "@mui/material";
import { keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LoadingScreen from "../components/LoadingScreen";
import { useTheme } from "../theme/ThemeContext";
import ColorModeSelect from "../theme/ColorModeSelect.jsx";

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

const rotate = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
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

// 3D Model Component
function RotatingModel({ modelPath, scale = 1 }) {
  const { scene } = useGLTF(modelPath);

  return (
    <primitive
      object={scene}
      scale={[scale, scale, scale]}
      position={[0, -1, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

export default function CompareSystem() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModelLoading, setIsModelLoading] = useState(false);

  useEffect(() => {
    // Simulate loading time for 3D models
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const comparisonData = [
    {
      id: 1,
      title: "Thermostat",
      airsmart: {
        title: "AIRSMART THERMOSTAT",
        modelPath: "/Monitor002.glb",
        dimensions: "4\" x 4\" x 1\"",
        features: "AI-powered learning algorithms, 7\" touch display, voice control integration, smartphone app, energy optimization",
        benefits: "30% energy savings, predictive climate control"
      },
      traditional: {
        title: "TRADITIONAL THERMOSTAT",
        modelPath: "/Monitor001.glb",
        dimensions: "5\" x 3\" x 2\"",
        features: "Manual controls, basic 7-day programming, simple LCD display",
        limitations: "No learning capability, limited scheduling options"
      }
    },
    {
      id: 2,
      title: "Air Purification",
      airsmart: {
        title: "AIRSMART AIR PURIFICATION",
        modelPath: "/Monitor002.glb",
        dimensions: "12\" x 8\" x 6\"",
        features: "HEPA filtration, UV-C sterilization, real-time air quality monitoring, automatic adjustment",
        benefits: "99.97% particle removal, virus elimination, smart air quality control"
      },
      traditional: {
        title: "TRADITIONAL AIR FILTER",
        modelPath: "/Monitor001.glb",
        dimensions: "16\" x 20\" x 1\"",
        features: "Basic mechanical filtration, manual replacement indicator",
        limitations: "Limited filtration efficiency, no air quality monitoring, manual maintenance"
      }
    },
    {
      id: 3,
      title: "Linear Grille",
      airsmart: {
        title: "AIRSMART LINEAR GRILLE",
        modelPath: "/Monitor002.glb",
        dimensions: "24\" x 6\" x 2\"",
        features: "Smart airflow control, integrated sensors, automatic damper adjustment, sleek design",
        benefits: "Optimized air distribution, energy efficient, aesthetic integration"
      },
      traditional: {
        title: "TRADITIONAL LINEAR GRILLE",
        modelPath: "/Monitor001.glb",
        dimensions: "24\" x 6\" x 3\"",
        features: "Fixed airflow direction, manual adjustment, basic metal construction",
        limitations: "No smart control, inefficient air distribution, bulky design"
      }
    },
    {
      id: 4,
      title: "Round Grille",
      airsmart: {
        title: "AIRSMART ROUND GRILLE",
        modelPath: "/Monitor002.glb",
        dimensions: "8\" diameter x 2\"",
        features: "360-degree airflow control, smart dampers, integrated air quality sensors",
        benefits: "Uniform air distribution, real-time monitoring, energy optimization"
      },
      traditional: {
        title: "TRADITIONAL ROUND GRILLE",
        modelPath: "/Monitor001.glb",
        dimensions: "8\" diameter x 3\"",
        features: "Fixed louvers, manual adjustment, basic aluminum construction",
        limitations: "Limited airflow control, no monitoring capabilities, energy waste"
      }
    },
    {
      id: 5,
      title: "Outdoor Unit",
      airsmart: {
        title: "AIRSMART OUTDOOR UNIT",
        modelPath: "/Monitor002.glb",
        dimensions: "36\" x 36\" x 30\"",
        features: "Variable speed compressor, smart defrost, weather-resistant design, IoT connectivity",
        benefits: "40% energy savings, extended lifespan, remote monitoring and control"
      },
      traditional: {
        title: "TRADITIONAL OUTDOOR UNIT",
        modelPath: "/Monitor001.glb",
        dimensions: "40\" x 40\" x 36\"",
        features: "Single speed compressor, basic controls, standard weather protection",
        limitations: "High energy consumption, limited efficiency, no remote capabilities"
      }
    },
    {
      id: 6,
      title: "Indoor Unit",
      airsmart: {
        title: "AIRSMART INDOOR UNIT",
        modelPath: "/Monitor002.glb",
        dimensions: "48\" x 24\" x 12\" (Horizontal) / 24\" x 48\" x 12\" (Vertical)",
        features: "Variable airflow, smart sensors, quiet operation, modular design",
        benefits: "Flexible installation, energy efficient, intelligent climate control"
      },
      traditional: {
        title: "TRADITIONAL INDOOR UNIT",
        modelPath: "/Monitor001.glb",
        dimensions: "52\" x 28\" x 16\"",
        features: "Fixed speed fan, basic thermostat control, standard installation",
        limitations: "Limited flexibility, higher noise levels, basic control options"
      }
    },
    {
      id: 7,
      title: "Smart Flow Duct",
      airsmart: {
        title: "AIRSMART SMART FLOW DUCT",
        modelPath: "/Monitor002.glb",
        dimensions: "4\" diameter (Small diameter ducting)",
        features: "Intelligent airflow management, leak detection, pressure optimization, flexible routing",
        benefits: "Reduced installation space, improved efficiency, smart diagnostics"
      },
      traditional: {
        title: "TRADITIONAL DUCTWORK",
        modelPath: "/Monitor001.glb",
        dimensions: "8\"-12\" diameter",
        features: "Standard metal ducting, manual dampers, basic insulation",
        limitations: "Large space requirements, energy losses, no smart features"
      }
    }
  ];

  const nextSlide = () => {
    setIsModelLoading(true);
    setCurrentSlide((prev) => (prev + 1) % comparisonData.length);
    // Simulate model loading time
    setTimeout(() => setIsModelLoading(false), 800);
  };

  const prevSlide = () => {
    setIsModelLoading(true);
    setCurrentSlide((prev) => (prev - 1 + comparisonData.length) % comparisonData.length);
    // Simulate model loading time
    setTimeout(() => setIsModelLoading(false), 800);
  };

  const currentData = comparisonData[currentSlide];

  // Show loading screen while loading
  if (isLoading) {
    return (
      <LoadingScreen
        text="Loading Comparison Models..."
        variant="compare"
      />
    );
  }

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
        flexDirection: "column",
        zIndex: 1000,
        overflow: "auto",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 80%, rgba(100, 100, 100, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(150, 150, 150, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 120, 120, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        },
        // Custom scrollbar
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(79, 70, 229, 0.6)",
          borderRadius: "4px",
          "&:hover": {
            background: "rgba(79, 70, 229, 0.8)",
          },
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
          py: { xs: 1, sm: 1.5, md: 2 },
          px: { xs: 1, sm: 2, md: 4 },
          zIndex: 1001,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1, md: 2 },
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  opacity: 0.8,
                }
              }}
              onClick={() => navigate("/")}
            >
              <img
                src="/airsmart.svg"
                alt="AirSmart Logo"
                style={{
                  width: "24px",
                  height: "24px",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Untitled Sans", sans-serif',
                  color: theme.colors.text.primary,
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                  letterSpacing: "1px",
                  display: { xs: "block", sm: "block" },
                }}
              >
                AirSmart
              </Typography>
            </Box>

            {/* Right Side - Color Mode Select and Back Button */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
              <Button
                onClick={() => navigate("/")}
                sx={{
                  color: theme.colors.text.secondary,
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                  textTransform: "none",
                  minWidth: { xs: "auto", sm: "auto" },
                  px: { xs: 1, sm: 2 },
                  "&:hover": {
                    bgcolor: theme.colors.background.overlay,
                    color: theme.colors.text.primary,
                  },
                }}
              >
                ← Back
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          textAlign: "center",
          px: { xs: 1, sm: 2, md: 4 },
          pt: { xs: 8, sm: 9, md: 10 },
          pb: { xs: 2, sm: 3, md: 4 },
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
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
          {/* Component Title */}
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Untitled Sans", sans-serif',
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" },
              fontWeight: 700,
              lineHeight: 1.1,
              mb: { xs: 1, sm: 1.5, md: 2},
              mt: { xs: 1, sm: 1.5, md: 2 },
              color: theme.colors.text.primary,
              textAlign: "center",
              textShadow: theme.isDark ? "0 2px 8px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {currentData.title}
          </Typography>
           {/* Subtitle */}
                   <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Untitled Sans", sans-serif',
                        color: theme.colors.text.secondary,
                        fontWeight: 400,
                        mb: { xs: 2, sm: 3, md: 4},
                        maxWidth: { xs: "100%", sm: "600px" },
                        mx: "auto",
                        lineHeight: 1.6,
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem", lg: "1.4rem" },
                        px: { xs: 0.5, sm: 0 },
                        textTransform: "none",
                      }}
                    >
                      Compare AirSmart's intelligent solutions with traditional systems
                      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                        <br />
                      </Box>

                    </Typography>

            {/* Comparison Cards */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 2, sm: 3, md: 4 },
                mb: { xs: 2, sm: 4, md: 6 },
                mt: { xs: 1, sm: 2, md: 3, lg: 4 },
                px: { xs: 1, sm: 2, md: 4 },
                maxWidth: "1400px",
                mx: "auto", // Center the container
              }}
            >
              {/* Desktop Left Navigation Arrow */}
            <IconButton
              onClick={prevSlide}
              disabled={currentSlide === 0}
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on mobile
                bgcolor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                width: { md: 52, lg: 60 },
                height: { md: 52, lg: 60 },
                backdropFilter: "blur(10px)",
                border: `1px solid ${theme.colors.border.light}`,
                boxShadow: theme.shadows.lg,
                flexShrink: 0,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center", // Add this to center vertically
                "&:hover": {
                  bgcolor: theme.colors.background.tertiary,
                  transform: "scale(1.05)",
                  boxShadow: theme.shadows.lg,
                },
                "&:disabled": {
                  opacity: 0.5,
                  cursor: "not-allowed",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <ArrowBackIosIcon sx={{ fontSize: { md: "1.4rem", lg: "1.6rem" } }} />
            </IconButton>

            {/* Mobile Navigation - Top */}
            <Box sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "space-between",
              width: "100%",
              mb: 2
            }}>
              <IconButton
                onClick={prevSlide}
                disabled={currentSlide === 0}
                sx={{
                  bgcolor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  width: 44,
                  height: 44,
                  border: `1px solid ${theme.colors.border.light}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                <ArrowBackIosIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>

              <IconButton
                onClick={nextSlide}
                disabled={currentSlide === comparisonData.length - 1}
                sx={{
                  bgcolor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  width: 44,
                  height: 44,
                  border: `1px solid ${theme.colors.border.light}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </Box>

            {/* Cards Container */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 2, sm: 3, md: 3 },
                flex: 1,
                width: "100%",
                maxWidth: "1200px", // Increased max width
                alignItems: "stretch", // Make cards same height
                minHeight: { xs: "auto", md: "700px" }, // Set minimum height for desktop
              }}
            >
              {/* Container Box for equal height cards */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: { xs: 3, md: 2 },
                  alignItems: "stretch", // This ensures cards stretch to equal height
                  minHeight: { md: "600px" }, // Minimum height for desktop
                }}
              >
                {/* AirSmart Card */}
                <Card
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)",
                    border: "2px solid rgba(59, 130, 246, 0.4)",
                    borderRadius: 4,
                    backdropFilter: "blur(20px)",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)",
                    "&:hover": {
                      border: "2px solid rgba(59, 130, 246, 0.6)",
                      transform: "translateY(-4px)",
                      boxShadow: "0 25px 50px rgba(59, 130, 246, 0.2)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <CardContent sx={{
                    p: { xs: 2.5, sm: 3.5, md: 4.5 },
                    textAlign: "left",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 2, sm: 2.5, md: 3 },
                    justifyContent: "space-between", // Distribute content evenly
                  }}>
                    {/* Title */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Untitled Sans", sans-serif',
                        color: "#2563eb",
                        fontWeight: 700,
                        fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem", lg: "1.5rem" },
                        textShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
                        flexShrink: 0, // Prevent shrinking
                      }}
                    >
                      {currentData.airsmart.title}
                    </Typography>

                    {/* 3D Model */}
                    <Box
                      sx={{
                        height: { xs: 160, sm: 180, md: 200 },
                        borderRadius: 3,
                        position: "relative",
                        overflow: "hidden",
                        background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)",
                        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                        flexShrink: 0,
                      }}
                    >
                      {/* Model Loading Overlay */}
                      {isModelLoading && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(37, 99, 235, 0.8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              border: "3px solid rgba(255, 255, 255, 0.3)",
                              borderTop: "3px solid white",
                              borderRadius: "50%",
                              animation: `${spin} 1s linear infinite`,
                            }}
                          />
                        </Box>
                      )}
                      <Canvas
                        camera={{ position: [0, 1.5, 8], fov: 45 }}
                        style={{ width: "100%", height: "100%" }}
                      >
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
                        <directionalLight position={[-10, -10, -5]} intensity={0.8} />
                        <directionalLight position={[0, 10, 10]} intensity={0.8} />
                        <pointLight position={[0, 10, 0]} intensity={0.7} />
                        <pointLight position={[5, 0, 5]} intensity={0.5} />
                        <pointLight position={[-5, 0, -5]} intensity={0.5} />
                        <Suspense fallback={null}>
                          <RotatingModel modelPath={currentData.airsmart.modelPath} scale={1} />
                        </Suspense>
                        <OrbitControls
                          enablePan={false}
                          enableZoom={true}
                          minDistance={6}
                          maxDistance={12}
                          autoRotate={true}
                          autoRotateSpeed={1.5}
                        />
                      </Canvas>
                    </Box>

                    {/* Content sections with flex-grow to fill remaining space */}
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5, md: 3 } }}>
                      {/* Dimensions */}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: '"Untitled Sans", sans-serif',
                            color: "#2563eb",
                            fontWeight: 700,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            mb: { xs: 1, sm: 1.5 },
                          }}
                        >
                          Dimensions:
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: '"Untitled Sans", sans-serif',
                            color: theme.isDark ? "rgba(255, 255, 255, 0.95)" : "#000000",
                            fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                            fontWeight: 500,
                            background: "rgba(59, 130, 246, 0.1)",
                            padding: { xs: "6px 10px", sm: "8px 12px" },
                            borderRadius: 2,
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                          }}
                        >
                          {currentData.airsmart.dimensions}
                        </Typography>
                      </Box>

                      {/* Features */}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: '"Untitled Sans", sans-serif',
                            color: "#2563eb",
                            fontWeight: 700,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            mb: { xs: 1, sm: 1.5 },
                          }}
                        >
                          Features:
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: '"Untitled Sans", sans-serif',
                            color: theme.isDark ? "rgba(255, 255, 255, 0.95)" : "#000000",
                            fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.95rem" },
                            lineHeight: 1.6,
                            background: "rgba(59, 130, 246, 0.08)",
                            padding: { xs: "10px 12px", sm: "12px 16px" },
                            borderRadius: 2,
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                          }}
                        >
                          {currentData.airsmart.features}
                        </Typography>
                      </Box>

                      {/* Benefits */}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: '"Untitled Sans", sans-serif',
                            color: "#2563eb",
                            fontWeight: 700,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            mb: { xs: 1, sm: 1.5 },
                          }}
                        >
                          Benefits:
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: '"Untitled Sans", sans-serif',
                            color: theme.isDark ? "rgba(255, 255, 255, 0.95)" : "#000000",
                            fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                            fontWeight: 600,
                            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)",
                            padding: { xs: "10px 12px", sm: "12px 16px" },
                            borderRadius: 2,
                            border: "1px solid rgba(59, 130, 246, 0.4)",
                          }}
                        >
                          {currentData.airsmart.benefits}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Traditional Card */}
                <Card
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    background: "linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(156, 163, 175, 0.05) 100%)",
                    border: "2px solid rgba(107, 114, 128, 0.3)",
                    borderRadius: 4,
                    backdropFilter: "blur(20px)",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(107, 114, 128, 0.1)",
                    "&:hover": {
                      border: "2px solid rgba(107, 114, 128, 0.5)",
                      transform: "translateY(-4px)",
                      boxShadow: "0 25px 50px rgba(107, 114, 128, 0.15)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <CardContent sx={{
                    p: { xs: 2.5, sm: 3.5, md: 4.5 },
                    textAlign: "left",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 2, sm: 2.5, md: 3 },
                    justifyContent: "space-between", // Distribute content evenly
                  }}>
                    {/* Title */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Untitled Sans", sans-serif',
                        color: "#6b7280",
                        fontWeight: 700,
                        fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem", lg: "1.5rem" },
                        textShadow: "0 2px 4px rgba(107, 114, 128, 0.2)",
                        flexShrink: 0, // Prevent shrinking
                      }}
                    >
                      {currentData.traditional.title}
                    </Typography>

                    {/* 3D Model */}
                    <Box
                      sx={{
                        height: { xs: 160, sm: 180, md: 200 },
                        borderRadius: 3,
                        position: "relative",
                        overflow: "hidden",
                        background: "linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #d1d5db 100%)",
                        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                        flexShrink: 0,
                      }}
                    >
                      {/* Model Loading Overlay */}
                      {isModelLoading && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(107, 114, 128, 0.8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              border: "3px solid rgba(255, 255, 255, 0.3)",
                              borderTop: "3px solid white",
                              borderRadius: "50%",
                              animation: `${spin} 1s linear infinite`,
                            }}
                          />
                        </Box>
                      )}
                      <Canvas
                        camera={{ position: [0, 1.5, 8], fov: 45 }}
                        style={{ width: "100%", height: "100%" }}
                      >
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
                        <directionalLight position={[-10, -10, -5]} intensity={0.8} />
                        <directionalLight position={[0, 10, 10]} intensity={0.8} />
                        <pointLight position={[0, 10, 0]} intensity={0.7} />
                        <pointLight position={[5, 0, 5]} intensity={0.5} />
                        <pointLight position={[-5, 0, -5]} intensity={0.5} />
                        <Suspense fallback={null}>
                          <RotatingModel modelPath={currentData.traditional.modelPath} scale={1} />
                        </Suspense>
                        <OrbitControls
                          enablePan={false}
                          enableZoom={true}
                          minDistance={6}
                          maxDistance={12}
                          autoRotate={true}
                          autoRotateSpeed={1.5}
                        />
                      </Canvas>
                    </Box>

                    {/* Content sections with flex-grow to fill remaining space */}
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5, md: 3 } }}>
                      {/* Dimensions */}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: '"Untitled Sans", sans-serif',
                            color: "#6b7280",
                            fontWeight: 700,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            mb: { xs: 1, sm: 1.5 },
                          }}
                        >
                          Dimensions:
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: '"Untitled Sans", sans-serif',
                            color: theme.isDark ? "rgba(255, 255, 255, 0.95)" : "#000000",
                            fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.95rem" },
                            lineHeight: 1.6,
                            background: "rgba(107, 114, 128, 0.05)",
                            padding: { xs: "10px 12px", sm: "12px 16px" },
                            borderRadius: 2,
                            border: "1px solid rgba(107, 114, 128, 0.15)",
                          }}
                        >
                          {currentData.traditional.dimensions}
                        </Typography>
                      </Box>

                      {/* Features */}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: '"Untitled Sans", sans-serif',
                            color: "#6b7280",
                            fontWeight: 700,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            mb: { xs: 1, sm: 1.5 },
                          }}
                        >
                          Features:
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: '"Untitled Sans", sans-serif',
                            color: theme.isDark ? "rgba(255, 255, 255, 0.95)" : "#000000",
                            fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.95rem" },
                            lineHeight: 1.6,
                            background: "rgba(107, 114, 128, 0.08)",
                            padding: { xs: "10px 12px", sm: "12px 16px" },
                            borderRadius: 2,
                            border: "1px solid rgba(107, 114, 128, 0.15)",
                          }}
                        >
                          {currentData.traditional.features}
                        </Typography>
                      </Box>

                      {/* Limitations */}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: '"Untitled Sans", sans-serif',
                            color: "#ef4444",
                            fontWeight: 700,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            mb: { xs: 1, sm: 1.5 },
                          }}
                        >
                          Limitations:
                        </Typography>
                        <Typography
                          sx={{
                            color: theme.isDark ? "rgba(255, 255, 255, 0.95)" : "#000000",
                            fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                            fontWeight: 500,
                            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
                            padding: { xs: "10px 12px", sm: "12px 16px" },
                            borderRadius: 2,
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                          }}
                        >
                          {currentData.traditional.limitations}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Desktop Right Navigation Arrow */}
            <IconButton
              onClick={nextSlide}
              disabled={currentSlide === comparisonData.length - 1}
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on mobile
                bgcolor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                width: { md: 52, lg: 60 },
                height: { md: 52, lg: 60 },
                backdropFilter: "blur(10px)",
                border: `1px solid ${theme.colors.border.light}`,
                boxShadow: theme.shadows.lg,
                flexShrink: 0,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center", // Add this to center vertically
                "&:hover": {
                  bgcolor: theme.colors.background.tertiary,
                  transform: "scale(1.05)",
                  boxShadow: theme.shadows.lg,
                },
                "&:disabled": {
                  opacity: 0.5,
                  cursor: "not-allowed",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: { md: "1.4rem", lg: "1.6rem" } }} />
            </IconButton>

        </Box>
        </Box>
      </Container>
    </Box>
  );
}