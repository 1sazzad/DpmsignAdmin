"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const sequelize_1 = require("sequelize");
const courier_service_1 = __importDefault(require("../service/courier.service"));
class CourierController {
    courierService;
    constructor() {
        this.courierService = new courier_service_1.default();
    }
    addCourier = async (req, res, next) => {
        try {
            const createdCourier = await this.courierService.addCourier(req.validatedValue.name);
            if (!createdCourier) {
                return (0, util_1.responseSender)(res, 500, "Failed to add new courier. Please try again.");
            }
            return (0, util_1.responseSender)(res, 201, "Courier added successfully.", {
                category: createdCourier,
            });
        }
        catch (err) {
            console.log("Error occured while adding courier: ".red, err.message);
            next(err);
        }
    };
    editCourier = async (req, res, next) => {
        try {
            const isUpdated = await this.courierService.editCourier(req.validatedValue.courierId, req.validatedValue.name);
            if (!isUpdated) {
                return (0, util_1.responseSender)(res, 500, "Courier update failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Courier updated successfully.");
        }
        catch (err) {
            console.log("Error occured while updating courier: ".red, err.message);
            next(err);
        }
    };
    deleteCourier = async (req, res, next) => {
        try {
            const fetchedCourier = await this.courierService.getCourierById(Number(req.validatedValue.courierId));
            if (!fetchedCourier) {
                return (0, util_1.responseSender)(res, 400, "Courier couldn't found.");
            }
            const isDeleted = await this.courierService.deleteCourier(fetchedCourier.courierId);
            if (!isDeleted) {
                return (0, util_1.responseSender)(res, 500, "Couldn't delete courier. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Courier deleted successfully.");
        }
        catch (err) {
            console.log("Error occured while creating courier: ".red, err.message);
            next(err);
        }
    };
    getAllCourier = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue.searchTerm;
            const currentPage = parseInt(req.validatedValue.page || 1);
            const limitPerPage = parseInt(req.validatedValue.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const order = [["createdAt", "DESC"]];
            const filter = {};
            if (searchTerm) {
                filter.name = {
                    [sequelize_1.Op.like]: `%${searchTerm}%`,
                };
            }
            const couriers = await this.courierService.getAllCourier(filter, limitPerPage, offset, order);
            if (!couriers.rows) {
                return (0, util_1.responseSender)(res, 400, "Failed to get couriers. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Couriers fetched successfully.", {
                couriers: couriers.rows,
                total: couriers.count,
                totalPages: Math.ceil(couriers.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while fetching couriers: ".red, err.message);
            next(err);
        }
    };
}
exports.default = CourierController;
