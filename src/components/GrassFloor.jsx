import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';

const GrassFloor = ({ size = [50, 50], position = [0, -0.77, 0] }) => {
  // Sử dụng texture cỏ thật từ file grass-texture.avif
  const grassTexture = useLoader(TextureLoader, '/grass-texture.avif');
  
  React.useEffect(() => {
    if (grassTexture) {
      grassTexture.wrapS = RepeatWrapping;
      grassTexture.wrapT = RepeatWrapping;
      grassTexture.repeat.set(10, 10); // Lặp lại texture để tạo hiệu ứng thảm cỏ rộng
    }
  }, [grassTexture]);

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshLambertMaterial 
        map={grassTexture} 
      />
    </mesh>
  );
};

export default GrassFloor;