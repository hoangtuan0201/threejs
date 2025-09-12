# X-Ray Mode Feature Documentation

## 📋 **Tổng quan**
X-Ray Mode là tính năng cho phép người dùng xem xuyên qua cấu trúc tòa nhà để quan sát các hệ thống HVAC bên trong. Tính năng này cung cấp trải nghiệm 3D tương tác với khả năng điều hướng camera mượt mà và hiển thị thông tin chi tiết về từng thành phần HVAC.

## 🏗️ **Cấu trúc File**

### **File chính**
- **Main Component**: `src/pages/X-ray.jsx`
- **Route**: `/x-ray`
- **Component Name**: `XRayMode`

### **Sub-components**
```
src/components/XRayMode/
├── index.js              # Export barrel file
├── Hotspot.jsx           # Interactive hotspot component
├── CameraController.jsx  # Camera animation controller
├── BuildingModel.jsx     # 3D building model với X-ray effects
└── JEasings.jsx          # Animation easing utilities
```

### **Dependencies**
```javascript
import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import * as THREE from 'three';
import { Hotspot, CameraController, BuildingModel, HVAC_POSITIONS } from '../components/XRayMode';
```

## 🎯 **Các thành phần chính**

### **1. HVAC_POSITIONS Data Structure**
Định nghĩa vị trí và thông tin của 5 thành phần HVAC với camera positioning:

```javascript
const HVAC_POSITIONS = {
  FCU: { 
    position: [21.8, 5, -15], 
    rotation: [0, 0, 0], 
    label: 'Fan Coil Unit',
    cameraPosition: [22.8, 6, -14],
    cameraRotation: [0, 0, 0]
  },
  CDU: { 
    position: [23.2, 5.3, -20], 
    rotation: [0, 0, 0], 
    label: 'Condensing Unit',
    cameraPosition: [24.2, 6.3, -19],
    cameraRotation: [0, 0, 0]
  },
  Thermostat: { 
    position: [30.1, 5, -22], 
    rotation: [0, 0, 0], 
    label: 'Thermostat',
    cameraPosition: [31.1, 6, -21],
    cameraRotation: [0, 0, 0]
  },
  Grilles: { 
    position: [30.6, 7, -23], 
    rotation: [0, 0, 0], 
    label: 'Air Grilles',
    cameraPosition: [30.6, 7, -23],
    cameraRotation: [-3, 0, -3.14]
  },
  Ducts: { 
    position: [15, 5, -29.50], 
    rotation: [0, 0, 0], 
    label: 'Ductwork',
    cameraPosition: [16, 5, -28.5],
    cameraRotation: [-0.21, 0, 0]
  }
};
```

### **2. Hotspot Component**
**File**: `src/components/XRayMode/Hotspot.jsx`

**Features**:
- Hiển thị các điểm tương tác dạng hình cầu với HTML overlay
- Animation hover effects với pulse và ripple
- Thay đổi màu sắc khi được chọn (trắng → đỏ → xanh khi hover)
- Label hiển thị với backdrop blur effects
- Responsive design với pointer events

**Styling**:
```javascript
// Hotspot circle
width: '20px', height: '20px', borderRadius: '50%'
background: isActive ? '#ff6b6b' : hovered ? '#4fc3f7' : '#ffffff'
boxShadow: hovered ? 'glow effect' : 'standard shadow'
animation: hovered ? 'pulse 1.5s infinite' : 'none'

// Label
background: hovered ? 'rgba(79, 195, 247, 0.95)' : 'rgba(0, 0, 0, 0.8)'
backdropFilter: 'blur(10px)'
transition: 'all 0.3s ease'
```

### **3. CameraController Component**
**File**: `src/components/XRayMode/CameraController.jsx`

**Features**:
- Điều khiển animation camera khi click hotspot
- Sử dụng JEasings library cho smooth transitions
- Animation duration: 1500ms với Cubic.Out easing
- Tích hợp với OrbitControls cho target animation
- Real-time camera position tracking

**Animation Logic**:
```javascript
// Camera position animation
new JEASINGS.JEasing(camera.position)
  .to({
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z
  }, 1500)
  .easing(JEASINGS.Cubic.Out)
  .start();

// OrbitControls target animation
new JEASINGS.JEasing(orbitControlsRef.current.target)
  .to(newTarget, 1500)
  .easing(JEASINGS.Cubic.Out)
  .start()
  .onComplete(() => {
    setIsAnimating(false);
    if (onComplete) onComplete();
  });
```

