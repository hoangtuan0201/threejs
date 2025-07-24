import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import theatreState from "./states/FlyThrough2.json";
import { SceneManager } from "./components/SceneManager";

// Create project and main sheet for initial state
const project = getProject("Fly Through", { state: theatreState });
const mainSheet = project.sheet("Scene");

import LoadingScreen from "./components/LoadingScreen";
import ScrollSensitivityControl from "./components/ScrollSensitivityControl";
import ChapterNavigation from "./components/ChapterNavigation";

import NavigationGuide from "./components/NavigationGuide";
import MobileHomeButton from "./components/MobileHomeButton";

import { ThemeProvider } from "./theme/ThemeContext";


import { useMobile } from "./hooks/useMobile";
import useSceneLock from "./hooks/useSceneLock";

// // Theatre.js Studio disabled for production
//  if (import.meta.env.DEV && !window.__THEATRE_ALREADY_INIT__) {
  studio.initialize()
  studio.ui.hide()
  //  studio.extend(extension);

   // Force show studio UI
  //  setTimeout(() => {
  //    studio.ui.restore();
  //  }, 1000);

//   // Add export function for development
//   window.exportTheatreState = () => {
//     const state = project.getState();
//     console.log('Theatre.js State:', JSON.stringify(state, null, 2));

//     // Download as file
//     const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'FlyThrough.json';
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//    window.__THEATRE_ALREADY_INIT__ = true;
//  }

export default function App({ isChatFocused = false }) {
  // Current sheet from SceneManager - initialize with mainSheet
  const [currentSheet, setCurrentSheet] = useState(mainSheet);
  const [currentScene, setCurrentScene] = useState('main'); // Track current scene


  const navigate = useNavigate();
  const [showControlPanel, setShowControlPanel] = useState(false); // Start with 3D experience
  const [showCompareSystem, setShowCompareSystem] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start loading immediately
  const [modelLoaded, setModelLoaded] = useState(false);
  const [currentSequencePosition, setCurrentSequencePosition] = useState(0);
  const [scrollSensitivity, setScrollSensitivity] = useState(1.0);
  const [showNavigationGuide, setShowNavigationGuide] = useState(false); // Force disabled

  // Add global functions for navigation guide control
  useEffect(() => {
    // Auto-clear hasVisitedDetailScene on page load to allow navigation guide
    localStorage.removeItem('hasVisitedDetailScene');

    // Also clear any session-based navigation flags
    sessionStorage.removeItem('navigationGuideShown');

    // Immediately close any existing navigation guide
    setShowNavigationGuide(false);

 



   

    // Auto-close navigation guide after 8 seconds if still showing
    if (showNavigationGuide) {
      const autoCloseTimer = setTimeout(() => {
        setShowNavigationGuide(false);
      }, 10000); // 8 seconds to give user time to read

      return () => clearTimeout(autoCloseTimer);
    }
  }, []); // Empty dependency array to run only once


  // Mobile detection and responsive utilities
  const mobile = useMobile();

  // Scene lock hook for chapter navigation
  const {
    locked: sceneLocked,
    isNavigating: sceneNavigating,
    targetPosition: sceneTargetPosition,
    startPosition: sceneStartPosition,
    startTime: sceneStartTime,
    duration: sceneDuration,
    lockScene,
    completeNavigation,
  } = useSceneLock(currentSheet, 3000); // Use current sheet from SceneManager

  // Chapter navigation function - useSceneLock approach with smooth option
  const handleChapterNavigation = (position, options = {}) => {
    if (options.smooth) {
      // For smooth navigation, use reduced step size and custom duration
      lockScene(position, {
        stepSize: options.stepSize || 0.15,
        duration: options.duration || 3000
      });
    } else {
      // Default discrete navigation
      lockScene(position);
    }
  };



  const endTour = () => {
    setShowControlPanel(true);
    setShowCompareSystem(false);
    setIsLoading(false);
    setModelLoaded(false);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleModelLoaded = () => {
    // Add small delay to ensure scene is properly rendered before showing
    setTimeout(() => {
      setModelLoaded(true);
      setIsLoading(false);
    }, 200); // Small delay to ensure proper scene initialization
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <ThemeProvider>
      {/* App.jsx now only handles 3D experience */}

      {/* Loading Screen */}
      {isLoading && !modelLoaded && <LoadingScreen />}

    

      {/* Canvas - show when not showing control panel, but hide with opacity until model loads */}
      {!showControlPanel && !showCompareSystem && (
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
            far: 1000,
          }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
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

            
            };

            // Initial setup
            handleResize();

            window.addEventListener("resize", handleResize);
            window.addEventListener("orientationchange", handleResize);

            return () => {
              window.removeEventListener("resize", handleResize);
              window.removeEventListener("orientationchange", handleResize);
            };
          }}
        >
          <SceneManager
            onTourEnd={endTour}
            onHideControlPanel={() => setShowControlPanel(false)}
            onShowControlPanel={() => setShowControlPanel(true)}
            isExploreMode={!showControlPanel}
            onModelLoaded={handleModelLoaded}
            onPositionChange={setCurrentSequencePosition}
            isNavigating={sceneLocked}
            scrollSensitivity={scrollSensitivity}
            onShowNavigationGuide={useCallback(() => setShowNavigationGuide(true), [])}
            onHideNavigationGuide={useCallback(() => setShowNavigationGuide(false), [])}
            showNavigationGuide={showNavigationGuide}
            isChatFocused={isChatFocused}
            navigationData={{
              isNavigating: sceneNavigating,
              targetPosition: sceneTargetPosition,
              startPosition: sceneStartPosition,
              startTime: sceneStartTime,
              duration: sceneDuration,
              onComplete: completeNavigation,
            }}
            onCurrentSheetChange={setCurrentSheet}
            onCurrentSceneChange={setCurrentScene}
            project={project}
          />
        </Canvas>
      )}

      {/* Chapter Navigation - show when in explore mode and model is loaded, hide in detail scene */}
      <ChapterNavigation
        currentPosition={currentSequencePosition}
        onNavigate={handleChapterNavigation}
        mobile={mobile}
        isVisible={!showControlPanel && !showCompareSystem && modelLoaded && currentScene === 'main'}
        isLocked={sceneLocked}
      />

      {/* Scroll Sensitivity Control */}
      <ScrollSensitivityControl
        sensitivity={scrollSensitivity}
        onSensitivityChange={setScrollSensitivity}
        isVisible={!showControlPanel && !showCompareSystem && modelLoaded}
      />



      {/* Mobile Home Button - Only visible in 3D explore mode */}
      <MobileHomeButton
        onGoHome={handleGoHome}
        isVisible={!showControlPanel && !showCompareSystem && !showNavigationGuide}
      />

      {/* Navigation Guide Popup */}
      <NavigationGuide
        isVisible={showNavigationGuide}
        onClose={() => setShowNavigationGuide(false)}
      />
    </ThemeProvider>
  );
}
