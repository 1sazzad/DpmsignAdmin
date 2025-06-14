"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class CouponMiddleware {
    schema;
    constructor() {
        this.schema = {
            couponId: joi_1.default.number().required().messages({
                "number.base": "couponId must be a number.",
                "number.empty": "couponId cannot be empty.",
                "number.required": "couponId is required.",
            }),
            name: joi_1.default.string().trim().required().messages({
                "string.base": "name must be a string.",
                "string.empty": "name cannot be empty.",
                "any.required": "name is required.",
            }),
            code: joi_1.default.string().required().messages({
                "string.base": "code must be a string.",
                "any.required": "code is required.",
            }),
            amount: joi_1.default.number().required().messages({
                "number.base": "amount must be a number.",
                "number.empty": "amount cannot be empty.",
                "number.required": "amount is required.",
            }),
            minimumAmount: joi_1.default.number().required().messages({
                "number.base": "minimumAmount must be a number.",
                "number.empty": "minimumAmount cannot be empty.",
                "number.required": "minimumAmount is required.",
            }),
            discountType: joi_1.default.string()
                .trim()
                .required()
                .valid("flat", "percentage")
                .messages({
                "string.base": "Discount type must be a string.",
                "any.required": "Discount type is required. It should be either flat or percentage.",
            }),
            endDate: joi_1.default.date().required().messages({
                "number.base": "endDate must be a number.",
                "number.empty": "endDate cannot be empty.",
                "number.required": "endDate is required.",
            }),
        };
    }
    validateCouponCreation = (req, res, next) => {
        try {
            const couponSchema = joi_1.default.object({
                name: this.schema.name,
                code: this.schema.code,
                discountType: this.schema.discountType,
                amount: this.schema.amount,
                minimumAmount: this.schema.minimumAmount,
                endDate: this.schema.endDate,
            });
            const validationResult = couponSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating coupon creation: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating coupon creation: ".red, err.message);
            next(err);
        }
    };
    validateCouponEdit = (req, res, next) => {
        try {
            const couponSchema = joi_1.default.object({
                couponId: this.schema.couponId,
                name: this.schema.name,
                discountType: this.schema.discountType,
                amount: this.schema.amount,
                minimumAmount: this.schema.minimumAmount,
                endDate: this.schema.endDate,
            });
            const validationResult = couponSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating coupon edit: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating coupon edit: ".red, err.message);
            next(err);
        }
    };
    validateCouponDeletion = (req, res, next) => {
        try {
            const couponSchema = joi_1.default.object({
                couponId: this.schema.couponId,
            });
            const validationResult = couponSchema.validate(req.params);
            if (validationResult.error) {
                console.log("Error occures while validating coupon deletion: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating coupon deletion: ".red, err.message);
            next(err);
        }
    };
    validateCouponCheck = (req, res, next) => {
        try {
            const couponSchema = joi_1.default.object({
                code: this.schema.code.allow(""),
                couponId: this.schema.couponId.optional(),
                totalPrice: joi_1.default.number().required().messages({
                    "number.base": "totalPrice must be a number.",
                    "number.empty": "totalPrice cannot be empty.",
                    "number.required": "totalPrice is required.",
                }),
            });
            const validationResult = couponSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating coupon check: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating coupon check: ".red, err.message);
            next(err);
        }
    };
    validateFilteringQueries = (req, res, next) => {
        try {
            const couponScema = joi_1.default.object({
                searchTerm: joi_1.default.string().trim().optional().messages({
                    "string.base": "searchTerm must be a string.",
                    "string.empty": "searchTerm cannot be empty.",
                }),
                searchBy: joi_1.default.string()
                    .trim()
                    .optional()
                    .valid("name", "code")
                    .messages({
                    "string.base": "searchBy must be a string.",
                    "any.valid": "searchBy should be 'name', 'code'",
                    "string.empty": "searchBy cannot be empty.",
                }),
                page: joi_1.default.number().optional().default(1).messages({
                    "number.base": "page must be a integer.",
                }),
                limit: joi_1.default.number().optional().default(20).messages({
                    "number.base": "limit must be a integer.",
                }),
            });
            const validationResult = couponScema.validate(req.query);
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
exports.default = CouponMiddleware;
