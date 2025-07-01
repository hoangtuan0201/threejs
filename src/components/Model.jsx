import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export function Model({ sequenceChapters, onChapterClick }) {
  const { scene } = useGLTF("/House Combined2.glb");

  // Traverse the model and enable shadows for all meshes
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  useEffect(() => {
    if (!scene || !sequenceChapters) return;

    sequenceChapters.forEach((chapter) => {
      const object = scene.getObjectByName(chapter.id);
      if (object) {
        object.userData.onClick = (e) => {
          e.stopPropagation();
          onChapterClick(chapter.id);
        };
      }
    });
  }, [scene, sequenceChapters, onChapterClick]);

  return (
    <primitive
      object={scene}
      onClick={(e) => {
        e.object?.userData?.onClick?.(e); // Propagate click to the correct object
      }}
    />
  );
}

useGLTF.preload("/House Combined2.glb");
