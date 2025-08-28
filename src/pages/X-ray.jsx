import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useProgress } from '@react-three/drei';
import { Box, Button, Typography } from '@mui/material';
import MobileHomeButton from '../components/MobileHomeButton';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import * as THREE from 'three';
import gsap from 'gsap';
import { Hotspot, CameraController, BuildingModel, HVAC_POSITIONS } from '../components/XRayMode';
import { HotspotsRenderer } from '../components/Hotspot';
import { HotspotDetail } from '../components/HotspotDetail';
import { VideoScreen } from '../components/VideoScreen';
import { sequenceChaptersXray } from '../data/sequenceChaptersXray';
import { Background } from '../components/Background';
import GrassFloor from '../components/GrassFloor';
import LoadingScreen from '../components/LoadingScreen';

// Component để setup custom transparent sorting
function TransparentSortingSetup() {
  const { gl } = useThree();
  
  useEffect(() => {
    // Áp dụng custom transparent sorting để khắc phục lỗi transparency khi xoay camera
    gl.setTransparentSort((a, b) => {
      // Sort theo khoảng cách z để đảm bảo transparent objects render đúng thứ tự
      return a.z - b.z;
    });
  }, [gl]);
  
  return null;
}



// Main X-Ray Mode Component
export default function XRayMode() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeComponent, setActiveComponent] = useState(null);
  const [cameraTarget, setCameraTarget] = useState(null);
  // const [showHotspots, setShowHotspots] = useState(true); // DISABLED
  const [currentRoom, setCurrentRoom] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track asset loading progress
  const { progress: assetProgress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  
  // HVAC component positions for camera movement
  const hvacComponents = Object.keys(HVAC_POSITIONS);
  const [currentHVACIndex, setCurrentHVACIndex] = useState(0);
  // Sử dụng useRef thay vì state để tránh re-render liên tục
  const currentCameraPosRef = useRef({ x: 42.08, y: 20, z: -24.98 });
  const currentCameraRotRef = useRef({ x: 0, y: 0, z: 0 });
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showVideoScreen, setShowVideoScreen] = useState(null);
  const [activeSequence, setActiveSequence] = useState(null); // Sequence đang active
  const orbitControlsRef = useRef();
  const limit = THREE.MathUtils.degToRad(15); // 15 độ




  // Reset progress when component mounts
  useEffect(() => {
    setDisplayProgress(0);
    setIsLoading(true);
    
    // Force reset drei progress by clearing its cache
    if (window.__drei_progress_cache) {
      window.__drei_progress_cache = null;
    }
    
    return () => {
      // Clean up on unmount
      setDisplayProgress(0);
    };
  }, []);

  // Update display progress based on asset progress with smooth transition
  useEffect(() => {
    if (assetProgress > displayProgress) {
      // Smooth increment for better UX
      const increment = Math.min(assetProgress - displayProgress, 5);
      const timer = setTimeout(() => {
        setDisplayProgress(prev => Math.min(prev + increment, assetProgress));
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(assetProgress);
    }
  }, [assetProgress, displayProgress]);

  // Hide loading screen when both model progress and display progress are complete
  useEffect(() => {
    // Only hide loading when progress reaches 100%
    if (displayProgress >= 100) {
      // Add small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [displayProgress]);

  const handleHotspotClick = (componentKey) => {
    // Handle HVAC hotspots
    if (HVAC_POSITIONS[componentKey]) {
      const component = HVAC_POSITIONS[componentKey];
      setActiveComponent(componentKey);
      
      // Sử dụng cameraPosition từ HVAC_POSITIONS
      const cameraPos = component.cameraPosition;
      const targetPos = new THREE.Vector3(
        cameraPos[0],
        cameraPos[1],
        cameraPos[2]
      );
      setCameraTarget(targetPos);
    } else {
      // Handle sequence chapter hotspots - sử dụng hệ thống ẩn mesh thay vì X-ray
      const chapter = sequenceChaptersXray.find(ch => ch.id === componentKey);
      
      if (chapter && chapter.hotspot) {
        setActiveSequence(componentKey); // Kích hoạt ẩn mesh cho sequence này
        setSelectedHotspot(chapter);
        setShowVideoScreen(chapter);
      }
    }
  };

  const handleCloseHotspotDetail = () => {
    setSelectedHotspot(null);
    setShowVideoScreen(null);
    setActiveSequence(null); // Tắt ẩn mesh khi đóng hotspot detail
  };



  const handleExit = () => {
    // Tự động tắt hotspot khi rời khỏi
    setSelectedHotspot(null);
    setShowVideoScreen(null);
    setActiveSequence(null);
    setActiveComponent(null);
    navigate('/');
  };

  const handleExitXRay = () => {
    // Tự động tắt hotspot khi exit X-ray mode
    setSelectedHotspot(null);
    setShowVideoScreen(null);
    setActiveSequence(null);
    setActiveComponent(null);
    // Reset camera to initial position smoothly
    setCameraTarget(new THREE.Vector3(42.08, 20, -24.98));
  };

  const handleResetState = () => {
    // Reset state khi chuyển sang khu vực khác
    console.log('X-ray: handleResetState called');
    setSelectedHotspot(null);
    setShowVideoScreen(null);
    setActiveSequence(null);
    setActiveComponent(null);
  };

  // Show loading screen while loading
  if (isLoading) {
    return (
      <LoadingScreen
        text="Loading X-Ray Mode..."
        variant="xray"
        progress={displayProgress >= 100 ? 1 : displayProgress / 100}
      />
    );
  }

  return (
    <Box sx={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      background: theme.colors.background.primary
    }}>
      {/* Header Controls */}
      <Box sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 300,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h4" sx={{ 
          color: theme.colors.text.primary,
          fontWeight: 'bold'
        }}>
          X-Ray Mode
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Nút Next Component chỉ hiện khi đã chọn hotspot */}
          {activeComponent && (
            <Button
              variant="outlined"
              onClick={() => {
                // Reset state trước khi chuyển sang component khác
                handleResetState();
                
                const nextIndex = (currentHVACIndex + 1) % hvacComponents.length;
                setCurrentHVACIndex(nextIndex);
                const componentKey = hvacComponents[nextIndex];
                const component = HVAC_POSITIONS[componentKey];
                const targetPos = new THREE.Vector3(
                  component.cameraPosition[0],
                  component.cameraPosition[1],
                  component.cameraPosition[2]
                );
                
                setCameraTarget(targetPos);
                setActiveComponent(componentKey);
              }}
              sx={{ color: theme.colors.text.primary }}
            >
              Next Component ({hvacComponents[currentHVACIndex]})
            </Button>
          )}
          
          {/* Nút Exit X-Ray chỉ hiện khi có activeComponent */}
          {activeComponent && (
            <Button
              variant="contained"
              onClick={handleExitXRay}
              sx={{
                background: theme.gradients.accent,
                color: theme.colors.text.inverse
              }}
            >
              Exit X-Ray
            </Button>
          )}
          
          
          <MobileHomeButton
            onGoHome={handleExit}
            isVisible={true}
          />
        </Box>
      </Box>

      {/* Component Info Panel */}
      {/* {activeComponent && (
        <Box sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          zIndex: 1000,
          background: theme.colors.background.overlay,
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          p: 3,
          border: `1px solid ${theme.colors.border.light}`
        }}>
          <Typography variant="h6" sx={{ 
            color: theme.colors.text.primary,
            mb: 1
          }}>
            {HVAC_POSITIONS[activeComponent].label}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: theme.colors.text.secondary
          }}>
            Viewing {activeComponent} component in X-Ray mode. The building structure is now transparent to show internal HVAC systems.
          </Typography>
        </Box>
      )} */}

      {/* Instructions - only show when no hotspot is selected */}
      {/* {!activeComponent && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: 20,
          transform: 'translateY(-50%)',
          zIndex: 1000,
          background: theme.colors.background.overlay,
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          p: 3,
          maxWidth: 300,
          border: `1px solid ${theme.colors.border.light}`
        }}>
          <Typography variant="h6" sx={{ 
            color: theme.colors.text.primary,
            mb: 2
          }}>
            Instructions
          </Typography>
          <Typography variant="body2" sx={{ 
            color: theme.colors.text.secondary,
            mb: 1
          }}>
            • Click on white hotspots to explore HVAC components
          </Typography>
          <Typography variant="body2" sx={{ 
            color: theme.colors.text.secondary,
            mb: 1
          }}>
            • Use mouse to orbit, zoom, and pan around the model
          </Typography>
          <Typography variant="body2" sx={{ 
            color: theme.colors.text.secondary
          }}>
            • Sequence chapters reveal internal systems
          </Typography>
        </Box>
      )} */}


      {/* 3D Canvas */}
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{
          position: [42.08, 20, -24.98],
          fov: 75
        }}
      >
        {/* Setup custom transparent sorting để khắc phục lỗi transparency */}
        <TransparentSortingSetup />
        
        {/* Industrial Background */}
        <Suspense fallback={null}>
          <Background 
            imageUrl="/industrial.jpg"
            opacity={1.0}
            enableBackground={true}
          />
        </Suspense>
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={false}
          enableRotate={true}
          enableZoom={activeComponent ? false : true}
          minDistance={1}
          maxDistance={20}
          target={[28.7, 6.2, -26.1]}
          makeDefault
          // Giới hạn góc xoay dọc (polar) - chỉ một chút
          minPolarAngle={Math.PI / 2 - limit}    // 60° (ngẩng lên một chút)
          maxPolarAngle={Math.PI / 2 + limit} // 120° (cúi xuống một chút)
          mouseButtons={{
            LEFT: 0, // Rotate with left mouse button
            MIDDLE: 1, // Zoom with middle mouse button
            RIGHT: null // Disable right mouse button
          }}
        />
        
        <CameraController 
          targetPosition={cameraTarget}
          onComplete={() => setCameraTarget(null)}
          onCameraUpdate={(pos, rot) => {
            // Sử dụng ref thay vì setState để tránh re-render
            currentCameraPosRef.current = pos;
            currentCameraRotRef.current = rot;
          }}
          orbitControlsRef={orbitControlsRef}
          activeComponent={activeComponent}
        />
        
        <Suspense fallback={null}>
          <BuildingModel 
            highlightedComponent={activeComponent}
            activeSequence={activeSequence}
            onSequenceTransitionComplete={(action, mesh) => {
              // Callback khi transition hoàn thành
              // console.log(`Sequence transition ${action} completed for mesh:`, mesh.name);
            }}
          />
        </Suspense>
        
        {/* Thảm đá lót sàn */}
        <GrassFloor 
          size={[100, 100]} 
          position={[0, -0.77, 0]} 
        />
        {/* HVAC Hotspots - hide when selected */}
        {Object.entries(HVAC_POSITIONS).map(([key, data]) => {
          // Hide hotspot when it's the active component
          if (activeComponent === key) return null;
          
          return (
            <Hotspot
              key={key}
              position={data.position}
              rotation={data.rotation}
              label={data.label}
              isActive={activeComponent === key}
              onClick={() => handleHotspotClick(key)}
              onResetState={handleResetState}
            />
          );
        })}
        
        {/* Sequence Chapter Hotspots - always visible */}
        <HotspotsRenderer
          sequenceChapters={sequenceChaptersXray}
          onHotspotClick={handleHotspotClick}
          selectedHotspot={selectedHotspot}
          currentPosition={1.0} // Default position for X-ray mode
        />
        
        {/* Hotspot Detail Popup */}
        {selectedHotspot && (
          <HotspotDetail
            selectedHotspot={selectedHotspot}
            onClose={handleCloseHotspotDetail}
          />
        )}
        
        {/* Video Screen */}
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
      </Canvas>
    </Box>
  );
}