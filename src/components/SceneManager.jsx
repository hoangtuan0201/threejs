import { useState, useRef } from 'react';
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import { Scene } from './Scene';
import { HotspotDetailScene } from './HotspotDetailScene';
import theatreState from "../states/FlyThrough.json";
import "../utils/theatreHelper.js"; // Import helper for state export

// Create multiple sheets for different scenes
const project = getProject("Fly Through", { state: theatreState });
const mainSheet = project.sheet("Scene");
const detailSheet = project.sheet("DetailScene");

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
  isChatFocused 
}) {
  const [currentScene, setCurrentScene] = useState('main'); // 'main' or 'detail'
  const [activeHotspotChapter, setActiveHotspotChapter] = useState(null);
  const savedMainSceneState = useRef(null); // Store main scene camera state

  // Handle hotspot click to switch to detail scene
  const handleHotspotDetailRequest = (chapter, mainSceneState) => {
    if (chapter && chapter.id === "Geom3D_393") {
      // Save main scene state before switching
      savedMainSceneState.current = mainSceneState;
      setActiveHotspotChapter(chapter);
      setCurrentScene('detail');
    }
  };

  // Handle return to main scene
  const handleReturnToMain = () => {
    setCurrentScene('main');
    setActiveHotspotChapter(null);
    // savedMainSceneState will be used by Scene component to restore position
  };

  // Render detail scene
  if (currentScene === 'detail' && activeHotspotChapter) {
    return (
      <SheetProvider sheet={detailSheet}>
        <HotspotDetailScene
          chapter={activeHotspotChapter}
          onReturnToMain={handleReturnToMain}
          onModelLoaded={onModelLoaded}
          isChatFocused={isChatFocused}
          savedMainSceneState={savedMainSceneState.current}
        />
      </SheetProvider>
    );
  }

  // Default main scene
  return (
    <SheetProvider sheet={mainSheet}>
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
        onHotspotDetailRequest={handleHotspotDetailRequest}
        shouldRestorePosition={currentScene === 'main' && savedMainSceneState.current}
        savedSceneState={savedMainSceneState.current}
        onSceneStateCleared={() => { savedMainSceneState.current = null; }}
      />
    </SheetProvider>
  );
}
