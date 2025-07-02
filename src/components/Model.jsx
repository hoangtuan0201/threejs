import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export function Model({ sequenceChapters, onChapterClick, onMeshClick }) {
  const { scene } = useGLTF("/House Combined2.glb");

  // Traverse the model and enable shadows for all meshes
  useEffect(() => {
    if (scene) {
      console.log("=== Model Mesh Names ===");
      scene.traverse((child) => {
        if (child.isMesh) {
          console.log("Mesh found:", child.name, "Position:", child.position);
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      console.log("=== End Mesh List ===");
    }
  }, [scene]);

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
