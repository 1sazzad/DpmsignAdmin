"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_model_1 = __importDefault(require("../model/customer.model"));
const product_review_model_1 = __importDefault(require("../model/product-review.model"));
const product_model_1 = __importDefault(require("../model/product.model"));
class ProductReviewService {
    // create a new product review
    createReview = async (rating, description, productId, customerId) => {
        try {
            const review = await product_review_model_1.default.create({
                rating,
                description,
                productId,
                customerId,
            });
            if (!review) {
                return null;
            }
            const createdReview = await product_review_model_1.default.findByPk(review.reviewId, {
                include: [
                    {
                        model: product_model_1.default,
                        as: "product",
                        attributes: ["productId", "name"],
                    },
                    {
                        model: customer_model_1.default,
                        as: "customer",
                        attributes: ["customerId", "name", "email"],
                    },
                ],
            });
            return createdReview ? createdReview.toJSON() : null;
        }
        catch (err) {
            console.log("Error while creating product review: ".red, err.message);
            throw err;
        }
    };
    // Get a review by reviewId
    getReviewByReviewId = async (reviewId) => {
        try {
            const review = await product_review_model_1.default.findByPk(reviewId, {
                include: [
                    {
                        model: product_model_1.default,
                        as: "product",
                        attributes: ["productId", "name"],
                    },
                    {
                        model: customer_model_1.default,
                        as: "customer",
                        attributes: ["customerId", "name", "email"],
                    },
                ],
            });
            return review ? review.toJSON() : null;
        }
        catch (err) {
            console.log("Error while fetching product review by id: ".red, err.message);
            throw err;
        }
    };
    // set status by review id
    setStatusById = async (reviewId, status) => {
        try {
            const [updatedRows] = await product_review_model_1.default.update({ status }, {
                where: { reviewId },
            });
            return updatedRows > 0;
        }
        catch (err) {
            console.log("Error while deleting product review: ".red, err.message);
            throw err;
        }
    };
    // Delete a review by id
    deleteReviewById = async (reviewId) => {
        try {
            const review = await product_review_model_1.default.findByPk(reviewId);
            if (review) {
                await review.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error while deleting product review: ".red, err.message);
            throw err;
        }
    };
    getAllReviews = async (filter = {}, limit, offset, order) => {
        try {
            const reviews = await product_review_model_1.default.findAll({
                where: filter,
                limit,
                offset,
                order,
                subQuery: false,
                include: [
                    {
                        model: product_model_1.default,
                        as: "product",
                        attributes: ["productId", "name"],
                    },
                    {
                        model: customer_model_1.default,
                        as: "customer",
                        attributes: ["customerId", "name", "email"],
                    },
                ],
            });
            const count = await product_review_model_1.default.count({ where: filter });
            return {
                rows: reviews.map((review) => review.toJSON()),
                count,
            };
        }
        catch (err) {
            console.log("Error occurred while getting all product reviews: ".red, err.message);
            throw err;
        }
    };
}
exports.default = ProductReviewService;
