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
const customer_model_1 = __importDefault(require("../model/customer.model"));
const staff_model_1 = __importDefault(require("../model/staff.model"));
const order_item_model_1 = __importDefault(require("../model/order-item.model"));
const payment_model_1 = __importDefault(require("./payment.model"));
const coupon_model_1 = __importDefault(require("../model/coupon.model"));
const courier_model_1 = __importDefault(require("../model/courier.model"));
const order_image_model_1 = __importDefault(require("./order-image.model"));
let Order = class Order extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Order.prototype, "orderId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => customer_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true, onDelete: "SET NULL" }),
    __metadata("design:type", Object)
], Order.prototype, "customerId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Order.prototype, "customerName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Order.prototype, "customerEmail", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Order.prototype, "customerPhone", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => staff_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Order.prototype, "staffId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => coupon_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Order.prototype, "couponId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Order.prototype, "billingAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Order.prototype, "additionalNotes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("online", "offline"),
        defaultValue: "online",
        allowNull: false,
    }),
    __metadata("design:type", String)
], Order.prototype, "method", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("shop-pickup", "courier"),
        defaultValue: "shop-pickup",
        allowNull: false,
    }),
    __metadata("design:type", String)
], Order.prototype, "deliveryMethod", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("order-request-received", "consultation-in-progress", "order-canceled", "awaiting-advance-payment", "advance-payment-received", "design-in-progress", "awaiting-design-approval", "production-started", "production-in-progress", "ready-for-delivery", "out-for-delivery", "order-completed"),
        defaultValue: "order-request-received",
        allowNull: false,
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Order.prototype, "currentStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("online-payment", "cod-payment"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("pending", "partial", "paid"),
        defaultValue: "pending",
        allowNull: false,
    }),
    __metadata("design:type", String)
], Order.prototype, "paymentStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => courier_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Order.prototype, "courierId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], Order.prototype, "courierAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Order.prototype, "orderTotalPrice", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Object)
], Order.prototype, "deliveryDate", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => order_item_model_1.default, { as: "orderItems" }),
    __metadata("design:type", Array)
], Order.prototype, "orderItems", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => payment_model_1.default, { as: "payments" }),
    __metadata("design:type", Array)
], Order.prototype, "payments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => order_image_model_1.default, { as: "images" }),
    __metadata("design:type", Array)
], Order.prototype, "images", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => customer_model_1.default, { onDelete: "SET NULL" }),
    __metadata("design:type", customer_model_1.default)
], Order.prototype, "customer", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => staff_model_1.default),
    __metadata("design:type", staff_model_1.default)
], Order.prototype, "staff", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => coupon_model_1.default),
    __metadata("design:type", coupon_model_1.default)
], Order.prototype, "coupon", void 0);
Order = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "Orders", timestamps: true })
], Order);
exports.default = Order;
