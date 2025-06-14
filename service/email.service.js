"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const util_1 = require("../util");
const dotenv_config_1 = require("../config/dotenv.config");
class EmailService {
    sendEmail = async (to, subject, templateName, variables) => {
        const transporter = nodemailer_1.default.createTransport({
            host: dotenv_config_1.mailServerHost,
            port: dotenv_config_1.mailServerPort,
            secure: true,
            auth: {
                user: dotenv_config_1.mailServerUser,
                pass: dotenv_config_1.mailServerPassword,
            },
        });
        const htmlContent = await (0, util_1.loadTemplate)(templateName, variables);
        const mailOptions = {
            from: `"Dhaka Plastic & Metal" <${dotenv_config_1.mailServerUser}>`,
            to,
            subject,
            html: htmlContent,
        };
        try {
            const result = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully. ".green, result.response);
            return result;
        }
        catch (err) {
            console.log(err);
            console.log("Error sending email:".red, err.message);
            throw err;
        }
    };
}
exports.default = EmailService;
