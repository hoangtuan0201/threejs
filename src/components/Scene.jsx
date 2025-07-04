import { Suspense, useState, useEffect } from "react";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { Html } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";

import { Model } from "./Model";
import { VideoScreen } from "./VideoScreen";
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
                      padding: mobile.isMobile ? '3px 8px' : '1px 4px', // Larger padding on mobile
                      borderRadius: mobile.isMobile ? '6px' : '3px', // Larger border radius on mobile
                      fontSize: mobile.isMobile ? '12px' : '8px', // Keep original desktop font
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

  // Update camera position based on mobile detection
  useEffect(() => {
    const newPosition = mobile.getCameraPosition();
    const newFOV = mobile.getCameraFOV();

    // Force update camera position
    camera.position.set(newPosition[0], newPosition[1], newPosition[2]);
    camera.fov = newFOV;
    camera.updateProjectionMatrix();

    console.log('Scene Camera updated:', {
      position: newPosition,
      fov: newFOV,
      isMobile: mobile.isMobile,
      actualPosition: camera.position.toArray()
    });

    // Force a re-render
    camera.updateMatrixWorld();
  }, [camera, mobile.isMobile]);

  // Also update on window resize
  useEffect(() => {
    const handleResize = () => {
      const newPosition = mobile.getCameraPosition();
      const newFOV = mobile.getCameraFOV();

      camera.position.set(newPosition[0], newPosition[1], newPosition[2]);
      camera.fov = newFOV;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      console.log('Resize Camera updated:', {
        position: newPosition,
        fov: newFOV,
        isMobile: mobile.isMobile
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [camera, mobile]);

  // Smooth scrolling with useFrame for both preview and explore modes
  useFrame(({ camera }) => {
    // Temporarily disable camera override to debug
    // const targetCameraPosition = mobile.getCameraPosition();
    // const targetFOV = mobile.getCameraFOV();

    // Force camera position and FOV
    // camera.position.set(targetCameraPosition[0], targetCameraPosition[1], targetCameraPosition[2]);
    // camera.fov = targetFOV;
    // camera.updateProjectionMatrix();

    // Debug log current camera state
    if (Math.floor(Date.now() / 1000) % 3 === 0 && Math.floor(Date.now() / 16) % 60 === 0) {
      console.log('Current Camera State:', {
        position: camera.position.toArray(),
        fov: camera.fov,
        isMobile: mobile.isMobile,
        targetPos: mobile.getCameraPosition(),
        targetFOV: mobile.getCameraFOV()
      });
    }

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
        newPosition = Math.max(0, Math.min(6, newPosition));

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

    const handleTouchStart = (event) => {
      if (!isExploreMode) return;

      const touch = event.touches[0];
      touchStartY = touch.clientY;
      touchStartX = touch.clientX;
      lastTouchTime = Date.now();
      touchVelocity = 0;
      isTouching = true;

      console.log('Touch start:', { touchStartY, touchStartX }); // Debug log

      // Prevent default to avoid scrolling
      event.preventDefault();
    };

    const handleTouchMove = (event) => {
      if (!isExploreMode || !isTouching) return;

      event.preventDefault();
      event.stopPropagation();

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

      // Simplified touch sensitivity for better responsiveness
      const touchSensitivity = mobile.isMobile ? 0.008 : 0.005; // Increased sensitivity

      console.log('Touch move:', { deltaY, deltaX, touchSensitivity }); // Debug log

      // Only process vertical swipes (ignore horizontal)
      if (deltaX < 80 && Math.abs(deltaY) > 3) { // More lenient thresholds
        setTargetPosition(prevTarget => {
          if (isNaN(prevTarget)) {
            return 0;
          }

          let newPosition = prevTarget + (deltaY * touchSensitivity);
          newPosition = Math.max(0, Math.min(6, newPosition));

          console.log('Setting position from touch:', prevTarget, '->', newPosition); // Debug log

          return newPosition;
        });

        touchStartY = touchY;
        touchStartX = touchX;
        lastTouchTime = currentTime;
      }
    };

    const handleTouchEnd = (event) => {
      if (!isExploreMode) return;

      event.preventDefault();
      isTouching = false;

      console.log('Touch end, velocity:', touchVelocity); // Debug log

      // Add momentum scrolling for smooth experience
      if (Math.abs(touchVelocity) > 0.05) { // Lower threshold for momentum
        const momentum = touchVelocity * 0.5; // Increased momentum
        setTargetPosition(prevTarget => {
          if (isNaN(prevTarget)) {
            return 0;
          }

          let newPosition = prevTarget + momentum;
          newPosition = Math.max(0, Math.min(6, newPosition));

          console.log('Momentum scroll:', prevTarget, '->', newPosition); // Debug log

          return newPosition;
        });
      }

      touchVelocity = 0;
    };

    // Add listeners for both mouse and touch
    const canvas = gl.domElement;
    console.log('Adding scroll and touch listeners');

    // Mouse wheel events
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    canvas.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    // Touch events for mobile - add to both document and canvas for better coverage
    if (mobile.isMobile) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      document.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    }

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      console.log('Removing scroll and touch listeners');
      document.removeEventListener('wheel', handleWheel, { capture: true });
      canvas.removeEventListener('wheel', handleWheel, { capture: true });

      // Remove document touch listeners if mobile
      if (mobile.isMobile) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('touchcancel', handleTouchEnd);
      }

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
        mobile={mobile}
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
          mobilePosition={showVideoScreen.videoScreen.mobilePosition}
          mobileRotation={showVideoScreen.videoScreen.mobileRotation}
          mobileSize={showVideoScreen.videoScreen.mobileSize}
        />
      )}

      {/* Hotspot Detail Popup */}
      {selectedHotspot && selectedHotspot.hotspot && (
        <group
          position={
            mobile.isMobile
              ? (selectedHotspot.hotspot.mobileDetailPosition || selectedHotspot.hotspot.detailPosition || selectedHotspot.hotspot.position)
              : (selectedHotspot.hotspot.detailPosition || selectedHotspot.hotspot.position)
          }
          rotation={
            mobile.isMobile
              ? (selectedHotspot.hotspot.mobileDetailRotation || selectedHotspot.hotspot.detailRotation || selectedHotspot.hotspot.rotation || [0, Math.PI / 1.8, 0])
              : (selectedHotspot.hotspot.detailRotation || selectedHotspot.hotspot.rotation || [0, Math.PI / 1.8, 0])
          }
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
                width: mobile.isMobile ? "28px" : "14px", // Extra small button on desktop
                height: mobile.isMobile ? "26px" : "14px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: mobile.isMobile ? "16px" : "9px", // Extra small font on desktop
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>

            {/* Title */}
            <h3 style={{
              margin: "0 0 6px 0",
              fontSize: mobile.isMobile ? "14px" : "11px", // Keep original desktop font
              fontWeight: "bold",
              color: "#fff"
            }}>
              {selectedHotspot.hotspot.title}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: mobile.isMobile ? "12px" : "8px", // Keep original desktop font
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
                    padding: mobile.isMobile ? '10px 12px' : '3px 5px', // Very small padding on desktop
                    fontSize: mobile.isMobile ? '14px' : '8px', // Very small font on desktop
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: mobile.isMobile ? '6px' : '3px', // Very small border radius on desktop
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
        position={mobile.getCameraPosition()}
        fov={mobile.getCameraFOV()}
      />


    </>
  );
}
