# Door Animation System Documentation

## 📋 **Tổng quan**
Door Animation System cung cấp hệ thống animation mượt mà, dựa trên timeline cho các cửa trong mô hình 3D. Hệ thống hỗ trợ cả animation cho mesh đơn lẻ và nhóm mesh với pivot-based rotations, được tối ưu hóa cho hiệu suất cao.

## 🏗️ **Cấu trúc File**

### **File chính**
- **Main Component**: `src/components/DoorAnimation.jsx`
- **Component Name**: `DoorAnimation`
- **Integration**: Được sử dụng trong Scene.jsx

### **Dependencies**
```javascript
import { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useCurrentSheet } from "@theatre/r3f";
import { Group, Vector3, Box3 } from 'three';
```

## 🎯 **Tính năng chính**

### **1. 7 Door Animations**
- Sequential door opening/closing animations
- Timeline-based synchronization với Theatre.js
- Smooth rotation transitions với sine easing
- Multiple animations trên cùng một door/group

### **2. Group-based Animation**
- Multiple meshes animated như single units
- Intelligent pivot point calculation
- Proper mesh attachment và positioning
- Memory-efficient group management

### **3. Pivot-based Rotation**
- Realistic door hinge behavior
- Configurable pivot types (left-center, right-top, center)
- Bounding box-based pivot calculation
- World position preservation

### **4. Performance Optimized**
- Single useFrame loop cho tất cả animations
- Mesh dictionary cho O(1) lookups
- Efficient memory management
- Minimal object creation trong animation loop

## 🔧 **Configuration System**

### **DOOR_CONFIG Constants**
```javascript
const DOOR_CONFIG = {
  /** Mesh names for third door group */
  THIRD_DOOR_MESHES: [
    "3DGeom-9290_2", "3DGeom-253_7", "3DGeom-256_7", "3DGeom-254_7", 
    "3DGeom-255_7", "3DGeom-253_6", "3DGeom-255_6", "3DGeom-254_6", 
    "3DGeom-256_6"
  ],
  /** Mesh names for fourth door group */
  FOURTH_DOOR_MESHES: [
    "3DGeom-9343_2", "3DGeom-9343_3", "3DGeom-9343_1", 
    "3DGeom-9343", "Geom3D_267"
  ],
  /** Single door mesh names */
  SINGLE_DOORS: {
    DOOR_1: "3DGeom-9388",
    DOOR_2: "3DGeom-9390",
    DOOR_7: "3DGeom-9388"
  }
};
```

### **ANIMATION_CONFIG Sequences**
```javascript
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
    endTime: 10.6,
    action: { type: "rotate", axis: "y", angle: -Math.PI / 2 }
  }
];
```

## 🏗️ **Architecture & Components**

### **Core State Management**
```javascript
export function DoorAnimation() {
  const { scene } = useThree();
  const sheet = useCurrentSheet();
  const meshRefs = useRef(new Map());           // Mesh/Group references
  const originalRotations = useRef(new Map());  // Original rotation states
  const meshDictionary = useRef({});            // Scene mesh lookup dictionary
  const animationSequences = useMemo(() => ANIMATION_CONFIG, []);
}
```

### **Utility Functions**

#### **1. createMeshDictionary**
```javascript
const createMeshDictionary = (scene) => {
  const dictionary = {};
  scene.traverse((obj) => {
    if (obj.isMesh) {
      dictionary[obj.name] = obj;
    }
  });
  return dictionary;
};
```

#### **2. calculatePivotPoint**
```javascript
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
      return new Vector3(min.x, max.y, max.z);
    case 'right-top':
      return new Vector3(max.x, max.y, max.z);
    case 'center':
    default:
      return new Vector3(
        (min.x + max.x) / 2,
        (min.y + max.y) / 2,
        (min.z + max.z) / 2
      );
  }
};
```

#### **3. attachMeshToGroup**
```javascript
const attachMeshToGroup = (mesh, group, pivot, scene) => {
  mesh.updateMatrixWorld(true);
  const worldPos = new Vector3();
  mesh.getWorldPosition(worldPos);
  
  scene.attach(mesh);
  group.attach(mesh);
  
  const localPos = worldPos.clone().sub(pivot);
  mesh.position.copy(localPos);
};
```

## 🎮 **Door Configurations**

### **Individual Doors**
| Door | Target | Timeline | Axis | Angle | Description |
|------|--------|----------|------|-------|-------------|
| 1st | `Door1Group` | 0.3s - 0.6s | Y | +90° | Front door open |
| 2nd | `Door2Group` | 3.0s - 6.0s | Y | -128.6° | Side door open |
| 7th | `Door1Group` | 9.9s - 10.6s | Y | -90° | Front door close |

### **Group Doors**

