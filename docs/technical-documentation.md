# Technical Documentation - AirSmart 3D Experience

## Overview

This document provides detailed technical documentation for the core components of the AirSmart 3D Interactive Experience application. The application is built using React, Three.js, and various supporting libraries to create an immersive 3D visualization of HVAC systems.

---

## 1. Scene.jsx (`/src/components/Scene.jsx`)

### Purpose
The Scene component is the core 3D rendering engine that manages the entire Three.js scene, camera controls, user interactions, and visual effects. It serves as the main orchestrator for all 3D elements and user interactions within the application.

### Key Features
- **3D Scene Management**: Handles all Three.js objects, lighting, and rendering
- **User Interaction**: Manages mouse/touch controls, hotspot interactions, and navigation
- **Animation Control**: Integrates with Theatre.js for cinematic camera movements
- **Path Tracing**: Implements GPU-accelerated path tracing for photorealistic rendering
- **Responsive Design**: Adapts to different screen sizes and device capabilities

### Key Components and Functions

#### State Management
```javascript
const [selectedHotspot, setSelectedHotspot] = useState(null);
const [showVideoScreen, setShowVideoScreen] = useState(null);
const [orbitControlEnabled, setOrbitControlEnabled] = useState(false);
const [pathTracingEnabled, setPathTracingEnabled] = useState(false);
```

#### Core Functions
- **`resetView()`**: Resets camera position, sequence position, and all interactive states
- **`captureCurrentCameraState()`**: Captures current camera and sequence state for restoration
- **`handleChapterNavigation()`**: Manages smooth transitions between different scene chapters
- **`handleWheel()` / `handleTouchMove()`**: Processes user input for scene navigation

#### Path Tracing Implementation
- Uses WebGLPathTracer for photorealistic rendering
- Adaptive quality settings based on device capabilities
- Real-time progress tracking and performance optimization

### Dependencies
- **Three.js**: Core 3D rendering engine
- **@react-three/fiber**: React integration for Three.js
- **@react-three/drei**: Additional Three.js utilities
- **@theatre/r3f**: Animation system integration
- **three-gpu-pathtracer**: Advanced rendering capabilities

### Key Integrations
- **Model.jsx**: Renders the main 3D model
- **Hotspot.jsx**: Manages interactive hotspots
- **VideoScreen.jsx**: Displays video content in 3D space
- **DoorAnimation.jsx**: Controls animated door sequences
- **HDREnvironment.jsx**: Manages lighting and environment

### Usage Example
```javascript
<Scene
  onTourEnd={endTour}
  onModelLoaded={handleModelLoaded}
  onPositionChange={setCurrentSequencePosition}
  isNavigating={sceneLocked}
  scrollSensitivity={scrollSensitivity}
  navigationData={navigationData}
/>
```

---

## 2. Data Folder (`/src/data/`)

### Purpose
Contains static configuration data that defines the 3D scene structure, hotspot positions, animations, and interactive elements.

### Files Overview

#### `sequenceChapters.js`
**Purpose**: Defines the main sequence of interactive hotspots and their properties

**Structure**:
```javascript
export const sequenceChapters = [
  {
    id: "unique-identifier",
    position: 1.5, // Timeline position
    hotspot: {
      position: [x, y, z], // 3D coordinates
      rotation: [rx, ry, rz], // Rotation angles
      title: "Component Name",
      description: "Detailed description",
      link: "video-url"
    },
    videoScreen: {
      position: [x, y, z],
      videoId: "video-url",
      size: { width: 320, height: 180 }
    }
  }
];
```

**Key Properties**:
- **Position**: Timeline position for sequence navigation
- **Hotspot**: Interactive point configuration
- **VideoScreen**: Associated video display settings
- **Mobile Support**: Separate positioning for mobile devices

#### `sequenceChaptersXray.js`
**Purpose**: X-ray mode specific hotspot configurations
- Similar structure to main sequence
- Optimized for transparent/wireframe viewing
- Different positioning for internal component visibility

#### `sequenceHiddenMeshes.js`
**Purpose**: Defines which 3D meshes to hide when specific hotspots are activated

**Structure**:
```javascript
export const sequenceHiddenMeshes = {
  "hotspot-id": {
    hiddenMeshes: ["mesh-name-1", "mesh-name-2"],
    transitionDuration: 400,
    opacity: 0.1,
    hiddenMaterials: []
  }
};
```

