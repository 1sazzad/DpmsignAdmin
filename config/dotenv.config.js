"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sslCommerzSandbox = exports.sslCommerzStorePassword = exports.sslCommerzStoreId = exports.staticDir = exports.mailServerPassword = exports.mailServerUser = exports.mailServerPort = exports.mailServerHost = exports.jwtExpiresIn = exports.jwtSecret = exports.frontendLandingPageUrl = exports.apiWhitelistedDomains = exports.strictRateLimitMax = exports.strictRateLimitWindow = exports.rateLimitMax = exports.rateLimitWindow = exports.dbConnectionString = exports.dbHost = exports.dbPassword = exports.dbUser = exports.dbName = exports.apiDocsUrl = exports.port = exports.serverUrlPrefix = exports.serverBaseUrl = exports.nodeEnv = void 0;
require("dotenv/config");
const url_join_1 = __importDefault(require("url-join"));
exports.nodeEnv = process.env.NODE_ENV || "development";
exports.serverBaseUrl = (0, url_join_1.default)(`${process.env.SERVER_BASE_URL}:${process.env.SERVER_PORT}`);
exports.serverUrlPrefix = process.env.SERVER_URL_PREFIX || "";
exports.port = process.env.SERVER_PORT || "3000";
exports.apiDocsUrl = process.env.API_DOCS_URL || "";
exports.dbName = exports.nodeEnv === "production"
    ? process.env.PRODUCTION_DB_NAME || ""
    : process.env.DEVELOPMENT_DB_NAME || "";
exports.dbUser = exports.nodeEnv === "production"
    ? process.env.PRODUCTION_DB_USER || ""
    : process.env.DEVELOPMENT_DB_USER || "";
exports.dbPassword = exports.nodeEnv === "production"
    ? process.env.PRODUCTION_DB_PASSWORD || ""
    : process.env.DEVELOPMENT_DB_PASSWORD || "";
exports.dbHost = exports.nodeEnv === "production"
    ? process.env.PRODUCTION_DB_HOST || ""
    : process.env.DEVELOPMENT_DB_HOST || "";
exports.dbConnectionString = exports.nodeEnv === "production"
    ? process.env.PRODUCTION_DB_CONNECTION_STRING || ""
    : process.env.DEVELOPMENT_DB_CONNECTION_STRING || "";
exports.rateLimitWindow = process.env.RATE_LIMIT_WINDOW || "15";
exports.rateLimitMax = process.env.RATE_LIMIT_MAX || "10";
exports.strictRateLimitWindow = process.env.STRICT_RATE_LIMIT_WINDOW || "1";
exports.strictRateLimitMax = process.env.STRICT_RATE_LIMIT_MAX || "10";
exports.apiWhitelistedDomains = process.env.API_WHITELISTED_DOMAINS?.split(" ") || [];
exports.frontendLandingPageUrl = process.env.FRONTEND_LANDING_PAGE_URL || "";
exports.jwtSecret = process.env.JWT_SECRET || "";
exports.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";
exports.mailServerHost = process.env.MAIL_SERVER_HOST || "";
exports.mailServerPort = process.env.MAIL_SERVER_PORT || "";
exports.mailServerUser = process.env.MAIL_SERVER_USER || "";
exports.mailServerPassword = process.env.MAIL_SERVER_PASSWORD || "";
exports.staticDir = process.env.APP_STATIC_DIR || "";
exports.sslCommerzStoreId = process.env.SSL_COMMERZ_STORE_ID || "";
exports.sslCommerzStorePassword = process.env.SSL_COMMERZ_STORE_PASSWORD || "";
exports.sslCommerzSandbox = process.env.SSL_COMMERZ_SANDBOX || "";
