"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coupon_model_1 = __importDefault(require("../model/coupon.model"));
const sequelize_1 = require("sequelize");
class CouponService {
    // Create a new coupon
    createCoupon = async (name, code, discountType, amount, minimumAmount, endDate) => {
        try {
            const coupon = await coupon_model_1.default.create({
                name,
                code,
                discountType,
                amount,
                minimumAmount,
                startDate: new Date(),
                endDate,
                isActive: true,
            });
            return coupon ? coupon.toJSON() : null;
        }
        catch (err) {
            console.log("Error creating coupon: ".red, err.message);
            throw err;
        }
    };
    // Get coupon by ID
    getCouponById = async (couponId) => {
        try {
            const coupon = await coupon_model_1.default.findByPk(couponId);
            return coupon ? coupon.toJSON() : null;
        }
        catch (err) {
            console.log("Error fetching coupon: ".red, err.message);
            throw err;
        }
    };
    // Get coupon by code
    getCouponByCode = async (code) => {
        try {
            const coupon = await coupon_model_1.default.findOne({ where: { code } });
            return coupon ? coupon.toJSON() : null;
        }
        catch (err) {
            console.log("Error fetching coupon: ".red, err.message);
            throw err;
        }
    };
    getActiveCouponByCode = async (code) => {
        try {
            const coupon = await coupon_model_1.default.findOne({
                where: {
                    code,
                    isActive: true,
                    endDate: {
                        [sequelize_1.Op.gte]: new Date(),
                    },
                },
            });
            return coupon ? coupon.toJSON() : null;
        }
        catch (err) {
            console.log("Error fetching coupon: ".red, err.message);
            throw err;
        }
    };
    getActiveCouponById = async (couponId) => {
        try {
            const coupon = await coupon_model_1.default.findOne({
                where: {
                    couponId,
                    isActive: true,
                    endDate: {
                        [sequelize_1.Op.gte]: new Date(),
                    },
                },
            });
            return coupon ? coupon.toJSON() : null;
        }
        catch (err) {
            console.log("Error fetching coupon: ".red, err.message);
            throw err;
        }
    };
    // Update coupon
    updateCoupon = async (couponId, name, discountType, amount, minimumAmount, endDate, isActive) => {
        try {
            // Update coupon details
            const [updatedRows] = await coupon_model_1.default.update({
                name,
                discountType,
                amount,
                minimumAmount,
                endDate,
                isActive,
            }, { where: { couponId } });
            if (updatedRows === 0)
                return false; // If no coupon was updated, return false
            return true;
        }
        catch (err) {
            console.log("Error updating coupon: ".red, err.message);
            throw err;
        }
    };
    // Delete coupon
    deleteCoupon = async (couponId) => {
        try {
            const coupon = await coupon_model_1.default.findByPk(couponId);
            if (coupon) {
                await coupon.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error deleting coupon: ".red, err.message);
            throw err;
        }
    };
    // Get all coupons with optional filtering
    getAllCoupons = async (filter = {}, limit, offset, order) => {
        try {
            const coupons = await coupon_model_1.default.findAndCountAll({
                where: filter,
                limit,
                offset,
                order,
            });
            return {
                rows: coupons.rows.map((coupon) => coupon.toJSON()),
                count: coupons.count,
            };
        }
        catch (err) {
            console.log("Error fetching coupons: ".red, err.message);
            throw err;
        }
    };
    static expireCoupons = async () => {
        try {
            const expiredCoupons = await coupon_model_1.default.update({ isActive: false }, {
                where: {
                    isActive: true,
                    endDate: {
                        [sequelize_1.Op.lt]: new Date(), // Expired coupons
                    },
                },
            });
            console.log(`[CRON JOB] Updated ${expiredCoupons[0]} expired coupons to inactive.`
                .green);
        }
        catch (err) {
            console.error("[CRON JOB] Error updating expired coupons: ".red, err.message);
        }
    };
}
exports.default = CouponService;
