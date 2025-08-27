import React, { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import JEASINGS from 'jeasings';
import JEasings from './JEasings';

// HVAC Component positions với camera position và rotation cho mỗi hotspot
const HVAC_POSITIONS = {
  FCU: { 
    position: [21.8, 5, -15], 
    cameraPosition: [21.8, 5, -14],
  },  
  CDU: { 
    position: [22, 5.3, -21], 
    cameraPosition: [23.2, 5.5, -21],
  },
  Thermostat: { 
    position: [30.1, 7, -22], 
    cameraPosition: [30, 6.7, -24],
  },
 
  Ducts: { 
    position: [13, 4.99, -34], 
    cameraPosition: [12, 4.99, -34],
  }
};

function CameraController({ targetPosition, onComplete, onCameraUpdate, orbitControlsRef, activeComponent }) {
  const { camera } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);
  const rotationAnimationRef = useRef(null);
  const targetAnimationRef = useRef(null);

  useEffect(() => {
    if (targetPosition && camera && orbitControlsRef.current) {
      setIsAnimating(true);
      
      // Stop any existing animations
      if (animationRef.current && animationRef.current.stop) {
        animationRef.current.stop();
      }
      if (rotationAnimationRef.current && rotationAnimationRef.current.stop) {
        rotationAnimationRef.current.stop();
      }
      if (targetAnimationRef.current && targetAnimationRef.current.stop) {
        targetAnimationRef.current.stop();
      }
      
      // Animate camera position
      animationRef.current = new JEASINGS.JEasing(camera.position)
        .to({
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z
        }, 3000)
        .easing(JEASINGS.Cubic.Out)
        .start();
      
      // Animate camera rotation if activeComponent has cameraRotation
      if (activeComponent && HVAC_POSITIONS[activeComponent] && HVAC_POSITIONS[activeComponent].cameraRotation) {
        const targetRotation = HVAC_POSITIONS[activeComponent].cameraRotation;
        rotationAnimationRef.current = new JEASINGS.JEasing(camera.rotation)
          .to({
            x: targetRotation[0],
            y: targetRotation[1],
            z: targetRotation[2]
          }, 2500)
          .easing(JEASINGS.Cubic.Out)
          .start();
      }
      
      // Animate OrbitControls target
      let newTarget;
      if (activeComponent && HVAC_POSITIONS[activeComponent]) {
        const hotspotPos = HVAC_POSITIONS[activeComponent].position;
        newTarget = { x: hotspotPos[0], y: hotspotPos[1], z: hotspotPos[2] };
      } else {
        newTarget = { x: 28.7, y: 6.2, z: -26.1 };
      }
      
      targetAnimationRef.current = new JEASINGS.JEasing(orbitControlsRef.current.target)
        .to(newTarget, 2500)
        .easing(JEASINGS.Cubic.Out)
        .start()
        .onComplete(() => {
          setIsAnimating(false);
          if (onComplete) onComplete();
        });
    }
  }, [targetPosition, camera, orbitControlsRef, activeComponent]);

  useFrame(() => {
    if (camera) {
      // Update OrbitControls
      if (orbitControlsRef.current) {
        orbitControlsRef.current.update();
      }
      
      // Update camera position and rotation in debug panel
      if (onCameraUpdate) {
        onCameraUpdate(
          { x: camera.position.x, y: camera.position.y, z: camera.position.z },
          { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z }
        );
      }
    }
  });

  return <JEasings />;
}

export default CameraController;
export { HVAC_POSITIONS };