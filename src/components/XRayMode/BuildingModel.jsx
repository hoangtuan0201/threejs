import React, { useRef, useEffect, useMemo } from 'react';
  import { useGLTF } from '@react-three/drei';
  import * as THREE from 'three';

  function BuildingModel({ isXRayMode, highlightedComponent }) {
    const { scene } = useGLTF('/3ddd.glb');
    const modelRef = useRef();
    const materialsRef = useRef(new Map()); // Lưu cả original và xray materials
    
    // Clone scene một lần duy nhất và tạo materials
    const clonedScene = useMemo(() => {
      if (!scene) return null;
      const cloned = scene.clone();
      
      // Tạo cả original và xray materials một lần duy nhất
      cloned.traverse((child) => {
        if (child.isMesh && child.material) {
          const materialId = child.uuid;
          if (!materialsRef.current.has(materialId)) {
            const originalMaterial = child.material.clone();
            
            // Tạo xray material với transparency settings chuẩn
            const xrayMaterial = originalMaterial.clone();
            xrayMaterial.transparent = true;
            xrayMaterial.opacity = 0.5;
            xrayMaterial.alphaTest = 0;
            xrayMaterial.depthWrite = false; // Quan trọng: tắt depth write cho transparency
              xrayMaterial.side = THREE.DoubleSide;
            xrayMaterial.needsUpdate = true;
            
            // Lưu cả 2 loại material
            materialsRef.current.set(materialId, {
              original: originalMaterial,
              xray: xrayMaterial
            });
          }
        }
      });
      
      return cloned;
    }, [scene]);
    
    useEffect(() => {
      if (modelRef.current && clonedScene) {
        modelRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            const materialId = child.uuid;
            const materials = materialsRef.current.get(materialId);
            
            if (!materials) return;
            
            if (isXRayMode) {
              // Clone material để tránh mutating shared material (giống Model.jsx)
              child.material = materials.xray.clone();
              child.material.transparent = true;
              child.material.opacity = 0.5;
              child.material.depthWrite = true;
              child.material.needsUpdate = true;
              
              // Highlight specific component
              if (highlightedComponent && child.name && child.name.toLowerCase().includes(highlightedComponent.toLowerCase())) {
                child.material.emissive = new THREE.Color(0x00ff00);
                child.material.emissiveIntensity = 0.5;
                child.material.opacity = 1.0;
                child.material.depthWrite = true;
                child.material.transparent = false; // Highlighted không trong suốt
              }
            } else {
              // Clone original material để tránh mutating shared material
              child.material = materials.original.clone();
              child.material.needsUpdate = true;
            }
          }
        });
      }
    }, [isXRayMode, highlightedComponent, clonedScene]);

    if (!clonedScene) return null;
    
    return <primitive ref={modelRef} object={clonedScene} />;
  }

  // Preload the model
  useGLTF.preload('/3ddd.glb');

  export default BuildingModel;