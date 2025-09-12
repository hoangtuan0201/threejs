# Arrow Key Navigation - Enhanced Scene Navigation

## Tổng Quan
Hệ thống điều hướng bằng phím mũi tên cho phép người dùng di chuyển mượt mà trong scene 3D với các controls trực quan và responsive.

## Tính Năng Chính

### 🎯 **Keyboard Controls**

#### **⬅️ Left Arrow (ArrowLeft)**
- **Chức năng**: Di chuyển backward trong sequence
- **Bước nhảy**: 0.3 units (smooth incremental movement)
- **Giới hạn**: Không thể xuống dưới 0.1
- **Implementation**: Sử dụng `setTargetPosition()` cho smooth animation
- **Range**: 0.1 → 12.5 (toàn bộ sequence)

#### **➡️ Right Arrow (ArrowRight)**  
- **Chức năng**: Di chuyển forward trong sequence
- **Bước nhảy**: 0.3 units (smooth incremental movement)
- **Giới hạn**: Không thể vượt quá 12.5
- **Implementation**: Sử dụng `setTargetPosition()` cho smooth animation
- **Range**: 0.1 → 12.5 (toàn bộ sequence)

#### **⌨️ ESC Key (Escape)**
- **Chức năng**: Thoát explore mode
- **Hành động**: Navigate về `/homepage`
- **Điều kiện**: Chỉ hoạt động khi `isExploreMode = true`
- **Implementation**: `navigate("/homepage")`

## Implementation Details

### Scene.jsx - Keyboard Event Handler
```javascript
// Enhanced keyboard navigation for escape key and arrow keys
useEffect(() => {
  const handleKeyDown = (event) => {
    // Only handle keys in explore mode
    if (!isExploreMode) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        // Navigate back to homepage
        navigate("/homepage");
        break;

      case 'ArrowLeft':
        event.preventDefault();
        // Smooth navigation backward using setTargetPosition (like scroll)
        if (targetPosition > 0.1) {
          const newPosition = Math.max(0.1, targetPosition - 0.3);
          setTargetPosition(newPosition);
          setHasNavigated(true);
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        // Smooth navigation forward using setTargetPosition (like scroll)
        if (targetPosition < 12.5) {
          const newPosition = Math.min(12.5, targetPosition + 0.3);
          setTargetPosition(newPosition);
          setHasNavigated(true);
        }
        break;

      default:
        break;
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [onTourEnd, isExploreMode, targetPosition, setHasNavigated]);
```

### Smooth Animation System
```javascript
// useFrame hook for smooth position interpolation
useFrame(() => {
  if (!isNavigating) {
    if (targetPosition !== sheet.sequence.position) {
      const diff = targetPosition - sheet.sequence.position;
      const speed = 0.02; // Smooth scrolling speed

      if (Math.abs(diff) > 0.001) {
        sheet.sequence.position += diff * speed;
      } else {
        sheet.sequence.position = targetPosition;
      }
    }
  }
});
```

### Chapter Auto-Detection
```javascript
// Auto-show/hide active chapter based on scroll position
const chapterRanges = {
  "Geom3D_393": [1.0, 2.0],      // Smart Thermostat
  "indoor": [2.0, 3.0],          // Linear Grille
  "Air Purification": [7.5, 8.5], // Air Purification
  "Outdoor": [11.3, 12.3]        // Outdoor Unit
};

sequenceChapters.forEach((chapter) => {
  const range = chapterRanges[chapter.id];
  if (range) {
    const [start, end] = range;
    const isInRange = currentPosition >= start && currentPosition <= (end + 0.2);
    
    if (isInRange) {
      setActiveChapter(chapter);
    }
  }
});
```

## Tích Hợp Với Hệ Thống

### Multi-Input Navigation
Arrow key navigation hoạt động song song với:
- **Mouse Wheel**: Scroll mượt mà với sensitivity control
- **Touch Gestures**: Swipe navigation cho mobile
- **Chapter Navigation**: Click navigation buttons
- **Hotspot Clicks**: Direct navigation to specific positions

### State Management
```javascript
const [targetPosition, setTargetPosition] = useState(0);
const [hasNavigated, setHasNavigated] = useState(false);
const [isRestoring, setIsRestoring] = useState(false);
```

### Responsive Behavior
- **Desktop**: Full keyboard support với arrow keys
- **Mobile**: Touch-first navigation, keyboard secondary
- **Tablet**: Hybrid approach với cả touch và keyboard

### Performance Optimization
- **Event Prevention**: `event.preventDefault()` để tránh browser defaults
- **Smooth Interpolation**: useFrame với easing cho animation mượt
- **Range Limiting**: Strict bounds checking (0.1 - 12.5)
- **State Tracking**: `setHasNavigated(true)` để track user interaction

## Navigation Behavior

