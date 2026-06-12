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

This project is configured for easy deployment on Render using the provided `render.yaml` file.

### Prerequisites

1. A Render account (free tier available)
2. Google OAuth credentials (if using Google Sign-In)
3. Gmail App Password (if using email notifications)

### Step-by-Step Deployment

1. **Push your code to GitHub**
   - Ensure your repository is public or connected to Render

2. **Create a new Web Service on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - **Important:** Select "Existing render.yaml" when prompted
   - Render will automatically detect and use the `render.yaml` configuration

3. **Configure Environment Variables**
   Render will automatically set most variables via `render.yaml`, but you need to manually add:

   **Required for Google OAuth:**
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

   **Required for Email Notifications:**
   - `EMAIL_SERVICE`: Set to "gmail"
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASSWORD`: Your Gmail App Password (not your regular password)
   - `EMAIL_FROM`: Sender email (e.g., "JobFlow <noreply@jobflow.com>")

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically:
     - Create a PostgreSQL database
     - Build and deploy the backend
     - Build and deploy the frontend
     - Configure environment variables
     - Set up service-to-service communication

5. **Update Google OAuth Redirect URI**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Find your OAuth 2.0 client
   - Add your Render backend URL to "Authorized redirect URIs":
     - Format: `https://your-backend-url.onrender.com/api/auth/google/callback`

6. **Run Database Migrations**
   - After the backend is deployed, access the Render shell:
     - Go to your backend service → "Shell" tab
     - Run: `npx prisma db push`

### Environment Variables Reference

The following environment variables are automatically configured by `render.yaml`:

- `DATABASE_URL`: PostgreSQL connection string (auto-generated)
- `JWT_SECRET`: JWT secret key (auto-generated)
- `JWT_REFRESH_SECRET`: JWT refresh secret key (auto-generated)
- `FRONTEND_URL`: Frontend service URL (auto-configured)
- `GOOGLE_CALLBACK_URL`: Google OAuth callback URL (auto-configured)
- `VITE_API_URL`: Backend API URL for frontend (auto-configured)

### Build & Start Commands

**Backend:**
- Build Command: `cd backend && npm install && npm run build`
- Start Command: `cd backend && npm start`

**Frontend:**
- Build Command: `cd frontend && npm install && npm run build`
- Publish Path: `frontend/dist`

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

