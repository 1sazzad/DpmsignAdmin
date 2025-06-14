"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class ProductReviewMiddleware {
    schema;
    constructor() {
        this.schema = {
            reviewId: joi_1.default.number().required().messages({
                "number.base": "reviewId must be a number.",
                "number.empty": "reviewId cannot be empty.",
                "any.required": "reviewId is required.",
            }),
            rating: joi_1.default.number().required().min(1).max(5).messages({
                "number.base": "rating must be a number.",
                "number.empty": "rating cannot be empty.",
                "number.min": "rating should be between 1 to 5.",
                "number.max": "rating should be between 1 to 5.",
                "any.required": "rating is required.",
            }),
            status: joi_1.default.string()
                .trim()
                .allow("published", "unpublished")
                .required()
                .messages({
                "string.base": "status must be a string.",
                "string.empty": "status cannot be empty.",
                "any.required": "status is required.",
                "string.allow": "status should be either 'published' or 'unpublished'.",
            }),
            description: joi_1.default.string().trim().min(5).required().messages({
                "string.base": "description must be a string.",
                "string.empty": "description cannot be empty.",
                "any.required": "description is required.",
                "string.min": "description must be atleast 5 characters long.",
            }),
            productId: joi_1.default.number().required().messages({
                "number.base": "productId must be a number.",
                "number.empty": "productId cannot be empty.",
            }),
            customerId: joi_1.default.number().required().messages({
                "number.base": "customerId must be a number.",
                "number.empty": "customerId cannot be empty.",
            }),
        };
    }
    validateProductReviewCreation = (req, res, next) => {
        try {
            const productReviewSchema = joi_1.default.object({
                rating: this.schema.rating,
                description: this.schema.description,
                productId: this.schema.productId,
                customerId: this.schema.customerId,
            });
            const validationResult = productReviewSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating product review creation: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating product review creation: ".red, err.message);
            next(err);
        }
    };
    validateProductReviewStatusUpdate = (req, res, next) => {
        try {
            const productReviewSchema = joi_1.default.object({
                reviewId: this.schema.reviewId,
                status: this.schema.status,
            });
            const validationResult = productReviewSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating product review status update: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating product review status update: "
                .red, err.message);
            next(err);
        }
    };
    validateFilteringQueries = (req, res, next) => {
        try {
            const productReviewSchema = joi_1.default.object({
                searchTerm: joi_1.default.string().trim().optional().messages({
                    "string.base": "searchTerm must be a string.",
                    "string.empty": "searchTerm cannot be empty.",
                }),
                searchBy: joi_1.default.string()
                    .trim()
                    .optional()
                    .valid("product-name", "customer-name")
                    .messages({
                    "string.base": "searchBy must be a string.",
                    "any.valid": "searchBy should be 'product-name' or 'customer-name'.",
                    "string.empty": "searchBy cannot be empty.",
                }),
                status: joi_1.default.string()
                    .trim()
                    .optional()
                    .valid("published", "unpublished")
                    .messages({
                    "string.base": "status must be a string.",
                    "any.valid": "status should be 'published' or 'unpublished'.",
                    "string.empty": "status cannot be empty.",
                }),
                page: joi_1.default.number().optional().default(1).messages({
                    "number.base": "page must be a integer.",
                }),
                limit: joi_1.default.number().optional().default(20).messages({
                    "number.base": "limit must be a integer.",
                }),
            });
            const validationResult = productReviewSchema.validate(req.query);
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
exports.default = ProductReviewMiddleware;