#### **Third Door Group**
- **Target**: `ThirdDoorGroup`
- **Meshes**: `3DGeom-9290_2`, `3DGeom-253_7`, `3DGeom-256_7`, `3DGeom-254_7`, `3DGeom-255_7`, `3DGeom-253_6`, `3DGeom-255_6`, `3DGeom-254_6`, `3DGeom-256_6`
- **Pivot Type**: `right-top` (default)
- **Animations**:
  - 3rd Door: 6.2s - 6.7s, Y-axis, +90°
  - 6th Door: 9.0s - 9.5s, Y-axis, +90°

#### **Fourth Door Group**
- **Target**: `FourthDoorGroup`
- **Meshes**: `3DGeom-9343_2`, `3DGeom-9343_3`, `3DGeom-9343_1`, `3DGeom-9343`, `Geom3D_267`
- **Pivot Type**: `left-top`
- **Animations**:
  - 4th Door: 6.8s - 7.3s, Y-axis, +90°
  - 5th Door: 8.2s - 8.7s, Y-axis, +90°

#### **Single Door Groups**
- **Door1Group**: `3DGeom-9388` (Front door)
- **Door2Group**: `3DGeom-9390` (Side door)

## 🔄 **Technical Implementation**

### **Group Creation Process**

#### **1. createMultiMeshGroup**
```javascript
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
```

#### **2. createSingleMeshGroup**
```javascript
const createSingleMeshGroup = (meshName, groupName) => {
  const mesh = meshDictionary.current[meshName];
  if (!mesh) return null;

  const group = new Group();
  group.name = groupName;
  
  // Copy mesh position to group
  group.position.copy(mesh.position);
  group.rotation.copy(mesh.rotation);
  
  // Reset mesh transform và attach to group
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  group.add(mesh);
  
  scene.add(group);
  return group;
};
```

### **Setup Process**
```javascript
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
};
```

### **Animation Processing**
```javascript
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
        const smooth = Math.sin(progress * Math.PI / 2);  // Sine easing
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
```

## ⚡ **Performance Optimizations**

### **1. Mesh Dictionary**
- Pre-computed scene traversal cho O(1) mesh lookups
- Single traversal thay vì multiple scene.getObjectByName() calls
- Memory-efficient object references

### **2. Single Animation Loop**
- One useFrame loop handles tất cả door animations
- Batch processing của multiple sequences per target
- Minimal object creation trong animation loop

### **3. Efficient State Management**
- Map-based storage cho mesh references và original rotations
- useMemo cho animation sequences
- Proper cleanup trong useEffect return

### **4. Smart Group Management**
```javascript
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
```

## 🎨 **Animation Features**

### **1. Sine Easing**
```javascript
const progress = Math.max(0, Math.min(1, (position - seq.startTime) / (seq.endTime - seq.startTime)));
const smooth = Math.sin(progress * Math.PI / 2);  // Smooth acceleration/deceleration
const rotAmount = smooth * seq.action.angle;
```

### **2. Sequential Animations**
- Multiple animations trên cùng target (ThirdDoorGroup, FourthDoorGroup, Door1Group)
- Additive rotation calculations
- Timeline-based sequencing

### **3. Flexible Pivot Types**
- **left-center**: Cho doors mở từ left edge
- **left-top**: Cho doors với hinge ở top-left
- **right-top**: Cho doors với hinge ở top-right
- **center**: Cho symmetric rotations

## 🛠️ **Development Guidelines**

### **Adding New Door Animation**

#### **1. Single Mesh Door**
```javascript
// 1. Add to DOOR_CONFIG
SINGLE_DOORS: {
  NEW_DOOR: "MeshName"
}

// 2. Add to ANIMATION_CONFIG
{
  id: "new-door",
  target: "NewDoorGroup",
  startTime: 5.0,
  endTime: 5.5,
  action: { type: "rotate", axis: "y", angle: Math.PI / 2 }
}

// 3. Add to setupDoorGroups
{
  group: createSingleMeshGroup(DOOR_CONFIG.SINGLE_DOORS.NEW_DOOR, "NewDoorGroup"),
  name: "NewDoorGroup"
}
```

#### **2. Multi-Mesh Door Group**
```javascript
// 1. Add to DOOR_CONFIG
NEW_DOOR_MESHES: ["Mesh1", "Mesh2", "Mesh3"]

// 2. Add to ANIMATION_CONFIG
{
  id: "new-group-door",
  target: "NewGroupDoor",
  startTime: 6.0,
  endTime: 6.5,
  action: { type: "rotate", axis: "z", angle: -Math.PI / 2 }
}

// 3. Add to setupDoorGroups
{
  group: createMultiMeshGroup(DOOR_CONFIG.NEW_DOOR_MESHES, "NewGroupDoor", "left-center"),
  name: "NewGroupDoor"
}
```

### **Customizing Animations**

#### **1. Timing Adjustments**
```javascript
// Faster animation
startTime: 1.0, endTime: 1.2  // 0.2 seconds

// Slower animation
startTime: 2.0, endTime: 4.0  // 2.0 seconds

// Delayed start
startTime: 5.0, endTime: 5.5  // Starts at 5 seconds
```

