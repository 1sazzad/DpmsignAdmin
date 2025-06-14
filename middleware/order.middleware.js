"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../util");
class OrderMiddleware {
    schema;
    orderItemsSchema;
    paymentsSchema;
    constructor() {
        this.orderItemsSchema = joi_1.default.object({
            productId: joi_1.default.number().required().messages({
                "number.base": "productId must be a number.",
                "number.empty": "productId cannot be empty.",
                "any.required": "productId is required.",
            }),
            quantity: joi_1.default.number().required().messages({
                "number.base": "quantity must be a number.",
                "number.empty": "quantity cannot be empty.",
                "any.required": "quantity is required.",
            }),
            size: joi_1.default.number().required().allow(null).messages({
                "number.base": "size must be a number.",
                "number.empty": "size cannot be empty.",
                "any.required": "size is required.",
            }),
            widthInch: joi_1.default.number().required().allow(null).messages({
                "number.base": "widthInch must be a number.",
                "number.empty": "widthInch cannot be empty.",
                "any.required": "widthInch is required.",
            }),
            price: joi_1.default.number().required().messages({
                "number.base": "price must be a number.",
                "number.empty": "price cannot be empty.",
                "any.required": "price is required.",
            }),
            productVariantId: joi_1.default.number().required().messages({
                "number.base": "productVariantId must be a number.",
                "number.empty": "productVariantId cannot be empty.",
                "any.required": "productVariantId is required.",
            }),
        });
        this.paymentsSchema = joi_1.default.object({
            orderId: joi_1.default.number().required().messages({
                "number.base": "orderId must be a number.",
                "number.empty": "orderId cannot be empty.",
                "any.required": "orderId is required.",
            }),
            amount: joi_1.default.number().required().messages({
                "number.base": "amount must be a number.",
                "number.empty": "amount cannot be empty.",
                "any.required": "amount is required.",
            }),
            paymentMethod: joi_1.default.string()
                .valid("cod-payment", "online-payment")
                .required()
                .messages({
                "string.base": "paymentMethod must be a string.",
                "string.empty": "paymentMethod cannot be empty.",
                "any.required": "paymentMethod is required. It should be either cod-payment or online-payment.",
            }),
            customerName: joi_1.default.string().trim().min(2).required().messages({
                "string.base": "Customer name must be a string.",
                "string.empty": "Customer name cannot be empty.",
                "string.min": "Customer name must be at least 2 characters long.",
                "any.required": "Customer name is required.",
            }),
            customerEmail: joi_1.default.string()
                .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .message("Invalid email address.")
                .required()
                .messages({
                "string.base": "Customer email must be a string.",
                "string.email": "Invalid email address.",
                "string.empty": "Customer email cannot be empty.",
                "any.required": "Customer email is required.",
            }),
            customerPhone: joi_1.default.string()
                .trim()
                .required()
                .pattern(/^01[3-9][0-9]{8}$/)
                .messages({
                "string.pattern.base": "Customer phone number must be a valid Bangladeshi number starting with 01 and 11 digits long.",
                "string.empty": "Customer phone number cannot be empty.",
            }),
        });
        this.schema = {
            customerId: joi_1.default.number().required().allow(null).messages({
                "number.base": "customerId must be a number.",
                "number.empty": "customerId cannot be empty.",
                "any.required": "customerId is required.",
            }),
            customerName: joi_1.default.string().trim().min(2).required().messages({
                "string.base": "Customer name must be a string.",
                "string.empty": "Customer name cannot be empty.",
                "string.min": "Customer name must be at least 2 characters long.",
                "any.required": "Customer name is required.",
            }),
            customerEmail: joi_1.default.string()
                .trim()
                .email()
                .required()
                .allow("")
                .messages({
                "string.base": "Customer email must be a string.",
                "string.email": "Invalid email address.",
                "string.empty": "Customer email cannot be empty.",
                "any.required": "Customer email is required.",
            }),
            customerPhone: joi_1.default.string()
                .trim()
                .required()
                .pattern(/^01[3-9][0-9]{8}$/)
                .messages({
                "string.pattern.base": "Customer phone number must be a valid Bangladeshi number starting with 01 and 11 digits long.",
            }),
            staffId: joi_1.default.number().optional().allow(null).messages({
                "number.base": "staffId must be a number.",
                "number.empty": "staffId cannot be empty.",
            }),
            method: joi_1.default.string()
                .valid("online", "offline")
                .required()
                .messages({
                "string.base": "method must be a string.",
                "string.empty": "method cannot be empty.",
                "string.valid": "method should be either 'online' or 'offline'",
                "any.required": "method is required.",
            }),
            status: joi_1.default.string()
                .valid("order-request-received", "consultation-in-progress", "order-canceled", "awaiting-advance-payment", "advance-payment-received", "design-in-progress", "awaiting-design-approval", "production-started", "production-in-progress", "ready-for-delivery", "out-for-delivery", "order-completed")
                .required()
                .messages({
                "string.base": "status must be a string.",
                "string.empty": "status cannot be empty.",
                "string.valid": "status should be one of 'order-request-received', 'consultation-in-progress', 'order-canceled', 'awaiting-advance-payment', 'advance-payment-received', 'design-in-progress', 'awaiting-design-approval', 'production-started', 'production-in-progress', 'ready-for-delivery', 'out-for-delivery', 'order-completed'",
                "any.required": "status is required.",
            }),
            currentStatus: joi_1.default.string().required().allow("").messages({
                "string.base": "currentStatus must be a string.",
                "string.empty": "currentStatus cannot be empty.",
                "any.required": "currentStatus is required.",
            }),
            billingAddress: joi_1.default.string().required().messages({
                "string.base": "billingAddress must be a string.",
                "string.empty": "billingAddress cannot be empty.",
                "any.required": "billingAddress is required.",
            }),
            additionalNotes: joi_1.default.string().optional().allow("").messages({
                "string.base": "additionalNotes must be a string.",
            }),
            deliveryDate: joi_1.default.date().iso().required().allow(null).messages({
                "date.base": "deliveryDate must be a valid date.",
                "date.format": "deliveryDate must be in ISO 8601 format (YYYY-MM-DD).",
                "any.required": "deliveryDate is required.",
            }),
            deliveryMethod: joi_1.default.string()
                .trim()
                .required()
                .valid("shop-pickup", "courier")
                .messages({
                "string.base": "deliveryMethod must be a string.",
                "string.empty": "deliveryMethod is required.",
                "string.valid": "invalid deliveryMethod. deliveryMethod must be 'shop-pickup' or 'courier'.",
                "any.required": "deliveryMethod is required.",
            }),
            paymentMethod: joi_1.default.string()
                .valid("cod-payment", "online-payment")
                .required()
                .messages({
                "string.base": "paymentMethod must be a string.",
                "string.empty": "paymentMethod cannot be empty.",
                "any.required": "paymentMethod is required. It should be either cod-payment or online-payment.",
            }),
            paymentStatus: joi_1.default.string()
                .trim()
                .required()
                .valid("pending", "partial", "paid")
                .messages({
                "string.base": "paymentStatus must be a string.",
                "string.empty": "paymentStatus is required.",
                "string.valid": "invalid paymentStatus. paymentStatus must be 'pending', 'partial' or 'paid'.",
                "any.required": "paymentStatus is required.",
            }),
            couponId: joi_1.default.number().optional().messages({
                "number.base": "couponId must be a number.",
                "number.empty": "couponId cannot be empty.",
            }),
            courierId: joi_1.default.number().optional().messages({
                "number.base": "courierId must be a number.",
                "number.empty": "courierId cannot be empty.",
            }),
            courierAddress: joi_1.default.string().trim().optional().messages({
                "string.base": "courierAddress must be a string.",
                "string.empty": "courierAddress cannot be empty.",
            }),
            orderItems: joi_1.default.any(),
            payments: joi_1.default.array()
                .items(this.paymentsSchema)
                .required()
                .min(1)
                .messages({
                "array.min": "At least one payment is required.",
            }),
        };
    }
    validateOrderCreation = (req, res, next) => {
        try {
            const orderSchema = joi_1.default.object(this.schema);
            const validationResult = orderSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating order creation: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating order creation: ".red, err.message);
            next(err);
        }
    };
    validateOrderRequestCreation = (req, res, next) => {
        try {
            const orderSchema = joi_1.default.object({
                customerId: this.schema.customerId,
                customerName: this.schema.customerName,
                customerPhone: this.schema.customerPhone,
                staffId: this.schema.staffId,
                billingAddress: this.schema.billingAddress,
                additionalNotes: this.schema.additionalNotes,
                deliveryMethod: this.schema.deliveryMethod,
                paymentMethod: this.schema.paymentMethod,
                couponId: this.schema.couponId,
                courierId: this.schema.courierId,
                courierAddress: this.schema.courierAddress,
                orderItems: this.schema.orderItems,
                // payments: this.paymentsSchema,
            });
            const validationResult = orderSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating order request creation: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating order request creation: ".red, err.message);
            next(err);
        }
    };
    validateOrderPaymentCreation = (req, res, next) => {
        try {
            const orderSchema = joi_1.default.object({
                orderId: joi_1.default.number().required().messages({
                    "number.base": "orderId must be a number.",
                    "number.empty": "orderId cannot be empty.",
                    "any.required": "orderId is required.",
                }),
                amount: joi_1.default.number().required().messages({
                    "number.base": "amount must be a number.",
                    "number.empty": "amount cannot be empty.",
                    "any.required": "amount is required.",
                }),
                paymentMethod: joi_1.default.string()
                    .valid("cod-payment", "online-payment")
                    .required()
                    .messages({
                    "string.base": "paymentMethod must be a string.",
                    "string.empty": "paymentMethod cannot be empty.",
                    "any.required": "paymentMethod is required. It should be either cod-payment or online-payment.",
                }),
                customerName: joi_1.default.string().trim().min(2).required().messages({
                    "string.base": "Customer name must be a string.",
                    "string.empty": "Customer name cannot be empty.",
                    "string.min": "Customer name must be at least 2 characters long.",
                    "any.required": "Customer name is required.",
                }),
                customerEmail: joi_1.default.string()
                    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                    .message("Invalid email address.")
                    .required()
                    .messages({
                    "string.base": "Customer email must be a string.",
                    "string.email": "Invalid email address.",
                    "string.empty": "Customer email cannot be empty.",
                    "any.required": "Customer email is required.",
                }),
                customerPhone: joi_1.default.string()
                    .trim()
                    .required()
                    .pattern(/^01[3-9][0-9]{8}$/)
                    .messages({
                    "string.pattern.base": "Customer phone number must be a valid Bangladeshi number starting with 01 and 11 digits long.",
                    "string.empty": "Customer phone number cannot be empty.",
                }),
            });
            const validationResult = orderSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating order payment creation: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating order payment creation: ".red, err.message);
            next(err);
        }
    };
    validateOrderUpdate = (req, res, next) => {
        try {
            const orderSchema = joi_1.default.object({
                orderId: joi_1.default.number().required().messages({
                    "number.base": "orderId must be a number.",
                    "number.empty": "orderId cannot be empty.",
                    "any.required": "orderId is required.",
                }),
                status: this.schema.status,
                deliveryDate: this.schema.deliveryDate,
                courierAddress: this.schema.courierAddress.allow(null),
                additionalNotes: this.schema.additionalNotes,
            });
            const validationResult = orderSchema.validate(req.body);
            if (validationResult.error) {
                console.log("Error occures while validating order update: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating order update: ".red, err.message);
            next(err);
        }
    };
    validateOrderByCustomer = (req, res, next) => {
        try {
            const orderSchema = joi_1.default.object({
                customerId: this.schema.customerId,
            });
            const validationResult = orderSchema.validate(req.params);
            if (validationResult.error) {
                console.log("Error occures while validating order fetch by customer id: "
                    .red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating order fetch by customer id: "
                .red, err.message);
            next(err);
        }
    };
    validateFilteringQueries = (req, res, next) => {
        try {
            const orderSchema = joi_1.default.object({
                searchTerm: joi_1.default.string().trim().optional().messages({
                    "string.base": "searchTerm must be a string.",
                    "string.empty": "searchTerm cannot be empty.",
                }),
                searchBy: joi_1.default.string()
                    .trim()
                    .optional()
                    .valid("order-id", "customer-name", "customer-phone", "customer-email")
                    .messages({
                    "string.base": "searchBy must be a string.",
                    "string.empty": "searchBy cannot be empty.",
                    "any.valid": "searchBy should be 'order-id', 'customer-name', 'customer-phone' or 'customer-email'.",
                }),
                filteredBy: joi_1.default.string()
                    .trim()
                    .optional()
                    .valid("all", "active", "requested", "completed", "cancelled")
                    .default("all")
                    .messages({
                    "string.base": "filteredBy must be a string.",
                    "string.empty": "filteredBy cannot be empty.",
                    "any.valid": "filteredBy should be 'all', 'active', 'requested', 'completed' or 'cancelled'.",
                }),
                page: joi_1.default.number().optional().default(1).messages({
                    "number.base": "page must be a integer.",
                }),
                limit: joi_1.default.number().optional().default(20).messages({
                    "number.base": "limit must be a integer.",
                }),
            });
            const validationResult = orderSchema.validate(req.query);
            if (validationResult.error) {
                console.log("Error occures while validating filtering queries: ".red, validationResult.error.message);
                return (0, util_1.responseSender)(res, 400, validationResult.error.message);
            }
            // everything is fine
            req.validatedValue = validationResult.value;
            next();
        }
        catch (err) {
            console.log("Error occures while validating filtering queries: ".red, err.message);
            next(err);
        }
    };
}
exports.default = OrderMiddleware;
