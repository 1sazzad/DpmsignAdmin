"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const testimonial_controller_1 = __importDefault(require("../controller/testimonial.controller"));
const testimonial_middleware_1 = __importDefault(require("../middleware/testimonial.middleware"));
const testimonialController = new testimonial_controller_1.default();
const testimonialMiddleware = new testimonial_middleware_1.default();
const authMiddleware = new auth_middleware_1.default();
const testimonialRouter = express_1.default.Router();
testimonialRouter.get("/", testimonialController.getAllTestimonials);
testimonialRouter.post("/", rateLimiter_middleware_1.strictLimiter, testimonialMiddleware.validateTestimonialCreation, testimonialController.addTestimonial);
testimonialRouter.put("/", rateLimiter_middleware_1.strictLimiter, testimonialMiddleware.validateTestimonialEdit, testimonialController.editTestimonial);
testimonialRouter.delete("/:testimonialId", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), testimonialController.deleteTestimonial);
exports.default = testimonialRouter;
