import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { hiddenObjects } from "../data/hiddenObjects";
import { useMaterialEnhancer } from "./RenderingOptimizer";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";


export function Model({ hiddenObjectsState, onModelLoaded }) {
  const [modelReady, setModelReady] = useState(false);
  const originalMaterials = useRef(new Map());
  const { enhanceMaterial } = useMaterialEnhancer();
  const { scene, error } = useGLTF("/HouseCombined2.glb");

// Shader Enhance: Fresnel + Rim Light + AO Boost (subtle)
const applyRealisticShader = (material) => {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uAOBoost = { value: 0.2 };       // giảm AO boost

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <dithering_fragment>`,
      `
        // 🔹 Fresnel rim lighting subtle
        vec3 rimColor = vec3(0.08, 0.1, 0.12); // nhẹ hơn, hơi xanh
        gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb + rimColor, fresnel * 0.4);

        // 🔹 Subtle AO boost (darken crevices slightly)
        gl_FragColor.rgb *= 1.0 - (uAOBoost * fresnel * 0.5);

        #include <dithering_fragment>
      `
    );

    material.userData.shader = shader;
  };
  material.needsUpdate = true;
};


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

    scene.traverse((child) => {
      if (child.isMesh) {
        // Enable soft shadows
        child.castShadow = true;
        child.receiveShadow = true;
        child.geometry?.computeBoundingSphere();

        // Store original material
        if (!originalMaterials.current.has(child.name) && child.material) {
          originalMaterials.current.set(child.name, child.material.clone());
        }

        // Enhance material for realistic PBR
        if (child.material) {
          // Basic HDR/PBR enhancement
          enhanceMaterial(child.material);

          // Make reflections sharper and realistic
          child.material.envMapIntensity = 1.5;

          // Apply shader enhance
          applyRealisticShader(child.material);
        }

        // Hidden object handling
        if (hiddenObjects.includes(child.name)) {
          child.material = child.material.clone();
          child.material.transparent = true;
          child.material.opacity = hiddenObjectsState ? 0.3 : 1.0;
        } else {
          const originalMaterial = originalMaterials.current.get(child.name);
          if (originalMaterial) child.material = originalMaterial.clone();
        }
      }
    });
  }, [scene, hiddenObjectsState]);

  if (!scene || error) return null;

  return <primitive object={scene} />;
}

useGLTF.preload("/HouseCombined2.glb");
