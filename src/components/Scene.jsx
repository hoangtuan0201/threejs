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

export function Scene({ isExploring, onTourEnd, onHideControlPanel, onShowControlPanel }) {
  const sheet = useCurrentSheet();
  const [activeChapter, setActiveChapter] = useState(null);
  const [targetPosition, setTargetPosition] = useState(0); // Target position for smooth scrolling
  const [selectedHotspot, setSelectedHotspot] = useState(null); // For hotspot detail popup



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

    sequenceChapters.forEach((chapter) => {
      const [start, end] = chapter.range;
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
    });
  });

  // Effect to reset when exiting explore mode
  useEffect(() => {
    if (!isExploring) {
      // Reset state when tour ends
      setActiveChapter(null);
      // Reset camera to initial position
      sheet.sequence.position = 0;
      setTargetPosition(0);
      // Show ControlPanel again when exiting explore mode
      if (onShowControlPanel) {
        onShowControlPanel();
      }
    }
  }, [isExploring]);

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
    if (!isExploring) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onTourEnd();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExploring, onTourEnd]);

  // Handle scroll for both preview and explore modes
  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();

      // console.log('Scroll detected:', event.deltaY, 'targetPosition:', targetPosition); // Debug log

      // Hide ControlPanel when starting to scroll
      if (onHideControlPanel) {
        onHideControlPanel();
      }

      const deltaY = event.deltaY;
      const scrollSensitivity = 0.002; // Scroll sensitivity

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

        // Show ControlPanel again if scrolled back to initial position
        if (newPosition === 0 && onShowControlPanel) {
          onShowControlPanel();
        }

        return newPosition;
      });
    };

    // Add listener for both document and canvas to ensure scroll capture
    const canvas = gl.domElement;
    console.log('Adding scroll listener'); // Debug log

    // Try both document and canvas
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    canvas.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      console.log('Removing scroll listener'); // Debug log
      document.removeEventListener('wheel', handleWheel, { capture: true });
      canvas.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [gl.domElement]);

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
        />
      </Suspense>

      {/* Render all hotspots from sequenceChapters - always visible when model loads */}
      <HotspotsRenderer
        sequenceChapters={sequenceChapters}
        selectedHotspot={selectedHotspot}
        onHotspotClick={(chapterId) => {
          console.log(`Hotspot clicked for chapter: ${chapterId}`);
          // Find the chapter and show hotspot details
          const chapter = sequenceChapters.find(ch => ch.id === chapterId);
          if (chapter && chapter.hotspot) {
            setSelectedHotspot(chapter);
          }
        }}
      />

      {/* Video Screen for Thermostat - show automatically when in Geom3D_393 chapter */}
      {activeChapter && activeChapter.id === "Geom3D_393" && activeChapter.videoScreen && (
        <VideoScreen
          position={activeChapter.videoScreen.position}
          videoId={activeChapter.videoScreen.videoId}
          title={activeChapter.videoScreen.title}
          size={activeChapter.videoScreen.size}
        />
      )}

      {/* Video Screen for Linear Grille - show automatically when in indoor chapter */}
      {activeChapter && activeChapter.id === "indoor" && activeChapter.videoScreen && (
        <VideoScreen
          position={activeChapter.videoScreen.position}
          videoId={activeChapter.videoScreen.videoId}
          title={activeChapter.videoScreen.title}
          size={activeChapter.videoScreen.size}
        />
      )}

      {/* Hotspot Detail Popup */}
      {selectedHotspot && selectedHotspot.hotspot && (
        <Html position={[
          selectedHotspot.hotspot.position[0],
          selectedHotspot.hotspot.position[1] + 0.4,
          selectedHotspot.hotspot.position[2]
        ]} center>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.95)",
              color: "white",
              padding: "20px",
              borderRadius: "12px",
              maxWidth: "400px",
              minWidth: "320px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              position: "relative",
              zIndex: 1000,
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedHotspot(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>

            {/* Title */}
            <h3 style={{
              margin: "0 0 12px 0",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#fff"
            }}>
              {selectedHotspot.hotspot.title}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: "14px",
              lineHeight: "1.6",
              margin: "0 0 16px 0",
              opacity: 0.9
            }}>
              {selectedHotspot.hotspot.description}
            </p>

            {/* Action Buttons */}
            <div style={{
              display: "flex",
              gap: "12px",
              flexDirection: "column"
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
                    gap: '8px',
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
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
                  <span style={{
                    display: 'inline-block',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    textAlign: 'center',
                    lineHeight: '14px',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>i</span>
                  View Technical Specifications
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
