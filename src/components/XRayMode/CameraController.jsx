import React, { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// HVAC Component positions
const HVAC_POSITIONS = {
  FCU: { position: [21.8, 5, -15], rotation: [0, 0, 0], label: 'Fan Coil Unit' },
  CDU: { position: [23.2, 5.3, -20], rotation: [0, 0, 0], label: 'Condensing Unit' },
  Thermostat: { position: [30.1, 5, -22], rotation: [0, 0, 0], label: 'Thermostat' },
  Grilles: { position: [30.6, 7, -23], rotation: [-3, 0, -3.14], label: 'Air Grilles' },
  Ducts: { position: [13, 5, -34], rotation: [0, 0, 0], label: 'Ductwork' }
};

function CameraController({ targetPosition, onComplete, onCameraUpdate, orbitControlsRef, activeComponent }) {
  const { camera } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);
  const startPosition = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const startTime = useRef(0);
  const duration = 2000; // 2 seconds

  useEffect(() => {
    if (targetPosition && camera && orbitControlsRef.current) {
      startPosition.current.copy(camera.position);
      startTarget.current.copy(orbitControlsRef.current.target);
      startTime.current = Date.now();
      setIsAnimating(true);
    }
  }, [targetPosition, camera, orbitControlsRef]);

  useFrame(() => {
    if (camera) {
      if (isAnimating && targetPosition && orbitControlsRef.current) {
        const elapsed = Date.now() - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Animate camera position
        camera.position.lerpVectors(startPosition.current, targetPosition, eased);
        
        // Update OrbitControls target based on active component
        let newTarget;
        if (activeComponent && HVAC_POSITIONS[activeComponent]) {
          // Set target to the hotspot position for focused view
          const hotspotPos = HVAC_POSITIONS[activeComponent].position;
          newTarget = new THREE.Vector3(hotspotPos[0], hotspotPos[1], hotspotPos[2]);
          
          // Set zoom to 1 when focusing on hotspot
          if (progress >= 1) {
            const direction = new THREE.Vector3().subVectors(camera.position, newTarget).normalize();
            const zoomDistance = 1;
            camera.position.copy(newTarget).add(direction.multiplyScalar(zoomDistance));
          }
        } else {
          // Default target for overview
          newTarget = new THREE.Vector3(27.23, 0.00, -25.55);
        }
        
        orbitControlsRef.current.target.lerpVectors(startTarget.current, newTarget, eased);
        orbitControlsRef.current.update();
        
        if (progress >= 1) {
          setIsAnimating(false);
          if (onComplete) onComplete();
        }
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

  return null;
}

export default CameraController;
export { HVAC_POSITIONS };