import { Suspense, useState, useEffect } from "react";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { Html } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";

import { Model } from "./Model";
import { VideoScreen } from "./VideoScreen";
import { HotspotDetail } from "./HotspotDetail";
import { HotspotLighting } from "./HotspotLighting";
import { sequenceChapters } from "../data/sequenceChapters";
import { useMobile } from "../hooks/useMobile";



// Hotspots component - separated and always rendered as 3D objects
const HotspotsRenderer = ({ sequenceChapters, onHotspotClick, selectedHotspot, mobile }) => {
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
                // console.log('Hotspot group clicked:', chapter.id);
                onHotspotClick(chapter.id);
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                // console.log('Hotspot pointer down:', chapter.id);
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
                <Html distanceFactor={10} position={[0, 0.3, 0]} occlude>
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: mobile.isMobile ? '4px 10px' : '2px 6px', // Larger padding for better readability
                      borderRadius: mobile.isMobile ? '6px' : '4px', // Larger border radius on mobile
                      fontSize: mobile.isMobile ? '14px' : '10px', // Larger font size for better readability
                      fontWeight: 'bold',
                      pointerEvents: 'auto', // Enable pointer events for clicking
                      whiteSpace: 'nowrap',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      opacity: 0.9,
                      cursor: 'pointer', // Show pointer cursor
                      transition: 'all 0.2s ease', // Smooth hover effect
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onHotspotClick(chapter.id);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(0, 0, 0, 0.95)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(0, 0, 0, 0.8)';
                      e.target.style.transform = 'scale(1)';
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


  // Mobile detection and responsive utilities
  const mobile = useMobile();

  const { gl, camera } = useThree();

  // Update camera position based on mobile detection (optimized)
  useEffect(() => {
    const newFOV = mobile.getCameraFOV();

    // Only update FOV, let Theatre.js handle position
    if (camera.fov !== newFOV) {
      camera.fov = newFOV;
      camera.updateProjectionMatrix();
    }
  }, [camera, mobile.isMobile]);

  // Handle resize events (optimized)
  useEffect(() => {
    const handleResize = () => {
      const newFOV = mobile.getCameraFOV();

      // Only update FOV and aspect ratio
      camera.fov = newFOV;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [camera, mobile.getCameraFOV]);

  // Temporarily disabled useFrame for Theatre.js sequence editing
  useFrame(({ camera }) => {
    // Let Theatre.js control camera position, only override FOV for mobile
    const targetFOV = mobile.getCameraFOV();

    // Only update FOV, let Theatre.js handle position
    if (camera.fov !== targetFOV) {
      camera.fov = targetFOV;
      camera.updateProjectionMatrix();
    }

    // Debug log removed for performance

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
      "indoor": [1, 2.4],
      "Air Purification": [3, 4.3],
      "Outdoor": [4.3, 6.5]
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

  // Initialize targetPosition and ensure proper sequence start
  useEffect(() => {
    const currentPos = sheet.sequence.position;
    // console.log('Initializing targetPosition - sheet.sequence.position:', currentPos, 'type:', typeof currentPos);

    if (isNaN(currentPos) || currentPos === undefined) {
      // console.log('Setting targetPosition to 0 (fallback)');
      sheet.sequence.position = 0; // Ensure Theatre.js sequence starts at 0
      setTargetPosition(0);
    } else {
      // console.log('Setting targetPosition to:', currentPos);
      setTargetPosition(currentPos);
    }
  }, [sheet.sequence]);

  // Ensure proper initialization when entering explore mode
  useEffect(() => {
    if (isExploreMode) {
      // Force Theatre.js sequence to start at position 0 when entering explore mode
      // Add small delay to ensure Theatre.js is ready
      setTimeout(() => {
        sheet.sequence.position = 0;
        setTargetPosition(0);
        // Sequence reset to 0
      }, 50);
    }
  }, [isExploreMode, sheet.sequence]);

  // Force initial sequence position when component mounts
  useEffect(() => {
    // Ensure sequence starts at 0 on mount
    const initializeSequence = () => {
      if (sheet && sheet.sequence) {
        sheet.sequence.position = 0;
        setTargetPosition(0);
        // Scene mounted - sequence initialized to 0
      }
    };

    // Run immediately and with a small delay to ensure Theatre.js is ready
    initializeSequence();
    const timer = setTimeout(initializeSequence, 100);

    return () => clearTimeout(timer);
  }, [sheet]);

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
      const scrollSensitivity = mobile.getTouchSensitivity() * 0.4; // Responsive scroll sensitivity

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
        newPosition = Math.max(0, Math.min(6.7, newPosition));

        // console.log('Setting target position from', prevTarget, 'to:', newPosition); // Debug log



        return newPosition;
      });
    };

    // Enhanced touch handling for mobile devices
    let touchStartY = 0;
    let touchStartX = 0;
    let lastTouchTime = 0;
    let touchVelocity = 0;
    let isTouching = false;
    let hasMovedSignificantly = false;

    const handleTouchStart = (event) => {
      if (!isExploreMode) return;

      const touch = event.touches[0];
      touchStartY = touch.clientY;
      touchStartX = touch.clientX;
      lastTouchTime = Date.now();
      touchVelocity = 0;
      isTouching = true;
      hasMovedSignificantly = false;

      // console.log('Touch start:', { touchStartY, touchStartX }); // Debug log

      // Don't prevent default to allow object clicks
      // event.preventDefault();
    };

    const handleTouchMove = (event) => {
      if (!isExploreMode || !isTouching) return;

      const touch = event.touches[0];
      const touchY = touch.clientY;
      const touchX = touch.clientX;
      const deltaY = touchStartY - touchY;
      const deltaX = Math.abs(touchStartX - touchX);
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTouchTime;

      // Calculate velocity for momentum
      if (timeDelta > 0) {
        touchVelocity = deltaY / timeDelta;
      }

      // Reduced touch sensitivity for mobile
      const touchSensitivity = mobile.isMobile ? 0.003 : 0.003; // Lower sensitivity for mobile

      // console.log('Touch move:', { deltaY, deltaX, touchSensitivity }); // Debug log

      // Only process vertical swipes (ignore horizontal) and only if significant movement
      if (deltaX < 50 && Math.abs(deltaY) > 3) { // Very low threshold for swipe detection
        hasMovedSignificantly = true;

        // Only prevent default when we're actually scrolling
        event.preventDefault();
        event.stopPropagation();

        setTargetPosition(prevTarget => {
          if (isNaN(prevTarget)) {
            return 0;
          }

          let newPosition = prevTarget + (deltaY * touchSensitivity);
          newPosition = Math.max(0, Math.min(6, newPosition));

          // console.log('Setting position from touch:', prevTarget, '->', newPosition); // Debug log

          return newPosition;
        });

        touchStartY = touchY;
        touchStartX = touchX;
        lastTouchTime = currentTime;
      }
    };

    const handleTouchEnd = () => {
      if (!isExploreMode) return;

      isTouching = false;

      // console.log('Touch end, velocity:', touchVelocity, 'hasMovedSignificantly:', hasMovedSignificantly); // Debug log

      // Add momentum scrolling for smooth experience - only if we actually swiped
      if (hasMovedSignificantly && Math.abs(touchVelocity) > 0.05) { // Lower threshold for momentum
        const momentum = touchVelocity * 0.5; // Increased momentum
        setTargetPosition(prevTarget => {
          if (isNaN(prevTarget)) {
            return 0;
          }

          let newPosition = prevTarget + momentum;
          newPosition = Math.max(0, Math.min(6, newPosition));

          // console.log('Momentum scroll:', prevTarget, '->', newPosition); // Debug log

          return newPosition;
        });
      }

      touchVelocity = 0;
    };

    // Add listeners for both mouse and touch
    const canvas = gl.domElement;

    // Mouse wheel events
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    canvas.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    // Touch events for mobile - add to both document and canvas for full coverage
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      // Clean up event listeners
      document.removeEventListener('wheel', handleWheel, { capture: true });
      canvas.removeEventListener('wheel', handleWheel, { capture: true });

      // Remove document touch listeners
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);

      // Remove canvas touch listeners
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [gl.domElement, onHideControlPanel, onShowControlPanel, isExploreMode, mobile.isMobile]);

  return (
    <>
      <color attach="background" args={["#84a4f4"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} />
      <fog attach="fog" color="#84a4f4" near={0} far={40} />

      {/* Hotspot Lighting - spotlights shining down on each hotspot */}
      <HotspotLighting sequenceChapters={sequenceChapters} selectedHotspot={selectedHotspot} />



      <Suspense fallback={null}>
        <Model
          sequenceChapters={sequenceChapters}
          sequencePosition={sheet.sequence.position}
          onChapterClick={(chapterId) => {
            // console.log(`Model chapter clicked: ${chapterId}`);
          }}
          onMeshClick={(meshName) => {
            // console.log(`Mesh clicked: ${meshName}`);
          }}
          onModelLoaded={onModelLoaded}
        />
      </Suspense>

      {/* Render all hotspots from sequenceChapters - always visible when model loads */}
      <HotspotsRenderer
        sequenceChapters={sequenceChapters}
        selectedHotspot={selectedHotspot}
        mobile={mobile}
        onHotspotClick={(chapterId) => {
          // console.log(`Hotspot clicked for chapter: ${chapterId}`);
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
          mobilePosition={showVideoScreen.videoScreen.mobilePosition}
          mobileRotation={showVideoScreen.videoScreen.mobileRotation}
          mobileSize={showVideoScreen.videoScreen.mobileSize}
        />
      )}

      {/* Hotspot Detail Popup */}
      <HotspotDetail
        selectedHotspot={selectedHotspot}
        onClose={() => {
          setSelectedHotspot(null);
          setShowVideoScreen(null); // Also hide video screen
        }}
      />

      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        fov={mobile.getCameraFOV()}
        position={[33.5381764274176, 5.205671442619433, -22.03415991352903]} // Initial position from Theatre.js state
      />




    </>
  );
}
