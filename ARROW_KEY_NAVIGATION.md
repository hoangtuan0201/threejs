# Arrow Key Navigation - Enhanced Scene Navigation

## Tổng Quan
Đã thêm arrow key navigation để chuyển cảnh nhanh chóng và cập nhật navigation indicator với hướng dẫn chi tiết.

## Tính Năng Mới

### 🎯 **Arrow Key Controls**

#### **⬅️ Left Arrow**
- **Chức năng**: Di chuyển về phía trước (giảm position)
- **Bước nhảy**: 1.5 units
- **Giới hạn**: Không thể xuống dưới 0.1
- **Sử dụng**: Smooth navigation backward

#### **➡️ Right Arrow**  
- **Chức năng**: Di chuyển về phía sau (tăng position)
- **Bước nhảy**: 1.5 units
- **Giới hạn**: Không thể vượt quá 6.7
- **Sử dụng**: Smooth navigation forward

#### **⬆️ Up Arrow**
- **Chức năng**: Nhảy đến chapter tiếp theo
- **Vị trí**: [0.1, 1, 2.4, 4.3, 6.15]
- **Logic**: Tìm chapter gần nhất và nhảy đến chapter sau
- **Sử dụng**: Quick chapter jumping forward

#### **⬇️ Down Arrow**
- **Chức năng**: Nhảy về chapter trước đó
- **Vị trí**: [0.1, 1, 2.4, 4.3, 6.15]
- **Logic**: Tìm chapter gần nhất và nhảy về chapter trước
- **Sử dụng**: Quick chapter jumping backward

#### **⌨️ ESC Key**
- **Chức năng**: Thoát explore mode
- **Hành động**: Reset scene và quay về homepage
- **Giữ nguyên**: Chức năng cũ không thay đổi

## Code Implementation

### Scene.jsx - Smooth Arrow Key Navigation (useFrame Style)
```javascript
const handleKeyDown = (event) => {
  if (!isExploreMode) return;

  switch (event.key) {
    case 'ArrowLeft':
      // Smooth backward movement using setTargetPosition (like scroll)
      const newPos = Math.max(0.1, targetPosition - 1.5);
      setTargetPosition(newPos);
      break;

    case 'ArrowRight':
      // Smooth forward movement using setTargetPosition (like scroll)
      const newPos = Math.min(6.7, targetPosition + 1.5);
      setTargetPosition(newPos);
      break;

    case 'ArrowUp':
      // Smooth jump to next chapter using setTargetPosition
      const chapterPositions = [0.1, 1, 2.4, 4.3, 6.15];
      const currentIndex = chapterPositions.findIndex(pos => Math.abs(pos - targetPosition) < 0.5);
      if (currentIndex < chapterPositions.length - 1) {
        setTargetPosition(chapterPositions[currentIndex + 1]);
      }
      break;

    case 'ArrowDown':
      // Smooth jump to previous chapter using setTargetPosition
      const chapterPositions = [0.1, 1, 2.4, 4.3, 6.15];
      const currentIndex = chapterPositions.findIndex(pos => Math.abs(pos - targetPosition) < 0.5);
      if (currentIndex > 0) {
        setTargetPosition(chapterPositions[currentIndex - 1]);
      }
      break;
  }
};
```

### App.jsx - Updated Navigation Indicator
```javascript
// Desktop - Detailed controls
<div>
  <div>Navigation Controls:</div>
  <div>🖱️ Scroll - Smooth navigation</div>
  <div>⬅️➡️ Left/Right - Smooth steps</div>
  <div>⬆️⬇️ Up/Down - Smooth chapter jump</div>
  <div>⌨️ ESC - Exit explore mode</div>
</div>

// Mobile - Simple controls
<div>
  <div>👆 Touch & drag to navigate</div>
  <div>⬅️ Swipe ESC to exit</div>
</div>
```

## Chapter Positions

### Predefined Chapter Locations
```javascript
const chapterPositions = [
  0.1,  // Start position (avoid wall clipping)
  1,    // Chapter 1 - Smart Thermostat
  2.4,  // Chapter 2 - Linear Grille  
  4.3,  // Chapter 3 - Air Purification
  6.15  // Chapter 4 - Outdoor Unit
];
```

## Navigation Behavior

### **Smooth Navigation (Left/Right)**
- **Step size**: 1.5 units
- **Animation**: Uses setTargetPosition() + useFrame smooth interpolation
- **Boundaries**: Respects [0.1, 6.7] limits
- **User feedback**: Smooth like scroll navigation

### **Chapter Jumping (Up/Down)**
- **Logic**: Find closest chapter position
- **Jump**: Smooth move to next/previous in array
- **Precision**: Uses Math.abs() for position matching
- **Tolerance**: 0.5 units for position detection

### **Integration với Existing Systems**
- **setTargetPosition**: Sử dụng same system như scroll
- **useFrame**: Smooth interpolation như scroll behavior
- **setHasNavigated**: Track user interaction
- **Theatre.js**: Consistent smooth animation

## UI/UX Improvements

### **Enhanced Navigation Indicator**
- **Desktop**: Detailed control list với icons
- **Mobile**: Simplified touch instructions
- **Responsive**: Adaptive sizing và positioning
- **Visual**: Better typography và spacing

### **Styling Updates**
- **Font size**: Smaller for better fit
- **Text align**: Left-aligned for readability
- **Line height**: Optimized spacing
- **Max width**: Responsive container

## Benefits

### ✅ **User Experience**
- **Quick navigation**: Instant chapter jumping
- **Precise control**: Step-by-step movement
- **Intuitive**: Standard arrow key behavior
- **Accessible**: Keyboard-only navigation

### ✅ **Developer Experience**
- **Reusable**: Uses existing lockScene system
- **Maintainable**: Clean switch statement
- **Extensible**: Easy to add more keys
- **Consistent**: Follows existing patterns

### ✅ **Performance**
- **Efficient**: Minimal event listeners
- **Smooth**: Leverages Theatre.js animations
- **Responsive**: No lag or delay
- **Memory safe**: Proper cleanup

## Usage Instructions

### For Users:
1. **Enter explore mode** - Click "Explore in 3D"
2. **Use arrow keys**:
   - ⬅️➡️ for smooth movement
   - ⬆️⬇️ for chapter jumping
3. **ESC to exit** - Return to homepage

### For Developers:
1. **Customize step size** - Change 1.5 in arrow left/right
2. **Add chapter positions** - Update chapterPositions array
3. **Modify tolerance** - Adjust 0.5 in position detection
4. **Extend keys** - Add more cases to switch statement
