# 🚀 AI-Roadmap-Generate

AI-Roadmap-Generate là một ứng dụng Web thông minh cho phép người dùng nhập một chủ đề bất kỳ và ngay lập tức tạo ra một **Bản đồ tư duy (Roadmap) vô tận** nhờ sức mạnh của AI (Google Gemini).

Người dùng có thể click vào dấu `+` để đào sâu kiến thức và bấm vào từng ô để xem giải thích chi tiết kèm ví dụ Code.

![AI Roadmap Demo](https://i.imgur.com/example-banner.png) *(Thêm ảnh Demo của bạn vào đây)*

---

## ✨ Tính năng nổi bật
- **⚡ Lazy-Loading thông minh**: Chỉ tải nhánh con khi người dùng yêu cầu, giúp sơ đồ không bao giờ bị rối mắt hay lag giật (tránh Information Overload).
- **🤖 Contextual Explanation**: AI tự động hiểu ngữ cảnh của nhánh con (ví dụ: `Javascript > Asynchronous > Event loop`) để giải thích siêu chính xác ở một Side Panel cực kỳ đẹp mắt.
- **🎨 Trải nghiệm Premium**: Giao diện thiết kế theo chuẩn Glassmorphism (Kính mờ) tuyệt đẹp với Tailwind CSS.
- **🚀 Caching mượt mà**: Đã tích hợp tính năng LocalStorage Cache. Các nhánh từng mở hoặc xem sẽ được lưu lại, giúp tải lại trong vòng **0.1s** mà không tốn phí gọi API lần 2.
- **📸 Xuất ảnh PNG**: Tính năng Download Roadmap siêu nét bằng 1 click.

---

## 🛠️ Công nghệ sử dụng
* **Frontend**: Next.js 15, React Flow, Tailwind CSS, Tailwind Typography, Dagre (Auto Layout).
* **Backend**: NestJS, @google/generative-ai.
* **AI Model**: `gemini-flash-latest` (Nhanh & Tối ưu cho JSON Output).

---

## 💻 Hướng dẫn Cài đặt & Chạy dự án (Local)

### Bước 1: Clone dự án
```bash
git clone https://github.com/Quocthai23/AI-Roadmap-Generate.git
cd AI-Roadmap-Generate
```

### Bước 2: Thiết lập Backend (NestJS)
```bash
cd backend
npm install
```
*Tạo file `.env` ở thư mục `backend/` và nhập API Key của bạn (Lấy tại Google AI Studio):*
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*Khởi chạy Backend (Server chạy ở cổng 3000):*
```bash
npm run start:dev
```

### Bước 3: Thiết lập Frontend (Next.js)
Mở một Terminal (CMD) mới:
```bash
cd frontend
npm install
npm run dev
```

### Bước 4: Trải nghiệm!
Mở trình duyệt truy cập: **`http://localhost:3001`** (hoặc 3000).

---

## 🤝 Đóng góp
Mọi đóng góp (Pull Request, Issues) đều được chào đón! Hãy cùng nhau xây dựng cộng đồng học tập thông minh.

## 📝 Giấy phép
Dự án được phân phối dưới giấy phép MIT.
