# 🚀 Railway Deployment Guide: Team Task Manager

Follow these steps to deploy your localized **Bharat Tech Solutions** Task Manager to production on [Railway.app](https://railway.app).

---

## 🛠️ Step 1: Prepare Your Repository
1. **GitHub Push:** Ensure your latest code is pushed to a GitHub repository.
2. **Environment Files:** Double-check that `.env` files are in your `.gitignore`. We will add the variables directly in Railway.

---

## 🏗️ Step 2: Create a Railway Project
1. Go to [Railway.app](https://railway.app) and log in.
2. Click **"New Project"** → **"Deploy from GitHub repo"**.
3. Select your repository.

---

## 🔌 Step 3: Configure the Backend Service
Once the project is created, Railway will likely detect the root. We want to configure the **Backend** first.

1. **Rename Service:** Click on the generated service and rename it to `backend`.
2. **Root Directory:** In **Settings**, set the "Root Directory" to `backend`.
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Variables:** Go to the **Variables** tab and add:
   - `PORT`: `5001`
   - `JWT_SECRET`: `your_super_secret_key_here`
   - `MONGODB_URI`: your MongoDB Atlas or Railway MongoDB connection string
   - `JWT_EXPIRES_IN`: `7d`
   - `NODE_ENV`: `production`

> [!IMPORTANT]
> **MongoDB Required:** 
> The backend now connects only through `MONGODB_URI`. Use MongoDB Atlas, Railway MongoDB, or another MongoDB-compatible service.

---

## 💻 Step 4: Configure the Frontend Service
1. In the same Railway project, click **"New"** → **"GitHub Repo"** again.
2. Select the same repository.
3. **Rename Service:** Rename this one to `frontend`.
4. **Root Directory:** Set "Root Directory" to `frontend`.
5. **Variables:** Add:
   - `VITE_API_BASE_URL`: `https://backend-your-project.up.railway.app/api`
   *(Replace with the actual URL Railway generates for your backend service).*
6. **Build Command:** `npm install && npm run build`
7. **Start Command:** Railway will automatically serve the `dist` folder if it detects Vite/React, otherwise use: `npx serve -s dist`

---

## 🏁 Step 5: Final Verification
1. **Domain:** Railway will provide a `.up.railway.app` URL for both services.
2. **CORS:** Ensure your Backend's `app.js` allows the Frontend URL (I have already configured it to be flexible, but check if needed).
3. **Test:** Open the Frontend URL, and you should see the **Bharat Tech Solutions** landing page!

---

## 🔑 Demo Access (Production)
Once deployed, you can use these credentials:
- **Admin:** `aradhy@bharat.dev` / `Admin@1234`
- **Member:** `rahul@bharat.dev` / `Member@1234`

---

### 💡 Pro Tip for Recruiters
In your GitHub README, add these Railway links as "Live Demo" buttons to make your project stand out immediately!
