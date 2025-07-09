import { useState, useRef, useEffect } from 'react';
import { SheetProvider } from "@theatre/r3f";
import { Scene } from './Scene';
import { HotspotDetailScene } from './HotspotDetailScene';

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
  const [currentScene, setCurrentScene] = useState('main'); // 'main' or 'detail'
  const [activeHotspotChapter, setActiveHotspotChapter] = useState(null);
  const [justReturnedFromDetail, setJustReturnedFromDetail] = useState(false); // Track when just returned
  const [hasVisitedDetailScene, setHasVisitedDetailScene] = useState(() => {
    // Check localStorage for persistent flag (auto-cleared on page load)
    const visited = localStorage.getItem('hasVisitedDetailScene') === 'true';
    return visited;
  }); // Flag that resets on page refresh

  // Create sheets from the passed project
  const mainSheet = project.sheet("Scene");
  const detailSheet = project.sheet("DetailScene");

  const savedMainSceneState = useRef(null); // Store main scene camera state

  // Check for saved position on component mount
  useEffect(() => {
    const checkSavedPosition = () => {
      try {
        const savedState = localStorage.getItem('lastHotspotPosition');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          const now = Date.now();
          const savedTime = parsedState.timestamp || 0;
          const timeDiff = now - savedTime;

          // Only restore if saved within last 24 hours (86400000 ms)
          if (timeDiff < 86400000) {
            // Don't auto-restore on startup, just keep it available
          } else {
            localStorage.removeItem('lastHotspotPosition');
          }
        }
      } catch (error) {
        console.error('❌ Error checking saved position:', error);
        localStorage.removeItem('lastHotspotPosition');
      }
    };

    checkSavedPosition();
  }, []);

  // Expose current sheet and scene to parent
  useEffect(() => {
    const currentSheet = currentScene === 'detail' ? detailSheet : mainSheet;

    if (onCurrentSheetChange) {
      onCurrentSheetChange(currentSheet);
    }
    if (onCurrentSceneChange) {
      onCurrentSceneChange(currentScene);
    }
  }, [currentScene, onCurrentSheetChange, onCurrentSceneChange]);

  // Handle hotspot click to switch to detail scene
  const handleHotspotDetailRequest = (chapter, mainSceneState) => {
    if (chapter && chapter.id === "Geom3D_393") {

      // Mark that user has visited detail scene (permanent flag)
      setHasVisitedDetailScene(true);
      localStorage.setItem('hasVisitedDetailScene', 'true');

      // Save main scene state before switching
      savedMainSceneState.current = mainSceneState;

      // Also save to localStorage for persistence
      if (mainSceneState) {
        const stateToSave = {
          position: {
            x: mainSceneState.position.x,
            y: mainSceneState.position.y,
            z: mainSceneState.position.z
          },
          target: mainSceneState.target ? {
            x: mainSceneState.target.x,
            y: mainSceneState.target.y,
            z: mainSceneState.target.z
          } : null,
          sequencePosition: mainSceneState.sequencePosition,
          timestamp: Date.now()
        };
        localStorage.setItem('lastHotspotPosition', JSON.stringify(stateToSave));
      }

      setActiveHotspotChapter(chapter);
      setCurrentScene('detail');
    }
  };

  // Handle return to main scene with smooth transition
  const handleReturnToMain = () => {

    // Try to get saved state from memory first, then localStorage
    let stateToRestore = savedMainSceneState.current;

    if (!stateToRestore) {
      // Try to restore from localStorage
      try {
        const savedState = localStorage.getItem('lastHotspotPosition');
        if (savedState) {
          const parsedState = JSON.parse(savedState);

          // Convert back to the expected format
          stateToRestore = {
            position: {
              x: parsedState.position.x,
              y: parsedState.position.y,
              z: parsedState.position.z,
              clone: () => ({ x: parsedState.position.x, y: parsedState.position.y, z: parsedState.position.z })
            },
            target: parsedState.target ? {
              x: parsedState.target.x,
              y: parsedState.target.y,
              z: parsedState.target.z,
              clone: () => ({ x: parsedState.target.x, y: parsedState.target.y, z: parsedState.target.z })
            } : null,
            sequencePosition: parsedState.sequencePosition
          };

          // Update the ref with restored state
          savedMainSceneState.current = stateToRestore;
        }
      } catch (error) {
        console.error('❌ Error parsing localStorage state:', error);
      }
    }



    // Use requestAnimationFrame for smooth scene transition
    requestAnimationFrame(() => {
      setJustReturnedFromDetail(true); // Mark that we just returned
      setCurrentScene('main');
      setActiveHotspotChapter(null);
      // savedMainSceneState will be used by Scene component to restore position
    });
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
        shouldRestorePosition={currentScene === 'main' && justReturnedFromDetail}
        savedSceneState={savedMainSceneState.current}
        hasVisitedDetailScene={hasVisitedDetailScene}
        onSceneStateCleared={() => {
          savedMainSceneState.current = null;
          setJustReturnedFromDetail(false); // Clear the flag after restore
          // Clear localStorage after successful restore
          localStorage.removeItem('lastHotspotPosition');
        }}
      />
    </SheetProvider>
  );
}
