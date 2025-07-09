import { Suspense, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { useThree, useFrame } from "@react-three/fiber";

import { Model } from "./Model";
import { VideoScreen } from "./VideoScreen";
import { HotspotDetail } from "./HotspotDetail";
import { HotspotLighting } from "./HotspotLighting";
import { HotspotsRenderer } from "./Hotspot";
import ToggleHiddenObjects from "./ToggleHiddenObjects";


import { sequenceChapters } from "../data/sequenceChapters";
import { useMobile } from "../hooks/useMobile";







export function Scene({ onTourEnd, onHideControlPanel, onShowControlPanel, isExploreMode, onModelLoaded, onPositionChange, isNavigating, navigationData, scrollSensitivity = 1.0, onShowNavigationGuide, showNavigationGuide, isChatFocused = false }) {
  const navigate = useNavigate();
  const sheet = useCurrentSheet();
  const [activeChapter, setActiveChapter] = useState(null);
  const [targetPosition, setTargetPosition] = useState(0); // Target position for smooth scrolling
  const [selectedHotspot, setSelectedHotspot] = useState(null); // For hotspot detail popup
  const [showVideoScreen, setShowVideoScreen] = useState(null); // Control video screen visibility
  const [hasNavigated, setHasNavigated] = useState(false); // Track if user has navigated
  const [localHiddenState, setLocalHiddenState] = useState(false); // Local state for 3D toggle






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
    // Only update position every 3 frames to reduce React warnings and improve performance
    frameCountRef.current++;
    if (frameCountRef.current % 3 === 0 && onPositionChange) {
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

  // Temporarily disabled useFrame for Theatre.js sequence editing
  useFrame(({ camera }) => {
    // Let Theatre.js control camera position, only override FOV for mobile
    const targetFOV = mobile.getCameraFOV();

    // Only update FOV, let Theatre.js handle position
    if (camera.fov !== targetFOV) {
      camera.fov = targetFOV;
      camera.updateProjectionMatrix();
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
      // Normal scroll behavior when not locked
      if (targetPosition !== sheet.sequence.position) {
        const diff = targetPosition - sheet.sequence.position;
        const speed = 0.02; // Smooth scrolling speed

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
    // Reset camera to initial position - start from 0.15 to avoid wall clipping
    sheet.sequence.position = 0.15;
    setTargetPosition(0.15);
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
      sheet.sequence.position = 0.15; // Ensure Theatre.js sequence starts at 0.15 to avoid wall clipping
      setTargetPosition(0.15);
    } else {
      setTargetPosition(currentPos);
    }
  }, [sheet.sequence, isNavigating, navigationData?.isNavigating, hasNavigated]);

  // Ensure proper initialization when entering explore mode
  useEffect(() => {
    if (isExploreMode && !isNavigating && !navigationData?.isNavigating && !hasNavigated) {
      // Force Theatre.js sequence to start at position 0.15 when entering explore mode to avoid wall clipping
      // Add small delay to ensure Theatre.js is ready
      setTimeout(() => {
        sheet.sequence.position = 0.15;
        setTargetPosition(0.15);
        // Show navigation guide when first entering explore mode
        if (onShowNavigationGuide) {
          onShowNavigationGuide();
        }
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
        sheet.sequence.position = 0.15;
        setTargetPosition(0.15);
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
          // Navigate back to homepage
          navigate("/");
          break;

        case 'ArrowLeft':
          event.preventDefault();
          // Smooth navigation backward using setTargetPosition (like scroll)
          if (targetPosition > 0.15) {
            const newPosition = Math.max(0.15, targetPosition - 0.3);
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

  // Handle scroll only in explore mode
  useEffect(() => {
    const handleWheel = (event) => {
      // Only allow scroll if in explore mode, when not navigating, when NavigationGuide is not showing, and when chat is not focused
      if (!isExploreMode || isNavigating || showNavigationGuide || isChatFocused) {
        return;
      }

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

        // Limit within range [0.15, 6.7] (entire sequence) - start from 0.15 to avoid wall clipping
        newPosition = Math.max(0.15, Math.min(6.5, newPosition));





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
      if (!isExploreMode || isNavigating || showNavigationGuide) return;

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
      if (!isExploreMode || !isTouching || isNavigating || showNavigationGuide) return;

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
      if (!isExploreMode || showNavigationGuide) return;

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
  }, [gl.domElement, onHideControlPanel, onShowControlPanel, isExploreMode, mobile.isMobile, isNavigating, showNavigationGuide, isChatFocused]);

  return (
    <>
      <color attach="background" args={["#84a4f4"]} />

      {/* Enhanced lighting setup for better visibility */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.6} />
      <directionalLight position={[0, 10, 10]} intensity={0.6} />

      <fog attach="fog" color="#84a4f4" near={0} far={40} />

      {/* Hotspot Lighting - spotlights shining down on each hotspot */}
      <HotspotLighting sequenceChapters={sequenceChapters} />

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
        currentPosition={sheet.sequence.position}
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
