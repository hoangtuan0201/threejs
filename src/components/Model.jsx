import { useGLTF } from "@react-three/drei";
import React, { useState, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export function Model(props) {
  // Load model bằng useGLTF
  const { scene } = useGLTF("/House Combined2.glb");
  const [hoveredMesh, setHoveredMesh] = useState(null);

  // Lưu lại material gốc của các mesh
  const originalMaterials = useMemo(() => {
    const materials = new Map();
    scene.traverse((child) => {
      if (child.isMesh) {
        materials.set(child, child.material);
      }
    });
    return materials;
  }, [scene]);

  // Tạo một material cho hiệu ứng hover
  const hoverMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "hotpink" }),
    []
  );

  // Thay đổi con trỏ chuột khi hover
  useEffect(() => {
    document.body.style.cursor = hoveredMesh ? "pointer" : "auto";
    // Cleanup cursor on unmount
    return () => (document.body.style.cursor = "auto");
  }, [hoveredMesh]);

  const prevHoveredMeshRef = useRef();
  // Áp dụng/bỏ hiệu ứng hover
  useEffect(() => {
    // Khôi phục material cho mesh đã hover trước đó
    if (prevHoveredMeshRef.current && originalMaterials.has(prevHoveredMeshRef.current)) {
      prevHoveredMeshRef.current.material = originalMaterials.get(prevHoveredMeshRef.current);
    }

    // Áp dụng material hover cho mesh hiện tại
    if (hoveredMesh && originalMaterials.has(hoveredMesh)) {
      hoveredMesh.material = hoverMaterial;
    }

    // Cập nhật ref cho lần render tiếp theo
    prevHoveredMeshRef.current = hoveredMesh;
  }, [hoveredMesh, hoverMaterial, originalMaterials]);

  return (
    <primitive
      object={scene}
      {...props}
      castShadow
      receiveShadow
      onPointerOver={(e) => (e.stopPropagation(), setHoveredMesh(e.object))}
      onPointerOut={(e) => (e.stopPropagation(), setHoveredMesh(null))}
      onClick={(e) => {
        e.stopPropagation();
        console.log(`Clicked on: ${e.object.name}`);
        // Thêm logic xử lý khi click vào đây
      }}
    />
  );
}

useGLTF.preload("/House Combined2.glb");
