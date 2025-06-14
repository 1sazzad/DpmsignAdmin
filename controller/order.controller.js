"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const sequelize_1 = require("sequelize");
const order_service_1 = __importDefault(require("../service/order.service"));
const cart_service_1 = __importDefault(require("../service/cart.service"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const server_1 = require("../server");
const payment_service_1 = __importDefault(require("../service/payment.service"));
const transaction_service_1 = __importDefault(require("../service/transaction.service"));
const dotenv_config_1 = require("../config/dotenv.config");
class OrderController {
    orderService;
    paymentService;
    transactionService;
    cartService;
    constructor() {
        this.orderService = new order_service_1.default();
        this.paymentService = new payment_service_1.default();
        this.transactionService = new transaction_service_1.default();
        this.cartService = new cart_service_1.default();
    }
    createOrder = async (req, res, next) => {
        try {
            if (req.fileValidationError) {
                return (0, util_1.responseSender)(res, 400, req.fileValidationError);
            }
            console.log(req.validatedValue);
            console.log(req.files);
            const newOrder = {
                customerId: req.validatedValue.customerId,
                customerName: req.validatedValue.customerName,
                customerEmail: req.validatedValue.customerEmail,
                customerPhone: req.validatedValue.customerPhone,
                staffId: req.validatedValue.staffId,
                billingAddress: req.validatedValue.billingAddress,
                additionalNotes: req.validatedValue.additionalNotes,
                method: req.validatedValue.method,
                status: req.validatedValue.status,
                currentStatus: req.validatedValue.currentStatus,
                deliveryMethod: req.validatedValue.deliveryMethod,
                deliveryDate: req.validatedValue.deliveryDate,
                paymentMethod: req.validatedValue.paymentMethod,
                paymentStatus: req.validatedValue.paymentStatus,
                orderItems: req.validatedValue.orderItems,
                payments: req.validatedValue.payments,
            };
            if (req.validatedValue.courierId &&
                !req.validatedValue.courierAddress) {
                return (0, util_1.responseSender)(res, 400, "Courier address is required");
            }
            else if (!req.validatedValue.courierId &&
                req.validatedValue.courierAddress) {
                return (0, util_1.responseSender)(res, 400, "Courier id is required");
            }
            if (req.validatedValue.couponId) {
                newOrder.couponId = req.validatedValue.couponId;
            }
            if (req.validatedValue.courierId &&
                req.validatedValue.courierAddress) {
                newOrder.courierId = req.validatedValue.courierId;
                newOrder.courierAddress = req.validatedValue.courierAddress;
            }
            // const createdOrder = await this.orderService.createOrder(
            // 	newOrder.customerId,
            // 	newOrder.customerName,
            // 	newOrder.customerEmail,
            // 	newOrder.customerPhone,
            // 	newOrder.staffId,
            // 	newOrder.billingAddress,
            // 	newOrder.additionalNotes,
            // 	newOrder.method,
            // 	newOrder.status,
            // 	newOrder.currentStatus,
            // 	newOrder.deliveryMethod,
            // 	newOrder.deliveryDate,
            // 	newOrder.paymentStatus,
            // 	(newOrder as any)?.couponId || null,
            // 	(newOrder as any)?.courierId || null,
            // 	(newOrder as any)?.courierAddress || null,
            // 	newOrder.orderItems,
            // 	newOrder.payments,
            // );
            // if (!createdOrder) {
            // 	return responseSender(
            // 		res,
            // 		500,
            // 		"Order creation failed. Please try again.",
            // 	);
            // }
            // return responseSender(res, 201, "Order created successfully.", {
            // 	order: createdOrder,
            // });
        }
        catch (err) {
            console.log(err);
            console.log("Error occured while creating order: ".red, err.message);
            next(err);
        }
    };
    createOrderRequest = async (req, res, next) => {
        try {
            if (req.fileValidationError) {
                return (0, util_1.responseSender)(res, 400, req.fileValidationError);
            }
            const newOrder = {
                customerId: req.validatedValue.customerId,
                customerName: req.validatedValue.customerName,
                customerPhone: req.validatedValue.customerPhone,
                staffId: req.validatedValue.staffId,
                billingAddress: req.validatedValue.billingAddress,
                additionalNotes: req.validatedValue.additionalNotes,
                deliveryMethod: req.validatedValue.deliveryMethod,
                paymentMethod: req.validatedValue.paymentMethod,
                orderItems: JSON.parse(req.validatedValue.orderItems),
            };
            if (req.files && req.files.length > 0) {
                newOrder.images = req.files;
            }
            if (req.validatedValue.courierId &&
                !req.validatedValue.courierAddress) {
                return (0, util_1.responseSender)(res, 400, "Courier address is required");
            }
            else if (!req.validatedValue.courierId &&
                req.validatedValue.courierAddress) {
                return (0, util_1.responseSender)(res, 400, "Courier id is required");
            }
            if (req.validatedValue.couponId) {
                newOrder.couponId = req.validatedValue.couponId;
            }
            if (req.validatedValue.courierId &&
                req.validatedValue.courierAddress) {
                newOrder.courierId = req.validatedValue.courierId;
                newOrder.courierAddress = req.validatedValue.courierAddress;
            }
            const createdOrder = await this.orderService.createOrderRequest(newOrder.customerId, newOrder.customerName, newOrder.customerPhone, newOrder.staffId, newOrder.billingAddress, newOrder.additionalNotes, newOrder.deliveryMethod, newOrder.paymentMethod, newOrder?.couponId || null, newOrder?.courierId || null, newOrder?.courierAddress || null, newOrder.orderItems);
            if (!createdOrder) {
                return (0, util_1.responseSender)(res, 500, "Order request creation failed. Please try again.");
            }
            if (newOrder.images?.length > 0) {
                for (const image of newOrder.images) {
                    await this.orderService.addOrderImage(image.filename, createdOrder.orderId);
                }
            }
            await this.cartService.clearCartItems(newOrder.customerId);
            // emit the create order request event
            server_1.io.emit("create-order-request", { order: createdOrder });
            return (0, util_1.responseSender)(res, 201, "Order request created successfully.", {
                order: createdOrder,
            });
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
            console.log("Error occured while creating order request: ".red, err.message);
            next(err);
        }
    };
    updateOrder = async (req, res, next) => {
        try {
            const newOrder = {
                orderId: req.validatedValue.orderId,
                deliveryDate: req.validatedValue.deliveryDate,
                status: req.validatedValue.status,
                courierAddress: req.validatedValue.courierAddress,
                additionalNotes: req.validatedValue.additionalNotes,
            };
            const updatedOrder = await this.orderService.updateOrder(newOrder.orderId, newOrder.deliveryDate, newOrder.status, newOrder.courierAddress, newOrder.additionalNotes);
            if (!updatedOrder) {
                return (0, util_1.responseSender)(res, 500, "Order update failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Order updated successfully.");
        }
        catch (err) {
            console.log("Error occured while updating order: ".red, err.message);
            next(err);
        }
    };
    createOrderPayment = async (req, res, next) => {
        try {
            const newPayment = {
                orderId: req.validatedValue.orderId,
                amount: req.validatedValue.amount,
                paymentMethod: req.validatedValue.paymentMethod,
                customerName: req.validatedValue.customerName,
                customerEmail: req.validatedValue.customerEmail,
                customerPhone: req.validatedValue.customerPhone,
            };
            if (newPayment.paymentMethod === "cod-payment") {
                const createdPayment = await this.paymentService.createCashPayment(newPayment.orderId, newPayment.amount);
                if (!createdPayment) {
                    return (0, util_1.responseSender)(res, 500, "Order payment request creation failed. Please try again.");
                }
                // update the order status
                const order = await this.orderService.getOrderById(newPayment.orderId);
                if (!order) {
                    return (0, util_1.responseSender)(res, 500, "Order not found. Please try again.");
                }
                const totalPaidAmount = order.payments.reduce((acc, curr) => {
                    if (curr.isPaid)
                        return acc + curr.amount;
                    return acc;
                }, 0);
                const isOrderStatusUpdated = await this.orderService.updateOrderPaymentStatus(newPayment.orderId, totalPaidAmount === order.orderTotalPrice
                    ? "paid"
                    : "partial");
                if (!isOrderStatusUpdated) {
                    return (0, util_1.responseSender)(res, 500, "Order status update failed. Please try again.");
                }
                return (0, util_1.responseSender)(res, 201, "Order payment request created successfully.", {
                    ...createdPayment,
                });
            }
            const createdPayment = await this.paymentService.createOnlinePayment(newPayment.orderId, newPayment.amount, newPayment.customerName, newPayment.customerEmail, newPayment.customerPhone);
            if (!createdPayment) {
                return (0, util_1.responseSender)(res, 500, "Order payment request creation failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 201, "Order payment request created successfully.", {
                ...createdPayment,
            });
        }
        catch (err) {
            console.log("Error occured while creating order payment: ".red, err.message);
            next(err);
        }
    };
    paymentSuccess = async (req, res, next) => {
        try {
            const transactionId = req.body.tran_id;
            const payment = await this.paymentService.getPaymentByTransactionId(transactionId);
            if (!payment) {
                return (0, util_1.responseSender)(res, 500, "Payment not found. Please try again.");
            }
            const orderId = payment.orderId;
            const valId = req.body.val_id;
            const amount = req.body.amount;
            const storeAmount = req.body.store_amount;
            const cardType = req.body.card_type;
            const bankTransactionId = req.body.bank_tran_id;
            const status = req.body.status;
            const transactionDate = req.body.tran_date;
            const currency = req.body.currency;
            const cardIssuer = req.body.card_issuer;
            const cardBrand = req.body.card_brand;
            // create a transaction
            const transaction = await this.transactionService.createTransaction(transactionId, orderId, valId, amount, storeAmount, cardType, bankTransactionId, status, transactionDate, currency, cardIssuer, cardBrand);
            // update the order payment status
            const isPaymentStatusUpdated = await this.paymentService.updatePaymentStatus(transactionId, true);
            if (!isPaymentStatusUpdated) {
                return (0, util_1.responseSender)(res, 500, "Payment status update failed. Please try again.");
            }
            // update the order status
            const order = await this.orderService.getOrderById(orderId);
            if (!order) {
                return (0, util_1.responseSender)(res, 500, "Order not found. Please try again.");
            }
            const totalPaidAmount = order.payments.reduce((acc, curr) => {
                if (curr.isPaid)
                    return acc + curr.amount;
                return acc;
            }, 0);
            const isOrderStatusUpdated = await this.orderService.updateOrderPaymentStatus(orderId, totalPaidAmount === order.orderTotalPrice
                ? "paid"
                : "partial");
            if (!isOrderStatusUpdated) {
                return (0, util_1.responseSender)(res, 500, "Order status update failed. Please try again.");
            }
            if (!transaction) {
                return res.redirect(`${dotenv_config_1.frontendLandingPageUrl}/failed-payment`);
            }
            return res.redirect(`${dotenv_config_1.frontendLandingPageUrl}/success-payment?transaction=${JSON.stringify(transaction)}`);
        }
        catch (err) {
            console.log("Error occured while payment success: ".red, err.message);
            next(err);
        }
    };
    paymentFail = async (req, res, next) => {
        try {
            const transactionId = req.body.tran_id;
            const order = await this.paymentService.getPaymentByTransactionId(transactionId);
            if (!order) {
                return (0, util_1.responseSender)(res, 500, "Order not found. Please try again.");
            }
            // update the order payment status
            const isPaymentStatusUpdated = await this.paymentService.updatePaymentStatus(transactionId, false);
            if (!isPaymentStatusUpdated) {
                return res.redirect(`${dotenv_config_1.frontendLandingPageUrl}/failed-payment`);
            }
            return res.redirect(`${dotenv_config_1.frontendLandingPageUrl}/failed-payment`);
        }
        catch (err) {
            console.log("Error occured while payment fail: ".red, err.message);
            next(err);
        }
    };
    paymentCancel = async (req, res, next) => {
        try {
            const transactionId = req.body.tran_id;
            const order = await this.paymentService.getPaymentByTransactionId(transactionId);
            if (!order) {
                return (0, util_1.responseSender)(res, 500, "Order not found. Please try again.");
            }
            // update the order payment status
            const isPaymentStatusUpdated = await this.paymentService.updatePaymentStatus(transactionId, false);
            if (!isPaymentStatusUpdated) {
                return res.redirect(`${dotenv_config_1.frontendLandingPageUrl}/failed-payment`);
            }
            return res.redirect(`${dotenv_config_1.frontendLandingPageUrl}/failed-payment`);
        }
        catch (err) {
            console.log("Error occured while payment cancel: ".red, err.message);
            next(err);
        }
    };
    getOrdersByCustomer = async (req, res, next) => {
        try {
            const customerId = req.validatedValue.customerId;
            // const searchTerm = (req as any).validatedValue.searchTerm;
            // const currentPage = parseInt((req as any).validatedValue.page || 1);
            // const limitPerPage = parseInt(
            // 	(req as any).validatedValue.limit || 20,
            // );
            // const offset = (currentPage - 1) * limitPerPage;
            // const order: Order = [["createdAt", "DESC"]];
            // const filter: WhereOptions<OrderAttributes> = {};
            if (!customerId) {
                return (0, util_1.responseSender)(res, 500, "Please provide customerId.");
            }
            const orders = await this.orderService.getOrdersByCustomer(customerId);
            if (!orders) {
                return (0, util_1.responseSender)(res, 400, "Failed to get orders. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Orders fetched successfully.", {
                orders,
            });
        }
        catch (err) {
            console.log("Error occured while fetching order: ".red, err.message);
            next(err);
        }
    };
    getAllOrders = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue.searchTerm;
            const searchBy = req.validatedValue.searchBy || "order-id";
            const filteredBy = req.validatedValue.filteredBy || "all";
            const currentPage = parseInt(req.validatedValue.page || 1);
            const limitPerPage = parseInt(req.validatedValue.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const order = [["createdAt", "DESC"]];
            const filter = {};
            const author = req.admin || req.staff;
            if (author?.staffId) {
                filter.staffId = author.staffId;
            }
            if (filteredBy === "active") {
                filter.status = [
                    "consultation-in-progress",
                    "awaiting-advance-payment",
                    "advance-payment-received",
                    "design-in-progress",
                    "awaiting-design-approval",
                    "production-started",
                    "production-in-progress",
                    "ready-for-delivery",
                    "out-for-delivery",
                ];
            }
            else if (filteredBy === "requested") {
                filter.status = "order-request-received";
            }
            else if (filteredBy === "completed") {
                filter.status = "order-completed";
            }
            else if (filteredBy === "cancelled") {
                filter.status = "order-canceled";
            }
            if (searchTerm && searchBy) {
                switch (searchBy) {
                    case "order-id":
                        filter.orderId = {
                            [sequelize_1.Op.like]: searchTerm,
                        };
                        break;
                    case "customer-name":
                        filter.customerName = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    case "customer-phone":
                        filter.customerPhone = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    case "customer-email":
                        filter.customerEmail = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    default:
                        break;
                }
            }
            const orders = await this.orderService.getAllOrders(filter, limitPerPage, offset, order);
            if (!orders.rows) {
                return (0, util_1.responseSender)(res, 400, "Failed to get orders. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Orders fetched successfully.", {
                orders: orders.rows,
                total: orders.count,
                totalPages: Math.ceil(orders.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while fetching order: ".red, err.message);
            next(err);
        }
    };
}
exports.default = OrderController;
