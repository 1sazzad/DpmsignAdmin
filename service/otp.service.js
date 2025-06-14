"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otp_model_1 = __importDefault(require("../model/otp.model"));
const sequelize_1 = require("sequelize");
class OtpService {
    config;
    constructor() {
        this.config = {
            expiresInMinutes: 2,
            otpLength: 6,
        };
    }
    createOtp = async (requestId, otp) => {
        try {
            const expiresAt = new Date(Date.now() + this.config.expiresInMinutes * 60 * 1000);
            const newOTP = await otp_model_1.default.create({
                requestId,
                code: otp,
                expiresAt,
                used: false,
            });
            const createdOTP = await otp_model_1.default.findByPk(newOTP.OtpId);
            if (createdOTP) {
                return createdOTP.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while creating otp: ".red, err.message);
            throw err;
        }
    };
    verifyOtp = async (requestId, otp) => {
        try {
            const otpRecord = await otp_model_1.default.findOne({
                where: { requestId, code: otp, used: false },
            });
            if (otpRecord) {
                otpRecord.used = true;
                await otpRecord.save();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while verifying otp: ".red, err.message);
            throw err;
        }
    };
    static cleanupExpiredOtps = async () => {
        try {
            const now = new Date();
            await otp_model_1.default.destroy({
                where: {
                    expiresAt: {
                        [sequelize_1.Op.lt]: now,
                    },
                },
            });
            console.log("Expired OTPs cleaned up successfully.".green);
        }
        catch (error) {
            console.log("Error cleaning up expired OTPs: ".red, error);
        }
    };
}
exports.default = OtpService;
