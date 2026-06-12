# JobFlow Deployment Guide

This guide will help you deploy JobFlow to Render, a modern cloud platform for deploying web applications and databases.

## Prerequisites

- A Render account (https://render.com)
- A GitHub account with JobFlow repository pushed
- Google Cloud Console account (for Google OAuth)
- Email service account (Gmail or other SMTP provider)

## Architecture Overview

JobFlow consists of:
- **Frontend**: React + TypeScript + Vite (served from static files)
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL

## Deployment Steps

### 1. Database Setup

1. Go to Render Dashboard → New → PostgreSQL
2. Configure:
   - Name: `jobflow-db`
   - Database: `jobflow`
   - User: `jobflow_user`
   - Region: Choose nearest to your users
3. Click "Create Database"
4. Wait for database to be ready (~5 minutes)
5. Copy the **Internal Database URL** for later use

### 2. Backend Deployment

#### Environment Variables

You'll need to set these environment variables in Render:

```env
# Database
DATABASE_URL=<your-render-postgres-url>

# JWT Secrets (generate secure random strings)
JWT_SECRET=<generate-secure-random-string>
JWT_REFRESH_SECRET=<generate-different-secure-random-string>

# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.onrender.com

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://your-backend-url.onrender.com/api/auth/google/callback

# Email Service (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=JobFlow <noreply@jobflow.com>
```

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to APIs & Services → Credentials
4. Click "Create Credentials" → "OAuth client ID"
5. Configure:
   - Application type: Web application
   - Name: JobFlow
   - Authorized JavaScript origins: `https://your-frontend-url.onrender.com`
   - Authorized redirect URIs: `https://your-backend-url.onrender.com/api/auth/google/callback`
6. Copy Client ID and Client Secret
7. Add to Render environment variables

#### Email Service Setup (Gmail)

1. Enable 2-Factor Authentication on your Google Account
2. Go to Google Account Settings → Security → App Passwords
3. Generate a new app password for "Mail"
4. Use this password as `EMAIL_PASSWORD` in environment variables

#### Deploy Backend

1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - Name: `jobflow-backend`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Add all variables from above
4. Click "Create Web Service"
5. Wait for deployment to complete

#### Database Schema Setup

After backend deployment, you need to initialize the database schema:

1. Go to your backend service on Render
2. Click "Shell" tab
3. Run:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### 3. Frontend Deployment

#### Environment Variables

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

#### Deploy Frontend

1. Go to Render Dashboard → New → Static Site
2. Configure:
   - Name: `jobflow-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment: Add `VITE_API_URL`
3. Click "Create Static Site"
4. Wait for deployment to complete

### 4. Update Backend Environment Variables

After frontend deployment, update the backend with the actual frontend URL:

1. Go to your backend service on Render
2. Edit environment variables
3. Update `FRONTEND_URL` to your actual frontend URL
4. Update `GOOGLE_CALLBACK_URL` if needed
5. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` if not already added

### 5. Production Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] Database schema is initialized
- [ ] Google OAuth is configured with correct redirect URIs
- [ ] Email service is working (test welcome email)
- [ ] HTTPS is enabled (automatic on Render)
- [ ] CORS is configured for production domains
- [ ] JWT secrets are strong and unique
- [ ] Database connections are secure
- [ ] Error monitoring is set up (optional but recommended)

## Local Development Setup

To run the application locally:

```bash
# Clone repository
git clone <your-repo-url>
cd JobFlow

# Install dependencies
npm run install:all

# Setup environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your local settings

# Setup database
cd backend
npx prisma generate
npx prisma db push

# Run development servers
npm run dev
```

## Monitoring and Maintenance

### Viewing Logs

- **Backend**: Render Dashboard → jobflow-backend → Logs
- **Database**: Render Dashboard → jobflow-db → Logs
- **Frontend**: Render Dashboard → jobflow-frontend → Logs

### Database Backups

Render automatically creates daily backups of your PostgreSQL database. To access:

1. Go to Render Dashboard → jobflow-db
2. Click "Backups" tab
3. Download or restore as needed

### Scaling

If you need to scale:

1. **Backend**: Upgrade to higher-tier instance in Render settings
2. **Database**: Upgrade to higher-tier PostgreSQL plan
3. **Frontend**: Static sites auto-scale, no changes needed

## Troubleshooting

### Backend fails to start

- Check that all environment variables are set
- Verify database connection string is correct
- Check logs for specific error messages

### Google OAuth not working

- Verify redirect URIs match exactly (no trailing slashes)
- For local development, authorize `http://localhost:5001/api/auth/google/callback` in Google Cloud Console.
- Ensure Client ID and Secret are correct
- Check that Google OAuth is enabled in Google Console

### Emails not sending

- Verify email service credentials are correct
- For Gmail, use App Password (not regular password)
- Check email service is not blocking Render IPs

### Database connection issues

- Verify DATABASE_URL format is correct
- Check database is running and accepting connections
- Ensure firewall rules allow connections

## Security Considerations

1. **Never commit secrets** to git
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Rotate secrets regularly**
4. **Enable HTTPS** (automatic on Render)
5. **Keep dependencies updated**
6. **Monitor logs for suspicious activity**
7. **Use read-only database users where possible**

## Cost Estimates (Render)

- **PostgreSQL**: Starting at $7/month (shared)
- **Backend**: Starting at $7/month (free tier available)
- **Frontend**: Free (static site)
- **Total**: ~$14/month minimum

## Support

For issues specific to:
- **Render**: https://render.com/docs
- **Prisma**: https://www.prisma.io/docs
- **Google OAuth**: https://developers.google.com/identity

## Next Steps

After successful deployment:

1. Test all user flows (signup, login, create application)
2. Monitor error logs for first few days
3. Set up uptime monitoring (e.g., UptimeRobot)
4. Configure custom domain (optional)
5. Set up analytics (optional, e.g., Google Analytics)
