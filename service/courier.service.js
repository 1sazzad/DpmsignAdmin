"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const courier_model_1 = __importDefault(require("../model/courier.model"));
class CourierService {
    addCourier = async (name) => {
        try {
            const createdCourier = await courier_model_1.default.create({
                name,
            });
            return createdCourier || null;
        }
        catch (err) {
            console.log("Error occurred while creating new courier service: ".red, err.message);
            throw err;
        }
    };
    getCourierById = async (courierId) => {
        try {
            const courier = await courier_model_1.default.findByPk(courierId);
            return courier || null;
        }
        catch (err) {
            console.log("Error occured while updating courier by id: ".red, err.message);
            throw err;
        }
    };
    editCourier = async (courierId, name) => {
        try {
            const courier = await courier_model_1.default.findByPk(courierId);
            if (courier) {
                courier.name = name;
                await courier.save();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while updating courier by id: ".red, err.message);
            throw err;
        }
    };
    deleteCourier = async (courierId) => {
        try {
            const courier = await courier_model_1.default.findByPk(courierId);
            if (courier) {
                await courier.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while deleting courier by id: ".red, err.message);
            throw err;
        }
    };
    getAllCourier = async (filter = {}, limit, offset, order) => {
        try {
            const couriers = await courier_model_1.default.findAll({
                where: filter,
                limit,
                offset,
                order,
            });
            const count = await courier_model_1.default.count({ where: filter });
            return {
                rows: couriers.map((courier) => courier.toJSON()),
                count,
            };
        }
        catch (err) {
            console.log("Error fetching couriers: ".red, err.message);
            throw err;
        }
    };
}
exports.default = CourierService;
