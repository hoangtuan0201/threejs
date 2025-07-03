import { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Stack, Chip } from "@mui/material";
import { keyframes } from "@mui/system";

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

export default function Homepage({ onExplore }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClick = (type) => {
    if (type === "explore") {
      onExplore();
    } else if (type === "compare") {
      alert("Comparison feature coming soon!");
    } else if (type === "download") {
      window.open("/brochures/sample.pdf", "_blank");
    }
  };

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
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        overflow: "hidden",
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
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          py: 2,
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
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 600,
                fontSize: "1.2rem",
                letterSpacing: "1px",
              }}
            >
              AirSmart
            </Typography>

            {/* Navigation Menu */}
            <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
              {["Product", "Pricing", "Docs", "Blog"].map((item) => (
                <Button
                  key={item}
                  variant="text"
                  sx={{
                    color: "rgba(200, 200, 200, 0.8)",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    textTransform: "none",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      color: "rgba(255, 255, 255, 0.9)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {item}
                </Button>
              ))}
            </Stack>

            
          </Box>
        </Container>
      </Box>

     

      <Container maxWidth="lg" sx={{ textAlign: "center", px: 3, pt: 12 }}>
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
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem", lg: "5rem" },
              fontWeight: 700,
              lineHeight: 1.1,
              mb: 3,
              background: `
                linear-gradient(90deg, transparent calc(50% - 58px), rgb(255, 255, 255) 50%, transparent calc(50% + 58px)),
                linear-gradient(rgba(181, 181, 181, 0.643), rgba(181, 181, 181, 0.643))
              `,
              backgroundSize: "200% 100%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: `${shimmer} 8s ease-in-out infinite`,
              textShadow: "0 0 40px rgba(255, 255, 255, 0.1)",
            }}
          >
            Better Climate. Better Control.
            <br />
            Better
            <Box
              component="span"
              sx={{
                background: `
                  linear-gradient(90deg, transparent calc(50% - 58px), rgb(255, 255, 255) 50%, transparent calc(50% + 58px)),
                  linear-gradient(rgba(181, 181, 181, 0.643), rgba(181, 181, 181, 0.643))
                `,
                backgroundSize: "200% 100%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: `${shimmer} 8s ease-in-out infinite 2s`,
              }}
            >
              {" "}Experience
            </Box>
            .
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h5"
            sx={{
              color: "rgba(200, 200, 200, 0.9)",
              fontWeight: 400,
              mb: 6,
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
              fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
            }}
          >
            The most powerful smart air conditioning platform
            <br />
            backed by the industry-leading climate control engine.
          </Typography>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 6 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => handleClick("explore")}
              sx={{
                background: `
                  linear-gradient(135deg,
                    #444 0%,
                    #666 50%,
                    #444 100%
                  )
                `,
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: 2,
                textTransform: "none",
                px: 4,
                py: 1.5,
                minWidth: 200,
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 20px rgba(68, 68, 68, 0.3)",
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
              onClick={() => handleClick("compare")}
              sx={{
                color: "rgba(200, 200, 200, 0.9)",
                borderColor: "rgba(150, 150, 150, 0.4)",
                borderWidth: 2,
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: 2,
                textTransform: "none",
                px: 4,
                py: 1.5,
                minWidth: 200,
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.08)",
                  borderColor: "rgba(200, 200, 200, 0.6)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 25px rgba(255, 255, 255, 0.1)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Compare Systems
            </Button>

            <Button
              variant="text"
              size="large"
              onClick={() => handleClick("download")}
              sx={{
                color: "rgba(180, 180, 180, 0.8)",
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: 3,
                textTransform: "none",
                px: 4,
                py: 2,
                minWidth: 200,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(220, 220, 220, 0.9)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Download Brochure
            </Button>
          </Stack>

          {/* Feature chips */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ gap: 2 }}
          >
            {["AI-Powered", "Energy Efficient", "Smart Controls", "3D Experience"].map((feature, index) => (
              <Chip
                key={feature}
                label={feature}
                sx={{
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(180, 180, 180, 0.9)",
                  border: "1px solid rgba(150, 150, 150, 0.3)",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  animation: `${fadeInUp} 1s ease-out ${index * 0.1}s both`,
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-2px)",
                    color: "rgba(220, 220, 220, 0.9)",
                  },
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Stack>
        </Box>
      </Container>

    </Box>
  );
}