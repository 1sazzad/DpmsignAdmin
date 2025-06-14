"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_model_1 = __importDefault(require("../model/job.model"));
class JobService {
    createJob = async (title, content, jobLocation, applicationUrl) => {
        try {
            const createdJob = await job_model_1.default.create({
                title,
                content,
                jobLocation,
                applicationUrl,
            });
            return createdJob ? createdJob.toJSON() : null;
        }
        catch (err) {
            console.log("Error occured while creating job: ".red, err.message);
            throw err;
        }
    };
    editJob = async (jobId, title, content, jobLocation, applicationUrl) => {
        try {
            const job = await job_model_1.default.findByPk(jobId);
            if (job) {
                job.title = title;
                job.content = content;
                job.jobLocation = jobLocation;
                job.applicationUrl = applicationUrl;
                await job.save();
                return job.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while updating job by id: ".red, err.message);
            throw err;
        }
    };
    getJobById = async (jobId) => {
        try {
            const job = await job_model_1.default.findByPk(jobId);
            return job ? job.toJSON() : null;
        }
        catch (err) {
            console.log("Error occured while getting job by id: ".red, err.message);
            throw err;
        }
    };
    deleteJob = async (jobId) => {
        try {
            const job = await job_model_1.default.findByPk(jobId);
            if (job) {
                await job.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while job by id: ".red, err.message);
            throw err;
        }
    };
    getAllJobs = async (filter, limit, offset, order) => {
        try {
            const jobs = await job_model_1.default.findAndCountAll({
                where: filter,
                limit,
                offset,
                order,
            });
            return {
                rows: jobs.rows.map((job) => job.toJSON()),
                count: jobs.count,
            };
        }
        catch (err) {
            console.log("Error occured while getting jobs: ".red, err.message);
            throw err;
        }
    };
}
exports.default = JobService;
