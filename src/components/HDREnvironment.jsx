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
  hdrUrl = '/textures/royal_esplanade_1k.hdr', // Better HDR texture for realistic lighting
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
      gl.toneMappingExposure = mobile.isMobile ? 1.2 : 1.5; // Increased exposure for better visibility
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
    scene.environmentIntensity = intensity * 1.5; // Increased for more realistic reflections

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

  // Use responsive configuration with enhanced realistic settings
  const config = {
    ambientIntensity: type === 'detail'
      ? hdrConfig.hdr.intensity * 0.2  // Reduced ambient for more contrast
      : hdrConfig.hdr.intensity * 0.15,
    directionalIntensity: type === 'detail'
      ? hdrConfig.hdr.intensity * 1.2  // Increased directional for better shadows
      : hdrConfig.hdr.intensity * 1.0,
    hdrIntensity: type === 'detail'
      ? hdrConfig.hdr.intensity * 1.8  // Much higher HDR intensity for realistic look
      : hdrConfig.hdr.intensity * 1.5,
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
      
      {/* Ambient lighting - reduced since HDR provides most ambient */}
      <ambientLight intensity={config.ambientIntensity} />
      
      {/* Key directional light with optimized shadows */}
      <directionalLight
        position={[15, 20, 10]}
        intensity={config.directionalIntensity * 1.2}
        castShadow={true}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-bias={-0.001}
        shadow-normalBias={0.05}
      />
      
      {/* Secondary shadow casting light for better shadow definition */}
      <directionalLight
        position={[-10, 15, -8]}
        intensity={config.directionalIntensity * 0.8}
        castShadow={true}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-near={0.1}
        shadow-camera-far={40}
        shadow-bias={-0.0005}
        shadow-normalBias={0.03}
      />

      {/* Fill light for softer shadows */}
      <directionalLight
        position={[-5, 10, -5]}
        intensity={config.directionalIntensity * 0.2}
        castShadow={true}
      />
      
      {/* Subtle rim light for detail scene */}
      {type === 'detail' && (
        <directionalLight
          position={[0, 5, 10]}
          intensity={0.2}
          castShadow={true}
        />
      )}
    </>
  );
}