### **4. BuildingModel Component**
**File**: `src/components/XRayMode/BuildingModel.jsx`

**Features**:
- Load model 3D từ `/3ddd.glb` với useGLTF
- Xử lý chế độ transparent (opacity 50%) cho X-ray effect
- Highlight thành phần được chọn với emissive glow
- Material management với original state preservation
- Model preloading cho performance

**X-Ray Implementation**:
```javascript
if (isXRayMode) {
  const newMaterial = child.userData.originalMaterial.clone();
  newMaterial.transparent = true;
  newMaterial.opacity = 0.5;
  newMaterial.alphaTest = 0;
  newMaterial.depthWrite = false;
  newMaterial.side = THREE.DoubleSide;
  newMaterial.needsUpdate = true;
  child.material = newMaterial;
  
  // Highlight specific component
  if (highlightedComponent && child.name.toLowerCase().includes(highlightedComponent.toLowerCase())) {
    child.material.emissive = new THREE.Color(0x00ff00);
    child.material.emissiveIntensity = 0.5;
    child.material.opacity = 1.0;
  }
}
```

## 🎮 **Tính năng chính**

### **1. Chế độ xem 3D**
**Canvas Configuration**:
```javascript
<Canvas
  style={{ width: '100%', height: '100%' }}
  camera={{
    position: [42.08, 8.38, -25.98],
    fov: 75
  }}
>
  <ambientLight intensity={0.6} />
  <directionalLight position={[10, 10, 5]} intensity={1} />
</Canvas>
```

**OrbitControls Setup**:
```javascript
<OrbitControls 
  ref={orbitControlsRef}
  enablePan={false}
  enableZoom={true}
  enableRotate={true}
  minDistance={1}
  maxDistance={20}
  target={[27.23, 0.00, -25.55]}
  mouseButtons={{
    LEFT: 0,    // Rotate with left mouse button
    MIDDLE: 1,  // Zoom with middle mouse button
    RIGHT: null // Disable right mouse button
  }}
/>
```

### **2. Hotspot tương tác**
- **5 hotspot** cho các thành phần HVAC (FCU, CDU, Thermostat, Grilles, Ducts)
- **Click interaction** để kích hoạt X-Ray mode
- **Smooth camera animation** bay đến thành phần được chọn
- **Dynamic visibility** - ẩn hotspot hiện tại khi đã active
- **Hover effects** với glow và animation

### **3. X-Ray Mode**
- **Building transparency**: Tòa nhà chuyển sang 50% opacity
- **Component highlighting**: Thành phần được chọn có emissive glow
- **Material preservation**: Lưu trữ original materials
- **Double-sided rendering**: Hiển thị cả hai mặt của surfaces
- **Depth write disabled**: Đảm bảo transparency hoạt động đúng

### **4. UI Controls**
**Header Controls**:
```javascript
// Toggle Hotspots Button
<Button
  variant="outlined"
  onClick={() => setShowHotspots(!showHotspots)}
  startIcon={showHotspots ? <VisibilityOff /> : <Visibility />}
>
  {showHotspots ? 'Hide' : 'Show'} Hotspots
</Button>

// Exit X-Ray Button (conditional)
{isXRayMode && (
  <Button
    variant="contained"
    onClick={handleExitXRay}
    sx={{ background: theme.gradients.accent }}
  >
    Exit X-Ray
  </Button>
)}

// Close Button
<IconButton onClick={handleExit}>
  <CloseIcon />
</IconButton>
```

## 🔄 **State Management**

### **Component States**
```javascript
const [isXRayMode, setIsXRayMode] = useState(false);
const [activeComponent, setActiveComponent] = useState(null);
const [cameraTarget, setCameraTarget] = useState(null);
const [showHotspots, setShowHotspots] = useState(true);
const [currentCameraPos, setCurrentCameraPos] = useState({ x: 42.08, y: 8.38, z: -25.98 });
const [currentCameraRot, setCurrentCameraRot] = useState({ x: 0, y: 0, z: 0 });
const orbitControlsRef = useRef();
```

