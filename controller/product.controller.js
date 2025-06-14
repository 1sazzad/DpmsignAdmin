"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = __importDefault(require("../service/product.service"));
const util_1 = require("../util");
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_config_1 = require("../config/dotenv.config");
class ProductController {
    productService;
    constructor() {
        this.productService = new product_service_1.default();
    }
    createProduct = async (req, res, next) => {
        try {
            const newProduct = {
                name: req.validatedValue.name,
                description: req.validatedValue.description,
                basePrice: req.validatedValue.basePrice,
                minOrderQuantity: req.validatedValue.minOrderQuantity,
                discountStart: req.validatedValue.discountStart,
                discountEnd: req.validatedValue.discountEnd,
                discountPercentage: req.validatedValue
                    .discountPercentage,
                pricingType: req.validatedValue.pricingType,
                categoryId: req.validatedValue.categoryId,
                isActive: req.validatedValue.isActive,
                attributes: req.validatedValue.attributes,
                tags: req.validatedValue.tags,
                variations: req.validatedValue.variations,
                variants: req.validatedValue.variants,
            };
            const createdProduct = await this.productService.createProduct(newProduct.name, newProduct.description, newProduct.basePrice, newProduct.minOrderQuantity, newProduct.discountStart, newProduct.discountEnd, newProduct.discountPercentage, newProduct.pricingType, newProduct.categoryId, newProduct.isActive, newProduct.attributes, newProduct.tags, newProduct.variations, newProduct.variants);
            if (!createdProduct) {
                return (0, util_1.responseSender)(res, 500, "Product creation failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 201, "Product created successfully.", {
                product: createdProduct,
            });
        }
        catch (err) {
            console.log("Error occured while creating product: ".red, err.message);
            next(err);
        }
    };
    createProductImage = async (req, res, next) => {
        try {
            const fileValidationError = req.fileValidationError;
            if (fileValidationError) {
                return (0, util_1.responseSender)(res, 400, fileValidationError);
            }
            const productId = req.body.productId;
            if (!productId) {
                if (req.files && Array.isArray(req.files)) {
                    req.files.forEach((file) => {
                        const filePath = path_1.default.join(file.destination, file.filename);
                        fs_1.default.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                            }
                        });
                    });
                }
                return (0, util_1.responseSender)(res, 400, "Product ID could not found. Please try again later.");
            }
            if (req.files.length > 0) {
                for (const image of req.files) {
                    await this.productService.createProductImage(image.filename, productId);
                }
            }
            return (0, util_1.responseSender)(res, 200, "Product image uploaded successfully.");
        }
        catch (err) {
            // cleanup process if database operation failed
            if (req.files && Array.isArray(req.files)) {
                req.files.forEach((file) => {
                    const filePath = path_1.default.join(file.destination, file.filename);
                    fs_1.default.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                        }
                    });
                });
            }
            console.log("Error occured while creating product image: ".red, err.message);
            next(err);
        }
    };
    editProduct = async (req, res, next) => {
        try {
            const productId = req.validatedValue.productId;
            const editedProduct = {
                name: req.validatedValue.name,
                description: req.validatedValue.description,
                basePrice: req.validatedValue.basePrice,
                minOrderQuantity: req.validatedValue.minOrderQuantity,
                discountStart: req.validatedValue.discountStart,
                discountEnd: req.validatedValue.discountEnd,
                discountPercentage: req.validatedValue
                    .discountPercentage,
                pricingType: req.validatedValue.pricingType,
                categoryId: req.validatedValue.categoryId,
                isActive: req.validatedValue.isActive,
                attributes: req.validatedValue.attributes,
                tags: req.validatedValue.tags,
                variations: req.validatedValue.variations,
                variants: req.validatedValue.variants,
            };
            const isProductExist = await this.productService.getProductById(productId);
            if (!isProductExist) {
                return (0, util_1.responseSender)(res, 404, "Product could not found. Please try again later.");
            }
            const updatedProduct = await this.productService.updateProduct(productId, editedProduct.name, editedProduct.description, editedProduct.basePrice, editedProduct.minOrderQuantity, editedProduct.discountStart, editedProduct.discountEnd, editedProduct.discountPercentage, editedProduct.pricingType, editedProduct.categoryId, editedProduct.isActive, editedProduct.attributes, editedProduct.tags, editedProduct.variations, editedProduct.variants);
            if (!updatedProduct) {
                return (0, util_1.responseSender)(res, 500, "Product update failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Product updated successfully.", {
                product: updatedProduct,
            });
        }
        catch (err) {
            console.log("Error occured while updating product: ".red, err.message);
            next(err);
        }
    };
    editProductImage = async (req, res, next) => {
        try {
            // Check for file validation error
            const fileValidationError = req.fileValidationError;
            if (fileValidationError) {
                return (0, util_1.responseSender)(res, 400, fileValidationError);
            }
            const productId = req.body.productId;
            if (!productId) {
                // Cleanup uploaded files if productId is missing
                if (req.files && Array.isArray(req.files)) {
                    req.files.forEach((file) => {
                        const filePath = path_1.default.join(file.destination, file.filename);
                        fs_1.default.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error("Error deleting uploaded file:", unlinkErr.message);
                            }
                        });
                    });
                }
                return (0, util_1.responseSender)(res, 400, "Product ID is required.");
            }
            // Fetch existing product images from the database
            const existingProductImages = await this.productService.getProductImagesByProductId(productId);
            // Case 1: If `req.files` is empty → Remove all previous images & cleanup storage
            if (!req.files || req.files.length === 0) {
                if (existingProductImages && existingProductImages.length > 0) {
                    for (const image of existingProductImages) {
                        // Delete image from the database
                        await this.productService.deleteProductImage(image.imageId);
                        // Cleanup storage
                        const publicDir = path_1.default.resolve(dotenv_config_1.staticDir);
                        const filePath = path_1.default.join(publicDir, "product-images", image.imageName);
                        fs_1.default.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error("Error deleting stored image:", unlinkErr.message);
                            }
                        });
                    }
                }
                return (0, util_1.responseSender)(res, 200, "All previous product images removed.");
            }
            // Case 2: New images are uploaded → Remove all previous images except new ones
            const uploadedFiles = req.files;
            // Save new images in the database
            for (const file of uploadedFiles) {
                await this.productService.createProductImage(file.filename, productId);
            }
            // Delete previous images that are not in the new upload list
            if (existingProductImages && existingProductImages.length > 0) {
                for (const image of existingProductImages) {
                    const isStillPresent = uploadedFiles.some((file) => file.filename === image.imageName);
                    if (!isStillPresent) {
                        // Delete from database
                        await this.productService.deleteProductImage(image.imageId);
                        // Cleanup storage
                        // Cleanup storage
                        const publicDir = path_1.default.resolve(dotenv_config_1.staticDir);
                        const filePath = path_1.default.join(publicDir, "product-images", image.imageName);
                        fs_1.default.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error("Error deleting stored image:", unlinkErr.message);
                            }
                        });
                    }
                }
            }
            return (0, util_1.responseSender)(res, 200, "Product images updated successfully.");
        }
        catch (err) {
            // Cleanup uploaded files in case of failure
            if (req.files && Array.isArray(req.files)) {
                req.files.forEach((file) => {
                    const filePath = path_1.default.join(file.destination, file.filename);
                    fs_1.default.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error("Error deleting uploaded file:", unlinkErr.message);
                        }
                    });
                });
            }
            console.log("Error updating product image: ".red, err.message);
            next(err);
        }
    };
    deleteProduct = async (req, res, next) => {
        try {
            const fetchedProduct = await this.productService.getProductById(Number(req.validatedValue.productId));
            if (!fetchedProduct) {
                return (0, util_1.responseSender)(res, 400, "Product couldn't found.");
            }
            // Fetch existing product images from the database
            const existingProductImages = await this.productService.getProductImagesByProductId(fetchedProduct.productId);
            const isDeleted = await this.productService.deleteProduct(fetchedProduct.productId);
            if (!isDeleted) {
                return (0, util_1.responseSender)(res, 500, "Couldn't delete product. Please try again.");
            }
            if (existingProductImages && existingProductImages.length > 0) {
                for (const image of existingProductImages) {
                    // Delete image from the database
                    await this.productService.deleteProductImage(image.imageId);
                    // Cleanup storage
                    const publicDir = path_1.default.resolve(dotenv_config_1.staticDir);
                    const filePath = path_1.default.join(publicDir, "product-images", image.imageName);
                    fs_1.default.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error("Error deleting stored image:", unlinkErr.message);
                        }
                    });
                }
            }
            return (0, util_1.responseSender)(res, 200, "Product deleted successfully.");
        }
        catch (err) {
            console.log("Error occured while creating product product: ".red, err.message);
            next(err);
        }
    };
    activeProduct = async (req, res, next) => {
        try {
            const product = await this.productService.activeProduct(req.validatedValue.productId);
            if (!product) {
                return (0, util_1.responseSender)(res, 400, "Failed to activate product. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Product activated successfully.");
        }
        catch (err) {
            console.log("Error occured while activating product: ".red, err.message);
            next(err);
        }
    };
    inactiveProduct = async (req, res, next) => {
        try {
            const product = await this.productService.inactiveProduct(req.validatedValue.productId);
            if (!product) {
                return (0, util_1.responseSender)(res, 400, "Failed to inactivate product. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Product inactivated successfully.");
        }
        catch (err) {
            console.log("Error occured while inactivating product: ".red, err.message);
            next(err);
        }
    };
    getProductById = async (req, res, next) => {
        try {
            const productId = Number(req.validatedValue.productId);
            const product = await this.productService.getProductById(productId);
            if (!product) {
                return (0, util_1.responseSender)(res, 404, "No product found associated with this id.");
            }
            return (0, util_1.responseSender)(res, 200, "Product fetched successfully.", {
                product,
            });
        }
        catch (err) {
            console.log("Error occured while creating product by product id: ".red, err.message);
            next(err);
        }
    };
    getAllProducts = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue.searchTerm;
            const searchBy = req.validatedValue.searchBy;
            const currentPage = parseInt(req.validatedValue.page || 1);
            const limitPerPage = parseInt(req.validatedValue.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const order = [["createdAt", "DESC"]];
            const filter = {};
            if (searchTerm) {
                filter.name = {
                    [sequelize_1.Op.like]: `%${searchTerm}%`,
                };
            }
            if (searchTerm && searchBy) {
                switch (searchBy) {
                    case "name":
                        filter.name = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    case "sku":
                        filter.sku = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    default:
                        break;
                }
            }
            const products = await this.productService.getAllProducts(filter, limitPerPage, offset, order);
            if (!products.rows) {
                return (0, util_1.responseSender)(res, 400, "Failed to get products. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Products fetched successfully.", {
                products: products.rows,
                total: products.count,
                totalPages: Math.ceil(products.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while creating product: ".red, err.message);
            next(err);
        }
    };
    getRandomProducts = async (req, res, next) => {
        try {
            const limit = req.validatedValue.limit;
            const excludeProductId = req.validatedValue
                .excludeProductId;
            const products = await this.productService.getRandomProducts(limit, excludeProductId);
            if (!products.length) {
                return (0, util_1.responseSender)(res, 400, "Failed to get random products. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Products fetched successfully.", {
                products,
            });
        }
        catch (err) {
            console.log("Error occured while getting random products: ".red, err.message);
            next(err);
        }
    };
}
exports.default = ProductController;
