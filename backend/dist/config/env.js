"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvironment = exports.googleCallbackUrl = exports.jwtRefreshSecret = exports.jwtSecret = exports.primaryFrontendUrl = exports.frontendUrls = exports.port = exports.isProduction = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DEFAULT_DEV_FRONTEND_URLS = ['http://localhost:5173', 'http://localhost:5174'];
const DEFAULT_DEV_JWT_SECRET = 'supersecretkey123';
const DEFAULT_DEV_REFRESH_SECRET = 'supersecretrefreshkey123';
exports.isProduction = process.env.NODE_ENV === 'production';
exports.port = process.env.PORT || '5001';
exports.frontendUrls = (process.env.FRONTEND_URL || DEFAULT_DEV_FRONTEND_URLS.join(','))
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
exports.primaryFrontendUrl = exports.frontendUrls[0];
exports.jwtSecret = process.env.JWT_SECRET || DEFAULT_DEV_JWT_SECRET;
exports.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || DEFAULT_DEV_REFRESH_SECRET;
exports.googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL || `http://localhost:${exports.port}/api/auth/google/callback`;
const validateEnvironment = () => {
    if (!exports.isProduction) {
        return;
    }
    const missing = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'FRONTEND_URL'].filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
    }
    if (exports.jwtSecret === DEFAULT_DEV_JWT_SECRET || exports.jwtRefreshSecret === DEFAULT_DEV_REFRESH_SECRET) {
        throw new Error('Production JWT secrets must not use development fallback values.');
    }
    if (exports.frontendUrls.some((url) => url.includes('localhost'))) {
        throw new Error('Production FRONTEND_URL must not point to localhost.');
    }
    if (process.env.GOOGLE_CALLBACK_URL?.includes('localhost')) {
        throw new Error('Production GOOGLE_CALLBACK_URL must not point to localhost.');
    }
};
exports.validateEnvironment = validateEnvironment;
