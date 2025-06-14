"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class TransactionMiddleware {
    validateFilteringQueries = (req, res, next) => {
        try {
            const transactionSchema = joi_1.default.object({
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
            const validationResult = transactionSchema.validate(req.query);
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
exports.default = TransactionMiddleware;
