YÊU CẦU
Empty
In progress
02/03/2025
🎯 Mục tiêu chung:
Phát triển một giao diện 3D tương tác cho trang homepage của hệ thống "A Smart", nơi người dùng có thể khám phá hệ thống điều hòa thông minh thông qua việc scroll hoặc di chuyển tự động camera từ phòng này sang phòng khác, hiển thị các thiết bị và giải thích công dụng.
🏡 Trang chủ (Homepage)
✅ Cấu trúc trang chủ gồm:
Nút 1: Explore the system – Khám phá hệ thống
Nút 2: Compare with traditional – So sánh với hệ thống truyền thống
Nút 3: Download brochures – Tải brochure tài liệu
⚙️ Chi tiết thực hiện:
Khi người dùng nhấn “Explore the system”, sẽ bắt đầu chế độ story mode 3D:
Camera tự động hoặc theo scroll đi từ phòng này sang phòng khác.
Mỗi thiết bị (ví dụ: thermostat, linear grill, ducting, indoor unit) sẽ được giới thiệu thông qua:
Tooltip / floating screen (màn hình nổi)
Mô tả bằng văn bản
Video demo (TV nổi tự động phát)
Hotspot (nút nhỏ có biểu tượng “i”) để xem thêm thông tin / tải tài liệu
🏠 3D Navigation - Điều hướng trong mô hình:
Người dùng có thể scroll lên/xuống hoặc dùng phím mũi tên để di chuyển camera.
Camera sẽ tự động zoom vào thiết bị, ví dụ:
Zoom vào thermostat và hiển thị thông tin, video.
Chuyển sang linear grill, ceiling trở nên trong suốt, hiển thị cách lắp đặt.
Tương tự với round outlet, indoor unit, outdoor unit, smart flow ducting
🧱 Yêu cầu kỹ thuật – Hiển thị mô hình 3D:
Cần sử dụng GLTF/GLB model, file nhẹ, chỉ có tầng trệt nếu không cần tầng lầu.
Tất cả thông tin (video, mô tả, link) có thể dùng tạm bằng dummy text, sẽ thay sau.
TV nổi luôn hướng về người dùng dù camera xoay theo hướng nào.
Ưu tiên tạo 1 file model nhỏ, sử dụng kỹ thuật ẩn/hiện layer để cải thiện hiệu suất.
🖼️ Yêu cầu giao diện và thẩm mỹ:
Cần:
Lighting đẹp, hiệu ứng photorealism (gần giống thật).
Bố cục rõ ràng, có thể có mũi tên hoặc dấu hiệu chỉ định các thiết bị trong trần.
🧪 So sánh hệ thống (Compare)
Đây là một slider tương tác để so sánh hệ thống A Smart với hệ thống truyền thống.
📄 Download brochure
Kết nối với admin panel của A Smart.
Khi sales tải tài liệu lên folder, nội dung sẽ xuất hiện trên trang homepage cho người dùng tải.
🔄 Tùy chọn thay đổi thiết bị (Variation Option)
Sabby đề xuất không làm “one-click variation” phức tạp.
Thay vào đó, chỉ cần hiển thị rằng người dùng có thể chọn round grill thay vì linear grill (bằng ảnh, video, text).
🛠️ Yêu cầu bổ sung và thời gian:
Sabby sẽ gửi video, link, mô tả, nếu chưa có thì dùng placeholder.
Giao diện demo đầu tiên nên hoàn thành trước thứ Tư (Wednesday) để trình bày cho Sabby.
Một số phần của mô hình sẽ được cập nhật, nhưng không ảnh hưởng đến công việc đang làm.