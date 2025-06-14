"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class JobMiddleware {
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
            jobLocation: joi_1.default.string().trim().required().messages({
                "string.base": "jobLocation must be a string.",
                "string.empty": "jobLocation cannot be empty.",
                "any.required": "jobLocation is required.",
            }),
            applicationUrl: joi_1.default.string().trim().required().messages({
                "string.base": "applicationUrl must be a string.",
                "string.empty": "applicationUrl cannot be empty.",
                "any.required": "applicationUrl is required.",
            }),
        };
    }
    validateJobCreation = (req, res, next) => {
        try {
            const jobSchema = joi_1.default.object(this.schema);
            const validationResult = jobSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating job creation: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating job creation: ".red, err.message);
            next(err);
        }
    };
    validateJobEdit = (req, res, next) => {
        try {
            const jobSchema = joi_1.default.object({
                jobId: joi_1.default.number().required().messages({
                    "number.base": "jobId must be a number.",
                    "number.empty": "jobId cannot be empty.",
                    "any.required": "jobId is required.",
                }),
                ...this.schema,
            });
            const validationResult = jobSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating job edit: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating job edit: ".red, err.message);
            next(err);
        }
    };
    validateFilteringQueries = (req, res, next) => {
        try {
            const jobFilteringSchema = joi_1.default.object({
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
            const validationResult = jobFilteringSchema.validate(req.query);
            if (validationResult.error) {
                console.log("Error occures while validating job filter queries: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating job filter queries: ".red, err.message);
            next(err);
        }
    };
}
exports.default = JobMiddleware;
