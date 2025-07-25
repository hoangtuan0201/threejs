import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useCurrentSheet } from "@theatre/r3f";
import { Group, Vector3, Box3 } from 'three';

export function DoorAnimation() {
  const { scene } = useThree();
  const sheet = useCurrentSheet();
  const meshRefs = useRef(new Map());
  const originalRotations = useRef(new Map());
  const animatingStates = useRef(new Map());

  const thirdDoorMeshNames = [
    "Geom3D__268", "Geom3D__710", "Geom3D__712", "Geom3D__713", "Geom3D__711", 
    "Geom3D__714", "Geom3D__715", "Geom3D__716", "Geom3D__717"
  ];
  const fourthDoorMeshNames = [
    "Geom3D_269", "Geom3D_270", "Geom3D_271", "Geom3D_272", "Geom3D_267"
  ];

  const animationSequences = [
    {
      name: "First Door",
      meshName: "Geom3D__285",
      startTime: 0.25,
      endTime: 0.6,
      action: "rotate",
      rotationAxis: "z",
      rotationAngle: Math.PI / 2,
    },
    {
      name: "Second Door",
      meshName: "Geom3D__69",
      startTime: 3,
      endTime: 5,
      action: "rotate",
      rotationAxis: "z",
      rotationAngle: -Math.PI / 1.1,
    },
    {
      name: "Third Door",
      meshName: "ThirdDoorGroup",
      startTime: 6.2,
      endTime: 6.7,
      action: "rotate",
      rotationAxis: "y",
      rotationAngle: Math.PI / 2,
    },
    {
      name: "Fourth Door",
      meshName: "FourthDoorGroup",
      startTime: 6.8,
      endTime: 7.3,
      action: "rotate",
      rotationAxis: "y",
      rotationAngle: -Math.PI / 2,
    },
    {
      name: "Fifth Door",
      meshName: "FourthDoorGroup",
      startTime: 8.2,
      endTime: 8.7,
      action: "rotate",
      rotationAxis: "y",
      rotationAngle: Math.PI / 2,
    },
    {
      name: "Sixth Door",
      meshName: "ThirdDoorGroup",
      startTime: 9,
      endTime: 9.5,
      action: "rotate",
      rotationAxis: "y",
      rotationAngle: Math.PI / 2,
    },
    {
      name: "Seventh Door",
      meshName: "Geom3D__285",
      startTime: 9.9,
      endTime: 10.4,
      action: "rotate",
      rotationAxis: "z",
      rotationAngle: -Math.PI / 2,
    }
  ];

  useEffect(() => {
    const findMesh = (object, name) => {
      if (object.name === name) return object;
      for (let child of object.children) {
        const found = findMesh(child, name);
        if (found) return found;
      }
      return null;
    };

    // ✅ Hàm tạo group chung cho cả Third và Fourth Door
    const createDoorGroup = (meshNames, groupName) => {
      const meshes = meshNames
        .map(name => findMesh(scene, name))
        .filter(Boolean);

      if (meshes.length === 0) {
        return null;
      }

      const boundingBox = new Box3();
      meshes.forEach(mesh => {
        mesh.updateWorldMatrix(true, false);
        boundingBox.expandByObject(mesh);
      });

      // ✅ Pivot ở bản lề trái (cạnh trái của cửa)
      const pivotX = boundingBox.max.x; // Cạnh trái
      const pivotY = boundingBox.max.y; // Giữa theo Y
      const pivotZ = boundingBox.max.z; // Giữa theo Z
      
      const pivot = new Vector3(pivotX, pivotY, pivotZ);

      // Tạo group tại pivot point (bản lề)
      const group = new Group();
      group.name = groupName;
      group.position.copy(pivot);

      // Gắn từng mesh vào group và điều chỉnh vị trí
      meshes.forEach(mesh => {
        mesh.updateMatrixWorld(true);
        
        // Lưu world position hiện tại
        const worldPos = new Vector3();
        mesh.getWorldPosition(worldPos);
        
        // Đưa về scene trước khi attach vào group
        scene.attach(mesh);
        
        // Attach vào group (giữ nguyên world transform)
        group.attach(mesh);
        
        // Tính lại local position so với pivot
        const localPos = worldPos.clone().sub(pivot);
        mesh.position.copy(localPos);
      });

      scene.add(group);
      return group;
    };

    // Tạo Third Door Group
    const thirdDoorGroup = createDoorGroup(thirdDoorMeshNames, "ThirdDoorGroup");
    if (thirdDoorGroup) {
      meshRefs.current.set("ThirdDoorGroup", thirdDoorGroup);
      originalRotations.current.set("ThirdDoorGroup", {
        x: thirdDoorGroup.rotation.x,
        y: thirdDoorGroup.rotation.y,
        z: thirdDoorGroup.rotation.z
      });
      animatingStates.current.set("ThirdDoorGroup", false);
    }

    // Tạo Fourth Door Group
    const fourthDoorGroup = createDoorGroup(fourthDoorMeshNames, "FourthDoorGroup");
    if (fourthDoorGroup) {
      meshRefs.current.set("FourthDoorGroup", fourthDoorGroup);
      originalRotations.current.set("FourthDoorGroup", {
        x: fourthDoorGroup.rotation.x,
        y: fourthDoorGroup.rotation.y,
        z: fourthDoorGroup.rotation.z
      });
      animatingStates.current.set("FourthDoorGroup", false);
    }

    // ✅ Gán các mesh lẻ khác (chỉ First và Second Door)
    animationSequences.forEach(seq => {
      // Skip các group đã tạo
      if (seq.meshName === "ThirdDoorGroup" || seq.meshName === "FourthDoorGroup") return;

      const mesh = findMesh(scene, seq.meshName);
      if (mesh) {
        meshRefs.current.set(seq.meshName, mesh);
        originalRotations.current.set(seq.meshName, {
          x: mesh.rotation.x,
          y: mesh.rotation.y,
          z: mesh.rotation.z
        });
        animatingStates.current.set(seq.meshName, false);
      }
    });


  }, [scene]);

  useFrame(() => {
    if (!sheet?.sequence) return;
    const position = sheet.sequence.position;

    // Handle group animations and individual mesh animations specially
    const fourthDoorSequences = animationSequences.filter(seq => seq.meshName === "FourthDoorGroup");
    const thirdDoorSequences = animationSequences.filter(seq => seq.meshName === "ThirdDoorGroup");
    const firstDoorSequences = animationSequences.filter(seq => seq.meshName === "Geom3D__285");
    const otherSequences = animationSequences.filter(seq =>
      seq.meshName !== "FourthDoorGroup" &&
      seq.meshName !== "ThirdDoorGroup" &&
      seq.meshName !== "Geom3D__285"
    );

    // Handle other sequences normally
    otherSequences.forEach(seq => {
      const mesh = meshRefs.current.get(seq.meshName);
      const original = originalRotations.current.get(seq.meshName);
      if (!mesh || !original) return;

      const isInTimeRange = position >= seq.startTime && position <= seq.endTime;

      if (seq.action === "rotate") {
        if (isInTimeRange) {
          const progress = (position - seq.startTime) / (seq.endTime - seq.startTime);
          const smooth = Math.sin(progress * Math.PI / 2);
          const rotAmount = smooth * seq.rotationAngle;

          if (seq.rotationAxis === "x") mesh.rotation.x = original.x + rotAmount;
          if (seq.rotationAxis === "y") mesh.rotation.y = original.y + rotAmount;
          if (seq.rotationAxis === "z") mesh.rotation.z = original.z + rotAmount;

          if (!animatingStates.current.get(seq.meshName)) {
            animatingStates.current.set(seq.meshName, true);
          }
        } else {
          // Reset rotation về vị trí ban đầu
          mesh.rotation.set(original.x, original.y, original.z);
          if (animatingStates.current.get(seq.meshName)) {
            animatingStates.current.set(seq.meshName, false);
          }
        }
      }
    });

    // Handle FourthDoorGroup sequential animations
    if (fourthDoorSequences.length > 0) {
      const mesh = meshRefs.current.get("FourthDoorGroup");
      const original = originalRotations.current.get("FourthDoorGroup");
      if (mesh && original) {
        let rotationZ = original.z;
        let rotationY = original.y;
        let hasActiveAnimation = false;

        fourthDoorSequences.forEach(seq => {
          const isInTimeRange = position >= seq.startTime && position <= seq.endTime;

          if (seq.action === "rotate" && isInTimeRange) {
            const progress = (position - seq.startTime) / (seq.endTime - seq.startTime);
            const smooth = Math.sin(progress * Math.PI / 2);
            const rotAmount = smooth * seq.rotationAngle;

            if (seq.rotationAxis === "z") {
              rotationZ = original.z + rotAmount;
            }
            if (seq.rotationAxis === "y") {
              rotationY = original.y + rotAmount;
            }

            hasActiveAnimation = true;

            if (!animatingStates.current.get(`${seq.meshName}_${seq.name}`)) {
              animatingStates.current.set(`${seq.meshName}_${seq.name}`, true);
            }
          } else {
            if (animatingStates.current.get(`${seq.meshName}_${seq.name}`)) {
              animatingStates.current.set(`${seq.meshName}_${seq.name}`, false);
            }
          }
        });

        // Apply combined rotations
        mesh.rotation.set(original.x, rotationY, rotationZ);

        // Reset to original if no animation is active
        if (!hasActiveAnimation) {
          mesh.rotation.set(original.x, original.y, original.z);
        }
      }
    }

    // Handle ThirdDoorGroup sequential animations (Third Door + Sixth Door)
    if (thirdDoorSequences.length > 0) {
      const mesh = meshRefs.current.get("ThirdDoorGroup");
      const original = originalRotations.current.get("ThirdDoorGroup");
      if (mesh && original) {
        let rotationZ = original.z;
        let rotationY = original.y;
        let hasActiveAnimation = false;

        thirdDoorSequences.forEach(seq => {
          const isInTimeRange = position >= seq.startTime && position <= seq.endTime;

          if (seq.action === "rotate" && isInTimeRange) {
            const progress = (position - seq.startTime) / (seq.endTime - seq.startTime);
            const smooth = Math.sin(progress * Math.PI / 2);
            const rotAmount = smooth * seq.rotationAngle;

            if (seq.rotationAxis === "z") {
              rotationZ = original.z + rotAmount;
            }
            if (seq.rotationAxis === "y") {
              rotationY = original.y + rotAmount;
            }

            hasActiveAnimation = true;

            if (!animatingStates.current.get(`${seq.meshName}_${seq.name}`)) {
              animatingStates.current.set(`${seq.meshName}_${seq.name}`, true);
            }
          } else {
            if (animatingStates.current.get(`${seq.meshName}_${seq.name}`)) {
              animatingStates.current.set(`${seq.meshName}_${seq.name}`, false);
            }
          }
        });

        // Apply combined rotations
        mesh.rotation.set(original.x, rotationY, rotationZ);

        // Reset to original if no animation is active
        if (!hasActiveAnimation) {
          mesh.rotation.set(original.x, original.y, original.z);
        }
      }
    }

    // Handle First Door (Geom3D__285) sequential animations (Door 1 + Door 7)
    if (firstDoorSequences.length > 0) {
      const mesh = meshRefs.current.get("Geom3D__285");
      const original = originalRotations.current.get("Geom3D__285");
      if (mesh && original) {
        let rotationZ = original.z;
        let hasActiveAnimation = false;

        firstDoorSequences.forEach(seq => {
          const isInTimeRange = position >= seq.startTime && position <= seq.endTime;

          if (seq.action === "rotate" && isInTimeRange) {
            const progress = (position - seq.startTime) / (seq.endTime - seq.startTime);
            const smooth = Math.sin(progress * Math.PI / 2);
            const rotAmount = smooth * seq.rotationAngle;

            if (seq.rotationAxis === "z") {
              rotationZ = original.z + rotAmount;
            }

            hasActiveAnimation = true;

            if (!animatingStates.current.get(`${seq.meshName}_${seq.name}`)) {
              animatingStates.current.set(`${seq.meshName}_${seq.name}`, true);
            }
          } else {
            if (animatingStates.current.get(`${seq.meshName}_${seq.name}`)) {
              animatingStates.current.set(`${seq.meshName}_${seq.name}`, false);
            }
          }
        });

        // Apply rotation
        mesh.rotation.set(original.x, original.y, rotationZ);

        // Reset to original if no animation is active
        if (!hasActiveAnimation) {
          mesh.rotation.set(original.x, original.y, original.z);
        }
      }
    }
  });

  return null;
}

export default DoorAnimation;