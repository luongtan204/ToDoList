# 📝 ToDo List Application

> **Dự án bài test vị trí Intern Developer**  
> Một ứng dụng Fullstack quản lý công việc (Todo List) hiện đại, tập trung vào hiệu năng, trải nghiệm người dùng (UX/UI) và chất lượng mã nguồn dễ bảo trì.

---

## 🌟 1. Giới thiệu

Dự án này là giải pháp toàn diện cho việc quản lý các tác vụ cá nhân. Không chỉ dừng lại ở mức độ hoàn thành các yêu cầu cơ bản (CRUD), dự án còn được tích hợp các tính năng "điểm cộng" sát với môi trường thực tế như: 
- Phân trang (Pagination) và tìm kiếm (Search) trực tiếp từ phía Backend.
- Xử lý lỗi tập trung (Global Exception Handling) với chuẩn phản hồi JSON thống nhất.
- Đóng gói ứng dụng toàn diện bằng Docker (Multi-stage build).

---

## ⚡ 2. Hướng dẫn cài đặt và chạy nhanh (Quick Start)

Nhờ có Docker, việc chạy dự án cực kỳ dễ dàng mà không cần phải cài đặt Java, Node.js hay Database vào máy tính của bạn.

**Bước 1**: Đảm bảo máy tính của bạn đã cài đặt [Docker](https://www.docker.com/) và Docker Desktop đang mở.

**Bước 2**: Mở Terminal / Command Prompt tại thư mục gốc của dự án (`ToDoList`) và chạy câu lệnh sau:

```bash
docker-compose up --build -d
```

**Bước 3**: Chờ khoảng 1-2 phút để Docker tiến hành build các images. Khi quá trình hoàn tất, bạn có thể truy cập ứng dụng qua trình duyệt:

- 🌐 **Giao diện người dùng (Frontend)**: [http://localhost:3000](http://localhost:3000)
- 🔌 **API Backend (dành cho Postman nếu cần)**: `http://localhost:8080/api/todos`

*(Để tắt ứng dụng, chỉ cần chạy lệnh: `docker-compose down`)*

---

## 🚀 3. Tính năng nổi bật

- ✅ **Hiển thị danh sách công việc**: Tích hợp phân trang (Pagination) từ phía Server.
- ✅ **Thao tác nhanh chóng**: Thêm mới, chỉnh sửa nội dung trực tiếp (Inline-edit) và xóa công việc.
- ✅ **Cập nhật tiến độ**: Đánh dấu trạng thái Hoàn thành / Chưa hoàn thành với chỉ một click.
- ✅ **Tìm kiếm & Bộ lọc thông minh**: Tìm kiếm theo từ khóa (Real-time debounce) và Lọc theo trạng thái.
- ✅ **Bảo vệ toàn vẹn dữ liệu**: Validate dữ liệu chặt chẽ ở cả Frontend và Backend (sử dụng `@ControllerAdvice`).
- ✅ **Giao diện Responsive**: Hiển thị hoàn hảo và mượt mà trên cả thiết bị di động (Mobile) lẫn máy tính (PC).
- ✅ **Độ tin cậy cao**: Đã triển khai viết Unit Test bằng JUnit 5 & Mockito cho tầng Service.

---

## 🛠 4. Công nghệ sử dụng

### 🔹 Backend
- **Java 17 & Spring Boot 3**: Nền tảng mạnh mẽ, hiện đại.
- **Spring Data JPA & H2 Database**: Quản lý CSDL (In-memory) linh hoạt, tiện lợi cho việc test nhanh.
- **JUnit 5 & Mockito**: Kiểm thử phần mềm.
- **Maven**: Quản lý thư viện và build project.

### 🔹 Frontend
- **ReactJS (Vite)**: Tốc độ khởi tạo và build cực nhanh.
- **TailwindCSS (v4)**: Viết CSS nhanh chóng, tạo ra giao diện Minimalism chuẩn Premium.
- **Axios**: Giao tiếp HTTP với Backend.

### 🔹 Deployment & DevOps
- **Docker & Docker Compose**: 
  - Backend sử dụng JRE Alpine siêu nhẹ.
  - Frontend sử dụng Multi-stage build (Node.js) và host bằng Nginx.

---

## 💡 5. Tư duy tổ chức mã nguồn (Architecture & Structure)

Dự án được triển khai theo mô hình **Monorepo** với 2 thư mục `backend` và `frontend` nằm song song. 

**❓ Tại sao lại tổ chức source code như vậy?**

1. **Về kiến trúc tổng thể (Monorepo)**: 
   - Giúp toàn bộ dự án (cả Backend lẫn Frontend) được đồng bộ hóa phiên bản dễ dàng trên cùng một kho lưu trữ (Git).
   - Thiết lập Docker Compose chung ở thư mục gốc giúp việc "Go Live" hệ thống chỉ cần 1 cú click chuột, không cần setup phức tạp ở 2 nơi khác nhau.

2. **Về Backend (Layered Architecture)**:
   - Các logic được phân tách độc lập (Loose Coupling) vào các package chuyên biệt: `controller` (Giao tiếp HTTP), `service` (Logic nghiệp vụ), `repository` (Tương tác CSDL), `dto` (Dữ liệu truyền tải) và `exception` (Xử lý lỗi).
   - Cách chia này tuân thủ nguyên lý thiết kế **SOLID**, giúp code dễ đọc, dễ bảo trì và đặc biệt là rất dễ để viết Unit Test (Sử dụng Mockito để mock Repository khi test Service).

3. **Về Frontend (Component & Service based)**:
   - File gọi API (`services/api.js`) được tách biệt hoàn toàn khỏi giao diện (UI), giúp dễ dàng thay đổi base URL (như khi đưa lên Docker) mà không cần sửa code ở các Component.

### 📁 Sơ đồ thư mục:
```text
📦 ToDoList
 ┣ 📂 backend
 ┃ ┣ 📂 src/main/java/com/todolist/todo
 ┃ ┃ ┣ 📂 controller     # Xử lý Request/Response HTTP
 ┃ ┃ ┣ 📂 dto            # Data Transfer Objects & Validation
 ┃ ┃ ┣ 📂 entity         # Các thực thể ánh xạ tới Database
 ┃ ┃ ┣ 📂 exception      # Xử lý Global Exceptions (400, 404, 500)
 ┃ ┃ ┣ 📂 repository     # Truy vấn dữ liệu với SpEL
 ┃ ┃ ┗ 📂 service        # Core Business Logic
 ┃ ┣ 📜 pom.xml
 ┃ ┗ 📜 Dockerfile       # Build Maven & Run JRE
 ┣ 📂 frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 services       # Cấu hình Axios gọi API
 ┃ ┃ ┣ 📜 App.jsx        # Giao diện chính 
 ┃ ┃ ┗ 📜 index.css      # Cấu hình TailwindCSS
 ┃ ┣ 📜 package.json
 ┃ ┗ 📜 Dockerfile       # Multi-stage Node build & Nginx
 ┣ 📜 docker-compose.yml # Nhạc trưởng liên kết Frontend và Backend
 ┗ 📜 README.md          
```

---

## 🔌 6. API Endpoints

Hệ thống cung cấp các RESTful APIs tuân thủ đúng chuẩn mực, mọi Response đều được bọc trong một chuẩn JSON chung (`code`, `message`, `data`).

| HTTP Method | Endpoint | Mô tả | 
| :--- | :--- | :--- | 
| **GET** | `/api/todos` | Lấy danh sách công việc (hỗ trợ phân trang: `?page=0&size=5`, tìm kiếm: `?keyword=...`, lọc: `?status=...`) |
| **GET** | `/api/todos/{id}` | Lấy chi tiết một công việc theo ID |
| **POST** | `/api/todos` | Tạo mới công việc |
| **PUT** | `/api/todos/{id}` | Cập nhật thông tin công việc (tiêu đề, mô tả, trạng thái) |
| **DELETE**| `/api/todos/{id}` | Xóa công việc khỏi hệ thống |

> 📝 **Ghi chú:** Backend được thiết lập CORS (Cross-Origin Resource Sharing) đầy đủ để cho phép Nginx ở Frontend (cổng 3000) gọi xuống API (cổng 8080) một cách an toàn.

---

## 👨‍💻 Tác giả

**Lương Minh Tân**

Cảm ơn Quý Công ty và Anh/Chị Tuyển dụng đã dành thời gian quý báu để review source code của em. Hy vọng dự án nhỏ này sẽ thể hiện được phần nào năng lực, sự chỉn chu cũng như niềm đam mê của em đối với lập trình. Rất mong có cơ hội được đồng hành, đóng góp và học hỏi tại công ty trong vị trí Intern Developer sắp tới! ✌️
