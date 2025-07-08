# Hướng dẫn sử dụng và chuyển đổi Model 3D với Theatre.js

Dự án này sử dụng React Three Fiber để hiển thị model 3D và Theatre.js để tạo các chuỗi animation cho camera. Tài liệu này hướng dẫn cách chuyển đổi giữa các model và các file animation tương ứng.

## Cấu trúc thư mục quan trọng

-   `public/models/`: Nơi chứa các file model 3D (`.glb`, `.gltf`).
-   `src/states/`: Nơi chứa các file trạng thái animation của Theatre.js (`.json`).
-   `src/components/Model.jsx`: Component chịu trách nhiệm tải và hiển thị model 3D.
-   `src/App.jsx`: Component chính, nơi import và cấu hình state cho Theatre.js.

---

## Quy trình chuyển đổi Model và Animation

Để sử dụng một model và animation mới, hãy làm theo các bước sau:

### 1. Chuẩn bị tài sản (Assets)

-   **Model**: Đặt file `.glb` của bạn vào thư mục `public/models/`.
-   **State**: Đặt file `.json` của Theatre.js vào thư mục `src/states/`.

### 2. Cập nhật mã nguồn (Code)

-   **Trong `src/components/Model.jsx`**:
    Thay đổi đường dẫn trong hook `useGLTF` để trỏ đến file model mới của bạn.
    ```jsx
    // src/components/Model.jsx
    const { scene } = useGLTF("/models/TEN_MODEL_CUA_BAN.glb");
    ```

-   **Trong `src/App.jsx`**:
    Thay đổi câu lệnh `import` để trỏ đến file state JSON mới.
    ```jsx
    // src/App.jsx
    import theatreState from "./states/TEN_STATE_CUA_BAN.json";
    ```

### 3. Xóa Local Storage

Theatre.js lưu trạng thái vào Local Storage của trình duyệt. Để tránh xung đột state cũ, hãy xóa nó trước khi chạy.

-   Mở DevTools (F12) → Tab "Application" → "Local Storage".
-   Chuột phải vào trang của bạn và chọn "Clear".
-   Hoặc chạy lệnh sau trong Console: `localStorage.clear()`

### 4. Khởi động lại Server

Khởi động lại server phát triển để đảm bảo tất cả các thay đổi được áp dụng.

---

## Ví dụ cấu hình cho từng model

**Model: `HouseCombined.glb`**
```jsx
// Trong src/components/Model.jsx
useGLTF("/HouseCombined.glb");

// Trong src/App.jsx
import theatreState from "./states/Fly Through.theatre-project-state.json";
```

**HouseCombined2.glb:**
```js
import theatreState from "./Fly Through.theatre-project-state2.json";
// ...
<Gltf src="/HouseCombined2.glb" ... />
```

---

## Tóm tắt

- **Luôn xóa localStorage khi đổi model/state.**
- **Đảm bảo tên file model và file state khớp nhau.**
- **Cập nhật code đúng đường dẫn model và state.**

---
