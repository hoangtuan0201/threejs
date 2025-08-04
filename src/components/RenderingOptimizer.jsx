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

    // Configure renderer for HDR workflow with realistic colors
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = mobile.isMobile ? 1.2 : 1.5; // Increased for better visibility
    gl.outputEncoding = THREE.sRGBEncoding;

    // Enable antialiasing for better quality
    gl.antialias = true;

    // Configure pixel ratio for optimal performance
    const pixelRatio = mobile.isMobile
      ? Math.min(window.devicePixelRatio, 2)
      : window.devicePixelRatio;
    gl.setPixelRatio(pixelRatio);

    // FORCE ENABLE shadows with high quality settings
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.shadowMap.autoUpdate = true; // Always auto-update for visible shadows

    // Configure color management for realistic rendering
    gl.physicallyCorrectLights = true;

    // Optimize for HDR content with realistic gamma
    gl.gammaFactor = 2.2;
    
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
      material.metalness = material.metalness || 0.1; // Slight metalness for more realistic look
      material.roughness = material.roughness || 0.4; // Slightly smoother for better reflections

      // Enhanced color and lighting response
      if (material.color) {
        material.color.convertSRGBToLinear(); // Ensure proper color space
      }

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
