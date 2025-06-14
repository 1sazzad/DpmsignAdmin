"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const authMiddleware = new auth_middleware_1.default();
const authController = new auth_controller_1.default();
const authRouter = express_1.default.Router();
authRouter.get("/", authController.canRegisterAdmin);
// register new admin
authRouter.post("/register", rateLimiter_middleware_1.strictLimiter, authMiddleware.validateAdminRegistration, authController.registerAdmin);
// login an admin/staff
authRouter.post("/login", rateLimiter_middleware_1.strictLimiter, authMiddleware.validateLogin, authController.login);
exports.default = authRouter;