### **Event Handlers**
```javascript
// Hotspot click handler
const handleHotspotClick = (componentKey) => {
  const component = HVAC_POSITIONS[componentKey];
  setActiveComponent(componentKey);
  setIsXRayMode(true);
  
  const cameraPos = component.cameraPosition;
  const targetPos = new THREE.Vector3(
    cameraPos[0],
    cameraPos[1],
    cameraPos[2]
  );
  setCameraTarget(targetPos);
};

// Exit X-Ray handler
const handleExitXRay = () => {
  setIsXRayMode(false);
  setActiveComponent(null);
  setCameraTarget(new THREE.Vector3(43, 8, -25.98));
};

// Navigation handler
const handleExit = () => {
  navigate('/');
};
```

## 🎨 **UI/UX Design**

### **Theme Integration**
```javascript
const { theme } = useTheme();

// Background styling
background: theme.colors.background.primary

// Component Info Panel
background: theme.colors.background.overlay
backdropFilter: 'blur(10px)'
border: `1px solid ${theme.colors.border.light}`

// Instructions Panel
background: theme.colors.background.overlay
backdropFilter: 'blur(10px)'
borderRadius: 2
```

### **Responsive Panels**
**Component Info Panel** (bottom overlay):
- Hiển thị khi có activeComponent
- Glass morphism design với backdrop blur
- Component label và description
- Full-width responsive layout

**Instructions Panel** (left side):
- Hiển thị khi không ở X-Ray mode
- Hướng dẫn sử dụng cho người dùng
- Fixed position với transform centering
- Max-width 300px cho readability

### **Debug Panel** (commented out):
- Real-time camera position và rotation
- Component position tracking
- Monospace font cho technical data
- Toggle-able cho development

## 🚀 **Workflow & User Journey**

### **1. Khởi tạo**
- Load 3D building model từ `/3ddd.glb`
- Hiển thị 5 hotspot tại vị trí HVAC components
- Camera positioned tại [42.08, 8.38, -25.98]
- Instructions panel hiển thị hướng dẫn

### **2. Hotspot Interaction**
- User hover: Hotspot glow effect và label highlight
- User click: 
  - Kích hoạt X-Ray mode (`setIsXRayMode(true)`)
  - Set active component (`setActiveComponent(componentKey)`)
  - Camera animation đến vị trí component
  - Building chuyển transparent
  - Component info panel xuất hiện

### **3. X-Ray Mode**
- Building materials: 50% opacity với double-sided rendering
- Active component: Emissive green glow với full opacity
- Camera: Smooth animation đến optimal viewing position
- UI: Exit X-Ray button xuất hiện
- Hotspots: Active hotspot bị ẩn, others vẫn visible

### **4. Exit Workflow**
- **Exit X-Ray**: Reset về normal mode, camera về initial position
- **Toggle Hotspots**: Show/hide tất cả hotspots
- **Close**: Navigate về homepage (`navigate('/')`)

## 📱 **Responsive Design**

### **Layout Adaptations**
```javascript
// Header controls
top: 20, left: 20, right: 300
display: 'flex', justifyContent: 'space-between'

// Component info panel
bottom: 20, left: 20, right: 20
responsive padding và typography

// Instructions panel
top: '50%', left: 20
transform: 'translateY(-50%)'
maxWidth: 300
```

### **Touch Interactions**
- **OrbitControls**: Touch-enabled rotation và zoom
- **Hotspots**: Touch-friendly với pointer events
- **Buttons**: Material-UI touch targets
- **Panels**: Touch-scrollable content

## ⚡ **Performance Optimizations**

### **Model Loading**
```javascript
// Preload model
useGLTF.preload('/3ddd.glb');

// Clone scene for safe manipulation
<primitive ref={modelRef} object={scene.clone()} />
```

### **Material Management**
```javascript
// Store original materials
if (!child.userData.originalMaterial) {
  child.userData.originalMaterial = child.material.clone();
}

// Efficient material updates
newMaterial.needsUpdate = true;
```

### **Animation Performance**
- **JEasings**: Hardware-accelerated animations
- **useFrame**: Optimized render loop
- **Conditional rendering**: Hotspots chỉ render khi cần
- **State batching**: Minimize re-renders

## 🔧 **Technical Specifications**

### **3D Rendering**
- **Engine**: React Three Fiber (R3F)
- **Model Format**: GLB với useGLTF hook
- **Lighting**: Ambient (0.6) + Directional (1.0)
- **Controls**: OrbitControls với custom mouse buttons
- **Camera**: Perspective với 75° FOV

