import { useEffect, useRef } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as THREE from 'three';
import { SoftShadows } from '@react-three/drei';
import { useMobile } from '../hooks/useMobile';
import { useHDRConfig } from '../hooks/useHDRConfig';

/**
 * HDR Environment for realistic PBR lighting
 */
export function HDREnvironment({
  hdrUrl = '/textures/empty_play_room_2k.hdr',
  intensity = 1.0,
  backgroundIntensity = 0.3,
  enableBackground = false,
  enableToneMapping = true
}) {
  const { gl, scene } = useThree();
  const mobile = useMobile();
  const pmremGeneratorRef = useRef();

  // Load HDR texture
  const hdrTexture = useLoader(RGBELoader, hdrUrl, (loader) => {
    if (mobile.isMobile) loader.setDataType(THREE.UnsignedByteType);
  });

  useEffect(() => {
    if (!gl || !scene || !hdrTexture) return;

    // Tone mapping
    if (enableToneMapping) {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 0.2;
      gl.outputEncoding = THREE.sRGBEncoding;
    }

    // Enable shadows
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.shadowMap.autoUpdate = true;

    // Optimize pixel ratio
    gl.setPixelRatio(
      mobile.isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio
    );

    // PMREM for HDR
    if (!pmremGeneratorRef.current) {
      pmremGeneratorRef.current = new THREE.PMREMGenerator(gl);
      pmremGeneratorRef.current.compileEquirectangularShader();
    }

    const pmremGenerator = pmremGeneratorRef.current;
    const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;

    scene.environment = envMap;
    scene.environmentIntensity = intensity * 2;

    if (enableBackground) {
      scene.background = envMap;
      scene.backgroundIntensity = backgroundIntensity;
    }

    return () => {
      envMap?.dispose();
    };
  }, [gl, scene, hdrTexture, intensity, backgroundIntensity, enableBackground, enableToneMapping, mobile.isMobile]);

  useEffect(() => {
    return () => {
      pmremGeneratorRef.current?.dispose();
      hdrTexture?.dispose();
    };
  }, [hdrTexture]);

  return null;
}

/**
 * Optimized Lighting for Large Models with Soft Shadows
 */
export function EnhancedLighting({
  type = 'main',
  enableHDR = true
}) {
  const hdrConfig = useHDRConfig();

  const config = {
    ambientIntensity: type === 'detail' ? hdrConfig.hdr.intensity * 0.4 : hdrConfig.hdr.intensity * 0.3,
    directionalIntensity: type === 'detail' ? hdrConfig.hdr.intensity * 2 : hdrConfig.hdr.intensity * 1.6,
    hdrIntensity: type === 'detail' ? hdrConfig.hdr.intensity * 2.2 : hdrConfig.hdr.intensity * 1.8,
  };

  return (
    <>
  {/* HDR Environment */}
      {enableHDR && <HDREnvironment intensity={2} enableBackground={false} />}


      {/* Directional light chính từ trên trần xuống */}
      <directionalLight
        intensity={6}
        position={[0, 8, 0]}     // từ trên xuống
        castShadow
        shadow-mapSize={2048}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-near={1}
        shadow-camera-far={300}
        shadow-bias={-0.001}
      />

      </>
  );
}
