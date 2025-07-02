import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import theatreState from "./states/FlyThrough.json";
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
  const [showControlPanel, setShowControlPanel] = useState(true);

  const startTour = () => setIsExploring(true);
  const endTour = () => {
    setIsExploring(false);
    setShowControlPanel(true); // Show ControlPanel again when exiting explore
  };

  useEffect(() => {
    if (isExploring) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'hidden'; }; // Keep hidden so scroll works in canvas
    } else {
      document.body.style.overflow = 'hidden'; // Always hidden so scroll works in canvas
    }
  }, [isExploring]);

  return (
    <>
      {!isExploring && showControlPanel && <ControlPanel onExplore={startTour} />}

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
            🎯 Navigation Guide
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            • <b>Mouse wheel</b> up/down to move between points<br />
            • <b>Arrow keys</b> ←→↑↓ to navigate<br />
            • <b>ESC</b> to exit tour<br />
            • Use "Next" / "Previous" buttons in tooltip
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
          title="Exit Tour"
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
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 60 }}
      >
        <SheetProvider sheet={sheet}>
          <Scene
            isExploring={isExploring}
            onTourEnd={endTour}
            onHideControlPanel={() => setShowControlPanel(false)}
            onShowControlPanel={() => setShowControlPanel(true)}
          />
        </SheetProvider>
      </Canvas>
    </>
  );
}
