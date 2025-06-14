import { Sequelize } from "sequelize-typescript";
import {
  dbHost,
  dbPort,
  dbName,
  dbUser,
  dbPassword,
  dbDialect,
} from "./dotenv.config";
import path from "path";
import "colors";

export const sequelize = new Sequelize({
  host: dbHost,
  port: parseInt(dbPort),
  database: dbName,
  username: dbUser,
  password: dbPassword,
  dialect: dbDialect as any,
  logging: false, // Set to true if you want to see SQL queries
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  models: [path.resolve(__dirname, "../model")],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log("Database connection authenticated successfully!".green);

    // Sync models with the database
    // In production, you might want to set alter: false
    const syncOptions =
      process.env.NODE_ENV === "development"
        ? { alter: false }
        : { alter: true };

    await sequelize.sync(syncOptions);
    console.log("Database models synced successfully!".green);
  } catch (err: any) {
    console.error("Error initializing database:".red, err.message);
    // In production, you might want to throw the error to crash the app
    if (process.env.NODE_ENV === "production") {
      throw err;
    }
  }
};
