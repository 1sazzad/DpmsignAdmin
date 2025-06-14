"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_middleware_1 = __importDefault(require("../middleware/transaction.middleware"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const transaction_controller_1 = __importDefault(require("../controller/transaction.controller"));
const transactionMiddleware = new transaction_middleware_1.default();
const authMiddleware = new auth_middleware_1.default();
const transactionController = new transaction_controller_1.default();
const transactionRouter = express_1.default.Router();
transactionRouter.get("/", 
// authMiddleware.authenticate(["admin", "agent", "customer"]),
transactionMiddleware.validateFilteringQueries, transactionController.getAllTransactions);
exports.default = transactionRouter;
