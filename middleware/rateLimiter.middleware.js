"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_config_1 = require("../config/dotenv.config");
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(dotenv_config_1.rateLimitWindow) * 60 * 1000, // 15 minutes
    max: parseInt(dotenv_config_1.rateLimitMax), // Limit each IP to 100 requests per `window` (15 minutes)
    message: {
        status: 429,
        error: "Too many requests from this IP, please try again later.",
    },
    headers: true, // Adds rate limit info in headers
});
exports.strictLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(dotenv_config_1.strictRateLimitWindow) * 60 * 1000, // 1 minute
    max: parseInt(dotenv_config_1.strictRateLimitMax), // Limit each IP to 10 requests per minute
    message: {
        status: 429,
        error: "Too many requests, please slow down.",
    },
    headers: true,
});
