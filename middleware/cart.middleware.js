"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class CartMiddleware {
    schema;
    constructor() {
        this.schema = {
            customerId: joi_1.default.number().required().messages({
                "number.base": "customerId must be a number.",
                "number.empty": "customerId cannot be empty.",
                "number.required": "customerId is required.",
            }),
            productId: joi_1.default.number().required().messages({
                "number.base": "productId must be a number.",
                "number.empty": "productId cannot be empty.",
                "number.required": "productId is required.",
            }),
            productVariantId: joi_1.default.number().required().messages({
                "number.base": "productVariantId must be a number.",
                "number.empty": "productVariantId cannot be empty.",
                "number.required": "productVariantId is required.",
            }),
            quantity: joi_1.default.number().required().messages({
                "number.base": "quantity must be a number.",
                "number.empty": "quantity cannot be empty.",
                "number.required": "quantity is required.",
            }),
            size: joi_1.default.number().optional().allow(null).messages({
                "number.base": "size must be a number.",
                "number.empty": "size cannot be empty.",
            }),
            widthInch: joi_1.default.number().optional().allow(null).messages({
                "number.base": "widthInch must be a number.",
                "number.empty": "widthInch cannot be empty.",
            }),
            heightInch: joi_1.default.number().optional().allow(null).messages({
                "number.base": "heightInch must be a number.",
                "number.empty": "heightInch cannot be empty.",
            }),
            price: joi_1.default.number().required().messages({
                "number.base": "price must be a number.",
                "number.empty": "price cannot be empty.",
                "number.required": "price is required.",
            }),
        };
    }
    validateCartCreation = (req, res, next) => {
        try {
            const cartSchema = joi_1.default.object(this.schema);
            const validationResult = cartSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating cart creation: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating cart creation: ".red, err.message);
            next(err);
        }
    };
    validateCartEdit = (req, res, next) => {
        try {
            const cartSchema = joi_1.default.object(this.schema);
            const validationResult = cartSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating cart edit: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating cart edit: ".red, err.message);
            next(err);
        }
    };
    validateCartDeletion = (req, res, next) => {
        try {
            const cartSchema = joi_1.default.object({
                cartItemId: joi_1.default.number().required().messages({
                    "number.base": "cartItemId must be a number.",
                    "number.empty": "cartItemId cannot be empty.",
                    "number.required": "cartItemId is required.",
                }),
            });
            const validationResult = cartSchema.validate(req.params);
            if (validationResult.error) {
                console.log("Error occures while validating cart deletion: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating cart deletion: ".red, err.message);
            next(err);
        }
    };
}
exports.default = CartMiddleware;
