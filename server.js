"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
require("colors");
require("./util/cron-job");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importStar(require("./app/app"));
const url_join_1 = __importDefault(require("url-join"));
const dotenv_config_1 = require("./config/dotenv.config");
const database_config_1 = require("./config/database.config");
const socket_service_1 = __importDefault(require("./service/socket.service"));
const server = http_1.default.createServer(app_1.default);
exports.io = new socket_io_1.Server(server, {
    cors: app_1.corsOptions,
});
const initializeServer = async () => {
    try {
        exports.io.on("connection", (socket) => {
            console.log("A client connected:", socket.id);
            const socketService = new socket_service_1.default(socket.id);
            socket.on("login-staff", socketService.loginStaff);
            socket.on("logout-staff", socketService.logoutStaff);
            socket.on("disconnect", () => {
                console.log("A client disconnected:", socket.id);
                socketService.disconnectStaff();
            });
        });
        await (0, database_config_1.initializeDatabase)();
        try {
            server.listen(dotenv_config_1.port, () => {
                console.log(`Server is running on ${dotenv_config_1.serverBaseUrl} in ${dotenv_config_1.nodeEnv} mode.`
                    .yellow);
                console.log(`API Docs: ${(0, url_join_1.default)(dotenv_config_1.serverBaseUrl, dotenv_config_1.apiDocsUrl)}`.blue);
            });
        }
        catch (err) {
            console.log("Error occured starting the server: ".red, err.message);
        }
    }
    catch (err) {
        console.error("Unable to connect to the database: ".red, err.message);
    }
};
initializeServer();
exports.default = initializeServer;
