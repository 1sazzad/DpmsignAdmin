"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sequelize_1 = require("sequelize");
const job_service_1 = __importDefault(require("../service/job.service"));
class JobController {
    jobService;
    constructor() {
        this.jobService = new job_service_1.default();
    }
    createJob = async (req, res, next) => {
        try {
            const newJob = {
                title: req.validatedValue.title,
                content: req.validatedValue.content,
                jobLocation: req.validatedValue.jobLocation,
                applicationUrl: req.validatedValue.applicationUrl,
            };
            const createdJob = await this.jobService.createJob(newJob.title, newJob.content, newJob.jobLocation, newJob.applicationUrl);
            if (!createdJob) {
                if (req.file) {
                    const filePath = path_1.default.join(req.file.destination, req.file.filename);
                    fs_1.default.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr)
                            console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                    });
                }
                return (0, util_1.responseSender)(res, 400, "Job could not be created");
            }
            return (0, util_1.responseSender)(res, 201, "Job created successfully.", {
                job: createdJob,
            });
        }
        catch (err) {
            console.log("Error occured while creating job: ".red, err.message);
            next(err);
        }
    };
    editJob = async (req, res, next) => {
        try {
            const editedJob = {
                jobId: req.validatedValue.jobId,
                title: req.validatedValue.title,
                content: req.validatedValue.content,
                jobLocation: req.validatedValue.jobLocation,
                applicationUrl: req.validatedValue.applicationUrl,
            };
            const isJobExist = await this.jobService.getJobById(editedJob.jobId);
            if (!isJobExist) {
                return (0, util_1.responseSender)(res, 400, "Job does not exist");
            }
            const isEditedJob = await this.jobService.editJob(editedJob.jobId, editedJob.title, editedJob.content, editedJob.jobLocation, editedJob.applicationUrl);
            if (!isEditedJob) {
                return (0, util_1.responseSender)(res, 400, "Job could not be edited");
            }
            return (0, util_1.responseSender)(res, 200, "Job edited successfully.");
        }
        catch (err) {
            console.log("Error occured while creating Job: ".red, err.message);
            next(err);
        }
    };
    deleteJob = async (req, res, next) => {
        try {
            const jobId = req.params.jobId;
            const isJobExist = await this.jobService.getJobById(jobId);
            if (!isJobExist) {
                return (0, util_1.responseSender)(res, 404, "Job not found.");
            }
            const isDeleted = await this.jobService.deleteJob(jobId);
            if (!isDeleted) {
                return (0, util_1.responseSender)(res, 500, "Job deletion failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Job deleted successfully.");
        }
        catch (err) {
            console.log("Error occures while deleting job: ".red, err.message);
            next(err);
        }
    };
    getAllJobs = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue.searchTerm;
            const currentPage = parseInt(req.validatedValue.page || 1);
            const limitPerPage = parseInt(req.validatedValue.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const order = [["createdAt", "DESC"]];
            const filter = {};
            if (searchTerm) {
                filter.title = {
                    [sequelize_1.Op.like]: `%${searchTerm}%`,
                };
            }
            const jobs = await this.jobService.getAllJobs(filter, limitPerPage, offset, order);
            if (!jobs.rows) {
                return (0, util_1.responseSender)(res, 400, "Failed to get jobs. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Jobs fetched successfully.", {
                jobs: jobs.rows,
                total: jobs.count,
                totalPages: Math.ceil(jobs.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while fetching jobs: ".red, err.message);
            next(err);
        }
    };
}
exports.default = JobController;
