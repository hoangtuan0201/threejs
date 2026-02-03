import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMobile } from '../hooks/useMobile';

/**
 * Rendering Optimizer Component
 * Configures Three.js renderer for optimal HDR and PBR performance
 * Based on Sketchfab-like quality recommendations
 */
export function RenderingOptimizer() {
  const { gl, scene } = useThree();
  const mobile = useMobile();

  useEffect(() => {
    if (!gl) return;


    // Output encoding for Three.js r149
    gl.outputEncoding = THREE.sRGBEncoding;

    // Antialias
    gl.antialias = true;

    // Pixel ratio
    const pixelRatio = mobile.isMobile
      ? Math.min(window.devicePixelRatio, 1.5) // Giảm pixel ratio cho mobile
      : Math.min(window.devicePixelRatio, 1.5);
    gl.setPixelRatio(pixelRatio);

    // Shadows
    gl.shadowMap.enabled = !mobile.isMobile; // Tắt shadow map trên mobile
    if (!mobile.isMobile) {
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      gl.shadowMap.autoUpdate = true;
    }

    // Lighting physically correct
    gl.physicallyCorrectLights = true;

  }, [gl, mobile.isMobile]);


  // Auto-update shadows on mobile when needed
  // Auto-update shadows on mobile removed as shadows are disabled
  useEffect(() => {
    // Cleanup if needed
  }, []);

  return null;
}

/**
 * Material Enhancer Hook
 * Optimizes materials for PBR rendering with HDR environment
 */
export function useMaterialEnhancer() {
  const mobile = useMobile();

  const enhanceMaterial = (material) => {
    if (!material) return;

    // PRESERVE ORIGINAL MATERIAL NAME
    const originalName = material.name;

    // Tăng environment map intensity cho reflections realistic hơn
    material.envMapIntensity = mobile.isMobile ? 2 : 2; // Tăng từ 1.2/1.5 lên 1.8/2.2

    if (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial) {
      // Điều chỉnh PBR properties cho realistic look
      material.metalness = material.metalness || 0.2; // Giảm từ 0.3 xuống 0.2
      material.roughness = material.roughness || 0.3; // Giảm từ 0.5 xuống 0.3 cho bóng hơn

      // Thêm clearcoat cho materials cao cấp
      if (material.isMeshPhysicalMaterial) {
        material.clearcoat = 0.3;
        material.clearcoatRoughness = 0.1;
      }


    }

    // RESTORE MATERIAL NAME AFTER ENHANCEMENT
    material.name = originalName;
    material.needsUpdate = true;
    return material;
  };

  return { enhanceMaterial };
}
