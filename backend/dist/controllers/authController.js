"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthFailed = exports.googleAuthSuccess = exports.getMe = exports.refresh = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const emailService_1 = require("../services/emailService");
const env_1 = require("../config/env");
const JWT_SECRET = env_1.jwtSecret;
const JWT_REFRESH_SECRET = env_1.jwtRefreshSecret;
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
};
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
const sendRefreshTokenCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: env_1.isProduction,
        sameSite: env_1.isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const existingUser = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                provider: 'email',
            },
        });
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        sendRefreshTokenCookie(res, refreshToken);
        // Send welcome email
        try {
            await (0, emailService_1.sendWelcomeEmail)(user.email, user.name || '');
        }
        catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't block registration if email fails
        }
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                provider: user.provider,
            },
            accessToken,
        });
    }
    catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (!user.password) {
            return res.status(400).json({ message: 'This account uses Google Sign-In. Please continue with Google.' });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        sendRefreshTokenCookie(res, refreshToken);
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                provider: user.provider,
            },
            accessToken,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
const logout = async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env_1.isProduction,
        sameSite: env_1.isProduction ? 'none' : 'lax',
    });
    return res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }
        jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired refresh token' });
            }
            const user = await db_1.prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user) {
                return res.status(403).json({ message: 'User not found' });
            }
            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);
            sendRefreshTokenCookie(res, newRefreshToken);
            return res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    provider: user.provider,
                },
                accessToken: newAccessToken,
            });
        });
    }
    catch (error) {
        console.error('Refresh error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.refresh = refresh;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                provider: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error('Get me error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMe = getMe;
const googleAuthSuccess = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.redirect(`${env_1.primaryFrontendUrl}/login?error=auth_failed`);
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        sendRefreshTokenCookie(res, refreshToken);
        // Send welcome email for new Google users (check if user was just created)
        try {
            const userAge = Date.now() - new Date(user.createdAt).getTime();
            if (userAge < 5000) { // If user was created less than 5 seconds ago
                await (0, emailService_1.sendWelcomeEmail)(user.email, user.name || '');
            }
        }
        catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't block auth if email fails
        }
        return res.redirect(`${env_1.primaryFrontendUrl}/login?token=${accessToken}`);
    }
    catch (error) {
        console.error('Google auth success error:', error);
        return res.redirect(`${env_1.primaryFrontendUrl}/login?error=server_error`);
    }
};
exports.googleAuthSuccess = googleAuthSuccess;
const googleAuthFailed = async (req, res) => {
    return res.redirect(`${env_1.primaryFrontendUrl}/login?error=google_auth_failed`);
};
exports.googleAuthFailed = googleAuthFailed;
