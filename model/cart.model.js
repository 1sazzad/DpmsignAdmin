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
const customer_model_1 = __importDefault(require("./customer.model"));
const product_model_1 = __importDefault(require("./product.model"));
const product_variant_model_1 = __importDefault(require("./product-variant.model"));
let CartItem = class CartItem extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], CartItem.prototype, "cartItemId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => customer_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], CartItem.prototype, "customerId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], CartItem.prototype, "productId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_variant_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], CartItem.prototype, "productVariantId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], CartItem.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true }),
    __metadata("design:type", Number)
], CartItem.prototype, "size", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true }),
    __metadata("design:type", Number)
], CartItem.prototype, "widthInch", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: true }),
    __metadata("design:type", Number)
], CartItem.prototype, "heightInch", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false }),
    __metadata("design:type", Number)
], CartItem.prototype, "price", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => customer_model_1.default),
    __metadata("design:type", customer_model_1.default)
], CartItem.prototype, "customer", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_model_1.default),
    __metadata("design:type", product_model_1.default)
], CartItem.prototype, "product", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_variant_model_1.default),
    __metadata("design:type", product_variant_model_1.default)
], CartItem.prototype, "productVariant", void 0);
CartItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "CartItems", timestamps: true })
], CartItem);
exports.default = CartItem;
