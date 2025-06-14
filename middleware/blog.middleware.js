"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class BlogMiddleware {
    schema;
    constructor() {
        this.schema = {
            title: joi_1.default.string().trim().min(5).required().messages({
                "string.base": "title must be a string.",
                "string.empty": "title is required.",
                "string.min": "title must be at least 5 characters long.",
                "any.required": "title is required.",
            }),
            content: joi_1.default.string().trim().required().messages({
                "string.base": "content must be a string.",
                "string.empty": "content cannot be empty.",
                "any.required": "content is required.",
            }),
        };
    }
    validateBlogCreation = (req, res, next) => {
        try {
            const blogSchema = joi_1.default.object(this.schema);
            const validationResult = blogSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating blog creation: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating blog creation: ".red, err.message);
            next(err);
        }
    };
    validateBlogEdit = (req, res, next) => {
        try {
            const blogSchema = joi_1.default.object({
                blogId: joi_1.default.number().required().messages({
                    "number.base": "blogId must be a number.",
                    "number.empty": "blogId cannot be empty.",
                    "any.required": "blogId is required.",
                }),
                ...this.schema,
            });
            const validationResult = blogSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating blog edit: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating blog edit: ".red, err.message);
            next(err);
        }
    };
    validateFilteringQueries = (req, res, next) => {
        try {
            const blogFilteringSchema = joi_1.default.object({
                searchTerm: joi_1.default.string().trim().optional().messages({
                    "string.base": "search term must be a string.",
                    "string.empty": "search term cannot be empty.",
                }),
                page: joi_1.default.number().optional().default(1).messages({
                    "number.base": "page must be a integer.",
                }),
                limit: joi_1.default.number().optional().default(20).messages({
                    "number.base": "limit must be a integer.",
                }),
            });
            const validationResult = blogFilteringSchema.validate(req.query);
            if (validationResult.error) {
                console.log("Error occures while validating blog filter queries: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating blog filter queries: ".red, err.message);
            next(err);
        }
    };
}
exports.default = BlogMiddleware;
