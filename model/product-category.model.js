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
const product_model_1 = __importDefault(require("../model/product.model"));
let ProductCategory = class ProductCategory extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], ProductCategory.prototype, "categoryId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], ProductCategory.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, unique: true }),
    __metadata("design:type", String)
], ProductCategory.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => ProductCategory),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Object)
], ProductCategory.prototype, "parentCategoryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => ProductCategory, { as: "parentCategory" }),
    __metadata("design:type", ProductCategory)
], ProductCategory.prototype, "parentCategory", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ProductCategory, {
        as: "subCategories",
        foreignKey: "parentCategoryId",
    }),
    __metadata("design:type", Array)
], ProductCategory.prototype, "subCategories", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_model_1.default),
    __metadata("design:type", Array)
], ProductCategory.prototype, "products", void 0);
ProductCategory = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "ProductCategories", timestamps: true })
], ProductCategory);
exports.default = ProductCategory;
