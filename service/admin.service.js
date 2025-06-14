"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_model_1 = __importDefault(require("../model/admin.model"));
class AdminService {
    registerAdmin = async (name, email, phone, password) => {
        try {
            const admin = await admin_model_1.default.create({
                name,
                email,
                phone,
                password,
            }, { returning: true });
            const createdAdmin = await admin_model_1.default.findByPk(admin.adminId);
            if (createdAdmin) {
                return createdAdmin.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while creating admin: ".red, err.message);
            throw err;
        }
    };
    uploadAdminAvatar = async (adminId, avatarPath) => {
        try {
            const admin = await admin_model_1.default.findOne({ where: { adminId } });
            if (admin) {
                admin.avatar = avatarPath;
                await admin.save();
                return admin.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while uploading admin avatar: ".red, err.message);
            throw err;
        }
    };
    getAdminByEmail = async (email) => {
        try {
            const admin = await admin_model_1.default.findOne({ where: { email } });
            if (admin) {
                return admin.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while getting admin by email: ".red, err.message);
            throw err;
        }
    };
    getAllAdmin = async () => {
        try {
            const admins = await admin_model_1.default.findAll();
            if (admins) {
                return admins.map((admin) => admin.toJSON());
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while getting all admins: ".red, err.message);
            throw err;
        }
    };
    updateAdmin = async (email, name, phone, avatar, password) => {
        try {
            const prevTokenVersion = (await admin_model_1.default.findOne({
                where: { email },
                attributes: ["tokenVersion"],
            })) || { tokenVersion: 0 };
            const isUpdated = await admin_model_1.default.update({
                name,
                password,
                phone,
                avatar,
                tokenVersion: prevTokenVersion.tokenVersion + 1,
            }, {
                where: { email },
            });
            if (isUpdated) {
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while updating admin: ".red, err.message);
            throw err;
        }
    };
}
exports.default = AdminService;
