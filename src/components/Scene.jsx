import { Suspense, useState, useEffect } from "react";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { Html } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";

import { Model } from "./Model";
import { VideoScreen } from "./VideoScreen";
import { sequenceChapters } from "../data/sequenceChapters";


// Hotspots component - separated and always rendered as 3D objects
const HotspotsRenderer = ({ sequenceChapters, onHotspotClick, selectedHotspot }) => {
  return (
    <>
      {sequenceChapters && sequenceChapters.length > 0 && (
        sequenceChapters
          .filter(chapter => chapter.hotspot) // Only chapters with hotspot data
          .map((chapter) => (
            <group
              key={`hotspot-${chapter.id}`}
              position={chapter.hotspot.position || [0, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onHotspotClick(chapter.id);
              }}
            >
              {/* 3D "i" shape for hotspot - created with simple geometry */}
              <group>
                {/* Dot of "i" */}
                <mesh position={[0, 0.15, 0]}>
                  <sphereGeometry args={[0.03, 8, 8]} />
                  <meshBasicMaterial color="white" />
                </mesh>

                {/* Stem of "i" */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
                  <meshBasicMaterial color="white" />
                </mesh>
              </group>

              {/* HTML label attached to the 3D "i" - show hotspot title only when not selected */}
              {(!selectedHotspot || selectedHotspot.id !== chapter.id) && (
                <Html distanceFactor={10} position={[0, 0.3, 0]}>
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '1px 4px', // Smaller padding
                      borderRadius: '3px', // Smaller border radius
                      fontSize: '8px', // Smaller font size
                      fontWeight: 'bold',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)', // Smaller shadow
                      border: '1px solid rgba(255,255,255,0.2)',
                      opacity: 0.8,
                    }}
                  >
                    {chapter.hotspot.title || chapter.title || `H${chapter.id}`}
                  </div>
                </Html>
              )}
            </group>
          ))
      )}
    </>
  );
};

