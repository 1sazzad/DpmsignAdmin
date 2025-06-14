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
const product_variant_detail_model_1 = __importDefault(require("../model/product-variant-detail.model"));
const order_item_model_1 = __importDefault(require("./order-item.model"));
let ProductVariant = class ProductVariant extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "productVariantId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "productId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "additionalPrice", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_variant_detail_model_1.default, { as: "variantDetails" }),
    __metadata("design:type", Array)
], ProductVariant.prototype, "variantDetails", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_model_1.default),
    __metadata("design:type", product_model_1.default)
], ProductVariant.prototype, "product", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => order_item_model_1.default),
    __metadata("design:type", Array)
], ProductVariant.prototype, "orderItems", void 0);
ProductVariant = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "ProductVariants" })
], ProductVariant);
exports.default = ProductVariant;
