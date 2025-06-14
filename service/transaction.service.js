"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_model_1 = __importDefault(require("../model/transaction.model"));
class TransactionService {
    constructor() { }
    createTransaction = async (transactionId, orderId, valId, amount, storeAmount, cardType, bankTransactionId, status, transactionDate, currency, cardIssuer, cardBrand) => {
        try {
            const transaction = await transaction_model_1.default.create({
                transactionId,
                orderId,
                valId,
                amount,
                storeAmount,
                cardType,
                bankTransactionId,
                status,
                transactionDate,
                currency,
                cardIssuer,
                cardBrand,
            });
            return transaction.toJSON();
        }
        catch (err) {
            console.log("Error occurred while creating transaction: ".red, err.message);
            throw err;
        }
    };
    getAllTransactions = async (filter, limit, offset, order) => {
        try {
            const transactions = await transaction_model_1.default.findAll({
                where: filter,
                limit,
                offset,
                order,
            });
            return {
                rows: transactions.map((transaction) => transaction.toJSON()),
                count: transactions.length,
            };
        }
        catch (err) {
            console.log("Error occurred while fetching transactions: ".red, err.message);
            throw err;
        }
    };
}
exports.default = TransactionService;
