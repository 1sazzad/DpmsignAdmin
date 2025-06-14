"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blog_service_1 = __importDefault(require("../service/blog.service"));
const util_1 = require("../util");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sequelize_1 = require("sequelize");
const dotenv_config_1 = require("../config/dotenv.config");
class BlogController {
    blogService;
    constructor() {
        this.blogService = new blog_service_1.default();
    }
    createBlog = async (req, res, next) => {
        try {
            const fileValidationError = req.fileValidationError;
            if (fileValidationError) {
                return (0, util_1.responseSender)(res, 400, fileValidationError);
            }
            if (!req.file) {
                return (0, util_1.responseSender)(res, 400, "Please upload a banner image");
            }
            const newBlog = {
                title: req.validatedValue.title,
                content: req.validatedValue.content,
                bannerImg: req.file?.filename && req.file.filename,
            };
            const createdBlog = await this.blogService.createBlog(newBlog.title, newBlog.content, newBlog.bannerImg);
            if (!createdBlog) {
                if (req.file) {
                    const filePath = path_1.default.join(req.file.destination, req.file.filename);
                    fs_1.default.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr)
                            console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                    });
                }
                return (0, util_1.responseSender)(res, 400, "Blog could not be created");
            }
            return (0, util_1.responseSender)(res, 201, "Blog created successfully.", {
                blog: createdBlog,
            });
        }
        catch (err) {
            // If database operation fails, delete the uploaded file
            if (req.file) {
                const filePath = path_1.default.join(req.file.destination, req.file.filename);
                fs_1.default.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr)
                        console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                });
            }
            console.log("Error occured while creating blog: ".red, err.message);
            next(err);
        }
    };
    editBlog = async (req, res, next) => {
        try {
            const fileValidationError = req.fileValidationError;
            if (fileValidationError) {
                return (0, util_1.responseSender)(res, 400, fileValidationError);
            }
            if (!req.file) {
                return (0, util_1.responseSender)(res, 400, "Please upload a banner image");
            }
            const editedBlog = {
                blogId: req.validatedValue.blogId,
                title: req.validatedValue.title,
                content: req.validatedValue.content,
                bannerImg: req.file?.filename && req.file.filename,
            };
            const isBlogExist = await this.blogService.getBlogById(editedBlog.blogId);
            if (!isBlogExist) {
                return (0, util_1.responseSender)(res, 400, "Blog does not exist");
            }
            // remove the previous banner images
            if (isBlogExist.bannerImg) {
                const filePath = path_1.default.join(dotenv_config_1.staticDir, "blog-images", isBlogExist.bannerImg);
                fs_1.default.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr)
                        console.log("Error deleting previous blog banner image: ".red, unlinkErr.message);
                });
            }
            const isEditedBlog = await this.blogService.editBlog(editedBlog.blogId, editedBlog.title, editedBlog.content, editedBlog.bannerImg);
            if (!isEditedBlog) {
                return (0, util_1.responseSender)(res, 400, "Blog could not be edited");
            }
            return (0, util_1.responseSender)(res, 200, "Blog edited successfully.");
        }
        catch (err) {
            // If database operation fails, delete the uploaded file
            if (req.file) {
                const filePath = path_1.default.join(req.file.destination, req.file.filename);
                fs_1.default.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr)
                        console.log("Error deleting uploaded file: ".red, unlinkErr.message);
                });
            }
            console.log("Error occured while creating blog: ".red, err.message);
            next(err);
        }
    };
    deleteBlog = async (req, res, next) => {
        try {
            const blogId = req.params.blogId;
            const isBlogExist = await this.blogService.getBlogById(blogId);
            if (!isBlogExist) {
                return (0, util_1.responseSender)(res, 404, "Blog not found.");
            }
            if (isBlogExist.bannerImg) {
                const filePath = path_1.default.join(dotenv_config_1.staticDir, "blog-images", isBlogExist.bannerImg);
                fs_1.default.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr)
                        console.log("Error deleting blog banner image: ".red, unlinkErr.message);
                });
            }
            const isDeleted = await this.blogService.deleteBlog(blogId);
            if (!isDeleted) {
                return (0, util_1.responseSender)(res, 500, "Blog deletion failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Blog deleted successfully.");
        }
        catch (err) {
            console.log("Error occures while deleting blog: ".red, err.message);
            next(err);
        }
    };
    getAllBlogs = async (req, res, next) => {
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
            const blogs = await this.blogService.getAllBlogs(filter, limitPerPage, offset, order);
            if (!blogs.rows) {
                return (0, util_1.responseSender)(res, 400, "Failed to get blogs. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Blogs fetched successfully.", {
                blogs: blogs.rows,
                total: blogs.count,
                totalPages: Math.ceil(blogs.count / limitPerPage),
                currentPage,
            });
        }
        catch (err) {
            console.log("Error occured while fetching blogs: ".red, err.message);
            next(err);
        }
    };
}
exports.default = BlogController;