### Usage in Application
- **Scene.jsx**: Reads hotspot data for rendering
- **Hotspot.jsx**: Uses position and interaction data
- **SequenceMeshController.jsx**: Applies mesh visibility rules
- **ChapterNavigation.jsx**: Creates navigation interface

---

## 3. App.jsx (`/src/App.jsx`)

### Purpose
The main application component that orchestrates the entire 3D experience, manages global state, handles loading sequences, and coordinates between different UI components.

### Key Features
- **Theatre.js Integration**: Manages animation project and sheets
- **Loading Management**: Handles asset loading with progress tracking
- **Scene Lock System**: Controls navigation and user interactions
- **Mobile Responsiveness**: Adapts interface for different devices
- **State Coordination**: Manages communication between components

### Key State Variables
```javascript
const [isLoading, setIsLoading] = useState(true);
const [modelLoaded, setModelLoaded] = useState(false);
const [currentSequencePosition, setCurrentSequencePosition] = useState(0);
const [scrollSensitivity, setScrollSensitivity] = useState(1.0);
const [selectedHotspot, setSelectedHotspot] = useState(null);
```

### Core Functions
- **`handleChapterNavigation()`**: Manages smooth scene transitions
- **`handleModelLoaded()`**: Coordinates loading completion
- **`handleGoHome()`**: Navigation back to homepage
- **`endTour()`**: Cleanup and state reset

### Canvas Configuration
```javascript
<Canvas
  shadows
  dpr={[1, 1.5]}
  camera={{
    position: mobile.getCameraPosition(),
    fov: mobile.getCameraFOV(),
    near: 0.1,
    far: 1000
  }}
  gl={{
    preserveDrawingBuffer: true,
    antialias: true,
    powerPreference: "high-performance"
  }}
/>
```

### Dependencies
- **React Three Fiber**: 3D rendering integration
- **Theatre.js**: Animation system
- **Material-UI**: UI components
- **Custom Hooks**: Mobile detection, scene locking

### Component Hierarchy
```
App
├── LoadingScreen
├── Canvas
│   └── SceneManager
├── ChapterNavigation
├── ScrollSensitivityControl
├── MobileHomeButton
└── NavigationGuide
```

---

## 4. Model.jsx (`/src/components/Model.jsx`)

### Purpose
Handles loading, processing, and enhancement of the main 3D model (GLB file). Applies realistic materials, lighting, and performance optimizations.

### Key Features
- **GLB Model Loading**: Uses useGLTF hook for efficient loading
- **Material Enhancement**: Converts materials to PBR (Physically Based Rendering)
- **Performance Optimization**: Implements LOD and culling strategies
- **Shadow Configuration**: Sets up realistic shadow casting/receiving
- **Mesh Visibility Control**: Integrates with sequence controller

### Material Enhancement Process
```javascript
const toPhysicalMaterial = (src) => {
  const params = {
    metalness: Math.max(src.metalness, 0.7),
    roughness: Math.max(src.roughness * 0.4, 0.01),
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.2,
    ior: 1.3
  };
  return new THREE.MeshPhysicalMaterial(params);
};
```

### Key Functions
- **`enhanceMaterial()`**: Applies realistic PBR properties
- **`toPhysicalMaterial()`**: Converts standard to physical materials
- **Model traversal**: Processes all meshes for optimization

### Dependencies
- **@react-three/drei**: useGLTF hook
- **Three.js**: Material and geometry processing
- **RenderingOptimizer**: Performance enhancement utilities
- **SequenceMeshController**: Visibility management

### Integration Points
- **Scene.jsx**: Receives model loaded callbacks
- **SequenceMeshController**: Controls mesh visibility
- **HDREnvironment**: Applies environment mapping

---

## 5. zendeskService.js (`/src/services/zendeskService.js`)

### Purpose
Provides API integration for creating support tickets through Zendesk. Handles both text-only and file attachment submissions via a backend proxy.

### Key Features
- **Proxy Integration**: Routes requests through backend API
- **File Upload Support**: Handles PDF and other file attachments
- **Flexible Input**: Supports multiple parameter formats
- **Error Handling**: Comprehensive error management

### Main Function
```javascript
export async function createZendeskTicket({
  name, email, subject, comment, 
  requester, attachment, body, file 
}) {
  const apiUrl = 'https://api2.heartstribute.com/zendesk/ticket';
  
  if (attachment || file) {
    // FormData for file uploads
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('body', body);
    formData.append('file', attachment || file);
    
    return await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });
  } else {
    // JSON for text-only submissions
    return await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, body })
    });
  }
}
```

