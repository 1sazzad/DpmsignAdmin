"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class InqueryMiddleware {
    schema;
    constructor() {
        this.schema = {
            name: joi_1.default.string().trim().min(2).required().messages({
                "string.base": "Name must be a string.",
                "string.empty": "Name cannot be empty.",
                "string.min": "Name must be at least 2 characters long.",
                "any.required": "Name is required.",
            }),
            email: joi_1.default.string().trim().email().required().messages({
                "string.base": "Email must be a string.",
                "string.email": "Invalid email address.",
                "string.empty": "Email cannot be empty.",
                "any.required": "Email is required.",
            }),
            phone: joi_1.default.string()
                .trim()
                .required()
                .pattern(/^01[3-9][0-9]{8}$/)
                .messages({
                "string.pattern.base": "Phone number must be a valid Bangladeshi number starting with 01 and 11 digits long.",
                "string.empty": "Phone number cannot be empty.",
                "any.required": "Phone number is required.",
            }),
            company: joi_1.default.string()
                .trim()
                .allow("")
                .optional()
                .default("")
                .min(3)
                .messages({
                "string.base": "Company name must be a string.",
                "string.min": "Company name must be at least 3 characters long.",
            }),
            inqueryType: joi_1.default.string()
                .trim()
                .required()
                .valid("product-information", "pricing", "customization-options", "others")
                .messages({
                "string.base": "Inquery type must be a string.",
                "any.required": "Inquery type is required. It should be one of 'product-information', 'pricing', 'customization-options', 'others'",
            }),
            message: joi_1.default.string().trim().min(5).required().messages({
                "string.base": "Message must be a string.",
                "string.min": "Message must be at least 5 characters long.",
                "any.required": "Message is required.",
            }),
        };
    }
    validateInqueryCreation = (req, res, next) => {
        try {
            const inquerySchema = joi_1.default.object(this.schema);
            const validationResult = inquerySchema.validate(req.body);
            if (validationResult.error) {
                if (req.file) {
                    const filePath = path_1.default.join(req.file.destination, req.file.filename);
                    fs_1.default.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr)
                            console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                    });
                }
                console.log("Error occures while validating inquery creation: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            if (req.file) {
                const filePath = path_1.default.join(req.file.destination, req.file.filename);
                fs_1.default.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr)
                        console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                });
            }
            console.log("Error occures while validating inquery creation: ".red, err.message);
            next(err);
        }
    };
    validateInqueryStatusChange = (req, res, next) => {
        try {
            const inquerySchema = joi_1.default.object({
                inqueryId: joi_1.default.number().required().messages({
                    "number.base": "inqueryId must be a integer.",
                    "number.required": "inqueryId is required.",
                }),
            });
            const validationResult = inquerySchema.validate(req.query);
            if (validationResult.error) {
                console.log("Error occures while validating inquery status change operation: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating inquery status change operation: "
                .red, err.message);
            next(err);
        }
    };
    validateInqueryDelete = (req, res, next) => {
        try {
            const inquerySchema = joi_1.default.object({
                inqueryId: joi_1.default.number().required().messages({
                    "number.base": "inqueryId must be a integer.",
                    "number.required": "inqueryId is required.",
                }),
            });
            const validationResult = inquerySchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating inquery delete operation: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating inquery delete operation: ".red, err.message);
            next(err);
        }
    };
    validateFilteringQueries = (req, res, next) => {
        try {
            const inqueryFilteringSchema = joi_1.default.object({
                searchTerm: joi_1.default.string().trim().optional().messages({
                    "string.base": "searchTerm must be a string.",
                    "string.empty": "searchTerm cannot be empty.",
                }),
                searchBy: joi_1.default.string()
                    .trim()
                    .optional()
                    .valid("name", "email", "phone")
                    .messages({
                    "string.base": "searchBy must be a string.",
                    "any.valid": "searchBy should be 'name', 'email' or 'phone'.",
                    "string.empty": "searchBy cannot be empty.",
                }),
                inqueryType: joi_1.default.string()
                    .trim()
                    .optional()
                    .valid("product-information", "pricing", "customization-options", "others")
                    .messages({
                    "string.base": "inqueryType must be a string.",
                    "string.empty": "inqueryType cannot be empty.",
                    "any.valid": "inqueryType should be one of 'product-information', 'pricing', 'customization-options', 'others'",
                }),
                status: joi_1.default.string()
                    .trim()
                    .optional()
                    .valid("open", "closed")
                    .messages({
                    "string.base": "status must be a string.",
                    "any.valid": "status should be 'open' or 'closed'.",
                    "string.empty": "status cannot be empty.",
                }),
                page: joi_1.default.number().optional().default(1).messages({
                    "number.base": "page must be a integer.",
                }),
                limit: joi_1.default.number().optional().default(20).messages({
                    "number.base": "limit must be a integer.",
                }),
            });
            const validationResult = inqueryFilteringSchema.validate(req.query);
            if (validationResult.error) {
                console.log("Error occures while validating inquery filter queries: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating inquery filter queries: ".red, err.message);
            next(err);
        }
    };
}
exports.default = InqueryMiddleware;
