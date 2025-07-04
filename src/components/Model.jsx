import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { hiddenObjects } from "../data/hiddenObjects";

export function Model({ sequenceChapters, onChapterClick, onMeshClick, sequencePosition, onModelLoaded }) {
  const { scene } = useGLTF("/House Combined2.glb");

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

      // List of objects to make transparent only after sequence 2
      const transparentObjects = [

      ];

      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // Store original material if not already stored
          if (!originalMaterials.current.has(child.name) && child.material) {
            originalMaterials.current.set(child.name, child.material.clone());
          }

          // Make specific objects transparent only when sequence position > 3 and <= 4 (during sequence 4 only)
          if (hiddenObjects.includes(child.name)) {
            if (sequencePosition > 3 && sequencePosition <= 4.07) {
              if (child.material) {
                // Clone material to avoid affecting other objects
                child.material = child.material.clone();
                child.material.transparent = true;
                child.material.opacity = 0.2; // 30% opacity
              }
            } else {
              if (child.material) {
                // Restore opacity when sequence <= 3 or > 4
                child.material = child.material.clone();
                child.material.transparent = false;
                child.material.opacity = 1.0; // Full opacity
              }
            }
          }
          // Make specific objects transparent only when sequence position > 2 (after sequence 2 ends)
          else if (transparentObjects.includes(child.name)) {
            if (sequencePosition > 3) {
              if (child.material) {
                // Clone material to avoid affecting other objects
                child.material = child.material.clone();
                child.material.transparent = true;
                child.material.opacity = 0.2; // 30% opacity
              }
            } else {
              if (child.material) {
                // Restore opacity when sequence <= 2
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
  }, [scene, sequencePosition]);

  useEffect(() => {
    if (!scene || !sequenceChapters || !onChapterClick) return;

    try {
      // Only set up click handlers for objects that actually exist in the 3D model
      sequenceChapters.forEach((chapter) => {
        if (!chapter || !chapter.id) return;

        const object = scene.getObjectByName(chapter.id);
        if (object && object.userData) {
          object.userData.onClick = (e) => {
            e.stopPropagation();
            onChapterClick(chapter.id);
          };
        }
      });

      // Set up mesh click handler for Geom3D_393
      const geom393 = scene.getObjectByName("Geom3D_393");
      if (geom393 && geom393.userData && onMeshClick) {
        geom393.userData.onMeshClick = (e) => {
          e.stopPropagation();
          onMeshClick("Geom3D_393");
        };
      }
    } catch (error) {
      console.error("Error setting up click handlers:", error);
    }
  }, [scene, sequenceChapters, onChapterClick, onMeshClick]);



  // Don't render if scene is not loaded
  if (!scene) {
    return null;
  }

  return (
    <primitive
      object={scene}
      onClick={(e) => {
        e.stopPropagation();
        console.log("Model clicked - object:", e.object?.name);

        // Handle both chapter clicks and mesh clicks
        e.object?.userData?.onClick?.(e);
        e.object?.userData?.onMeshClick?.(e);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        console.log("Model pointer down - object:", e.object?.name);

        // Handle touch events for mobile
        e.object?.userData?.onClick?.(e);
        e.object?.userData?.onMeshClick?.(e);
      }}
    />
  );
}

useGLTF.preload("/House Combined2.glb");