### Usage Examples
```javascript
// Text-only ticket
await createZendeskTicket({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Technical Support',
  body: 'Need help with installation'
});

// Ticket with file attachment
await createZendeskTicket({
  name: 'Jane Smith',
  email: 'jane@example.com',
  subject: 'Documentation Request',
  body: 'Please review attached file',
  file: pdfFile
});
```

### Error Handling
- Network connectivity issues
- Server response validation
- File upload failures
- Timeout management

---

## 6. filesService.js (`/src/services/filesService.js`)

### Purpose
Provides comprehensive file type detection, icon assignment, and utility functions for file management throughout the application.

### Key Functions

#### `getFileType(fileName)`
Detects file type based on extension:
```javascript
export const getFileType = (fileName) => {
  const extension = fileName.toLowerCase().split('.').pop();
  
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    return 'image';
  }
  if (extension === 'pdf') return 'pdf';
  if (['mp4', 'avi', 'mov'].includes(extension)) return 'video';
  // ... more types
};
```

#### `getFileIcon(fileName)`
Returns appropriate emoji icon for file type:
- 📄 PDF files
- 🖼️ Images
- 🎥 Videos
- 🎵 Audio
- 📝 Documents

#### `formatFileSize(bytes)`
Converts byte values to human-readable format:
```javascript
export const formatFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};
```

#### `getMimeType(fileName)`
Returns proper MIME type for HTTP headers and file handling.

#### `canPreview(fileName)`
Determines if file can be previewed in browser.

### Supported File Types
- **Images**: JPG, PNG, GIF, BMP, WebP, SVG
- **Documents**: PDF, DOC, DOCX, TXT, RTF
- **Media**: MP4, AVI, MOV, MP3, WAV
- **Archives**: ZIP, RAR, 7Z, TAR
- **Spreadsheets**: XLS, XLSX, CSV
- **Presentations**: PPT, PPTX

### Usage in Application
- **FileManagerPopup**: File type detection and icons
- **FileViewerDialog**: Preview capability checking
- **Upload components**: MIME type validation
- **Download features**: Size formatting

---

## 7. Pages Folder (`/src/pages/`)

### Purpose
Contains top-level page components that represent different views/routes in the application.

### Files Overview

#### `Homepage.jsx`
**Purpose**: Landing page with hero section and navigation

**Key Features**:
- Hero section with animated background
- Call-to-action buttons
- Theme switching
- File manager integration
- Responsive design

**Key Components**:
```javascript
// Hero section with gradient background
<Box sx={{ background: theme.gradients.primary }}>
  <Typography variant="h2">AirSmart 3D Experience</Typography>
  <Button onClick={() => navigate("/experience")}>Explore in 3D</Button>
</Box>
```

#### `CompareSystem.jsx`
**Purpose**: Side-by-side comparison of different AirSmart models

**Key Features**:
- 3D model comparison
- Specification tables
- Interactive model rotation
- Performance metrics
- ROI calculations

**Components**:
- `RotatingModel`: 3D model display with auto-rotation
- Comparison tables with technical specifications
- Interactive controls for model manipulation

#### `X-ray.jsx`
**Purpose**: X-ray mode for internal system visualization

**Key Features**:
- Transparent/wireframe rendering
- Internal component highlighting
- Layer-by-layer exploration
- Educational annotations

### Routing Integration
```javascript
// In AppRouter.jsx
<Routes>
  <Route path="/" element={<Homepage />} />
  <Route path="/experience" element={<App />} />
  <Route path="/compare" element={<CompareSystem />} />
  <Route path="/xray" element={<XRayMode />} />
</Routes>
```

### Common Patterns
- **Theme Integration**: All pages use ThemeContext
- **Mobile Responsiveness**: Adaptive layouts
- **Navigation**: Consistent header/footer
- **Loading States**: Progress indicators

---

## 8. FloatingChatButton.jsx (`/src/components/FloatingChatButton.jsx`)

### Purpose
Implements an AI-powered chat interface that provides real-time assistance and product information. Integrates with VoiceFlow API for intelligent responses.

### Key Features
- **AI Integration**: VoiceFlow API for intelligent responses
- **Real-time Chat**: Instant messaging interface
- **Session Management**: Persistent chat sessions
- **Scroll Isolation**: Prevents interference with 3D scene
- **Mobile Optimization**: Touch-friendly interface
- **Focus Management**: Proper focus handling for accessibility

