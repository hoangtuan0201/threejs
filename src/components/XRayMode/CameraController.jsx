import React, { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

// HVAC Component positions với camera position và rotation cho mỗi hotspot
const HVAC_POSITIONS = {
  FCU: { 
    position: [21.8, 5, -15], 
    cameraPosition: [21.8, 5, -14],
    label: "Outdoor"
  },  
  CDU: { 
    position: [22, 5.3, -21], 
    cameraPosition: [23.2, 5.5, -21],
    label: "Study Room"
  },
  Thermostat: { 
    position: [30.1, 7, -22], 
    cameraPosition: [30, 6.7, -23.5],
    label: "Living Room"
  },
  Ducts: { 
    position: [14, 5.3, -34], 
    cameraPosition: [13, 5.3, -34],
    label: "Air purification"
  },
  Bedroom: {
    position: [15.5, 5.3, -24], 
    cameraPosition: [14.5, 5.3, -24],
    label: "Bedroom"
  },
  MediaRoom: {
    position: [21.47, 1.2, -21.56], 
    cameraPosition: [21, 1.2, -21],
    label: "Media Room"
  },
  LivingRoom2: {
    position: [22, 5.5, -30], 
    cameraPosition: [22, 4.8, -29.5],
    label: "Living Room 2"
  },
  Kitchen: {
    position: [15.26, 5.5, -28],
    cameraPosition: [15.35, 4.9, -29],
    label: "Kitchen"
  }
};

function CameraController({ targetPosition, onComplete, onCameraUpdate, orbitControlsRef, activeComponent }) {
  const { camera } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (targetPosition && camera && orbitControlsRef.current) {
      setIsAnimating(true);
      
      // Kill any existing animations
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      
      // Create GSAP timeline
      timelineRef.current = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          if (onComplete) onComplete();
        }
      });
      
      // Animate camera position
      timelineRef.current.to(camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 2,
        ease: "power2.out"
      }, 0);
      
      // Animate camera rotation if activeComponent has cameraRotation
      if (activeComponent && HVAC_POSITIONS[activeComponent] && HVAC_POSITIONS[activeComponent].cameraRotation) {
        const targetRotation = HVAC_POSITIONS[activeComponent].cameraRotation;
        timelineRef.current.to(camera.rotation, {
          x: targetRotation[0],
          y: targetRotation[1],
          z: targetRotation[2],
          duration: 2,
          ease: "power2.out"
        }, 0);
      }
      
      // Animate OrbitControls target
      let newTarget;
      if (activeComponent && HVAC_POSITIONS[activeComponent]) {
        const hotspotPos = HVAC_POSITIONS[activeComponent].position;
        newTarget = { x: hotspotPos[0], y: hotspotPos[1], z: hotspotPos[2] };
      } else {
        newTarget = { x: 28.7, y: 6.2, z: -26.1 };
      }
      
      timelineRef.current.to(orbitControlsRef.current.target, {
        x: newTarget.x,
        y: newTarget.y,
        z: newTarget.z,
        duration: 2,
        ease: "power2.out"
      }, 0);
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

  return null;
}

export default CameraController;
export { HVAC_POSITIONS };