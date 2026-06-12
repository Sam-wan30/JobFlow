"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const googleOAuth_1 = __importDefault(require("../config/googleOAuth"));
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/logout', authController_1.logout);
router.post('/refresh', authController_1.refresh);
router.get('/me', authMiddleware_1.authenticateToken, authController_1.getMe);
// Google OAuth routes
router.get('/google', googleOAuth_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', googleOAuth_1.default.authenticate('google', { session: false }), authController_1.googleAuthSuccess);
router.get('/google/failure', authController_1.googleAuthFailed);
exports.default = router;
