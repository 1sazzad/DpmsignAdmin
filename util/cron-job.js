"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const otp_service_1 = __importDefault(require("../service/otp.service"));
const coupon_service_1 = __importDefault(require("../service/coupon.service"));
const cart_service_1 = __importDefault(require("../service/cart.service"));
const payment_service_1 = __importDefault(require("../service/payment.service"));
// Schedule the cleanup function to run on the 1st day of every month at midnight
node_cron_1.default.schedule("0 0 1 * *", () => {
    console.log("[CRON JOB] Running monthly OTP cleanup job...");
    otp_service_1.default.cleanupExpiredOtps();
}, {
    timezone: "Asia/Dhaka",
});
// Schedule the job to run every day at midnight (00:00)
node_cron_1.default.schedule("0 0 * * *", async () => {
    console.log("[CRON JOB] Running expired coupon active status update job...");
    coupon_service_1.default.expireCoupons();
}, {
    timezone: "Asia/Dhaka",
});
// Schedule the job to run every day at midnight (00:00)
node_cron_1.default.schedule("0 0 * * *", async () => {
    console.log("[CRON JOB] Running cleaning up cart items...");
    cart_service_1.default.cleanupCartItems();
}, {
    timezone: "Asia/Dhaka",
});
// Schedule the job to run every day at midnight (00:00)
node_cron_1.default.schedule("0 0 * * *", async () => {
    console.log("[CRON JOB] Running cleaning up unpaid payments...");
    payment_service_1.default.cleanupUnpaidPayments();
}, {
    timezone: "Asia/Dhaka",
});
