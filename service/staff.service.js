"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const staff_model_1 = __importDefault(require("../model/staff.model"));
const server_1 = require("../server");
class StaffService {
    registerStaff = async (name, email, phone, password, role, commissionPercentage, designCharge) => {
        try {
            const staff = await staff_model_1.default.create({
                name,
                email,
                phone,
                password,
                role,
                commissionPercentage,
                designCharge,
                balance: 0,
            });
            const createdStaff = await staff_model_1.default.findByPk(staff.staffId);
            if (createdStaff) {
                return createdStaff.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while creating staff: ".red, err.message);
            throw err;
        }
    };
    uploadStaffAvatar = async (staffId, avatarPath) => {
        try {
            const staff = await staff_model_1.default.findOne({ where: { staffId: staffId } });
            if (staff) {
                await staff_model_1.default.update({ avatar: avatarPath }, { where: { staffId } });
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while uploading staff avatar: ".red, err.message);
            throw err;
        }
    };
    getStaffByEmail = async (email) => {
        try {
            const staff = await staff_model_1.default.findOne({ where: { email } });
            if (staff) {
                return staff.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while getting staff by email: ".red, err.message);
            throw err;
        }
    };
    setStaffOnline = async (staffId) => {
        try {
            const staff = await staff_model_1.default.findOne({ where: { staffId } });
            if (staff) {
                await staff_model_1.default.update({ status: "online" }, { where: { staffId } });
                // emit the event only when the status was offline
                if (staff.status === "offline") {
                    server_1.io.emit("staff-status-updated");
                }
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while setting staff online: ".red, err.message);
            throw err;
        }
    };
    setStaffOffline = async (staffId) => {
        try {
            const staff = await staff_model_1.default.findOne({ where: { staffId } });
            if (staff) {
                await staff_model_1.default.update({ status: "offline" }, { where: { staffId } });
                // emit the event only when the status was online
                if (staff.status === "online") {
                    server_1.io.emit("staff-status-updated");
                }
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while setting staff offline: ".red, err.message);
            throw err;
        }
    };
    getStaffByEmailAndRole = async (email, role) => {
        try {
            const staff = await staff_model_1.default.findOne({ where: { email, role } });
            if (staff) {
                return staff.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while getting staff by role: ".red, err.message);
            throw err;
        }
    };
    getRandomStaff = async () => {
        try {
            // Fetch all online staff first
            const activeStaff = await staff_model_1.default.findAll({
                where: { status: "online" },
            });
            // If active staff exist, pick a random one
            if (activeStaff.length) {
                const randomIndex = Math.floor(Math.random() * activeStaff.length);
                return activeStaff[randomIndex].toJSON();
            }
            // If no active staff, fetch all staff
            const allStaff = await staff_model_1.default.findAll();
            // If no staff exist at all, return null
            if (!allStaff.length) {
                return null;
            }
            // Pick a random staff from all available staff
            const randomIndex = Math.floor(Math.random() * allStaff.length);
            return allStaff[randomIndex].toJSON();
        }
        catch (err) {
            console.log("Error occurred while getting random active staff: ".red, err.message);
            throw err;
        }
    };
    getAllStaff = async (filter, limit, offset, order) => {
        try {
            const staff = await staff_model_1.default.findAndCountAll({
                where: filter,
                limit,
                offset,
                order,
            });
            return {
                rows: staff.rows.map((staffItem) => staffItem.toJSON()),
                count: staff.count,
            };
        }
        catch (err) {
            console.log("Error occures while fetching all staff data. ".red, err.message);
            throw err;
        }
    };
    updateStaff = async (email, name, phone, avatar, password) => {
        try {
            const prevTokenVersion = (await staff_model_1.default.findOne({
                where: { email },
                attributes: ["tokenVersion"],
            })) || { tokenVersion: 0 };
            const isUpdated = await staff_model_1.default.update({
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
            console.log("Error occured while updating staff: ".red, err.message);
            throw err;
        }
    };
    updateStaffProtected = async (name, email, phone, role, commissionPercentage, designCharge) => {
        try {
            const prevTokenVersion = (await staff_model_1.default.findOne({
                where: { email },
                attributes: ["tokenVersion"],
            })) || { tokenVersion: 0 };
            const isUpdated = await staff_model_1.default.update({
                name,
                phone,
                role,
                commissionPercentage,
                designCharge,
                tokenVersion: prevTokenVersion.tokenVersion + 1,
            }, {
                where: {
                    email,
                },
            });
            if (isUpdated) {
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while updating staff: ".red, err.message);
            throw err;
        }
    };
}
exports.default = StaffService;
