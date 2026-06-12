# Environment Variables Documentation

This document provides a comprehensive guide to all environment variables required for JobFlow.

## Backend Environment Variables

### Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@host:5432/dbname?schema=public` | Yes |
| `JWT_SECRET` | Secret key for JWT access tokens | `supersecretkey123` (use strong random string in production) | Yes |
| `JWT_REFRESH_SECRET` | Secret key for JWT refresh tokens | `supersecretrefreshkey123` (use different strong string) | Yes |
| `PORT` | Server port | `5000` | Yes |
| `NODE_ENV` | Environment mode | `production` or `development` | Yes |
| `FRONTEND_URL` | Frontend application URL for CORS | `https://jobflow.onrender.com` | Yes |

### Optional Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789-abc.apps.googleusercontent.com` | No (for Google Auth) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-abc123xyz` | No (for Google Auth) |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | `https://backend.onrender.com/api/auth/google/callback` | No (for Google Auth) |
| `EMAIL_SERVICE` | Email service provider | `gmail` | No (for welcome emails) |
| `EMAIL_USER` | Email service username | `your-email@gmail.com` | No (for welcome emails) |
| `EMAIL_PASSWORD` | Email service password/app password | `abcd efgh ijkl mnop` | No (for welcome emails) |
| `EMAIL_FROM` | From email address | `JobFlow <noreply@jobflow.com>` | No (for welcome emails) |

## Frontend Environment Variables

### Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `https://jobflow-backend.onrender.com` or `http://localhost:5001` | Yes |

## Setup Instructions

### Local Development

1. **Backend (`.env` file in `backend/` directory):**

```env
DATABASE_URL="postgresql://jobflow:password@localhost:5432/jobflow?schema=public"
JWT_SECRET="dev-secret-change-in-production"
JWT_REFRESH_SECRET="dev-refresh-secret-change-in-production"
PORT=5001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"

# Optional - for Google Auth
GOOGLE_CLIENT_ID="your-local-google-client-id"
GOOGLE_CLIENT_SECRET="your-local-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5001/api/auth/google/callback"

# Optional - for email
EMAIL_SERVICE="gmail"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-specific-password"
EMAIL_FROM="JobFlow <noreply@jobflow.com>"
```

2. **Frontend (`.env` file in `frontend/` directory):**

```env
VITE_API_URL="http://localhost:5001"
```

### Production (Render)

1. **Backend Environment Variables:**

Set these in Render Dashboard → jobflow-backend → Environment:

```env
DATABASE_URL=<render-postgres-internal-url>
JWT_SECRET=<generate-secure-32-char-string>
JWT_REFRESH_SECRET=<generate-different-secure-32-char-string>
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://jobflow-frontend.onrender.com
GOOGLE_CLIENT_ID=<your-production-google-client-id>
GOOGLE_CLIENT_SECRET=<your-production-google-client-secret>
GOOGLE_CALLBACK_URL=https://jobflow-backend.onrender.com/api/auth/google/callback
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=<your-gmail-app-password>
EMAIL_FROM=JobFlow <noreply@jobflow.com>
```

2. **Frontend Environment Variables:**

Set these in Render Dashboard → jobflow-frontend → Environment:

```env
VITE_API_URL=https://jobflow-backend.onrender.com
```

## Security Best Practices

### JWT Secrets

- Use minimum 32 characters for production
- Use different secrets for access and refresh tokens
- Never commit secrets to git
- Rotate secrets periodically
- Use cryptographically secure random strings

### Database URL

- Never commit database credentials to git
- Use strong database passwords
- Use connection pooling in production
- Limit database user permissions as needed

### Email Credentials

- Use app-specific passwords (not regular passwords)
- Never commit email credentials to git
- Rotate credentials periodically
- Use dedicated email for application

### OAuth Credentials

- Never share Client Secrets
- Use separate OAuth clients for dev/prod
- Set proper redirect URIs
- Regularly review OAuth permissions

## Generating Secure Secrets

### Using Node.js

```javascript
// Generate a secure 32-character string
const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');
console.log(secret);
```

### Using OpenSSL

```bash
# Generate 32-byte hex string
openssl rand -hex 32
```

### Using Online Tools

- https://generate-random.org/encryption-key-generator
- Ensure minimum 256-bit (32 characters) for production

## Troubleshooting

### Environment Variables Not Working

1. **Frontend**: Restart dev server after changing `.env` file
2. **Backend**: Restart server after changing `.env` file
3. **Render**: Redeploy service after changing environment variables

### Common Errors

| Error | Solution |
|-------|----------|
| `DATABASE_URL` format error | Ensure proper format: `postgresql://user:password@host:port/db?schema=public` |
| JWT verification failed | Ensure `JWT_SECRET` matches between token generation and verification |
| CORS errors | Ensure `FRONTEND_URL` matches your actual frontend URL exactly |
| Google Auth redirect mismatch | Ensure `GOOGLE_CALLBACK_URL` matches Google Console settings exactly. Local development uses `http://localhost:5001/api/auth/google/callback`. |
| Email authentication failed | Use app-specific password for Gmail, not regular password |

## Environment Variable Templates

### Development Template

Copy to `backend/.env`:

```env
DATABASE_URL="postgresql://jobflow:jobflow@localhost:5432/jobflow?schema=public"
JWT_SECRET="dev-jwt-secret-min-32-chars-long"
JWT_REFRESH_SECRET="dev-refresh-secret-min-32-chars-long"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

Copy to `frontend/.env`:

```env
VITE_API_URL="http://localhost:5001"
```

### Production Template

For Render backend:

```env
DATABASE_URL=<render-provided-url>
JWT_SECRET=<production-secure-secret>
JWT_REFRESH_SECRET=<production-different-secret>
PORT=5000
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>
```

For Render frontend:

```env
VITE_API_URL=<your-backend-url>
```

## Additional Resources

- [Render Environment Variables Guide](https://render.com/docs/environment-variables)
- [Prisma Environment Variables](https://www.prisma.io/docs/reference/tools-and-interfaces/environment-variables-reference)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
