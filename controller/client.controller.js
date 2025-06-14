"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sequelize_1 = require("sequelize");
const client_service_1 = __importDefault(require("../service/client.service"));
const dotenv_config_1 = require("../config/dotenv.config");
class ClientController {
    clientService;
    constructor() {
        this.clientService = new client_service_1.default();
    }
    createClient = async (req, res, next) => {
        try {
            const newClient = {
                type: req.validatedValue.type,
                clientLogos: req.validatedValue.clientLogos,
            };
            const createdClient = await this.clientService.addClient(newClient.type, newClient.clientLogos);
            if (!createdClient) {
                return (0, util_1.responseSender)(res, 400, "Client could not be created");
            }
            return (0, util_1.responseSender)(res, 201, "Client created successfully.", {
                client: createdClient,
            });
        }
        catch (err) {
            console.log("Error occured while creating client: ".red, err.message);
            next(err);
        }
    };
    editClient = async (req, res, next) => {
        try {
            const editedClient = {
                clientId: req.validatedValue.clientId,
                type: req.validatedValue.type,
                clientLogos: req.validatedValue.clientLogos,
            };
            const isClientExist = await this.clientService.getClientById(editedClient.clientId);
            if (!isClientExist) {
                return (0, util_1.responseSender)(res, 400, "Client does not exist");
            }
            const isEditedClient = await this.clientService.editClient(editedClient.clientId, editedClient.type, editedClient.clientLogos);
            if (!isEditedClient) {
                return (0, util_1.responseSender)(res, 400, "Client could not be edited");
            }
            return (0, util_1.responseSender)(res, 200, "Client edited successfully.");
        }
        catch (err) {
            console.log("Error occured while creating client: ".red, err.message);
            next(err);
        }
    };
    deleteClient = async (req, res, next) => {
        try {
            const clientId = req.params.clientId;
            const isClientExist = await this.clientService.getClientById(clientId);
            if (!isClientExist) {
                return (0, util_1.responseSender)(res, 404, "Client not found.");
            }
            if (isClientExist.clientLogos.length > 0) {
                for (const logo of isClientExist.clientLogos) {
                    const filePath = path_1.default.join(dotenv_config_1.staticDir, "media-images", logo);
                    fs_1.default.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr)
                            console.log("Error deleting media image: ".red, unlinkErr.message);
                    });
                }
            }
            const isDeleted = await this.clientService.deleteClient(clientId);
            if (!isDeleted) {
                return (0, util_1.responseSender)(res, 500, "Client deletion failed. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Client deleted successfully.");
        }
        catch (err) {
            console.log("Error occures while deleting client: ".red, err.message);
            next(err);
        }
    };
    getAllClients = async (req, res, next) => {
        try {
            const searchTerm = req.validatedValue.searchTerm;
            const currentPage = parseInt(req.validatedValue.page || 1);
            const limitPerPage = parseInt(req.validatedValue.limit || 20);
            const offset = (currentPage - 1) * limitPerPage;
            const order = [["createdAt", "DESC"]];
            const filter = {};
            if (searchTerm) {
                filter.type = {
                    [sequelize_1.Op.like]: `%${searchTerm}%`,
                };
            }
            const clients = await this.clientService.getAllClients(filter, limitPerPage, offset, order);
            if (!clients) {
                return (0, util_1.responseSender)(res, 400, "Failed to get clients. Please try again.");
            }
            return (0, util_1.responseSender)(res, 200, "Clients fetched successfully.", {
                clients,
            });
        }
        catch (err) {
            console.log("Error occured while fetching clients: ".red, err.message);
            next(err);
        }
    };
}
exports.default = ClientController;
