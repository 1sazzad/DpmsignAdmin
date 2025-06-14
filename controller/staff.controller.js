"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const staff_service_1 = __importDefault(require("../service/staff.service"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("../util");
const admin_service_1 = __importDefault(require("../service/admin.service"));
const sequelize_1 = require("sequelize");
const dotenv_config_1 = require("../config/dotenv.config");
class StaffController {
    staffService;
    adminService;
    constructor() {
        this.staffService = new staff_service_1.default();
        this.adminService = new admin_service_1.default();
    }
    registerStaff = async (req, res, next) => {
        try {
            const staff = {
                name: req.validatedValue.name,
                email: req.validatedValue.email,
                phone: req.validatedValue.phone,
                password: await (0, util_1.hashedPassword)(req.validatedValue.password),
                role: req.validatedValue.role,
                commissionPercentage: req.validatedValue
                    .commissionPercentage,
                designCharge: req.validatedValue?.designCharge || null,
            };
            // check if the email is already registered
            const isEmailExistsAsStaff = await this.staffService.getStaffByEmail(staff.email);
            if (isEmailExistsAsStaff) {
                return (0, util_1.responseSender)(res, 400, `${staff.email} is already registered as ${isEmailExistsAsStaff.role}. Please login.`);
            }
            const isEmailExistsAsAdmin = await this.adminService.getAdminByEmail(staff.email);
            if (isEmailExistsAsAdmin) {
                return (0, util_1.responseSender)(res, 400, `An admin already associated with this email. Please login or use another email.`);
            }
            if (req.validatedValue.role === "designer" &&
                !req.validatedValue.designCharge) {
                return (0, util_1.responseSender)(res, 400, "Design charge is required for designer.");
            }
            const createdStaff = await this.staffService.registerStaff(staff.name, staff.email, staff.phone, staff.password, staff.role, staff.commissionPercentage, staff.designCharge);
            if (!createdStaff) {
                return (0, util_1.responseSender)(res, 400, "Staff registration failed. Please try again.");
            }
            // create jwt token
            const { password, ...authTokenPayload } = createdStaff;
            const authToken = (0, util_1.generateJWTToken)(authTokenPayload);
            return (0, util_1.responseSender)(res, 201, "Staff registered successfully.", {
                staff: authTokenPayload,
                authToken,
            });
        }
        catch (err) {
            console.log("Error occured in staff controller: ".red, err.message);
            next(err);
        }
    };
    uploadStaffAvatar = async (req, res, next) => {
        try {
            const fileValidationError = req.fileValidationError;
            if (fileValidationError) {
                return (0, util_1.responseSender)(res, 400, fileValidationError);
            }
            const authorizedStaff = req.staff;
            const fetchedStaff = await this.staffService.getStaffByEmail(authorizedStaff.email);
            if (!fetchedStaff) {
                return (0, util_1.responseSender)(res, 400, "Staff not found. Please register.");
            }
            if (fetchedStaff.avatar !== "null" && req.file?.destination) {
                const previousAvatar = path_1.default.join(req.file?.destination, fetchedStaff.avatar);
                fs_1.default.unlink(previousAvatar, (unlinkErr) => {
                    if (unlinkErr) {
                        console.log("Error deleting previous avatar: ".red, unlinkErr.message);
                        throw unlinkErr;
                    }
                });
            }
            const avatarPath = (req.file?.filename && req.file.filename) || "null";
            const isAvatarUploaded = await this.staffService.uploadStaffAvatar(authorizedStaff.staffId, avatarPath);
            if (!isAvatarUploaded) {
                return (0, util_1.responseSender)(res, 400, "Staff avatar upload failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Staff avatar uploaded successfully.");
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
            console.log("Error occured in staff controller: ".red, err.message);
            next(err);
        }
    };
    updateStaff = async (req, res, next) => {
        try {
            const fileValidationError = req.fileValidationError;
            if (fileValidationError) {
                return (0, util_1.responseSender)(res, 400, fileValidationError);
            }
            const authorizedStaff = req.staff;
            const fetchedStaff = await this.staffService.getStaffByEmail(authorizedStaff.email);
            if (!fetchedStaff) {
                return (0, util_1.responseSender)(res, 400, "Staff not found. Please register.");
            }
            const isPasswordValid = await (0, util_1.comparePassword)(req.validatedValue.currentPassword, fetchedStaff.password);
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
            // if the staff has previous avatar then remove it
            if (fetchedStaff.avatar !== "null" &&
                req.validatedValue.keepPreviousAvatar === "false") {
                const filePath = path_1.default.join(dotenv_config_1.staticDir, "avatars", fetchedStaff.avatar);
                fs_1.default.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr)
                        console.log("Error deleting previous avatar of staff: ".red, unlinkErr.message);
                });
            }
            const updatedStaffProps = {
                email: fetchedStaff.email,
                name: req.validatedValue.name,
                phone: req.validatedValue.phone,
                avatar: req.validatedValue.keepPreviousAvatar === "true"
                    ? fetchedStaff.avatar
                    : (req.file && req.file.filename) || "null",
                password: req.validatedValue.newPassword.length > 0
                    ? await (0, util_1.hashedPassword)(req.validatedValue.newPassword)
                    : undefined,
            };
            const isUpdated = await this.staffService.updateStaff(updatedStaffProps.email, updatedStaffProps.name, updatedStaffProps.phone, updatedStaffProps.avatar, updatedStaffProps.password);
            if (!isUpdated) {
                return (0, util_1.responseSender)(res, 400, "Staff update failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Staff updated successfully.");
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
            console.log("Error occured in staff controller: ".red, err.message);
            next(err);
        }
    };
    updateStaffProtected = async (req, res, next) => {
        try {
            const authorizedAdmin = req.admin;
            const fetchedAdmin = await this.adminService.getAdminByEmail(authorizedAdmin?.email);
            if (!fetchedAdmin) {
                return (0, util_1.responseSender)(res, 400, "Your are not authorized to perform this action.");
            }
            const fetchedStaff = await this.staffService.getStaffByEmail(req.validatedValue.email);
            if (!fetchedStaff) {
                return (0, util_1.responseSender)(res, 400, "Staff not found.");
            }
            if (req.validatedValue.role === "designer" &&
                !req.validatedValue.designCharge) {
                return (0, util_1.responseSender)(res, 400, "Design charge is required for designer.");
            }
            const staff = await this.staffService.updateStaffProtected(req.validatedValue.name, req.validatedValue.email, req.validatedValue.phone, req.validatedValue.role, req.validatedValue.commissionPercentage, req.validatedValue.designCharge || null);
            if (!staff) {
                return (0, util_1.responseSender)(res, 400, "Staff update failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Staff updated successfully.");
        }
        catch (err) {
            console.log("Error occured in staff controller: ".red, err.message);
            next(err);
        }
    };
    getAllStaff = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue.searchTerm;
            const searchBy = req.validatedValue.searchBy;
            const role = req.validatedValue.role;
            const currentPage = parseInt(req.validatedValue.page || 1);
            const limitPerPage = parseInt(req.validatedValue.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const order = [["createdAt", "DESC"]];
            const filter = {};
            if (role) {
                filter.role = role;
            }
            if (searchTerm && searchBy) {
                switch (searchBy) {
                    case "name":
                        filter.name = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    case "email":
                        filter.email = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    case "phone":
                        filter.phone = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    default:
                        break;
                }
            }
            const staff = await this.staffService.getAllStaff(filter, limitPerPage, offset, order);
            if (!staff.rows) {
                return (0, util_1.responseSender)(res, 400, "Failed to get staff. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Staff fetched successfully.", {
                staff: staff.rows.map((staffItem) => {
                    const { password, ...rest } = staffItem;
                    return rest;
                }),
                total: staff.count,
                totalPages: Math.ceil(staff.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while getting all staff: ".red, err.message);
            next(err);
        }
    };
}
exports.default = StaffController;
