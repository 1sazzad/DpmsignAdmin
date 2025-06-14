"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_config_1 = require("../config/dotenv.config");
const payment_model_1 = __importDefault(require("../model/payment.model"));
const util_1 = require("../util");
const sequelize_1 = require("sequelize");
class PaymentService {
    SSLCommerzConfig;
    BASE_URL;
    constructor() {
        this.SSLCommerzConfig = {
            store_id: dotenv_config_1.sslCommerzStoreId,
            store_passwd: dotenv_config_1.sslCommerzStorePassword,
            sandbox: dotenv_config_1.sslCommerzSandbox === "true",
        };
        this.BASE_URL = this.SSLCommerzConfig.sandbox
            ? "https://sandbox.sslcommerz.com"
            : "https://securepay.sslcommerz.com";
    }
    createCashPayment = async (orderId, amount) => {
        try {
            const transactionId = await this.generateUniqueTransactionId();
            const createdPayment = await payment_model_1.default.create({
                transactionId,
                orderId,
                paymentMethod: "cod-payment",
                amount,
                isPaid: true,
                paymentLink: null,
            });
            return createdPayment.toJSON();
        }
        catch (err) {
            console.log("Error occurred while creating online order payment: ".red, err.message);
            throw err;
        }
    };
    createOnlinePayment = async (orderId, amount, customerName, customerEmail, customerPhone) => {
        try {
            const transactionId = await this.generateUniqueTransactionId();
            const paymentData = {
                store_id: this.SSLCommerzConfig.store_id,
                store_passwd: this.SSLCommerzConfig.store_passwd,
                total_amount: amount.toString(),
                currency: "BDT",
                tran_id: transactionId,
                success_url: "http://localhost:4000/api/order/payment/success",
                fail_url: "http://localhost:4000/api/order/payment/fail",
                cancel_url: "http://localhost:4000/api/order/payment/cancel",
                cus_name: customerName,
                cus_email: customerEmail,
                cus_phone: customerPhone,
                cus_add1: "N/A", // Optional
                cus_city: "N/A", // Optional
                cus_country: "N/A", // Optional
                shipping_method: "NO", // Optional
                product_name: "N/A", // Optional
                product_category: "N/A", // Optional
                product_profile: "general", // Optional
            };
            const response = await axios_1.default.post(`${this.BASE_URL}/gwprocess/v4/api.php`, paymentData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            if (response.data.status === "SUCCESS") {
                const createdPayment = await payment_model_1.default.create({
                    transactionId,
                    orderId,
                    paymentMethod: "online-payment",
                    amount,
                    isPaid: false,
                    paymentLink: response.data.GatewayPageURL,
                });
                return createdPayment.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occurred while creating online order payment: ".red, err.message);
            throw err;
        }
    };
    getPaymentByTransactionId = async (transactionId) => {
        try {
            const payment = await payment_model_1.default.findOne({ where: { transactionId } });
            return payment;
        }
        catch (err) {
            console.log("Error occurred while fetching payment by transaction id: ".red, err.message);
            throw err;
        }
    };
    updatePaymentStatus = async (transactionId, isPaid) => {
        try {
            const payment = await payment_model_1.default.update({ isPaid }, { where: { transactionId } });
            if (!payment) {
                return false;
            }
            return true;
        }
        catch (err) {
            console.log("Error occurred while updating payment status: ".red, err.message);
            throw err;
        }
    };
    generateUniqueTransactionId = async () => {
        let transactionId;
        let exists;
        do {
            transactionId = (0, util_1.generateTransactionId)(true);
            exists = await payment_model_1.default.findOne({ where: { transactionId } });
        } while (exists);
        return transactionId;
    };
    static cleanupUnpaidPayments = async () => {
        try {
            await payment_model_1.default.destroy({
                where: {
                    createdAt: {
                        [sequelize_1.Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                    isPaid: false,
                },
            });
            console.log("Unpaid payments cleaned up successfully.".green);
        }
        catch (error) {
            console.log("Error cleaning up unpaid payments: ".red, error);
        }
    };
}
exports.default = PaymentService;
