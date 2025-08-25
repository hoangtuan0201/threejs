import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import * as THREE from 'three';
import { Hotspot, CameraController, BuildingModel, HVAC_POSITIONS } from '../components/XRayMode';







// Main X-Ray Mode Component
export default function XRayMode() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isXRayMode, setIsXRayMode] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [cameraTarget, setCameraTarget] = useState(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [currentCameraPos, setCurrentCameraPos] = useState({ x: 42.08, y: 8.38, z: -25.98 });
  const [currentCameraRot, setCurrentCameraRot] = useState({ x: 0, y: 0, z: 0 });
  const orbitControlsRef = useRef();

  const handleHotspotClick = (componentKey) => {
    const component = HVAC_POSITIONS[componentKey];
    setActiveComponent(componentKey);
    setIsXRayMode(true);
    
    // Calculate camera position with zoom distance of 1 from hotspot
    const hotspotPos = component.position;
    const targetPos = new THREE.Vector3(
      hotspotPos[0] + 1,
      hotspotPos[1] + 1,
      hotspotPos[2] + 1
    );
    setCameraTarget(targetPos);
  };

  const handleExitXRay = () => {
    setIsXRayMode(false);
    setActiveComponent(null);
    // Reset camera to initial position smoothly
    setCameraTarget(new THREE.Vector3(43, 8, -25.98));
  };

  const handleExit = () => {
    navigate('/');
  };

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
          <Button
            variant="outlined"
            onClick={() => setShowHotspots(!showHotspots)}
            startIcon={showHotspots ? <VisibilityOff /> : <Visibility />}
            sx={{ color: theme.colors.text.primary }}
          >
            {showHotspots ? 'Hide' : 'Show'} Hotspots
          </Button>
          
          {isXRayMode && (
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
          
          <IconButton
            onClick={handleExit}
            sx={{ 
              color: theme.colors.text.primary,
              bgcolor: theme.colors.background.secondary,
              '&:hover': { bgcolor: theme.colors.background.tertiary }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Component Info Panel */}
      {activeComponent && (
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
      )}

      {/* Instructions */}
      {!isXRayMode && (
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
            • X-Ray mode reveals internal systems
          </Typography>
        </Box>
      )}

      {/* Debug Info */}
      <Box sx={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,
        background: theme.colors.background.overlay,
        backdropFilter: 'blur(10px)',
        borderRadius: 1,
        p: 2,
        minWidth: 200,
        border: `1px solid ${theme.colors.border.light}`
      }}>
        <Typography variant="h6" sx={{ 
          color: theme.colors.text.primary,
          mb: 1,
          fontSize: '14px'
        }}>
          Debug Info
        </Typography>
        <Typography variant="body2" sx={{ 
          color: theme.colors.text.secondary,
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          Position: [{currentCameraPos.x.toFixed(2)}, {currentCameraPos.y.toFixed(2)}, {currentCameraPos.z.toFixed(2)}]
        </Typography>
        <Typography variant="body2" sx={{ 
          color: theme.colors.text.secondary,
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          Rotation: [{currentCameraRot.x.toFixed(2)}, {currentCameraRot.y.toFixed(2)}, {currentCameraRot.z.toFixed(2)}]
        </Typography>
        {activeComponent && (
          <>
            <Typography variant="body2" sx={{ 
              color: theme.colors.text.secondary,
              fontSize: '12px',
              fontFamily: 'monospace',
              mt: 1
            }}>
              Position: [{HVAC_POSITIONS[activeComponent].position.join(', ')}]
            </Typography>
            <Typography variant="body2" sx={{ 
              color: theme.colors.text.secondary,
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              Rotation: [{HVAC_POSITIONS[activeComponent].rotation.join(', ')}]
            </Typography>
          </>
        )}
      </Box>

      {/* 3D Canvas */}
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{
          position: [42.08, 8.38, -25.98],
          fov: 75
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <OrbitControls 
          ref={orbitControlsRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={20}
          target={[27.23, 0.00, -25.55]}
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
            setCurrentCameraPos(pos);
            setCurrentCameraRot(rot);
          }}
          orbitControlsRef={orbitControlsRef}
          activeComponent={activeComponent}
        />
        
        <BuildingModel 
          isXRayMode={isXRayMode}
          highlightedComponent={activeComponent}
        />
        
        {/* Hotspots */}
        {showHotspots && Object.entries(HVAC_POSITIONS).map(([key, data]) => {
          // Ẩn hotspot hiện tại khi đã click vào nó (khi activeComponent === key)
          const shouldShowHotspot = !isXRayMode || activeComponent !== key;
          
          return shouldShowHotspot ? (
            <Hotspot
              key={key}
              position={data.position}
              rotation={data.rotation}
              label={data.label}
              isActive={activeComponent === key}
              onClick={() => handleHotspotClick(key)}
            />
          ) : null;
        })}
      </Canvas>
    </Box>
  );
}