#### **2. Rotation Customization**
```javascript
// Different angles
angle: Math.PI / 4      // 45 degrees
angle: Math.PI          // 180 degrees
angle: -Math.PI / 3     // -60 degrees

// Different axes
axis: "x"  // Rotate around X-axis
axis: "y"  // Rotate around Y-axis
axis: "z"  // Rotate around Z-axis
```

#### **3. Pivot Point Customization**
```javascript
// For left-hinged doors
createMultiMeshGroup(meshes, "GroupName", "left-center")

// For right-hinged doors
createMultiMeshGroup(meshes, "GroupName", "right-top")

// For center rotation
createMultiMeshGroup(meshes, "GroupName", "center")
```

## 🔗 **Integration với Theatre.js**

### **Timeline Synchronization**
```javascript
const sheet = useCurrentSheet();
const position = sheet.sequence.position;  // Current timeline position

// Animation active check
const isActive = position >= seq.startTime && position <= seq.endTime;
```

### **Progress Calculation**
```javascript
const progress = Math.max(0, Math.min(1, 
  (position - seq.startTime) / (seq.endTime - seq.startTime)
));
```

## 🐛 **Troubleshooting**

### **Common Issues**

#### **1. Door not animating**
```javascript
// Debug checks
console.log('Mesh dictionary:', meshDictionary.current);
console.log('Mesh refs:', Array.from(meshRefs.current.keys()));
console.log('Timeline position:', sheet.sequence.position);
console.log('Animation sequences:', animationSequences);
```

#### **2. Wrong pivot point**
```javascript
// Debug bounding box
const boundingBox = new Box3();
meshes.forEach(mesh => {
  mesh.updateWorldMatrix(true, false);
  boundingBox.expandByObject(mesh);
});
console.log('Bounding box:', boundingBox);
console.log('Calculated pivot:', calculatePivotPoint(boundingBox, pivotType));
```

#### **3. Group creation fails**
```javascript
// Check mesh existence
const meshes = meshNames.map(name => {
  const mesh = meshDictionary.current[name];
  if (!mesh) console.warn(`Mesh not found: ${name}`);
  return mesh;
}).filter(Boolean);

console.log(`Found ${meshes.length}/${meshNames.length} meshes`);
```

#### **4. Performance issues**
```javascript
// Monitor animation performance
console.log('Active animations:', 
  animationSequences.filter(seq => 
    position >= seq.startTime && position <= seq.endTime
  ).length
);
```

### **Debug Commands**
```javascript
// List all meshes trong scene
scene.traverse(obj => {
  if (obj.isMesh) console.log('Mesh:', obj.name);
});

// Check registered groups
console.log('Registered targets:', Array.from(meshRefs.current.keys()));

// Monitor timeline
console.log('Timeline position:', sheet?.sequence?.position);

// Check original rotations
console.log('Original rotations:', originalRotations.current);
```

## 📊 **Current Status**

### ✅ **Completed Features**
- [x] Theatre.js timeline integration
- [x] 7 sequential door animations
- [x] Multi-mesh group support
- [x] Flexible pivot point system
- [x] Performance-optimized animation loop
- [x] Sine easing cho smooth transitions
- [x] Sequential animations trên same target
- [x] Proper cleanup và memory management
- [x] Configurable animation parameters
- [x] Debug utilities và troubleshooting

### 🔄 **Current Implementation**
- ✅ Real mesh names từ 3D model
- ✅ Optimized group creation với bounding box pivots
- ✅ Single useFrame loop cho all animations
- ✅ Map-based state management
- ✅ Proper mesh attachment và positioning
- ✅ Cleanup functions cho memory management

### 📋 **Future Enhancements**
1. **More Animation Types**: Scale, translate animations
2. **Advanced Easing**: Custom easing functions
3. **Animation Events**: Callbacks cho animation start/end
4. **Visual Debug Mode**: Show pivot points và bounding boxes
5. **Animation Presets**: Common door animation patterns
6. **Performance Metrics**: FPS monitoring cho animations
7. **Interactive Controls**: Manual door control outside timeline
8. **Sound Integration**: Audio cues cho door animations

## 📚 **Best Practices**

### **1. Performance**
- Sử dụng mesh dictionary thay vì scene.getObjectByName()
- Batch animations trong single useFrame loop
- Cleanup groups properly trong useEffect return
- Avoid creating objects trong animation loop

### **2. Pivot Points**
- Test pivot points với actual 3D model
- Use appropriate pivot type cho door hinge location
- Verify bounding box calculations
- Consider door opening direction

### **3. Timing**
- Leave gaps giữa sequential animations
- Use consistent durations cho similar doors
- Test timing với actual timeline playback
- Consider animation overlap effects

### **4. Code Organization**
- Group related mesh names trong DOOR_CONFIG
- Use descriptive IDs cho animation sequences
- Implement proper error handling
- Document custom pivot types và use cases