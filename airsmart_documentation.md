# AirSmart 3D Interactive System Documentation

## Overview

AirSmart is an interactive 3D web application that showcases smart air conditioning systems using cutting-edge web technologies. The project combines React Three Fiber for 3D rendering, Theatre.js for cinematic animations, and Material-UI for a polished user interface.

## 🚀 Features

- **3D Interactive Model**: Fully interactive 3D house model with air conditioning components
- **Cinematic Camera Animation**: Smooth camera movements using Theatre.js animation sequences
- **Interactive Hotspots**: Clickable information points with detailed component specifications
- **Video Integration**: Embedded YouTube videos for product demonstrations
- **Responsive Design**: Works across different screen sizes and devices
- **Scroll-Based Navigation**: Intuitive scroll-to-explore functionality
- **Dynamic Material System**: Objects become transparent during specific sequences

## 📁 Project Structure

```
src/
├── components/
│   ├── App.jsx              # Main application component
│   ├── Homepage.jsx         # Landing page with hero section
│   ├── Scene.jsx            # Main 3D scene with camera and interactions
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
- Application state (control panel visibility)
- Theatre.js initialization
- Canvas setup with proper camera configuration
- Navigation guide overlay
- Keyboard shortcuts (ESC to exit)

### Homepage.jsx
Hero landing page featuring:
- Animated gradient background
- Typography with shimmer effects
- Call-to-action buttons
- Feature chips with staggered animations
- Responsive design with Material-UI

### Scene.jsx
The heart of the 3D experience:
- **Camera Control**: Theatre.js animated camera with smooth transitions
- **Scroll Navigation**: Wheel event handling for sequence progression
- **Hotspot Management**: 3D information markers with HTML overlays
- **Video Integration**: Dynamic video screen display
- **Lighting Setup**: Ambient and directional lighting
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
- **Mouse Scroll**: Navigate through animation sequences
- **Hotspot Clicks**: Display detailed component information
- **Video Screens**: Embedded YouTube demonstrations
- **Keyboard**: ESC key to exit and return to homepage

### Animation Sequences
1. **Start (0-0.3)**: Initial camera position and welcome
2. **Thermostat (0.3-1)**: Focus on smart thermostat component
3. **Linear Grille (1-2)**: Showcase air distribution system
4. **End (2-3)**: Tour completion and reset

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
- **Scroll Sensitivity**: 0.002 (adjustable in Scene.jsx)
- **Smooth Scrolling**: 0.03 interpolation speed
- **Sequence Length**: 0-6 range (6 units total)

### Performance Settings
- **Device Pixel Ratio**: [1, 1.5] for performance balance
- **Shadow Quality**: Enabled for all meshes
- **Fog Distance**: 0-40 units for atmospheric depth

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

### Breakpoints
- **Mobile**: < 600px - Stacked layouts, touch-friendly
- **Tablet**: 600px - 960px - Adapted spacing
- **Desktop**: > 960px - Full experience

### Mobile Optimizations
- **Touch Controls**: Optimized for touch navigation
- **Performance**: Reduced particle effects
- **Layout**: Vertical button stacking
- **Typography**: Responsive font scaling

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

**Scroll Not Working**
- Verify wheel event listeners are attached
- Check isExploreMode state
- Confirm Canvas element is receiving events

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

*Documentation last updated: December 2024*