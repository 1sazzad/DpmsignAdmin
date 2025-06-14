"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_review_service_1 = __importDefault(require("../service/product-review.service"));
const util_1 = require("../util");
class ProductReviewController {
    productReviewService;
    constructor() {
        this.productReviewService = new product_review_service_1.default();
    }
    createReview = async (req, res, next) => {
        try {
            const newReview = {
                rating: req.validatedValue.rating,
                description: req.validatedValue.description,
                productId: req.validatedValue.productId,
                customerId: req.validatedValue.customerId,
            };
            const createdReview = await this.productReviewService.createReview(newReview.rating, newReview.description, newReview.productId, newReview.customerId);
            if (!createdReview) {
                return (0, util_1.responseSender)(res, 500, "Product review creation failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 201, "Thank you for rating this product.", {
                review: createdReview,
            });
        }
        catch (err) {
            console.log("Error occured while creating product review: ".red, err.message);
            next(err);
        }
    };
    setStatus = async (req, res, next) => {
        try {
            const fetchedReview = await this.productReviewService.getReviewByReviewId(req.validatedValue.reviewId);
            if (!fetchedReview) {
                return (0, util_1.responseSender)(res, 400, "Product review couldn't found.");
            }
            const isUpdated = await this.productReviewService.setStatusById(fetchedReview.reviewId, req.validatedValue.status);
            if (!isUpdated) {
                return (0, util_1.responseSender)(res, 500, "Product review couldn't updated. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Product review updated successfully.");
        }
        catch (err) {
            console.log("Error occured while creating product review: ".red, err.message);
            next(err);
        }
    };
    getAllReviews = async (req, res, next) => {
        try {
            // const searchTerm = (req as any).validatedValue.searchTerm;
            // const searchBy = (req as any).validatedValue.searchBy;
            const status = req.validatedValue.status;
            const currentPage = parseInt(req.validatedValue.page || 1);
            const limitPerPage = parseInt(req.validatedValue.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const order = [["createdAt", "DESC"]];
            const filter = {};
            if (status) {
                filter.status = status;
            }
            const reviews = await this.productReviewService.getAllReviews(filter, limitPerPage, offset, order);
            if (!reviews.rows) {
                return (0, util_1.responseSender)(res, 400, "Failed to get reviews. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Reviews fetched successfully.", {
                reviews: reviews.rows,
                total: reviews.count,
                totalPages: Math.ceil(reviews.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while fetching product reviews: ".red, err.message);
            next(err);
        }
    };
}
exports.default = ProductReviewController;
