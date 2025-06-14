"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const image_size_1 = __importDefault(require("image-size"));
const uuid_1 = require("uuid");
const dotenv_config_1 = require("../config/dotenv.config");
class ImageUploaderMiddleware {
    uploader = (folderName) => {
        // const uploadDir = path.join(__dirname, `../../public/${folderName}/`);
        const uploadDir = path_1.default.join(dotenv_config_1.staticDir, folderName);
        // Set up storage
        const storage = multer_1.default.diskStorage({
            destination: async (req, file, cb) => {
                try {
                    const isUploadDirExists = fs_1.default.existsSync(uploadDir);
                    if (!isUploadDirExists) {
                        fs_1.default.mkdirSync(uploadDir, { recursive: true });
                    }
                    cb(null, uploadDir);
                }
                catch (err) {
                    console.log("Error occured in image uploader middleware: ".red, err.message);
                    req.fileValidationError =
                        "Could not create the uploads directory!";
                    cb(null, false);
                }
            },
            filename: (req, file, cb) => {
                try {
                    const uniqueSuffix = (0, uuid_1.v4)().toString().replace(/-/gi, "");
                    cb(null, uniqueSuffix + path_1.default.extname(file.originalname)); // Append unique timestamp
                }
                catch (err) {
                    console.log("Error occured in image uploader middleware: ".red, err.message);
                    req.fileValidationError = err.message;
                    cb(null, false);
                }
            },
        });
        // File filter to allow only image files
        const fileFilter = (req, file, cb) => {
            if (file.mimetype.startsWith("image/")) {
                cb(null, true);
            }
            else {
                req.fileValidationError =
                    "Only image files are allowed.";
                cb(null, false);
            }
        };
        return (0, multer_1.default)({
            storage,
            fileFilter,
            limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max file size
        });
    };
    compressImage = async (req, res, next) => {
        try {
            if (!req.file || req.fileValidationError) {
                return next();
            }
            const filePath = req.file.path;
            const imageDimension = (0, image_size_1.default)(filePath);
            const { width: originalWidth, height: originalHeight } = imageDimension;
            // Define maximum dimensions (e.g., 1000px for width or height)
            const MAX_DIMENSION = 1000;
            if (!originalHeight || !originalWidth) {
                return;
            }
            // Calculate new dimensions while maintaining aspect ratio
            let targetWidth, targetHeight;
            if (originalWidth > originalHeight) {
                targetWidth = MAX_DIMENSION;
                targetHeight = Math.round((originalHeight / originalWidth) * MAX_DIMENSION);
            }
            else {
                targetHeight = MAX_DIMENSION;
                targetWidth = Math.round((originalWidth / originalHeight) * MAX_DIMENSION);
            }
            const compressedPath = filePath.replace(/(\.\w+)$/, `-${Math.ceil(Math.random() * 100000)}$1`);
            try {
                await (0, sharp_1.default)(filePath)
                    .resize(targetWidth, targetHeight, {
                    fit: "inside", // Maintain aspect ratio without cropping
                    withoutEnlargement: true, // Prevent enlarging images smaller than MAX_DIMENSION
                })
                    .jpeg({ quality: 95 }) // Adjust quality as needed
                    .toFile(compressedPath);
                // Replace the original file path with the compressed file path
                fs_1.default.unlinkSync(filePath); // Remove uncompressed file
                req.file.path = compressedPath;
                req.file.filename = path_1.default.basename(compressedPath);
            }
            catch (err) {
                console.log("Error compressing image: ".red, err.message);
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
    compressImages = async (req, res, next) => {
        try {
            if (!req.files || req.fileValidationError) {
                return next();
            }
            const files = req.files;
            await Promise.all(files.map(async (file) => {
                const filePath = file.path;
                const imageDimension = (0, image_size_1.default)(filePath);
                const { width: originalWidth, height: originalHeight } = imageDimension;
                // Define maximum dimensions (e.g., 1000px for width or height)
                const MAX_DIMENSION = 1000;
                if (!originalHeight || !originalWidth) {
                    return;
                }
                // Calculate new dimensions while maintaining aspect ratio
                let targetWidth, targetHeight;
                if (originalWidth > originalHeight) {
                    targetWidth = MAX_DIMENSION;
                    targetHeight = Math.round((originalHeight / originalWidth) * MAX_DIMENSION);
                }
                else {
                    targetHeight = MAX_DIMENSION;
                    targetWidth = Math.round((originalWidth / originalHeight) * MAX_DIMENSION);
                }
                const compressedPath = filePath.replace(/(\.\w+)$/, `-${Math.ceil(Math.random() * 100000)}$1`);
                try {
                    await (0, sharp_1.default)(filePath)
                        .resize(targetWidth, targetHeight, {
                        fit: "inside", // Maintain aspect ratio without cropping
                        withoutEnlargement: true, // Prevent enlarging images smaller than MAX_DIMENSION
                    })
                        .jpeg({ quality: 95 }) // Adjust quality as needed
                        .toFile(compressedPath);
                    // Replace the original file path with the compressed file path
                    fs_1.default.unlinkSync(filePath); // Remove uncompressed file
                    file.path = compressedPath;
                    file.filename = path_1.default.basename(compressedPath);
                }
                catch (err) {
                    console.log("Error compressing image: ".red, err.message);
                }
            }));
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
exports.default = ImageUploaderMiddleware;
