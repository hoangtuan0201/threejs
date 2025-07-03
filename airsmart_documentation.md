# AirSmart 3D Interactive System Documentation

## Overview

AirSmart is an interactive 3D web application that showcases smart air conditioning systems using cutting-edge web technologies. The project combines React Three Fiber for 3D rendering, Theatre.js for cinematic animations, and Material-UI for a polished user interface.

## 🚀 Features

- **3D Interactive Model**: Fully interactive 3D house model with air conditioning components
- **Cinematic Camera Animation**: Smooth camera movements using Theatre.js animation sequences
- **Interactive Hotspots**: Clickable information points with detailed component specifications
- **Video Integration**: Embedded YouTube videos for product demonstrations
- **Responsive Design**: Optimized for mobile, tablet, and desktop with touch controls
- **Multi-Input Navigation**: Mouse scroll, touch gestures, and keyboard controls
- **Dynamic Material System**: Objects become transparent during specific sequences
- **Loading Screen**: Professional loading experience with AirSmart branding
- **Progressive Enhancement**: Graceful degradation across device capabilities

## 📁 Project Structure

```
src/
├── components/
│   ├── App.jsx              # Main application component with responsive Canvas
│   ├── Homepage.jsx         # Responsive landing page with hero section
│   ├── LoadingScreen.jsx    # Professional loading screen with AirSmart branding
│   ├── Scene.jsx            # Main 3D scene with multi-input navigation
│   ├── Model.jsx            # 3D model loader and material management
│   └── VideoScreen.jsx      # YouTube video integration component
├── data/
│   ├── sequenceChapters.js  # Animation sequences and hotspot data
│   └── hiddenObjects.js     # Objects to hide during specific sequences
└── states/
    └── FlyThrough.json      # Theatre.js animation state
```

## 🛠 Technology Stack

### Core Technologies
- **React 18**: Modern React with hooks and concurrent features
- **React Three Fiber**: React renderer for Three.js
- **Theatre.js**: Professional animation library for 3D scenes
- **Three.js**: 3D graphics library
- **Material-UI (MUI)**: React component library for UI elements

### 3D & Animation
- **@react-three/fiber**: React Three Fiber core
- **@react-three/drei**: Useful helpers for R3F
- **@theatre/core**: Theatre.js core animation engine  
- **@theatre/studio**: Theatre.js visual editor
- **@theatre/r3f**: Theatre.js React Three Fiber integration

## 🎯 Core Components

### App.jsx
Main application orchestrator that manages:
- Application state (control panel visibility, loading states)
- Theatre.js initialization and studio setup
- Responsive Canvas setup with adaptive camera configuration
- Dynamic navigation guide overlay (desktop vs mobile)
- Keyboard shortcuts (ESC to exit)
- Loading screen coordination with model loading

### Homepage.jsx
Responsive hero landing page featuring:
- Animated gradient background with dynamic effects
- Typography with shimmer effects and responsive scaling
- Adaptive call-to-action buttons (full-width on mobile)
- AirSmart logo integration with conditional text display
- Mobile-first responsive design with Material-UI breakpoints
- Optimized touch targets and spacing for mobile devices

### LoadingScreen.jsx
Professional loading experience:
- Centered AirSmart logo with smooth animations
- Responsive spinner and typography scaling
- Dark gradient background matching brand aesthetics
- Fade-in animations with staggered timing
- Mobile-optimized sizing and spacing

### Scene.jsx
The heart of the responsive 3D experience:
- **Adaptive Camera Control**: Theatre.js animated camera with responsive FOV
- **Multi-Input Navigation**: Mouse wheel and touch gesture handling
- **Responsive Scroll Sensitivity**: Adjusted sensitivity for mobile devices
- **Touch Event Management**: Swipe gestures for mobile navigation
- **Hotspot Management**: 3D information markers with responsive HTML overlays
- **Video Integration**: Dynamic video screen display with adaptive sizing
- **Lighting Setup**: Optimized ambient and directional lighting
- **Fog Effects**: Atmospheric depth enhancement

### Model.jsx
3D model management:
- **GLTF Loading**: Efficient 3D model loading with useGLTF
- **Shadow Configuration**: Automatic shadow setup for all meshes
- **Material Management**: Dynamic transparency during sequences
- **Click Handlers**: Interactive element setup
- **Object Visibility**: Conditional rendering based on animation progress

