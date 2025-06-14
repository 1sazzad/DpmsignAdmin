"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_category_model_1 = __importDefault(require("../model/product-category.model"));
const product_model_1 = __importDefault(require("../model/product.model"));
const util_1 = require("../util");
class ProductCategoryService {
    // Create a new category
    createCategory = async (name, parentCategoryId) => {
        try {
            const category = await product_category_model_1.default.create({
                name,
                slug: (0, util_1.createSlug)(name),
                parentCategoryId,
            });
            return category ? category.toJSON() : null;
        }
        catch (err) {
            console.log("Error creating category: ".red, err.message);
            throw err;
        }
    };
    // Get category by slug
    getCategoryBySlug = async (slug) => {
        try {
            const category = await product_category_model_1.default.findOne({
                where: { slug },
            });
            return category ? category.toJSON() : null;
        }
        catch (err) {
            console.log("Error fetching category: ".red, err.message);
            throw err;
        }
    };
    // Get category by ID
    getCategoryById = async (categoryId) => {
        try {
            const category = await product_category_model_1.default.findByPk(categoryId, {
                include: [
                    { model: product_category_model_1.default, as: "parentCategory" },
                    { model: product_category_model_1.default, as: "subCategories" },
                    { model: product_model_1.default, as: "products", separate: true },
                ],
            });
            return category ? category.toJSON() : null;
        }
        catch (err) {
            console.log("Error fetching category: ".red, err.message);
            throw err;
        }
    };
    // Update category
    updateCategory = async (categoryId, name, parentCategoryId) => {
        try {
            const [updatedRows] = await product_category_model_1.default.update({ name, slug: (0, util_1.createSlug)(name), parentCategoryId }, {
                where: { categoryId },
            });
            return updatedRows > 0;
        }
        catch (err) {
            console.log("Error updating category: ".red, err.message);
            throw err;
        }
    };
    // Delete category
    deleteCategory = async (categoryId) => {
        try {
            const category = await product_category_model_1.default.findByPk(categoryId);
            if (category) {
                await category.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error deleting category: ".red, err.message);
            throw err;
        }
    };
    // Get all categories with optional filtering
    getAllCategories = async (filter = {}, limit, offset, order) => {
        try {
            const categories = await product_category_model_1.default.findAndCountAll({
                where: filter,
                limit,
                offset,
                order,
                distinct: true,
                include: [
                    { model: product_category_model_1.default, as: "parentCategory" },
                    { model: product_category_model_1.default, as: "subCategories" },
                    { model: product_model_1.default, as: "products", separate: true },
                ],
            });
            return {
                rows: categories.rows.map((category) => category.toJSON()),
                count: categories.count,
            };
        }
        catch (err) {
            console.log("Error fetching categories: ".red, err.message);
            throw err;
        }
    };
}
exports.default = ProductCategoryService;
