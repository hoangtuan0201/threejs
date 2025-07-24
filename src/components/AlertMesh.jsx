import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function MeshInteraction() {
  const { scene, camera, controls, raycaster, mouse } = useThree();
  const meshRef = useRef();

  useEffect(() => {
    // Global click listener to log all mesh clicks
    const handleGlobalClick = (event) => {
      const rect = event.target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(x, y);
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
      

        // Show alert for any clicked mesh - COMMENTED FOR LATER USE
        // alert(`Mesh Name: ${clickedObject.name || 'Unnamed Mesh'}`);
      }
    };

    // Add global click listener to canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('click', handleGlobalClick);
    }

    // Find the Geom3D_393 mesh in the scene and log all mesh names
    const findMesh = (object) => {
      if (object.name === "Geom3D_393" || object.name === "geom393") {
        return object;
      }
      for (let child of object.children) {
        const found = findMesh(child);
        if (found) return found;
      }
      return null;
    };

    const targetMesh = findMesh(scene);
    if (targetMesh) {
      meshRef.current = targetMesh;

      // Add cursor pointer on hover
      const onPointerEnter = () => {
        document.body.style.cursor = 'pointer';
      };

      const onPointerLeave = () => {
        document.body.style.cursor = 'default';
      };

      // Add zoom on click
      const onPointerClick = (event) => {
        event.stopPropagation();
        // console.log('Mesh clicked:', targetMesh.name);

        // Zoom to mesh
        if (camera && controls) {
          const targetPosition = new THREE.Vector3(27.78, 4.4, -20.5);
          const currentPosition = camera.position.clone();
          
          const duration = 1500;
          const startTime = Date.now();
          
          const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            camera.position.lerpVectors(currentPosition, targetPosition, easeProgress);
            
            if (progress < 1) {
              requestAnimationFrame(animateCamera);
            } else {
              if (controls && controls.target) {
                controls.target.set(27.78, 4.4, -22.5);
                controls.update();
              }
            }
          };
          
          animateCamera();
        }
      };

      // Add event listeners
      targetMesh.addEventListener('pointerenter', onPointerEnter);
      targetMesh.addEventListener('pointerleave', onPointerLeave);
      targetMesh.addEventListener('click', onPointerClick);

      // Cleanup
      return () => {
        if (targetMesh) {
          targetMesh.removeEventListener('pointerenter', onPointerEnter);
          targetMesh.removeEventListener('pointerleave', onPointerLeave);
          targetMesh.removeEventListener('click', onPointerClick);
        }
        if (canvas) {
          canvas.removeEventListener('click', handleGlobalClick);
        }
      };
    }

    // Cleanup for global listener if no target mesh found
    return () => {
      if (canvas) {
        canvas.removeEventListener('click', handleGlobalClick);
      }
    };
  }, [scene, camera, controls]);

  return null; // This component doesn't render anything
}
