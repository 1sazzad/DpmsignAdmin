import express from "express";
import { createServer } from "http";
import cors from "cors";
import { config } from "dotenv";
import "colors";
import { Server } from "socket.io";

import { initializeDatabase } from "./config/database.config";
import {
  port,
  serverBaseUrl,
  nodeEnv,
  apiDocsUrl,
  apiWhitelistedDomains,
} from "./config/dotenv.config";

// Load environment variables
config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to DPMSign API" });
});

const initializeServer = async () => {
  try {
    // Create HTTP server
    const server = createServer(app);

    // Initialize Socket.IO with CORS settings
    const io = new Server(server, {
      cors: {
        origin: apiWhitelistedDomains,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Socket.IO connection handling
    io.on("connection", (socket) => {
      console.log("A user connected".cyan);

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("User disconnected".grey);
      });

      // Add your socket event handlers here
      // Example:
      // socket.on("chat message", (msg) => {
      //     io.emit("chat message", msg);
      // });
    });

    // Initialize database
    try {
      await initializeDatabase();
    } catch (dbError: any) {
      console.error("Database initialization failed:".red, dbError.message);
      // In production, we might want to exit if DB init fails
      if (nodeEnv === "production") {
        process.exit(1);
      }
    }

    // Start the server
    server.listen(port, () => {
      console.log(
        `✨ Server is running on ${serverBaseUrl} in ${nodeEnv} mode`.green
      );
      if (nodeEnv !== "production") {
        console.log(
          `📚 API Docs available at: ${serverBaseUrl}${apiDocsUrl}`.blue
        );
      }
    });

    // Handle server errors
    server.on("error", (error: Error) => {
      console.error("Server error:".red, error.message);
    });

    // Handle unhandled rejections
    process.on("unhandledRejection", (reason: any) => {
      console.error("Unhandled Rejection:".red, reason);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error: Error) => {
      console.error("Uncaught Exception:".red, error.message);
      // In production, we might want to exit on uncaught exceptions
      if (nodeEnv === "production") {
        process.exit(1);
      }
    });

    return server;
  } catch (error: any) {
    console.error("Failed to initialize server:".red, error.message);
    throw error;
  }
};

// Start the server
initializeServer().catch((error) => {
  console.error("Fatal error during server initialization:".red, error.message);
  process.exit(1);
});

export default initializeServer;
