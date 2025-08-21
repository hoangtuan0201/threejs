import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import theatreState from "./states/FlyThrough2.json";
import { SceneManager } from "./components/SceneManager";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";

// UI Components
import LoadingScreen from "./components/LoadingScreen";
import ScrollSensitivityControl from "./components/ScrollSensitivityControl";
import ChapterNavigation from "./components/ChapterNavigation";
import NavigationGuide from "./components/NavigationGuide";
import MobileHomeButton from "./components/MobileHomeButton";
import { ThemeProvider } from "./theme/ThemeContext";

// Hooks
import { useMobile } from "./hooks/useMobile";
import useSceneLock from "./hooks/useSceneLock";

// Create Theatre.js project
const project = getProject("Fly Through", { state: theatreState });
const mainSheet = project.sheet("Scene");


// ----------------- Main App Component -----------------
export default function App({ isChatFocused = false }) {
  const [currentSheet, setCurrentSheet] = useState(mainSheet);
  const [currentScene, setCurrentScene] = useState("main");
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [showCompareSystem, setShowCompareSystem] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [currentSequencePosition, setCurrentSequencePosition] = useState(0);
  const [scrollSensitivity, setScrollSensitivity] = useState(1.0);
  const [showNavigationGuide, setShowNavigationGuide] = useState(false);

  const navigate = useNavigate();
  const mobile = useMobile();

  // Track asset loading progress from drei
  const { progress: assetProgress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);

  // Reset progress when component mounts or when navigating
  useEffect(() => {
    setDisplayProgress(0);
    setIsLoading(true);
    setModelLoaded(false);
    
    // Force reset drei progress by clearing its cache
    if (window.__drei_progress_cache) {
      window.__drei_progress_cache = null;
    }
    
    return () => {
      // Clean up on unmount
      setDisplayProgress(0);
    };
  }, []);

  // Update display progress based on asset progress with smooth transition
  useEffect(() => {
    if (assetProgress > displayProgress) {
      // Smooth increment for better UX
      const increment = Math.min(assetProgress - displayProgress, 10);
      const timer = setTimeout(() => {
        setDisplayProgress(prev => Math.min(prev + increment, assetProgress));
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(assetProgress);
    }
  }, [assetProgress, displayProgress]);

  const {
    locked: sceneLocked,
    isNavigating: sceneNavigating,
    targetPosition: sceneTargetPosition,
    startPosition: sceneStartPosition,
    startTime: sceneStartTime,
    duration: sceneDuration,
    lockScene,
    completeNavigation,
  } = useSceneLock(currentSheet, 3000);

  const handleChapterNavigation = (position, options = {}) => {
    if (options.smooth) {
      lockScene(position, {
        stepSize: options.stepSize || 0.15,
        duration: options.duration || 3000,
      });
    } else {
      lockScene(position);
    }
  };

  const endTour = () => {
    setShowControlPanel(true);
    setShowCompareSystem(false);
    setIsLoading(false);
    setModelLoaded(false);
  };

  const handleGoHome = () => navigate("/");

  const handleModelLoaded = () => {
    setModelLoaded(true);
    // Only hide loading when both model is loaded AND progress is complete
    if (displayProgress >= 100) {
        setIsLoading(false);
    }
  };

  // Hide loading screen when both conditions are met
  useEffect(() => {
    if (modelLoaded && displayProgress >= 100) {
        setIsLoading(false);
    }
  }, [modelLoaded, displayProgress]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    localStorage.removeItem("hasVisitedDetailScene");
    sessionStorage.removeItem("navigationGuideShown");
    setShowNavigationGuide(false);
  }, []);

  // Theatre.js Studio disabled for production
  // if (import.meta.env.DEV && !window.__THEATRE_ALREADY_INIT__) {
  //   studio.initialize()
  //   studio.ui.hide()
  //   studio.extend(extension);

  //   //  Force show studio UI
  //   setTimeout(() => {
  //     studio.ui.restore();
  //   }, 1000);

  //   window.__THEATRE_ALREADY_INIT__ = true;
  // }
  return (
    <ThemeProvider>
      {isLoading && <LoadingScreen progress={displayProgress >= 100 ? 1 : displayProgress / 100} />}

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
            touchAction: "none",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            WebkitTapHighlightColor: "transparent",
            userSelect: "none",
            opacity: modelLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          shadows
          dpr={[1, 1.5]}
          camera={{
            position: mobile.getCameraPosition(),
            fov: mobile.getCameraFOV(),
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
            const handleResize = () => {
              const newPosition = mobile.getCameraPosition();
              const newFOV = mobile.getCameraFOV();
              camera.position.set(...newPosition);
              camera.fov = newFOV;
              camera.aspect = window.innerWidth / window.innerHeight;
              camera.updateProjectionMatrix();
              gl.setPixelRatio(mobile.getPixelRatio());
            };
            handleResize();
            window.addEventListener("resize", handleResize);
            window.addEventListener("orientationchange", handleResize);
            return () => {
              window.removeEventListener("resize", handleResize);
              window.removeEventListener("orientationchange", handleResize);
            };
          }}
        >
          {/* Realistic Lighting */}
          <color attach="background" args={["#d0d0d0"]} />
          <ambientLight intensity={1.5 * Math.PI} />

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

            {/* Realistic Effects */}
            {/* <Effects /> */}
        </Canvas>
      )}

      <ChapterNavigation
        currentPosition={currentSequencePosition}
        onNavigate={handleChapterNavigation}
        mobile={mobile}
        isVisible={!showControlPanel && !showCompareSystem && modelLoaded && currentScene === "main"}
        isLocked={sceneLocked}
      />

      <ScrollSensitivityControl
        sensitivity={scrollSensitivity}
        onSensitivityChange={setScrollSensitivity}
        isVisible={!showControlPanel && !showCompareSystem && modelLoaded}
      />

      <MobileHomeButton
        onGoHome={handleGoHome}
        isVisible={!showControlPanel && !showCompareSystem && !showNavigationGuide}
      />

      <NavigationGuide
        isVisible={showNavigationGuide}
        onClose={() => setShowNavigationGuide(false)}
      />
    </ThemeProvider>
  );
}
