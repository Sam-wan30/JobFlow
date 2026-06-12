"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const interviews_1 = __importDefault(require("./routes/interviews"));
const notes_1 = __importDefault(require("./routes/notes"));
const activities_1 = __importDefault(require("./routes/activities"));
const env_1 = require("./config/env");
dotenv_1.default.config();
(0, env_1.validateEnvironment)();
const app = (0, express_1.default)();
// Configuration
const corsOptions = {
    origin: env_1.frontendUrls,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
// Middlewares
app.set('trust proxy', 1);
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Request logging (simple)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/interviews', interviews_1.default);
app.use('/api/notes', notes_1.default);
app.use('/api/activities', activities_1.default);
// Base route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'JobFlow Server is running smoothly.' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
    });
});
app.listen(env_1.port, () => {
    console.log(`Server is running on port ${env_1.port}`);
});
