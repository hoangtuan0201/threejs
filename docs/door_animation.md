# Door Animation System

## Overview

The Door Animation System provides smooth, timeline-based door animations for the 3D house model. It supports both individual mesh animations and grouped mesh animations with pivot-based rotations, optimized for high performance.

## Features

- **7 Door Animations**: Sequential door opening/closing animations
- **Group-based Animation**: Multiple meshes animated as single units
- **Pivot-based Rotation**: Realistic door hinge behavior at bounding box edges
- **Performance Optimized**: Single-loop processing with sequence dictionary
- **Timeline Integration**: Synchronized with Theatre.js timeline
- **Sequential Animations**: Multiple animations on same door/group
- **Memory Efficient**: Pre-computed sequence grouping and mesh references

## Architecture

### Core Components

```javascript
export function DoorAnimation() {
  const meshRefs = useRef(new Map());           // Mesh/Group references
  const originalRotations = useRef(new Map());  // Original rotation states
  const animatingStates = useRef(new Map());    // Animation state tracking
  const sequencesByTarget = useRef(new Map());  // Performance: Group sequences by target
  const activeMeshes = useRef(new Set());       // Track only animating meshes
}
```

### Animation Sequence Structure

```javascript
{
  name: "First Door",
  meshName: "Geom3D__285",     // Target mesh or group name
  startTime: 0.25,             // Timeline start (seconds)
  endTime: 0.6,                // Timeline end (seconds)
  action: "rotate",            // Animation type
  rotationAxis: "z",           // x, y, or z axis
  rotationAngle: Math.PI / 2   // Rotation angle in radians
}
```

## Door Configurations

### Individual Doors

| Door | Target | Timeline | Axis | Angle | Description |
|------|--------|----------|------|-------|-------------|
| 1st | `Geom3D__285` | 0.25s - 0.6s | Z | +90° | Front door open |
| 2nd | `Geom3D__69` | 3.0s - 5.0s | Z | -90° | Side door open |
| 7th | `Geom3D__285` | 9.8s - 10.5s | Z | -90° | Front door close |

### Group Doors

#### Third Door Group
- **Target**: `ThirdDoorGroup`
- **Meshes**: `Geom3D__268`, `Geom3D__710`, `Geom3D__712`, `Geom3D__713`, `Geom3D__711`, `Geom3D__714`, `Geom3D__715`, `Geom3D__716`, `Geom3D__717`
- **Animations**:
  - 3rd Door: 6.2s - 6.7s, Y-axis, +90°
  - 6th Door: 9.0s - 9.5s, Y-axis, +90°

#### Fourth Door Group
- **Target**: `FourthDoorGroup`
- **Meshes**: `Geom3D_269`, `Geom3D_270`, `Geom3D_271`, `Geom3D_272`, `Geom3D_267`
- **Animations**:
  - 4th Door: 6.8s - 7.3s, Y-axis, -90°
  - 5th Door: 8.2s - 8.7s, Y-axis, +90°

## Technical Implementation

### Performance Optimizations

1. **Sequence Dictionary**: Pre-computed grouping by target for O(1) lookup
2. **Single Loop Processing**: One `meshRefs.forEach()` handles all animations
3. **Active Mesh Tracking**: Only process meshes that need animation
4. **Memory Efficiency**: Reuse rotation variables, minimal object creation

### Group Creation Algorithm

```javascript
const createDoorGroup = (meshNames, groupName) => {
  // 1. Find all meshes in scene
  const meshes = meshNames.map(name => findMesh(scene, name)).filter(Boolean);

  // 2. Calculate bounding box for pivot point
  const boundingBox = new Box3();
  meshes.forEach(mesh => {
    mesh.updateWorldMatrix(true, false);
    boundingBox.expandByObject(mesh);
  });

  // 3. Set pivot at door hinge (max bounds for left-hinged doors)
  const pivot = new Vector3(
    boundingBox.max.x,  // Left edge (hinge)
    boundingBox.max.y,  // Center Y
    boundingBox.max.z   // Center Z
  );

  // 4. Create group at pivot point
  const group = new Group();
  group.name = groupName;
  group.position.copy(pivot);

  // 5. Attach meshes and reposition relative to pivot
  meshes.forEach(mesh => {
    const worldPos = new Vector3();
    mesh.getWorldPosition(worldPos);

    scene.attach(mesh);  // Detach from current parent
    group.attach(mesh);  // Attach to group

    // Calculate local position relative to pivot
    const localPos = worldPos.clone().sub(pivot);
    mesh.position.copy(localPos);
  });

  scene.add(group);
  return group;
};
```

### Optimized Animation Processing

