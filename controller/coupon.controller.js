"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const sequelize_1 = require("sequelize");
const coupon_service_1 = __importDefault(require("../service/coupon.service"));
class CouponController {
    couponService;
    constructor() {
        this.couponService = new coupon_service_1.default();
    }
    createCoupon = async (req, res, next) => {
        try {
            const newCoupon = {
                name: req.validatedValue.name,
                code: req.validatedValue.code,
                discountType: req.validatedValue.discountType,
                amount: req.validatedValue.amount,
                minimumAmount: req.validatedValue.minimumAmount,
                endDate: req.validatedValue.endDate,
            };
            const isCouponExist = await this.couponService.getActiveCouponByCode(newCoupon.code);
            if (isCouponExist) {
                return (0, util_1.responseSender)(res, 400, "An active coupon is already exist associated with this code. Plese use another code to create.");
            }
            const createdCoupon = await this.couponService.createCoupon(newCoupon.name, newCoupon.code, newCoupon.discountType, newCoupon.amount, newCoupon.minimumAmount, newCoupon.endDate);
            if (!createdCoupon) {
                return (0, util_1.responseSender)(res, 500, "Coupon creation failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 201, "Coupon created successfully.", {
                coupon: createdCoupon,
            });
        }
        catch (err) {
            console.log("Error occured while creating coupon: ".red, err.message);
            next(err);
        }
    };
    editCoupon = async (req, res, next) => {
        try {
            const editedCoupon = {
                couponId: req.validatedValue.couponId,
                name: req.validatedValue.name,
                discountType: req.validatedValue.discountType,
                amount: req.validatedValue.amount,
                minimumAmount: req.validatedValue.minimumAmount,
                endDate: req.validatedValue.endDate,
                isActive: req.validatedValue.isActive,
            };
            const fetchedCoupon = await this.couponService.getCouponById(editedCoupon.couponId);
            if (fetchedCoupon && !(fetchedCoupon?.endDate >= new Date())) {
                return (0, util_1.responseSender)(res, 400, "The coupon is already expired.");
            }
            const isUpdated = await this.couponService.updateCoupon(editedCoupon.couponId, editedCoupon.name, editedCoupon.discountType, editedCoupon.amount, editedCoupon.minimumAmount, editedCoupon.endDate, editedCoupon.isActive);
            if (!isUpdated) {
                return (0, util_1.responseSender)(res, 500, "Coupon update failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Coupon updated successfully.");
        }
        catch (err) {
            console.log("Error occured while updating coupon: ".red, err.message);
            next(err);
        }
    };
    deleteCoupon = async (req, res, next) => {
        try {
            const fetchedCoupon = await this.couponService.getCouponById(Number(req.validatedValue.couponId));
            if (!fetchedCoupon) {
                return (0, util_1.responseSender)(res, 400, "Coupon couldn't found.");
            }
            const isDeleted = await this.couponService.deleteCoupon(fetchedCoupon.couponId);
            if (!isDeleted) {
                return (0, util_1.responseSender)(res, 500, "Couldn't delete coupon. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Coupon deleted successfully.");
        }
        catch (err) {
            console.log("Error occured while creating coupon: ".red, err.message);
            next(err);
        }
    };
    checkCoupon = async (req, res, next) => {
        try {
            const fetchedCoupon = req.validatedValue.code.length
                ? await this.couponService.getActiveCouponByCode(req.validatedValue.code)
                : await this.couponService.getActiveCouponByCode(req.validatedValue.couponId);
            if (!fetchedCoupon) {
                return (0, util_1.responseSender)(res, 400, "Invalid coupon.", {
                    valid: false,
                });
            }
            const totalPrice = req.validatedValue.totalPrice;
            let discountedPrice = totalPrice;
            if (fetchedCoupon.isActive &&
                totalPrice >= fetchedCoupon.minimumAmount) {
                discountedPrice =
                    fetchedCoupon.discountType === "flat"
                        ? totalPrice - fetchedCoupon.amount
                        : totalPrice -
                            totalPrice * (fetchedCoupon.amount / 100);
            }
            return (0, util_1.responseSender)(res, 200, "Successfully checked coupon status.", {
                totalPrice,
                discountedPrice: Math.floor(discountedPrice),
                coupon: fetchedCoupon,
                valid: true,
            });
        }
        catch (err) {
            console.log("Error occured while creating coupon: ".red, err.message);
            next(err);
        }
    };
    getAllCoupons = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue.searchTerm;
            const searchBy = req.validatedValue.searchBy;
            const currentPage = parseInt(req.validatedValue.page || 1);
            const limitPerPage = parseInt(req.validatedValue.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const order = [["createdAt", "DESC"]];
            const filter = {};
            if (searchTerm && searchBy) {
                switch (searchBy) {
                    case "name":
                        filter.name = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    case "code":
                        filter.code = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    default:
                        break;
                }
            }
            const coupons = await this.couponService.getAllCoupons(filter, limitPerPage, offset, order);
            if (!coupons.rows) {
                return (0, util_1.responseSender)(res, 400, "Failed to get coupons. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Coupons fetched successfully.", {
                coupons: coupons.rows,
                total: coupons.count,
                totalPages: Math.ceil(coupons.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while fetching coupons: ".red, err.message);
            next(err);
        }
    };
}
exports.default = CouponController;
