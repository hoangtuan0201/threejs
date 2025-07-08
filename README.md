# 🏠 AirSmart 3D Interactive Experience

> **The world's finest indoor environment system** - Experience AirSmart's cutting-edge HVAC technology through immersive 3D visualization.

https://threejs-p5tz.onrender.com/

## ✨ Features

### 🎮 Interactive 3D Experience
- **Cinematic Navigation** - Smooth camera movements with Theatre.js animations
- **Interactive Hotspots** - Click to explore detailed system specifications
- **Mobile Optimized** - Touch-friendly controls and responsive design
- **Real-time Lighting** - Dynamic lighting system with shadows and ambient effects

### 📱 Modern UI/UX
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- **Dark/Light Themes** - Automatic theme switching with user preferences
- **Smooth Animations** - 60fps performance with optimized rendering
- **Accessibility** - WCAG compliant with keyboard navigation support

### 📁 File Management System
- **Cloud Integration** - Wasabi S3 storage for documents and media
- **PDF Viewer** - Built-in document viewer with download capabilities
- **Role-based Access** - Different file sets for engineers, salespeople, installers
- **Multi-format Support** - PDF, images, videos, and audio files

### 🎯 Smart Features
- **AI Chat Assistant** - Integrated chatbot for product inquiries
- **System Comparison** - Side-by-side comparison of different AirSmart models
- **Navigation Guide** - Interactive tutorials for first-time users
- **Scroll Sensitivity** - Customizable navigation speed controls

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **3D Graphics** | Three.js, React Three Fiber (@react-three/fiber) |
| **Animation** | Theatre.js, React Spring, Framer Motion |
| **UI Framework** | Material-UI (MUI), Emotion CSS-in-JS |
| **State Management** | React Context, Custom Hooks |
| **File Storage** | Wasabi S3, AWS SDK |
| **Deployment** | Vercel, GitHub Actions |

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **Yarn** 1.22+ or **npm** 8+
- **Git** for version control

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/hoangtuan0201/threejs.git
cd threejs

# 2. Install dependencies
yarn install
# or
npm install

# 3. Start development server
yarn dev --host
# or
npm run dev -- --host

# 4. Open in browser
# Local: http://localhost:5174
# Network: http://your-ip:5174 (for mobile testing)
```

### 🏗️ Build for Production

```bash
# Build optimized production bundle
yarn build

# Preview production build locally
yarn preview

# Analyze bundle size
yarn build --analyze
```

## 📂 Project Architecture

```
src/
├── 🎬 components/           # Reusable React components
│   ├── Scene.jsx           # Main 3D scene container
│   ├── Model.jsx           # 3D model loader with optimizations
│   ├── Hotspot.jsx         # Interactive 3D hotspots
│   ├── FileManagerPopup.jsx # File browser and viewer
│   ├── FloatingChatButton.jsx # AI chat interface
│   └── MobileHomeButton.jsx # Mobile navigation
├── 📄 pages/               # Page-level components
│   ├── Homepage.jsx        # Landing page with hero section
│   └── CompareSystem.jsx   # Product comparison page
├── 🎣 hooks/               # Custom React hooks
│   ├── useMobile.js        # Mobile device detection
│   └── useSceneLock.js     # 3D navigation control
├── 🔧 services/            # External API integrations
│   ├── wasabiService.js    # Cloud storage operations
│   └── filesService.js     # File management utilities
├── 🎨 theme/               # Design system
│   ├── ThemeContext.jsx    # Theme provider and switching
│   ├── ColorModeSelect.jsx # Theme toggle component
│   └── theme.js            # Color palette and typography
├── 📊 data/                # Static data and configurations
│   ├── sequenceChapters.js # 3D scene navigation data
│   └── hiddenObjects.js    # Interactive object definitions
└── 🎭 states/              # Animation states
    └── FlyThrough.json     # Theatre.js animation sequences
```

## 🎮 User Experience

### Desktop Navigation
- **Mouse Controls**: Click and drag to rotate, scroll to zoom
- **Keyboard Shortcuts**: Arrow keys for precise navigation, ESC to exit
- **Hotspot Interaction**: Hover for preview, click for detailed information

### Mobile Experience
- **Touch Gestures**: Pinch to zoom, swipe to navigate
- **Responsive UI**: Optimized button sizes and touch targets
- **Performance**: 60fps on modern mobile devices

### Accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Keyboard Navigation**: Full functionality without mouse
- **High Contrast**: Theme options for visual accessibility

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:


### Customization
- **3D Models**: Replace GLB files in `/public/` directory
- **Hotspot Data**: Modify `/src/data/sequenceChapters.js`
- **Theme Colors**: Update `/src/theme/theme.js`
- **Animation Sequences**: Edit Theatre.js states in `/src/states/`

## 📱 Mobile Optimization

### Performance Features
- **Lazy Loading**: 3D models load progressively
- **Texture Compression**: Optimized for mobile GPUs
- **Battery Efficiency**: Reduced frame rate when inactive
- **Memory Management**: Automatic cleanup of unused resources

### Mobile-Specific UI
- **Touch-Friendly**: Larger buttons and touch targets
- **Gesture Support**: Natural swipe and pinch interactions
- **Responsive Text**: Scalable typography for all screen sizes
- **Offline Support**: Service worker for basic offline functionality

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Netlify
```bash
# Build the project
yarn build

# Deploy dist/ folder to Netlify
# Or connect GitHub repository for auto-deployment
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "3000"]
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow **ESLint** and **Prettier** configurations
- Write **meaningful commit messages**
- Add **JSDoc comments** for complex functions
- Test on **multiple devices** and browsers
- Maintain **60fps performance** standards

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🐛 Troubleshooting

### Common Issues

**3D Model Not Loading**
```bash
# Check if GLB files exist in public directory
ls public/*.glb

# Verify file permissions and size
```

**Mobile Performance Issues**
```javascript
// Reduce quality settings in Scene.jsx
<Canvas gl={{ antialias: false, powerPreference: "high-performance" }}>
```

**File Manager Timeout**
```javascript
// Increase timeout in FileManagerPopup.jsx
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Request timeout')), 30000)
);
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community** - For the amazing 3D web framework
- **React Three Fiber** - For the React integration
- **Theatre.js** - For cinematic animations
- **Material-UI** - For the component library
- **AirSmart Team** - For the product specifications and assets


---


