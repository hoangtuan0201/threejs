# AirSmart 3D Interactive System Documentation

## Tổng Quan

AirSmart là ứng dụng web 3D tương tác giới thiệu hệ thống điều hòa thông minh sử dụng công nghệ web tiên tiến. Dự án kết hợp React Three Fiber cho rendering 3D, Theatre.js cho animation điện ảnh, và Material-UI cho giao diện người dùng chuyên nghiệp.

## 🚀 Tính Năng Chính

### 🎮 Trải Nghiệm 3D Tương Tác
- **Mô Hình 3D Tương Tác**: Mô hình nhà 3D hoàn chỉnh với các thành phần điều hòa
- **Animation Camera Điện Ảnh**: Chuyển động camera mượt mà sử dụng Theatre.js
- **Hotspots Tương Tác**: Các điểm thông tin có thể click với thông số kỹ thuật chi tiết
- **Tích Hợp Video**: Video YouTube nhúng cho demo sản phẩm
- **Thiết Kế Responsive**: Tối ưu cho mobile, tablet và desktop
- **Điều Hướng Đa Dạng**: Mouse scroll, touch gestures và keyboard controls
- **Hệ Thống Material Động**: Objects trở nên trong suốt trong các sequence cụ thể
- **Màn Hình Loading**: Trải nghiệm loading chuyên nghiệp với branding AirSmart

### 📱 UI/UX Hiện Đại
- **Dark/Light Themes**: Chuyển đổi theme tự động theo preferences người dùng
- **File Management System**: Tích hợp cloud storage Wasabi S3
- **AI Chat Assistant**: Chatbot tích hợp cho tư vấn sản phẩm
- **System Comparison**: So sánh side-by-side các model AirSmart khác nhau
- **X-Ray Mode**: Chế độ xem xuyên qua cấu trúc tòa nhà
- **Arrow Key Navigation**: Điều hướng nhanh bằng phím mũi tên
- **Navigation Guide**: Hướng dẫn tương tác cho người dùng mới

## 📁 Cấu Trúc Dự Án

```
src/
├── 🎬 components/           # React components tái sử dụng
│   ├── App.jsx             # Component ứng dụng chính với responsive Canvas
│   ├── Scene.jsx           # Scene 3D chính với multi-input navigation
│   ├── SceneManager.jsx    # Quản lý chuyển đổi giữa các scene
│   ├── Model.jsx           # Loader mô hình 3D và quản lý material
│   ├── Hotspot.jsx         # Interactive 3D hotspots
│   ├── HotspotDetail.jsx   # Chi tiết hotspot với thông tin kỹ thuật
│   ├── HotspotDetailScene.jsx # Scene riêng cho hotspot detail
│   ├── VideoScreen.jsx     # Tích hợp YouTube video
│   ├── LoadingScreen.jsx   # Màn hình loading chuyên nghiệp
│   ├── FileManagerPopup.jsx # File browser và viewer
│   ├── FileViewerDialog.jsx # Dialog xem file chi tiết
│   ├── FloatingChatButton.jsx # AI chat interface
│   ├── ChapterNavigation.jsx # Điều hướng chapter
│   ├── NavigationGuide.jsx  # Hướng dẫn điều hướng
│   ├── MobileHomeButton.jsx # Nút home cho mobile
│   ├── DoorAnimation.jsx   # Hệ thống animation cửa
│   ├── ToggleHiddenObjects.jsx # Toggle hiển thị objects
│   ├── HDREnvironment.jsx  # Lighting và HDR environment
│   ├── Background.jsx      # Background và skybox
│   ├── PostProcessing.jsx  # Effects và post-processing
│   ├── RenderingOptimizer.jsx # Tối ưu rendering performance
│   ├── ScrollSensitivityControl.jsx # Điều khiển độ nhạy scroll
│   ├── MoreFeaturesDialog.jsx # Dialog tính năng mở rộng
│   └── XRayMode/          # Components cho X-Ray mode
├── 📄 pages/               # Page-level components
│   ├── Homepage.jsx        # Landing page với hero section
│   ├── CompareSystem.jsx   # Trang so sánh sản phẩm
│   └── X-ray.jsx          # Trang X-Ray mode
├── 🔧 hooks/              # Custom React hooks
│   ├── useMobile.js       # Hook detect mobile device
│   ├── useSceneLock.js    # Hook quản lý scene navigation lock
│   └── useHDRConfig.js    # Hook cấu hình HDR
├── 🌐 services/           # External services
│   ├── filesService.js    # Service xử lý file types
│   ├── wasabiService.js   # Wasabi S3 cloud storage
│   └── zendeskService.js  # Zendesk ticket integration
├── 📊 data/               # Static data
│   ├── sequenceChapters.js # Animation sequences và hotspot data
│   └── hiddenObjects.js   # Objects ẩn trong sequences cụ thể
├── 🎭 states/             # Theatre.js animation states
│   ├── FlyThrough.json    # Main animation state
│   └── FlyThrough2.json   # Updated animation state
├── 🎨 theme/              # Theme system
│   ├── ThemeContext.jsx   # Theme context provider
│   ├── ColorModeSelect.jsx # Color mode selector
│   └── theme.js           # Theme definitions
├── 🛣️ router/             # Routing
│   └── AppRouter.jsx      # Main router configuration
└── 🔧 utils/              # Utility functions
    ├── theatreHelper.js   # Theatre.js utilities
    └── wasabiHelper.js    # Wasabi S3 utilities
```

## 🛠 Technology Stack

### Core Technologies
- **React 18**: Modern React với hooks và concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool và dev server
- **React Router DOM**: Client-side routing
- **Yarn**: Package manager (theo project rules)

### 3D Graphics & Animation
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer cho Three.js
- **@react-three/drei**: Useful helpers cho R3F
- **@react-three/postprocessing**: Post-processing effects
- **Theatre.js**: Professional animation library
  - **@theatre/core**: Core animation engine
  - **@theatre/r3f**: React Three Fiber integration
  - **@theatre/studio**: Visual editor
- **JEasings**: Camera animation easing
- **three-gpu-pathtracer**: Advanced rendering

### UI Framework
- **Material-UI (MUI)**: React component library
  - **@mui/material**: Core components
  - **@mui/icons-material**: Icon library
- **@emotion/react & @emotion/styled**: CSS-in-JS styling

### Cloud Services & Storage
- **AWS SDK**: S3 integration
  - **@aws-sdk/client-s3**: S3 client
  - **@aws-sdk/s3-request-presigner**: Presigned URLs
- **Wasabi S3**: Cloud storage cho files
- **Zendesk API**: Customer support integration

### Development Tools
- **Leva**: Debug controls
- **r3f-perf**: Performance monitoring
- **crypto-js**: Encryption utilities
- **vite-plugin-glsl**: GLSL shader support
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
