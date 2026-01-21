import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function LinearGrilleModel({ 
  grilleType = 'linear-bulkhead',
  position = [31.4, 6.6, -20.7],
  rotation = [0.1, Math.PI / 1, 0],
  scale = [0.1, 0.1, 0.1],
  visible = true,
  modelUrl = "./lineartest.glb" // Default fallback URL
}) {
  const { scene, error } = useGLTF(modelUrl);
  const groupRef = useRef();
  const { scene: globalScene } = useThree();
  const [modelReady, setModelReady] = useState(false);

  // Enhanced material setup for different grille types
  const applyGrilleMaterial = (mesh, type) => {
    if (!mesh || !mesh.material) return;

    let materialConfig = {};

    switch (type) {
      case 'normal':
        materialConfig = {
          color: new THREE.Color(0x888888),
          metalness: 0.3,
          roughness: 0.8,
          clearcoat: 0.1
        };
        break;
      case 'round':
        materialConfig = {
          color: new THREE.Color(0xaaaaaa),
          metalness: 0.5,
          roughness: 0.4,
          clearcoat: 0.3
        };
        break;
      case 'linear-bulkhead':
        materialConfig = {
          color: new THREE.Color(0xffffff),
          metalness: 0.7,
          roughness: 0.2,
          clearcoat: 0.6,
          clearcoatRoughness: 0.1
        };
        break;
      case 'linear-fascia':
        materialConfig = {
          color: new THREE.Color(0xf5f5f5),
          metalness: 0.6,
          roughness: 0.3,
          clearcoat: 0.5
        };
        break;
      case 'linear-trowelled':
        materialConfig = {
          color: new THREE.Color(0xe8e8e8),
          metalness: 0.4,
          roughness: 0.6,
          clearcoat: 0.2
        };
        break;
      case 'linear-ceiling':
        materialConfig = {
          color: new THREE.Color(0xf0f0f0),
          metalness: 0.8,
          roughness: 0.1,
          clearcoat: 0.7,
          clearcoatRoughness: 0.05,
          envMapIntensity: 1.5
        };
        break;
      default:
        materialConfig = {
          color: new THREE.Color(0xffffff),
          metalness: 0.7,
          roughness: 0.2,
          clearcoat: 0.6
        };
    }

    // Apply material configuration
    if (mesh.material.isMeshPhysicalMaterial || mesh.material.isMeshStandardMaterial) {
      Object.assign(mesh.material, materialConfig);
      mesh.material.needsUpdate = true;
    } else {
      // Convert to physical material if needed
      const newMaterial = new THREE.MeshPhysicalMaterial({
        ...materialConfig,
        map: mesh.material.map,
        normalMap: mesh.material.normalMap,
        roughnessMap: mesh.material.roughnessMap,
        metalnessMap: mesh.material.metalnessMap,
        aoMap: mesh.material.aoMap,
        envMapIntensity: 1.2,
        ior: 1.5
      });
      mesh.material = newMaterial;
    }
  };

  // Setup model when loaded
  useEffect(() => {
    if (!scene) return;

    const clonedScene = scene.clone();
    
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        // Enable shadows
        child.castShadow = false;
        child.receiveShadow = true;
        
        // Apply grille-specific material
        applyGrilleMaterial(child, grilleType);
        
        // Ensure environment mapping
        if (globalScene?.environment && !child.material.envMap) {
          child.material.envMap = globalScene.environment;
          child.material.envMapIntensity = 1.2;
          child.material.needsUpdate = true;
        }
      }
    });

    if (groupRef.current) {
      // Clear previous children
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      // Add new scene
      groupRef.current.add(clonedScene);
    }

    setModelReady(true);
  }, [scene, grilleType, globalScene]);

  // Update materials when grille type changes
  useEffect(() => {
    if (!groupRef.current || !modelReady) return;

    groupRef.current.traverse((child) => {
      if (child.isMesh) {
        applyGrilleMaterial(child, grilleType);
      }
    });
  }, [grilleType, modelReady]);

  if (!scene || error) {
    console.warn('Failed to load linear grille model:', error);
    return null;
  }

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      visible={visible}
    />
  );
}

// Preload the default model
useGLTF.preload("./lineartest.glb");