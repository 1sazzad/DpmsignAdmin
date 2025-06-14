"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class FaqMiddleware {
    schema;
    faqItemsSchema;
    constructor() {
        this.faqItemsSchema = {
            faqItemId: joi_1.default.number().optional().messages({
                "number.base": "faqItemId must be a number.",
            }),
            faqId: joi_1.default.number().optional().messages({
                "number.base": "faqId must be a number.",
            }),
            question: joi_1.default.string().required().messages({
                "string.base": "question must be a string.",
                "string.empty": "question cannot be empty.",
                "any.required": "question is required.",
            }),
            answer: joi_1.default.string().required().messages({
                "string.base": "answer must be a string.",
                "string.empty": "answer cannot be empty.",
                "any.required": "answer is required.",
            }),
        };
        this.schema = {
            faqTitle: joi_1.default.string().trim().min(5).required().messages({
                "string.base": "faqTitle must be a string.",
                "string.empty": "faqTitle cannot be empty.",
                "string.min": "faqTitle must be at least 5 characters long.",
                "any.required": "faqTitle is required.",
            }),
            faqItems: joi_1.default.array()
                .items(joi_1.default.object(this.faqItemsSchema))
                .required()
                .min(1)
                .messages({
                "array.base": "faqItems must be an array.",
                "array.empty": "faqItems cannot be empty.",
                "array.min": "At least one faqItem is required.",
            }),
        };
    }
    validateFaqCreation = (req, res, next) => {
        try {
            const faqSchema = joi_1.default.object(this.schema);
            const validationResult = faqSchema.validate(req.body, {
                abortEarly: false,
            });
            if (validationResult.error) {
                const errors = validationResult.error.details.map((detail) => ({
                    field: detail.path.join("."),
                    message: detail.message,
                }));
                console.log(errors);
                console.log("Error occures while validating faq: ".red, errors[0].message);
                return (0, util_1.responseSender)(res, 400, errors[0].message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating the faq: ".red, err.message);
            next(err);
        }
    };
    validateFaqEdit = (req, res, next) => {
        try {
            const faqSchema = joi_1.default.object({
                ...this.schema,
                faqId: joi_1.default.number().required().messages({
                    "number.base": "faqId must be a number.",
                    "any.required": "faqId is required for updating.",
                }),
            });
            const validationResult = faqSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating faq edit: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating faq edit: ".red, err.message);
            next(err);
        }
    };
    validateFilteringQueries = (req, res, next) => {
        try {
            const faqSchema = joi_1.default.object({
                searchTerm: joi_1.default.string().trim().optional().messages({
                    "string.base": "searchTerm must be a string.",
                    "string.empty": "searchTerm cannot be empty.",
                }),
                page: joi_1.default.number().optional().default(1).messages({
                    "number.base": "page must be a integer.",
                }),
                limit: joi_1.default.number().optional().default(20).messages({
                    "number.base": "limit must be a integer.",
                }),
            });
            const validationResult = faqSchema.validate(req.query);
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
exports.default = FaqMiddleware;
