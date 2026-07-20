# 🚀 AI-Roadmap-Generate

> **Trợ lý AI giúp bạn tự động sinh Bản đồ tư duy (Roadmap) vô tận cho mọi lĩnh vực.**

![AI Roadmap Demo](https://i.imgur.com/example-banner.png) *(Thêm ảnh Demo của bạn vào đây)*

AI-Roadmap-Generate là một ứng dụng mã nguồn mở sử dụng Next.js, NestJS và Google Gemini AI. Khác với các nền tảng tính phí, dự án này được thiết kế ưu tiên cho việc **Self-Host (Tự triển khai)** và **BYOK (Bring Your Own Key)**. Dữ liệu và API Key của bạn hoàn toàn nằm trong quyền kiểm soát của bạn.

---

## ✨ Điểm nổi bật
- **⚡ Bring Your Own Key (BYOK)**: Bạn không cần cài đặt code để dùng thử. Mở web, bấm vào nút **Cài đặt (⚙️)** và dán Google Gemini API Key của bạn vào. API Key chỉ lưu trên trình duyệt của bạn.
- **🐳 Tích hợp sẵn Docker**: Chạy trọn bộ cả Frontend và Backend siêu dễ dàng bằng 1 dòng lệnh duy nhất.
- **🤖 Contextual Explanation**: AI không chỉ vẽ sơ đồ mà còn giải thích các nhánh kiến thức một cách sâu sắc ở thanh Sidebar.
- **🎨 Giao diện ChatGPT Style**: Trải nghiệm UI/UX tối giản, chuyên nghiệp và mượt mà nhất.
- **📸 Xuất file cực nét**: Tải xuống toàn bộ bản đồ học tập dưới dạng ảnh (PNG).

---

## 🛠️ Hướng dẫn Cài đặt & Triển khai

### 🐳 Cách 1: Chạy bằng Docker (Khuyên dùng)
Bạn không cần phải cài đặt Node.js, chỉ cần máy tính (hoặc server) có Docker.

```bash
git clone https://github.com/Quocthai23/AI-Roadmap-Generate.git
cd AI-Roadmap-Generate
docker-compose up -d
```
Ứng dụng sẽ tự động tải, cài đặt và khởi chạy:
- Giao diện Web (Frontend) ở: `http://localhost:3001`
- Máy chủ (Backend) ở: `http://localhost:3000`

### 💻 Cách 2: Chạy thủ công cho Lập trình viên
Nếu bạn muốn sửa code, hãy chạy thủ công bằng Node.js.

**Khởi chạy Backend (NestJS):**
```bash
cd backend
npm install
npm run start:dev
```
*Lưu ý: Mặc định backend sẽ nhận API Key từ UI, nhưng bạn cũng có thể tạo file `.env` ở thư mục `backend/` và thêm `GEMINI_API_KEY=your_key`.*

**Khởi chạy Frontend (Next.js):**
Mở Terminal thứ 2:
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Tự động hóa CI/CD lên Docker Hub
Dự án được tích hợp sẵn luồng Github Actions (`.github/workflows/docker-publish.yml`).
Để cấu hình Github tự động Build & Push lên Docker Hub của bạn mỗi khi bạn push code:
1. Vào kho lưu trữ Github của bạn > **Settings** > **Secrets and variables** > **Actions**.
2. Thêm 2 biến môi trường:
   - `DOCKERHUB_USERNAME`: Tên tài khoản Docker Hub.
   - `DOCKERHUB_TOKEN`: Access Token (hoặc Password) Docker Hub của bạn.

---

## 🤝 Đóng góp
Dự án phân phối miễn phí và rất hoan nghênh các đóng góp (Pull Request, Issues)!

## 📝 Giấy phép
Dự án thuộc giấy phép MIT.
