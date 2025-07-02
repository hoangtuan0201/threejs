import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import theatreState from "./states/FlyThrough.json";
import { Scene } from "./components/Scene";
import ControlPanel from "./components/ControlPanel";




const sheet = getProject("Fly Through", { state: theatreState }).sheet("Scene");

  if (import.meta.env.DEV && !window.__THEATRE_ALREADY_INIT__) {
    studio.initialize();
    studio.extend(extension);
    window.__THEATRE_ALREADY_INIT__ = true;
  }

export default function App() {
  const [showControlPanel, setShowControlPanel] = useState(true);

  const startTour = () => {
    setShowControlPanel(false);
  };

  const endTour = () => {
    setShowControlPanel(true);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <>
      {showControlPanel && <ControlPanel onExplore={startTour} />}

      {/* Navigation Guide - HIDDEN */}
      {/* {isExploring && (
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
            • <b>Mouse wheel</b> to scroll through the experience<br />
            • <b>ESC</b> to exit tour<br />
            • Click on white "i" hotspots for information<br />
            • Click on blue spheres to watch videos
          </Typography>
        </Paper>
      )} */}



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
            onTourEnd={endTour}
            onHideControlPanel={() => setShowControlPanel(false)}
            onShowControlPanel={() => setShowControlPanel(true)}
          />
        </SheetProvider>
      </Canvas>
    </>
  );
}
