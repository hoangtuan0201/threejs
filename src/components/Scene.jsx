import { Suspense, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from 'three';
import { WebGLPathTracer } from 'three-gpu-pathtracer';

import { Model } from "./Model";
import { VideoScreen } from "./VideoScreen";
import { HotspotDetail } from "./HotspotDetail";
import { HotspotLighting } from "./HotspotLighting";
import { HotspotsRenderer } from "./Hotspot";
import ToggleHiddenObjects from "./ToggleHiddenObjects";
import DoorAnimation from "./DoorAnimation";
import { EnhancedLighting } from "./HDREnvironment";
import { EnhancedBackground } from "./Background";

import { sequenceChapters } from "../data/sequenceChapters";
import { useMobile } from "../hooks/useMobile";







export function Scene({ onTourEnd, onHideControlPanel, onShowControlPanel, isExploreMode, onModelLoaded, onPositionChange, isNavigating, navigationData, scrollSensitivity = 1.0, onShowNavigationGuide, showNavigationGuide, isChatFocused = false, onHotspotDetailRequest, shouldRestorePosition, savedSceneState, onSceneStateCleared, onHideNavigationGuide, hasVisitedDetailScene }) {
  const navigate = useNavigate();
  const sheet = useCurrentSheet();
  const [activeChapter, setActiveChapter] = useState(null);
  const [targetPosition, setTargetPosition] = useState(0); // Target position for smooth scrolling
  const [selectedHotspot, setSelectedHotspot] = useState(null); // For hotspot detail popup
  const [showVideoScreen, setShowVideoScreen] = useState(null); // Control video screen visibility
  const [hasNavigated, setHasNavigated] = useState(false); // Track if user has navigated
  const [localHiddenState, setLocalHiddenState] = useState(false); // Local state for 3D toggle
  const [isRestoring, setIsRestoring] = useState(false); // Flag to prevent auto-reset during restore
  const [hasShownNavigationGuide, setHasShownNavigationGuide] = useState(false); // Track if guide was shown in current session
  const [justCompletedRestore, setJustCompletedRestore] = useState(false); // Track recent restore completion
  const hasTriggeredGuideRef = useRef(false); // Ref to prevent multiple triggers
  
  // Path tracing state
  const [pathTracingEnabled, setPathTracingEnabled] = useState(false);
  const pathTracerRef = useRef(null);
  const [pathTracingProgress, setPathTracingProgress] = useState(0);
  const [isPathTracingReady, setIsPathTracingReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Track if we just returned from detail scene to prevent navigation guide
  useEffect(() => {
    if (shouldRestorePosition) {
      // We're returning from detail scene, don't show navigation guide
      setHasShownNavigationGuide(true);
    }
  }, [shouldRestorePosition]);

  // Reset navigation guide flag for first-time users (who haven't visited detail scene)
  useEffect(() => {
    if (!hasVisitedDetailScene && hasShownNavigationGuide) {
      setHasShownNavigationGuide(false);
    }
  }, [hasVisitedDetailScene, hasShownNavigationGuide]);

  // Remove local state - use prop from SceneManager instead






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
    if (frameCountRef.current % 5 === 0 && onPositionChange) {
      const currentPos = sheet.sequence.position;
      if (Math.abs(currentPos - lastPositionRef.current) > 0.02) {
        lastPositionRef.current = currentPos;
        onPositionChange(currentPos);
      }
    }
  });

  const { gl, camera, controls, scene: threeScene } = useThree();
  
  // Initialize path tracer with error handling
    useEffect(() => {
      if (!pathTracerRef.current && threeScene && gl && camera && modelLoaded) {
        try {
          const pathTracer = new WebGLPathTracer(gl);
          
          // Wait for scene to be fully loaded before setting
          if (threeScene.children.length > 0) {
            pathTracer.setScene(threeScene, camera);
            
            // Configure path tracer settings for quality
            pathTracer.tiles.set(mobile ? 1 : 2, mobile ? 1 : 2);
            pathTracer.samples = mobile ? 100 : 200;
            pathTracer.bounces = mobile ? 5 : 8;
            pathTracer.filterGlossyFactor = 0.25;
            
            // Enable denoising for cleaner results
            if (pathTracer.enableDenoise !== undefined) {
              pathTracer.enableDenoise = true;
              pathTracer.denoiseBlur = 2.5;
            }
            
            // Better material handling
            if (pathTracer.multipleImportanceSampling !== undefined) {
              pathTracer.multipleImportanceSampling = true;
            }
            if (pathTracer.stableNoise !== undefined) {
              pathTracer.stableNoise = true;
            }
            
            pathTracerRef.current = pathTracer;
            setIsPathTracingReady(true);
            
            console.log('GPU Path tracer initialized successfully');
          }
        } catch (error) {
          console.warn('Failed to initialize GPU Path Tracer:', error);
          setIsPathTracingReady(false);
        }
      }
    }, [threeScene, gl, camera, mobile, modelLoaded]);
  
  // Path tracing render loop with adaptive quality
   useFrame((state, delta) => {
     if (pathTracingEnabled && pathTracerRef.current && isPathTracingReady) {
       try {
         const pathTracer = pathTracerRef.current;
         
         // Adaptive rendering based on camera movement
         const cameraMoving = controls?.enabled && 
           (Math.abs(state.camera.position.distanceTo(state.camera.userData.lastPosition || state.camera.position)) > 0.001);
         
         if (cameraMoving) {
           // Reset when camera moves
           pathTracer.reset();
           state.camera.userData.lastPosition = state.camera.position.clone();
         }
         
         // Update path tracer
         pathTracer.update();
         
         // Calculate progress
         const targetSamples = mobile ? 100 : 200;
         const currentSamples = pathTracer.samples || 0;
         const progress = Math.min(currentSamples / targetSamples, 1);
         setPathTracingProgress(progress);
         
         // Auto-pause when converged to save resources
         if (progress >= 0.95 && !cameraMoving) {
           // Optionally pause rendering when nearly converged
           return;
         }
       } catch (error) {
         console.warn('Path tracer render error:', error);
         setPathTracingEnabled(false);
         setIsPathTracingReady(false);
       }
     }
   });

  // Raycaster for mesh selection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Function to capture current camera state
  const captureCurrentCameraState = () => {
    if (camera && sheet && sheet.sequence) {
      const currentSequencePosition = sheet.sequence.position;
      const state = {
        position: camera.position.clone(),
        target: controls ? controls.target.clone() : null,
        sequencePosition: currentSequencePosition
      };

      // Ensure we have a valid sequence position (fallback to 1 if at start)
      if (state.sequencePosition < 0.1) {
        state.sequencePosition = 1.0;
      }

      return state;
    }
    return null;
  };

  // Restore camera position when returning from detail scene
  useEffect(() => {
    if (shouldRestorePosition && camera && sheet) {
      // Set restoring flag to prevent other useEffects from resetting
      setIsRestoring(true);

      // Immediate restore to prevent jitter - use requestAnimationFrame for smooth transition
      const performRestore = () => {
        let targetSequencePosition = 1.0; // Default fallback position



        if (savedSceneState && savedSceneState.sequencePosition !== undefined) {
          // Use saved position if it's reasonable (> 0.1) - Lower threshold
          if (savedSceneState.sequencePosition > 0.1) {
            targetSequencePosition = savedSceneState.sequencePosition;
          }

          // Restore sequence position FIRST to prevent jitter
          if (sheet.sequence) {
            sheet.sequence.position = targetSequencePosition;
            setTargetPosition(targetSequencePosition);
          }

          // Then restore camera position smoothly
          requestAnimationFrame(() => {
            camera.position.copy(savedSceneState.position);

            // Restore controls target
            if (controls && savedSceneState.target) {
              controls.target.copy(savedSceneState.target);
              controls.update();
            }
          });
        } else {
          // Try to get from localStorage as fallback
          try {
            const localState = localStorage.getItem('lastHotspotPosition');
            if (localState) {
              const parsedState = JSON.parse(localState);
              targetSequencePosition = parsedState.sequencePosition || 1.0;
            }
          } catch (error) {
            // Silent error handling
          }

          if (sheet.sequence) {
            sheet.sequence.position = targetSequencePosition;
            setTargetPosition(targetSequencePosition);
          }
        }

        // Mark as navigated to prevent future auto-resets
        setHasNavigated(true);

        // Mark navigation guide as shown to prevent popup during restore
        setHasShownNavigationGuide(true);

        // Force close navigation guide if it's currently showing
        if (onHideNavigationGuide) {
          onHideNavigationGuide();
        }

        // Clear the saved state immediately
        if (onSceneStateCleared) {
          onSceneStateCleared();
        }

        // Clear restoring flag with shorter delay
        setTimeout(() => {
          setIsRestoring(false);
          setJustCompletedRestore(true);

          // Clear the justCompletedRestore flag after shorter delay
          setTimeout(() => {
            setJustCompletedRestore(false);
          }, 500);
        }, 100); // Much shorter delay
      };

      // Execute restore immediately
      performRestore();
    }
  }, [shouldRestorePosition, savedSceneState, camera, controls, sheet, onSceneStateCleared]);

  // Show navigation guide when entering explore mode for the first time
  useEffect(() => {
    
    if (isExploreMode && !hasTriggeredGuideRef.current && !hasVisitedDetailScene) {
      if (onShowNavigationGuide) {
        hasTriggeredGuideRef.current = true; // Mark as triggered
        onShowNavigationGuide();
        setHasShownNavigationGuide(true);
      }
    }
  }, [isExploreMode, hasVisitedDetailScene]); // Removed hasShownNavigationGuide to prevent loop

  // Update camera FOV based on mobile detection (basic)
  useEffect(() => {
    const newFOV = mobile.getCameraFOV();
    if (camera && camera.fov !== newFOV) {
      camera.fov = newFOV;
      camera.updateProjectionMatrix();
    }
  }, [camera, mobile.isMobile, mobile.isTablet]);

  // Handle resize events (basic)
  useEffect(() => {
    const handleResize = () => {
      if (camera) {
        camera.fov = mobile.getCameraFOV();
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [camera, mobile]);

  // Handle chapter navigation with smooth animation
  useFrame(() => {
    if (navigationData?.isNavigating && navigationData.targetPosition !== null) {
      const { targetPosition: navTarget, startPosition: navStart, startTime, onComplete, duration: customDuration } = navigationData;

      if (navStart !== null && startTime !== null) {
        const elapsed = performance.now() - startTime;

        // Use custom duration if provided, otherwise use logic based on target position
        let duration = customDuration || 3000; // Default 3 seconds
        if (!customDuration) {
          // 7s for chapters after position 2.5 (Air Purification and Outdoor Unit)
          if (navTarget > 2.5) {
            duration = 7000;
          }
        }

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
      // comment these to turn off useframe
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

    // Updated range definitions to match new sequence positions
    const chapterRanges = {
      "Geom3D_393": [1.0, 2.0],      // Smart Thermostat
      "indoor": [2.0, 3.0],          // Linear Grille
      "Air Purification": [7.5, 8.5], // Air Purification
      "Outdoor": [11.3, 12.3]        // Outdoor Unit
    };

    sequenceChapters.forEach((chapter) => {
      const range = chapterRanges[chapter.id];
      if (range) {
        const [start, end] = range;
        const isInRange = currentPosition >= start && currentPosition <= (end + 0.2);

        // Set active chapter when entering sequence range
        if (isInRange) {
          setActiveChapter(chapter);
        } else {
          // Clear active chapter when leaving sequence range
          if (activeChapter?.id === chapter.id) {
            setActiveChapter(null);
          }
        }
      }
    });
  });



  // Enhanced keyboard navigation for escape key and arrow keys
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle keys in explore mode
      if (!isExploreMode) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          // Navigate back to homepage
          navigate("/homepage");
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
          if (targetPosition < 12.5) {
            const newPosition = Math.min(12.5, targetPosition + 0.3);
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
      // Only allow scroll if in explore mode, when not navigating, and when chat is not focused
      // Note: Removed showNavigationGuide blocking to allow scroll while guide is showing
      if (!isExploreMode || isNavigating || isChatFocused) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();



      // Hide ControlPanel when starting to scroll
      if (onHideControlPanel) {
        onHideControlPanel();
      }

      const deltaY = event.deltaY;
      const baseSensitivity = mobile.getTouchSensitivity() * 0.3; // Base responsive scroll sensitivity
      const finalSensitivity = baseSensitivity * scrollSensitivity; // Apply user-controlled sensitivity

      // Use functional update to ensure latest value
      setTargetPosition(prevTarget => {
        // Check targetPosition before calculation
        if (isNaN(prevTarget)) {
          return 0.1;
        }

        // Calculate new position based on current targetPosition
        let newPosition = prevTarget + (deltaY * finalSensitivity);

        // Limit within range [0.1, 12.5] (entire sequence) - start from 0.1 to avoid wall clipping
        newPosition = Math.max(0, Math.min(12.5, newPosition));





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
      // Allow touch even when navigation guide is showing
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
      // Allow touch move even when navigation guide is showing
      if (!isExploreMode || !isTouching || isNavigating) return;

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
      const touchSensitivity = mobile.isMobile ? 0.008 : 0.004; // Tăng sensitivity cho mobile
      
      // Giảm threshold detection (dòng 462)
      if (deltaX < 30 && Math.abs(deltaY) > 1) { // Threshold thấp hơn
        hasMovedSignificantly = true;
      
        // Only prevent default when we're actually scrolling
        event.preventDefault();
        event.stopPropagation();

        setTargetPosition(prevTarget => {
          if (isNaN(prevTarget)) {
            return 0;
          }

          let newPosition = prevTarget + (deltaY * touchSensitivity);
          newPosition = Math.max(0, Math.min(12.5, newPosition)); // Thống nhất range với wheel events



          return newPosition;
        });

        touchStartY = touchY;
        touchStartX = touchX;
        lastTouchTime = currentTime;
      }
    };

    const handleTouchEnd = () => {
      // Allow touch end even when navigation guide is showing
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
          newPosition = Math.max(0, Math.min(12.5, newPosition)); // Thống nhất range



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

  // Handle mesh click to log mesh name to console
  useEffect(() => {
    const handleClick = (event) => {
      // Only handle click in explore mode
      if (!isExploreMode) return;

      // Get canvas and calculate mouse position
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      
      // Create mouse vector and raycaster
      const mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();
      
      // Calculate mouse position in normalized device coordinates
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(threeScene.children, true);

      if (intersects.length > 0) {
        // Find the first intersected mesh with a name
        const intersectedMesh = intersects.find(intersect => intersect.object.name);
        if (intersectedMesh) {
          console.log('Clicked mesh name:', intersectedMesh.object.name);
        }
      }
    };

    // Add event listener
    const canvas = gl.domElement;
    canvas.addEventListener('click', handleClick);

    // Clean up event listener
    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [gl.domElement, camera, threeScene, isExploreMode]);

  return (
    <>
      {/* Industrial Background - sử dụng industrial.jpg làm background */}
      <EnhancedBackground
        type="industrial"
        industrialOpacity={1.0}
        fallbackColor="#84a4f4"
        enableIndustrial={true}
      />

      {/* Path Tracing Controls */}
      {isPathTracingReady && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          zIndex: 1000,
          minWidth: '200px'
        }}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            GPU Path Tracer
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <button
              onClick={() => {
                setPathTracingEnabled(!pathTracingEnabled);
                if (pathTracerRef.current) {
                  pathTracerRef.current.reset();
                }
              }}
              style={{
                background: pathTracingEnabled ? '#4CAF50' : '#f44336',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {pathTracingEnabled ? 'Disable Path Tracing' : 'Enable Path Tracing'}
            </button>
          </div>
          
          {pathTracingEnabled && (
            <div>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ marginBottom: '5px' }}>
                  Progress: {Math.round(pathTracingProgress * 100)}%
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: '#333',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${pathTracingProgress * 100}%`,
                    height: '100%',
                    background: '#4CAF50',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <button
                  onClick={() => {
                    if (pathTracerRef.current) {
                      pathTracerRef.current.reset();
                      setPathTracingProgress(0);
                    }
                  }}
                  style={{
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '12px'
                  }}
                >
                  Reset Rendering
                </button>
              </div>
              
              <div style={{ fontSize: '12px', color: '#ccc' }}>
                Samples: {pathTracerRef.current?.samples || 0} / {mobile ? 100 : 200}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced HDR lighting setup for realistic PBR rendering */}
      <EnhancedLighting type="main" enableHDR={true} shadowQuality="medium" />

      {/* Ground plane for shadow visibility */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#f0f0f0"
          transparent
          opacity={0.1}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      <fog attach="fog" color="#84a4f4" near={0} far={100} />

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
          onModelLoaded={() => {
            setModelLoaded(true);
            onModelLoaded?.();
          }}
        />
        {/* Door animation controller */}
        <DoorAnimation />
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
            // Check if this is Smart Thermostat - switch to detail scene
            if (chapter.id === "Geom3D_393" && onHotspotDetailRequest) {
              // Capture current camera state before switching
              const currentState = captureCurrentCameraState();
              onHotspotDetailRequest(chapter, currentState);
            } else {
              setSelectedHotspot(chapter);
              // Show video screen when hotspot is clicked
              if (chapter.videoScreen) {
                setShowVideoScreen(chapter);
              }
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
        fov={75} // Default FOV, will be overridden by FOVManager
        position={[33.5381764274176, 5.205671442619433, -22.03415991352903]}
      />

    </>
  );
}
