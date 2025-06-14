"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const product_category_model_1 = __importDefault(require("../model/product-category.model"));
const product_attribute_model_1 = __importDefault(require("../model/product-attribute.model"));
const product_image_model_1 = __importDefault(require("../model/product-image.model"));
const product_review_model_1 = __importDefault(require("../model/product-review.model"));
const product_tags_model_1 = __importDefault(require("../model/product-tags.model"));
const variation_model_1 = __importDefault(require("../model/variation.model"));
const product_variant_model_1 = __importDefault(require("../model/product-variant.model"));
const order_item_model_1 = __importDefault(require("./order-item.model"));
let Product = class Product extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Product.prototype, "productId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false }),
    __metadata("design:type", Number)
], Product.prototype, "basePrice", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Product.prototype, "minOrderQuantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Product.prototype, "discountStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Product.prototype, "discountEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true }),
    __metadata("design:type", Number)
], Product.prototype, "discountPercentage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM("flat", "square-feet"), allowNull: false }),
    __metadata("design:type", Number)
], Product.prototype, "pricingType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_category_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Object)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_category_model_1.default),
    __metadata("design:type", product_category_model_1.default)
], Product.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_attribute_model_1.default, { as: "attributes" }),
    __metadata("design:type", Array)
], Product.prototype, "attributes", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => variation_model_1.default, { as: "variations" }),
    __metadata("design:type", Array)
], Product.prototype, "variations", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_variant_model_1.default, { as: "variants" }),
    __metadata("design:type", Array)
], Product.prototype, "variants", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_image_model_1.default, { as: "images" }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_tags_model_1.default, { as: "tags" }),
    __metadata("design:type", Array)
], Product.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_review_model_1.default, { as: "reviews" }),
    __metadata("design:type", Array)
], Product.prototype, "reviews", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => order_item_model_1.default),
    __metadata("design:type", Array)
], Product.prototype, "orderItems", void 0);
Product = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "Products", timestamps: true })
], Product);
exports.default = Product;
