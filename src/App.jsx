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
import { useMobile } from "./hooks/useMobile";




const sheet = getProject("Fly Through", { state: theatreState }).sheet("Scene");

if (import.meta.env.DEV && !window.__THEATRE_ALREADY_INIT__) {
  studio.initialize();
  studio.extend(extension);

  // Force show studio UI
  setTimeout(() => {
    studio.ui.restore();
  }, 1000);

  window.__THEATRE_ALREADY_INIT__ = true;
}

export default function App() {
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Mobile detection and responsive utilities
  const mobile = useMobile();

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
    // Add small delay to ensure scene is properly rendered before showing
    setTimeout(() => {
      setModelLoaded(true);
      setIsLoading(false);
    }, 100); // Small delay to ensure proper scene initialization
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
          className="no-select safe-area-inset"
          style={{
            position: 'fixed',
            top: mobile.getResponsiveValue('16px', '20px', '24px'),
            left: mobile.getResponsiveValue('16px', '20px', '24px'),
            zIndex: 1000,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              color: 'white',
              padding: mobile.getResponsiveValue('10px 16px', '11px 18px', '12px 20px'),
              borderRadius: mobile.getResponsiveValue('12px', '10px', '8px'),
              fontSize: mobile.getResponsiveValue('15px', '14px', '14px'), // Keep original desktop font
              fontWeight: '500',
              textAlign: 'center',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              whiteSpace: window.innerWidth < 768 ? 'normal' : 'nowrap',
              maxWidth: mobile.getResponsiveValue('280px', '320px', 'none'),
              lineHeight: mobile.getResponsiveValue('1.4', '1.3', '1.2'),
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
          >
            {mobile.isMobile ?
              '👆 Touch & drag to navigate\n⬅️ Swipe ESC to exit' :
              '🖱️ Scroll to navigate • ⌨️ Press ESC to exit'
            }
          </div>
        </div>
      )}

      {/* Theatre.js Studio Button - Development only */}
      {import.meta.env.DEV && !showControlPanel && !isLoading && modelLoaded && (
        <button
          onClick={() => {
            console.log('Toggling Theatre.js Studio...');
            if (window.__THEATRE_STUDIO_VISIBLE) {
              studio.ui.hide();
              window.__THEATRE_STUDIO_VISIBLE = false;
            } else {
              studio.ui.restore();
              window.__THEATRE_STUDIO_VISIBLE = true;
            }
          }}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 10000,
            background: 'rgba(255, 100, 0, 0.9)',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          🎬 Studio
        </button>
      )}

      {/* Canvas - show when not showing control panel, but hide with opacity until model loads */}
      {!showControlPanel && (
      <Canvas
        className="gpu-accelerated ios-fix android-fix"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100vw",
          height: "100vh",
          touchAction: "none", // Prevent default touch behaviors
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
          opacity: modelLoaded ? 1 : 0, // Hide canvas until model loads to prevent white screen
          transition: "opacity 0.3s ease", // Smooth fade in when model loads
        }}
        shadows
        dpr={[1, 2]} // Higher DPR for better quality on retina displays
        camera={{
          position: mobile.getCameraPosition(), // Responsive camera position
          fov: mobile.getCameraFOV(), // Responsive FOV based on device
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
          // Responsive camera adjustments using mobile hook
          const handleResize = () => {
            const newPosition = mobile.getCameraPosition();
            const newFOV = mobile.getCameraFOV();

            // Update camera position and FOV
            camera.position.set(newPosition[0], newPosition[1], newPosition[2]);
            camera.fov = newFOV;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            // Adjust renderer for mobile performance
            gl.setPixelRatio(mobile.getPixelRatio());

            console.log('App Camera updated:', {
              position: newPosition,
              fov: newFOV,
              isMobile: mobile.isMobile
            });
          };

          // Initial setup
          handleResize();

          window.addEventListener('resize', handleResize);
          window.addEventListener('orientationchange', handleResize);

          return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
          };
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
