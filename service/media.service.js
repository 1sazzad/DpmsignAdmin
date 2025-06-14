"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const media_model_1 = __importDefault(require("../model/media.model"));
class MediaService {
    createMedia = async (imageName) => {
        try {
            const media = await media_model_1.default.create({ imageName });
            return media ? media.toJSON() : null;
        }
        catch (err) {
            console.log("Error occurred while creating media image: ".red, err.message);
            throw err;
        }
    };
    getMediaById = async (mediaId) => {
        try {
            const media = await media_model_1.default.findByPk(mediaId);
            return media ? media.toJSON() : null;
        }
        catch (err) {
            console.log("Error occurred while fetching media by id: ".red, err.message);
            throw err;
        }
    };
    deleteMedia = async (mediaId) => {
        try {
            const media = await media_model_1.default.findByPk(mediaId);
            if (media) {
                await media.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occurred while deleting media by id: ".red, err.message);
            throw err;
        }
    };
    getAllMedias = async () => {
        try {
            const medias = await media_model_1.default.findAll();
            if (medias) {
                return medias.map((media) => media.toJSON());
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while getting medias: ".red, err.message);
            throw err;
        }
    };
}
exports.default = MediaService;
