import express from "express";
import { createServer } from "http";
import cors from "cors";
import { config } from "dotenv";

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

const server = createServer(app);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
