"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const multer_1 = __importDefault(require("multer"));
const errorController = (err, _req, res, _next) => {
    console.log("GLOBAL ERROR HANDLER: ".red, err.message);
    if (err instanceof multer_1.default.MulterError) {
        // Handle multer-specific errors
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                return (0, util_1.responseSender)(res, 400, "File size too large!");
            case "LIMIT_UNEXPECTED_FILE":
                return (0, util_1.responseSender)(res, 400, "Unexpected file format!");
            default:
                return (0, util_1.responseSender)(res, 400, err.message);
        }
    }
    (0, util_1.responseSender)(res, 500, "Internal server error occured.");
};
exports.default = errorController;