### State Management
```javascript
const [isOpen, setIsOpen] = useState(false);
const [message, setMessage] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [chatHistory, setChatHistory] = useState([
  {
    type: 'bot',
    message: 'Hello\nThis is AirSmart AI, how can I help you?',
    timestamp: new Date()
  }
]);
```

### Core Functions

#### `handleSendMessage()`
Processes user input and communicates with AI API:
```javascript
const handleSendMessage = async () => {
  // Add user message to history
  setChatHistory(prev => [...prev, userMessageObj]);
  
  // Get or create VoiceFlow session
  let sessionId = localStorage.getItem('voiceflow_session_id');
  
  // Call VoiceFlow API
  const response = await fetch('https://api2.heartstribute.com/voice-flow/interact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message: userMessage })
  });
  
  // Process and display response
  const botMessage = extractMessage(data);
  setChatHistory(prev => [...prev, botResponse]);
};
```

#### `extractMessage(obj)`
Recursively extracts text content from VoiceFlow API responses:
```javascript
const extractMessage = (obj) => {
  if (typeof obj === 'string') return obj;
  if (obj.text) return obj.text;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = extractMessage(item);
      if (result) return result;
    }
  }
  // ... recursive object traversal
};
```

### UI Components

#### Chat Interface
- **Header**: Shows AI status and close button
- **Messages Area**: Scrollable chat history with timestamps
- **Input Area**: Text input with send button
- **Loading States**: Visual feedback during API calls

#### Floating Button
- **Notification Dot**: Indicates unread messages
- **Smooth Animations**: CSS transitions and transforms
- **Responsive Sizing**: Adapts to screen size

### Scroll Management
```javascript
// Enhanced scroll isolation
const handleWheel = (e) => {
  e.stopPropagation();
  e.preventDefault();
  
  const messagesContainer = chatContainerRef.current?.querySelector('[data-messages-container]');
  if (messagesContainer) {
    messagesContainer.scrollTop += e.deltaY;
  }
};
```

### Focus Management
- **Auto-focus**: Input field focuses when chat opens
- **Click Outside**: Unfocuses chat without closing
- **Keyboard Navigation**: Full keyboard accessibility
- **Scene Isolation**: Prevents 3D scene interference

### Error Handling
- **Network Errors**: Graceful degradation
- **Timeout Management**: 30-second request timeout
- **API Failures**: User-friendly error messages
- **Session Recovery**: Automatic session restoration

### Integration Points
- **App.jsx**: Receives focus change notifications
- **Scene.jsx**: Respects chat focus for input blocking
- **ThemeContext**: Consistent styling
- **Mobile hooks**: Responsive behavior

---

## Architecture Overview

### Application Structure
The application is built with a modular architecture with clear layers:

**1. Router Layer (`AppRouter.jsx`)**
- Manages routing between pages
- Integrates Voiceflow AI chat widget
- Provides ThemeProvider for the entire application

**2. Page Layer (`/src/pages/`)**
- Homepage: Landing page with navigation
- CompareSystem: 3D model comparison
- X-ray: Internal view mode
- App: Main 3D experience

**3. Component Layer (`/src/components/`)**
- Scene management and 3D rendering
- UI components and dialogs
- Interactive elements (hotspots, animations)

**4. Service Layer (`/src/services/`)**
- API integrations (Zendesk, Wasabi S3)
- File management utilities
- External service communications

### Component Hierarchy
```
AppRouter.jsx (Root router + AI chat)
├── ThemeProvider
├── Homepage.jsx
├── CompareSystem.jsx
├── X-ray.jsx
└── App.jsx (3D Experience)
    ├── Canvas (React Three Fiber)
    │   └── SceneManager.jsx
    │       ├── FOVManager
    │       └── Scene.jsx (3D engine)
    │           ├── Model.jsx (GLB loader)
    │           ├── Hotspot.jsx (Interactive points)
    │           ├── VideoScreen.jsx (Video display)
    │           ├── DoorAnimation.jsx (Animations)
    │           ├── HDREnvironment.jsx (Lighting)
    │           └── PostProcessing.jsx (Effects)
    ├── LoadingScreen.jsx
    ├── ChapterNavigation.jsx
    ├── ScrollSensitivityControl.jsx
    ├── NavigationGuide.jsx
    └── MobileHomeButton.jsx
```

