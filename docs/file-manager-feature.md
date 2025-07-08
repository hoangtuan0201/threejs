# File Manager Feature

## Overview
Tính năng File Manager cho phép người dùng xem và quản lý files trực tiếp trên trang web mà không cần chuyển tab hoặc mở ứng dụng khác.

## Features

### 📁 **File Manager Popup**
- **Floating Button**: Button folder icon ở góc phải màn hình
- **File List**: Hiển thị danh sách files với thông tin chi tiết
- **Search**: Tìm kiếm files theo tên
- **File Types**: Hỗ trợ PDF, DOC, Excel, Images
- **File Info**: Size, date, type cho mỗi file

### 👁️ **File Viewer**
- **In-app Preview**: Xem file trực tiếp trong popup
- **Zoom Controls**: Zoom in/out, fit to screen
- **Page Navigation**: Điều hướng trang cho PDF
- **Download**: Tải file về máy
- **Print**: In file trực tiếp
- **Fullscreen**: Xem toàn màn hình

### 🎨 **UI/UX Features**
- **Responsive Design**: Tối ưu cho mobile và desktop
- **Dark/Light Mode**: Tự động theo theme của app
- **Smooth Animations**: Transitions mượt mà
- **Loading States**: Loading indicators khi cần
- **Error Handling**: Xử lý lỗi gracefully

## Components

### 1. FileManagerButton
```jsx
<FileManagerButton
  position={{ bottom: 100, right: 24 }}
  folderName="Salesperson"
  userRole="Engineer"
/>
```

### 2. FileManagerPopup
- Main dialog hiển thị danh sách files
- Search functionality
- File type icons
- Action buttons (view, download)

### 3. FileViewerDialog
- Full-featured file viewer
- Zoom controls
- Page navigation
- Toolbar với các tools

## Usage

### Basic Implementation
```jsx
import FileManagerButton from './components/FileManagerButton';

function App() {
  return (
    <div>
      {/* Your app content */}
      
      <FileManagerButton
        position={{ bottom: 100, right: 24 }}
        folderName="Documents"
        userRole="Engineer"
      />
    </div>
  );
}
```

### Custom Configuration
```jsx
<FileManagerButton
  position={{ bottom: 150, right: 30 }}
  folderName="Sales Materials"
  userRole="Sales Manager"
/>
```

## File Types Supported

| Type | Icon | Preview | Download |
|------|------|---------|----------|
| PDF | 📄 | ✅ | ✅ |
| DOC/DOCX | 📝 | ✅ | ✅ |
| Excel | 📊 | ❌ | ✅ |
| Images | 🖼️ | ✅ | ✅ |
| Others | 📁 | ❌ | ✅ |

## Integration Points

### 1. App.jsx
```jsx
// Added to main app
<FileManagerButton
  position={{ bottom: 100, right: 24 }}
  folderName="Salesperson"
  userRole="Engineer"
/>
```

### 2. Theme Integration
- Sử dụng theme colors và styles
- Responsive với mobile utilities
- Dark/light mode support

### 3. File Structure
```
src/components/
├── FileManagerButton.jsx     # Main floating button
├── FileManagerPopup.jsx      # File list dialog
└── FileViewerDialog.jsx      # File preview dialog

public/sample-files/
└── readme.txt               # Sample files for demo
```

## Demo Data
Hiện tại sử dụng mock data với các files mẫu:
- AirSmart User Manual (PDF)
- Installation Guide (PDF)
- Product Specifications (Excel)
- Marketing Brochure (Image)
- Test Documents (DOC)

## Future Enhancements

### 🔄 **API Integration**
- Connect to real file server/API
- User authentication
- File upload functionality
- Real-time file sync

### 📱 **Mobile Optimizations**
- Touch gestures for zoom/pan
- Mobile-specific UI adjustments
- Offline file caching

### 🔍 **Advanced Features**
- File categories/folders
- Advanced search filters
- File sharing capabilities
- Version control
- Comments/annotations

### 🛡️ **Security**
- File access permissions
- Secure file URLs
- Audit logging
- Virus scanning

## Technical Notes

### Dependencies
- Material-UI components
- React hooks for state management
- Theme context for styling
- Mobile utilities for responsive design

### Performance
- Lazy loading for large file lists
- Virtual scrolling for many files
- Optimized image loading
- Caching strategies

### Browser Support
- Modern browsers with ES6+ support
- PDF.js for PDF viewing
- Canvas API for image manipulation
- File API for downloads

## Testing
1. Click folder icon ở góc phải
2. Browse file list
3. Search for files
4. Click view icon để preview
5. Test zoom, download, print functions
6. Test responsive design trên mobile

Tính năng này cung cấp trải nghiệm file management hoàn chỉnh ngay trong ứng dụng AirSmart!
