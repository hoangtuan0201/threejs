import { Paper, Typography, Button, Stack } from "@mui/material";

export default function ControlPanel({ onExplore }) {
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
    <Paper
      elevation={0}
      sx={{
        position: "absolute",
        top: "55%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.3)",
        color: "#111",
        borderRadius: 4,
        px: 5,
        py: 5,
        minWidth: 380,
        maxWidth: 420,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        // Removed animation to avoid popup
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 32px 64px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)",
        },
        // Responsive design
        "@media (max-width: 600px)": {
          minWidth: 320,
          maxWidth: 360,
          px: 3,
          py: 4,
        },
      }}
    >
      {/* Logo/Brand Section - HIDDEN */}
      {/* <Box sx={{ textAlign: "center", mb: 1 }}>
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            background: "linear-gradient(135deg, #111 0%, #333 50%, #111 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 2,
            mb: 1,
            fontSize: { xs: "2rem", sm: "2.5rem" },
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          AirSmart
        </Typography>

        <Chip
          label="3D Experience"
          size="small"
          sx={{
            background: "linear-gradient(45deg, #111, #333)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 24,
            mb: 1,
            "& .MuiChip-label": {
              px: 1.5,
            },
          }}
        />

        <Typography
          variant="subtitle1"
          sx={{
            color: "#666",
            fontWeight: 500,
            fontSize: "1rem",
            letterSpacing: 0.5,
            mb: 2,
          }}
        >
          Smarter Comfort Starts Here
        </Typography>
      </Box> */}
      <Stack spacing={3} width="100%">
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            background: "linear-gradient(135deg, #111 0%, #333 50%, #111 100%)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1.1rem",
            borderRadius: 3,
            textTransform: "none",
            py: 1.8,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 25px rgba(17,17,17,0.3), 0 3px 10px rgba(17,17,17,0.2)",
            // Removed animation to avoid popup
            "&:hover": {
              background: "linear-gradient(135deg, #222 0%, #444 50%, #222 100%)",
              boxShadow: "0 12px 35px rgba(17,17,17,0.4), 0 5px 15px rgba(17,17,17,0.3)",
            },
            "&:active": {
              // Removed transform to avoid popup
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
              transition: "left 0.5s",
            },
            "&:hover::before": {
              left: "100%",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onClick={() => handleClick("explore")}
        >
           Explore the System
        </Button>
        <Button
          variant="outlined"
          fullWidth
          size="large"
          sx={{
            color: "#111",
            borderColor: "rgba(17,17,17,0.3)",
            borderWidth: 2,
            fontWeight: 600,
            fontSize: "1rem",
            borderRadius: 3,
            textTransform: "none",
            py: 1.5,
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              bgcolor: "rgba(17,17,17,0.05)",
              borderColor: "#111",
              // Removed transform to avoid popup
              boxShadow: "0 6px 20px rgba(17,17,17,0.15)",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: `linear-gradient(90deg, transparent, rgba(17,17,17,0.1), transparent)`,
              transition: "left 0.5s",
            },
            "&:hover::before": {
              left: "100%",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onClick={() => handleClick("compare")}
        >
          Compare with Traditional Systems
        </Button>
        <Button
          variant="outlined"
          fullWidth
          size="large"
          sx={{
            color: "#111",
            borderColor: "rgba(17,17,17,0.3)",
            borderWidth: 2,
            fontWeight: 600,
            fontSize: "1rem",
            borderRadius: 3,
            textTransform: "none",
            py: 1.5,
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              bgcolor: "rgba(17,17,17,0.05)",
              borderColor: "#111",
              // Removed transform to avoid popup
              boxShadow: "0 6px 20px rgba(17,17,17,0.15)",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: `linear-gradient(90deg, transparent, rgba(17,17,17,0.1), transparent)`,
              transition: "left 0.5s",
            },
            "&:hover::before": {
              left: "100%",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onClick={() => handleClick("download")}
        >
           Download Brochure
        </Button>
      </Stack>
      <Typography
        variant="caption"
        sx={{
          color: "#888",
          mt: 2,
          textAlign: "center",
          fontSize: 12,
        }}
      >
        Scroll to navigate the tour
      </Typography>
    </Paper>
  );
} 
