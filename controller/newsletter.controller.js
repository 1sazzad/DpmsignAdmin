"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const newsletter_service_1 = __importDefault(require("../service/newsletter.service"));
const email_service_1 = __importDefault(require("../service/email.service"));
const util_1 = require("../util");
const url_join_1 = __importDefault(require("url-join"));
const sequelize_1 = require("sequelize");
const dotenv_config_1 = require("../config/dotenv.config");
const server_1 = require("../server");
class NewsletterController {
    newsletterService;
    emailService;
    constructor() {
        this.newsletterService = new newsletter_service_1.default();
        this.emailService = new email_service_1.default();
    }
    subscribe = async (req, res, next) => {
        try {
            const email = req.validatedValue.email;
            const isEmailExists = await this.newsletterService.findByEmail(email);
            if (isEmailExists) {
                return (0, util_1.responseSender)(res, 400, "You have already subscribed.");
            }
            const verificationToken = (0, util_1.generateVerificationToken)();
            const newsletter = await this.newsletterService.subscribe(email, verificationToken);
            if (!newsletter) {
                return (0, util_1.responseSender)(res, 500, "Something went wrong. Please try again.");
            }
            try {
                const verificationUrl = (0, url_join_1.default)(dotenv_config_1.serverBaseUrl, dotenv_config_1.serverUrlPrefix, `/newsletter/verify?email=${email}&token=${verificationToken}`);
                const unsubscribeUrl = (0, url_join_1.default)(dotenv_config_1.serverBaseUrl, dotenv_config_1.serverUrlPrefix, `/newsletter/unsubscribe?email=${email}&token=${verificationToken}`);
                // send welcome email
                await this.emailService.sendEmail(email, "Welcome to Dhaka Plastic & Metal Newsletter", "newsletter-subscribe", { email, verificationUrl, unsubscribeUrl });
                // emit the subscribe newsletter event
                server_1.io.emit("subscribe-newsletter");
                return (0, util_1.responseSender)(res, 200, "You have subscribed successfully.");
            }
            catch (err) {
                console.log("Error occured while sending welcome subscription email: "
                    .red, err.message);
                // clean up the database
                await this.newsletterService.deleteByEmail(email);
                next(err);
            }
        }
        catch (err) {
            console.log("Error occured while subscribing newsletter: ".red, err.message);
            next(err);
        }
    };
    verifyEmail = async (req, res, next) => {
        try {
            const email = req.validatedValue.email;
            const verificationToken = req.validatedValue.token;
            const isEmailExists = await this.newsletterService.findByEmail(email);
            if (!isEmailExists) {
                return (0, util_1.responseSender)(res, 400, "You have not subscribed.");
            }
            const isVerified = await this.newsletterService.verifyEmail(email, verificationToken);
            if (isVerified) {
                return (0, util_1.responseSender)(res, 200, "You have verified email.");
            }
            return (0, util_1.responseSender)(res, 400, "Invalid token. Please try again.");
        }
        catch (err) {
            console.log("Error occured while verifying email: ".red, err.message);
            next(err);
        }
    };
    unsubscribe = async (req, res, next) => {
        try {
            const email = req.validatedValue.email;
            const verificationToken = req.validatedValue.token;
            const isEmailExists = await this.newsletterService.findByEmail(email);
            if (!isEmailExists) {
                return (0, util_1.responseSender)(res, 400, "You have not subscribed.");
            }
            const isUnsubscribed = await this.newsletterService.unsubscribe(email, verificationToken);
            if (!isUnsubscribed) {
                return (0, util_1.responseSender)(res, 400, "Invalid token. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "You have unsubscribed successfully.");
        }
        catch (err) {
            console.log("Error occured while unsubscribing newsletter: ".red, err.message);
            next(err);
        }
    };
    getAllSubscriber = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue?.searchTerm;
            const verified = req.validatedValue?.verified;
            const currentPage = parseInt(req.validatedValue?.page || 1);
            const limitPerPage = parseInt(req.validatedValue?.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const order = [["createdAt", "DESC"]];
            const filter = {};
            if (verified) {
                filter.verified = verified;
            }
            if (searchTerm) {
                filter.email = {
                    [sequelize_1.Op.like]: `%${searchTerm}%`,
                };
            }
            const subscribers = await this.newsletterService.getAll(filter, limitPerPage, offset, order);
            if (!subscribers.rows) {
                return (0, util_1.responseSender)(res, 400, "No subscribers found.");
            }
            subscribers.rows.forEach((subscriber) => {
                subscriber.verificationUrl = (0, url_join_1.default)(dotenv_config_1.serverBaseUrl, dotenv_config_1.serverUrlPrefix, `/newsletter/verify?email=${subscriber.email}&token=${subscriber.verificationToken}`);
                subscriber.unsubscribeUrl = (0, url_join_1.default)(dotenv_config_1.serverBaseUrl, dotenv_config_1.serverUrlPrefix, `/newsletter/unsubscribe?email=${subscriber.email}&token=${subscriber.verificationToken}`);
            });
            return (0, util_1.responseSender)(res, 200, "Subscribers fetched successfully.", {
                subscribers: subscribers.rows,
                total: subscribers.count,
                totalPages: Math.ceil(subscribers.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while getting all subscribers: ".red, err.message);
            next(err);
        }
    };
    deleteByEmail = async (req, res, next) => {
        try {
            const email = req.validatedValue.email;
            const isEmailExists = await this.newsletterService.findByEmail(email);
            if (!isEmailExists) {
                return (0, util_1.responseSender)(res, 400, "Email record could not found.");
            }
            const isDeleted = await this.newsletterService.deleteByEmail(email);
            if (!isDeleted) {
                return (0, util_1.responseSender)(res, 400, "Someting went wrong. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Email record deleted successfully.");
        }
        catch (err) {
            console.log("Error occured while deleting a record from newsletter: ".red, err.message);
            next(err);
        }
    };
}
exports.default = NewsletterController;
