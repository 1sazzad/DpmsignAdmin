"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const product_middleware_1 = __importDefault(require("../middleware/product.middleware"));
const product_controller_1 = __importDefault(require("../controller/product.controller"));
const imageUploader_middleware_1 = __importDefault(require("../middleware/imageUploader.middleware"));
const productMiddleware = new product_middleware_1.default();
const productController = new product_controller_1.default();
const authMiddleware = new auth_middleware_1.default();
const productImageUploader = new imageUploader_middleware_1.default();
const productRouter = express_1.default.Router();
productRouter.get("/", productMiddleware.validateFilteringQueries, productController.getAllProducts);
productRouter.get("/random", productMiddleware.validateRandomProductsFetching, productController.getRandomProducts);
productRouter.get("/:productId", productMiddleware.validateProductFetchById, productController.getProductById);
productRouter.post("/create", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), productMiddleware.validateProductCreation, productController.createProduct);
// just for product image upload
productRouter.post("/upload-image", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), productImageUploader.uploader("product-images").array("product-images", 20), productImageUploader.compressImages, productController.createProductImage);
productRouter.put("/", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), productMiddleware.validateProductEdit, productController.editProduct);
// just for product image edit
productRouter.put("/edit-image", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), productImageUploader.uploader("product-images").array("product-images", 20), productImageUploader.compressImages, productController.editProductImage);
productRouter.delete("/:productId", authMiddleware.authenticate(["admin"]), productMiddleware.validateProductDeletion, productController.deleteProduct);
productRouter.get("/active", authMiddleware.authenticate(["admin"]), productMiddleware.validateProductStatusChange, productController.activeProduct);
productRouter.get("/inactive", authMiddleware.authenticate(["admin"]), productMiddleware.validateProductStatusChange, productController.inactiveProduct);
exports.default = productRouter;
