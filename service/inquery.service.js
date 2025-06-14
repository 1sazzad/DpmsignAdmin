"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquery_image_model_1 = __importDefault(require("../model/inquery-image.model"));
const inquery_model_1 = __importDefault(require("../model/inquery.model"));
class InqueryService {
    createInquery = async (name, email, phone, company, inqueryType, message, status = "open") => {
        try {
            const inquery = await inquery_model_1.default.create({
                name,
                email,
                phone,
                company,
                inqueryType,
                message,
                status,
            });
            return inquery ? inquery.toJSON() : null;
        }
        catch (err) {
            console.log("Error occured while creating inquery: ".red, err.message);
            throw err;
        }
    };
    addInqueryImage = async (imageName, inqueryId) => {
        try {
            await inquery_image_model_1.default.create({ imageName, inqueryId });
            return true;
        }
        catch (err) {
            console.log("Error occurred while adding inquery image: ", err.message);
            throw err;
        }
    };
    closeInquery = async (inqueryId) => {
        try {
            const inquery = await inquery_model_1.default.findOne({
                where: { inqueryId },
            });
            if (inquery) {
                inquery.status = "closed";
                await inquery.save();
                return inquery.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while closing inquery: ".red, err.message);
            throw err;
        }
    };
    openInquery = async (inqueryId) => {
        try {
            const inquery = await inquery_model_1.default.findOne({
                where: { inqueryId },
            });
            if (inquery) {
                inquery.status = "open";
                await inquery.save();
                return inquery.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while opening inquery: ".red, err.message);
            throw err;
        }
    };
    deleteInquery = async (inqueryId) => {
        try {
            const inquery = await inquery_model_1.default.findOne({ where: { inqueryId } });
            if (!inquery)
                return false;
            await inquery_image_model_1.default.destroy({ where: { inqueryId } });
            await inquery.destroy();
            return true;
        }
        catch (err) {
            console.log("Error occurred while deleting inquiry: ".red, err.message);
            throw err;
        }
    };
    getAllInqueries = async (filter, limit, offset, order) => {
        try {
            const inqueries = await inquery_model_1.default.findAndCountAll({
                where: filter,
                limit,
                offset,
                order,
                distinct: true,
                include: [
                    { model: inquery_image_model_1.default, as: "images", separate: true },
                ],
            });
            return {
                rows: inqueries.rows.map((inquery) => inquery.toJSON()),
                count: inqueries.count,
            };
        }
        catch (err) {
            console.log("Error occured while getting inquery: ".red, err.message);
            throw err;
        }
    };
    getInqueryById = async (inqueryId) => {
        try {
            const inquery = await inquery_model_1.default.findOne({
                where: { inqueryId },
                include: [
                    { model: inquery_image_model_1.default, as: "images", separate: true },
                ],
            });
            if (inquery) {
                return inquery.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while finding inquery by id: ".red, err.message);
            throw err;
        }
    };
}
exports.default = InqueryService;
