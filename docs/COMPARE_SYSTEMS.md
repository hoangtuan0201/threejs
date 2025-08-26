# Compare Systems Page Documentation

## 📋 **Overview**
Trang Compare Systems được thiết kế để so sánh AirSmart với Traditional Systems, sử dụng React Three Fiber để hiển thị 3D models thực tế và Material-UI cho responsive design.

## 🎨 **Design System**

### **Theme Integration**
- **Dark Mode**: `linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)`
- **Light Mode**: `#ffffff` background
- **Dynamic Theme**: Sử dụng `useTheme()` context cho theme switching
- **Gradient Animation**: `gradientShift` keyframe với 15s duration
- **Background Effects**: Multiple radial gradients cho depth

### **Color Scheme**
- **AirSmart Cards**: Blue gradient `rgba(59, 130, 246, 0.12)` với blue borders
- **Traditional Cards**: Red gradient `rgba(239, 68, 68, 0.12)` với red borders
- **Text Colors**: Dynamic dựa trên theme context
- **Accent Colors**: Blue (#3b82f6) cho AirSmart, Red (#ef4444) cho Traditional

### **Typography & Effects**
- **Hero Title**: Shimmer animation với gradient text
- **Cards**: Glass morphism với `backdrop-filter: blur(20px)`
- **Buttons**: Material-UI styled với hover effects
- **3D Models**: Real GLB models với React Three Fiber

## 🏗️ **Component Structure**

### **File Location**
```
src/pages/CompareSystem.jsx
```

### **Main Components**
1. **Header Navigation** - ColorModeSelect + Back button
2. **Loading Screen** - Custom LoadingScreen với progress tracking
3. **Comparison Slides** - 7 different product comparisons
4. **3D Model Viewer** - React Three Fiber Canvas với real GLB models
5. **Navigation Controls** - Arrow buttons cho slide navigation

### **Dependencies**
```javascript
import { useState, useEffect, Suspense } from "react";
import { Box, Typography, Button, Container, Card, CardContent, IconButton } from "@mui/material";
import { keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { useProgress, OrbitControls, useGLTF } from "@react-three/drei";
import LoadingScreen from "../components/LoadingScreen";
import { useTheme } from "../theme/ThemeContext";
import ColorModeSelect from "../theme/ColorModeSelect.jsx";
```

## 🎯 **Features**

### **Comparison Data Structure**
```javascript
const comparisonData = [
  {
    id: 1,
    title: "Thermostat",
    airsmart: {
      title: "AIRSMART THERMOSTAT",
      modelPath: "/Monitor002.glb",
      dimensions: "4\" x 4\" x 1\"",
      features: "AI-powered learning algorithms, 7\" touch display, voice control integration, smartphone app, energy optimization",
      benefits: "30% energy savings, predictive climate control"
    },
    traditional: {
      title: "TRADITIONAL THERMOSTAT",
      modelPath: "/Monitor001.glb",
      dimensions: "5\" x 3\" x 2\"",
      features: "Manual controls, basic 7-day programming, simple LCD display",
      limitations: "No learning capability, limited scheduling options"
    }
  },
  // ... 6 more comparison items
];
```

### **7 Product Comparisons**
1. **Thermostat** - Smart vs Traditional thermostats
2. **Air Purification** - HEPA + UV-C vs Basic mechanical filtration
3. **Linear Grille** - Smart airflow control vs Fixed direction
4. **Round Grille** - 360-degree control vs Fixed louvers
5. **Outdoor Unit** - Variable speed vs Single speed compressor
6. **Indoor Unit** - Variable airflow vs Fixed speed fan
7. **Smart Flow Duct** - Small diameter intelligent vs Traditional large ductwork

### **3D Model Integration**
```javascript
function RotatingModel({ modelPath, scale = 1 }) {
  const { scene } = useGLTF(modelPath);

  return (
    <primitive
      object={scene}
      scale={[scale, scale, scale]}
      position={[0, -1, 0]}
      rotation={[0, 0, 0]}
    />
  );
}
```

### **Canvas Setup**
```javascript
<Canvas
  camera={{ position: [0, 1.5, 8], fov: 45 }}
  style={{ width: "100%", height: "100%" }}
>
  <ambientLight intensity={0.6} />
  <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
  <directionalLight position={[-10, -10, -5]} intensity={0.8} />
  <directionalLight position={[0, 10, 10]} intensity={0.8} />
  <pointLight position={[0, 10, 0]} intensity={0.7} />
  <pointLight position={[5, 0, 5]} intensity={0.5} />
  <pointLight position={[-5, 0, -5]} intensity={0.5} />
  <Suspense fallback={null}>
    <RotatingModel modelPath={currentData.airsmart.modelPath} scale={1.5} />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
  </Suspense>
</Canvas>
```

## 🎮 **User Interactions**

### **Navigation Controls**
```javascript
const nextSlide = () => {
  setCurrentSlide((prev) => Math.min(prev + 1, comparisonData.length - 1));
};

const prevSlide = () => {
  setCurrentSlide((prev) => Math.max(prev - 1, 0));
};
```

### **Responsive Navigation**
- **Desktop**: Arrow buttons positioned outside cards
- **Mobile**: Arrow buttons positioned at top của comparison section
- **Disabled States**: Arrows disabled ở first/last slides
- **Back Navigation**: `navigate("/")` về homepage

### **Loading System**
```javascript
const { progress: assetProgress } = useProgress();
const [displayProgress, setDisplayProgress] = useState(0);
const [isLoading, setIsLoading] = useState(true);

// Smooth progress updates
useEffect(() => {
  if (assetProgress > displayProgress) {
    const increment = Math.min(assetProgress - displayProgress, 5);
    const timer = setTimeout(() => {
      setDisplayProgress(prev => Math.min(prev + increment, assetProgress));
    }, 50);
    return () => clearTimeout(timer);
  }
}, [assetProgress, displayProgress]);
```

## 🔄 **State Management**

### **Router Integration**
```javascript
// AppRouter.jsx
<Route path="/compare" element={<CompareSystem />} />

// Navigation
const navigate = useNavigate();
const handleBackClick = () => navigate("/");
```

### **Component States**
```javascript
const [isVisible, setIsVisible] = useState(false);
const [currentSlide, setCurrentSlide] = useState(0);
const [isLoading, setIsLoading] = useState(true);
const [isModelLoading, setIsModelLoading] = useState(false);
```

### **Theme Context**
```javascript
const { theme } = useTheme();

// Dynamic styling based on theme
background: theme.isDark
  ? 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)'
  : '#ffffff'
```

## 🎨 **Animation System**

### **Keyframes**
```javascript
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
```

### **Transition Effects**
- **Page Entry**: `fadeInUp` với 1s cubic-bezier easing
- **Card Hover**: `translateY(-4px)` với enhanced shadows
- **Button Hover**: Color transitions với backdrop effects
- **Loading Spinner**: `spin` animation cho model loading states

## 📱 **Responsive Design**

### **Breakpoints (Material-UI)**
- **xs**: 0px - 600px (Mobile)
- **sm**: 600px - 960px (Tablet)
- **md**: 960px - 1280px (Desktop)
- **lg**: 1280px+ (Large Desktop)

### **Layout Adaptations**
```javascript
// Mobile: Stacked layout
flexDirection: { xs: "column", md: "row" }

// Desktop: Side-by-side
gap: { xs: 3, sm: 4, md: 6 }

// Typography scaling
fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem", lg: "3.2rem" }

// Padding adjustments
p: { xs: 2.5, sm: 3.5, md: 4.5 }
```

### **Mobile Optimizations**
- **Touch-friendly**: 44px minimum touch targets
- **Simplified Navigation**: Top-positioned arrows
- **Optimized Typography**: Smaller font sizes
- **Reduced Animations**: Performance considerations

## 🎯 **Performance Optimizations**

### **3D Model Loading**
```javascript
// Suspense fallback với loading spinner
<Suspense fallback={
  <Box sx={{ /* Loading spinner styles */ }}>
    <Box sx={{ /* Spinning animation */ }} />
  </Box>
}>
  <RotatingModel modelPath={modelPath} scale={1.5} />
</Suspense>
```

### **Progress Tracking**
```javascript
// Drei progress hook integration
const { progress: assetProgress } = useProgress();

// Custom LoadingScreen component
<LoadingScreen
  text="Loading Comparison Models..."
  variant="compare"
  progress={displayProgress >= 100 ? 1 : displayProgress / 100}
/>
```

### **Memory Management**
```javascript
// Cleanup on unmount
useEffect(() => {
  return () => {
    setDisplayProgress(0);
    if (window.__drei_progress_cache) {
      window.__drei_progress_cache = null;
    }
  };
}, []);
```

## 🚀 **Technical Specifications**

### **3D Rendering**
- **Engine**: React Three Fiber (R3F)
- **Models**: GLB format với useGLTF hook
- **Lighting**: Multiple directional + point lights
- **Controls**: OrbitControls với auto-rotation
- **Camera**: Perspective camera với 45° FOV

### **Material-UI Integration**
- **Components**: Box, Typography, Button, Container, Card, IconButton
- **Styling**: sx prop với responsive values
- **Theme**: Custom theme context integration
- **Icons**: Material Icons cho navigation arrows

### **Performance Metrics**
- **Loading Time**: 2s simulated loading + actual asset loading
- **3D Rendering**: 60fps target với optimized lighting
- **Memory Usage**: Efficient model loading với cleanup
- **Bundle Size**: Optimized với code splitting

## 🔧 **Development Guidelines**

### **Adding New Comparisons**
1. **Update comparisonData array** với new comparison object
2. **Add GLB models** to public directory
3. **Test responsive layout** across breakpoints
4. **Verify loading performance** với new assets

### **Model Requirements**
- **Format**: GLB (preferred) hoặc GLTF
- **Size**: < 5MB per model cho performance
- **Optimization**: Compressed textures và geometry
- **Positioning**: Models should be centered at origin

### **Styling Guidelines**
- **Use theme context** cho consistent colors
- **Responsive values** trong sx props
- **Consistent spacing** với theme spacing system
- **Accessibility**: Proper contrast ratios và touch targets

## 🎯 **Current Status**

### ✅ **Completed Features**
- [x] React Three Fiber 3D model integration
- [x] 7 comprehensive product comparisons
- [x] Responsive design với Material-UI
- [x] Theme context integration (dark/light mode)
- [x] Loading system với progress tracking
- [x] Smooth animations và transitions
- [x] Router-based navigation
- [x] Performance optimizations

### 🔄 **Current Implementation**
- ✅ Real GLB models (Monitor001.glb, Monitor002.glb)
- ✅ Auto-rotating 3D viewers
- ✅ Comprehensive comparison data
- ✅ Mobile-optimized navigation
- ✅ Loading states với progress indicators

### 📋 **Future Enhancements**
1. **Model Diversity**: Unique 3D models cho each product type
2. **Interactive Controls**: User-controlled model rotation
3. **Detailed Specs**: Expandable technical specifications
4. **Performance Charts**: Visual data comparisons
5. **Animation Sequences**: Product demonstration animations

## 🎨 **Design Consistency**

### **Theme Integration**
- ✅ Dynamic theme switching với useTheme context
- ✅ Consistent color palette across light/dark modes
- ✅ Material-UI component integration
- ✅ Responsive typography system
- ✅ Consistent spacing và layout patterns

### **Brand Consistency**
- **Logo**: AirSmart branding trong header
- **Colors**: Blue/Red accent system cho product differentiation
- **Typography**: Consistent font hierarchy
- **Animations**: Smooth transitions matching app standards
- **Layout**: Grid-based responsive design system
