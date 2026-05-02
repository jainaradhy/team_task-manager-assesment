# 🌌 TaskFlow: Enterprise Task Management (Premium Edition)

A high-performance, visually stunning B2B Task Management platform designed for modern product teams. Built with **React**, **Node.js**, and **MongoDB**, featuring a custom-crafted design system and fluid motion design.

---

## ✨ The Premium Experience

*   **🎭 Motion Design System**: Powered by **Framer Motion** for staggered entrance animations, layout transitions, and tactile hover feedback.
*   **🌓 Adaptive Design**: Sophisticated glassmorphism-based UI with deep dark mode support and ultra-crisp typography.
*   **📊 Executive Analytics**: Real-time dashboard with task distribution charts, work ratio metrics, and live activity streams.
*   **🧩 Smart Kanban Engine**: Interactive drag-and-drop workflow with smooth `popLayout` transitions and color-coded priority systems.
*   **🏢 Enterprise RBAC**: Multi-tenant workspace architecture with granular permissions for Admins and Members.
*   **⚡ High-Velocity Filtering**: Instant server-side search, filtering, and sorting for managing complex project backlogs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, Express Validator, Morgan, Helmet |
| **Database** | MongoDB (Mongoose), MongoMemoryServer (Dev Fallback) |
| **Security** | JWT Authentication, Bcrypt Hashing, CORS Protection |

---

## 🔑 Demo Access (Bharat Tech Solutions)

Test the enterprise workspace immediately with pre-seeded data:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Workspace Admin** | `aradhy@bharat.dev` | `Admin@1234` |
| **Senior Member** | `rahul@bharat.dev` | `Member@1234` |

---

## 🚀 Quick Start

### 📦 Prerequisites
- Node.js (v18+)
- MongoDB (or it will automatically fallback to an In-Memory DB)

### 1. Backend Setup
```bash
cd backend
npm install
# Configure .env (see .env.example)
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Configure .env (see .env.example)
npm run dev -- --port 5174
```

---

## 🚀 Production Deployment
If you deploy frontend and backend separately (for example, on Railway), be sure to configure the deployment environment variables exactly as follows:

- **Backend**
  - `MONGODB_URI`: your MongoDB Atlas connection string, e.g. `mongodb+srv://<user>:<password>@cluster0.yourcluster.mongodb.net/<dbname>?retryWrites=true&w=majority`
  - `JWT_SECRET`: a strong random secret
  - `JWT_EXPIRES_IN`: `7d`
  - `CLIENT_URL`: your deployed frontend URL, e.g. `https://overflowing-gratitude-production-6255.up.railway.app`
  - `NODE_ENV`: `production`

- **Frontend**
  - `VITE_API_BASE_URL`: your deployed backend URL including `/api`, e.g. `https://<backend-service>.up.railway.app/api`

> Important: If `VITE_API_BASE_URL` is not set in production, the frontend may try to call `/api/auth/login` on the frontend origin and return `404`.

- **MongoDB Atlas**
  - Make sure your cluster network access allows the connector IPs used by your deployment platform.
  - For testing, add `0.0.0.0/0` temporarily in Atlas IP Access List.

- **Password encoding**
  - If your Atlas password contains special characters like `@` or `#`, URL-encode them in the URI:
    - `@` → `%40`
    - `#` → `%23`

Example backend URI:
```text
mongodb+srv://jainaradhy2004_db_user:07032004Ja%40%23@cluster0.ywarbjq.mongodb.net/task_manager?retryWrites=true&w=majority
```

---

## 🏗️ System Architecture

The application follows a **Modular Monolith** pattern on the backend and a **Context-Driven State Management** approach on the frontend:

- **Frontend**: Clean component separation with a unified Design System in `index.css`.
- **Backend**: Layered architecture (Routes -> Middlewares -> Controllers -> Models).
- **Security**: All API routes are protected by a JWT-based `authMiddleware` and validated via `express-validator`.

---

## 👨‍💻 Recruitment Note

This project demonstrates proficiency in **Full-Stack Engineering**, **Motion Design**, and **Security Best Practices**. It focuses on creating a "SaaS-ready" product feel, moving beyond standard CRUD functionality to provide a truly interactive and responsive user experience.

---

**Built with ❤️ by Aradhy Jain**
# team_task-manager-assesment
