import { useEffect } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

/**
 * Industrial Background Component
 * Sử dụng hình industrial.jpg làm background cho scene 3D
 */
export function Background({
  imageUrl = '/industrial.jpg',
  opacity = 1.0,
  enableBackground = true
}) {
  const { scene } = useThree();

  // Load texture từ file industrial.jpg
  const backgroundTexture = useLoader(TextureLoader, imageUrl);

  useEffect(() => {
    if (!scene || !backgroundTexture) return;

    // Cấu hình texture
    backgroundTexture.mapping = THREE.EquirectangularReflectionMapping;
    backgroundTexture.wrapS = THREE.RepeatWrapping;
    backgroundTexture.wrapT = THREE.RepeatWrapping;

    // Thiết lập background cho scene
    if (enableBackground) {
      scene.background = backgroundTexture;

      // Nếu muốn điều chỉnh opacity, có thể tạo material với opacity
      if (opacity < 1.0) {
        // Tạo một sphere lớn với texture làm background với opacity
        const geometry = new THREE.SphereGeometry(500, 32, 16);
        const material = new THREE.MeshBasicMaterial({
          map: backgroundTexture,
          side: THREE.BackSide,
          transparent: true,
          opacity: opacity
        });

        const backgroundSphere = new THREE.Mesh(geometry, material);
        backgroundSphere.name = 'industrial-background-sphere';
        scene.add(backgroundSphere);

        // Không set scene.background nếu dùng sphere với opacity
        scene.background = null;

        return () => {
          scene.remove(backgroundSphere);
          geometry.dispose();
          material.dispose();
        };
      }
    }

    // Cleanup function
    return () => {
      if (scene.background === backgroundTexture) {
        scene.background = null;
      }
    };
  }, [scene, backgroundTexture, opacity, enableBackground]);

  // Cleanup texture on unmount
  useEffect(() => {
    return () => {
      if (backgroundTexture) {
        backgroundTexture.dispose();
      }
    };
  }, [backgroundTexture]);

  return null; // Component này không render gì cả
}

/**
 * Enhanced Background Component
 * Kết hợp industrial background với các tùy chọn khác
 */
export function EnhancedBackground({
  type = 'industrial', // 'industrial', 'color', 'hdr'
  industrialOpacity = 1.0,
  fallbackColor = '#84a4f4',
  enableIndustrial = true
}) {

  if (type === 'industrial' && enableIndustrial) {
    return (
      <>
        <Background
          opacity={industrialOpacity}
          enableBackground={true}
        />
        {/* Fallback color nếu texture không load được */}
        {industrialOpacity < 1.0 && (
          <color attach="background" args={[fallbackColor]} />
        )}
      </>
    );
  }

  // Fallback to color background
  return <color attach="background" args={[fallbackColor]} />;
}
