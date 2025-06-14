"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DPM Sign API",
            version: "1.0.0",
            description: "API documentation for the DPM Sign application",
        },
        servers: [
            {
                url: "https://test.api.dpmsign.com",
                description: "Production Server",
            },
            {
                url: "http://localhost:4000",
                description: "Development Server",
            },
        ],
        // You can define your components (schemas) here if you want
        // For example, a Product schema might go here.
        components: {
            schemas: {
                Product: {
                    type: "object",
                    properties: {
                        productId: {
                            type: "integer",
                            description: "The product's unique ID",
                        },
                        name: {
                            type: "string",
                            description: "The name of the product",
                        },
                        // ... add other product properties
                    },
                },
            },
        },
    },
    // This is the most important part:
    // It tells swagger-jsdoc to scan all .ts files in your routes folder
    apis: ["./src/routes/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
