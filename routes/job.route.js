"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const job_controller_1 = __importDefault(require("../controller/job.controller"));
const job_middleware_1 = __importDefault(require("../middleware/job.middleware"));
const jobController = new job_controller_1.default();
const jobMiddleware = new job_middleware_1.default();
const authMiddleware = new auth_middleware_1.default();
const jobRouter = express_1.default.Router();
jobRouter.get("/", jobMiddleware.validateFilteringQueries, jobController.getAllJobs);
jobRouter.post("/", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), jobMiddleware.validateJobCreation, jobController.createJob);
jobRouter.put("/", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), jobMiddleware.validateJobEdit, jobController.editJob);
jobRouter.delete("/:jobId", rateLimiter_middleware_1.strictLimiter, authMiddleware.authenticate(["admin"]), jobController.deleteJob);
exports.default = jobRouter;
