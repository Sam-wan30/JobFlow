import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_DEV_FRONTEND_URLS = ['http://localhost:5173', 'http://localhost:5174'];
const DEFAULT_DEV_JWT_SECRET = 'supersecretkey123';
const DEFAULT_DEV_REFRESH_SECRET = 'supersecretrefreshkey123';

export const isProduction = process.env.NODE_ENV === 'production';
export const port = process.env.PORT || '5001';

export const frontendUrls = (process.env.FRONTEND_URL || DEFAULT_DEV_FRONTEND_URLS.join(','))
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

export const primaryFrontendUrl = frontendUrls[0];

export const jwtSecret = process.env.JWT_SECRET || DEFAULT_DEV_JWT_SECRET;
export const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || DEFAULT_DEV_REFRESH_SECRET;

export const googleCallbackUrl =
  process.env.GOOGLE_CALLBACK_URL || `http://localhost:${port}/api/auth/google/callback`;

export const validateEnvironment = () => {
  if (!isProduction) {
    return;
  }

  const missing = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'FRONTEND_URL'].filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  }

  if (jwtSecret === DEFAULT_DEV_JWT_SECRET || jwtRefreshSecret === DEFAULT_DEV_REFRESH_SECRET) {
    throw new Error('Production JWT secrets must not use development fallback values.');
  }

  if (frontendUrls.some((url) => url.includes('localhost'))) {
    throw new Error('Production FRONTEND_URL must not point to localhost.');
  }

  if (process.env.GOOGLE_CALLBACK_URL?.includes('localhost')) {
    throw new Error('Production GOOGLE_CALLBACK_URL must not point to localhost.');
  }
};
