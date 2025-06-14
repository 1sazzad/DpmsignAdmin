"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class TestimonialMiddleware {
    schema;
    constructor() {
        this.schema = {
            title: joi_1.default.string().trim().min(5).required().messages({
                "string.base": "title must be a string.",
                "string.empty": "title is required.",
                "string.min": "title must be at least 5 characters long.",
                "any.required": "title is required.",
            }),
            description: joi_1.default.string().trim().required().messages({
                "string.base": "description must be a string.",
                "string.empty": "description cannot be empty.",
                "any.required": "description is required.",
            }),
        };
    }
    validateTestimonialCreation = (req, res, next) => {
        try {
            const testimonialSchema = joi_1.default.object(this.schema);
            const validationResult = testimonialSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating testimonial creation: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating testimonial creation: ".red, err.message);
            next(err);
        }
    };
    validateTestimonialEdit = (req, res, next) => {
        try {
            const testimonialSchema = joi_1.default.object({
                testimonialId: joi_1.default.number().required().messages({
                    "number.base": "testimonialId must be a number.",
                    "number.empty": "testimonialId cannot be empty.",
                    "any.required": "testimonialId is required.",
                }),
                ...this.schema,
            });
            const validationResult = testimonialSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating testimonial edit: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating testimonial edit: ".red, err.message);
            next(err);
        }
    };
}
exports.default = TestimonialMiddleware;
