import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { hiddenObjects } from "../data/hiddenObjects";

// const modelUrl = "https://s3.ap-southeast-2.wasabisys.com/airsmart/3d-models%2FHlkl1k5uvxMTrURUu5SL%2F1751031112397.glb?AWSAccessKeyId=OQL1BX7MOF71KL0MM0UM&Expires=1751895706&Signature=ceF4cC3O4u67JxAFCvx7hlW1rmA%3D";

export function Model({ hiddenObjectsState, onModelLoaded }) {
  const [modelReady, setModelReady] = useState(false);
  const originalMaterials = useRef(new Map());

  // Load model with error handling
  const { scene, error } = useGLTF("/HouseCombined2.glb");

  // Handle loading errors
  useEffect(() => {
    if (error) {
      console.error('Model loading error:', error);
    }
  }, [error]);

  // Notify when model is loaded successfully
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

  // Handle mesh click events - TEMPORARILY DISABLED to prevent group-related errors
  const handleMeshClick = (event) => {
    try {
      event.stopPropagation();
      const meshName = event.object?.name || 'Unnamed Mesh';
      console.log('Clicked mesh:', meshName); // Debug log
      alert(`Mesh Name: ${meshName}`);
    } catch (error) {
      console.warn('Error in handleMeshClick:', error);
    }
  };

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





  // Don't render if scene is not loaded or there's an error
  if (!scene || error) {
    return null;
  }

  return (
    <primitive
      object={scene}
      onClick={handleMeshClick} // TEMPORARILY DISABLED to prevent group-related errors
    />
  );
}

useGLTF.preload("/HouseCombined2.glb");
