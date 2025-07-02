import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export function Model({ sequenceChapters, onChapterClick, onMeshClick, sequencePosition }) {
  const { scene } = useGLTF("/House Combined2.glb");

  // Traverse the model and enable shadows for all meshes + make specific objects transparent when sequence > 2
  useEffect(() => {
    if (scene) {
      console.log("=== Model Mesh Names ===");
      console.log("Current sequence position:", sequencePosition);

      // List of objects to make transparent only after sequence 2
      const transparentObjects = [
        "Geom3D__71",
        "Geom3D_264",
        "Geom3D_266",
        "Geom3D__29",
        "Geom3D__124",
        "Geom3D__145",
        "Geom3D__98",
        "Geom3D__96",
        "Geom3D__103",
        "Geom3D_35"
      ];

      scene.traverse((child) => {
        if (child.isMesh) {
          console.log("Mesh found:", child.name, "Position:", child.position);
          child.castShadow = true;
          child.receiveShadow = true;

          // Make specific objects transparent only when sequence position > 2 (after sequence 2 ends)
          if (transparentObjects.includes(child.name)) {
            if (sequencePosition > 2.3) {
              console.log(`Making ${child.name} transparent (sequence > 2.5)`);
              if (child.material) {
                // Clone material to avoid affecting other objects
                child.material = child.material.clone();
                child.material.transparent = true;
                child.material.opacity = 0.2; // 30% opacity
                console.log(`✅ ${child.name} is now transparent`);
              }
            } else {
              console.log(`Keeping ${child.name} opaque (sequence <= 2)`);
              if (child.material) {
                // Restore opacity when sequence <= 2
                child.material = child.material.clone();
                child.material.transparent = false;
                child.material.opacity = 1.0; // Full opacity
                console.log(`✅ ${child.name} is now opaque`);
              }
            }
          }
        }
      });
      console.log("=== End Mesh List ===");
    }
  }, [scene, sequencePosition]);

  useEffect(() => {
    if (!scene || !sequenceChapters) return;

    console.log("=== Setting up chapter click handlers ===");
    sequenceChapters.forEach((chapter) => {
      const object = scene.getObjectByName(chapter.id);
      console.log(`Looking for chapter: ${chapter.id}, found object:`, object);
      if (object) {
        object.userData.onClick = (e) => {
          e.stopPropagation();
          console.log(`Chapter clicked: ${chapter.id}`);
          onChapterClick(chapter.id);
        };
        console.log(`✅ Click handler set for: ${chapter.id}`);
      } else {
        console.log(`❌ Object not found for chapter: ${chapter.id}`);
      }
    });


    // Set up mesh click handler for Geom3D_393
    const geom393 = scene.getObjectByName("Geom3D_393");
    console.log("Looking for Geom3D_393 mesh:", geom393);
    if (geom393 && onMeshClick) {
      geom393.userData.onMeshClick = (e) => {
        e.stopPropagation();
        console.log("Geom3D_393 mesh clicked - calling onMeshClick");
        onMeshClick("Geom3D_393");
      };
      console.log("✅ Mesh click handler set for Geom3D_393");
    } else {
      console.log("❌ Failed to set mesh click handler - geom393:", geom393, "onMeshClick:", onMeshClick);
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