```javascript
useFrame(() => {
  if (!sheet?.sequence) return;
  const position = sheet.sequence.position;

  // Performance: Single loop through all registered meshes
  meshRefs.current.forEach((meshOrGroup, targetName) => {
    const sequences = sequencesByTarget.current.get(targetName);
    if (!sequences) return; // Skip if no sequences for this target

    const original = originalRotations.current.get(targetName);
    if (!original) return;

    // Handle multiple sequences for the same target
    let rotationX = original.x;
    let rotationY = original.y;
    let rotationZ = original.z;
    let hasActiveAnimation = false;

    // Process all sequences for this target
    sequences.forEach(seq => {
      const isInTimeRange = position >= seq.startTime && position <= seq.endTime;

      if (seq.action === "rotate" && isInTimeRange) {
        const progress = (position - seq.startTime) / (seq.endTime - seq.startTime);
        const smooth = Math.sin(progress * Math.PI / 2);
        const rotAmount = smooth * seq.rotationAngle;

        // Apply rotation based on axis
        if (seq.rotationAxis === "x") rotationX = original.x + rotAmount;
        if (seq.rotationAxis === "y") rotationY = original.y + rotAmount;
        if (seq.rotationAxis === "z") rotationZ = original.z + rotAmount;

        hasActiveAnimation = true;
      }
    });

    // Apply combined rotations to mesh/group
    const mesh = meshRefs.current.get(targetName);
    if (mesh) {
      mesh.rotation.set(rotationX, rotationY, rotationZ);

      // Update active meshes set for performance tracking
      if (hasActiveAnimation) {
        activeMeshes.current.add(targetName);
      } else {
        activeMeshes.current.delete(targetName);
      }
    }
  });
});
```

## Usage

### Adding New Door Animation

1. **Individual Mesh Animation**:
```javascript
{
  name: "New Door",
  meshName: "Geom3D__NewMesh",
  startTime: 5.0,
  endTime: 5.5,
  action: "rotate",
  rotationAxis: "y",
  rotationAngle: Math.PI / 2
}
```

2. **Group Animation**:
```javascript
// 1. Define mesh names
const newDoorMeshNames = ["Mesh1", "Mesh2", "Mesh3"];

// 2. Create group in useEffect
const newDoorGroup = createDoorGroup(newDoorMeshNames, "NewDoorGroup");

// 3. Add animation sequence
{
  name: "New Group Door",
  meshName: "NewDoorGroup",
  startTime: 6.0,
  endTime: 6.5,
  action: "rotate",
  rotationAxis: "z",
  rotationAngle: -Math.PI / 2
}
```

### Sequential Animations

For multiple animations on the same target:

```javascript
// Door opens then closes
[
  {
    name: "Door Open",
    meshName: "SameDoor",
    startTime: 1.0,
    endTime: 1.5,
    action: "rotate",
    rotationAxis: "z",
    rotationAngle: Math.PI / 2
  },
  {
    name: "Door Close",
    meshName: "SameDoor",
    startTime: 3.0,
    endTime: 3.5,
    action: "rotate",
    rotationAxis: "z",
    rotationAngle: -Math.PI / 2
  }
]
```

## Best Practices

1. **Performance**:
   - Use groups for multiple related meshes
   - Avoid overlapping animations on same target
   - Keep animation sequences sorted by startTime

2. **Pivot Points**:
   - Ensure pivot is at door hinge for realistic rotation
   - Use bounding box max values for left-hinged doors
   - Use bounding box min values for right-hinged doors

3. **Timing**:
   - Leave gaps between sequential animations for smooth transitions
   - Use consistent animation durations for similar doors
   - Test timing with actual 3D model

4. **Code Organization**:
   - Group related mesh names in arrays
   - Use descriptive names for sequences and groups
   - Implement proper cleanup in useEffect return

## Troubleshooting

### Common Issues

1. **Door not animating**:
   - Check mesh names exist in scene
   - Verify sequence is registered in `sequencesByTarget`
   - Ensure timeline position is within startTime-endTime range

2. **Wrong pivot point**:
   - Verify bounding box calculation
   - Check mesh world positions before grouping
   - Use scene.traverse() to debug mesh hierarchy

3. **Performance issues**:
   - Monitor `activeMeshes.current.size`
   - Check for memory leaks in animation states
   - Ensure single loop processing

4. **Group creation fails**:
   - Verify all mesh names exist
   - Check mesh parent-child relationships
   - Ensure meshes are not already grouped

### Debug Commands

```javascript
// Check registered targets
console.log('Registered targets:', Array.from(meshRefs.current.keys()));

// Monitor active animations
console.log('Active meshes:', Array.from(activeMeshes.current));

// Verify sequence grouping
console.log('Sequences by target:', sequencesByTarget.current);

// Check timeline position
console.log('Timeline position:', sheet.sequence.position);
```

## Version History

- **v2.1.0**: Performance optimization with sequence dictionary and single-loop processing
- **v2.0.3**: Added sequential animations and group support
- **v2.0.0**: Initial door animation system with Theatre.js integration
```