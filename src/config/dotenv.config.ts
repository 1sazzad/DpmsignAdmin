import "dotenv/config";

export const nodeEnv: string = process.env.NODE_ENV || "development";
export const serverBaseUrl: string =
  process.env.API_URL || "http://localhost:5000";
export const port: string = process.env.PORT || "5000";
export const apiDocsUrl: string = process.env.API_DOCS_URL || "/api-docs";

// Database Configuration
export const dbHost: string = process.env.DB_HOST || "localhost";
export const dbPort: string = process.env.DB_PORT || "3306";
export const dbName: string = process.env.DB_NAME || "dpmswgtf_db";
export const dbUser: string = process.env.DB_USER || "root";
export const dbPassword: string = process.env.DB_PASSWORD || "";
export const dbDialect: string = process.env.DB_DIALECT || "mysql";

// Database connection strings (if needed)
export const dbConnectionString: string =
  nodeEnv === "production"
    ? process.env.PRODUCTION_DB_CONNECTION_STRING || ""
    : process.env.DEVELOPMENT_DB_CONNECTION_STRING || "";

// Rate limiting
export const rateLimitWindow: string = process.env.RATE_LIMIT_WINDOW || "15";
export const rateLimitMax: string = process.env.RATE_LIMIT_MAX || "10";
export const strictRateLimitWindow: string =
  process.env.STRICT_RATE_LIMIT_WINDOW || "1";
export const strictRateLimitMax: string =
  process.env.STRICT_RATE_LIMIT_MAX || "10";

// CORS and security
export const apiWhitelistedDomains: string[] =
  process.env.API_WHITELISTED_DOMAINS?.split(" ") || [];
export const frontendLandingPageUrl: string =
  process.env.FRONTEND_LANDING_PAGE_URL || "http://localhost:3000";

// Authentication
export const jwtSecret: string =
  process.env.JWT_SECRET || "your-default-secret-key-change-in-production";
export const jwtExpiresIn: string = process.env.JWT_EXPIRES_IN || "1d";

// Mail configuration
export const mailServerHost: string =
  process.env.MAIL_SERVER_HOST || "smtp.gmail.com";
export const mailServerPort: string = process.env.MAIL_SERVER_PORT || "587";
export const mailServerUser: string = process.env.MAIL_SERVER_USER || "";
export const mailServerPassword: string =
  process.env.MAIL_SERVER_PASSWORD || "";

// Static files
export const staticDir: string = process.env.APP_STATIC_DIR || "public";

// Payment gateway
export const sslCommerzStoreId: string = process.env.SSL_COMMERZ_STORE_ID || "";
export const sslCommerzStorePassword: string =
  process.env.SSL_COMMERZ_STORE_PASSWORD || "";
export const sslCommerzSandbox: string =
  process.env.SSL_COMMERZ_SANDBOX || "true";
