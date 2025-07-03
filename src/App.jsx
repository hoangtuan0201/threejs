import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import theatreState from "./states/FlyThrough.json";
import { Scene } from "./components/Scene";
import Homepage from "./components/Homepage";
import LoadingScreen from "./components/LoadingScreen";




const sheet = getProject("Fly Through", { state: theatreState }).sheet("Scene");

  // if (import.meta.env.DEV && !window.__THEATRE_ALREADY_INIT__) {
  //   studio.initialize();
  //   studio.extend(extension);
  //   window.__THEATRE_ALREADY_INIT__ = true;
  // }

export default function App() {
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  const startTour = () => {
    setIsLoading(true);
    setShowControlPanel(false);
  };

  const endTour = () => {
    setShowControlPanel(true);
    setIsLoading(false);
    setModelLoaded(false);
  };

  const handleModelLoaded = () => {
    setModelLoaded(true);
    setIsLoading(false);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <>
      {showControlPanel && <Homepage onExplore={startTour} />}

      {/* Loading Screen */}
      {isLoading && !modelLoaded && <LoadingScreen />}

      {/* Navigation Guide - Fixed position outside Canvas */}
      {!showControlPanel && !isLoading && modelLoaded && (
        <div
          style={{
            position: 'fixed',
            top: window.innerWidth < 768 ? '16px' : '24px',
            left: window.innerWidth < 768 ? '16px' : '24px',
            zIndex: 1000,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: window.innerWidth < 768 ? '8px 12px' : '12px 20px',
              borderRadius: '8px',
              fontSize: window.innerWidth < 768 ? '12px' : '14px',
              fontWeight: '500',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              whiteSpace: window.innerWidth < 768 ? 'normal' : 'nowrap',
              maxWidth: window.innerWidth < 768 ? '200px' : 'none',
            }}
          >
            {window.innerWidth < 768 ?
              '👆 Swipe to navigate • ESC to exit' :
              '🖱️ Scroll to navigate • ⌨️ Press ESC to exit'
            }
          </div>
        </div>
      )}

      {/* Canvas - only show when not loading or model loaded */}
      {(!showControlPanel || modelLoaded) && (
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100vw",
          height: "100vh",
          touchAction: "none", // Prevent default touch behaviors
        }}
        shadows
        dpr={[1, 2]} // Higher DPR for better quality on retina displays
        camera={{
          position: [0, 0, 10],
          fov: window.innerWidth < 768 ? 70 : 60, // Wider FOV on mobile
          aspect: window.innerWidth / window.innerHeight,
          near: 0.1,
          far: 1000
        }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        onCreated={({ gl, camera }) => {
          // Responsive camera adjustments
          const handleResize = () => {
            camera.fov = window.innerWidth < 768 ? 70 : 60;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
          };

          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
        }}
      >
        <SheetProvider sheet={sheet}>
          <Scene
            onTourEnd={endTour}
            onHideControlPanel={() => setShowControlPanel(false)}
            onShowControlPanel={() => setShowControlPanel(true)}
            isExploreMode={!showControlPanel}
            onModelLoaded={handleModelLoaded}
          />
        </SheetProvider>
      </Canvas>
      )}
    </>
  );
}
