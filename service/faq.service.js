"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faq_model_1 = __importDefault(require("../model/faq.model"));
const faq_item_model_1 = __importDefault(require("../model/faq-item.model"));
class FaqService {
    createNewFaq = async (faqTitle) => {
        try {
            const faq = await faq_model_1.default.create({
                faqTitle,
            });
            return faq ? faq.toJSON() : null;
        }
        catch (err) {
            console.log("Error occurred while creating new faq: ".red, err.message);
            throw err;
        }
    };
    createNewFaqItem = async (faqId, question, answer) => {
        try {
            const faqItem = await faq_item_model_1.default.create({
                faqId,
                question,
                answer,
            });
            const createdFaqItem = await faq_item_model_1.default.findByPk(faqItem.faqItemId);
            return createdFaqItem ? createdFaqItem.toJSON() : null;
        }
        catch (err) {
            console.log("Error occurred while creating new faq question: ".red, err.message);
            throw err;
        }
    };
    // Remove a faq item
    removeFaqItem = async (faqItemId) => {
        try {
            const item = await faq_model_1.default.findByPk(faqItemId);
            if (item) {
                await item.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error while deleting faq item: ".red, err.message);
            throw err;
        }
    };
    // Update faq details
    updateFaq = async (faqId, faqTitle, faqItems) => {
        try {
            // Update faq
            const [updatedRows] = await faq_model_1.default.update({ faqTitle }, { where: { faqId } });
            if (!updatedRows) {
                return false;
            }
            // Update or create faq items
            for (const item of faqItems) {
                if (item.faqItemId) {
                    // Update existing faq item
                    await faq_item_model_1.default.update({
                        question: item.question,
                        answer: item.answer,
                    }, {
                        where: {
                            faqItemId: item.faqItemId,
                            faqId,
                        },
                    });
                }
                else {
                    // Create new faq item
                    await faq_item_model_1.default.create({
                        question: item.question,
                        answer: item.question,
                        faqId,
                    });
                }
            }
            // clean up the table removing unnecassary item
            const faqItemsInDb = await this.getAllFaqItems(faqId);
            if (faqItemsInDb) {
                for (const item of faqItemsInDb) {
                    if (!faqItems.some((faqItem) => faqItem.question === item.question)) {
                        // delete the item
                        await this.deleteFaqItemById(item.faqItemId);
                    }
                }
            }
            return true;
        }
        catch (err) {
            console.log("Error while updating faq: ".red, err.message);
            throw err;
        }
    };
    // Delete a faq (also deletes related items)
    deleteFaq = async (faqId) => {
        try {
            const faq = await faq_model_1.default.findByPk(faqId);
            if (faq) {
                await faq.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error while deleting faq: ".red, err.message);
            throw err;
        }
    };
    deleteFaqItemById = async (faqItemId) => {
        try {
            const faqItem = await faq_item_model_1.default.findByPk(faqItemId);
            if (faqItem) {
                await faqItem.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error while deleting faqItem: ".red, err.message);
            throw err;
        }
    };
    getFaqById = async (faqId) => {
        try {
            const faq = await faq_model_1.default.findByPk(faqId, {
                include: [{ model: faq_item_model_1.default, as: "faqItems", separate: true }],
            });
            return faq ? faq.toJSON() : null;
        }
        catch (err) {
            console.log("Error occurred while fetching faq by id: ".red, err.message);
            throw err;
        }
    };
    getAllFaq = async (filter = {}, limit, offset, order) => {
        try {
            const faqs = await faq_model_1.default.findAll({
                where: filter,
                limit,
                offset,
                order,
                include: [
                    {
                        model: faq_item_model_1.default,
                        as: "faqItems",
                        separate: true,
                    },
                ],
            });
            const count = await faq_model_1.default.count({ where: filter });
            return {
                rows: faqs.map((faq) => faq.toJSON()),
                count,
            };
        }
        catch (err) {
            console.log("Error occurred while fetching all faqs: ".red, err.message);
            throw err;
        }
    };
    getAllFaqItems = async (faqId) => {
        try {
            const faqItems = await faq_item_model_1.default.findAll({
                where: {
                    faqId,
                },
            });
            if (faqItems) {
                return faqItems.map((faqItem) => faqItem.toJSON());
            }
            return null;
        }
        catch (err) {
            console.log("Error occurred while fetching all faq items: ".red, err.message);
            throw err;
        }
    };
}
exports.default = FaqService;
