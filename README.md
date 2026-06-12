# JobFlow

JobFlow is a modern, production-ready Job Application Tracker inspired by Notion, Trello, and Linear. It allows job seekers to track applications, organize pipelines on a Kanban board, schedule interviews, and log preparation notes.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, Zustand, React Query, React Router
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, JWT authentication (HttpOnly Refresh tokens)
- **Database:** PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (installed and running)

### Setup & Run Locally

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Database configuration:**
   The application is configured to connect to PostgreSQL.
   - For backend dev setup, modify `backend/.env` with your PostgreSQL database URL.
   - Push schema to database:
     ```bash
     cd backend && npx prisma db push && cd ..
     ```

3. **Start both Frontend and Backend concurrently:**
   ```bash
   npm run dev
   ```

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:5001](http://localhost:5001)

## Docker Deployment

To spin up the entire application stack (Frontend, Backend, and PostgreSQL database) using Docker:

```bash
docker compose up -d --build
```

## Render Deployment

This project is configured for deployment on Render. Follow these manual steps to deploy.

### Prerequisites

1. A Render account (free tier available)
2. Google OAuth credentials (if using Google Sign-In)
3. Gmail App Password (if using email notifications)

### Step-by-Step Deployment

#### 1. Deploy PostgreSQL Database

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Name: `jobflow-db`
4. Database: `jobflow`
5. User: `jobflow_user`
6. Region: Oregon (or closest to you)
7. Plan: Free
8. Click "Create Database"

#### 2. Deploy Backend Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. **Build & Deploy Settings:**
   - Name: `jobflow-backend`
   - Region: Oregon (same as database)
   - Branch: `main`
   - Runtime: `Node`
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
4. **Environment Variables:**
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: (get from PostgreSQL database dashboard)
   - `JWT_SECRET`: (generate a secure random string)
   - `JWT_REFRESH_SECRET`: (generate a different secure random string)
   - `FRONTEND_URL`: (leave empty for now, will update after frontend deployment)
   - `GOOGLE_CALLBACK_URL`: (leave empty for now, will update after deployment)
   - `GOOGLE_CLIENT_ID`: (your Google OAuth client ID)
   - `GOOGLE_CLIENT_SECRET`: (your Google OAuth client secret)
   - `EMAIL_SERVICE`: `gmail`
   - `EMAIL_USER`: (your Gmail address)
   - `EMAIL_PASSWORD`: (your Gmail App Password)
   - `EMAIL_FROM`: `JobFlow <noreply@jobflow.com>`
5. Click "Create Web Service"
6. Wait for deployment to complete
7. Copy the backend URL (e.g., `https://jobflow-backend.onrender.com`)

#### 3. Deploy Frontend Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. **Build & Deploy Settings:**
   - Name: `jobflow-frontend`
   - Region: Oregon (same as backend)
   - Branch: `main`
   - Runtime: `Static`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
4. **Environment Variables:**
   - `VITE_API_URL`: (paste your backend URL from step 2)
5. Click "Create Web Service"
6. Wait for deployment to complete
7. Copy the frontend URL (e.g., `https://jobflow-frontend.onrender.com`)

#### 4. Update Backend Environment Variables

1. Go to your backend service in Render
2. Click "Environment" tab
3. Update these variables:
   - `FRONTEND_URL`: (paste your frontend URL from step 3)
   - `GOOGLE_CALLBACK_URL`: (paste your backend URL + `/api/auth/google/callback`)
4. Click "Save Changes"
5. Click "Manual Deploy" → "Clear build cache & deploy"

#### 5. Update Google OAuth Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 client
3. Add your backend URL to "Authorized redirect URIs":
   - Format: `https://your-backend-url.onrender.com/api/auth/google/callback`
4. Save changes

#### 6. Run Database Migrations

1. Go to your backend service in Render
2. Click "Shell" tab
3. Run: `cd backend && npx prisma db push`
4. Wait for migrations to complete

### Environment Variables Reference

**Backend Environment Variables:**
- `NODE_ENV`: Set to `production`
- `PORT`: Set to `10000` (or your preferred port)
- `DATABASE_URL`: PostgreSQL connection string from Render database
- `JWT_SECRET`: Secure random string for JWT tokens
- `JWT_REFRESH_SECRET`: Secure random string for refresh tokens
- `FRONTEND_URL`: Your frontend service URL
- `GOOGLE_CALLBACK_URL`: Your backend URL + `/api/auth/google/callback`
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `EMAIL_SERVICE`: Set to `gmail`
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASSWORD`: Gmail App Password
- `EMAIL_FROM`: Sender email address

**Frontend Environment Variables:**
- `VITE_API_URL`: Your backend service URL

### Build & Start Commands

**Backend:**
- Build Command: `cd backend && npm install && npm run build`
- Start Command: `cd backend && npm start`

**Frontend:**
- Build Command: `cd frontend && npm install && npm run build`
- Publish Directory: `frontend/dist`

### Troubleshooting

- **Frontend not loading API:** Ensure `VITE_API_URL` is set correctly in Render environment
- **CORS errors:** Verify `FRONTEND_URL` matches your frontend service URL
- **Google OAuth failing:** Check that the callback URL matches your backend URL exactly
- **Database connection issues:** Ensure the database is created and migrations are run

### Local Development with Render Configuration

To test locally with Render-like configuration:

1. Copy `.env.example` files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Update `frontend/.env` with your local backend URL:
   ```
   VITE_API_URL=http://localhost:5001
   ```

3. Update `backend/.env` with your database configuration

4. Run locally as described in "Setup & Run Locally"

