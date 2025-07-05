import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { hiddenObjects } from "../data/hiddenObjects";

export function Model({ hiddenObjectsState, onModelLoaded }) {
  const { scene } = useGLTF("/HouseCombined2.glb");

  const originalMaterials = useRef(new Map());
  const [modelReady, setModelReady] = useState(false);

  // Notify when model is loaded
  useEffect(() => {
    if (scene && !modelReady) {
      setModelReady(true);
      if (onModelLoaded) {
        // Add small delay to ensure model is fully processed
        setTimeout(() => {
          onModelLoaded();
        }, 500);
      }
    }
  }, [scene, modelReady, onModelLoaded]);

  // Traverse the model and enable shadows for all meshes + make specific objects transparent when sequence > 2
  useEffect(() => {
    if (scene) {



      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // Store original material if not already stored
          if (!originalMaterials.current.has(child.name) && child.material) {
            originalMaterials.current.set(child.name, child.material.clone());
          }

          // Handle hidden objects based on toggle state
          if (hiddenObjects.includes(child.name)) {
            if (hiddenObjectsState) {
              if (child.material) {
                // Clone material to avoid affecting other objects
                child.material = child.material.clone();
                child.material.transparent = true;
                child.material.opacity = 0.3; // 30% opacity when hidden
              }
            } else {
              if (child.material) {
                // Restore opacity when not hidden
                child.material = child.material.clone();
                child.material.transparent = false;
                child.material.opacity = 1.0; // Full opacity
              }
            }
          }

          // Restore original material
          else {
            const originalMaterial = originalMaterials.current.get(child.name);
            if (originalMaterial) {
              child.material = originalMaterial.clone();
            }
          }
        }
      });
    }
  }, [scene, hiddenObjectsState]);





  // Don't render if scene is not loaded
  if (!scene) {
    return null;
  }

  return (
    <primitive object={scene} />
  );
}

useGLTF.preload("/HouseCombined2.glb");
