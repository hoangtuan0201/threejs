# Hướng dẫn chạy model mới với Theatre.js + React Three Fiber

## Lưu ý khi chạy một model mới

**Mỗi khi bạn muốn chạy một model mới, hãy làm theo các bước sau:**

1. **Xóa localStorage của trình duyệt**
   - Mở DevTools (F12) → Application → Local Storage → Xóa toàn bộ key liên quan tới dự án Theatre.js.
   - Hoặc chạy lệnh sau trong console trình duyệt:
     ```js
     localStorage.clear()
     ```
   - Việc này giúp tránh xung đột state cũ khi load model mới.

2. **Đổi tên file model và state**
   - Nếu dùng model `HouseCombined.glb`, hãy chắc chắn sử dụng file state `Fly Through.theatre-project-state1.json`.
   - Nếu dùng model `HouseCombined2.glb`, hãy chắc chắn sử dụng file state `Fly Through.theatre-project-state2.json`.
   - Đảm bảo đường dẫn và tên file trong code trùng khớp với model và state bạn muốn sử dụng.

3. **Cập nhật code nếu cần**
   - Đổi tên file model trong prop `src` của component `<Gltf />`:
     ```jsx
     <Gltf src="/HouseCombined.glb" ... /> // dùng state1
     <Gltf src="/HouseCombined2.glb" ... /> // dùng state2
     ```
   - Import đúng file state tương ứng:
     ```js
     import theatreState from "./Fly Through.theatre-project-state1.json";
     // hoặc
     import theatreState from "./Fly Through.theatre-project-state2.json";
     ```

4. **Khởi động lại server nếu cần**
   - Nếu bạn đổi file model hoặc state, hãy khởi động lại server để đảm bảo mọi thứ được load lại từ đầu.

---

## Ví dụ cấu hình cho từng model

**HouseCombined.glb:**
```js
import theatreState from "./Fly Through.theatre-project-state.json";
// ...
<Gltf src="/HouseCombined.glb" ... />
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

