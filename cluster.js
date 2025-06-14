"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const server_1 = __importDefault(require("./server"));
if (cluster_1.default.isMaster) {
    const numCPUs = os_1.default.cpus().length;
    console.log(`Master process is running (PID: ${process.pid})`.blue);
    console.log(`Forking ${numCPUs} workers...`.blue);
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    // Log worker events
    cluster_1.default.on("exit", (worker, _code, _signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`.red);
        cluster_1.default.fork();
    });
    cluster_1.default.on("online", (worker) => {
        console.log(`Worker ${worker.process.pid} is online`.blue);
    });
}
else {
    // Start worker logic
    (0, server_1.default)();
}
