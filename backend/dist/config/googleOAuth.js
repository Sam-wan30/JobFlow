"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const { prisma } = await Promise.resolve().then(() => __importStar(require('../db')));
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: env_1.googleCallbackUrl,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const { prisma } = await Promise.resolve().then(() => __importStar(require('../db')));
            let user = await prisma.user.findUnique({
                where: { googleId: profile.id },
            });
            if (user) {
                return done(null, user);
            }
            // Check if user exists with same email
            const existingUser = await prisma.user.findUnique({
                where: { email: profile.emails?.[0]?.value },
            });
            if (existingUser) {
                // Link Google account to existing user
                user = await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        googleId: profile.id,
                        avatar: profile.photos?.[0]?.value,
                        provider: 'google',
                    },
                });
                return done(null, user);
            }
            // Create new user
            user = await prisma.user.create({
                data: {
                    email: profile.emails?.[0]?.value || '',
                    name: profile.displayName || '',
                    googleId: profile.id,
                    avatar: profile.photos?.[0]?.value,
                    provider: 'google',
                },
            });
            done(null, user);
        }
        catch (error) {
            done(error, undefined);
        }
    }));
}
exports.default = passport_1.default;
