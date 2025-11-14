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

    // Tone mapping cải thiện cho màu sắc realistic hơn
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0; // 1.0 là trung tính, bạn có thể chỉnh 0.8 - 1.2 tùy cảnh

    // Color space
    gl.outputColorSpace = THREE.SRGBColorSpace;

    // Antialias
    gl.antialias = true;

    // Pixel ratio
    const pixelRatio = mobile.isMobile
      ? Math.min(window.devicePixelRatio, 2)
      : Math.min(window.devicePixelRatio, 1.5);
    gl.setPixelRatio(pixelRatio);

    // Shadows
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.shadowMap.autoUpdate = true;

    // Lighting physically correct
    gl.physicallyCorrectLights = true;

  }, [gl, mobile.isMobile]);


  // Auto-update shadows on mobile when needed
  useEffect(() => {
    if (mobile.isMobile && gl?.shadowMap) {
      const updateShadows = () => {
        gl.shadowMap.needsUpdate = true;
      };
      
      // Update shadows periodically on mobile
      const interval = setInterval(updateShadows, 1000);
      return () => clearInterval(interval);
    }
  }, [gl, mobile.isMobile]);

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
    material.envMapIntensity = mobile.isMobile ? 1.8 : 2.2; // Tăng từ 1.2/1.5 lên 1.8/2.2

    if (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial) {
      // Điều chỉnh PBR properties cho realistic look
      material.metalness = material.metalness || 0.2; // Giảm từ 0.3 xuống 0.2
      material.roughness = material.roughness || 0.3; // Giảm từ 0.5 xuống 0.3 cho bóng hơn
      
      // Thêm clearcoat cho materials cao cấp
      if (material.isMeshPhysicalMaterial) {
        material.clearcoat = 0.3;
        material.clearcoatRoughness = 0.1;
      }

      // Mobile vẫn giữ chất lượng cao
      if (mobile.isMobile) {
        material.envMapIntensity *= 0.9; // Giảm ít hơn, từ 0.8 lên 0.9
      }
    }

    // RESTORE MATERIAL NAME AFTER ENHANCEMENT
    material.name = originalName;
    material.needsUpdate = true;
    return material;
  };
  
  return { enhanceMaterial };
}
