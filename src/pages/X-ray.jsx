import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import * as THREE from 'three';

// HVAC Component positions (adjust based on your model)
const HVAC_POSITIONS = {
  FCU: { position: [2, 3, 1], label: 'Fan Coil Unit' },
  CDU: { position: [-2, 2, -1], label: 'Condensing Unit' },
  Thermostat: { position: [0, 1.5, 2], label: 'Thermostat' },
  Grilles: { position: [1, 2.5, -2], label: 'Air Grilles' },
  Ducts: { position: [-1, 3.5, 0], label: 'Ductwork' }
};

// Hotspot Component
function Hotspot({ position, label, onClick, isActive }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial 
          color={isActive ? '#ff6b6b' : '#ffffff'} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      <Html distanceFactor={10}>
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          transform: 'translate(-50%, -100%)',
          marginTop: '-10px'
        }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

// Camera Controller
function CameraController({ targetPosition, onComplete }) {
  const { camera } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);
  const startPosition = useRef(new THREE.Vector3());
  const startTime = useRef(0);
  const duration = 2000; // 2 seconds

  useEffect(() => {
    if (targetPosition) {
      startPosition.current.copy(camera.position);
      startTime.current = Date.now();
      setIsAnimating(true);
    }
  }, [targetPosition, camera]);

  useFrame(() => {
    if (isAnimating && targetPosition) {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing
      const eased = 1 - Math.pow(1 - progress, 3);
      
      camera.position.lerpVectors(startPosition.current, targetPosition, eased);
      camera.lookAt(0, 0, 0);
      
      if (progress >= 1) {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }
    }
  });

  return null;
}

// Building Model with transparency
function BuildingModel({ isXRayMode, highlightedComponent }) {
  const { scene } = useGLTF('/3ddd.glb');
  const modelRef = useRef();
  
  useEffect(() => {
    if (modelRef.current && scene) {
      modelRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          // Store original material if not already stored
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material.clone();
          }
          
          if (isXRayMode) {
            // Apply transparency to building
            const newMaterial = child.userData.originalMaterial.clone();
            newMaterial.transparent = true;
            newMaterial.opacity = 0.5;
            child.material = newMaterial;
            
            // Highlight specific component
            if (highlightedComponent && child.name && child.name.toLowerCase().includes(highlightedComponent.toLowerCase())) {
              child.material.emissive = new THREE.Color(0x00ff00);
              child.material.emissiveIntensity = 0.5;
            }
          } else {
            // Restore original material
            child.material = child.userData.originalMaterial;
          }
        }
      });
    }
  }, [isXRayMode, highlightedComponent, scene]);

  if (!scene) return null;
  
  return <primitive ref={modelRef} object={scene.clone()} />;
}

// Main X-Ray Mode Component
export default function XRayMode() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isXRayMode, setIsXRayMode] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [cameraTarget, setCameraTarget] = useState(null);
  const [showHotspots, setShowHotspots] = useState(true);

  const handleHotspotClick = (componentKey) => {
    const component = HVAC_POSITIONS[componentKey];
    setActiveComponent(componentKey);
    setIsXRayMode(true);
    
    // Calculate camera position (move camera closer to the component)
    const targetPos = new THREE.Vector3(
      component.position[0] + 3,
      component.position[1] + 2,
      component.position[2] + 3
    );
    setCameraTarget(targetPos);
  };

  const handleExitXRay = () => {
    setIsXRayMode(false);
    setActiveComponent(null);
    setCameraTarget(new THREE.Vector3(5, 5, 5)); // Reset camera position
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
        right: 20,
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

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [5, 5, 5], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
        />
        
        <CameraController 
          targetPosition={cameraTarget}
          onComplete={() => setCameraTarget(null)}
        />
        
        <BuildingModel 
          isXRayMode={isXRayMode}
          highlightedComponent={activeComponent}
        />
        
        {/* Hotspots */}
        {showHotspots && Object.entries(HVAC_POSITIONS).map(([key, data]) => (
          <Hotspot
            key={key}
            position={data.position}
            label={data.label}
            isActive={activeComponent === key}
            onClick={() => handleHotspotClick(key)}
          />
        ))}
      </Canvas>
    </Box>
  );
}

// Preload the model
useGLTF.preload('/3ddd.glb');