### VideoScreen.jsx
YouTube video integration:
- **Embedded Player**: YouTube iframe with autoplay and loop
- **Interactive Controls**: Click to open full video
- **Responsive Sizing**: Configurable dimensions
- **3D Positioning**: Positioned in 3D space with HTML overlay

## 📊 Data Configuration

### sequenceChapters.js
Defines animation sequences and interactive elements:

```javascript
{
  id: "unique_identifier",
  range: [start_position, end_position],
  position: [x, y, z],
  title: "Display Title",
  description: "Component Description",
  hotspot: {
    position: [x, y, z],
    rotation: [x, y, z],
    title: "Hotspot Title",
    description: "Detailed Description",
    link: "specification_url",
    videoId: "youtube_video_id"
  },
  videoScreen: {
    position: [x, y, z],
    rotation: [x, y, z],
    videoId: "youtube_video_id",
    title: "Video Title",
    size: { width: number, height: number }
  }
}
```

### hiddenObjects.js
Lists 3D objects to hide during specific animation sequences:
- Controls object transparency
- Manages interior/exterior visibility
- Enables "x-ray" view of building components

## 🎮 User Interactions

### Navigation Controls
- **Desktop**: Mouse scroll wheel for sequence navigation
- **Mobile**: Touch swipe gestures for intuitive navigation
- **Hotspot Interactions**: Tap/click for detailed component information
- **Video Screens**: Embedded YouTube demonstrations with touch controls
- **Keyboard**: ESC key to exit and return to homepage
- **Adaptive Sensitivity**: Optimized input sensitivity per device type

### Animation Sequences
1. **Start (0-0.3)**: Initial camera position and welcome
2. **Thermostat (0.3-1)**: Focus on smart thermostat component with interactive hotspot
3. **Linear Grille (1-2)**: Showcase air distribution system with video demonstration
4. **Air Purification (2-4)**: Advanced filtration system with detailed specifications
5. **Outdoor Unit (4-5)**: External condenser unit with performance metrics

### Interactive Elements
- **3D Hotspots**: Information markers with "i" icon design
- **Detail Popups**: Expandable information cards
- **Video Integration**: Embedded product demonstrations
- **Specification Links**: External documentation access

## 🎨 Visual Design

### Color Palette
- **Primary**: Dark gradient backgrounds (oklch color space)
- **Secondary**: Semi-transparent whites for text
- **Accent**: Shimmer effects on typography
- **Interactive**: Hover states with subtle animations

### Typography
- **System Fonts**: Uses system-ui for optimal performance
- **Responsive Sizes**: Scales across device breakpoints
- **Shimmer Effects**: Animated text highlights
- **Consistent Hierarchy**: Clear information architecture

### 3D Aesthetics
- **Realistic Lighting**: Ambient and directional lights
- **Atmospheric Effects**: Fog for depth perception
- **Material Fidelity**: PBR materials with shadows
- **Smooth Animations**: Theatre.js cinematic movements

## 🔧 Configuration

### Animation Timing
- **Desktop Scroll Sensitivity**: 0.002 for precise control
- **Mobile Touch Sensitivity**: 0.005 for responsive gestures
- **Touch Threshold**: 10px minimum movement for activation
- **Smooth Scrolling**: 0.03 interpolation speed
- **Sequence Length**: 0-6 range (6 units total)

### Performance Settings
- **Device Pixel Ratio**: [1, 2] for high-quality retina displays
- **Canvas Optimization**: High-performance WebGL context
- **Shadow Quality**: Enabled for all meshes with optimized settings
- **Fog Distance**: 0-40 units for atmospheric depth
- **Touch Actions**: Disabled for custom gesture handling

### Video Settings
- **Autoplay**: Enabled for demonstrations
- **Loop**: Continuous playback
- **Controls**: User-controllable playback
- **Responsive**: Scales with screen size

## 🚀 Development Setup

### Prerequisites
```bash
Node.js 16+
npm or yarn
```

### Installation
```bash
npm install
# or
yarn install
```

### Development
```bash
npm run dev
# or
yarn dev
```

### Build
```bash
npm run build
# or
yarn build
```

## 📱 Responsive Design

