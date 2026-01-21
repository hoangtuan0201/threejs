// import React, { useRef, useEffect } from 'react';
// import { useGLTF } from '@react-three/drei';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three-stdlib'

// const Tree = ({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) => {
//   const { scene } = useGLTF('/tree.glb');
//   const treeRef = useRef();

//   // Clone the scene to avoid sharing geometry between instances
//   const clonedScene = scene.clone();

//   // Fix materials and shadows after clonedScene is created
//   useEffect(() => {
//     if (!clonedScene) return;
    
//     clonedScene.traverse((child) => {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
        
//         // Fix inconsistent materials - force all to MeshStandardMaterial for shadow support
//         if (!(child.material instanceof THREE.MeshStandardMaterial)) {
//           child.material = new THREE.MeshStandardMaterial({
//             map: child.material.map,
//             normalMap: child.material.normalMap,
//             roughnessMap: child.material.roughnessMap,
//             metalnessMap: child.material.metalnessMap,
//             color: child.material.color || 0xffffff,
//             roughness: child.material.roughness || 0.8,
//             metalness: child.material.metalness || 0.1
//           });
//         }
        
//         child.material.shadowSide = THREE.FrontSide;
//         child.material.needsUpdate = true;
//       }
//     });
//   }, [clonedScene]);

//   return (
//     <primitive 
//       ref={treeRef}
//       object={clonedScene} 
//       position={position} 
//       scale={scale}
//       rotation={rotation}
//     />
//   );
// };

// const TreeGroup = () => {
//   // Define tree positions around the house (house center around [29, 0, -25], grass at [29, -0.77, -25])
//   const treePositions = [
//     // left side
//     { position: [10, -0.77, -10], scale: 0.8, rotation: [0, Math.PI * 0.3, 0] },
//     { position: [20, -0.77, -5], scale: 1.2, rotation: [0, Math.PI * 0.7, 0] },
//     { position: [30, -0.77, -8], scale: 0.9, rotation: [0, Math.PI * 1.2, 0] },
    
//     // right
//     { position: [5, -0.77, -20], scale: 1.1, rotation: [0, Math.PI * 0.5, 0] },
//     { position: [8, -0.77, -35], scale: 0.7, rotation: [0, Math.PI * 1.8, 0] },
//     { position: [15, -0.77, -45], scale: 1.3, rotation: [0, Math.PI * 0.9, 0] },
    

//     // Back area trees (further from camera)
//     { position: [25, -0.77, -50], scale: 0.9, rotation: [0, Math.PI * 0.6, 0] },
//     { position: [35, -0.77, -45], scale: 1.2, rotation: [0, Math.PI * 1.4, 0] },
    
  
//   ];

//   return (
//     <>
//       <directionalLight 
//         position={[40, 12, -25]} 
//         intensity={3}
//         castShadow
//         shadow-mapSize-width={1024}
//         shadow-mapSize-height={1024}
//         shadow-camera-far={100}
//         shadow-camera-left={-50}
//         shadow-camera-right={50}
//         shadow-camera-top={50}
//         shadow-camera-bottom={-50}
//         shadow-bias={-0.0001}
//       />
//       {treePositions.map((tree, index) => (
//         <Tree 
//           key={index}
//           position={tree.position}
//           scale={tree.scale}
//           rotation={tree.rotation}
//         />
//       ))}
//     </>
//   );
// };

// useGLTF.preload('/tree.glb');

// export default Tree;
// export { TreeGroup };