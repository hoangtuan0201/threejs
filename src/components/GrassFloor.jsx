import React, { Suspense, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';

const GrassFloorContent = ({ size, position }) => {
  const grassTexture = useLoader(TextureLoader, '/grass-texture.jpg'); // Đổi sang jpg

  useEffect(() => {
    if (grassTexture) {
      grassTexture.wrapS = RepeatWrapping;
      grassTexture.wrapT = RepeatWrapping;
      grassTexture.repeat.set(10, 10);
      grassTexture.needsUpdate = true; // Đảm bảo texture được update
      
      console.log('Grass texture loaded successfully:', grassTexture);
    }
  }, [grassTexture]);

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshLambertMaterial 
        map={grassTexture}
        transparent={false}
        side={2}
      />
    </mesh>
  );
};

const GrassFloor = ({ size = [50, 50], position = [53, -0.77, -45] }) => {
  return (
    <Suspense fallback={
      // Fallback mesh với màu xanh lá trong khi load texture
      <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={size} />
        <meshLambertMaterial color="#4a9c2d" />
      </mesh>
    }>
      <GrassFloorContent size={size} position={position} />
    </Suspense>
  );
};

export default GrassFloor;