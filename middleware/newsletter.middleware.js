"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class NewsletterMiddleware {
    schema;
    constructor() {
        this.schema = {
            email: joi_1.default.string().trim().email().required().messages({
                "string.base": "email must be a string.",
                "string.email": "invalid email address.",
                "string.empty": "email cannot be empty.",
                "any.required": "email is required.",
            }),
            token: joi_1.default.string().trim().required().messages({
                "string.base": "token must be a string.",
                "string.empty": "token cannot be empty.",
                "any.required": "token is required.",
            }),
        };
    }
    validateEmailFromBody = (req, res, next) => {
        try {
            const newsletterSchema = joi_1.default.object({ email: this.schema.email });
            const validationResult = newsletterSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating email from request body: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating email from request body: ".red, err.message);
            next(err);
        }
    };
    validateEmailFromQuery = (req, res, next) => {
        try {
            const newsletterSchema = joi_1.default.object(this.schema);
            const validationResult = newsletterSchema.validate(req.query);
            if (validationResult.error) {
                console.log("Error occures while validating email from request query: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating email from request query: ".red, err.message);
            next(err);
        }
    };
    validateFilteringQueries = (req, res, next) => {
        try {
            const newsletterSchema = joi_1.default.object({
                searchTerm: joi_1.default.string().trim().optional().messages({
                    "string.base": "Search term must be a string.",
                    "string.empty": "Search term cannot be empty.",
                }),
                Verified: joi_1.default.boolean().optional().messages({
                    "boolean.base": "verified must be a boolean.",
                }),
                page: joi_1.default.number().optional().default(1).messages({
                    "number.base": "Page must be a integer.",
                }),
                limit: joi_1.default.number().optional().default(20).messages({
                    "number.base": "Limit must be a integer.",
                }),
            });
            const validationResult = newsletterSchema.validate(req.query);
            if (validationResult.error) {
                console.log("Error occures while validating filtering queries: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating filtering queries: ".red, err.message);
            next(err);
        }
    };
}
exports.default = NewsletterMiddleware;
