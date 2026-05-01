# Bharat Task Manager (SaaS Edition) 🇮🇳

A production-ready, multi-tenant B2B Task Management platform built for high-performing teams. This edition features the **Bharat Tech Solutions** localized demo workspace.

---

## 🚀 Key Features

* **Dual View Workflow:** Switch between a modern **Kanban Board** for visual execution and a detailed **Table View** for tabular task management.
* **Multi-Tenant Architecture:** Built for scale, allowing users to create isolated Workspaces for their organizations.
* **Human-Mind UI:** A premium, high-contrast light theme optimized for utility and readability.
* **Role-Based Access (RBAC):** Strict permissions for Admin (Owner) and Member roles to ensure data integrity.
* **Activity Logs:** Real-time tracking of workspace changes (Project creation, Task updates, Member changes).

---

## ⚡ Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion, Lucide Icons
* **Backend:** Node.js, Express.js
* **Database:** SQLite (Relational) via Prisma ORM
* **Security:** JWT Auth with Bcrypt hashing, Helmet.js for header protection

---

## 🔑 Demo Credentials (Bharat Tech Solutions)

Skip the signup and test the platform immediately:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin / Owner** | `aradhy@bharat.dev` | `Admin@1234` |
| **Team Member** | `rahul@bharat.dev` | `Member@1234` |

---

## 🛠️ Local Setup

### 1. Backend
```bash
cd backend
npm install
# Create .env with:
# PORT=5001
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="your-secret"
npx prisma db push
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
# Create .env with:
# VITE_API_BASE_URL=http://localhost:5001/api
npm run dev
```

---

## 🔗 API Documentation

### Auth
- `POST /api/auth/register` - Signup + Workspace creation
- `POST /api/auth/login` - Localized demo login

### Workspace & Projects
- `GET /api/dashboard/summary` - Analytics & Activity Feed
- `GET /api/projects` - List workspace projects
- `POST /api/projects` - Admin-only project creation

### Task Management
- `GET /api/tasks` - Advanced search, filter, and sort
- `PATCH /api/tasks/:id` - Status/Priority updates
- `DELETE /api/tasks/:id` - Admin-only deletion

---

## 🚀 Deployment Guide
See the detailed **[DEPLOYMENT.md](./DEPLOYMENT.md)** file for a step-by-step guide on hosting this on **Railway.app**.

---

### 👨‍💻 Note for Recruiters
This project was built with a focus on **Clean Architecture**, **Responsive Design**, and **Security**. The frontend avoids generic templates, favoring a custom-crafted design system built with Tailwind CSS.

