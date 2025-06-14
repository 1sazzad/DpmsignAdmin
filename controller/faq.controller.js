"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faq_service_1 = __importDefault(require("../service/faq.service"));
const util_1 = require("../util");
const sequelize_1 = require("sequelize");
class FaqController {
    faqService;
    constructor() {
        this.faqService = new faq_service_1.default();
    }
    createNewFaq = async (req, res, next) => {
        try {
            const createdFaq = await this.faqService.createNewFaq(req.validatedValue.faqTitle);
            if (!createdFaq) {
                return (0, util_1.responseSender)(res, 500, "Something went wrong. Please try again.");
            }
            try {
                for (const faqItem of req.validatedValue.faqItems) {
                    await this.faqService.createNewFaqItem(createdFaq.faqId, faqItem.question, faqItem.answer);
                }
                const newFaq = await this.faqService.getFaqById(createdFaq.faqId);
                return (0, util_1.responseSender)(res, 200, "Faq created successfully.", {
                    faq: newFaq,
                });
            }
            catch (err) {
                console.log("Error occures while creating new faq in controller: ".red, err.message);
                next(err);
            }
        }
        catch (err) {
            console.log("Error occures while creating new faq in controller: ".red, err.message);
            next(err);
        }
    };
    updateFaq = async (req, res, next) => {
        try {
            const { faqId, faqTitle, faqItems } = req.validatedValue;
            // Update the faq
            const isUpdated = await this.faqService.updateFaq(faqId, faqTitle, faqItems);
            if (!isUpdated) {
                return (0, util_1.responseSender)(res, 500, "Failed to update faq. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "FAQ updated successfully.");
        }
        catch (err) {
            console.log("Error occurred while updating faq in controller: ".red, err.message);
            next(err);
        }
    };
    getAllFaq = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue.searchTerm;
            const currentPage = parseInt(req.validatedValue.page || 1);
            const limitPerPage = parseInt(req.validatedValue.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const filter = {};
            if (searchTerm) {
                filter.faqTitle = {
                    [sequelize_1.Op.like]: `%${searchTerm}%`,
                };
            }
            const faqs = await this.faqService.getAllFaq(filter, limitPerPage, offset);
            if (!faqs.rows) {
                return (0, util_1.responseSender)(res, 400, "Cannot find faqs. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Faq fetched successfully.", {
                faqs: faqs.rows,
                total: faqs.count,
                totalPages: Math.ceil(faqs.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occures while getting all faq in controller: ".red, err.message);
            next(err);
        }
    };
}
exports.default = FaqController;
