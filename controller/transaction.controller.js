"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const sequelize_1 = require("sequelize");
const transaction_service_1 = __importDefault(require("../service/transaction.service"));
class TransactionController {
    transactionService;
    constructor() {
        this.transactionService = new transaction_service_1.default();
    }
    getAllTransactions = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue.searchTerm;
            const currentPage = parseInt(req.validatedValue.page || 1);
            const limitPerPage = parseInt(req.validatedValue.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const order = [["createdAt", "DESC"]];
            const filter = {};
            if (searchTerm) {
                filter.orderId = {
                    [sequelize_1.Op.like]: searchTerm,
                };
            }
            const transactions = await this.transactionService.getAllTransactions(filter, limitPerPage, offset, order);
            if (!transactions.rows) {
                return (0, util_1.responseSender)(res, 400, "Failed to get transactions. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Transactions fetched successfully.", {
                transactions: transactions.rows,
                total: transactions.count,
                totalPages: Math.ceil(transactions.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while fetching transaction: ".red, err.message);
            next(err);
        }
    };
}
exports.default = TransactionController;