### Breakpoints (Material-UI)
- **xs (Mobile)**: 0px - 600px - Touch-optimized interface
- **sm (Tablet)**: 600px - 900px - Adapted spacing and controls
- **md (Laptop)**: 900px - 1200px - Enhanced features
- **lg (Desktop)**: 1200px+ - Full experience with all features

### Mobile Optimizations
- **Touch Controls**: Swipe gestures for 3D navigation
- **Adaptive Camera**: Wider FOV (70°) for better mobile viewing
- **Touch Sensitivity**: Optimized touch event handling (0.005 sensitivity)
- **UI Scaling**: Responsive typography and button sizing
- **Layout**: Vertical button stacking with full-width design
- **Navigation Guide**: Contextual instructions (swipe vs scroll)
- **Loading Screen**: Mobile-optimized logo and spinner sizing

### Desktop Enhancements
- **Precision Controls**: Mouse wheel with fine sensitivity (0.002)
- **Enhanced UI**: Larger interactive elements and spacing
- **Multi-Column Layouts**: Horizontal button arrangements
- **Advanced Features**: Full keyboard shortcuts and hover states
- **High DPR Support**: Retina display optimization (up to 2x)

### Canvas Responsiveness
- **Dynamic FOV**: 60° desktop, 70° mobile for optimal viewing
- **Touch Actions**: Disabled default touch behaviors for custom controls
- **Performance Scaling**: Adaptive quality based on device capabilities
- **Resize Handling**: Automatic camera adjustment on orientation change

## 🎭 Animation System

### Theatre.js Integration
- **Project Setup**: Configured with state persistence
- **Studio Mode**: Visual editing in development
- **Sequence Management**: Smooth interpolation between keyframes
- **Camera Animation**: Cinematic camera movements

### Scroll-Based Animation
- **Wheel Events**: Captured and converted to sequence position
- **Smooth Interpolation**: Prevents jarring movements
- **Boundary Handling**: Keeps animation within valid range
- **Performance**: Optimized frame-rate independent animation

## 🔍 SEO & Accessibility

### SEO Considerations
- **Meta Tags**: Proper page metadata
- **Semantic HTML**: Screen reader friendly
- **Performance**: Optimized loading and rendering
- **Mobile-First**: Responsive design approach

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG compliant color ratios
- **Alt Text**: Descriptive text for visual elements
- **Focus Management**: Logical tab order

## 🐛 Troubleshooting

### Common Issues

**3D Model Not Loading**
- Check GLTF file path in public folder
- Verify file permissions and size
- Check browser console for loading errors

**Animation Stuttering**
- Reduce devicePixelRatio in Canvas settings
- Disable shadows for better performance
- Check for memory leaks in useEffect hooks

**Video Not Playing**
- Verify YouTube video ID format
- Check browser autoplay policies
- Ensure video is publicly accessible

**Navigation Not Working**
- **Desktop**: Verify wheel event listeners are attached
- **Mobile**: Check touch event handlers and preventDefault calls
- **General**: Confirm isExploreMode state and Canvas element focus
- **Touch Issues**: Verify touchAction: 'none' is set on Canvas
- **Sensitivity**: Adjust scroll/touch sensitivity values for device type

## 🔄 Future Enhancements

### Planned Features
- **VR Support**: Virtual reality integration
- **Multiple Models**: Different AC system types
- **Configurator**: Real-time system customization
- **Performance Metrics**: Energy efficiency calculations
- **Multi-language**: Internationalization support

### Technical Improvements
- **Progressive Loading**: Lazy load 3D assets
- **Compression**: DRACO geometry compression
- **Caching**: Better asset caching strategies
- **Analytics**: User interaction tracking

## 📚 Resources

### Documentation
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Theatre.js](https://www.theatrejs.com/docs)
- [Three.js](https://threejs.org/docs/)
- [Material-UI](https://mui.com/material-ui/)

### 3D Assets
- **Format**: GLTF 2.0 recommended
- **Optimization**: Use Draco compression
- **Textures**: Power-of-two dimensions
- **Polycount**: Optimize for web performance

## 🤝 Contributing

### Development Guidelines
1. Follow React hooks patterns
2. Use TypeScript for type safety
3. Optimize 3D performance
4. Test across devices
5. Document component APIs

### Code Style
- ESLint configuration
- Prettier formatting
- Consistent naming conventions
- Component composition patterns

## 📄 License

This project is proprietary software. All rights reserved.

---