### **Smooth Movement (Left/Right)**
- **Step size**: 0.3 units (optimized sensitivity)
- **Animation**: Uses `setTargetPosition()` + `useFrame` smooth interpolation
- **Boundaries**: Respects [0.1, 12.5] limits
- **User feedback**: Smooth như scroll navigation
- **Condition**: Chỉ hoạt động khi `isExploreMode = true`

### **Exit Navigation (ESC)**
- **Action**: Immediate navigation về homepage
- **Method**: `navigate("/homepage")`
- **No Animation**: Direct route change
- **Clean Exit**: Proper state cleanup

### **Integration với Theatre.js**
- **Sequence Position**: Direct control qua `sheet.sequence.position`
- **Smooth Interpolation**: useFrame với speed = 0.02
- **Chapter Detection**: Auto-show/hide dựa trên position ranges
- **State Sync**: Consistent với scroll và touch navigation

## Wheel & Touch Integration

### Mouse Wheel Navigation
```javascript
useEffect(() => {
  const handleWheel = (event) => {
    if (!isExploreMode || isNavigating || isChatFocused) return;
    
    event.preventDefault();
    const delta = event.deltaY * 0.001 * scrollSensitivity;
    const newPosition = Math.max(0.1, Math.min(12.5, targetPosition + delta));
    
    setTargetPosition(newPosition);
    setHasNavigated(true);
  };

  document.addEventListener('wheel', handleWheel, { passive: false });
  return () => document.removeEventListener('wheel', handleWheel);
}, [isExploreMode, isNavigating, targetPosition, scrollSensitivity, isChatFocused]);
```

### Touch Navigation
```javascript
useEffect(() => {
  const handleTouchStart = (event) => {
    if (!isExploreMode || isNavigating || isChatFocused) return;
    setTouchStartY(event.touches[0].clientY);
  };

  const handleTouchMove = (event) => {
    if (!isExploreMode || isNavigating || touchStartY === null || isChatFocused) return;
    
    event.preventDefault();
    const touchY = event.touches[0].clientY;
    const deltaY = (touchStartY - touchY) * 0.01 * scrollSensitivity;
    const newPosition = Math.max(0.1, Math.min(12.5, targetPosition + deltaY));
    
    setTargetPosition(newPosition);
    setHasNavigated(true);
  };

  document.addEventListener('touchstart', handleTouchStart, { passive: false });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  
  return () => {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
  };
}, [isExploreMode, isNavigating, targetPosition, touchStartY, scrollSensitivity, isChatFocused]);
```

## Troubleshooting & Debug

### Common Issues

#### **Keys Not Responding**
- **Check**: `isExploreMode` state phải là `true`
- **Verify**: Event listeners được attach properly
- **Debug**: Console log trong `handleKeyDown`

#### **Jerky Movement**
- **Adjust**: `speed = 0.02` trong useFrame
- **Check**: `targetPosition` updates
- **Optimize**: Reduce calculation overhead

#### **Range Violations**
- **Verify**: Position bounds (0.1 - 12.5)
- **Check**: `Math.max()` và `Math.min()` logic
- **Debug**: Log position values

### Debug Commands
```javascript
// Debug current state
console.log('Target Position:', targetPosition);
console.log('Current Position:', sheet.sequence.position);
console.log('Is Explore Mode:', isExploreMode);
console.log('Has Navigated:', hasNavigated);

// Debug key events
const handleKeyDown = (event) => {
  console.log('Key pressed:', event.key);
  console.log('Explore mode:', isExploreMode);
  // ... rest of handler
};
```

## Best Practices

### Development
- **Event Cleanup**: Always remove event listeners trong cleanup
- **State Management**: Use functional updates cho `setTargetPosition`
- **Performance**: Minimize calculations trong useFrame
- **Accessibility**: Maintain keyboard navigation standards

### User Experience
- **Smooth Transitions**: 0.3 unit steps cho responsive feel
- **Visual Feedback**: Active chapter indicators
- **Consistent Behavior**: Same logic across input methods
- **Mobile Consideration**: Touch-first design approach

## Usage Instructions

### For Users:
1. **Enter explore mode** - Click "Explore in 3D"
2. **Use arrow keys**:
   - ⬅️➡️ for smooth movement (0.3 units per press)
   - ⌨️ ESC to exit và return to homepage
3. **Combine inputs** - Use với mouse scroll và touch gestures

### For Developers:
1. **Customize step size** - Change 0.3 trong arrow handlers
2. **Adjust speed** - Modify 0.02 trong useFrame interpolation
3. **Extend range** - Update 12.5 max position limit
4. **Add features** - Extend switch statement cho more keys

## Technical Specifications

### Dependencies
- **React**: useEffect, useState hooks
- **React Router**: navigate function
- **React Three Fiber**: useFrame hook
- **Theatre.js**: sheet.sequence.position control

### Performance Metrics
- **Event Response**: < 16ms (60fps)
- **Smooth Animation**: 0.02 interpolation speed
- **Memory Usage**: Minimal với proper cleanup
- **Browser Support**: Modern browsers với keyboard events
