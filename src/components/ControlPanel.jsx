import { Paper, Typography, Button, Stack, Divider } from "@mui/material";

export default function ControlPanel({ onExplore }) {
  const handleClick = (type) => {
    if (type === "explore") {
      onExplore();
    } else if (type === "compare") {
      alert("Tính năng so sánh sẽ sớm ra mắt!");
    } else if (type === "download") {
      window.open("/brochures/sample.pdf", "_blank");
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: "absolute",
        top: "55%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        bgcolor: "#fff",
        color: "#111",
        borderRadius: 3,
        px: 4,
        py: 4,
        minWidth: 300,
        maxWidth: 350,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          color: "#111",
          letterSpacing: 1,
          mb: 0.5,
        }}
      >
        AirSmart
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{ color: "#555", mb: 1, fontWeight: 400 }}
      >
        Smarter Comfort Starts Here
      </Typography>
      <Divider sx={{ width: 40, mb: 2, bgcolor: "#111" }} />
      <Stack spacing={2} width="100%">
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            bgcolor: "#111",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": { bgcolor: "#222" },
            boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
          }}
          onClick={() => handleClick("explore")}
        >
          Khám phá hệ thống
        </Button>
        <Button
          variant="outlined"
          fullWidth
          size="large"
          sx={{
            color: "#111",
            borderColor: "#111",
            fontWeight: 600,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": { bgcolor: "#f5f5f5", borderColor: "#111" },
          }}
          onClick={() => handleClick("compare")}
        >
           So sánh với hệ thống cũ
        </Button>
        <Button
          variant="outlined"
          fullWidth
          size="large"
          sx={{
            color: "#111",
            borderColor: "#111",
            fontWeight: 600,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": { bgcolor: "#f5f5f5", borderColor: "#111" },
          }}
          onClick={() => handleClick("download")}
        >
          Tải brochure
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
        Cuộn chuột để điều hướng trong tour
      </Typography>
    </Paper>
  );
} 