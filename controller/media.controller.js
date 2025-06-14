"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const media_service_1 = __importDefault(require("../service/media.service"));
const util_1 = require("../util");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_config_1 = require("../config/dotenv.config");
class MediaController {
    mediaService;
    constructor() {
        this.mediaService = new media_service_1.default();
    }
    createMedia = async (req, res, next) => {
        try {
            const fileValidationError = req.fileValidationError;
            if (fileValidationError) {
                return (0, util_1.responseSender)(res, 400, fileValidationError);
            }
            if (req.files.length > 0) {
                for (const image of req.files) {
                    await this.mediaService.createMedia(image.filename);
                }
            }
            return (0, util_1.responseSender)(res, 200, "Media uploaded successfully.");
        }
        catch (err) {
            // cleanup process if database operation failed
            if (req.files && Array.isArray(req.files)) {
                req.files.forEach((file) => {
                    const filePath = path_1.default.join(file.destination, file.filename);
                    fs_1.default.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                        }
                    });
                });
            }
            console.log("Error occured while uploading media image: ".red, err.message);
            next(err);
        }
    };
    deleteMedia = async (req, res, next) => {
        try {
            const mediaId = req.params.mediaId;
            const isMediaExist = await this.mediaService.getMediaById(mediaId);
            if (!isMediaExist) {
                return (0, util_1.responseSender)(res, 404, "Media not found.");
            }
            const isDeleted = await this.mediaService.deleteMedia(mediaId);
            if (!isDeleted) {
                return (0, util_1.responseSender)(res, 500, "Media deletion failed. Please try again.");
            }
            const filePath = path_1.default.join(dotenv_config_1.staticDir, "media-images", isMediaExist.imageName);
            fs_1.default.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                }
            });
            return (0, util_1.responseSender)(res, 200, "Media deleted successfully.");
        }
        catch (err) {
            console.log("Error occures while deleting media image: ".red, err.message);
            next(err);
        }
    };
    getAllMedias = async (req, res, next) => {
        try {
            const medias = await this.mediaService.getAllMedias();
            if (!medias) {
                return (0, util_1.responseSender)(res, 400, "Failed to get medias. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Medias fetched successfully.", {
                medias,
            });
        }
        catch (err) {
            console.log("Error occured while fetching medias: ".red, err.message);
            next(err);
        }
    };
}
exports.default = MediaController;
