import { useState, useEffect, Suspense } from "react";
import { Box, Typography, Button, Container, Stack, Card, CardContent, IconButton } from "@mui/material";
import { keyframes } from "@mui/system";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LoadingScreen from "../components/LoadingScreen";

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
      position={[-1, -1, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

export default function CompareSystem({ onBack }) {
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
        modelPath: "/Monitor001.glb",
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
        modelPath: "/Monitor001.glb",
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
        modelPath: "/Monitor001.glb",
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
        modelPath: "/Monitor001.glb",
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
        modelPath: "/Monitor001.glb",
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
        modelPath: "/Monitor001.glb",
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
        modelPath: "/Monitor001.glb",
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
        background: `
          linear-gradient(oklch(0.2 0.0122 237.44) 0px, oklch(0.36 0.0088 219.71) 100%)
        `,
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
            radial-gradient(circle at 20% 80%, rgba(100, 100, 100, 0.1) 0%, transparent 50%),
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
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
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
            }}
          >
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
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
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 600,
                  fontSize: { xs: "1rem", sm: "1.2rem" },
                  letterSpacing: "1px",
                  display: { xs: "none", sm: "block" },
                }}
              >
                AirSmart
              </Typography>
            </Box>

            {/* Back Button */}
            <Button
              onClick={onBack}
              sx={{
                color: "rgba(200, 200, 200, 0.9)",
                fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(220, 220, 220, 0.9)",
                },
              }}
            >
              ← Back to Home
            </Button>
          </Box>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          textAlign: "center",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 10, sm: 10, md: 10 },
          pb: { xs: 4, sm: 4, md: 4 },
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
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              fontWeight: 700,
              lineHeight: 1.1,
              mb: { xs: 2, sm: 4, md: 4 },
              mt: { xs: 2, sm: 4, md: 4 },
              color: "rgba(255, 255, 255, 0.95)",
              textAlign: "center",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
            }}
          >
            {currentData.title}
          </Typography>

          {/* Comparison Cards */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 3, sm: 4, md: 6 },
              mb: { xs: 4, sm: 6, md: 8 },
              mt: { xs: 2, sm: 3, md: 4 },
              position: "relative",
              px: { xs: 1, sm: 2, md: 4 },
            }}
          >
            {/* Navigation Arrows */}
            <IconButton
              onClick={prevSlide}
              sx={{
                position: "absolute",
                left: { xs: -20, sm: -25, md: -70 },
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(71, 85, 105, 0.9)",
                color: "white",
                width: { xs: 48, sm: 52, md: 60 },
                height: { xs: 48, sm: 52, md: 60 },
                zIndex: 20,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(71, 85, 105, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  bgcolor: "rgba(51, 65, 85, 0.95)",
                  transform: "translateY(-50%) scale(1.05)",
                  boxShadow: "0 12px 40px rgba(71, 85, 105, 0.4)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <ArrowBackIosIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" }, ml: 0.5 }} />
            </IconButton>

            <IconButton
              onClick={nextSlide}
              sx={{
                position: "absolute",
                right: { xs: -20, sm: -25, md: -70 },
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(71, 85, 105, 0.9)",
                color: "white",
                width: { xs: 48, sm: 52, md: 60 },
                height: { xs: 48, sm: 52, md: 60 },
                zIndex: 20,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(71, 85, 105, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  bgcolor: "rgba(51, 65, 85, 0.95)",
                  transform: "translateY(-50%) scale(1.05)",
                  boxShadow: "0 12px 40px rgba(71, 85, 105, 0.4)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" } }} />
            </IconButton>

            {/* AirSmart Card */}
            <Card
              sx={{
                flex: 1,
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)",
                border: "2px solid rgba(59, 130, 246, 0.4)",
                borderRadius: 4,
                backdropFilter: "blur(20px)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)",
                mx: { xs: 0, md: 1 },
                "&:hover": {
                  border: "2px solid rgba(59, 130, 246, 0.6)",
                  transform: "translateY(-4px)",
                  boxShadow: "0 25px 50px rgba(59, 130, 246, 0.2)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  bgcolor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                {currentSlide + 1} / {comparisonData.length}
              </Box>

              <CardContent sx={{ p: 4, textAlign: "left" }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#2563eb",
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                    textShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
                  }}
                >
                  {currentData.airsmart.title}
                </Typography>

                {/* 3D Model */}
                <Box
                  sx={{
                    height: { xs: 200, sm: 220, md: 250 },
                    borderRadius: 3,
                    mb: 3,
                    position: "relative",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)",
                    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
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
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <Suspense fallback={null}>
                      <RotatingModel modelPath={currentData.airsmart.modelPath} scale={1} />
                    </Suspense>
                    <OrbitControls
                      enablePan={false}
                      enableZoom={true}
                      minDistance={6}
                      maxDistance={12}
                      autoRotate={true}
                      autoRotateSpeed={2}
                    />
                  </Canvas>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      color: "#2563eb",
                      fontWeight: 700,
                      fontSize: "1rem",
                      mb: 1.5,
                    }}
                  >
                    Dimensions:
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.95)",
                      fontSize: "1rem",
                      fontWeight: 500,
                      background: "rgba(59, 130, 246, 0.1)",
                      padding: "8px 12px",
                      borderRadius: 2,
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    {currentData.airsmart.dimensions}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      color: "#2563eb",
                      fontWeight: 700,
                      fontSize: "1rem",
                      mb: 1.5,
                    }}
                  >
                    Features:
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.95)",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      background: "rgba(59, 130, 246, 0.08)",
                      padding: "12px 16px",
                      borderRadius: 2,
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    {currentData.airsmart.features}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "#2563eb",
                      fontWeight: 700,
                      fontSize: "1rem",
                      mb: 1.5,
                    }}
                  >
                    Benefits:
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.95)",
                      fontSize: "1rem",
                      fontWeight: 600,
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)",
                      padding: "12px 16px",
                      borderRadius: 2,
                      border: "1px solid rgba(59, 130, 246, 0.4)",
                    }}
                  >
                    {currentData.airsmart.benefits}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Traditional Card */}
            <Card
              sx={{
                flex: 1,
                background: "linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(156, 163, 175, 0.05) 100%)",
                border: "2px solid rgba(107, 114, 128, 0.3)",
                borderRadius: 4,
                backdropFilter: "blur(20px)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(107, 114, 128, 0.1)",
                mx: { xs: 0, md: 1 },
                "&:hover": {
                  border: "2px solid rgba(107, 114, 128, 0.5)",
                  transform: "translateY(-4px)",
                  boxShadow: "0 25px 50px rgba(107, 114, 128, 0.15)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <CardContent sx={{ p: 4, textAlign: "left" }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#6b7280",
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                    textShadow: "0 2px 4px rgba(107, 114, 128, 0.2)",
                  }}
                >
                  {currentData.traditional.title}
                </Typography>

                {/* 3D Model */}
                <Box
                  sx={{
                    height: { xs: 200, sm: 220, md: 250 },
                    borderRadius: 3,
                    mb: 3,
                    position: "relative",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #d1d5db 100%)",
                    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
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
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
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

                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      color: "#6b7280",
                      fontWeight: 700,
                      fontSize: "1rem",
                      mb: 1.5,
                    }}
                  >
                    Dimensions:
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.95)",
                      fontSize: "1rem",
                      fontWeight: 500,
                      background: "rgba(107, 114, 128, 0.1)",
                      padding: "8px 12px",
                      borderRadius: 2,
                      border: "1px solid rgba(107, 114, 128, 0.2)",
                    }}
                  >
                    {currentData.traditional.dimensions}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      color: "#6b7280",
                      fontWeight: 700,
                      fontSize: "1rem",
                      mb: 1.5,
                    }}
                  >
                    Features:
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.95)",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      background: "rgba(107, 114, 128, 0.05)",
                      padding: "12px 16px",
                      borderRadius: 2,
                      border: "1px solid rgba(107, 114, 128, 0.15)",
                    }}
                  >
                    {currentData.traditional.features}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "#ef4444",
                      fontWeight: 700,
                      fontSize: "1rem",
                      mb: 1.5,
                    }}
                  >
                    Limitations:
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.95)",
                      fontSize: "1rem",
                      fontWeight: 500,
                      background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
                      padding: "12px 16px",
                      borderRadius: 2,
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    {currentData.traditional.limitations}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Slide Indicators */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: { xs: 8, sm: 10, md: 12 },
              mb: { xs: 4, sm: 6, md: 8 },
            }}
          >
            {comparisonData.map((_, index) => (
              <Box
                key={index}
                onClick={() => {
                  if (index !== currentSlide) {
                    setIsModelLoading(true);
                    setCurrentSlide(index);
                    setTimeout(() => setIsModelLoading(false), 800);
                  }
                }}
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: index === currentSlide ? "#4f46e5" : "rgba(255, 255, 255, 0.3)",
                  cursor: "pointer",
                  border: index === currentSlide ? "2px solid rgba(255, 255, 255, 0.5)" : "2px solid transparent",
                  boxShadow: index === currentSlide ? "0 4px 12px rgba(79, 70, 229, 0.4)" : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    bgcolor: index === currentSlide ? "#4338ca" : "rgba(255, 255, 255, 0.6)",
                    transform: "scale(1.3)",
                    boxShadow: "0 6px 16px rgba(79, 70, 229, 0.3)",
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}