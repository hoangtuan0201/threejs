import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export function Model({ sequenceChapters, onChapterClick, onMeshClick, sequencePosition }) {
  const { scene } = useGLTF("/House Combined2.glb");

  // Traverse the model and enable shadows for all meshes + make specific objects transparent when sequence > 2
  useEffect(() => {
    if (scene) {

      // List of objects to make transparent only after sequence 2
      const transparentObjects = [
        "Geom3D_35",
        "Geom3D_101",
        "Geom3D__71",
        "Geom3D__70",
        "Geom3D_264",
        "Geom3D_266",
        "Geom3D__29",
        "Geom3D__124",
        "Geom3D__145",
        "Geom3D__146",
        "Geom3D__98",
        "Geom3D__96",
        "Geom3D__103",
        "Geom3D_35",
        "Geom3D__99",
        "Geom3D_611",
        "Geom3D_Naamloos_1", //lò vi sóng
        "Geom3D_Naamloos",
        "Geom3D_Naamloos_2",
        "Geom3D_100",
        "Geom3D_154",
        "Geom3D_153",
        "Geom3D_152",
        "Geom3D_151",
        "Geom3D_144",
        "Geom3D_21",
        "Geom3D_148",
        "Geom3D_149",
        "Geom3D_150",
        "Geom3D_147",
        "Geom3D_146",
        "Geom3D_145",
        "Geom3D__257",
        "Geom3D_609",
      ];

      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // Make specific objects transparent only when sequence position > 2 (after sequence 2 ends)
          if (transparentObjects.includes(child.name)) {
            if (sequencePosition > 2.8) {
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
        }
      });
    }
  }, [scene, sequencePosition]);

  useEffect(() => {
    if (!scene || !sequenceChapters) return;

    // Only set up click handlers for objects that actually exist in the 3D model
    sequenceChapters.forEach((chapter) => {
      const object = scene.getObjectByName(chapter.id);
      if (object) {
        object.userData.onClick = (e) => {
          e.stopPropagation();
          onChapterClick(chapter.id);
        };
      }
    });


    // Set up mesh click handler for Geom3D_393
    const geom393 = scene.getObjectByName("Geom3D_393");
    if (geom393 && onMeshClick) {
      geom393.userData.onMeshClick = (e) => {
        e.stopPropagation();
        onMeshClick("Geom3D_393");
      };
    }
  }, [scene, sequenceChapters, onChapterClick, onMeshClick]);

  return (
    <primitive
      object={scene}
      onClick={(e) => {
        console.log("Model clicked - object:", e.object?.name, "userData:", e.object?.userData);
        // Handle both chapter clicks and mesh clicks
        e.object?.userData?.onClick?.(e);
        e.object?.userData?.onMeshClick?.(e);
      }}
    />
  );
}

useGLTF.preload("/House Combined2.glb");
