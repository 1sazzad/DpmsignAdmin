"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const cart_middleware_1 = __importDefault(require("../middleware/cart.middleware"));
const cart_controller_1 = __importDefault(require("../controller/cart.controller"));
const cartMiddleware = new cart_middleware_1.default();
const cartController = new cart_controller_1.default();
const authMiddleware = new auth_middleware_1.default();
const cartRouter = express_1.default.Router();
cartRouter.get("/:customerId", authMiddleware.authenticate(["customer"]), cartController.getAllCartItems);
cartRouter.post("/add", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["customer"]), cartMiddleware.validateCartCreation, cartController.addItemToCart);
// cartRouter.put(
// 	"/",
// 	strictLimiter,
// 	couponMiddleware.validateCouponEdit,
// 	couponController.editCoupon,
// );
cartRouter.delete("/:cartItemId", authMiddleware.authenticate(["customer"]), cartMiddleware.validateCartDeletion, cartController.deleteCartItem);
exports.default = cartRouter;
