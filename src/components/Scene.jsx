import { Suspense, useState, useEffect } from "react";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { Html } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";

import { Model } from "./Model";
import { VideoScreen } from "./VideoScreen";
import { PositionPicker } from "./PositionPicker";
import { sequenceChapters } from "../data/sequenceChapters";


// Hotspots component - separated and always rendered as 3D objects
const HotspotsRenderer = ({ sequenceChapters, onHotspotClick }) => {
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

              {/* HTML label attached to the 3D "i" - show hotspot title */}
              <Html distanceFactor={10} position={[0, 0.3, 0]}>
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    opacity: 0.8,
                  }}
                >
                  {chapter.hotspot.title || chapter.title || `H${chapter.id}`}
                </div>
              </Html>
            </group>
          ))
      )}
    </>
  );
};

export function Scene({ isExploring, onTourEnd, onHideControlPanel, onShowControlPanel, positionPickerEnabled }) {
  const sheet = useCurrentSheet();
  const [activeChapter, setActiveChapter] = useState(null);
  const [targetPosition, setTargetPosition] = useState(0); // Target position for smooth scrolling

  // Handle position picked from PositionPicker
  const handlePositionPicked = (position) => {
    console.log('Position picked:', position);
    // You can add this position to your sequenceChapters or use it for hotspot placement
  };

  const { gl } = useThree();

  // Smooth scrolling with useFrame for both preview and explore modes
  useFrame(() => {
    if (targetPosition !== sheet.sequence.position) {
      const diff = targetPosition - sheet.sequence.position;
      const speed = 0.05; // Smooth scrolling speed

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

      console.log('Scroll detected:', event.deltaY, 'targetPosition:', targetPosition); // Debug log

      // Hide ControlPanel when starting to scroll
      if (onHideControlPanel) {
        onHideControlPanel();
      }

      const deltaY = event.deltaY;
      const scrollSensitivity = 0.003; // Scroll sensitivity

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

        console.log('Setting target position from', prevTarget, 'to:', newPosition); // Debug log

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
        onHotspotClick={(chapterId) => {
          console.log(`Hotspot clicked for chapter: ${chapterId}`);
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



      
      

      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        position={[0, 0, 10]}
        fov={60}
      />

      {/* Position Picker - show only in explore mode */}
      {isExploring && (
        <PositionPicker
          isEnabled={positionPickerEnabled}
          onPositionPicked={handlePositionPicked}
        />
      )}
    </>
  );
}
