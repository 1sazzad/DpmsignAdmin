"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class CourierMiddleware {
    schema;
    constructor() {
        this.schema = {
            courierId: joi_1.default.number().required().messages({
                "number.base": "courierId must be a number.",
                "number.empty": "courierId cannot be empty.",
                "number.required": "courierId is required.",
            }),
            name: joi_1.default.string().trim().required().messages({
                "string.base": "name must be a string.",
                "string.empty": "name cannot be empty.",
                "any.required": "name is required.",
            }),
        };
    }
    validateCourierCreation = (req, res, next) => {
        try {
            const courierSchema = joi_1.default.object({
                name: this.schema.name,
            });
            const validationResult = courierSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating courier creation: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating courier creation: ".red, err.message);
            next(err);
        }
    };
    validateCourierEdit = (req, res, next) => {
        try {
            const courierSchema = joi_1.default.object({
                courierId: this.schema.courierId,
                name: this.schema.name,
            });
            const validationResult = courierSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating courier edit: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating courier edit: ".red, err.message);
            next(err);
        }
    };
    validateCourierDeletion = (req, res, next) => {
        try {
            const courierSchema = joi_1.default.object({
                courierId: this.schema.courierId,
            });
            const validationResult = courierSchema.validate(req.params);
            if (validationResult.error) {
                console.log("Error occures while validating courier deletion: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating courier deletion: ".red, err.message);
            next(err);
        }
    };
    validateFilteringQueries = (req, res, next) => {
        try {
            const courierScema = joi_1.default.object({
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
            const validationResult = courierScema.validate(req.query);
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
exports.default = CourierMiddleware;
