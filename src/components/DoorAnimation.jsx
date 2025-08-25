import { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useCurrentSheet } from "@theatre/r3f";
import { Group, Vector3, Box3 } from 'three';

/**
 * Configuration constants for door animations
 */
const DOOR_CONFIG = {
  /** Mesh names for third door group */
  THIRD_DOOR_MESHES: [
    "3DGeom-9290_2", "3DGeom-253_7", "3DGeom-256_7", "3DGeom-254_7", "3DGeom-255_7", 
    "3DGeom-253_6", "3DGeom-255_6", "3DGeom-254_6", "3DGeom-256_6"
  ],
  /** Mesh names for fourth door group */
  FOURTH_DOOR_MESHES: [
    "3DGeom-9343_2", "3DGeom-9343_3", "3DGeom-9343_1", "3DGeom-9343", "Geom3D_267"
  ],
  /** Single door mesh names */
  SINGLE_DOORS: {
    DOOR_1: "3DGeom-9388",
    DOOR_2: "3DGeom-9390",
    DOOR_7: "3DGeom-9388"
  }
};

/**
 * Animation sequences configuration with timing and rotation parameters
 */
const ANIMATION_CONFIG = [
  {
    id: "first-door",
    target: "Door1Group",
    startTime: 0.3,
    endTime: 0.6,
    action: { type: "rotate", axis: "y", angle: Math.PI / 2 }
  },
  {
    id: "second-door",
    target: "Door2Group",
    startTime: 3,
    endTime: 6,
    action: { type: "rotate", axis: "y", angle: -Math.PI / 1.4 }
  },
  {
    id: "third-door",
    target: "ThirdDoorGroup",
    startTime: 6.2,
    endTime: 6.7,
    action: { type: "rotate", axis: "y", angle: Math.PI / 2 }
  },
  {
    id: "fourth-door",
    target: "FourthDoorGroup",
    startTime: 6.8,
    endTime: 7.3,
    action: { type: "rotate", axis: "y", angle: Math.PI / 2 }
  },
  {
    id: "fifth-door",
    target: "FourthDoorGroup",
    startTime: 8.2,
    endTime: 8.7,
    action: { type: "rotate", axis: "y", angle: Math.PI / 2 }
  },
  {
    id: "sixth-door",
    target: "ThirdDoorGroup",
    startTime: 9,
    endTime: 9.5,
    action: { type: "rotate", axis: "y", angle: Math.PI / 2 }
  },
  {
    id: "seventh-door",
    target: "Door1Group",
    startTime: 9.9,
    endTime: 10.6 ,
    action: { type: "rotate", axis: "y", angle: -Math.PI / 2 }
  }
];

/**
 * Utility functions for door animation
 */

/**
 * Creates a dictionary mapping mesh names to mesh objects from the scene
 * @param {Object} scene - Three.js scene object
 * @returns {Object} Dictionary with mesh names as keys and mesh objects as values
 */
const createMeshDictionary = (scene) => {
  const dictionary = {};
  scene.traverse((obj) => {
    if (obj.isMesh) {
      dictionary[obj.name] = obj;
    }
  });
  return dictionary;
};

/**
 * Calculates pivot point for rotation based on bounding box and pivot type
 * @param {Box3} boundingBox - Three.js bounding box
 * @param {string} pivotType - Type of pivot ('left-center', 'right-top', 'center')
 * @returns {Vector3} Calculated pivot point
 */
const calculatePivotPoint = (boundingBox, pivotType = 'left-center') => {
  const { min, max } = boundingBox;
  
  switch (pivotType) {
    case 'left-center':
      return new Vector3(
        min.x,
        (min.y + max.y) / 2,
        (min.z + max.z) / 2
      );

    case 'left-top':
      return new Vector3(
        min.x,
        max.y,
        max.z
      );
    case 'right-top':
      return new Vector3(
        max.x,
        max.y,
        max.z
      );
    case 'center':
    default:
      return new Vector3(
        (min.x + max.x) / 2,
        (min.y + max.y) / 2,
        (min.z + max.z) / 2
      );
  }
};

/**
 * Attaches a mesh to a group with proper positioning relative to pivot point
 * @param {Mesh} mesh - Three.js mesh object
 * @param {Group} group - Three.js group object
 * @param {Vector3} pivot - Pivot point for positioning
 * @param {Object} scene - Three.js scene object
 */
const attachMeshToGroup = (mesh, group, pivot, scene) => {
  mesh.updateMatrixWorld(true);
  const worldPos = new Vector3();
  mesh.getWorldPosition(worldPos);
  
  scene.attach(mesh);
  group.attach(mesh);
  
  const localPos = worldPos.clone().sub(pivot);
  mesh.position.copy(localPos);
};

/**
 * Stores group reference and original rotation values for animation
 * @param {Group} group - Three.js group object
 * @param {React.MutableRefObject} meshRefs - Ref object storing mesh/group references
 * @param {React.MutableRefObject} originalRotations - Ref object storing original rotations
 */
