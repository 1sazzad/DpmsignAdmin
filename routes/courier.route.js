"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const courier_middleware_1 = __importDefault(require("../middleware/courier.middleware"));
const courier_controller_1 = __importDefault(require("../controller/courier.controller"));
const courierMiddleware = new courier_middleware_1.default();
const courierController = new courier_controller_1.default();
const authMiddleware = new auth_middleware_1.default();
const courierRouter = express_1.default.Router();
courierRouter.get("/", 
// authMiddleware.authenticate(["admin", "customer"]),
courierMiddleware.validateFilteringQueries, courierController.getAllCourier);
courierRouter.post("/add", rateLimiter_middleware_1.strictLimiter, courierMiddleware.validateCourierCreation, courierController.addCourier);
courierRouter.put("/", rateLimiter_middleware_1.strictLimiter, courierMiddleware.validateCourierEdit, courierController.editCourier);
courierRouter.delete("/:courierId", authMiddleware.authenticate(["admin"]), courierMiddleware.validateCourierDeletion, courierController.deleteCourier);
exports.default = courierRouter;
