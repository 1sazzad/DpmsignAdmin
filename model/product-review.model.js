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
const customer_model_1 = __importDefault(require("../model/customer.model"));
let ProductReview = class ProductReview extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], ProductReview.prototype, "reviewId", void 0);
__decorate([
    (0, sequelize_typescript_1.Min)(1),
    (0, sequelize_typescript_1.Max)(5),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductReview.prototype, "rating", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], ProductReview.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)("unpublished"),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("published", "unpublished"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ProductReview.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductReview.prototype, "productId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => customer_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductReview.prototype, "customerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_model_1.default, { as: "product" }),
    __metadata("design:type", product_model_1.default)
], ProductReview.prototype, "product", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => customer_model_1.default, { as: "customer" }),
    __metadata("design:type", customer_model_1.default)
], ProductReview.prototype, "customer", void 0);
ProductReview = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "ProductReviews", timestamps: true })
], ProductReview);
exports.default = ProductReview;
