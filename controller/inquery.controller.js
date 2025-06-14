"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquery_service_1 = __importDefault(require("../service/inquery.service"));
const email_service_1 = __importDefault(require("../service/email.service"));
const util_1 = require("../util");
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const server_1 = require("../server");
const dotenv_config_1 = require("../config/dotenv.config");
class InqueryController {
    inqueryService;
    emailService;
    constructor() {
        this.inqueryService = new inquery_service_1.default();
        this.emailService = new email_service_1.default();
    }
    createInquery = async (req, res, next) => {
        try {
            const fileValidationError = req.fileValidationError;
            if (fileValidationError) {
                return (0, util_1.responseSender)(res, 400, fileValidationError);
            }
            const newInquery = req.validatedValue;
            if (req.files && req.files.length > 0) {
                newInquery.images = req.files;
            }
            const inquery = await this.inqueryService.createInquery(newInquery.name, newInquery.email, newInquery.phone, newInquery.company, newInquery.inqueryType, newInquery.message);
            if (!inquery) {
                return (0, util_1.responseSender)(res, 400, "Failed to create inquery. Please try again.");
            }
            // if inquery images exist then store them
            if (newInquery.images.length > 0) {
                for (const image of newInquery.images) {
                    await this.inqueryService.addInqueryImage(image.filename, inquery?.inqueryId);
                }
            }
            // emit the create inquery event
            server_1.io.emit("create-inquery", { inquery });
            try {
                // send inquery submission email
                await this.emailService.sendEmail(inquery.email, "Inquiry Received - Dhaka Plastic & Metal", "inquery-submission", {
                    customerName: inquery.name,
                    customerEmail: inquery.email,
                    customerPhone: inquery.phone,
                    customerMessage: inquery.message,
                });
                return (0, util_1.responseSender)(res, 200, "Inquery created successfully.", {
                    inquery,
                });
            }
            catch (err) {
                console.log("Error occured while sending inquery submission email: "
                    .red, err.message);
            }
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
            console.log("Error occured while creating inquery: ".red, err.message);
            next(err);
        }
    };
    getAllInqueries = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue.searchTerm;
            const searchBy = req.validatedValue.searchBy;
            const inqueryType = req.validatedValue.inqueryType;
            const status = req.validatedValue.status;
            const currentPage = parseInt(req.validatedValue.page || 1);
            const limitPerPage = parseInt(req.validatedValue.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const order = [["createdAt", "DESC"]];
            const filter = {};
            if (inqueryType) {
                filter.inqueryType = inqueryType;
            }
            if (status) {
                filter.status = status;
            }
            if (searchTerm && searchBy) {
                switch (searchBy) {
                    case "name":
                        filter.name = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    case "email":
                        filter.email = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    case "phone":
                        filter.phone = {
                            [sequelize_1.Op.like]: `%${searchTerm}%`,
                        };
                        break;
                    default:
                        break;
                }
            }
            const inqueries = await this.inqueryService.getAllInqueries(filter, limitPerPage, offset, order);
            if (!inqueries.rows) {
                return (0, util_1.responseSender)(res, 400, "Failed to get inqueries. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Inqueries fetched successfully.", {
                inqueries: inqueries.rows,
                total: inqueries.count,
                totalPages: Math.ceil(inqueries.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while fetching inqueries: ".red, err.message);
            next(err);
        }
    };
    closeInquery = async (req, res, next) => {
        try {
            const inquery = await this.inqueryService.closeInquery(req.validatedValue.inqueryId);
            if (!inquery) {
                return (0, util_1.responseSender)(res, 400, "Failed to close inquery. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Inquery closed successfully.");
        }
        catch (err) {
            console.log("Error occured while closing inquery: ".red, err.message);
            next(err);
        }
    };
    openInquery = async (req, res, next) => {
        try {
            const inquery = await this.inqueryService.openInquery(req.validatedValue.inqueryId);
            if (!inquery) {
                return (0, util_1.responseSender)(res, 400, "Failed to open inquery. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Inquery opened successfully.");
        }
        catch (err) {
            console.log("Error occured while opening inquery: ".red, err.message);
            next(err);
        }
    };
    deleteInquery = async (req, res, next) => {
        try {
            const fetchedInquery = await this.inqueryService.getInqueryById(req.validatedValue.inqueryId);
            if (!fetchedInquery) {
                return (0, util_1.responseSender)(res, 400, "Couldn't found inquery.");
            }
            if (fetchedInquery.images?.length > 0) {
                // remove the images
                for (const image of fetchedInquery.images) {
                    const filePath = path_1.default.join(dotenv_config_1.staticDir, "inqueries", image.imageName);
                    fs_1.default.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr)
                            console.log("Error deleting inquery images: ".red, unlinkErr.message);
                    });
                }
            }
            const inqueryDeleted = await this.inqueryService.deleteInquery(req.validatedValue.inqueryId);
            if (!inqueryDeleted) {
                return (0, util_1.responseSender)(res, 400, "Failed to delete inquery. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Inquery deleted successfully.");
        }
        catch (err) {
            console.log("Error occured while deleting inquery: ".red, err.message);
            next(err);
        }
    };
}
exports.default = InqueryController;
