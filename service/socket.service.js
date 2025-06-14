"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const staff_service_1 = __importDefault(require("../service/staff.service"));
class SocketService {
    staffService;
    clientId;
    static activeStaff = new Map();
    constructor(clientId) {
        this.staffService = new staff_service_1.default();
        this.clientId = clientId;
    }
    loginStaff = (staffId) => {
        // check if the staffid already has in map
        if (SocketService.activeStaff.has(staffId)) {
            // insert the client id their
            SocketService.activeStaff.get(staffId)?.add(this.clientId);
        }
        else {
            // construct a new map with the socket id as set first value
            SocketService.activeStaff.set(staffId, new Set([this.clientId]));
        }
        this.staffService.setStaffOnline(staffId);
    };
    logoutStaff = (staffId) => {
        if (SocketService.activeStaff.has(staffId)) {
            const clientIds = SocketService.activeStaff.get(staffId);
            if (clientIds) {
                // Remove the current client ID
                clientIds.delete(this.clientId);
                // If no more client IDs are left, mark staff as offline
                if (clientIds.size === 0) {
                    SocketService.activeStaff.delete(staffId);
                    this.staffService.setStaffOffline(staffId);
                }
            }
        }
    };
    disconnectStaff = () => {
        for (const [staffId, clientIds,] of SocketService.activeStaff.entries()) {
            if (clientIds.has(this.clientId)) {
                clientIds.delete(this.clientId); // Remove the clientId from the Set
                // If no more clientIds remain, remove staff from the map and set offline
                if (clientIds.size === 0) {
                    SocketService.activeStaff.delete(staffId);
                    this.staffService.setStaffOffline(staffId);
                }
            }
        }
    };
}
exports.default = SocketService;
