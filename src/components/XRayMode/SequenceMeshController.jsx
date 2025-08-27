import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sequenceHiddenMeshes, hiddenMeshConfig } from '../../data/sequenceHiddenMeshes';

function SequenceMeshController({ activeSequence, onTransitionComplete }) {
  const { scene } = useThree();
  const originalMaterialsRef = useRef(new Map());
  const currentHiddenMeshesRef = useRef(new Set());
  const transitionTimeoutsRef = useRef(new Map());

  // Hàm tìm mesh theo tên (hỗ trợ tìm kiếm partial match)
  const findMeshByName = (meshName) => {
    const foundMeshes = [];
    scene.traverse((child) => {
      if (child.isMesh && child.name && 
          child.name.toLowerCase().includes(meshName.toLowerCase())) {
        foundMeshes.push(child);
      }
    });
    return foundMeshes;
  };

  // Hàm tìm mesh theo tên material (hỗ trợ tìm kiếm partial match)
  const findMeshByMaterial = (materialName) => {
    const foundMeshes = [];
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        let hasMatchingMaterial = false;
        
        // Kiểm tra material name
        if (child.material.name && child.material.name.toLowerCase().includes(materialName.toLowerCase())) {
          hasMatchingMaterial = true;
        }
        
        // Kiểm tra array of materials
        if (!hasMatchingMaterial && Array.isArray(child.material)) {
          hasMatchingMaterial = child.material.some(mat => 
            mat.name && mat.name.toLowerCase().includes(materialName.toLowerCase())
          );
        }
        
        if (hasMatchingMaterial) {
          foundMeshes.push(child);
        }
      }
    });
    return foundMeshes;
  };

  // Hàm lưu material gốc
  const saveOriginalMaterial = (mesh) => {
    const meshId = mesh.uuid;
    if (!originalMaterialsRef.current.has(meshId)) {
      originalMaterialsRef.current.set(meshId, {
        material: mesh.material.clone(),
        transparent: mesh.material.transparent,
        opacity: mesh.material.opacity,
        depthWrite: mesh.material.depthWrite,
        alphaTest: mesh.material.alphaTest
      });
    }
  };

  // Hàm ẩn mesh với hiệu ứng fade
  const hideMesh = (mesh, config) => {
    saveOriginalMaterial(mesh);
    
    const meshId = mesh.uuid;
    const duration = config.transitionDuration || hiddenMeshConfig.defaultTransitionDuration;
    const targetOpacity = config.fadeOpacity || hiddenMeshConfig.defaultFadeOpacity;
    
    // Clear existing timeout
    if (transitionTimeoutsRef.current.has(meshId)) {
      clearTimeout(transitionTimeoutsRef.current.get(meshId));
    }
    
    // Thiết lập material cho transition
    mesh.material = mesh.material.clone();
    mesh.material.transparent = true;
    mesh.material.depthWrite = false;
    mesh.material.needsUpdate = true;
    
    const startOpacity = mesh.material.opacity;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeInOutCubic)
      const easedProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      mesh.material.opacity = startOpacity + (targetOpacity - startOpacity) * easedProgress;
      mesh.material.needsUpdate = true;
      
      if (progress < 1) {
        const timeoutId = setTimeout(animate, 16); // ~60fps
        transitionTimeoutsRef.current.set(meshId, timeoutId);
      } else {
        // Transition complete
        mesh.material.opacity = targetOpacity;
        mesh.material.alphaTest = hiddenMeshConfig.hiddenMaterialProps.alphaTest;
        mesh.material.needsUpdate = true;
        transitionTimeoutsRef.current.delete(meshId);
        currentHiddenMeshesRef.current.add(meshId);
        
        if (onTransitionComplete) {
          onTransitionComplete('hide', mesh);
        }
      }
    };
    
    animate();
  };

  // Hàm hiện mesh với hiệu ứng fade
  const showMesh = (mesh, config) => {
    const meshId = mesh.uuid;
    const originalData = originalMaterialsRef.current.get(meshId);
    
    if (!originalData) return;
    
    const duration = config.transitionDuration || hiddenMeshConfig.defaultTransitionDuration;
    
    // Clear existing timeout
    if (transitionTimeoutsRef.current.has(meshId)) {
      clearTimeout(transitionTimeoutsRef.current.get(meshId));
    }
    
    const startOpacity = mesh.material.opacity;
    const targetOpacity = originalData.opacity;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeInOutCubic)
      const easedProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      mesh.material.opacity = startOpacity + (targetOpacity - startOpacity) * easedProgress;
      mesh.material.needsUpdate = true;
      
      if (progress < 1) {
        const timeoutId = setTimeout(animate, 16); // ~60fps
        transitionTimeoutsRef.current.set(meshId, timeoutId);
      } else {
        // Transition complete - restore original material
        mesh.material = originalData.material.clone();
        mesh.material.needsUpdate = true;
        transitionTimeoutsRef.current.delete(meshId);
        currentHiddenMeshesRef.current.delete(meshId);
        
        if (onTransitionComplete) {
          onTransitionComplete('show', mesh);
        }
      }
    };
    
    animate();
  };

  // Hàm hiện tất cả mesh đang ẩn
  const showAllHiddenMeshes = () => {
    const hiddenMeshIds = Array.from(currentHiddenMeshesRef.current);
    
    hiddenMeshIds.forEach(meshId => {
      scene.traverse((child) => {
        if (child.isMesh && child.uuid === meshId) {
          showMesh(child, { transitionDuration: hiddenMeshConfig.defaultTransitionDuration });
        }
      });
    });
  };

  // Effect để xử lý thay đổi activeSequence
  useEffect(() => {
    if (!scene) return;


    // Nếu không có activeSequence, hiện tất cả mesh đang ẩn
    if (!activeSequence) {
      showAllHiddenMeshes();
      return;
    }

    // Lấy config cho sequence hiện tại
    const sequenceConfig = sequenceHiddenMeshes[activeSequence];
    if (!sequenceConfig) {
      console.warn(`No hidden mesh config found for sequence: ${activeSequence}`);
      return;
    }

    // Hiện tất cả mesh đang ẩn trước
    showAllHiddenMeshes();

    // Đợi một chút để transition hoàn thành trước khi ẩn mesh mới
    setTimeout(() => {
      // Ẩn các mesh được chỉ định theo tên cho sequence này
      if (sequenceConfig.hiddenMeshes) {
        sequenceConfig.hiddenMeshes.forEach(meshName => {
          const meshes = findMeshByName(meshName);
          meshes.forEach(mesh => {
            hideMesh(mesh, sequenceConfig);
          });
          
          if (meshes.length === 0) {
            console.warn(`Mesh not found: ${meshName} for sequence: ${activeSequence}`);
          }
        });
      }
      
      // Ẩn các mesh được chỉ định theo material cho sequence này
      if (sequenceConfig.hiddenMaterials) {
        sequenceConfig.hiddenMaterials.forEach(materialName => {
          const meshes = findMeshByMaterial(materialName);
          meshes.forEach(mesh => {
            hideMesh(mesh, sequenceConfig);
          });
          
          if (meshes.length === 0) {
            console.warn(`Mesh with material not found: ${materialName} for sequence: ${activeSequence}`);
          }
        });
      }
    }, 100);

  }, [activeSequence, scene]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      // Clear all timeouts
      transitionTimeoutsRef.current.forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
      transitionTimeoutsRef.current.clear();
      
      // Restore all materials
      showAllHiddenMeshes();
    };
  }, []);

  return null; // Component này không render gì
}

export default SequenceMeshController;