import { useEffect, useRef } from 'react';
import { LinearGrilleModel } from './LinearGrilleModel';
import { sequenceChapters } from '../data/sequenceChapters';

export function LinearGrilleManager({ 
  scene, 
  currentGrille = 'original',
  selectedHotspot = null
}) {
  const hiddenMeshesRef = useRef(new Set());

  // Hide/show original grille meshes based on selected hotspot and grille selection
  useEffect(() => {
    if (!scene) return;

    // Reset all previously hidden meshes
    scene.traverse((child) => {
      if (child.isMesh && hiddenMeshesRef.current.has(child.name)) {
        child.visible = true;
        hiddenMeshesRef.current.delete(child.name);
      }
    });

    // If no hotspot selected or hotspot doesn't have grille config, show all original meshes
    if (!selectedHotspot || !selectedHotspot.grilleConfig) {
      return;
    }

    const { meshesToHide } = selectedHotspot.grilleConfig;

    // Hide original meshes when hotspot is selected and not using 'original' grille
    if (currentGrille !== 'original') {
      scene.traverse((child) => {
        if (child.isMesh && meshesToHide.includes(child.name)) {
          child.visible = false;
          hiddenMeshesRef.current.add(child.name);
        }
      });
    }
  }, [scene, currentGrille, selectedHotspot]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scene) {
        scene.traverse((child) => {
          if (child.isMesh && hiddenMeshesRef.current.has(child.name)) {
            child.visible = true;
          }
        });
      }
    };
  }, [scene]);

  // Only show LinearGrilleModel if hotspot is selected, has grille config, and not using 'original' grille
  if (!selectedHotspot || !selectedHotspot.grilleConfig || currentGrille === 'original') {
    return null;
  }

  const { position, rotation, scale, modelUrls } = selectedHotspot.grilleConfig;
  
  // Get the model URL for the current grille type, fallback to default if not found
  const modelUrl = modelUrls && modelUrls[currentGrille] ? modelUrls[currentGrille] : "./lineartest.glb";

  return (
    <LinearGrilleModel
      grilleType={currentGrille}
      position={position}
      rotation={rotation}
      scale={scale}
      modelUrl={modelUrl}
      visible={true}
    />
  );
}