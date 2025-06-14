"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const faq_controller_1 = __importDefault(require("../controller/faq.controller"));
const faq_middleware_1 = __importDefault(require("../middleware/faq.middleware"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const faqController = new faq_controller_1.default();
const faqMiddleware = new faq_middleware_1.default();
const authMiddleware = new auth_middleware_1.default();
const faqRouter = express_1.default.Router();
faqRouter.post("/create", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), faqMiddleware.validateFaqCreation, faqController.createNewFaq);
faqRouter.get("/", authMiddleware.authenticate(["admin"]), faqMiddleware.validateFilteringQueries, faqController.getAllFaq);
faqRouter.put("/", authMiddleware.authenticate(["admin"]), faqMiddleware.validateFaqEdit, faqController.updateFaq);
exports.default = faqRouter;
