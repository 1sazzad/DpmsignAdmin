"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const testimonial_service_1 = __importDefault(require("../service/testimonial.service"));
class TestimonialController {
    testimonialService;
    constructor() {
        this.testimonialService = new testimonial_service_1.default();
    }
    addTestimonial = async (req, res, next) => {
        try {
            const newTestimonial = {
                title: req.validatedValue.title,
                description: req.validatedValue.description,
            };
            const createdTestimonial = await this.testimonialService.addTestimonial(newTestimonial.title, newTestimonial.description);
            if (!createdTestimonial) {
                return (0, util_1.responseSender)(res, 400, "Testimonial could not be created");
            }
            return (0, util_1.responseSender)(res, 201, "Testimonial created successfully.", {
                testimonial: createdTestimonial,
            });
        }
        catch (err) {
            console.log("Error occured while creating testimonial: ".red, err.message);
            next(err);
        }
    };
    editTestimonial = async (req, res, next) => {
        try {
            const editedTestimonial = {
                testimonialId: req.validatedValue.testimonialId,
                title: req.validatedValue.title,
                description: req.validatedValue.description,
            };
            const isTestimonialExist = await this.testimonialService.getTestimonialById(editedTestimonial.testimonialId);
            if (!isTestimonialExist) {
                return (0, util_1.responseSender)(res, 400, "Testimonial does not exist");
            }
            const isEditedTestimonial = await this.testimonialService.editTestimonial(editedTestimonial.testimonialId, editedTestimonial.title, editedTestimonial.description);
            if (!isEditedTestimonial) {
                return (0, util_1.responseSender)(res, 400, "Testimonial could not be edited");
            }
            return (0, util_1.responseSender)(res, 200, "Testimonial edited successfully.");
        }
        catch (err) {
            console.log("Error occured while creating testimonial: ".red, err.message);
            next(err);
        }
    };
    deleteTestimonial = async (req, res, next) => {
        try {
            const testimonialId = req.params.testimonialId;
            const isTestimonialExist = await this.testimonialService.getTestimonialById(testimonialId);
            if (!isTestimonialExist) {
                return (0, util_1.responseSender)(res, 404, "Testimonial not found.");
            }
            const isDeleted = await this.testimonialService.deleteTestimonial(testimonialId);
            if (!isDeleted) {
                return (0, util_1.responseSender)(res, 500, "Testimonial deletion failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Testimonial deleted successfully.");
        }
        catch (err) {
            console.log("Error occures while deleting testimonial: ".red, err.message);
            next(err);
        }
    };
    getAllTestimonials = async (req, res, next) => {
        try {
            const testimonials = await this.testimonialService.getAllTestimonials();
            if (!testimonials) {
                return (0, util_1.responseSender)(res, 400, "Failed to get testimonials. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Testimonials fetched successfully.", {
                testimonials,
            });
        }
        catch (err) {
            console.log("Error occured while fetching testimonials: ".red, err.message);
            next(err);
        }
    };
}
exports.default = TestimonialController;
