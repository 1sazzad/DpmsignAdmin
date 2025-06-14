"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class ProductCategoryMiddleware {
    schema;
    constructor() {
        this.schema = {
            categoryId: joi_1.default.number().required().messages({
                "number.base": "categoryId must be a number.",
                "number.empty": "categoryId cannot be empty.",
                "number.required": "categoryId is required.",
            }),
            name: joi_1.default.string().trim().required().messages({
                "string.base": "name must be a string.",
                "string.empty": "name cannot be empty.",
                "any.required": "name is required.",
            }),
            parentCategoryId: joi_1.default.number().optional().messages({
                "number.base": "parentCategoryId must be a number.",
                "number.empty": "parentCategoryId cannot be empty.",
            }),
        };
    }
    validateProductCategoryCreation = (req, res, next) => {
        try {
            const productCategorySchema = joi_1.default.object({
                name: this.schema.name,
                parentCategoryId: this.schema.parentCategoryId,
            });
            const validationResult = productCategorySchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating product category creation: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating product category creation: "
                .red, err.message);
            next(err);
        }
    };
    validateProductCategoryEdit = (req, res, next) => {
        try {
            const productCategorySchema = joi_1.default.object(this.schema);
            const validationResult = productCategorySchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating product category edit: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating product category edit: ".red, err.message);
            next(err);
        }
    };
    validateProductCategoryDeletion = (req, res, next) => {
        try {
            const productCategorySchema = joi_1.default.object({
                categoryId: this.schema.categoryId,
            });
            const validationResult = productCategorySchema.validate(req.params);
            if (validationResult.error) {
                console.log("Error occures while validating product category deletion: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating product category deletion: "
                .red, err.message);
            next(err);
        }
    };
    validateProductFetchByCategory = (req, res, next) => {
        try {
            const productCategorySchema = joi_1.default.object({
                categoryId: this.schema.categoryId,
            });
            const validationResult = productCategorySchema.validate(req.params);
            if (validationResult.error) {
                console.log("Error occures while validating product fetching by category id: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating product fetching by category id: "
                .red, err.message);
            next(err);
        }
    };
    validateFilteringQueries = (req, res, next) => {
        try {
            const productCategorySchema = joi_1.default.object({
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
            const validationResult = productCategorySchema.validate(req.query);
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
exports.default = ProductCategoryMiddleware;
