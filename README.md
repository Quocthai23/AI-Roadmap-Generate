# 🚀 AI-Roadmap-Generate

> **An AI-powered assistant that automatically generates interactive learning Roadmaps for any topic.**

![AI Roadmap Demo](https://i.imgur.com/example-banner.png) *(Add your Demo screenshot here)*

AI-Roadmap-Generate is an open-source web application built with Next.js, NestJS, and Google Gemini AI. Unlike commercial platforms, it is designed for **self-hosting** and supports **BYOK (Bring Your Own Key)**. Your data and API Keys remain entirely under your control.

---

## ✨ Features
- **⚡ Bring Your Own Key (BYOK)**: No development setup required. Open the web app, click the **Settings (⚙️)** button, and paste your Google Gemini API Key. The key is only saved locally in your browser.
- **🐳 Docker Integration**: Run both Frontend and Backend services instantly with a single command.
- **🤖 Contextual Explanation**: AI doesn't just draw maps; it explains learning nodes in-depth inside the Sidebar panel.
- **🎨 ChatGPT-Style Interface**: Modern, minimalist, and clean UI/UX design.
- **📸 Export Feature**: High-quality PNG export for your generated roadmaps.

---

## 🛠️ Installation & Setup

### 🐳 Option 1: Run with Docker (Recommended)
You do not need to install Node.js locally. You only need Docker installed on your machine.

```bash
git clone https://github.com/Quocthai23/AI-Roadmap-Generate.git
cd AI-Roadmap-Generate
docker-compose up -d
```
The application will automatically build and start:
- Frontend (Web UI): `http://localhost:3001`
- Backend (API Server): `http://localhost:3000`

### 💻 Option 2: Manual Development Setup
Run the services manually using Node.js.

**Start the Backend (NestJS):**
```bash
cd backend
npm install
npm run start:dev
```
*Note: By default, the backend will receive the API Key dynamically from the UI, but you can also create a `.env` file in the `backend/` directory and add `GEMINI_API_KEY=your_key`.*

**Start the Frontend (Next.js):**
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Automate CI/CD to Docker Hub
This project includes a pre-configured GitHub Actions workflow (`.github/workflows/docker-publish.yml`).
To automate Docker Hub building and pushing on every push to the `main` branch:
1. Go to your GitHub repository > **Settings** > **Secrets and variables** > **Actions**.
2. Add the following secrets:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username.
   - `DOCKERHUB_TOKEN`: Your Docker Hub Access Token (make sure it has **Read, Write** permissions).

---

## 🤝 Contributing
Contributions (Pull Requests, Issues) are highly welcome!

## 📝 License
This project is licensed under the MIT License.
