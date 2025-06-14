"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = __importDefault(require("../controller/admin.controller"));
const admin_middleware_1 = __importDefault(require("../middleware/admin.middleware"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const imageUploader_middleware_1 = __importDefault(require("../middleware/imageUploader.middleware"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const adminController = new admin_controller_1.default();
const adminMiddleware = new admin_middleware_1.default();
const authMiddleware = new auth_middleware_1.default();
const adminImageUploader = new imageUploader_middleware_1.default();
const adminRouter = express_1.default.Router();
// upload admin avatar
adminRouter.post("/avatar", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), adminImageUploader.uploader("avatars").single("avatar"), adminImageUploader.compressImage, adminController.uploadAdminAvatar);
// update admin (avatar, name, password, phone)
adminRouter.put("/", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), adminImageUploader.uploader("avatars").single("avatar"), adminImageUploader.compressImage, adminMiddleware.validateAdminUpdate, adminController.updateAdmin);
exports.default = adminRouter;
