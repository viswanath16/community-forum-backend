"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// api/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const client_1 = require("@prisma/client");
const routes_1 = __importDefault(require("../../dist/routes"));
const error_middleware_1 = require("../../dist/middlewares/error.middleware");
const swagger_1 = __importDefault(require("../../dist/config/swagger"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Initialize Prisma client
const prisma = new client_1.PrismaClient();
// Create Express app
const app = (0, express_1.default)();
// Basic middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // For Swagger UI
}));
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});
// Swagger documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, {
    explorer: true,
    customSiteTitle: 'Community Forum API Documentation',
}));
// API Routes
app.use('/api/v1', routes_1.default);
// Error handling
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
// Export for Vercel
exports.default = app;
//# sourceMappingURL=index.js.map