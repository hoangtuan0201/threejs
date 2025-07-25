import { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useCurrentSheet } from "@theatre/r3f";
import { Group, Vector3, Box3 } from 'three';

export function DoorAnimation() {
  const { scene } = useThree();
  const sheet = useCurrentSheet();
  const meshRefs = useRef(new Map());
  const originalRotations = useRef(new Map());
  const meshDictionary = useRef({});

  const thirdDoorMeshNames = [
    "Geom3D__268", "Geom3D__710", "Geom3D__712", "Geom3D__713", "Geom3D__711", 
    "Geom3D__714", "Geom3D__715", "Geom3D__716", "Geom3D__717"
  ];
  const fourthDoorMeshNames = [
    "Geom3D_269", "Geom3D_270", "Geom3D_271", "Geom3D_272", "Geom3D_267"
  ];

  const animationSequences = useMemo(() => [
    {
      id: "first-door",
      target: "Geom3D__285",
      startTime: 0.25,
      endTime: 0.6,
      action: {
        type: "rotate",
        axis: "z",
        angle: Math.PI / 2
      }
    },
    {
      id: "second-door",
      target: "Geom3D__69",
      startTime: 3,
      endTime: 5,
      action: {
        type: "rotate",
        axis: "z",
        angle: -Math.PI / 1.1
      }
    },
    {
      id: "third-door",
      target: "ThirdDoorGroup",
      startTime: 6.2,
      endTime: 6.7,
      action: {
        type: "rotate",
        axis: "y",
        angle: Math.PI / 2
      }
    },
    {
      id: "fourth-door",
      target: "FourthDoorGroup",
      startTime: 6.8,
      endTime: 7.3,
      action: {
        type: "rotate",
        axis: "y",
        angle: -Math.PI / 2
      }
    },
    {
      id: "fifth-door",
      target: "FourthDoorGroup",
      startTime: 8.2,
      endTime: 8.7,
      action: {
        type: "rotate",
        axis: "y",
        angle: Math.PI / 2
      }
    },
    {
      id: "sixth-door",
      target: "ThirdDoorGroup",
      startTime: 9,
      endTime: 9.5,
      action: {
        type: "rotate",
        axis: "y",
        angle: Math.PI / 2
      }
    },
    {
      id: "seventh-door",
      target: "Geom3D__285",
      startTime: 9.9,
      endTime: 10.4,
      action: {
        type: "rotate",
        axis: "z",
        angle: -Math.PI / 2
      }
    }
  ], []);

  useEffect(() => {
    // Tạo dictionary mesh
    scene.traverse((obj) => {
      if (obj.isMesh) {
        meshDictionary.current[obj.name] = obj;
      }
    });

    const findMesh = (name) => {
      return meshDictionary.current[name];
    };

    // Hàm tạo group với pivot logic giữ nguyên như cũ
    const createDoorGroup = (meshNames, groupName) => {
      const meshes = meshNames
        .map(name => findMesh(name))
        .filter(Boolean);

      if (meshes.length === 0) return null;

      const boundingBox = new Box3();
      meshes.forEach(mesh => {
        mesh.updateWorldMatrix(true, false);
        boundingBox.expandByObject(mesh);
      });

      // Giữ nguyên pivot logic như code gốc
      const pivotX = boundingBox.max.x; // Cạnh trái
      const pivotY = boundingBox.max.y; // Giữa theo Y
      const pivotZ = boundingBox.max.z; // Giữa theo Z
      
      const pivot = new Vector3(pivotX, pivotY, pivotZ);

      const group = new Group();
      group.name = groupName;
      group.position.copy(pivot);

      meshes.forEach(mesh => {
        mesh.updateMatrixWorld(true);
        const worldPos = new Vector3();
        mesh.getWorldPosition(worldPos);
        
        scene.attach(mesh);
        group.attach(mesh);
        
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
    }

    // Gán các mesh lẻ
    animationSequences.forEach(seq => {
      if (seq.target === "ThirdDoorGroup" || seq.target === "FourthDoorGroup") return;
      
      const mesh = findMesh(seq.target);
      if (mesh) {
        meshRefs.current.set(seq.target, mesh);
        originalRotations.current.set(seq.target, {
          x: mesh.rotation.x,
          y: mesh.rotation.y,
          z: mesh.rotation.z
        });
      }
    });

    return () => {
      meshRefs.current.forEach((groupOrMesh, key) => {
        if (groupOrMesh instanceof Group) {
          const children = [...groupOrMesh.children];
          children.forEach(mesh => {
            scene.attach(mesh);
          });
          scene.remove(groupOrMesh);
        }
      });
      meshRefs.current.clear();
      originalRotations.current.clear();
    };
  }, [scene]);

  useFrame(() => {
    if (!sheet?.sequence) return;
    const position = sheet.sequence.position;

    meshRefs.current.forEach((meshOrGroup, targetName) => {
      const original = originalRotations.current.get(targetName);
      if (!meshOrGroup || !original) return;

      // Tìm tất cả animation sequences cho target này
      const sequences = animationSequences.filter(seq => seq.target === targetName);
      if (sequences.length === 0) return;

      let newRotation = { ...original };
      let hasActiveAnimation = false;

      sequences.forEach(seq => {
        const isActive = position >= seq.startTime && position <= seq.endTime;
        if (isActive && seq.action.type === "rotate") {
          const progress = Math.max(0, Math.min(1, (position - seq.startTime) / (seq.endTime - seq.startTime)));
          const smooth = Math.sin(progress * Math.PI / 2);
          const rotAmount = smooth * seq.action.angle;
          
          newRotation[seq.action.axis] += rotAmount;
          hasActiveAnimation = true;
        }
      });

      meshOrGroup.rotation.set(
        newRotation.x,
        newRotation.y,
        newRotation.z
      );
    });
  });

  return null;
}

export default DoorAnimation;