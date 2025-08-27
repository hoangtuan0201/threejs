import React, { useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping, sRGBEncoding } from 'three';

const GrassFloor = ({ size = [50, 50], position = [0, -0.77, 0] }) => {
  const colorTexture = useLoader(TextureLoader, '/textures/Grass004_1K-JPG_Color.jpg');
  const normalTexture = useLoader(TextureLoader, '/textures/Grass004_1K-JPG_NormalGL.jpg');
  const roughnessTexture = useLoader(TextureLoader, '/textures/Grass004_1K-JPG_Roughness.jpg');

  useEffect(() => {
    [colorTexture, normalTexture, roughnessTexture].forEach((tex) => {
      if (!tex) return;
      tex.wrapS = tex.wrapT = RepeatWrapping;
      tex.repeat.set(8, 8); // chỉnh cho hợp cảnh
      tex.anisotropy = 16;
    });
    colorTexture.encoding = sRGBEncoding;
  }, [colorTexture, normalTexture, roughnessTexture]);

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      {/* nhiều segment để nếu sau này dùng displacement */}
      <planeGeometry args={[size[0], size[1], 200, 200]} />
      <meshStandardMaterial
        map={colorTexture}
        normalMap={normalTexture}
        roughnessMap={roughnessTexture}
        roughness={0.8}
      />
    </mesh>
  );
};

export default GrassFloor;