const storeGroupReference = (group, meshRefs, originalRotations) => {
  meshRefs.current.set(group.name, group);
  originalRotations.current.set(group.name, {
    x: group.rotation.x,
    y: group.rotation.y,
    z: group.rotation.z
  });
};

/**
 * Door Animation Component
 * Handles the animation of multiple doors in a 3D scene using Theatre.js
 * @returns {null} This component doesn't render anything visible
 */
export function DoorAnimation() {
  const { scene } = useThree();
  const sheet = useCurrentSheet();
  const meshRefs = useRef(new Map());
  const originalRotations = useRef(new Map());
  const meshDictionary = useRef({});

  const animationSequences = useMemo(() => ANIMATION_CONFIG, []);

  /**
   * Creates a group from multiple meshes with specified pivot point
   * @param {string[]} meshNames - Array of mesh names to group
   * @param {string} groupName - Name for the created group
   * @param {string} pivotType - Type of pivot point calculation
   * @returns {Group|null} Created Three.js group or null if no meshes found
   */
  const createMultiMeshGroup = (meshNames, groupName, pivotType = 'right-top') => {
    const meshes = meshNames
      .map(name => meshDictionary.current[name])
      .filter(Boolean);

    if (meshes.length === 0) return null;

    const boundingBox = new Box3();
    meshes.forEach(mesh => {
      mesh.updateWorldMatrix(true, false);
      boundingBox.expandByObject(mesh);
    });

    const pivot = calculatePivotPoint(boundingBox, pivotType);
    const group = new Group();
    group.name = groupName;
    group.position.copy(pivot);

    meshes.forEach(mesh => {
      attachMeshToGroup(mesh, group, pivot, scene);
    });

    scene.add(group);
    return group;
  };

  /**
   * Creates a group from a single mesh with specified pivot point
   * @param {string} meshName - Name of the mesh to group
   * @param {string} groupName - Name for the created group
   * @param {string} pivotType - Type of pivot point calculation
   * @returns {Group|null} Created Three.js group or null if mesh not found
   */
  const createSingleMeshGroup = (meshName, groupName, pivotType = 'left-center') => {
    const mesh = meshDictionary.current[meshName];
    if (!mesh) return null;

    const boundingBox = new Box3();
    mesh.updateWorldMatrix(true, false);
    boundingBox.expandByObject(mesh);

    const pivot = calculatePivotPoint(boundingBox, pivotType);
    const group = new Group();
    group.name = groupName;
    group.position.copy(pivot);

    attachMeshToGroup(mesh, group, pivot, scene);
    scene.add(group);
    return group;
  };

  /**
   * Sets up all door groups and mesh references for animation
   */
  const setupDoorGroups = () => {
    // Tạo dictionary mesh
    meshDictionary.current = createMeshDictionary(scene);

    // Tạo các door groups
    const doorGroups = [
      {
        group: createMultiMeshGroup(DOOR_CONFIG.THIRD_DOOR_MESHES, "ThirdDoorGroup"),
        name: "ThirdDoorGroup"
      },
      {
          group: createMultiMeshGroup(DOOR_CONFIG.FOURTH_DOOR_MESHES, "FourthDoorGroup", "left-top"),
          name: "FourthDoorGroup"
        },
      {
        group: createSingleMeshGroup(DOOR_CONFIG.SINGLE_DOORS.DOOR_1, "Door1Group"),
        name: "Door1Group"
      },
      {
        group: createSingleMeshGroup(DOOR_CONFIG.SINGLE_DOORS.DOOR_2, "Door2Group"),
        name: "Door2Group"
      }
    ];

    // Store references cho các groups
    doorGroups.forEach(({ group, name }) => {
      if (group) {
        storeGroupReference(group, meshRefs, originalRotations);
      }
    });

    // Xử lý các mesh đơn lẻ còn lại
    animationSequences.forEach(seq => {
      const isGroupTarget = doorGroups.some(({ name }) => seq.target === name);
      const isSingleDoorTarget = Object.values(DOOR_CONFIG.SINGLE_DOORS).includes(seq.target);
      
      if (!isGroupTarget && !isSingleDoorTarget) {
        const mesh = meshDictionary.current[seq.target];
        if (mesh) {
          meshRefs.current.set(seq.target, mesh);
          originalRotations.current.set(seq.target, {
            x: mesh.rotation.x,
            y: mesh.rotation.y,
            z: mesh.rotation.z
          });
        }
      }
    });
  };

  /**
   * Cleans up groups and reattaches meshes to scene
   */
  const cleanupGroups = () => {
    meshRefs.current.forEach((groupOrMesh) => {
      if (groupOrMesh instanceof Group) {
        const children = [...groupOrMesh.children];
        children.forEach(mesh => scene.attach(mesh));
        scene.remove(groupOrMesh);
      }
    });
    meshRefs.current.clear();
    originalRotations.current.clear();
  };

  useEffect(() => {
    setupDoorGroups();
    return cleanupGroups;
  }, [scene, animationSequences]);

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