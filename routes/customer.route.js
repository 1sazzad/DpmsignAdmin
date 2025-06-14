"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_middleware_1 = __importDefault(require("../middleware/customer.middleware"));
const customer_controller_1 = __importDefault(require("../controller/customer.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const customerMiddleware = new customer_middleware_1.default();
const customerController = new customer_controller_1.default();
const authMiddleware = new auth_middleware_1.default();
const customerRouter = express_1.default.Router();
// register customer
customerRouter.post("/register", rateLimiter_middleware_1.strictLimiter, customerMiddleware.validateCustomerRegistration, customerController.registerCustomer);
// verify customer account
// * TODO: Redirect to the home page with a toast message
customerRouter.get("/verify", rateLimiter_middleware_1.apiLimiter, customerMiddleware.validateCustomerVerificationQuery, customerController.verifyCustomerAccount);
// login customer
customerRouter.post("/login", rateLimiter_middleware_1.strictLimiter, customerMiddleware.validateCustomerLogin, customerController.loginCustomer);
// password reset request
customerRouter.post("/reset-password-request", rateLimiter_middleware_1.strictLimiter, customerMiddleware.validateCustomerResetPasswordRequest, customerController.sendPasswordResetRequest);
// reset password
customerRouter.post("/reset-password-verify", rateLimiter_middleware_1.strictLimiter, customerMiddleware.validateCustomerResetPasswordVerify, customerController.verifyResetPassword);
// update password
customerRouter.post("/reset-password", rateLimiter_middleware_1.strictLimiter, customerMiddleware.validateCustomerResetPassword, customerController.resetPassword);
customerRouter.put("/", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["customer"]), customerMiddleware.validateCustomerUpdate, customerController.updateCustomer);
// get all customers
customerRouter.get("/", authMiddleware.authenticate(["admin"]), customerMiddleware.validateFilteringQueries, customerController.getAllCustomers);
exports.default = customerRouter;
