"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_config_1 = require("./config/dotenv.config");
const sequelize = new sequelize_typescript_1.Sequelize("", dotenv_config_1.dbUser, dotenv_config_1.dbPassword, {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});
(async () => {
    try {
        // Check if the database exists
        const dbExistQueryResult = await sequelize.query(`SHOW DATABASES LIKE '${dotenv_config_1.dbName}'`);
        try {
            if (dbExistQueryResult[0].length === 0) {
                // Create the database if it does not exist
                await sequelize.query(`CREATE DATABASE ${dotenv_config_1.dbName}`);
                console.log(`Database '${dotenv_config_1.dbName}' created successfully!`);
            }
            else {
                console.log(`Database '${dotenv_config_1.dbName}' already exists.`);
            }
            // Close the Sequelize connection
            await sequelize.close();
        }
        catch (err) {
            console.error("Error occurred creating database: ", err.message);
        }
    }
    catch (err) {
        console.error("Error occurred checking database existence: ", err.message);
    }
})();
