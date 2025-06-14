"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const admin_service_1 = __importDefault(require("../service/admin.service"));
const staff_service_1 = __importDefault(require("../service/staff.service"));
class AuthController {
    adminService;
    staffService;
    constructor() {
        this.adminService = new admin_service_1.default();
        this.staffService = new staff_service_1.default();
    }
    canRegisterAdmin = async (req, res, next) => {
        try {
            const isAdminExists = await this.adminService.getAllAdmin();
            if (isAdminExists && isAdminExists.length > 0) {
                return (0, util_1.responseSender)(res, 200, "Admin already exists. Please login.", { canRegisterAdmin: false });
            }
            return (0, util_1.responseSender)(res, 200, "Register Admin.", {
                canRegisterAdmin: true,
            });
        }
        catch (err) {
            console.log("Error occures while checking if admin can register or not: "
                .red, err.message);
            next(err);
        }
    };
    registerAdmin = async (req, res, next) => {
        try {
            const admin = {
                name: req.validatedValue.name,
                email: req.validatedValue.email,
                phone: req.validatedValue.phone,
                password: await (0, util_1.hashedPassword)(req.validatedValue.password),
            };
            // check if there is already an admin registered
            const isAdminExists = await this.adminService.getAllAdmin();
            if (isAdminExists && isAdminExists.length > 0) {
                return (0, util_1.responseSender)(res, 400, "Admin already exists. Please login.");
            }
            // check if the email is not in the admin/staff record.
            const isEmailExists = await this.staffService.getStaffByEmail(admin.email);
            if (isEmailExists) {
                return (0, util_1.responseSender)(res, 400, "A staff already associated with this email. Please login or use another email.");
            }
            const createdAdmin = await this.adminService.registerAdmin(admin.name, admin.email, admin.phone, admin.password);
            if (!createdAdmin) {
                return (0, util_1.responseSender)(res, 400, "Admin registration failed. Please try again.");
            }
            // create jwt token
            const { password, ...authTokenPayload } = createdAdmin;
            const authToken = (0, util_1.generateJWTToken)(authTokenPayload);
            return (0, util_1.responseSender)(res, 201, "Admin registered successfully.", {
                admin: authTokenPayload,
                authToken,
            });
        }
        catch (err) {
            console.log("Error occured in admin controller: ".red, err.message);
            next(err);
        }
    };
    login = async (req, res, next) => {
        try {
            const fetchedAdmin = await this.adminService.getAdminByEmail(req.validatedValue.email);
            if (fetchedAdmin) {
                // login as admin
                const isPasswordValid = await (0, util_1.comparePassword)(req.validatedValue.password, fetchedAdmin.password);
                if (!isPasswordValid) {
                    return (0, util_1.responseSender)(res, 400, "Invalid password. Please try again.");
                }
                // create jwt token
                const { password, ...authTokenPayload } = fetchedAdmin;
                const authToken = (0, util_1.generateJWTToken)(authTokenPayload);
                return (0, util_1.responseSender)(res, 200, "Admin logged in successfully.", {
                    admin: authTokenPayload,
                    authToken,
                });
            }
            else {
                // login as staff
                const fetchedStaff = await this.staffService.getStaffByEmail(req.validatedValue.email);
                if (!fetchedStaff) {
                    return (0, util_1.responseSender)(res, 400, "You are not registered.");
                }
                const isPasswordValid = await (0, util_1.comparePassword)(req.validatedValue.password, fetchedStaff.password);
                if (!isPasswordValid) {
                    return (0, util_1.responseSender)(res, 400, "Invalid password. Please try again.");
                }
                // create jwt token
                const { password, ...authTokenPayload } = fetchedStaff;
                const authToken = (0, util_1.generateJWTToken)(authTokenPayload);
                return (0, util_1.responseSender)(res, 200, "Staff logged in successfully.", {
                    staff: authTokenPayload,
                    authToken,
                });
            }
        }
        catch (err) {
            console.log("Error occured in auth controller: ".red, err.message);
            next(err);
        }
    };
}
exports.default = AuthController;