export function Scene({ onTourEnd, onHideControlPanel, onShowControlPanel, isExploreMode, onModelLoaded }) {
  const sheet = useCurrentSheet();
  const [activeChapter, setActiveChapter] = useState(null);
  const [targetPosition, setTargetPosition] = useState(0); // Target position for smooth scrolling
  const [selectedHotspot, setSelectedHotspot] = useState(null); // For hotspot detail popup
  const [showVideoScreen, setShowVideoScreen] = useState(null); // Control video screen visibility

  const { gl } = useThree();

  // Smooth scrolling with useFrame for both preview and explore modes
  useFrame(() => {
    if (targetPosition !== sheet.sequence.position) {
      const diff = targetPosition - sheet.sequence.position;
      const speed = 0.03; // Smooth scrolling speed

      if (Math.abs(diff) > 0.001) {
        sheet.sequence.position += diff * speed;
      } else {
        sheet.sequence.position = targetPosition;
      }
    }

    // Auto-show/hide active chapter based on scroll position
    const currentPosition = sheet.sequence.position;

    // Manual range definitions since removed from data
    const chapterRanges = {
      "Geom3D_393": [0.3, 1],
      "indoor": [1, 2],
      "Air Purification": [2, 4],
      "Outdoor": [4, 5]
    };

    sequenceChapters.forEach((chapter) => {
      const range = chapterRanges[chapter.id];
      if (range) {
        const [start, end] = range;
        const isInRange = currentPosition >= start && currentPosition <= (end + 0.2);

        // Set active chapter when entering sequence range
        if (isInRange) {
          if (chapter.id === "Geom3D_393" || chapter.id === "indoor") {
            setActiveChapter(chapter);
          }
        } else {
          // Clear active chapter when leaving sequence range
          if ((chapter.id === "Geom3D_393" && activeChapter?.id === "Geom3D_393") ||
              (chapter.id === "indoor" && activeChapter?.id === "indoor")) {
            setActiveChapter(null);
          }
        }
      }
    });
  });

  // Reset function for tour end
  const resetScene = () => {
    setActiveChapter(null);
    setSelectedHotspot(null);
    setShowVideoScreen(null);
    // Reset camera to initial position
    sheet.sequence.position = 0;
    setTargetPosition(0);
    // Show ControlPanel again
    if (onShowControlPanel) {
      onShowControlPanel();
    }
  };

  // Initialize targetPosition
  useEffect(() => {
    const currentPos = sheet.sequence.position;
    console.log('Initializing targetPosition - sheet.sequence.position:', currentPos, 'type:', typeof currentPos);

    if (isNaN(currentPos) || currentPos === undefined) {
      console.log('Setting targetPosition to 0 (fallback)');
      setTargetPosition(0);
    } else {
      console.log('Setting targetPosition to:', currentPos);
      setTargetPosition(currentPos);
    }
  }, [sheet.sequence]);

  // Keyboard navigation for escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        resetScene();
        if (onTourEnd) {
          onTourEnd();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onTourEnd]);

  // Handle scroll only in explore mode
  useEffect(() => {
    const handleWheel = (event) => {
      // Only allow scroll if in explore mode
      if (!isExploreMode) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      // console.log('Scroll detected:', event.deltaY, 'targetPosition:', targetPosition); // Debug log

      // Hide ControlPanel when starting to scroll
      if (onHideControlPanel) {
        onHideControlPanel();
      }

      const deltaY = event.deltaY;
      const scrollSensitivity = window.innerWidth < 768 ? 0.003 : 0.002; // More sensitive on mobile

      // Use functional update to ensure latest value
      setTargetPosition(prevTarget => {
        // Check targetPosition before calculation
        if (isNaN(prevTarget)) {
          console.warn('prevTarget is NaN, resetting to 0');
          return 0;
        }

        // Calculate new position based on current targetPosition
        let newPosition = prevTarget + (deltaY * scrollSensitivity);

        // Limit within range [0, 6] (entire sequence)
        newPosition = Math.max(0, Math.min(6, newPosition));

        // console.log('Setting target position from', prevTarget, 'to:', newPosition); // Debug log



        return newPosition;
      });
    };

    // Touch handling for mobile devices
    let touchStartY = 0;

    const handleTouchStart = (event) => {
      if (!isExploreMode) return;
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
      if (!isExploreMode) return;

      event.preventDefault();

      const touchY = event.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const touchSensitivity = 0.005; // Touch sensitivity

      if (Math.abs(deltaY) > 10) { // Minimum threshold for touch movement
        setTargetPosition(prevTarget => {
          if (isNaN(prevTarget)) {
            return 0;
          }

          let newPosition = prevTarget + (deltaY * touchSensitivity);
          newPosition = Math.max(0, Math.min(6, newPosition));

          return newPosition;
        });

        touchStartY = touchY; // Reset for continuous scrolling
      }
    };

    // Add listeners for both mouse and touch
    const canvas = gl.domElement;
    console.log('Adding scroll and touch listeners');

    // Mouse wheel events
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    canvas.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      console.log('Removing scroll and touch listeners');
      document.removeEventListener('wheel', handleWheel, { capture: true });
      canvas.removeEventListener('wheel', handleWheel, { capture: true });
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gl.domElement, onHideControlPanel, onShowControlPanel, isExploreMode]);

  return (
    <>
      <color attach="background" args={["#84a4f4"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} />
      <fog attach="fog" color="#84a4f4" near={0} far={40} />



      <Suspense fallback={null}>
        <Model
          sequenceChapters={sequenceChapters}
          sequencePosition={sheet.sequence.position}
          onChapterClick={(chapterId) => {
            console.log(`Model chapter clicked: ${chapterId}`);
          }}
          onMeshClick={(meshName) => {
            console.log(`Mesh clicked: ${meshName}`);
          }}
          onModelLoaded={onModelLoaded}
        />
      </Suspense>

      {/* Render all hotspots from sequenceChapters - always visible when model loads */}
      <HotspotsRenderer
        sequenceChapters={sequenceChapters}
        selectedHotspot={selectedHotspot}
        onHotspotClick={(chapterId) => {
          console.log(`Hotspot clicked for chapter: ${chapterId}`);
          // Find the chapter and show hotspot details + video screen
          const chapter = sequenceChapters.find(ch => ch.id === chapterId);
          if (chapter && chapter.hotspot) {
            setSelectedHotspot(chapter);
            // Show video screen when hotspot is clicked
            if (chapter.videoScreen) {
              setShowVideoScreen(chapter);
            }
          }
        }}
      />

      {/* Video Screen - show only when hotspot is clicked */}
      {showVideoScreen && showVideoScreen.videoScreen && (
        <VideoScreen
          position={showVideoScreen.videoScreen.position}
          rotation={showVideoScreen.videoScreen.rotation}
          videoId={showVideoScreen.videoScreen.videoId}
          title={showVideoScreen.videoScreen.title}
          size={showVideoScreen.videoScreen.size}
        />
      )}

      {/* Hotspot Detail Popup */}
      {selectedHotspot && selectedHotspot.hotspot && (
        <group
          position={selectedHotspot.hotspot.detailPosition || selectedHotspot.hotspot.position}
          rotation={selectedHotspot.hotspot.detailRotation || selectedHotspot.hotspot.rotation || [0, Math.PI / 1.8, 0]}
        >
          <Html
            position={[0, 0, 0]}
            center
            distanceFactor={2}
            transform
            occlude
          >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.95)",
              color: "white",
              padding: "7px",
              borderRadius: "8px",
              minWidth: "200px", // Minimum width
              maxWidth: "250px", // Maximum width
              width: "auto", // Auto width based on content
              height: "auto", // Auto height based on content
              minHeight: "80px", // Minimum height
              maxHeight: "180px", // Maximum height
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              position: "relative",
              zIndex: 1000,
              overflow: "hidden",
              wordWrap: "break-word", // Break long words
            }}
          >
            {/* Close button */}
            <button
              onClick={() => {
                setSelectedHotspot(null);
                setShowVideoScreen(null); // Also hide video screen
              }}
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                width: "20px", // Smaller button
                height: "18px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "12px", // Smaller font
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>

            {/* Title */}
            <h3 style={{
              margin: "0 0 6px 0", // Smaller margin
              fontSize: "11px", // Smaller font
              fontWeight: "bold",
              color: "#fff"
            }}>
              {selectedHotspot.hotspot.title}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: "8px",
              lineHeight: "1.4",
              margin: "0 0 12px 0",
              opacity: 0.9,
              wordWrap: "break-word",
              overflowWrap: "break-word",
              hyphens: "auto"
            }}>
              {selectedHotspot.hotspot.description}
            </p>

            {/* Action Buttons */}
            <div style={{
              display: "flex",
              gap: "6px",
              flexDirection: "column",
              marginTop: "8px" // Natural flow instead of absolute positioning
            }}>
              {/* Technical Specifications Link */}
              {selectedHotspot.hotspot.link && (
                <button
                  onClick={() => {
                    window.open(selectedHotspot.hotspot.link, '_blank');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px', // Even smaller gap
                    width: '100%',
                    padding: '6px 8px', // Even smaller padding
                    fontSize: '10px', // Even smaller font
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px', // Smaller border radius
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                >
         
                  Specification
                </button>
              )}

            </div>

            {/* Arrow pointer */}
            <div
              style={{
                position: "absolute",
                bottom: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "0",
                height: "0",
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid rgba(0, 0, 0, 0.95)",
              }}
            />
          </div>
        </Html>
        </group>
      )}

      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        position={[0, 0, 10]}
        fov={60}
      />


    </>
  );
}