### Data Flow
1. **Configuration**: Data folder provides scene structure
2. **State Management**: App.jsx coordinates global state
3. **3D Rendering**: Scene.jsx manages Three.js operations
4. **User Interaction**: Components handle input and feedback
5. **API Integration**: Services handle external communications

---

## Developer Guide

### Prerequisites
- **Node.js**: >= 18.0.0
- **Yarn**: >= 1.22.0 (required, do not use npm)
- **Git**: For version control
- **Modern Browser**: Chrome/Firefox/Safari with WebGL support

### Project Setup

#### 1. Clone and Install Dependencies
```bash
# Clone repository
git clone <repository-url>
cd threejs

# Install dependencies (use yarn only)
yarn install

# Start development server
yarn dev
```

#### 2. Development Scripts
```bash
# Development server with hot reload
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Setup server accessible from network
yarn setup
```

### Development Workflow

#### 1. Code Organization
```
src/
├── components/     # React components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── services/      # API và external services
├── data/          # Static configuration
├── utils/         # Helper functions
├── theme/         # Theme và styling
└── router/        # Routing configuration
```


#### 3. Import Organization
```javascript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { Canvas } from '@react-three/fiber';
import { Box, Typography } from '@mui/material';

// 3. Internal components
import Scene from './components/Scene';
import { useMobile } from './hooks/useMobile';

// 4. Data and constants
import { sequenceChapters } from './data/sequenceChapters';
```

#### 4. Component Structure Template
```javascript
// ComponentName.jsx
import { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Title prop
 */
const ComponentName = ({ title, ...props }) => {
  const { theme } = useTheme();
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, []);

  const handleAction = () => {
    // Event handler
  };

  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### Best Practices

#### 1. Performance
- **Lazy Loading**: Use `React.lazy()` for large components
- **Memoization**: `useMemo`, `useCallback` for expensive operations
- **Three.js Cleanup**: Dispose geometries and materials on unmount
```javascript
useEffect(() => {
  return () => {
    // Cleanup Three.js objects
    geometry?.dispose();
    material?.dispose();
    texture?.dispose();
  };
}, []);
```

#### 2. State Management
- **Local State**: `useState` for component-specific state
- **Context**: `useContext` for shared state
- **Props Drilling**: Avoid more than 3 levels, use context instead

#### 3. Error Handling
```javascript
// Error boundaries cho 3D components
const Scene3D = () => {
  try {
    return <Canvas>{/* 3D content */}</Canvas>;
  } catch (error) {
    console.error('3D Scene Error:', error);
    return <div>3D Scene failed to load</div>;
  }
};
```

#### 4. Mobile Optimization
```javascript
// Use useMobile hook
const mobile = useMobile();

// Conditional rendering
if (mobile.isMobile) {
  return <MobileComponent />;
}
return <DesktopComponent />;
```

### Debugging Tools

#### 1. Theatre.js Studio
```javascript
// Enable in development
if (process.env.NODE_ENV === 'development') {
  studio.initialize();
}
```

#### 2. React DevTools
- Install React Developer Tools extension
- Use Profiler tab to analyze performance

#### 3. Three.js Inspector
```javascript
// Add to scene for debugging
import { Perf } from 'r3f-perf';

<Canvas>
  <Perf position="top-left" />
  {/* Scene content */}
</Canvas>
```

---

## Adding New Features

### 1. Adding New 3D Components

#### Step 1: Create Component File
```javascript
// src/components/NewComponent.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NewComponent = ({ position = [0, 0, 0], ...props }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    // Animation logic
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={meshRef} position={position} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default NewComponent;
```

#### Step 2: Add to Scene
```javascript
// src/components/Scene.jsx
import NewComponent from './NewComponent';

// In Scene component
return (
  <>
    {/* Existing components */}
    <NewComponent position={[2, 0, 0]} />
  </>
);
```

### 2. Adding New Hotspots

#### Step 1: Update Data Configuration
```javascript
// src/data/sequenceChapters.js
export const sequenceChapters = [
  // Existing hotspots...
  {
    id: "new-hotspot",
    position: 15.5, // Timeline position
    hotspot: {
      position: [2, 1, 0], // 3D coordinates
      rotation: [0, 0, 0],
      title: "New Component",
      description: "Description of new component",
      link: "path/to/video.mp4"
    },
    videoScreen: {
      position: [2.5, 1.5, 0],
      videoId: "path/to/video.mp4",
      size: { width: 320, height: 180 }
    }
  }
];
```

#### Step 2: Add Mesh Visibility Rules (Optional)
```javascript
// src/data/sequenceHiddenMeshes.js
export const sequenceHiddenMeshes = {
  "new-hotspot": {
    hiddenMeshes: ["mesh-to-hide"],
    transitionDuration: 400,
    opacity: 0.1
  }
};
```

### 3. Adding New Pages

#### Step 1: Create Page Component
```javascript
// src/pages/NewPage.jsx
import { Box, Typography } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

