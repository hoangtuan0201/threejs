import { useEffect, useRef } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as THREE from 'three';
import { SoftShadows } from '@react-three/drei';
import { useMobile } from '../hooks/useMobile';
import { useHDRConfig } from '../hooks/useHDRConfig';

/**
 * HDR Environment for maximum photorealistic PBR lighting (Game 4K+ quality)
 */
export function HDREnvironment({
  hdrUrl = '/textures/empty_play_room_1k.hdr',
  intensity = 2.8, // Tối ưu cho realism tối đa
  backgroundIntensity = 0.9, // Tăng cho background chân thật
  enableBackground = false,
  enableToneMapping = true
}) {
  const { gl, scene } = useThree();
  const mobile = useMobile();
  const pmremGeneratorRef = useRef();

  // Load HDR texture with maximum quality settings
  const hdrTexture = useLoader(RGBELoader, hdrUrl, (loader) => {
    loader.setDataType(THREE.FloatType);
  });

  useEffect(() => {
    if (!gl || !scene || !hdrTexture) return;

    // Advanced tone mapping with glare reduction while maintaining realism
    if (enableToneMapping) {
      gl.toneMapping = THREE.ACESFilmicToneMapping; // ACES cho màu sắc tự nhiên nhất
      gl.toneMappingExposure = 0.35; // Tăng exposure trên mobile để tránh tối
      gl.outputEncoding = THREE.sRGBEncoding;
      
      // Additional renderer settings for maximum quality
      gl.physicallyCorrectLights = true;
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      gl.shadowMap.autoUpdate = true;
      
      // Advanced anti-aliasing for crisp edges
      gl.antialias = true;
      gl.powerPreference = "high-performance";
    }

    // Enable shadows with high quality
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.shadowMap.autoUpdate = false;

  

    // PMREM generator with high-quality settings
    if (!pmremGeneratorRef.current) {
      pmremGeneratorRef.current = new THREE.PMREMGenerator(gl);
      pmremGeneratorRef.current.compileEquirectangularShader();
    }

    const pmremGenerator = pmremGeneratorRef.current;
    
    // Generate environment map with enhanced quality
    hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
    hdrTexture.needsUpdate = true;
    const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
    
    // Apply environment with high intensity for maximum realism
    scene.environment = envMap;
    scene.environmentIntensity = intensity * 3.2; // Khôi phục intensity cao cho độ chân thật

    if (enableBackground) {
      scene.background = envMap;
      scene.backgroundIntensity = backgroundIntensity;
      scene.backgroundBlurriness = 0.0; // Giữ background sắc nét
      scene.backgroundRotation = new THREE.Euler(0, 0, 0); // Cho phép xoay background nếu cần
    }

    // Ensure proper encoding for Three.js r149
    if (envMap) {
      envMap.encoding = THREE.sRGBEncoding;
      envMap.needsUpdate = true;
    }

    return () => {
      envMap?.dispose();
    };
  }, [gl, scene, hdrTexture, intensity, backgroundIntensity, enableBackground, enableToneMapping,]);

  useEffect(() => {
    return () => {
      pmremGeneratorRef.current?.dispose();
      hdrTexture?.dispose();
    };
  }, [hdrTexture]);

  return (
    <>
      {/* High-quality soft shadows for realism */}
      <SoftShadows samples={mobile.isMobile ? 8 : 16} size={2.0} focus={0} />
    </>
  );
}

/**
 * Enhanced Lighting for Photorealistic Rendering (Game 4K Quality)
 */
export function EnhancedLighting({
  type = 'main',
  enableHDR = true,
  shadowQuality = 'ultra'
}) {
  const hdrConfig = useHDRConfig();
  const mobile = useMobile();

  const config = {
    ambientIntensity: type === 'detail' ? hdrConfig.hdr.intensity * 0.6 : hdrConfig.hdr.intensity * 0.4,
    directionalIntensity: type === 'detail' ? hdrConfig.hdr.intensity * 3.2 : hdrConfig.hdr.intensity * 2.8,
    hdrIntensity: type === 'detail' ? hdrConfig.hdr.intensity * 3.0 : hdrConfig.hdr.intensity * 2.5,
  };

  const shadowMapSize = mobile.isMobile ? 1024 : shadowQuality === 'ultra' ? 4096 : shadowQuality === 'high' ? 2048 : 1024;

  return (
    <>
      {/* HDR Environment với intensity cao cho photorealism */}
      {enableHDR && <HDREnvironment intensity={2.8} enableBackground={false} />}

      {/* Key Light - ánh sáng chính với độ sáng cao cho realism */}
      <directionalLight
        intensity={7.5}
        position={[15, 12, 8]} 
        castShadow={true}
        shadow-mapSize={shadowMapSize}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-bias={-0.0003}
        shadow-normalBias={0.05}
        shadow-radius={6}
      />


      {/* Ambient Light thấp để giữ contrast cao */}
      {/* <ambientLight 
        intensity={0.18} // Giữ ambient thấp để contrast cao
        color="#ffffff"
      /> */}

      {/* Point lights để tạo highlights cục bộ */}
      {/* <pointLight
        intensity={10} 
        position={[5, 8, 5]}
        color="#ffffff"
        distance={25}
        decay={2}
        castShadow
        shadow-mapSize={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={25}
        shadow-bias={-0.0005}
      /> */}

      {/* Spot light cho dramatic lighting */}
      {/* <spotLight
        intensity={13} 
        position={[20, 15, 10]}
        target-position={[0, 0, 0]}
        angle={Math.PI / 6}
        penumbra={0.3}
        color="#ffffff"
        castShadow
        shadow-mapSize={shadowMapSize}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-bias={-0.0002}
      /> */}
    </>
  );
}
