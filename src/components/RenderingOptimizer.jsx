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

  // Tone mapping (chuẩn PBR/HDR)
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.0; // 1.0 là trung tính, bạn có thể chỉnh 0.8 - 1.2 tùy cảnh

  // Color space
  gl.outputColorSpace = THREE.SRGBColorSpace;

  // Antialias
  gl.antialias = true;

  // Pixel ratio
  const pixelRatio = mobile.isMobile
    ? Math.min(window.devicePixelRatio, 2)
    : window.devicePixelRatio;
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

    // Configure for HDR environment mapping with realistic intensity
    material.envMapIntensity = mobile.isMobile ? 1.2 : 1.5; // Increased for more realistic reflections

    // Optimize metallic/roughness workflow for realistic appearance
    if (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial) {
      // Enhance PBR workflow for realistic look
      material.metalness = 0.3; // Slight metalness for more realistic look
      material.roughness = 0.5; // Slightly smoother for better reflections



      // Mobile optimizations while maintaining quality
      if (mobile.isMobile) {
        material.envMapIntensity *= 0.8; // Still reduced but higher than before
      }
    }

    // Force material update
    material.needsUpdate = true;

    return material;
  };
  
  return { enhanceMaterial };
}
