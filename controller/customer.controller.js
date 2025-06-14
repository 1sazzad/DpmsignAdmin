"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_config_1 = require("../config/dotenv.config");
const util_1 = require("../util");
const url_join_1 = __importDefault(require("url-join"));
const customer_service_1 = __importDefault(require("../service/customer.service"));
const email_service_1 = __importDefault(require("../service/email.service"));
const otp_service_1 = __importDefault(require("../service/otp.service"));
const sequelize_1 = require("sequelize");
const server_1 = require("../server");
class CustomerController {
    customerService;
    emailService;
    otpService;
    constructor() {
        this.customerService = new customer_service_1.default();
        this.emailService = new email_service_1.default();
        this.otpService = new otp_service_1.default();
    }
    registerCustomer = async (req, res, next) => {
        try {
            const customer = {
                name: req.validatedValue.name,
                email: req.validatedValue.email,
                password: await (0, util_1.hashedPassword)(req.validatedValue.password),
                phone: req.validatedValue.phone,
                verificationToken: (0, util_1.generateVerificationToken)(),
            };
            const isEmailExists = await this.customerService.getCustomerByEmail(customer.email);
            if (isEmailExists) {
                return (0, util_1.responseSender)(res, 400, "Customer already registered. Please login.");
            }
            const createdCustomer = await this.customerService.registerCustomer(customer.name, customer.email, customer.password, customer.phone, customer.verificationToken);
            if (!createdCustomer) {
                return (0, util_1.responseSender)(res, 400, "Customer registration failed. Please try again.");
            }
            // create jwt token
            const { password, ...authTokenPayload } = createdCustomer;
            const authToken = (0, util_1.generateJWTToken)(authTokenPayload);
            try {
                // send welcome email
                const verificationUrl = (0, url_join_1.default)(dotenv_config_1.serverBaseUrl, dotenv_config_1.serverUrlPrefix, `/customer/verify?email=${customer.email}&token=${customer.verificationToken}`);
                await this.emailService.sendEmail(customer.email, "Welcome to Dhaka Plastic & Metal", "welcome-email", { name: customer.name, verificationUrl });
                // emit the new customer join event
                server_1.io.emit("register-customer", { customer: authTokenPayload });
                return (0, util_1.responseSender)(res, 201, "Customer registered successfully.", {
                    customer: authTokenPayload,
                    authToken,
                });
            }
            catch (err) {
                console.log("Error occured while sending welcome email: ".red, err.message);
                // clean up the database
                await this.customerService.deleteCustomer(customer.email);
                next(err);
            }
        }
        catch (err) {
            console.log("Error occured while registering customer: ".red, err.message);
            next(err);
        }
    };
    loginCustomer = async (req, res, next) => {
        try {
            const fetchedCustomer = await this.customerService.getCustomerByEmail(req.validatedValue.email);
            if (!fetchedCustomer) {
                return (0, util_1.responseSender)(res, 400, "Customer account not found. Please register.");
            }
            const isPasswordValid = await (0, util_1.comparePassword)(req.validatedValue.password, fetchedCustomer.password);
            if (!isPasswordValid) {
                return (0, util_1.responseSender)(res, 400, "Invalid password. Please try again.");
            }
            // create jwt token
            const { password, ...authTokenPayload } = fetchedCustomer;
            const authToken = (0, util_1.generateJWTToken)(authTokenPayload);
            return (0, util_1.responseSender)(res, 200, "Customer logged in successfully.", {
                customer: authTokenPayload,
                authToken,
            });
        }
        catch (err) {
            console.log("Error occured while logging in customer: ".red, err.message);
            next(err);
        }
    };
    updateCustomer = async (req, res, next) => {
        try {
            const authorizedCustomer = req.customer;
            const fetchedCustomer = await this.customerService.getCustomerByEmail(authorizedCustomer.email);
            if (!fetchedCustomer) {
                return (0, util_1.responseSender)(res, 400, "Customer not found. Please register.");
            }
            const isPasswordValid = await (0, util_1.comparePassword)(req.validatedValue.currentPassword, fetchedCustomer.password);
            if (!isPasswordValid) {
                return (0, util_1.responseSender)(res, 400, "Invalid password. Please try again.");
            }
            const updatedCustomerProps = {
                email: fetchedCustomer.email,
                name: req.validatedValue.name,
                phone: req.validatedValue.phone,
                billingAddress: req.validatedValue.billingAddress,
                shippingAddress: req.validatedValue.shippingAddress,
                password: req.validatedValue.newPassword.length > 0
                    ? await (0, util_1.hashedPassword)(req.validatedValue.newPassword)
                    : undefined,
            };
            const isUpdated = await this.customerService.updateCustomer(updatedCustomerProps.name, updatedCustomerProps.email, updatedCustomerProps.phone, updatedCustomerProps.billingAddress, updatedCustomerProps.shippingAddress, updatedCustomerProps.password);
            if (!isUpdated) {
                return (0, util_1.responseSender)(res, 400, "Customer update failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Customer updated successfully.");
        }
        catch (err) {
            console.log("Error occured in customer controller: ".red, err.message);
            next(err);
        }
    };
    verifyCustomerAccount = async (req, res, next) => {
        try {
            const customer = await this.customerService.getCustomerByEmail(req.validatedValue.email);
            if (!customer) {
                return (0, util_1.responseSender)(res, 400, "Account not found. Please register.");
            }
            if (customer.verified) {
                return (0, util_1.responseSender)(res, 400, "Your account already verified.");
            }
            if (customer.verificationToken !== req.validatedValue.token) {
                return (0, util_1.responseSender)(res, 400, "Invalid verification token.");
            }
            const isVerified = await this.customerService.verifyCustomerAccount(req.validatedValue.email);
            if (isVerified) {
                // redirect to the login page
                // * TODO: Redirect to the home page with a toast message [your account is verified successfully]
                return (0, util_1.responseSender)(res, 200, "Your account verified successfully.");
            }
            return (0, util_1.responseSender)(res, 400, "Customer account verification failed. Please try again.");
        }
        catch (err) {
            console.log("Error occured while verifying customer account: ".red, err.message);
            next(err);
        }
    };
    sendPasswordResetRequest = async (req, res, next) => {
        try {
            const customer = await this.customerService.getCustomerByEmail(req.validatedValue.email);
            if (!customer) {
                return (0, util_1.responseSender)(res, 400, "Customer acocunt not found. Please register.");
            }
            const otp = (0, util_1.generateOTP)(this.otpService.config.otpLength);
            const createdOtp = await this.otpService.createOtp(customer.customerId, otp);
            if (!createdOtp) {
                return (0, util_1.responseSender)(res, 400, "Password reset request failed. Please try again.");
            }
            try {
                await this.emailService.sendEmail(customer.email, "Password Reset Request", "reset-password", {
                    otp,
                    expiresInMinutes: this.otpService.config.expiresInMinutes,
                });
                return (0, util_1.responseSender)(res, 200, "Password reset request sent successfully.");
            }
            catch (err) {
                console.log("Error occured while sending password reset request: ".red, err.message);
                next(err);
            }
        }
        catch (err) {
            console.log("Error occured while sending password reset request: ".red, err.message);
            next(err);
        }
    };
    verifyResetPassword = async (req, res, next) => {
        try {
            const fetchedCustomer = await this.customerService.getCustomerByEmail(req.validatedValue.email);
            if (!fetchedCustomer) {
                return (0, util_1.responseSender)(res, 400, "Customer account not found. Please register.");
            }
            const isOtpValid = await this.otpService.verifyOtp(fetchedCustomer.customerId, req.validatedValue.otp);
            if (!isOtpValid) {
                return (0, util_1.responseSender)(res, 400, "Invalid otp. Please try again.");
            }
            const { password, ...authTokenPayload } = fetchedCustomer;
            const authToken = (0, util_1.generateJWTToken)(authTokenPayload);
            return (0, util_1.responseSender)(res, 200, "Otp verified successfully.", {
                customer: authTokenPayload,
                authToken,
            });
        }
        catch (err) {
            console.log("Error occured while verifying reset password: ".red, err.message);
            next(err);
        }
    };
    resetPassword = async (req, res, next) => {
        try {
            const fetchedCustomer = await this.customerService.getCustomerByEmail(req.validatedValue.email);
            if (!fetchedCustomer) {
                return (0, util_1.responseSender)(res, 400, "Customer account not found. Please register.");
            }
            const isUpdated = await this.customerService.resetPassword(req.validatedValue.email, await (0, util_1.hashedPassword)(req.validatedValue.password));
            if (!isUpdated) {
                return (0, util_1.responseSender)(res, 400, "Password update failed. Please try again.");
            }
            const { password, ...authTokenPayload } = fetchedCustomer;
            const authToken = (0, util_1.generateJWTToken)(authTokenPayload);
            return (0, util_1.responseSender)(res, 200, "Password updated successfully.", {
                customer: authTokenPayload,
                authToken,
            });
        }
        catch (err) {
            console.log("Error occured while verifying reset password: ".red, err.message);
            next(err);
        }
    };
    getAllCustomers = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue.searchTerm;
            const searchBy = req.validatedValue.searchBy;
            const verified = req.validatedValue.verified;
            const currentPage = parseInt(req.validatedValue.page || 1);
            const limitPerPage = parseInt(req.validatedValue.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const order = [["createdAt", "DESC"]];
            const filter = {};
            if (verified) {
                filter.verified = verified;
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
            const customers = await this.customerService.getAllCustomers(filter, limitPerPage, offset, order);
            if (!customers.rows) {
                return (0, util_1.responseSender)(res, 400, "Failed to get customers. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Customers fetched successfully.", {
                customers: customers.rows,
                total: customers.count,
                totalPages: Math.ceil(customers.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while getting all customers: ".red, err.message);
            next(err);
        }
    };
}
exports.default = CustomerController;
