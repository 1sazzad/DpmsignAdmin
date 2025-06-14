"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_1 = __importDefault(require("../model/order.model"));
const staff_service_1 = __importDefault(require("../service/staff.service"));
const order_item_model_1 = __importDefault(require("../model/order-item.model"));
const payment_model_1 = __importDefault(require("../model/payment.model"));
const product_model_1 = __importDefault(require("../model/product.model"));
const product_variant_model_1 = __importDefault(require("../model/product-variant.model"));
const order_image_model_1 = __importDefault(require("../model/order-image.model"));
const product_variant_detail_model_1 = __importDefault(require("../model/product-variant-detail.model"));
const variation_item_model_1 = __importDefault(require("../model/variation-item.model"));
const variation_model_1 = __importDefault(require("../model/variation.model"));
const customer_service_1 = __importDefault(require("../service/customer.service"));
class OrderService {
    staffService;
    customerService;
    constructor() {
        this.staffService = new staff_service_1.default();
        this.customerService = new customer_service_1.default();
    }
    createOrder = async (customerId, customerName, customerEmail, customerPhone, staffId, billingAddress, additionalNotes, method, status, currentStatus, deliveryMethod, deliveryDate, paymentMethod, paymentStatus, couponId, courierId, courierAddress, orderItems) => {
        try {
            const newOrder = {
                customerId,
                customerName,
                customerEmail,
                customerPhone,
                billingAddress,
                additionalNotes,
                staffId,
                method,
                status,
                deliveryMethod,
                paymentMethod,
                paymentStatus,
                couponId,
                courierId,
                courierAddress,
                deliveryDate,
                currentStatus,
            };
            if (customerId) {
                const customer = await this.customerService.getCustomerById(customerId);
                if (customer) {
                    newOrder.customerId = customer.customerId;
                    newOrder.customerName = customer.name;
                    newOrder.customerEmail = customer.email;
                    newOrder.customerPhone = customer.phone;
                }
                else {
                    newOrder.customerId = null;
                }
            }
            if (!courierId || !courierAddress) {
                newOrder.courierId = null;
                newOrder.courierAddress = null;
            }
            if (!staffId) {
                const randomStaff = await this.staffService.getRandomStaff();
                if (randomStaff) {
                    newOrder.staffId = randomStaff.staffId;
                }
            }
            const createdOrder = await order_model_1.default.create({
                customerId: newOrder.customerId,
                customerName: newOrder.customerName,
                customerEmail: newOrder.customerEmail,
                customerPhone: newOrder.customerPhone,
                billingAddress: newOrder.billingAddress,
                additionalNotes: newOrder.additionalNotes,
                staffId: newOrder.staffId,
                method: newOrder.method,
                status: newOrder.status,
                deliveryMethod: newOrder.deliveryMethod,
                paymentMethod: newOrder.paymentMethod,
                paymentStatus: newOrder.paymentStatus,
                couponId: newOrder.couponId,
                courierId: newOrder.courierId,
                courierAddress: newOrder.courierAddress,
                deliveryDate: newOrder.deliveryDate,
                currentStatus: newOrder.currentStatus,
                orderTotalPrice: orderItems.reduce((acc, curr) => {
                    return acc + curr.price;
                }, 0),
            });
            if (orderItems.length > 0) {
                await order_item_model_1.default.bulkCreate(orderItems.map((orderItem) => ({
                    ...orderItem,
                    orderId: createdOrder.orderId,
                })));
            }
            // if (payments.length > 0) {
            // 	await PaymentDetails.bulkCreate(
            // 		payments.map((payments) => ({
            // 			...payments,
            // 			orderId: createdOrder.orderId,
            // 		})),
            // 	);
            // }
            // const createdOrder = await this.getOrderById(newOrder.orderId);
            return (await this.getOrderById(createdOrder.orderId)) || null;
        }
        catch (err) {
            console.log("Error occurred while creating order: ".red, err.message);
            throw err;
        }
    };
    createOrderRequest = async (customerId, customerName, customerPhone, staffId, billingAddress, additionalNotes, deliveryMethod, paymentMethod, couponId, courierId, courierAddress, orderItems) => {
        try {
            const newOrder = {
                customerId,
                customerName,
                customerPhone,
                billingAddress,
                additionalNotes,
                staffId,
                method: "online",
                status: "order-request-received",
                deliveryMethod,
                paymentMethod,
                paymentStatus: "pending",
                couponId,
                courierId,
                courierAddress,
                deliveryDate: null,
                currentStatus: "",
            };
            if (customerId) {
                const customer = await this.customerService.getCustomerById(customerId);
                if (customer) {
                    newOrder.customerId = customer.customerId;
                    newOrder.customerEmail = customer.email;
                }
                else {
                    newOrder.customerId = null;
                }
            }
            if (!courierId || !courierAddress) {
                newOrder.courierId = null;
                newOrder.courierAddress = null;
            }
            if (!staffId) {
                const randomStaff = await this.staffService.getRandomStaff();
                if (randomStaff) {
                    newOrder.staffId = randomStaff.staffId;
                }
            }
            const createdOrder = await order_model_1.default.create({
                customerId: newOrder.customerId,
                customerName: newOrder.customerName,
                customerEmail: newOrder.customerEmail,
                customerPhone: newOrder.customerPhone,
                billingAddress: newOrder.billingAddress,
                additionalNotes: newOrder.additionalNotes,
                staffId: newOrder.staffId,
                method: newOrder.method,
                status: newOrder.status,
                deliveryMethod: newOrder.deliveryMethod,
                paymentMethod: newOrder.paymentMethod,
                paymentStatus: newOrder.paymentStatus,
                couponId: newOrder.couponId,
                courierId: newOrder.courierId,
                courierAddress: newOrder.courierAddress,
                deliveryDate: newOrder.deliveryDate,
                currentStatus: newOrder.currentStatus,
                orderTotalPrice: orderItems.reduce((acc, curr) => {
                    return acc + curr.price;
                }, 0),
            });
            if (orderItems.length > 0) {
                await order_item_model_1.default.bulkCreate(orderItems.map((orderItem) => ({
                    ...orderItem,
                    orderId: createdOrder.orderId,
                })));
            }
            // const createdOrder = await this.getOrderById(newOrder.orderId);
            return (await this.getOrderById(createdOrder.orderId)) || null;
        }
        catch (err) {
            console.log("Error occurred while creating order: ".red, err.message);
            throw err;
        }
    };
    getOrderById = async (orderId) => {
        try {
            const order = await order_model_1.default.findByPk(orderId, {
                include: [
                    {
                        model: order_item_model_1.default,
                        as: "orderItems",
                        separate: true,
                        include: [
                            {
                                model: product_model_1.default,
                                as: "product",
                                attributes: [
                                    "productId",
                                    "name",
                                    "basePrice",
                                    "sku",
                                ],
                            },
                            {
                                model: product_variant_model_1.default,
                                as: "productVariant",
                                attributes: [
                                    "productVariantId",
                                    "productId",
                                    "additionalPrice",
                                ],
                                include: [
                                    {
                                        model: product_variant_detail_model_1.default,
                                        as: "variantDetails",
                                        attributes: [
                                            "productVariantDetailId",
                                            "productVariantId",
                                            "variationItemId",
                                        ],
                                        separate: true,
                                        include: [
                                            {
                                                model: variation_item_model_1.default,
                                                attributes: ["value"],
                                                include: [
                                                    {
                                                        model: variation_model_1.default,
                                                        as: "variation",
                                                        attributes: [
                                                            "name",
                                                            "unit",
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    { model: order_image_model_1.default, as: "images", separate: true },
                    { model: payment_model_1.default, as: "payments", separate: true },
                ],
            });
            return order ? order.toJSON() : null;
        }
        catch (err) {
            console.log("Error occurred while fetching order by id: ".red, err.message);
            throw err;
        }
    };
    getOrdersByCustomer = async (customerId) => {
        try {
            const orders = await order_model_1.default.findAll({
                where: { customerId },
                include: [
                    {
                        model: order_item_model_1.default,
                        as: "orderItems",
                        separate: true,
                        include: [
                            {
                                model: product_model_1.default,
                                as: "product",
                                attributes: [
                                    "productId",
                                    "name",
                                    "basePrice",
                                    "sku",
                                ],
                            },
                            {
                                model: product_variant_model_1.default,
                                as: "productVariant",
                                attributes: [
                                    "productVariantId",
                                    "productId",
                                    "additionalPrice",
                                ],
                                include: [
                                    {
                                        model: product_variant_detail_model_1.default,
                                        as: "variantDetails",
                                        attributes: [
                                            "productVariantDetailId",
                                            "productVariantId",
                                            "variationItemId",
                                        ],
                                        separate: true,
                                        include: [
                                            {
                                                model: variation_item_model_1.default,
                                                attributes: ["value"],
                                                include: [
                                                    {
                                                        model: variation_model_1.default,
                                                        as: "variation",
                                                        attributes: [
                                                            "name",
                                                            "unit",
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    { model: order_image_model_1.default, as: "images", separate: true },
                    {
                        model: payment_model_1.default,
                        as: "payments",
                        separate: true,
                    },
                ],
            });
            return orders ? orders.map((order) => order.toJSON()) : null;
        }
        catch (err) {
            console.log("Error occurred while fetching order by id: ".red, err.message);
            throw err;
        }
    };
    addOrderImage = async (imageName, orderId) => {
        try {
            await order_image_model_1.default.create({ imageName, orderId });
            return true;
        }
        catch (err) {
            console.log("Error occurred while adding order image: ", err.message);
            throw err;
        }
    };
    updateOrder = async (orderId, deliveryDate, status, courierAddress, additionalNotes) => {
        try {
            const orderToUpdate = await order_model_1.default.update({
                deliveryDate,
                status,
                courierAddress,
                additionalNotes,
            }, {
                where: { orderId },
            });
            if (!orderToUpdate) {
                return false;
            }
            return true;
        }
        catch (err) {
            console.log("Error occurred while updating order: ", err.message);
            throw err;
        }
    };
    updateOrderPaymentStatus = async (orderId, paymentStatus) => {
        try {
            const order = await order_model_1.default.update({ paymentStatus }, { where: { orderId } });
            if (!order) {
                return false;
            }
            return true;
        }
        catch (err) {
            console.log("Error occurred while updating order payment status: ".red, err.message);
            throw err;
        }
    };
    // updateOrder = async (
    // 	statusId: number,
    // 	orderItems: OrderItemCreationAttributes[],
    // 	payments: PaymentDetailsCreationAttributes[],
    // ): Promise<boolean> => {
    // 	try {
    // 		const [updatedRows] = await Product.update(updateData, {
    // 			where: { productId },
    // 		});
    // 		return updatedRows > 0;
    // 	} catch (err: any) {
    // 		console.log(
    // 			"Error occurred while updating product: ".red,
    // 			err.message,
    // 		);
    // 		throw err;
    // 	}
    // };
    // deleteOrder = async (productId: number): Promise<boolean> => {
    // 	try {
    // 		const product = await Product.findByPk(productId);
    // 		if (product) {
    // 			await product.destroy();
    // 			return true;
    // 		}
    // 		return false;
    // 	} catch (err: any) {
    // 		console.log(
    // 			"Error occurred while deleting product: ".red,
    // 			err.message,
    // 		);
    // 		throw err;
    // 	}
    // };
    getAllOrders = async (filter, limit, offset, order) => {
        try {
            const orders = await order_model_1.default.findAll({
                where: filter,
                limit,
                offset,
                order,
                subQuery: false,
                include: [
                    {
                        model: order_item_model_1.default,
                        as: "orderItems",
                        separate: true,
                        include: [
                            {
                                model: product_model_1.default,
                                as: "product",
                                attributes: [
                                    "productId",
                                    "name",
                                    "basePrice",
                                    "sku",
                                ],
                            },
                            {
                                model: product_variant_model_1.default,
                                as: "productVariant",
                                attributes: [
                                    "productVariantId",
                                    "productId",
                                    "additionalPrice",
                                ],
                                include: [
                                    {
                                        model: product_variant_detail_model_1.default,
                                        as: "variantDetails",
                                        attributes: [
                                            "productVariantDetailId",
                                            "productVariantId",
                                            "variationItemId",
                                        ],
                                        separate: true,
                                        include: [
                                            {
                                                model: variation_item_model_1.default,
                                                attributes: ["value"],
                                                include: [
                                                    {
                                                        model: variation_model_1.default,
                                                        as: "variation",
                                                        attributes: [
                                                            "name",
                                                            "unit",
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    { model: order_image_model_1.default, as: "images", separate: true },
                    { model: payment_model_1.default, as: "payments", separate: true },
                ],
            });
            // Get total count separately
            const count = await order_model_1.default.count({ where: filter });
            return {
                rows: orders.map((order) => order.toJSON()),
                count,
            };
        }
        catch (err) {
            console.log("Error occurred while fetching orders: ".red, err.message);
            throw err;
        }
    };
}
exports.default = OrderService;
