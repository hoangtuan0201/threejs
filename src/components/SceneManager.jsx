import { useEffect } from 'react';
import { SheetProvider } from "@theatre/r3f";
import { useThree, useFrame } from "@react-three/fiber";
import { Scene } from './Scene';
import { useMobile } from "../hooks/useMobile";

// FOV Manager Component to handle FOV
function FOVManager() {
  const { camera } = useThree();
  const mobile = useMobile();

  // Force update FOV when component mounts
  useEffect(() => {
    if (camera) {
      // Delay to ensure Theatre.js has finished restoring
      const timeoutId = setTimeout(() => {
        const targetFOV = mobile.getCameraFOV();
        if (Math.abs(camera.fov - targetFOV) > 0.1) {
          camera.fov = targetFOV;
          camera.updateProjectionMatrix();
        }
      }, 150); // Small delay to let Theatre.js finish

      return () => clearTimeout(timeoutId);
    }
  }, [camera, mobile]);

  // Continuous FOV monitoring
  useFrame(() => {
    if (camera) {
      const targetFOV = mobile.getCameraFOV();
      if (Math.abs(camera.fov - targetFOV) > 1) {
        camera.fov = targetFOV;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}

export function SceneManager({
  onTourEnd,
  onHideControlPanel,
  onShowControlPanel,
  isExploreMode,
  onModelLoaded,
  onPositionChange,
  isNavigating,
  navigationData,
  scrollSensitivity,
  onShowNavigationGuide,
  showNavigationGuide,
  isChatFocused,
  onCurrentSheetChange, // New prop to expose current sheet
  onCurrentSceneChange, // New prop to expose current scene
  project // Receive project from App.jsx
}) {
  // Create main sheet from the passed project
  const mainSheet = project.sheet("Scene");



  // Expose current sheet to parent
  useEffect(() => {
    if (onCurrentSheetChange) {
      onCurrentSheetChange(mainSheet);
    }
    if (onCurrentSceneChange) {
      onCurrentSceneChange('main');
    }
  }, [onCurrentSheetChange, onCurrentSceneChange, mainSheet]);



  // Main scene only
  return (
    <SheetProvider sheet={mainSheet}>
      <FOVManager currentScene="main" />
      <Scene
        onTourEnd={onTourEnd}
        onHideControlPanel={onHideControlPanel}
        onShowControlPanel={onShowControlPanel}
        isExploreMode={isExploreMode}
        onModelLoaded={onModelLoaded}
        onPositionChange={onPositionChange}
        isNavigating={isNavigating}
        navigationData={navigationData}
        scrollSensitivity={scrollSensitivity}
        onShowNavigationGuide={onShowNavigationGuide}
        showNavigationGuide={showNavigationGuide}
        isChatFocused={isChatFocused}
      />
    </SheetProvider>
  );
}
