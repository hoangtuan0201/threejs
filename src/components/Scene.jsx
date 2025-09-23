import { Suspense, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from 'three';
import { WebGLPathTracer } from 'three-gpu-pathtracer';

import { Model } from "./Model";
import { VideoScreen } from "./VideoScreen";
import { HotspotDetail } from "./HotspotDetail";
import { HotspotsRenderer } from "./Hotspot";
import DoorAnimation from "./DoorAnimation";
import { EnhancedLighting, HDREnvironment } from "./HDREnvironment";
import { EnhancedBackground } from "./Background";
import { EnhancedPostProcessing, useCanvasFilters } from "./PostProcessing";
import GrassFloor from "./GrassFloor";
import Tree, { TreeGroup } from "./XRayMode/Tree";

import { sequenceChapters } from "../data/sequenceChapters";
import { useMobile } from "../hooks/useMobile";



export function Scene({ onTourEnd, onHideControlPanel, onShowControlPanel, isExploreMode, onModelLoaded, onPositionChange, isNavigating, navigationData, scrollSensitivity = 1.0, onShowNavigationGuide, showNavigationGuide, isChatFocused = false, onHotspotDetailRequest, shouldRestorePosition, savedSceneState, onSceneStateCleared, onHideNavigationGuide, hasVisitedDetailScene, onResetView, onSelectedHotspotChange }) {
  const navigate = useNavigate();
  const sheet = useCurrentSheet();
  const [activeChapter, setActiveChapter] = useState(null);
  const [targetPosition, setTargetPosition] = useState(0); // Target position for smooth scrolling
  const [selectedHotspot, setSelectedHotspot] = useState(null); // For hotspot detail popup
  const [showVideoScreen, setShowVideoScreen] = useState(null); // Control video screen visibility
  const [hasNavigated, setHasNavigated] = useState(false); // Track if user has navigated
  const [activeSequence, setActiveSequence] = useState(null); // For hiding mesh when hotspot is clicked
  const [orbitControlEnabled, setOrbitControlEnabled] = useState(false); // Control orbit control activation
  const orbitControlsRef = useRef(); // Reference to OrbitControls
  
  // Debug hover state for mesh visualization
  const [hoveredMesh, setHoveredMesh] = useState(null); // Currently hovered/clicked mesh
  const [originalMaterial, setOriginalMaterial] = useState(null); // Store original material for restoration
  
  // Enhanced reset view function - reset everything
  const resetView = () => {
    // // Reset orbit controls
    // if (orbitControlsRef.current) {
    //   orbitControlsRef.current.reset();
    // }
    
    // // Reset camera to initial position
    // if (camera) {
    //   camera.position.set(33.5381764274176, 5.205671442619433, -22.03415991352903);
    //   camera.lookAt(0, 0, 0);
    // }
    
    // Reset sequence position to beginning
    if (sheet && sheet.sequence) {
      sheet.sequence.position = 0.1;
    }
    
    // Reset all states completely
    setActiveChapter(0);
    setSelectedHotspot(null);
    setShowVideoScreen(null);
    setActiveSequence(null);
    setOrbitControlEnabled(false);
    setTargetPosition(0);
    
    // Notify parent about hotspot change
    if (onSelectedHotspotChange) {
      onSelectedHotspotChange(null);
    }
    
    // Reset path tracing if enabled
    if (pathTracerRef.current && typeof pathTracerRef.current.reset === 'function') {
      pathTracerRef.current.reset();
    }
    setPathTracingProgress(0);
    
    // Reset navigation guide state
    setHasShownNavigationGuide(false);
    hasTriggeredGuideRef.current = false;
    
    // Reset debug highlight
    if (hoveredMesh && originalMaterial) {
      hoveredMesh.material = originalMaterial;
      setHoveredMesh(null);
      setOriginalMaterial(null);
    }
    
    // Call onPositionChange to update parent state
    if (onPositionChange) {
      onPositionChange(0);
    }
    
    console.log('Complete view and sequence reset to initial state');
  };

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

  // Canvas filters for enhanced visuals
  const canvasFilters = useCanvasFilters();

  // Send resetView function to parent component
  useEffect(() => {
    if (onResetView) {
      onResetView(() => resetView);
    }
  }, [onResetView]);

  // Notify parent when selectedHotspot changes
  useEffect(() => {
    if (onSelectedHotspotChange) {
      onSelectedHotspotChange(selectedHotspot);
    }
  }, [selectedHotspot, onSelectedHotspotChange]);

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
  
  const initializedRef = useRef(false);

  // Apply canvas filters for enhanced visuals
  useEffect(() => {
    if (gl && gl.domElement) {
      const canvas = gl.domElement;
      Object.assign(canvas.style, canvasFilters);
    }
  }, [gl, canvasFilters]);

  // Initialize GPU path tracer when model and environment are ready
  useEffect(() => {
    if (initializedRef.current || !modelLoaded || !threeScene || !threeScene.environment || !gl || !camera) return;

    let mounted = true;

    try {
      const pathTracer = new WebGLPathTracer(gl);

      // Ensure outputs/encodings are compatible
      try {
        if (pathTracer.outputEncoding !== undefined) pathTracer.outputEncoding = THREE.sRGBEncoding;
        if (pathTracer.outputColorSpace !== undefined) pathTracer.outputColorSpace = THREE.SRGBColorSpace;
      } catch (e) {
        // ignore if properties don't exist on this version
      }

      // Attach scene and camera
      if (typeof pathTracer.setScene === 'function') {
        pathTracer.setScene(threeScene, camera);
      }

      // Size to match canvas
      try {
        const canvas = gl.domElement;
        if (typeof pathTracer.setSize === 'function') {
          pathTracer.setSize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight);
        }
      } catch (e) {
        // ignore
      }

      // Configure ultra-high-quality settings for photorealistic rendering (Game 4K quality)
      try {
        // Adaptive tile configuration for better performance and quality
        if (pathTracer.tiles && pathTracer.tiles.set) {
          pathTracer.tiles.set(mobile ? 2 : 4, mobile ? 2 : 4);
        }
        
        // Dramatically increased samples for maximum photorealistic quality
        if (pathTracer.samples !== undefined) {
          pathTracer.samples = mobile ? 768 : 3072; // Tăng samples để có chất lượng tối đa
        }
        
        // Maximum bounces for ultra-realistic global illumination
        if (pathTracer.bounces !== undefined) {
          pathTracer.bounces = mobile ? 10 : 16; // Tăng bounces để ánh sáng phản chiếu tối đa
        }
        
        // Reduced filter glossy factor for sharper reflections
        if (pathTracer.filterGlossyFactor !== undefined) {
          pathTracer.filterGlossyFactor = 0.04; // Giảm để reflections sắc nét hơn
        }

        // Advanced denoising for cleaner output
        if (pathTracer.enableDenoise !== undefined) {
          pathTracer.enableDenoise = true;
          pathTracer.denoiseBlur = 1.8; // Giảm blur để giữ chi tiết
          pathTracer.denoiseRadius = 8; // Tăng radius cho denoising tốt hơn
          pathTracer.denoiseLuminanceWeight = 25;
          pathTracer.denoiseColorWeight = 25;
        }

        // Enable all quality-enhancing features
        if (pathTracer.multipleImportanceSampling !== undefined) {
          pathTracer.multipleImportanceSampling = true;
        }
        if (pathTracer.stableNoise !== undefined) {
          pathTracer.stableNoise = true;
        }
        
        // Additional quality settings for photorealism
        if (pathTracer.environmentIntensity !== undefined) {
          pathTracer.environmentIntensity = 1.2; // Tăng cường độ environment
        }
        if (pathTracer.backgroundBlur !== undefined) {
          pathTracer.backgroundBlur = 0.0; // Background sắc nét
        }
        if (pathTracer.sobolSampling !== undefined) {
          pathTracer.sobolSampling = true; // Sobol sampling cho chất lượng tốt hơn
        }
        if (pathTracer.stratifiedSampling !== undefined) {
          pathTracer.stratifiedSampling = true; // Stratified sampling giảm noise
        }
        
        // Enable temporal accumulation for better convergence
        if (pathTracer.enableTemporalAccumulation !== undefined) {
          pathTracer.enableTemporalAccumulation = true;
        }
        
        // Adaptive sampling for dynamic quality
        if (pathTracer.enableAdaptiveSampling !== undefined) {
          pathTracer.enableAdaptiveSampling = true;
          pathTracer.adaptiveVarianceThreshold = 0.001;
        }
      } catch (e) {
        // ignore individual property issues
      }

      pathTracerRef.current = pathTracer;
      if (mounted) setIsPathTracingReady(true);
      initializedRef.current = true;
      console.log('GPU Path tracer initialized successfully');

      // Handle window resize to keep tracer size synced
      const handleResize = () => {
        try {
          const canvas = gl.domElement;
          if (pathTracerRef.current && typeof pathTracerRef.current.setSize === 'function') {
            pathTracerRef.current.setSize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight);
          }
        } catch (e) {
          // ignore
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        mounted = false;
        window.removeEventListener('resize', handleResize);
        try {
          if (pathTracerRef.current) {
            if (typeof pathTracerRef.current.dispose === 'function') pathTracerRef.current.dispose();
          }
        } catch (e) {
          // ignore
        }
        pathTracerRef.current = null;
        setIsPathTracingReady(false);
        initializedRef.current = false;
      };
    } catch (error) {
      console.warn('Failed to initialize GPU Path Tracer:', error);
      setIsPathTracingReady(false);
    }
  }, [modelLoaded, threeScene, gl, camera, mobile.isMobile]);
  
  // Path tracing render loop with adaptive quality
   useFrame((state, delta) => {
     if (pathTracingEnabled && pathTracerRef.current && isPathTracingReady) {
       try {
         const pathTracer = pathTracerRef.current;
         
         // Adaptive rendering based on camera movement
         const lastPos = state.camera.userData.lastPosition;
         const cameraMoving = controls?.enabled && (
           lastPos ? state.camera.position.distanceTo(lastPos) > 0.001 : false
         );
         
         if (cameraMoving) {
           // Reset accumulation when camera moves
           if (typeof pathTracer.reset === 'function') pathTracer.reset();
           state.camera.userData.lastPosition = state.camera.position.clone();
         }

         // Prefer update(), fallback to render()
         if (typeof pathTracer.update === 'function') {
           pathTracer.update();
         } else if (typeof pathTracer.render === 'function') {
           pathTracer.render();
         }
         
         // Calculate progress robustly using sample counters when available
         const targetSamples = mobile ? 768 : 3072; // Cập nhật target samples cho realism tối đa
         let currentSamples = 0;
         if (typeof pathTracer.samples === 'number') {
           // some builds use samples as target, not progress
           currentSamples = pathTracer.sampleAccumulator || pathTracer.samplesAccumulated || pathTracer.currentSample || 0;
         }

         // Fallback: some versions expose sampleCount or sampleCounter
         currentSamples = currentSamples || pathTracer.sampleCount || pathTracer.sampleCounter || 0;

         // If still zero, try to infer from internal render target size (very rough)
         if (!currentSamples && typeof pathTracer.samples === 'number') currentSamples = Math.min(pathTracer.samples, targetSamples);

         const progress = targetSamples > 0 ? Math.min(currentSamples / targetSamples, 1) : 0;
         setPathTracingProgress(progress);

         // Auto-pause when converged to save resources - higher threshold for quality
         if (progress >= 0.98 && !cameraMoving) {
           // Optionally stop continuous accumulation to save GPU
           // Do not forcibly stop updates here so user can still re-enable if desired
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

  // Update cursor style when orbit control is enabled/disabled
  useEffect(() => {
    if (gl && gl.domElement) {
      gl.domElement.style.cursor = orbitControlEnabled ? 'grab' : 'default';
    }
  }, [orbitControlEnabled, gl]);

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
    } else if (!isNavigating && !selectedHotspot) {
      // comment these to turn off useframe
      // Only allow smooth scrolling when no hotspot is selected
      // if (targetPosition !== sheet.sequence.position) {
      //   const diff = targetPosition - sheet.sequence.position;
      //   const speed = 0.02; // Smooth scrolling speed

      //   if (Math.abs(diff) > 0.001) {
      //     sheet.sequence.position += diff * speed;
      //   } else {
      //     sheet.sequence.position = targetPosition;
      //   }
      // }
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
      // Only handle keys in explore mode and when no hotspot is selected
      if (!isExploreMode || selectedHotspot) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          // Navigate back to homepage
          window.location.href = "/";
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
          if (targetPosition < 18.1) {
            const newPosition = Math.min(18.1, targetPosition + 0.3);
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
  }, [onTourEnd, isExploreMode, targetPosition, setHasNavigated, selectedHotspot]);

  // Handle scroll only in explore mode
  useEffect(() => {
    const handleWheel = (event) => {
      // Only allow scroll if in explore mode, when not navigating, when chat is not focused, and when no hotspot is selected
      // Note: Removed showNavigationGuide blocking to allow scroll while guide is showing
      if (!isExploreMode || isNavigating || isChatFocused || selectedHotspot) {
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

        // Calculate new position based on current targetPosition (reversed: scroll up = forward, scroll down = backward)
        let newPosition = prevTarget - (deltaY * finalSensitivity);

        // Limit within range [0.1, 12.5] (entire sequence) - start from 0.1 to avoid wall clipping
        newPosition = Math.max(0, Math.min(18.1, newPosition));





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
      // Allow touch even when navigation guide is showing, but block when hotspot is selected
      if (!isExploreMode || isNavigating || selectedHotspot) return;

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
      // Allow touch move even when navigation guide is showing, but block when hotspot is selected
      if (!isExploreMode || !isTouching || isNavigating || selectedHotspot) return;

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

          let newPosition = prevTarget - (deltaY * touchSensitivity);
          newPosition = Math.max(0, Math.min(18.1, newPosition)); // Thống nhất range với wheel events



          return newPosition;
        });

        touchStartY = touchY;
        touchStartX = touchX;
        lastTouchTime = currentTime;
      }
    };

    const handleTouchEnd = () => {
      // Allow touch end even when navigation guide is showing, but block when hotspot is selected
      if (!isExploreMode || selectedHotspot) return;

      isTouching = false;



      // Add momentum scrolling for smooth experience - only if we actually swiped
      if (hasMovedSignificantly && Math.abs(touchVelocity) > 0.05) { // Lower threshold for momentum
        const momentum = touchVelocity * 0.5; // Increased momentum
        setTargetPosition(prevTarget => {
          if (isNaN(prevTarget)) {
            return 0;
          }

          let newPosition = prevTarget - momentum;
          newPosition = Math.max(0, Math.min(18.1, newPosition)); // Thống nhất range



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

  }, [gl.domElement, onHideControlPanel, onShowControlPanel, isExploreMode, mobile.isMobile, isNavigating, showNavigationGuide, isChatFocused, selectedHotspot]);

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
          
          // Reset previous highlighted mesh
          if (hoveredMesh && originalMaterial) {
            hoveredMesh.material = originalMaterial;
          }
          
          // Highlight new mesh with pink color for debug
          const mesh = intersectedMesh.object;
          if (mesh.material) {
            // Store original material
            setOriginalMaterial(mesh.material);
            
            // Create pink debug material
            const debugMaterial = mesh.material.clone();
            debugMaterial.color = new THREE.Color(0xff69b4); // Hot pink color
            debugMaterial.emissive = new THREE.Color(0x330022); // Slight pink glow
            
            // Apply debug material
            mesh.material = debugMaterial;
            setHoveredMesh(mesh);
          }
        }
      } else {
        // Reset highlighted mesh when clicking empty space
        if (hoveredMesh && originalMaterial) {
          hoveredMesh.material = originalMaterial;
          setHoveredMesh(null);
          setOriginalMaterial(null);
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
  }, [gl.domElement, camera, threeScene, isExploreMode, hoveredMesh, originalMaterial]);

  return (
    <>
      {/* Industrial Background - sử dụng industrial.jpg làm background */}
      <EnhancedBackground
        type="industrial"
        industrialOpacity={1.0}
        fallbackColor="#84a4f4"
        enableIndustrial={true}
      />
  


      {/* Enhanced Path Tracing Controls with Quality Settings */}
      {isPathTracingReady && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: '16px',
          borderRadius: '12px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          zIndex: 1000,
          minWidth: '260px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          <div style={{ marginBottom: '12px', fontWeight: 'bold', fontSize: '16px', color: '#4CAF50' }}>
            🎮 GPU Path Tracer (4K Quality)
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <button
              onClick={() => {
                setPathTracingEnabled(!pathTracingEnabled);
                if (pathTracerRef.current) {
                  pathTracerRef.current.reset();
                  setPathTracingProgress(0);
                }
              }}
              style={{
                background: pathTracingEnabled ? 
                  'linear-gradient(45deg, #4CAF50, #45a049)' : 
                  'linear-gradient(45deg, #f44336, #d32f2f)',
                color: 'white',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {pathTracingEnabled ? '🔥 Disable Path Tracing' : '⚡ Enable Path Tracing'}
            </button>
          </div>
          
          {pathTracingEnabled && (
            <div>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ 
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#81C784' }}>Rendering Progress:</span>
                  <span style={{ 
                    color: pathTracingProgress > 0.8 ? '#4CAF50' : '#FFC107',
                    fontWeight: 'bold'
                  }}>
                    {Math.round(pathTracingProgress * 100)}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${pathTracingProgress * 100}%`,
                    height: '100%',
                    background: pathTracingProgress > 0.8 ? 
                      'linear-gradient(90deg, #4CAF50, #81C784)' :
                      'linear-gradient(90deg, #FFC107, #FFD54F)',
                    transition: 'width 0.5s ease',
                    borderRadius: '4px'
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                    animation: pathTracingProgress < 0.95 ? 'shimmer 2s infinite' : 'none'
                  }} />
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => {
                    if (pathTracerRef.current) {
                      pathTracerRef.current.reset();
                      setPathTracingProgress(0);
                    }
                  }}
                  style={{
                    background: 'linear-gradient(45deg, #2196F3, #1976D2)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  🔄 Reset Rendering
                </button>
              </div>
              
              <div style={{ 
                fontSize: '12px', 
                color: '#B0BEC5',
                background: 'rgba(255,255,255,0.05)',
                padding: '8px',
                borderRadius: '6px',
                lineHeight: '1.4'
              }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Samples:</strong> {pathTracerRef.current?.samples || 0} / {mobile ? 768 : 3072}
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Quality:</strong> {mobile ? 'Mobile (High)' : 'Desktop (Ultra)'}
                </div>
                <div>
                  <strong>Status:</strong> {
                    pathTracingProgress < 0.1 ? '🟡 Starting...' :
                    pathTracingProgress < 0.5 ? '🟠 Rendering...' :
                    pathTracingProgress < 0.95 ? '🔵 Refining...' :
                    '🟢 Converged'
                  }
                </div>
              </div>
            </div>
          )}
          
          <style>
            {`
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `}
          </style>
        </div>
      )}

      {/* Enhanced HDR lighting setup for photorealistic PBR rendering (Game 4K quality) */}
      <HDREnvironment 
        hdrUrl="/textures/empty_play_room_2k.hdr"
        intensity={2.8}
        backgroundIntensity={0.9}
        enableBackground={false}
        enableToneMapping={true}
      />
      
      {/* Enhanced lighting system for maximum quality */}
      <EnhancedLighting type="main" enableHDR={false} shadowQuality="medium" />

      {/* Enhanced ground plane with realistic materials for maximum reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#e8e8e8"
          transparent
          opacity={0.08}
          roughness={0.85}
          metalness={0.03}
          envMapIntensity={0.6}
        />
      </mesh>

      <fog attach="fog" color="#84a4f4" near={0} far={100} />



      <Suspense fallback={null}>
        <Model
          activeSequence={activeSequence}
          onModelLoaded={() => {
            setModelLoaded(true);
            onModelLoaded?.();
          }}
        />
        {/* Door animation controller */}
        <DoorAnimation />
        
        {/* Grass Floor - sàn cỏ xung quanh nhà */}
        <GrassFloor size={[100, 100]} position={[29, -0.77, -25]} />
        
        {/* Tree Group - nhóm cây xung quanh nhà */}
        <TreeGroup />
      </Suspense>
    
      {/* Render all hotspots from sequenceChapters - always visible when model loads */}
      <HotspotsRenderer
        sequenceChapters={sequenceChapters}
        selectedHotspot={selectedHotspot}
        currentPosition={sheet.sequence.position}
        onHotspotClick={(chapterId) => {
          // Reset state khi chuyển sang khu vực khác
          setSelectedHotspot(null);
          setShowVideoScreen(null);
          setOrbitControlEnabled(false); // Disable orbit control when switching areas
          
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
              setActiveSequence(chapterId); // Activate mesh hiding for this sequence
              setOrbitControlEnabled(true); // Enable orbit control when hotspot is clicked
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
          setActiveSequence(null); // Turn off mesh hiding when closing hotspot detail
          setOrbitControlEnabled(false); // Disable orbit control when closing hotspot detail
        }}
      />

      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        fov={80} // Default FOV, will be overridden by FOVManager
        position={[33.5381764274176, 5.205671442619433, -22.03415991352903]}
      />

      {/* Orbit Controls - activated when hotspot is clicked */}
      <OrbitControls
        ref={orbitControlsRef}
        enabled={orbitControlEnabled}
        enablePan={true}
        enableRotate={orbitControlEnabled}
        enableZoom={orbitControlEnabled}
        minDistance={1}
        maxDistance={20}
        dampingFactor={0.05}
        enableDamping={true}
        
        target={selectedHotspot?.hotspot?.targetPosition || [0, 0, 0]}
        makeDefault={orbitControlEnabled}
        // Giới hạn góc xoay dọc (polar) - chỉ một chút
        minPolarAngle={Math.PI / 2 - THREE.MathUtils.degToRad(15)}    // 75° (ngẩng lên một chút)
        maxPolarAngle={Math.PI / 2 + THREE.MathUtils.degToRad(15)} // 105° (cúi xuống một chút)
        // Giới hạn góc quay ngang (azimuth) - tùy chỉnh cho từng hotspot
        // minAzimuthAngle={selectedHotspot?.hotspot?.azimuthLimits?.min || -Infinity}
        // maxAzimuthAngle={selectedHotspot?.hotspot?.azimuthLimits?.max || Infinity}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        }}
        // Touch controls for mobile zoom
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN
        }}
        // Cursor styles for better UX
        onStart={() => {
          if (gl && gl.domElement) {
            gl.domElement.style.cursor = 'grabbing';
          }
        }}
        // onChange={() => {
        //   // Debug góc quay khi người dùng tương tác
        //   if (orbitControlsRef.current) {
        //     console.log("Azimuth:", orbitControlsRef.current.getAzimuthalAngle() * 180 / Math.PI, "deg");
        //     console.log("Polar:", orbitControlsRef.current.getPolarAngle() * 180 / Math.PI, "deg");
        //   }
        // }}
        onEnd={() => {
          if (gl && gl.domElement) {
            gl.domElement.style.cursor = orbitControlEnabled ? 'grab' : 'default';
          }
        }}
      />

      {/* Post-processing effects for photorealistic quality (Game 4K) - Temporarily disabled */}
      {/* <EnhancedPostProcessing 
        enabled={!pathTracingEnabled} // Tắt post-processing khi path tracing đang chạy
        quality={mobile.isMobile ? "high" : "ultra"}
        enableCustomEffects={true}
      /> */}

    </>
  );
}
