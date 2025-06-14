"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_category_service_1 = __importDefault(require("../service/product-category.service"));
const util_1 = require("../util");
const sequelize_1 = require("sequelize");
class ProductCategoryController {
    productCategoryService;
    constructor() {
        this.productCategoryService = new product_category_service_1.default();
    }
    createCategory = async (req, res, next) => {
        try {
            const newCategory = {
                name: req.validatedValue.name,
                parentCategoryId: req.validatedValue.parentCategoryId || null,
            };
            const isCategoryExist = await this.productCategoryService.getCategoryBySlug((0, util_1.createSlug)(newCategory.name));
            if (isCategoryExist) {
                return (0, util_1.responseSender)(res, 400, "Category already exist. Category name must be unique.");
            }
            const createdCategory = await this.productCategoryService.createCategory(newCategory.name, newCategory.parentCategoryId);
            if (!createdCategory) {
                return (0, util_1.responseSender)(res, 500, "Product category creation failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 201, "Product category created successfully.", {
                category: createdCategory,
            });
        }
        catch (err) {
            console.log("Error occured while creating product category: ".red, err.message);
            next(err);
        }
    };
    editCategory = async (req, res, next) => {
        try {
            const editedCategory = {
                categoryId: req.validatedValue.categoryId,
                name: req.validatedValue.name,
                parentCategoryId: req.validatedValue.parentCategoryId || null,
            };
            const updatedCategory = await this.productCategoryService.updateCategory(editedCategory.categoryId, editedCategory.name, editedCategory.parentCategoryId);
            if (!updatedCategory) {
                return (0, util_1.responseSender)(res, 500, "Product category update failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Product category updated successfully.");
        }
        catch (err) {
            console.log("Error occured while updating product category: ".red, err.message);
            next(err);
        }
    };
    deleteCategory = async (req, res, next) => {
        try {
            const fetchedCategory = await this.productCategoryService.getCategoryById(Number(req.validatedValue.categoryId));
            if (!fetchedCategory) {
                return (0, util_1.responseSender)(res, 400, "Category couldn't found.");
            }
            const isDeleted = await this.productCategoryService.deleteCategory(fetchedCategory.categoryId);
            if (!isDeleted) {
                return (0, util_1.responseSender)(res, 500, "Couldn't delete category. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Category deleted successfully.");
        }
        catch (err) {
            console.log("Error occured while creating product category: ".red, err.message);
            next(err);
        }
    };
    getCategoryById = async (req, res, next) => {
        try {
            const categoryId = Number(req.validatedValue.categoryId);
            const category = await this.productCategoryService.getCategoryById(categoryId);
            if (!category) {
                return (0, util_1.responseSender)(res, 404, "No category found associated with this id.");
            }
            return (0, util_1.responseSender)(res, 200, "Categories fetched successfully.", {
                category,
            });
        }
        catch (err) {
            console.log("Error occured while fetching product category by id: ".red, err.message);
            next(err);
        }
    };
    getAllCategories = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue.searchTerm;
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
            const categories = await this.productCategoryService.getAllCategories(filter, limitPerPage, offset, order);
            if (!categories.rows) {
                return (0, util_1.responseSender)(res, 400, "Failed to get categories. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Categories fetched successfully.", {
                categories: categories.rows,
                total: categories.count,
                totalPages: Math.ceil(categories.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while fetching product category: ".red, err.message);
            next(err);
        }
    };
}
exports.default = ProductCategoryController;
