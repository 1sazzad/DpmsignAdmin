"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const admin_service_1 = __importDefault(require("../service/admin.service"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_config_1 = require("../config/dotenv.config");
class AdminController {
    adminService;
    constructor() {
        this.adminService = new admin_service_1.default();
    }
    uploadAdminAvatar = async (req, res, next) => {
        try {
            const fileValidationError = req.fileValidationError;
            if (fileValidationError) {
                return (0, util_1.responseSender)(res, 400, fileValidationError);
            }
            const authorizedAdmin = req.admin;
            const fetchedAdmin = await this.adminService.getAdminByEmail(authorizedAdmin.email);
            if (req.file && fetchedAdmin && fetchedAdmin.avatar !== "null") {
                const previousAvatar = path_1.default.join(req.file.destination, fetchedAdmin.avatar);
                fs_1.default.unlink(previousAvatar, (unlinkErr) => {
                    if (unlinkErr) {
                        console.log("Error deleting previous avatar: ".red, unlinkErr.message);
                        throw unlinkErr;
                    }
                });
            }
            const avatarPath = (req.file && req.file.filename) || "null";
            const admin = await this.adminService.uploadAdminAvatar(authorizedAdmin?.adminId, avatarPath);
            if (!admin) {
                return (0, util_1.responseSender)(res, 400, "Admin avatar upload failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Admin avatar uploaded successfully.");
        }
        catch (err) {
            // If database operation fails, delete the uploaded file
            if (req.file) {
                const filePath = path_1.default.join(req.file.destination, req.file.filename);
                fs_1.default.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr)
                        console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                });
            }
            console.log("Error occured in admin controller: ".red, err.message);
            next(err);
        }
    };
    updateAdmin = async (req, res, next) => {
        try {
            const fileValidationError = req.fileValidationError;
            if (fileValidationError) {
                return (0, util_1.responseSender)(res, 400, fileValidationError);
            }
            const authorizedAdmin = req.admin;
            const fetchedAdmin = await this.adminService.getAdminByEmail(authorizedAdmin?.email);
            if (!fetchedAdmin) {
                return (0, util_1.responseSender)(res, 400, "Admin not found. Please register.");
            }
            const isPasswordValid = await (0, util_1.comparePassword)(req.validatedValue.currentPassword, fetchedAdmin.password);
            if (!isPasswordValid) {
                // since password didn't match so delete the uploaded file
                if (req.file) {
                    const filePath = path_1.default.join(req.file.destination, req.file.filename);
                    fs_1.default.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr)
                            console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                    });
                }
                return (0, util_1.responseSender)(res, 400, "Invalid password. Please try again.");
            }
            // if the admin has previous avatar then remove it
            if (fetchedAdmin.avatar !== "null" &&
                req.validatedValue.keepPreviousAvatar === "false") {
                const filePath = path_1.default.join(dotenv_config_1.staticDir, "avatars", fetchedAdmin.avatar);
                fs_1.default.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr)
                        console.log("Error deleting previous avatar of admin: ".red, unlinkErr.message);
                });
            }
            const updatedAdminProps = {
                email: fetchedAdmin.email,
                name: req.validatedValue.name,
                phone: req.validatedValue.phone,
                avatar: req.validatedValue.keepPreviousAvatar === "true"
                    ? fetchedAdmin.avatar
                    : (req.file && req.file.filename) || "null",
                password: req.validatedValue.newPassword.length > 0
                    ? await (0, util_1.hashedPassword)(req.validatedValue.newPassword)
                    : undefined,
            };
            const isUpdated = await this.adminService.updateAdmin(updatedAdminProps.email, updatedAdminProps.name, updatedAdminProps.phone, updatedAdminProps.avatar, updatedAdminProps.password);
            if (!isUpdated) {
                return (0, util_1.responseSender)(res, 400, "Admin update failed.");
            }
            return (0, util_1.responseSender)(res, 200, "Admin updated successfully.");
        }
        catch (err) {
            // If database operation fails, delete the uploaded file
            if (req.file) {
                const filePath = path_1.default.join(req.file.destination, req.file.filename);
                fs_1.default.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr)
                        console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                });
            }
            console.log("Error occured in admin controller: ".red, err.message);
            next(err);
        }
    };
}
exports.default = AdminController;
