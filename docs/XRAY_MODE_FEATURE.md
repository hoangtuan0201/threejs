# X-Ray Mode Feature Documentation

## Tổng quan
X-Ray Mode là tính năng cho phép người dùng xem xuyên qua cấu trúc tòa nhà để quan sát các hệ thống HVAC bên trong. Tính năng này cung cấp trải nghiệm 3D tương tác với khả năng điều hướng camera và hiển thị thông tin chi tiết về từng thành phần.

## Cấu trúc File
- **File chính**: `src/pages/X-ray.jsx`
- **Route**: `/x-ray`
- **Component**: `XRayMode`

## Các thành phần chính

### 1. HVAC_POSITIONS
Định nghĩa vị trí và thông tin của 5 thành phần HVAC:
```javascript
const HVAC_POSITIONS = {
  FCU: { position: [2, 3, 1], label: 'Fan Coil Unit' },
  CDU: { position: [-2, 2, -1], label: 'Condensing Unit' },
  Thermostat: { position: [0, 1.5, 2], label: 'Thermostat' },
  Grilles: { position: [1, 2.5, -2], label: 'Air Grilles' },
  Ducts: { position: [-1, 3.5, 0], label: 'Ductwork' }
};
```

### 2. Hotspot Component
- Hiển thị các điểm tương tác dạng hình cầu
- Animation xoay và nhấp nháy
- Thay đổi màu sắc khi được chọn (trắng → đỏ)
- Hiển thị label với HTML overlay

### 3. CameraController Component
- Điều khiển animation camera khi click hotspot
- Thời gian animation: 2 giây
- Sử dụng interpolation mượt mà

### 4. BuildingModel Component
- Load model 3D từ `/3ddd.glb`
- Xử lý chế độ transparent (opacity 50%)
- Highlight thành phần được chọn

## Tính năng chính

### 1. Chế độ xem 3D
- **OrbitControls**: Cho phép xoay, zoom, pan
- **Camera**: Vị trí mặc định [5, 5, 5], FOV 60°
- **Lighting**: Ambient light + Directional light

### 2. Hotspot tương tác
- 5 hotspot cho các thành phần HVAC
- Click để kích hoạt X-Ray mode
- Animation bay đến thành phần được chọn

### 3. X-Ray Mode
- Tòa nhà chuyển sang transparent
- Thành phần được chọn được highlight
- Hiển thị thông tin chi tiết

### 4. UI Controls
- **Toggle Hotspots**: Hiện/ẩn các hotspot
- **Exit X-Ray**: Thoát khỏi chế độ X-Ray
- **Close**: Quay về trang chủ

## State Management

```javascript
const [isXRayMode, setIsXRayMode] = useState(false);
const [activeComponent, setActiveComponent] = useState(null);
const [cameraTarget, setCameraTarget] = useState(null);
const [showHotspots, setShowHotspots] = useState(true);
```

## Workflow

1. **Khởi tạo**: Hiển thị mô hình 3D với 5 hotspot
2. **Click hotspot**: 
   - Kích hoạt X-Ray mode
   - Camera bay đến vị trí thành phần
   - Tòa nhà chuyển transparent
   - Hiển thị thông tin thành phần
3. **Exit X-Ray**: Quay về trạng thái ban đầu
4. **Toggle hotspots**: Hiện/ẩn các điểm tương tác

## Styling & Theme
- Sử dụng Material-UI components
- Tích hợp với ThemeContext
- Responsive design
- Backdrop blur effects
- Gradient backgrounds

## Performance
- Model preloading với `useGLTF.preload()`
- Optimized rendering với Three.js
- Smooth animations với useFrame

## Cách sử dụng

### Truy cập
- Từ trang chủ: Click nút "X-Ray Mode"
- Direct URL: `http://localhost:5175/x-ray`

### Điều khiển
- **Mouse**: Xoay, zoom, pan mô hình
- **Click hotspot**: Kích hoạt X-Ray cho thành phần
- **Toggle button**: Hiện/ẩn hotspots
- **Exit button**: Thoát X-Ray mode
- **Close button**: Quay về trang chủ

## Tích hợp

### Router
```javascript
// AppRouter.jsx
<Route path="/x-ray" element={<XRayMode />} />
```

### Navigation
```javascript
// Homepage.jsx
<Button onClick={() => navigate('/x-ray')}>
  X-Ray Mode
</Button>
```

## Dependencies
- `@react-three/fiber`: 3D rendering
- `@react-three/drei`: 3D utilities
- `@mui/material`: UI components
- `three`: 3D library
- `react-router-dom`: Navigation

## Customization

### Thêm thành phần HVAC mới
1. Cập nhật `HVAC_POSITIONS`
2. Thêm logic xử lý trong `handleHotspotClick`
3. Cập nhật thông tin hiển thị

### Thay đổi animation
- Điều chỉnh `duration` trong CameraController
- Modify animation logic trong useFrame

### Styling
- Cập nhật theme colors
- Điều chỉnh Material-UI sx props
- Thay đổi hotspot appearance

## Troubleshooting

### Model không load
- Kiểm tra file `/3ddd.glb` trong public folder
- Verify model format và size

### Performance issues
- Giảm số lượng hotspots
- Optimize model geometry
- Adjust rendering settings

### Camera animation không mượt
- Kiểm tra targetPosition calculation
- Adjust animation duration
- Verify useFrame implementation