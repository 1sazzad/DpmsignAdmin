"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const imageUploader_middleware_1 = __importDefault(require("../middleware/imageUploader.middleware"));
const media_controller_1 = __importDefault(require("../controller/media.controller"));
const mediaController = new media_controller_1.default();
const authMiddleware = new auth_middleware_1.default();
const mediaUploader = new imageUploader_middleware_1.default();
const mediaRouter = express_1.default.Router();
mediaRouter.get("/", authMiddleware.authenticate(["admin"]), mediaController.getAllMedias);
mediaRouter.post("/", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), mediaUploader.uploader("media-images").array("media-images", 20), mediaUploader.compressImages, mediaController.createMedia);
mediaRouter.delete("/:mediaId", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), mediaController.deleteMedia);
exports.default = mediaRouter;
