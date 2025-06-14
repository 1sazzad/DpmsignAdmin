"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const staff_controller_1 = __importDefault(require("../controller/staff.controller"));
const staff_middleware_1 = __importDefault(require("../middleware/staff.middleware"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const imageUploader_middleware_1 = __importDefault(require("../middleware/imageUploader.middleware"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const staffController = new staff_controller_1.default();
const staffMiddleware = new staff_middleware_1.default();
const authMiddleware = new auth_middleware_1.default();
const staffImageUploader = new imageUploader_middleware_1.default();
const staffRouter = express_1.default.Router();
// get all staff
staffRouter.get("/", 
// authMiddleware.authenticate(["admin", "customer"]),
staffMiddleware.validateFilteringQueries, staffController.getAllStaff);
// register new staff
staffRouter.post("/register", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), staffMiddleware.validateStaffRegistration, staffController.registerStaff);
// upload staff avatar
staffRouter.post("/avatar", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["agent", "designer"]), staffImageUploader.uploader("avatars").single("avatar"), staffImageUploader.compressImage, staffController.uploadStaffAvatar);
// update staff general information (avatar, name, password, phone)
staffRouter.put("/", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["agent", "designer"]), staffImageUploader.uploader("avatars").single("avatar"), staffImageUploader.compressImage, staffMiddleware.validateStaffUpdate, staffController.updateStaff);
// update staff protected information (role, commissionPercentage)
staffRouter.put("/update", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), staffMiddleware.validateStaffUpdateProtected, staffController.updateStaffProtected);
exports.default = staffRouter;
