"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class ProductMiddleware {
    schema;
    attributesSchema;
    variationsSchema;
    variantsSchema;
    constructor() {
        this.attributesSchema = joi_1.default.object({
            property: joi_1.default.string().trim().min(3).required().messages({
                "string.base": "property must be a string.",
                "string.empty": "property cannot be empty.",
                "any.required": "property is required.",
                "string.min": "property must be atleast 3 characters long.",
            }),
            description: joi_1.default.string().trim().min(3).required().messages({
                "string.base": "description must be a string.",
                "string.empty": "description cannot be empty.",
                "any.required": "description is required.",
                "string.min": "description must be atleast 3 characters long.",
            }),
        });
        this.variationsSchema = joi_1.default.object({
            name: joi_1.default.string().required().messages({
                "string.base": "name must be a string.",
                "string.empty": "name cannot be empty.",
                "string.required": "name is required.",
            }),
            unit: joi_1.default.string().required().allow("").messages({
                "string.base": "unit must be a string.",
                "string.required": "unit is required.",
            }),
            variationItems: joi_1.default.array().items(joi_1.default.object({
                value: joi_1.default.string().required().messages({
                    "string.base": "value must be a string.",
                    "string.empty": "value cannot be empty.",
                    "string.requried": "value is requried.",
                }),
            })),
        });
        this.variantsSchema = joi_1.default.object({
            additionalPrice: joi_1.default.number().required().messages({
                "number.base": "additionalPrice must be a number.",
                "number.empty": "additionalPrice cannot be empty.",
                "number.required": "additionalPrice is required.",
            }),
            variantDetails: joi_1.default.array().items(joi_1.default.object({
                variationName: joi_1.default.string().required().messages({
                    "string.base": "variationName must be a string.",
                    "string.empty": "variationName cannot be empty.",
                    "string.requried": "variationName is requried.",
                }),
                variationItemValue: joi_1.default.string().required().messages({
                    "string.base": "variationItemValue must be a string.",
                    "string.empty": "variationItemValue cannot be empty.",
                    "string.requried": "variationItemValue is requried.",
                }),
            })),
        });
        this.schema = {
            name: joi_1.default.string().trim().min(5).required().messages({
                "string.base": "name must be a string.",
                "string.empty": "name cannot be empty.",
                "any.required": "name is required.",
                "string.min": "name must be atleast 5 characters long.",
            }),
            description: joi_1.default.string().trim().required().messages({
                "string.base": "description must be a string.",
                "string.empty": "description cannot be empty.",
                "any.required": "description is required.",
            }),
            basePrice: joi_1.default.number().required().messages({
                "number.base": "basePrice must be a number.",
                "number.empty": "basePrice cannot be empty.",
                "any.required": "basePrice is required.",
            }),
            minOrderQuantity: joi_1.default.number().required().messages({
                "number.base": "minOrderQuantity must be a number.",
                "number.empty": "minOrderQuantity cannot be empty.",
                "any.required": "minOrderQuantity is required.",
            }),
            discountStart: joi_1.default.number().optional().messages({
                "number.base": "discountStart must be a number.",
                "number.empty": "discountStart cannot be empty.",
            }),
            discountEnd: joi_1.default.number().optional().messages({
                "number.base": "discountEnd must be a number.",
                "number.empty": "discountEnd cannot be empty.",
            }),
            discountPercentage: joi_1.default.number().optional().messages({
                "number.base": "discountPercentage must be a number.",
                "number.empty": "discountPercentage cannot be empty.",
            }),
            pricingType: joi_1.default.string()
                .trim()
                .valid("flat", "square-feet")
                .required()
                .messages({
                "string.base": "pricingType must be a string.",
                "string.empty": "pricingType cannot be empty.",
                "any.required": "pricingType is required.",
                "string.valid": "pricingType must be either 'flat' or 'square-feet'.",
            }),
            isActive: joi_1.default.boolean().default(true).optional().messages({
                "number.base": "isActive must be a boolean.",
            }),
            categoryId: joi_1.default.number().optional().allow(null).messages({
                "number.base": "categoryId must be a number.",
            }),
            attributes: joi_1.default.array()
                .items(this.attributesSchema)
                .optional()
                .messages({
                "array.base": "attributes must be an array.",
            }),
            tags: joi_1.default.array().items(joi_1.default.string()),
            variations: joi_1.default.array()
                .items(this.variationsSchema)
                .required()
                .messages({
                "array.base": "variations must be an array.",
                "array.empty": "variations cannot be empty.",
                "array.required": "variations is required.",
            }),
            variants: joi_1.default.array()
                .items(this.variantsSchema)
                .required()
                .messages({
                "array.base": "variants must be an array.",
                "array.empty": "variants cannot be empty.",
                "array.required": "variants is required.",
            }),
        };
    }
    validateProductCreation = (req, res, next) => {
        try {
            const productSchema = joi_1.default.object(this.schema);
            const validationResult = productSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating product creation: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating product creation: ".red, err.message);
            next(err);
        }
    };
    validateProductEdit = (req, res, next) => {
        try {
            const productSchema = joi_1.default.object({
                productId: joi_1.default.number().required().messages({
                    "number.base": "productId must be a number.",
                    "number.required": "productId is required.",
                    "number.empty": "productId cannot be empty.",
                }),
                ...this.schema,
            });
            const validationResult = productSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating product edit: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating product edit: ".red, err.message);
            next(err);
        }
    };
    validateProductDeletion = (req, res, next) => {
        try {
            const productSchema = joi_1.default.object({
                productId: joi_1.default.number().required().messages({
                    "number.base": "productId must be a number.",
                    "number.empty": "productId cannot be empty.",
                    "number.required": "productId is required.",
                }),
            });
            const validationResult = productSchema.validate(req.params);
            if (validationResult.error) {
                console.log("Error occures while validating product deletion: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating product deletion: ".red, err.message);
            next(err);
        }
    };
    validateProductFetchById = (req, res, next) => {
        try {
            const productSchema = joi_1.default.object({
                productId: joi_1.default.number().required().messages({
                    "number.base": "productId must be a number.",
                    "number.empty": "productId cannot be empty.",
                    "number.required": "productId is required.",
                }),
            });
            const validationResult = productSchema.validate(req.params);
            if (validationResult.error) {
                console.log("Error occures while validating product fetcb by id: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating product fetcb by id: ".red, err.message);
            next(err);
        }
    };
    validateProductStatusChange = (req, res, next) => {
        try {
            const productSchema = joi_1.default.object({
                productId: joi_1.default.number().required().messages({
                    "number.base": "productId must be a integer.",
                    "number.required": "productId is required.",
                }),
            });
            const validationResult = productSchema.validate(req.query);
            if (validationResult.error) {
                console.log("Error occures while validating product status change operation: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating product status change operation: "
                .red, err.message);
            next(err);
        }
    };
    validateFilteringQueries = (req, res, next) => {
        try {
            const productSchema = joi_1.default.object({
                searchTerm: joi_1.default.string().trim().optional().messages({
                    "string.base": "searchTerm must be a string.",
                    "string.empty": "searchTerm cannot be empty.",
                }),
                searchBy: joi_1.default.string()
                    .trim()
                    .optional()
                    .valid("name", "sku")
                    .messages({
                    "string.base": "searchBy must be a string.",
                    "any.valid": "searchBy should be 'name' or 'sku'.",
                    "string.empty": "searchBy cannot be empty.",
                }),
                page: joi_1.default.number().optional().default(1).messages({
                    "number.base": "page must be a integer.",
                }),
                limit: joi_1.default.number().optional().default(20).messages({
                    "number.base": "limit must be a integer.",
                }),
            });
            const validationResult = productSchema.validate(req.query);
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
    validateRandomProductsFetching = (req, res, next) => {
        try {
            const productSchema = joi_1.default.object({
                limit: joi_1.default.number().required().messages({
                    "number.base": "limit must be a integer.",
                    "number.empty": "limit cannot be empty.",
                    "number.required": "limit is required.",
                }),
                excludeProductId: joi_1.default.number().optional().messages({
                    "number.base": "excludeProductId must be a integer.",
                }),
            });
            const validationResult = productSchema.validate(req.query);
            if (validationResult.error) {
                console.log("Error occures while validating random product fetching: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating random product fetching: ".red, err.message);
            next(err);
        }
    };
}
exports.default = ProductMiddleware;
