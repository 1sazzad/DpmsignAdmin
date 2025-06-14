"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlug = exports.loadTemplate = exports.generateVerificationToken = exports.generateOTP = exports.verifyToken = exports.generateJWTToken = exports.comparePassword = exports.hashedPassword = exports.responseSender = void 0;
exports.generateTransactionId = generateTransactionId;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const dotenv_config_1 = require("../config/dotenv.config");
const slugify_1 = __importDefault(require("slugify"));
const responseSender = (res, status, message, data) => {
    const responseData = {
        status: status,
        message: message,
        data,
    };
    res.header("Content-Type", "application/json");
    res.status(status).json(responseData);
};
exports.responseSender = responseSender;
const hashedPassword = async (password) => {
    const saltRound = 10;
    try {
        return await bcrypt_1.default.hash(password, saltRound);
    }
    catch (err) {
        console.log("Error occured while hashing password: ".red, err.message);
        throw err;
    }
};
exports.hashedPassword = hashedPassword;
const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt_1.default.compare(password, hashedPassword);
    }
    catch (err) {
        console.log("Error occured while comparing password: ".red, err.message);
        throw err;
    }
};
exports.comparePassword = comparePassword;
const generateJWTToken = (payload) => {
    try {
        return jsonwebtoken_1.default.sign(payload, dotenv_config_1.jwtSecret, { expiresIn: dotenv_config_1.jwtExpiresIn });
    }
    catch (err) {
        console.log("Error occured while generating token: ".red, err.message);
        throw err;
    }
};
exports.generateJWTToken = generateJWTToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, dotenv_config_1.jwtSecret);
    }
    catch (err) {
        console.log("Error occured while verifying token: ".red, err.message);
        throw err;
    }
};
exports.verifyToken = verifyToken;
const generateOTP = (length = 6) => {
    if (length < 6)
        length = 6;
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto_1.default.randomInt(0, digits.length); // Get a random index
        otp += digits[randomIndex]; // Append the digit to the OTP
    }
    return otp;
};
exports.generateOTP = generateOTP;
const generateVerificationToken = () => {
    return (0, uuid_1.v4)().toString().replace(/-/gi, "");
};
exports.generateVerificationToken = generateVerificationToken;
const loadTemplate = async (templateName, variables) => {
    try {
        const templatePath = path_1.default.join(__dirname, `../template/${templateName}.ejs`);
        return await ejs_1.default.renderFile(templatePath, variables);
    }
    catch (err) {
        console.log("Error occured while loading email template: ".red, err.message);
        console.log(err.message);
    }
};
exports.loadTemplate = loadTemplate;
const createSlug = (str) => {
    return (0, slugify_1.default)(str, { lower: true });
};
exports.createSlug = createSlug;
function generateTransactionId(withTimestamp = false) {
    const raw = (0, uuid_1.v4)().replace(/-/g, ""); // e.g. "3f1c2b7e8c4a4f9e9d6f2a1b3c4d5e6f"
    return withTimestamp
        ? Date.now().toString() + raw // e.g. "16855678901233f1c2b7e8c4a4f9e9d6f2a1b3c4d5e6f"
        : raw;
}
