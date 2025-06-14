"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_service_1 = __importDefault(require("../service/admin.service"));
const staff_service_1 = __importDefault(require("../service/staff.service"));
const customer_service_1 = __importDefault(require("../service/customer.service"));
const util_1 = require("../util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
class AuthMiddleware {
    schema;
    adminService = new admin_service_1.default();
    staffService = new staff_service_1.default();
    customerService = new customer_service_1.default();
    constructor() {
        this.schema = {
            name: joi_1.default.string().trim().min(2).required().messages({
                "string.base": "name must be a string.",
                "string.empty": "name cannot be empty.",
                "string.min": "name must be at least 2 characters long.",
                "any.required": "name is required.",
            }),
            email: joi_1.default.string().trim().email().required().messages({
                "string.base": "email must be a string.",
                "string.email": "invalid email address.",
                "string.empty": "email cannot be empty.",
                "any.required": "email is required.",
            }),
            phone: joi_1.default.string()
                .trim()
                .required()
                .pattern(/^01[3-9][0-9]{8}$/)
                .messages({
                "string.pattern.base": "phone number must be a valid Bangladeshi number starting with 01 and 11 digits long.",
                "string.empty": "phone number cannot be empty.",
            }),
            password: joi_1.default.string().trim().min(8).required().messages({
                "string.base": "password must be a string.",
                "string.empty": "password cannot be empty.",
                "string.min": "password must be at least 8 characters long.",
                "any.required": "password is required.",
            }),
        };
    }
    authenticate = (roles) => {
        return async (req, res, next) => {
            try {
                const authHeader = req.headers["authorization"];
                if (!authHeader) {
                    return (0, util_1.responseSender)(res, 401, "Authorization token is missing.");
                }
                const authToken = authHeader.split(" ")[1];
                if (!authToken) {
                    return (0, util_1.responseSender)(res, 401, "Authorization token is missing.");
                }
                try {
                    const decodedToken = (0, util_1.verifyToken)(authToken);
                    if (!decodedToken) {
                        return (0, util_1.responseSender)(res, 401, "Invalid authorization token.");
                    }
                    let user;
                    for (let role of roles) {
                        if (role === "customer") {
                            user =
                                await this.customerService.getCustomerByEmail(decodedToken.email);
                            if (user) {
                                if (decodedToken.tokenVersion !==
                                    user.tokenVersion) {
                                    return (0, util_1.responseSender)(res, 401, "Invalid authorization token.");
                                }
                                req.customer = decodedToken;
                                break;
                            }
                        }
                        else if (role === "admin") {
                            user = await this.adminService.getAdminByEmail(decodedToken.email);
                            if (user) {
                                if (decodedToken.tokenVersion !==
                                    user.tokenVersion) {
                                    return (0, util_1.responseSender)(res, 401, "Invalid authorization token.");
                                }
                                req.admin = decodedToken;
                                break;
                            }
                        }
                        else if (role === "agent" || role === "designer") {
                            user =
                                await this.staffService.getStaffByEmailAndRole(decodedToken.email, role);
                            if (user) {
                                if (decodedToken.tokenVersion !==
                                    user.tokenVersion) {
                                    return (0, util_1.responseSender)(res, 401, "Invalid authorization token.");
                                }
                                req.staff = decodedToken;
                                break;
                            }
                        }
                    }
                    if (!user) {
                        return (0, util_1.responseSender)(res, 401, "Invalid authorization token.");
                    }
                    next();
                }
                catch (err) {
                    console.log("Error occured while verifying token: ".red, err.message);
                    if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                        return (0, util_1.responseSender)(res, 401, err.message || "Invalid authorization token.");
                    }
                    next(err);
                }
            }
            catch (err) {
                console.log("Error occured in auth middleware: ".red, err.message);
                next(err);
            }
        };
    };
    validateAdminRegistration = (req, res, next) => {
        try {
            const adminSchema = joi_1.default.object({
                name: this.schema.name,
                email: this.schema.email,
                phone: this.schema.phone,
                password: this.schema.password,
            });
            const validationResult = adminSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating admin registration: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating admin registration: ".red, err.message);
            next(err);
        }
    };
    validateLogin = (req, res, next) => {
        try {
            const loginSchema = joi_1.default.object({
                email: this.schema.email,
                password: this.schema.password,
            });
            const validationResult = loginSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating auth login: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating auth login: ".red, err.message);
            next(err);
        }
    };
}
exports.default = AuthMiddleware;