### **Animation System**
- **Library**: JEasings cho smooth transitions
- **Duration**: 1500ms cho camera movements
- **Easing**: Cubic.Out cho natural motion
- **Interpolation**: Linear cho position, rotation

### **Material System**
- **Transparency**: Alpha blending với depth sorting
- **Emissive**: Green glow cho highlighted components
- **Double-sided**: Proper interior visibility
- **State preservation**: Original material backup

## 🔗 **Router Integration**

### **AppRouter.jsx**
```javascript
import XRayMode from '../pages/X-ray';

<Route path="/x-ray" element={<XRayMode />} />
```

### **Homepage Navigation**
```javascript
// Homepage.jsx button
<Button
  variant="outlined"
  onClick={() => navigate('/x-ray')}
>
  X-Ray Mode
</Button>
```

### **Direct Access**
- **URL**: `http://localhost:5175/x-ray`
- **Navigation**: Programmatic với `useNavigate`
- **Back Navigation**: `navigate('/')` về homepage

## 🛠️ **Development Guidelines**

### **Adding New HVAC Components**
1. **Update HVAC_POSITIONS** với new component data:
   ```javascript
   NewComponent: {
     position: [x, y, z],
     rotation: [rx, ry, rz],
     label: 'Component Name',
     cameraPosition: [cx, cy, cz],
     cameraRotation: [crx, cry, crz]
   }
   ```

2. **Test camera positioning** để đảm bảo optimal viewing angle
3. **Verify model naming** cho highlighting functionality
4. **Update documentation** với new component info

### **Customizing Animations**
```javascript
// Adjust animation duration
.to(targetPosition, 2000) // 2 seconds instead of 1.5

// Change easing function
.easing(JEASINGS.Bounce.Out) // Different easing

// Add animation callbacks
.onUpdate((progress) => console.log(progress))
.onComplete(() => console.log('Animation done'))
```

### **Styling Modifications**
```javascript
// Hotspot appearance
width: '24px', height: '24px' // Larger hotspots
background: '#custom-color'   // Custom colors

// Panel styling
background: 'custom-gradient'
borderRadius: 'custom-radius'
backdropFilter: 'blur(custom-px)'
```

## 🐛 **Troubleshooting**

### **Model Loading Issues**
- **Check file path**: Verify `/3ddd.glb` exists trong public folder
- **Model format**: Ensure GLB format compatibility
- **File size**: Large models có thể cause loading delays
- **Console errors**: Check browser console cho GLTF errors

### **Performance Issues**
- **Reduce hotspot count**: Fewer hotspots = better performance
- **Optimize model**: Compress geometry và textures
- **Adjust render settings**: Lower quality cho mobile devices
- **Memory management**: Check for material leaks

### **Camera Animation Problems**
- **Target position calculation**: Verify HVAC_POSITIONS coordinates
- **Animation duration**: Adjust timing cho smoother motion
- **OrbitControls conflicts**: Ensure proper ref handling
- **useFrame implementation**: Check animation loop logic

### **X-Ray Mode Issues**
- **Material transparency**: Verify alpha blending settings
- **Depth sorting**: Check depthWrite và alphaTest values
- **Component highlighting**: Ensure proper name matching
- **Original material restoration**: Verify backup/restore logic

## 📊 **Current Status**

### ✅ **Completed Features**
- [x] React Three Fiber 3D integration
- [x] 5 HVAC component hotspots
- [x] Smooth camera animations với JEasings
- [x] X-Ray transparency effects
- [x] Component highlighting system
- [x] Material-UI responsive design
- [x] Theme context integration
- [x] Router-based navigation
- [x] Performance optimizations
- [x] Touch-friendly interactions

### 🔄 **Current Implementation**
- ✅ Real GLB model loading (`/3ddd.glb`)
- ✅ Interactive hotspot system
- ✅ Smooth camera transitions
- ✅ X-Ray transparency với highlighting
- ✅ Responsive UI panels
- ✅ Debug information tracking

### 📋 **Future Enhancements**
1. **More HVAC Components**: Expand beyond current 5 components
2. **Interactive Controls**: User-controlled model rotation
3. **Component Details**: Expandable technical specifications
4. **Animation Sequences**: Automated component tours
5. **VR/AR Support**: Immersive viewing experiences
6. **Performance Metrics**: Real-time FPS và memory monitoring
7. **Mobile Optimizations**: Touch gesture improvements
8. **Accessibility**: Screen reader support và keyboard navigation