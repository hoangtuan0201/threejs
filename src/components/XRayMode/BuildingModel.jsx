import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import SequenceMeshController from './SequenceMeshController';
import MeshClickHandler from './MeshClickHandler';

function BuildingModel({ activeSequence, onSequenceTransitionComplete }) {
  const { scene } = useGLTF('/3ddd.glb');
  const modelRef = useRef();
  
  // Clone scene một lần duy nhất
  const clonedScene = useMemo(() => {
    if (!scene) return null;
    return scene.clone();
  }, [scene]);

  if (!clonedScene) return null;
  
  return (
    <>
      <primitive ref={modelRef} object={clonedScene} />
      
      {/* Component xử lý ẩn/hiện mesh theo sequence chapters */}
      <SequenceMeshController 
        activeSequence={activeSequence}
        onTransitionComplete={onSequenceTransitionComplete}
      />
      
      {/* Mesh Click Handler */}
      <MeshClickHandler enabled={true} />
    </>
  );
}

  // Preload the model
  useGLTF.preload('/3ddd.glb');

  export default BuildingModel;