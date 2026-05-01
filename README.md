# Team Task Manager (SaaS Edition)

A production-ready, multi-tenant B2B Task Management platform built with React, Node.js, Express, and Prisma (SQLite).

## 🚀 Features

* **Multi-Tenant Architecture:** Users can create isolated Workspaces for their companies.
* **Role-Based Access Control:** Admin (Workspace Owner) and Member roles with specific permissions.
* **Modern Kanban Board:** Drag-and-drop task management with color-coded priority and status badges.
* **Advanced Filtering & Sorting:** Search tasks, filter by project/status/priority, and sort by due date or priority.
* **Real-time Dashboard:** Track project progress, pending tasks, overdue tasks, and recent workspace activity.

## ⚡ Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Axios, React Router Dom
* **Backend:** Node.js, Express.js
* **Database:** SQLite (Relational SQL) managed via Prisma ORM
* **Authentication:** JWT (JSON Web Tokens) with bcrypt password hashing

## 🛠️ Local Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
# Create an .env file
echo 'PORT=5001' > .env
echo 'DATABASE_URL="file:./dev.db"' >> .env
echo 'JWT_SECRET="your-super-secret-key"' >> .env

# Push the database schema and seed the demo data
npx prisma db push
node src/config/seed.js

# Start the development server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Create an .env file
echo 'VITE_API_BASE_URL=http://localhost:5001/api' > .env

# Start the Vite development server
npm run dev
```

## 🔗 API Endpoints

### Authentication
* `POST /api/auth/register` - Create a new user and Workspace
* `POST /api/auth/login` - Authenticate and receive JWT

### Dashboard
* `GET /api/dashboard/summary` - Get workspace stats and recent activity

### Projects
* `POST /api/projects` - Create a new project (Admin)
* `GET /api/projects` - List accessible projects
* `GET /api/projects/:id` - Get project details
* `PATCH /api/projects/:id/members` - Update team members (Admin)
* `DELETE /api/projects/:id` - Delete project (Admin)

### Tasks
* `POST /api/tasks` - Create a task
* `GET /api/tasks` - List tasks with pagination, sorting, and filtering
* `PATCH /api/tasks/:id` - Update task status/priority
* `DELETE /api/tasks/:id` - Delete a task (Admin)

## 🚀 Deployment Guide

### Deploying Frontend to Vercel
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Set the **Framework Preset** to `Vite`.
4. Set the **Root Directory** to `frontend`.
5. Add the Environment Variable: `VITE_API_BASE_URL` (pointing to your live backend URL).
6. Click Deploy.

### Deploying Backend to Railway
1. Go to [Railway](https://railway.app/) and create a new project from your GitHub repo.
2. Set the **Root Directory** to `backend`.
3. Go to Variables and add:
   * `PORT` = `5001`
   * `JWT_SECRET` = `your-production-secret-key`
   * `DATABASE_URL` = `file:/data/dev.db`
4. **CRITICAL FOR SQLITE:** You must add a **Persistent Volume** in Railway mounted to `/data` so your database isn't wiped on every deployment.
5. Set your custom Start Command to: `npx prisma db push && node src/server.js`
