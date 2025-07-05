# Compare Systems Page Documentation

## 📋 **Overview**
Trang Compare Systems được thiết kế để so sánh AirSmart với Traditional Systems, sử dụng cùng phong cách design như Homepage với màu sắc và animation tương tự.

## 🎨 **Design System**

### **Color Scheme (Giống Homepage)**
- **Background**: `linear-gradient(oklch(0.2 0.0122 237.44) 0px, oklch(0.36 0.0088 219.71) 100%)`
- **AirSmart Color**: `#ff6b35` (Orange)
- **Traditional Color**: `#666` (Gray)
- **Text Colors**: 
  - Primary: `rgba(255, 255, 255, 0.9)`
  - Secondary: `rgba(200, 200, 200, 0.9)`
  - Labels: `#ff6b35`

### **Typography & Effects**
- **Hero Title**: Shimmer animation với gradient text
- **Cards**: Glass morphism với backdrop blur
- **Buttons**: Gradient backgrounds với hover effects
- **3D Models**: Rotating placeholder boxes

## 🏗️ **Component Structure**

### **File Location**
```
src/pages/CompareSystem.jsx
```

### **Main Sections**
1. **Header Navigation** - Logo + Back button
2. **Hero Section** - Title + Subtitle
3. **Comparison Cards** - AirSmart vs Traditional
4. **Navigation Controls** - Arrow buttons + slide indicators
5. **Interactive Button** - 3D Components access

## 🎯 **Features**

### **Comparison Data Structure**
```javascript
const comparisonData = [
  {
    id: 1,
    airsmart: {
      title: "AIRSMART THERMOSTAT",
      image: "Smart Thermostat",
      dimensions: "4\" x 4\" x 1\"",
      features: "AI-powered learning algorithms, 7\" touch display...",
      benefits: "30% energy savings, predictive climate control",
      color: "#ff6b35"
    },
    traditional: {
      title: "TRADITIONAL THERMOSTAT", 
      image: "Basic Thermostat",
      dimensions: "5\" x 3\" x 2\"",
      features: "Manual controls, basic 7-day programming...",
      limitations: "No learning capability, limited scheduling options",
      color: "#666"
    }
  }
];
```

### **3D Model Placeholders**
- **AirSmart**: Orange background với rotating white box
- **Traditional**: Gray background với rotating white box
- **Animation**: `rotate` keyframe - 6s cho AirSmart, 8s cho Traditional

### **Navigation System**
- **Arrow Buttons**: Left/Right navigation giữa slides
- **Slide Indicators**: Dots ở bottom để jump to specific slide
- **Back Button**: Return to Homepage

## 🎮 **User Interactions**

### **Navigation Controls**
- **Left Arrow**: Previous slide
- **Right Arrow**: Next slide  
- **Slide Dots**: Direct navigation to specific slide
- **Back Button**: Return to Homepage

### **Responsive Design**
- **Mobile**: Column layout cho comparison cards
- **Desktop**: Row layout với side-by-side comparison
- **Arrows**: Positioned outside cards on desktop, inside on mobile

## 🔄 **State Management**

### **App.jsx Integration**
```javascript
// States
const [showCompareSystem, setShowCompareSystem] = useState(false);

// Functions
const showCompare = () => {
  setShowControlPanel(false);
  setShowCompareSystem(true);
};

const backToHome = () => {
  setShowControlPanel(true);
  setShowCompareSystem(false);
};

// Global navigation setup
window.onCompare = showCompare;
```

### **Homepage Connection**
```javascript
// Homepage.jsx
const handleClick = (type) => {
  if (type === "compare") {
    if (window.onCompare) {
      window.onCompare();
    }
  }
};
```

## 🎨 **Animation System**

### **Keyframes**
```javascript
const fadeInUp = keyframes`...`;      // Entry animation
const gradientShift = keyframes`...`; // Background animation
const rotate = keyframes`...`;        // 3D model rotation
const shimmer = keyframes`...`;       // Title text effect
```

### **Transition Effects**
- **Page Entry**: fadeInUp với 1s duration
- **Card Hover**: Transform scale + shadow effects
- **Button Hover**: Color transitions + translateY
- **Arrow Hover**: Scale + color change

## 📱 **Responsive Behavior**

### **Breakpoints**
- **xs**: Mobile phones (< 600px)
- **sm**: Small tablets (600px - 960px)  
- **md**: Desktop (960px+)

### **Layout Changes**
- **Mobile**: Stacked cards, smaller arrows
- **Desktop**: Side-by-side cards, larger arrows
- **Typography**: Responsive font sizes
- **Spacing**: Adaptive padding/margins

## 🚀 **Future Enhancements**

### **Planned Features**
1. **Real 3D Models**: Replace placeholder boxes với actual 3D models
2. **More Comparisons**: Add more product comparison slides
3. **Interactive 3D**: Click to rotate/explore models
4. **Specifications**: Detailed tech specs comparison
5. **Performance Metrics**: Charts và graphs

### **Data Expansion**
- **Multiple Products**: Air purifiers, HVAC systems, sensors
- **Detailed Specs**: Technical specifications table
- **Performance Data**: Energy efficiency charts
- **User Reviews**: Customer testimonials

## 🎯 **Current Status**

### ✅ **Completed**
- [x] Basic layout và design system
- [x] Navigation between Homepage và Compare page
- [x] Responsive design implementation
- [x] Animation system setup
- [x] Placeholder 3D models
- [x] Slide navigation system

### 🔄 **In Progress**
- [ ] Real 3D model integration
- [ ] Additional comparison data
- [ ] Interactive 3D components

### 📋 **Next Steps**
1. Add real 3D models to replace placeholders
2. Expand comparison data với more products
3. Implement interactive 3D model viewer
4. Add performance charts và metrics
5. Create detailed specifications comparison

## 🎨 **Design Consistency**

### **Maintained Elements từ Homepage**
- ✅ Same color scheme (oklch gradients)
- ✅ Same typography system
- ✅ Same animation keyframes
- ✅ Same button styles
- ✅ Same header navigation
- ✅ Same responsive breakpoints
- ✅ Same glass morphism effects

### **Brand Consistency**
- **Logo**: Same AirSmart logo
- **Colors**: Consistent orange (#ff6b35) theme
- **Typography**: Same font weights và sizes
- **Spacing**: Consistent padding/margin system
- **Shadows**: Same shadow system
- **Borders**: Same border radius values
