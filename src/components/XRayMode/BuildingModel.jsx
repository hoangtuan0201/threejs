import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

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
            newMaterial.alphaTest = 0; // Đảm bảo alpha test không can thiệp
            newMaterial.depthWrite = false; // Tắt depth write để transparency hoạt động đúng
            newMaterial.side = THREE.DoubleSide; // Hiển thị cả hai mặt
            newMaterial.needsUpdate = true; // Buộc cập nhật material
            child.material = newMaterial;
            
            // Highlight specific component
            if (highlightedComponent && child.name && child.name.toLowerCase().includes(highlightedComponent.toLowerCase())) {
              child.material.emissive = new THREE.Color(0x00ff00);
              child.material.emissiveIntensity = 0.5;
              child.material.opacity = 1.0; // Component được highlight sẽ không trong suốt
            }
          } else {
            // Restore original material
            const originalMaterial = child.userData.originalMaterial.clone();
            originalMaterial.needsUpdate = true;
            child.material = originalMaterial;
          }
        }
      });
    }
  }, [isXRayMode, highlightedComponent, scene]);

  if (!scene) return null;
  
  return <primitive ref={modelRef} object={scene.clone()} />;
}

// Preload the model
useGLTF.preload('/3ddd.glb');

export default BuildingModel;