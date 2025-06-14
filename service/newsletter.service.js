"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const newsletter_model_1 = __importDefault(require("../model/newsletter.model"));
class NewsletterService {
    subscribe = async (email, verificationToken) => {
        try {
            const newsletter = await newsletter_model_1.default.create({
                email,
                verified: false,
                verificationToken,
            });
            const createdNewsletter = await newsletter_model_1.default.findByPk(newsletter.newsletterId);
            if (createdNewsletter) {
                return createdNewsletter.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while subscribing newsletter: ".red, err.message);
            throw err;
        }
    };
    verifyEmail = async (email, verificationToken) => {
        try {
            const newsletter = await newsletter_model_1.default.findOne({
                where: { email, verificationToken },
            });
            if (newsletter) {
                newsletter.verified = true;
                await newsletter.save();
                return newsletter.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while verifying email: ".red, err.message);
            throw err;
        }
    };
    unsubscribe = async (email, verificationToken) => {
        try {
            const newsletter = await newsletter_model_1.default.findOne({
                where: { email, verificationToken },
            });
            if (newsletter) {
                await newsletter.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while unsubscribing newsletter: ".red, err.message);
            throw err;
        }
    };
    findByEmail = async (email) => {
        try {
            const newsletter = await newsletter_model_1.default.findOne({ where: { email } });
            if (newsletter) {
                return newsletter.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while getting newsletter by email: ".red, err.message);
            throw err;
        }
    };
    getAll = async (filter, limit, offset, order) => {
        try {
            const newsletters = await newsletter_model_1.default.findAndCountAll({
                where: filter,
                limit,
                offset,
                order,
            });
            return {
                rows: newsletters.rows.map((newsletter) => newsletter.toJSON()),
                count: newsletters.count,
            };
        }
        catch (err) {
            console.log("Error occured while getting all newsletters: ".red, err.message);
            throw err;
        }
    };
    deleteByEmail = async (email) => {
        try {
            const newsletter = await newsletter_model_1.default.findOne({
                where: { email },
            });
            if (newsletter) {
                await newsletter.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while deleting a record from newsletter: ".red, err.message);
            throw err;
        }
    };
}
exports.default = NewsletterService;
