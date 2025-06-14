"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const notFoundController = (_req, res, next) => {
    next((0, util_1.responseSender)(res, 404, "The requested content could not be found."));
};
exports.default = notFoundController;
