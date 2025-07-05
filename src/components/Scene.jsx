import { Suspense, useState, useEffect, useRef } from "react";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { Html } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";

import { Model } from "./Model";
import { VideoScreen } from "./VideoScreen";
import { HotspotDetail } from "./HotspotDetail";
import { HotspotLighting } from "./HotspotLighting";
import ToggleHiddenObjects from "./ToggleHiddenObjects";

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
              onPointerDown={(e) => {
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
                <Html distanceFactor={10} position={[0, 0.3, 0.1]} occlude>
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

export function Scene({ onTourEnd, onHideControlPanel, onShowControlPanel, isExploreMode, onModelLoaded, onPositionChange, isNavigating, navigationData, scrollSensitivity = 1.0 }) {
  const sheet = useCurrentSheet();
  const [activeChapter, setActiveChapter] = useState(null);
  const [targetPosition, setTargetPosition] = useState(0); // Target position for smooth scrolling
  const [selectedHotspot, setSelectedHotspot] = useState(null); // For hotspot detail popup
  const [showVideoScreen, setShowVideoScreen] = useState(null); // Control video screen visibility
  const [hasNavigated, setHasNavigated] = useState(false); // Track if user has navigated
  const [localHiddenState, setLocalHiddenState] = useState(false); // Local state for 3D toggle

  // Performance optimization refs (consolidated)



  // Mobile detection and responsive utilities
  const mobile = useMobile();

  // Handle toggle hidden objects
  const handleToggleHidden = (isHidden) => {
    setLocalHiddenState(isHidden);
  };



  // Track position changes and notify parent using useFrame
  const lastPositionRef = useRef(0);
  const frameCountRef = useRef(0);

  useFrame(() => {
    // Only update position every 5 frames to reduce React warnings and improve performance (12 times per second at 60fps)
    if (frameCountRef.current % 5 === 0 && onPositionChange) {
      const currentPos = sheet.sequence.position;
      if (Math.abs(currentPos - lastPositionRef.current) > 0.02) {
        lastPositionRef.current = currentPos;
        onPositionChange(currentPos);
      }
    }
  });

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

  // Performance optimized useFrame with reduced calculations
  useFrame(({ camera }) => {
    frameCountRef.current++;

    // Throttle FOV updates to reduce calculations (every 10 frames = ~6 times per second at 60fps)
    if (frameCountRef.current % 30 === 0) {
      const targetFOV = mobile.getCameraFOV();
      if (Math.abs(camera.fov - targetFOV) > 0.1) { // Only update if significant difference
        camera.fov = targetFOV;
        camera.updateProjectionMatrix();
      }
    }

    // 🎯 Handle chapter navigation with smooth animation
    if (navigationData?.isNavigating && navigationData.targetPosition !== null) {
      const { targetPosition: navTarget, startPosition: navStart, startTime, onComplete } = navigationData;

      if (navStart !== null && startTime !== null) {
        const elapsed = performance.now() - startTime;
        const duration = 3000; // 1.5 seconds for smooth navigation
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing function (ease-out-cubic)
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        const currentPos = navStart + (navTarget - navStart) * easeOutCubic;
        sheet.sequence.position = currentPos;

        if (progress >= 1) {
          // Navigation animation completed
          sheet.sequence.position = navTarget;

          // Update targetPosition immediately to prevent rollback
          setTargetPosition(navTarget);
          setHasNavigated(true); // Mark that user has navigated

          // Complete navigation state
          onComplete?.();
        }
      }
    } else if (!isNavigating) {
      // Performance optimized scroll behavior - only update every 2 frames
      if (frameCountRef.current % 2 === 0 && targetPosition !== sheet.sequence.position) {
        const diff = targetPosition - sheet.sequence.position;
        const speed = 0.028; // Slightly faster to compensate for throttling

        // Removed debug logging for better performance

        if (Math.abs(diff) > 0.001) {
          sheet.sequence.position += diff * speed;
        } else {
          sheet.sequence.position = targetPosition;
        }
      }
    }
    // When isNavigating but not navigationData.isNavigating, we're in lock mode - do nothing

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
    // Reset camera to initial position - start from 0.1 to avoid wall clipping
    sheet.sequence.position = 0.1;
    setTargetPosition(0.1);
    // Show ControlPanel again
    if (onShowControlPanel) {
      onShowControlPanel();
    }
  };

  // Initialize targetPosition and ensure proper sequence start
  useEffect(() => {
    // Don't reset during navigation or if navigationData is active or if user has navigated
    if (isNavigating || navigationData?.isNavigating || hasNavigated) {
      return;
    }

    const currentPos = sheet.sequence.position;

    if (isNaN(currentPos) || currentPos === undefined) {
      sheet.sequence.position = 0.1; // Ensure Theatre.js sequence starts at 0.1 to avoid wall clipping
      setTargetPosition(0.1);
    } else {
      setTargetPosition(currentPos);
    }
  }, [sheet.sequence, isNavigating, navigationData?.isNavigating, hasNavigated]);

  // Ensure proper initialization when entering explore mode
  useEffect(() => {
    if (isExploreMode && !isNavigating && !navigationData?.isNavigating && !hasNavigated) {
      // Force Theatre.js sequence to start at position 0.1 when entering explore mode to avoid wall clipping
      // Add small delay to ensure Theatre.js is ready
      setTimeout(() => {
        sheet.sequence.position = 0.1;
        setTargetPosition(0.1);
      }, 50);
    }
  }, [isExploreMode, sheet.sequence, isNavigating, navigationData?.isNavigating, hasNavigated]);

  // Force initial sequence position when component mounts - ONLY ONCE
  const mountedRef = useRef(false);
  useEffect(() => {
    // Only run once on mount
    if (mountedRef.current) {
      return;
    }

    // Don't initialize if navigation is active or user has navigated
    if (navigationData?.isNavigating || hasNavigated) {
      return;
    }

    mountedRef.current = true;

    // Ensure sequence starts at 0.1 on mount to avoid wall clipping
    const initializeSequence = () => {
      if (sheet && sheet.sequence && !navigationData?.isNavigating && !hasNavigated) {
        sheet.sequence.position = 0.1;
        setTargetPosition(0.1);
      }
    };

    // Run immediately and with a small delay to ensure Theatre.js is ready
    initializeSequence();
    const timer = setTimeout(initializeSequence, 100);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run once

  // Enhanced keyboard navigation for escape key and arrow keys
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle keys in explore mode
      if (!isExploreMode) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          resetScene();
          if (onTourEnd) {
            onTourEnd();
          }
          break;

        case 'ArrowLeft':
          event.preventDefault();
          // Smooth navigation backward using setTargetPosition (like scroll)
          if (targetPosition > 0.1) {
            const newPosition = Math.max(0.1, targetPosition - 0.3);
            setTargetPosition(newPosition);
            setHasNavigated(true);
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          // Smooth navigation forward using setTargetPosition (like scroll)
          if (targetPosition < 6.5) {
            const newPosition = Math.min(6.5, targetPosition + 0.3);
            setTargetPosition(newPosition);
            setHasNavigated(true);
          }
          break;

        // Removed ArrowUp and ArrowDown for smooth chapter navigation

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onTourEnd, isExploreMode, targetPosition, setHasNavigated]);

  // Handle scroll only in explore mode - Performance optimized
  useEffect(() => {
    let lastScrollTime = 0;
    const scrollThrottle = 16; // ~60fps throttling

    const handleWheel = (event) => {
      // Only allow scroll if in explore mode and when not navigating
      if (!isExploreMode || isNavigating) {
        return;
      }

      // Throttle scroll events for better performance
      const now = performance.now();
      if (now - lastScrollTime < scrollThrottle) {
        return;
      }
      lastScrollTime = now;

      event.preventDefault();
      event.stopPropagation();



      // Hide ControlPanel when starting to scroll
      if (onHideControlPanel) {
        onHideControlPanel();
      }

      const deltaY = event.deltaY;
      const baseSensitivity = mobile.getTouchSensitivity() * 0.4; // Base responsive scroll sensitivity
      const finalSensitivity = baseSensitivity * scrollSensitivity; // Apply user-controlled sensitivity

      // Use functional update to ensure latest value
      setTargetPosition(prevTarget => {
        // Check targetPosition before calculation
        if (isNaN(prevTarget)) {
          return 0.1;
        }

        // Calculate new position based on current targetPosition
        let newPosition = prevTarget + (deltaY * finalSensitivity);

        // Limit within range [0.1, 6.7] (entire sequence) - start from 0.1 to avoid wall clipping
        newPosition = Math.max(0.1, Math.min(6.5, newPosition));





        return newPosition;
      });
    };

    // Enhanced touch handling for mobile devices - Performance optimized
    let touchStartY = 0;
    let touchStartX = 0;
    let lastTouchTime = 0;
    let touchVelocity = 0;
    let isTouching = false;
    let hasMovedSignificantly = false;
    let lastTouchMoveTime = 0;
    const touchMoveThrottle = 16; // ~60fps throttling for touch moves

    const handleTouchStart = (event) => {
      if (!isExploreMode || isNavigating) return;

      const touch = event.touches[0];
      touchStartY = touch.clientY;
      touchStartX = touch.clientX;
      lastTouchTime = Date.now();
      touchVelocity = 0;
      isTouching = true;
      hasMovedSignificantly = false;



      // Don't prevent default to allow object clicks
      // event.preventDefault();
    };

    const handleTouchMove = (event) => {
      if (!isExploreMode || !isTouching || isNavigating) return;

      // Throttle touch move events for better performance
      const now = performance.now();
      if (now - lastTouchMoveTime < touchMoveThrottle) {
        return;
      }
      lastTouchMoveTime = now;

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
          newPosition = Math.max(0, Math.min(6.5, newPosition));



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



      // Add momentum scrolling for smooth experience - only if we actually swiped
      if (hasMovedSignificantly && Math.abs(touchVelocity) > 0.05) { // Lower threshold for momentum
        const momentum = touchVelocity * 0.5; // Increased momentum
        setTargetPosition(prevTarget => {
          if (isNaN(prevTarget)) {
            return 0;
          }

          let newPosition = prevTarget + momentum;
          newPosition = Math.max(0, Math.min(6.5, newPosition));



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
  }, [gl.domElement, onHideControlPanel, onShowControlPanel, isExploreMode, mobile.isMobile, isNavigating]);

  return (
    <>
      <color attach="background" args={["#84a4f4"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} />
      <fog attach="fog" color="#84a4f4" near={0} far={40} />

      {/* Hotspot Lighting - spotlights shining down on each hotspot */}
      <HotspotLighting sequenceChapters={sequenceChapters} selectedHotspot={selectedHotspot} />

      {/* 3D Toggle Hidden Objects Button */}
      <ToggleHiddenObjects
        onToggleHidden={handleToggleHidden}
        isVisible={isExploreMode}
      />



      <Suspense fallback={null}>
        <Model
          hiddenObjectsState={localHiddenState}
          onModelLoaded={onModelLoaded}
        />
      </Suspense>

      {/* Render all hotspots from sequenceChapters - always visible when model loads */}
      <HotspotsRenderer
        sequenceChapters={sequenceChapters}
        selectedHotspot={selectedHotspot}
        mobile={mobile}
        onHotspotClick={(chapterId) => {

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
