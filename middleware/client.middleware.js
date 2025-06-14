"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class ClientMiddleware {
    schema;
    constructor() {
        this.schema = {
            type: joi_1.default.string().trim().min(5).required().messages({
                "string.base": "type must be a string.",
                "string.empty": "type is required.",
                "string.min": "type must be at least 5 characters long.",
                "any.required": "type is required.",
            }),
            clientLogos: joi_1.default.array().items(joi_1.default.string().trim().required().messages({
                "string.base": "clientLogoUrl must be a string.",
                "string.empty": "clientLogoUrl cannot be empty.",
                "any.required": "clientLogoUrl is required.",
            })),
        };
    }
    validateClientCreation = (req, res, next) => {
        try {
            const clientSchema = joi_1.default.object(this.schema);
            const validationResult = clientSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating client creation: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating client creation: ".red, err.message);
            next(err);
        }
    };
    validateClientEdit = (req, res, next) => {
        try {
            const clientSchema = joi_1.default.object({
                clientId: joi_1.default.number().required().messages({
                    "number.base": "clientId must be a number.",
                    "number.empty": "clientId cannot be empty.",
                    "any.required": "clientId is required.",
                }),
                ...this.schema,
            });
            const validationResult = clientSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating client edit: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating client edit: ".red, err.message);
            next(err);
        }
    };
    validateFilteringQueries = (req, res, next) => {
        try {
            const clientFilteringSchema = joi_1.default.object({
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
            const validationResult = clientFilteringSchema.validate(req.query);
            if (validationResult.error) {
                console.log("Error occures while validating client filter queries: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating client filter queries: ".red, err.message);
            next(err);
        }
    };
}
exports.default = ClientMiddleware;