const NewPage = () => {
  const { theme } = useTheme();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.colors.background.primary 
    }}>
      <Typography variant="h2">
        New Page
      </Typography>
    </Box>
  );
};

export default NewPage;
```

#### Step 2: Add Route
```javascript
// src/router/AppRouter.jsx
import NewPage from '../pages/NewPage';

// Trong Routes component
<Route path="/new-page" element={<NewPage />} />
```

### 4. Adding New Services

#### Step 1: Create Service File
```javascript
// src/services/newService.js

/**
 * New service for handling specific functionality
 */
class NewService {
  constructor() {
    this.baseUrl = 'https://api.example.com';
  }

  async fetchData(params) {
    try {
      const response = await fetch(`${this.baseUrl}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('NewService Error:', error);
      throw error;
    }
  }
}

export const newService = new NewService();
export default newService;
```

#### Step 2: Use in Components
```javascript
// In component
import { newService } from '../services/newService';

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await newService.fetchData({ id: 1 });
        setData(result);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  return <div>{/* Render data */}</div>;
};
```

### Important Notes

#### 1. Performance Considerations
- **3D Objects**: Always dispose geometry and material
- **Event Listeners**: Remove listeners in cleanup
- **Timers**: Clear timeouts and intervals
- **Memory Leaks**: Monitor with React DevTools Profiler

#### 2. Mobile Compatibility
- Test on real devices, not just browser dev tools
- Use `useMobile` hook for responsive behavior
- Optimize texture sizes for mobile
- Implement touch gestures properly

#### 3. Browser Compatibility
- Test on Chrome, Firefox, Safari
- Provide fallbacks for unsupported WebGL
- Handle different screen sizes and orientations

#### 4. Code Quality
- Follow ESLint rules
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Test thoroughly before committing

---

## Troubleshooting

### Common Issues

#### 1. 3D Model Not Loading
```javascript
// Debug GLB loading
import { useGLTF } from '@react-three/drei';

const Model = () => {
  try {
    const { scene } = useGLTF('/path/to/model.glb');
    console.log('Model loaded:', scene);
    return <primitive object={scene} />;
  } catch (error) {
    console.error('Model loading failed:', error);
    return <mesh><boxGeometry /><meshBasicMaterial color="red" /></mesh>;
  }
};
```

#### 2. Performance Issues
```javascript
// Monitor performance
import { Perf } from 'r3f-perf';

// Add to Canvas
<Canvas>
  {process.env.NODE_ENV === 'development' && <Perf />}
</Canvas>

// Check for memory leaks
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Memory usage:', performance.memory);
  }, 5000);
  
  return () => clearInterval(interval);
}, []);
```

#### 3. Mobile Touch Issues
```javascript
// Proper touch handling
const handleTouch = (event) => {
  event.preventDefault(); // Prevent default browser behavior
  event.stopPropagation(); // Stop event bubbling
  
  // Handle touch logic
};

// Add passive: false for preventDefault
useEffect(() => {
  document.addEventListener('touchmove', handleTouch, { passive: false });
  return () => document.removeEventListener('touchmove', handleTouch);
}, []);
```

#### 4. Theatre.js Animation Issues
```javascript
// Debug Theatre.js
const sheet = project.sheet('Scene');
const obj = sheet.object('Camera', {
  position: { x: 0, y: 0, z: 5 }
});

// Monitor values
useFrame(() => {
  console.log('Camera position:', obj.value.position);
});
```

### Performance Optimization
- **Lazy Loading**: Components load on demand
- **Memory Management**: Proper cleanup and disposal
- **Mobile Optimization**: Reduced quality settings
- **Caching**: Asset and API response caching
- **Progressive Enhancement**: Graceful degradation

This documentation provides a comprehensive overview of the core components. Each file contains additional implementation details and can be extended based on specific requirements.