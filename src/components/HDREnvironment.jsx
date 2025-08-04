import { useEffect, useRef } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as THREE from 'three';
import { useMobile } from '../hooks/useMobile';
import { useHDRConfig } from '../hooks/useHDRConfig';

/**
 * HDR Environment component for realistic PBR lighting
 * Based on Three.js discourse recommendations for Sketchfab-like quality
 */
export function HDREnvironment({
  hdrUrl = '/textures/empty_play_room_2k.hdr', // Better HDR texture for realistic lighting
  intensity = 1.0,
  backgroundIntensity = 0.3,
  enableBackground = false,
  enableToneMapping = true
}) {
  const { gl, scene } = useThree();
  const mobile = useMobile();
  const pmremGeneratorRef = useRef();
  
  // Load HDR texture with fallback handling
  const hdrTexture = useLoader(RGBELoader, hdrUrl, (loader) => {
    // Configure loader for better performance on mobile
    if (mobile.isMobile) {
      loader.setDataType(THREE.UnsignedByteType);
    }
  });

  useEffect(() => {
    if (!gl || !scene || !hdrTexture) return;

    // Configure renderer for HDR workflow
    if (enableToneMapping) {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 0.3 // Increased exposure for better visibility
      gl.outputEncoding = THREE.sRGBEncoding;
    }

    // Enable shadows with optimized settings - FORCE ENABLE
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.shadowMap.autoUpdate = true; // Force auto update
    
    // Optimize for mobile performance
    if (mobile.isMobile) {
      gl.shadowMap.autoUpdate = false; // Manual shadow updates for better performance
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    } else {
      gl.setPixelRatio(window.devicePixelRatio);
    }

    // Create and configure PMREM generator
    if (!pmremGeneratorRef.current) {
      pmremGeneratorRef.current = new THREE.PMREMGenerator(gl);
      pmremGeneratorRef.current.compileEquirectangularShader();
    }

    const pmremGenerator = pmremGeneratorRef.current;
    
    // Generate environment map from HDR texture
    const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
    
    // Apply environment map to scene with enhanced intensity for realistic look
    scene.environment = envMap;
    scene.environmentIntensity = intensity * 2; // Increased for more realistic reflections

    // Optionally set as background
    if (enableBackground) {
      scene.background = envMap;
      scene.backgroundIntensity = backgroundIntensity * 1.2;
    }

    // Cleanup function
    return () => {
      if (envMap) {
        envMap.dispose();
      }
    };
  }, [gl, scene, hdrTexture, intensity, backgroundIntensity, enableBackground, enableToneMapping, mobile.isMobile]);

  // Cleanup PMREM generator on unmount
  useEffect(() => {
    return () => {
      if (pmremGeneratorRef.current) {
        pmremGeneratorRef.current.dispose();
      }
      if (hdrTexture) {
        hdrTexture.dispose();
      }
    };
  }, [hdrTexture]);

  return null; // This component doesn't render anything visible
}

/**
 * Enhanced lighting setup component
 * Provides optimized lighting for both main scene and detail scene
 */
export function EnhancedLighting({
  type = 'main', // 'main' or 'detail'
  enableHDR = true
}) {
  const hdrConfig = useHDRConfig();

  // Use responsive configuration with enhanced realistic settings - Tăng độ sáng tổng thể
  const config = {
    ambientIntensity: type === 'detail'
      ? hdrConfig.hdr.intensity * 0.4  // Tăng ambient light cho detail scene
      : hdrConfig.hdr.intensity * 0.3,  // Tăng ambient light cho main scene
    directionalIntensity: type === 'detail'
      ? hdrConfig.hdr.intensity * 1.8  // Tăng directional light cho detail scene
      : hdrConfig.hdr.intensity * 1.5,  // Tăng directional light cho main scene
    hdrIntensity: type === 'detail'
      ? hdrConfig.hdr.intensity * 2.2  // Tăng HDR intensity cho detail scene
      : hdrConfig.hdr.intensity * 1.8,  // Tăng HDR intensity cho main scene
  };
  


  return (
    <>
      {/* HDR Environment */}
      {enableHDR && (
        <HDREnvironment
          intensity={config.hdrIntensity}
          enableBackground={false}
          backgroundIntensity={0.2}
        />
      )}

      {/* Ambient Light - tương tự như trong code vanilla Three.js */}
      <ambientLight
        color={0x404040}
        intensity={config.ambientIntensity * 1.5} // Tăng độ sáng ambient light
      />

      {/* Directional Light - tương tự như trong code vanilla Three.js */}
      <directionalLight
        color={0xffffff}
        intensity={config.directionalIntensity * 1.3} // Tăng độ sáng directional light
        position={[0, 20, 20]} // Vị trí tương tự code gốc
        castShadow={true}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-near={0.1}
        shadow-camera-far={40}
        shadow-bias={-0.002} // Tương tự code gốc
      />

    </>
  );
}
