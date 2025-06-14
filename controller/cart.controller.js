"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const cart_service_1 = __importDefault(require("../service/cart.service"));
class CartController {
    cartService;
    constructor() {
        this.cartService = new cart_service_1.default();
    }
    addItemToCart = async (req, res, next) => {
        try {
            const newCartItem = {
                customerId: req.validatedValue.customerId,
                productId: req.validatedValue.productId,
                productVariantId: req.validatedValue.productVariantId,
                quantity: req.validatedValue.quantity,
                size: req.validatedValue.size,
                widthInch: req.validatedValue.widthInch,
                heightInch: req.validatedValue.heightInch,
                price: req.validatedValue.price,
            };
            const createdCartItem = await this.cartService.addItemToCart(newCartItem.customerId, newCartItem.productId, newCartItem.productVariantId, newCartItem.quantity, newCartItem.size, newCartItem.widthInch, newCartItem.heightInch, newCartItem.price);
            if (!createdCartItem) {
                return (0, util_1.responseSender)(res, 400, "Product failed to add cart. Please try again.");
            }
            return (0, util_1.responseSender)(res, 201, "Product successfully added to the cart.", {
                cartItem: createdCartItem,
            });
        }
        catch (err) {
            console.log("Error occured while adding product in the cart: ".red, err.message);
            next(err);
        }
    };
    deleteCartItem = async (req, res, next) => {
        try {
            const cartItemId = req.params.cartItemId;
            const isCartItemExist = await this.cartService.getCartItemById(cartItemId);
            if (!isCartItemExist) {
                return (0, util_1.responseSender)(res, 404, "Cart item cannot found.");
            }
            const isDeleted = await this.cartService.deleteCartItem(cartItemId);
            if (!isDeleted) {
                return (0, util_1.responseSender)(res, 500, "Cart item deletion failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Cart item deleted successfully.");
        }
        catch (err) {
            console.log("Error occures while deleting cart item: ".red, err.message);
            next(err);
        }
    };
    getAllCartItems = async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            const cartItems = await this.cartService.getAllCartItems(customerId);
            return (0, util_1.responseSender)(res, 200, "Cart item fetched successfully.", {
                cartItems: cartItems || [],
            });
        }
        catch (err) {
            console.log("Error occured while fetching cart items: ".red, err.message);
            next(err);
        }
    };
}
exports.default = CartController;
