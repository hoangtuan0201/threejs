import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

import { useMaterialEnhancer } from "./RenderingOptimizer";
import { useFrame, useThree } from "@react-three/fiber";
import SequenceMeshController from "./SequenceMeshController";
import * as THREE from "three";
import { convertToSignedUrl } from "../utils/wasabiHelper"; // Adjust import path as needed
const MODEL_URL = "./optimizedmodel.glb"; // Adjust path as needed
const SIGNED_MODEL_URL = convertToSignedUrl(MODEL_URL);
export function Model({ activeSequence, onModelLoaded }) {
  const [modelReady, setModelReady] = useState(false);
  const originalMaterials = useRef(new Map());
  const { enhanceMaterial } = useMaterialEnhancer();
  const { scene, error } = useGLTF(MODEL_URL);
  const { scene: globalScene } = useThree();

  // // Shader Enhance: Fresnel + Rim Light + AO Boost (subtle)
  // const applyRealisticShader = (material) => {
  //   material.onBeforeCompile = (shader) => {
  //     shader.uniforms.uTime = { value: 0 };
  //     shader.uniforms.uAOBoost = { value: 0.2 };       // tăng AO boost để tăng độ tương phản

  //     shader.fragmentShader = shader.fragmentShader.replace(
  //       `#include <dithering_fragment>`,
  //       `
  //         // 🔹 Fresnel rim lighting subtle
  //         vec3 rimColor = vec3(0.08, 0.1, 0.12); // tăng nhẹ để rim rõ hơn
  //         gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb + rimColor, fresnel * 0.4);

  //         // 🔹 Subtle AO boost (darken crevices more)
  //         gl_FragColor.rgb *= 1.0 - (uAOBoost * fresnel * 0.5);

  //         #include <dithering_fragment>
  //       `
  //     );

  //     material.userData.shader = shader;
  //   };
  //   material.needsUpdate = true;
  // };


  // Update shader uniforms for dynamic effects
  useFrame(({ clock }) => {
    scene?.traverse((child) => {
      if (child.isMesh && child.material?.userData?.shader) {
        child.material.userData.shader.uniforms.uTime.value = clock.elapsedTime;
      }
    });
  });

  // Notify when model is loaded
  useEffect(() => {
    if (scene && !modelReady) {
      setModelReady(true);
      onModelLoaded?.();
    }
  }, [scene, modelReady, onModelLoaded]);

  // Traverse model and enhance realism
  useEffect(() => {
    if (!scene) return;

    // Helper to create ultra-realistic PBR materials (Game 4K quality)
    const toPhysicalMaterial = (src) => {
      if (!src) return null;

      // If it's already a PhysicalMaterial, enhance it for photorealism
      if (src.isMeshPhysicalMaterial) {
        // Moderate clearcoat for natural surfaces
        src.clearcoat = Math.max(src.clearcoat ?? 0, 0.5);
        src.clearcoatRoughness = Math.min(src.clearcoatRoughness ?? 0.08, 0.1);
        
        // Balanced environment mapping for natural reflections
        src.envMapIntensity = Math.max(src.envMapIntensity ?? 1.0, 1.5);
        
        // Balanced metalness and roughness for natural look
        src.metalness = Math.min(Math.max(src.metalness ?? 0.3, 0.4), 0.7);
        src.roughness = Math.max(Math.min(src.roughness ?? 0.2, 0.4), 0.05);
        
        // Advanced IOR for realistic refractions
        src.ior = src.ior ?? 1.5;
        
        // Sheen for fabric-like materials
        if (src.roughness > 0.7) {
          src.sheen = 0.5;
          src.sheenRoughness = 0.8;
          src.sheenColor = new THREE.Color(0.95, 0.95, 0.95);
        }
        
        src.needsUpdate = true;
        return src;
      }

      // Create ultra-high quality physical material from standard material
      const params = {
        name: src.name || '', // PRESERVE MATERIAL NAME
        color: src.color ? src.color.clone() : new THREE.Color(0xffffff),
        map: src.map || null,
        normalMap: src.normalMap || null,
        roughnessMap: src.roughnessMap || null,
        metalnessMap: src.metalnessMap || null,
        aoMap: src.aoMap || null,
        emissiveMap: src.emissiveMap || null,
        envMap: src.envMap || null,
        emissive: src.emissive ? src.emissive.clone() : new THREE.Color(0x000000),
        
        // Photorealistic metalness and roughness values
        metalness: typeof src.metalness === 'number' ? Math.max(src.metalness, 0.7) : 0.85,
        roughness: typeof src.roughness === 'number' ? Math.max(src.roughness * 0.4, 0.01) : 0.03,
        
        transparent: src.transparent || false,
        opacity: typeof src.opacity === 'number' ? src.opacity : 1.0,
        side: src.side ?? THREE.FrontSide,
        reflectivity: src.reflectivity ?? 1.0,
        
        // Moderate clearcoat for natural finish
        clearcoat: 0.4,
        clearcoatRoughness: 0.1,
        
        // Natural IOR for realistic refractions
        ior: 1.3,
        
        // Balanced environment mapping for natural realism
        envMapIntensity: 1.2, // Giảm intensity để tránh chói lóa
        
        // Advanced transmission for glass materials
        transmission: src.transmission ?? 0,
        thickness: src.thickness ?? 0.5,
        
        // Note: anisotropy is not available in all Three.js versions
        // anisotropy: 0.1,
        // anisotropyRotation: 0,
      };

      const mat = new THREE.MeshPhysicalMaterial(params);
      
      // ENSURE NAME IS PRESERVED
      mat.name = src.name || '';

      // Advanced material properties for different surface types
      if (src.sheen !== undefined) mat.sheen = src.sheen;
      if (src.sheenRoughness !== undefined) mat.sheenRoughness = src.sheenRoughness;
      if (src.sheenColor !== undefined) mat.sheenColor = src.sheenColor;

      // Ensure balanced env map intensity for natural reflections
      mat.envMapIntensity = Math.max(src.envMapIntensity ?? 1.0, 1.2); // Giảm intensity để tránh chói lóa

      // Enable double-sided rendering for thin materials
      if (src.side === THREE.DoubleSide) {
        mat.side = THREE.DoubleSide;
      }

      mat.needsUpdate = true;
      return mat;
    };

    scene.traverse((child) => {
      if (child.isMesh) {
        // Enable soft shadows
        child.castShadow = true;
        child.receiveShadow = true;
        child.geometry?.computeBoundingSphere();
        child.material.shadowSide = THREE.FrontSide;

        // Store original material
        if (!originalMaterials.current.has(child.name) && child.material) {
          try {
            const clonedMaterial = child.material.clone();
            // PRESERVE MATERIAL NAME WHEN CLONING
            clonedMaterial.name = child.material.name;
            originalMaterials.current.set(child.name, clonedMaterial);
          } catch (e) {
            // fallback: store reference
            originalMaterials.current.set(child.name, child.material);
          }
        }

        // Enhance material for realistic PBR
        if (child.material) {
          // First let the general enhancer tweak values
          enhanceMaterial(child.material);

          // Convert to a MeshPhysicalMaterial for better clearcoat/reflectivity
          try {
            const phys = toPhysicalMaterial(child.material);
            if (phys) child.material = phys;
          } catch (e) {
            console.warn('Failed to convert material to physical:', e);
          }

          // Make reflections balanced and natural for comfortable viewing
          child.material.envMapIntensity = Math.max(child.material.envMapIntensity ?? 1.0, 1.0); // Giảm intensity để tránh chói lóa
          if (child.material.isMeshPhysicalMaterial) {
            child.material.clearcoat = Math.max(child.material.clearcoat ?? 0, 0.3);
            child.material.clearcoatRoughness = Math.min(child.material.clearcoatRoughness ?? 0.02, 0.15);
            
            // Balanced metalness for natural metal surfaces
            child.material.metalness = Math.min(Math.max(child.material.metalness ?? 0.3, 0.3), 0.5);
            child.material.roughness = Math.max(child.material.roughness ?? 0.03, 0.1);
            
            // Advanced IOR for glass-like materials
            child.material.ior = child.material.ior ?? 1.5;
            
            // Note: Add subtle anisotropy for brushed metal effects if supported
            // if (child.material.metalness > 0.8 && child.material.anisotropy !== undefined) {
            //   child.material.anisotropy = 0.1;
            // }
          }

          const tex = child.material;
          const setCS = (t, cs) => { if (!t) return; if ('colorSpace' in t) { t.colorSpace = cs; } else if ('encoding' in t) { t.encoding = cs === THREE.SRGBColorSpace ? THREE.sRGBEncoding : THREE.LinearEncoding; } t.needsUpdate = true; };
          setCS(tex.map, THREE.SRGBColorSpace);
          setCS(tex.emissiveMap, THREE.SRGBColorSpace);
          setCS(tex.normalMap, THREE.LinearSRGBColorSpace);
          setCS(tex.roughnessMap, THREE.LinearSRGBColorSpace);
          setCS(tex.metalnessMap, THREE.LinearSRGBColorSpace);
          setCS(tex.aoMap, THREE.LinearSRGBColorSpace);
          child.material.needsUpdate = true;
        }

        // Ensure the material uses the global environment for reflections
        try {
          if (globalScene?.environment && !child.material.envMap) {
            child.material.envMap = globalScene.environment;
            // Balanced intensity for natural reflections
            child.material.envMapIntensity = Math.max(child.material.envMapIntensity ?? 1.0, 1.0); // Giảm intensity để tránh chói lóa
            child.material.needsUpdate = true;
          }
        } catch (e) {
          // ignore env map assignment errors
        }
      }
    });
  }, [scene]);

  if (!scene || error) return null;

  return (
    <group>
      <primitive object={scene} />
      <SequenceMeshController 
        scene={scene}
        activeSequence={activeSequence}
      />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
