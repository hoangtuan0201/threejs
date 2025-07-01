import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import theatreState from "./theatreState.json";
import { Scene } from "./components/Scene";
import ControlPanel from "./components/ControlPanel";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const sheet = getProject("Fly Through", { state: theatreState }).sheet("Scene");

  if (import.meta.env.DEV && !window.__THEATRE_ALREADY_INIT__) {
    studio.initialize();
    studio.extend(extension);
    window.__THEATRE_ALREADY_INIT__ = true;
  }

export default function App() {
  const [isExploring, setIsExploring] = useState(false);

  const startTour = () => setIsExploring(true);
  const endTour = () => setIsExploring(false);

  useEffect(() => {
    if (isExploring) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'auto'; };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isExploring]);

  return (
    <>
      {!isExploring && <ControlPanel onExplore={startTour} />}

      {isExploring && (
        <Paper
          elevation={6}
          sx={{
            position: "absolute",
            top: 24,
            left: 24,
            zIndex: 100,
            bgcolor: "#fff",
            color: "#111",
            p: 2,
            borderRadius: 2,
            maxWidth: 340,
            boxShadow: 6,
            opacity: 0.97,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            🎯 Hướng dẫn điều hướng
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            • <b>Cuộn chuột</b> lên/xuống để di chuyển giữa các điểm<br />
            • <b>Phím mũi tên</b> ←→↑↓ để điều hướng<br />
            • <b>ESC</b> để thoát tour<br />
            • Sử dụng nút "Tiếp theo" / "Trước" trong tooltip
          </Typography>
        </Paper>
      )}

      {isExploring && (
        <IconButton
          onClick={endTour}
          sx={{
            position: "absolute",
            top: 24,
            right: 24,
            zIndex: 100,
            bgcolor: "#111",
            color: "#fff",
            width: 48,
            height: 48,
            "&:hover": { bgcolor: "#333" },
            boxShadow: 3,
          }}
          title="Thoát tour"
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      )}

      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100vw",
          height: "100vh"
        }}
        shadows
        // Giới hạn device pixel ratio để cải thiện hiệu suất trên màn hình HiDPI
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 60 }}
      >
        <SheetProvider sheet={sheet}>
          <Scene isExploring={isExploring} onTourEnd={endTour} />
        </SheetProvider>
      </Canvas>
    </>
  );
}