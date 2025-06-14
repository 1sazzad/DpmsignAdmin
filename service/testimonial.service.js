"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testimonial_model_1 = __importDefault(require("../model/testimonial.model"));
class TestimonialService {
    addTestimonial = async (title, description) => {
        try {
            const createdTestimonial = await testimonial_model_1.default.create({
                title,
                description,
            });
            return createdTestimonial ? createdTestimonial.toJSON() : null;
        }
        catch (err) {
            console.log("Error occured while creating testimonial: ".red, err.message);
            throw err;
        }
    };
    editTestimonial = async (testimonialId, title, description) => {
        try {
            const testimonial = await testimonial_model_1.default.findByPk(testimonialId);
            if (testimonial) {
                testimonial.title = title;
                testimonial.description = description;
                await testimonial.save();
                return testimonial.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while updating testimonial: ".red, err.message);
            throw err;
        }
    };
    getTestimonialById = async (testimonialId) => {
        try {
            const testimonial = await testimonial_model_1.default.findByPk(testimonialId);
            return testimonial ? testimonial.toJSON() : null;
        }
        catch (err) {
            console.log("Error occured while getting testimonial by id: ".red, err.message);
            throw err;
        }
    };
    deleteTestimonial = async (testimonialId) => {
        try {
            const testimonial = await testimonial_model_1.default.findByPk(testimonialId);
            if (testimonial) {
                await testimonial.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while deleting testimonial by id: ".red, err.message);
            throw err;
        }
    };
    getAllTestimonials = async () => {
        try {
            const testimonials = await testimonial_model_1.default.findAll();
            if (testimonials) {
                return testimonials.map((testimonial) => testimonial.toJSON());
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while getting testimonials: ".red, err.message);
            throw err;
        }
    };
}
exports.default = TestimonialService;
