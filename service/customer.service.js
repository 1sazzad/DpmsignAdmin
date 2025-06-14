"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_model_1 = __importDefault(require("../model/customer.model"));
class CustomerService {
    registerCustomer = async (name, email, password, phone, verificationToken) => {
        try {
            const customer = await customer_model_1.default.create({
                name,
                email,
                password,
                phone,
                billingAddress: "",
                shippingAddress: "",
                verified: false,
                verificationToken,
            });
            const createdCustomer = await customer_model_1.default.findByPk(customer.customerId);
            if (createdCustomer) {
                return createdCustomer.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while registering customer: ".red, err.message);
            throw err;
        }
    };
    updateCustomer = async (name, email, phone, billingAddress, shippingAddress, password) => {
        try {
            const prevTokenVersion = (await customer_model_1.default.findOne({
                where: { email },
                attributes: ["tokenVersion"],
            })) || { tokenVersion: 0 };
            const isUpdated = await customer_model_1.default.update({
                name,
                password,
                phone,
                billingAddress,
                shippingAddress,
                tokenVersion: prevTokenVersion.tokenVersion + 1,
            }, {
                where: { email },
            });
            if (isUpdated) {
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while registering customer: ".red, err.message);
            throw err;
        }
    };
    getCustomerByEmail = async (email) => {
        try {
            const customer = await customer_model_1.default.findOne({ where: { email } });
            if (customer) {
                return customer.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while getting customer by email: ".red, err.message);
            throw err;
        }
    };
    getCustomerById = async (customerId) => {
        try {
            const customer = await customer_model_1.default.findByPk(customerId);
            if (customer) {
                return customer.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while getting customer by id: ".red, err.message);
            throw err;
        }
    };
    verifyCustomerAccount = async (email) => {
        try {
            const customer = await customer_model_1.default.update({ verified: true }, { where: { email } });
            if (customer) {
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while verifying customer account: ".red, err.message);
            throw err;
        }
    };
    deleteCustomer = async (email) => {
        try {
            const customer = await customer_model_1.default.findOne({ where: { email } });
            if (customer) {
                await customer.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while deleting customer: ".red, err.message);
            throw err;
        }
    };
    resetPassword = async (email, password) => {
        try {
            const prevTokenVersion = (await customer_model_1.default.findOne({
                where: { email },
                attributes: ["tokenVersion"],
            })) || { tokenVersion: 0 };
            const isUpdated = await customer_model_1.default.update({
                password,
                tokenVersion: prevTokenVersion.tokenVersion + 1,
            }, {
                where: { email },
            });
            if (isUpdated) {
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occures while reseting customer's password: ".red, err.message);
            throw err;
        }
    };
    getAllCustomers = async (filter, limit, offset, order) => {
        try {
            const customers = await customer_model_1.default.findAll({
                where: filter,
                limit,
                offset,
                order,
            });
            const count = await customer_model_1.default.count({ where: filter });
            return {
                rows: customers.map((customer) => customer.toJSON()),
                count,
            };
        }
        catch (err) {
            console.log("Error occures while fetching all customers data. ".red, err.message);
            throw err;
        }
    };
}
exports.default = CustomerService;
