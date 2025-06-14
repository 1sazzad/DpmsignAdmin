"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class AdminMiddleware {
    schema;
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
    validateAdminRegistration = (req, res, next) => {
        try {
            const adminSchema = joi_1.default.object(this.schema);
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
    validateAdminLogin = (req, res, next) => {
        try {
            const adminSchema = joi_1.default.object({
                email: this.schema.email,
                password: this.schema.password,
            });
            const validationResult = adminSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating admin login: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating admin login: ".red, err.message);
            next(err);
        }
    };
    validateAdminUpdate = (req, res, next) => {
        try {
            const adminSchema = joi_1.default.object({
                name: this.schema.name,
                currentPassword: this.schema.password.messages({
                    "string.base": "Current password must be a string.",
                    "any.required": "Current password is required.",
                    "string.empty": "Current password cannot be empty.",
                }),
                newPassword: this.schema.password
                    .optional()
                    .allow("")
                    .messages({
                    "string.base": "New password must be a string.",
                }),
                phone: this.schema.phone,
                keepPreviousAvatar: joi_1.default.string()
                    .trim()
                    .optional()
                    .valid("true", "false")
                    .messages({
                    "string.base": "keepPreviousAvatar must be a string.",
                    "any.required": "keepPreviousAvatar must be either true or false",
                }),
            });
            const validationResult = adminSchema.validate(req.body, {
                allowUnknown: true,
            });
            if (validationResult.error) {
                console.log("Error occures while validating admin information update: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating admin information update: ".red, err.message);
            next(err);
        }
    };
}
exports.default = AdminMiddleware;
