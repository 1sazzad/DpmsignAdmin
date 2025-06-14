"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_model_1 = __importDefault(require("../model/client.model"));
class ClientService {
    addClient = async (type, clientLogos) => {
        try {
            const createdClient = await client_model_1.default.create({
                type,
                clientLogos,
            });
            return createdClient ? createdClient.toJSON() : null;
        }
        catch (err) {
            console.log("Error occured while creating client: ".red, err.message);
            throw err;
        }
    };
    editClient = async (clientId, type, clientLogos) => {
        try {
            const client = await client_model_1.default.findByPk(clientId);
            if (client) {
                client.type = type;
                client.clientLogos = clientLogos;
                await client.save();
                return client.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while updating client: ".red, err.message);
            throw err;
        }
    };
    getClientById = async (clientId) => {
        try {
            const client = await client_model_1.default.findByPk(clientId);
            return client ? client.toJSON() : null;
        }
        catch (err) {
            console.log("Error occured while getting client by id: ".red, err.message);
            throw err;
        }
    };
    deleteClient = async (clientId) => {
        try {
            const client = await client_model_1.default.findByPk(clientId);
            if (client) {
                await client.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occured while deleting client by id: ".red, err.message);
            throw err;
        }
    };
    getAllClients = async (filter, limit, offset, order) => {
        try {
            const clients = await client_model_1.default.findAll({
                where: filter,
                limit,
                offset,
                order,
            });
            if (clients) {
                return clients.map((client) => client.toJSON());
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while getting clients: ".red, err.message);
            throw err;
        }
    };
}
exports.default = ClientService;
