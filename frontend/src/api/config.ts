const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, '');

const rawApiUrl = trimTrailingSlashes(import.meta.env.VITE_API_URL || '');

if (!rawApiUrl) {
  throw new Error('VITE_API_URL environment variable is required');
}

export const apiBaseUrl = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;
export const apiOrigin = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;

export const googleAuthUrl = `${apiBaseUrl}/auth/google`;
