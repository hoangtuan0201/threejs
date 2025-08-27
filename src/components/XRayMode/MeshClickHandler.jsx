import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function MeshClickHandler({ enabled = true }) {
  const { camera, scene, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const originalMaterials = useRef(new Map());
  const highlightedMesh = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event) => {
      // Tính toán tọa độ mouse normalized
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Cập nhật raycaster
      raycaster.current.setFromCamera(mouse.current, camera);

      // Tìm các object intersect
      const intersects = raycaster.current.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        
        // Log thông tin mesh được click
        console.log('Mesh clicked:', {
          name: clickedMesh.name,
          material: clickedMesh.material?.name || 'No material name',
          geometry: clickedMesh.geometry?.type || 'No geometry type',
          parent: clickedMesh.parent?.name || 'No parent'
        });

        // Highlight effect tạm thời
        highlightMesh(clickedMesh);
      }
    };

    const highlightMesh = (mesh) => {
      // Reset highlight trước đó
      if (highlightedMesh.current) {
        resetHighlight();
      }

      // Lưu material gốc
      if (mesh.material) {
        originalMaterials.current.set(mesh.uuid, mesh.material);
        
        // Tạo material highlight
        const highlightMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          transparent: true,
          opacity: 0.7
        });
        
        mesh.material = highlightMaterial;
        highlightedMesh.current = mesh;

        // Tự động reset sau 2 giây
        setTimeout(() => {
          resetHighlight();
        }, 2000);
      }
    };

    const resetHighlight = () => {
      if (highlightedMesh.current) {
        const originalMaterial = originalMaterials.current.get(highlightedMesh.current.uuid);
        if (originalMaterial) {
          highlightedMesh.current.material = originalMaterial;
          originalMaterials.current.delete(highlightedMesh.current.uuid);
        }
        highlightedMesh.current = null;
      }
    };

    // Thêm event listener
    gl.domElement.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      gl.domElement.removeEventListener('click', handleClick);
      resetHighlight();
    };
  }, [enabled, camera, scene, gl]);

  return null;
}