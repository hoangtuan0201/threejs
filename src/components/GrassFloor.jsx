import React, { useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';

const GrassFloor = ({ size = [50, 50], position = [0, -0.77, 0] }) => {
  // Sử dụng texture cỏ thật từ file grass-texture.avif
  const grassTexture = useLoader(TextureLoader, '/grass-texture.avif');
  
  React.useEffect(() => {
    if (grassTexture) {
      grassTexture.wrapS = RepeatWrapping;
      grassTexture.wrapT = RepeatWrapping;
      grassTexture.repeat.set(15, 15); // Tăng repeat để texture nhỏ hơn và chi tiết hơn
      grassTexture.anisotropy = 16; // Cải thiện chất lượng texture ở góc nhìn xa
    }
    
  }, [grassTexture]);

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshLambertMaterial 
        map={grassTexture || null}
        color={grassTexture ? '#ffffff' : '#4a7c59'} // Fallback màu xanh cỏ nếu texture lỗi
        transparent={false}
        side={2} // DoubleSide để hiển thị cả 2 mặt
      />
    </mesh>
  );
};

export default GrassFloor;