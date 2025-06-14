"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blog_model_1 = __importDefault(require("../model/blog.model"));
class BlogService {
    createBlog = async (title, content, bannerImg) => {
        try {
            const createdBlog = await blog_model_1.default.create({
                title,
                content,
                bannerImg,
            });
            return createdBlog ? createdBlog.toJSON() : null;
        }
        catch (err) {
            console.log("Error occured while creating blog: ".red, err.message);
            throw err;
        }
    };
    editBlog = async (blogId, title, content, bannerImg) => {
        try {
            const blog = await blog_model_1.default.findByPk(blogId);
            if (blog) {
                blog.title = title;
                blog.content = content;
                blog.bannerImg = bannerImg;
                await blog.save();
                return blog.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while updating blog by id: ".red, err.message);
            throw err;
        }
    };
    getBlogById = async (blogId) => {
        try {
            const blog = await blog_model_1.default.findByPk(blogId);
            return blog ? blog.toJSON() : null;
        }
        catch (err) {
            console.log("Error occured while getting blog by id: ".red, err.message);
            throw err;
        }
    };
    deleteBlog = async (blogId) => {
        try {
            const blog = await blog_model_1.default.findByPk(blogId);
            if (blog) {
                await blog.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while deleting blog by id: ".red, err.message);
            throw err;
        }
    };
    getAllBlogs = async (filter, limit, offset, order) => {
        try {
            const blogs = await blog_model_1.default.findAndCountAll({
                where: filter,
                limit,
                offset,
                order,
            });
            return {
                rows: blogs.rows.map((blog) => blog.toJSON()),
                count: blogs.count,
            };
        }
        catch (err) {
            console.log("Error occured while getting blogs: ".red, err.message);
            throw err;
        }
    };
}
exports.default = BlogService;
