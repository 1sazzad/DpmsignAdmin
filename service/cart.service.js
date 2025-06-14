"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_model_1 = __importDefault(require("../model/cart.model"));
const product_model_1 = __importDefault(require("../model/product.model"));
const product_variant_model_1 = __importDefault(require("../model/product-variant.model"));
const product_variant_detail_model_1 = __importDefault(require("../model/product-variant-detail.model"));
const variation_item_model_1 = __importDefault(require("../model/variation-item.model"));
const variation_model_1 = __importDefault(require("../model/variation.model"));
const sequelize_1 = require("sequelize");
class CartService {
    addItemToCart = async (customerId, productId, productVariantId, quantity, size, widthInch, heightInch, price) => {
        try {
            const newCartItem = await cart_model_1.default.create({
                customerId,
                productId,
                productVariantId,
                quantity,
                size,
                widthInch,
                heightInch,
                price,
            });
            const createdCartItem = await this.getCartItemById(newCartItem.cartItemId);
            return createdCartItem || null;
        }
        catch (err) {
            console.log("Error occurred while adding item into cart: ".red, err.message);
            throw err;
        }
    };
    getCartItemById = async (cartItemId) => {
        try {
            const cartItem = await cart_model_1.default.findByPk(cartItemId, {
                subQuery: false,
                include: [
                    {
                        model: product_model_1.default,
                        as: "product",
                        attributes: ["productId", "name", "basePrice"],
                    },
                    {
                        model: product_variant_model_1.default,
                        as: "productVariant",
                        attributes: [
                            "productVariantId",
                            "productId",
                            "additionalPrice",
                        ],
                        include: [
                            {
                                model: product_variant_detail_model_1.default,
                                as: "variantDetails",
                                attributes: [
                                    "productVariantDetailId",
                                    "productVariantId",
                                    "variationItemId",
                                ],
                                separate: true,
                                include: [
                                    {
                                        model: variation_item_model_1.default,
                                        attributes: ["value"],
                                        include: [
                                            {
                                                model: variation_model_1.default,
                                                as: "variation",
                                                attributes: ["name", "unit"],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            return cartItem ? cartItem.toJSON() : null;
        }
        catch (err) {
            console.log("Error occurred while fetching cart item by id: ".red, err.message);
            throw err;
        }
    };
    deleteCartItem = async (cartItemId) => {
        try {
            const cartItem = await cart_model_1.default.findByPk(cartItemId);
            if (cartItem) {
                await cartItem.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while deleting cart item by id: ".red, err.message);
            throw err;
        }
    };
    clearCartItems = async (customerId) => {
        try {
            // Find all cart items for the given customer
            const cartItems = await cart_model_1.default.findAll({
                where: { customerId },
            });
            // If no items found, return false
            if (!cartItems.length) {
                return false;
            }
            // Bulk delete all cart items for the customer
            await cart_model_1.default.destroy({
                where: { customerId },
            });
            return true;
        }
        catch (err) {
            console.log("Error occurred while deleting cart items: ".red, err.message);
            throw err;
        }
    };
    getAllCartItems = async (customerId) => {
        try {
            const cartItems = await cart_model_1.default.findAll({
                where: { customerId },
                subQuery: false,
                include: [
                    {
                        model: product_model_1.default,
                        as: "product",
                        attributes: ["productId", "name", "basePrice"],
                    },
                    {
                        model: product_variant_model_1.default,
                        as: "productVariant",
                        attributes: [
                            "productVariantId",
                            "productId",
                            "additionalPrice",
                        ],
                        include: [
                            {
                                model: product_variant_detail_model_1.default,
                                as: "variantDetails",
                                attributes: [
                                    "productVariantDetailId",
                                    "productVariantId",
                                    "variationItemId",
                                ],
                                separate: true,
                                include: [
                                    {
                                        model: variation_item_model_1.default,
                                        attributes: ["value"],
                                        include: [
                                            {
                                                model: variation_model_1.default,
                                                as: "variation",
                                                attributes: ["name", "unit"],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            return cartItems.map((order) => order.toJSON());
        }
        catch (err) {
            console.log("Error occurred while fetching cart items by customer id: ".red, err.message);
            throw err;
        }
    };
    static cleanupCartItems = async () => {
        try {
            await cart_model_1.default.destroy({
                where: {
                    createdAt: {
                        [sequelize_1.Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                },
            });
            console.log("Cart items cleaned up successfully.".green);
        }
        catch (error) {
            console.log("Error cleaning up cart items: ".red, error);
        }
    };
}
exports.default = CartService;
