"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_config_1 = require("./dotenv.config");
const path_1 = __importDefault(require("path"));
exports.sequelize = new sequelize_typescript_1.Sequelize(dotenv_config_1.dbConnectionString, {
    dialect: "mysql",
    logging: false, // Set to true if you want to see SQL queries
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    models: [path_1.default.resolve(__dirname, "../model")],
});
// export const initializeDatabase = async () => {
// 	try {
// 		await sequelize.authenticate();
// 		// Sync models after database creation
// 		await sequelize.sync({ alter: true });
// 		console.log("Database synced successfully!".green);
// 	} catch (err: any) {
// 		console.error("Error initializing database: ".red, err.message);
// 	}
// };
const initializeDatabase = async () => {
    try {
        await exports.sequelize.authenticate(); // Sync models after database creation
        await exports.sequelize.sync({ alter: true }); // <--- COMMENT OUT THIS LINE
        console.log("Database connection authenticated successfully!".green); // You can change this message
    }
    catch (err) {
        console.error("Error initializing database: ".red, err.message);
    }
};
exports.initializeDatabase = initializeDatabase;
