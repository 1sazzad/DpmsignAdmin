"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const product_review_middleware_1 = __importDefault(require("../middleware/product-review.middleware"));
const product_review_controller_1 = __importDefault(require("../controller/product-review.controller"));
const productReviewMiddleware = new product_review_middleware_1.default();
const productReviewController = new product_review_controller_1.default();
const authMiddleware = new auth_middleware_1.default();
const productReviewRouter = express_1.default.Router();
productReviewRouter.get("/", authMiddleware.authenticate(["admin", "agent"]), productReviewMiddleware.validateFilteringQueries, productReviewController.getAllReviews);
productReviewRouter.post("/create", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["customer"]), productReviewMiddleware.validateProductReviewCreation, productReviewController.createReview);
productReviewRouter.put("/", rateLimiter_middleware_1.strictLimiter, productReviewMiddleware.validateProductReviewStatusUpdate, productReviewController.setStatus);
exports.default = productReviewRouter;
