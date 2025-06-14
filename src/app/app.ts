import express from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "../config/swagger.config";

import {
  apiDocsUrl,
  apiWhitelistedDomains,
  staticDir,
  nodeEnv,
} from "../config/dotenv.config";
import { responseSender } from "../util";

// Route imports
import adminRouter from "../routes/admin.route";
import authRouter from "../routes/auth.route";
import blogRouter from "../routes/blog.route";
import cartRouter from "../routes/cart.route";
import clientRouter from "../routes/client.route";
import couponRouter from "../routes/coupon.route";
import courierRouter from "../routes/courier.route";
import customerRouter from "../routes/customer.route";
import errorController from "../controller/error.controller";
import faqRouter from "../routes/faq.route";
import inqueryRouter from "../routes/inquery.route";
import jobRouter from "../routes/job.route";
import mediaRouter from "../routes/media.route";
import newsletterRouter from "../routes/newsletter.route";
import notFoundController from "../controller/notFound.controller";
import orderRouter from "../routes/order.route";
import productCategoryRouter from "../routes/product-category.route";
import productReviewRouter from "../routes/product-review.route";
import productRouter from "../routes/product.route";
import staffRouter from "../routes/staff.route";
import transactionRouter from "../routes/transaction.route";

const app = express();
const serverUrlPrefix = "/api/v1";

// CORS configuration
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || apiWhitelistedDomains.includes(origin)) {
      callback(null, true);
    } else {
      // Log blocked origins in development
      if (nodeEnv === "development") {
        console.log("Blocked origin:", origin);
      }
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  maxAge: 86400, // 24 hours CORS preflight cache
};

// Basic security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "blob:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors(corsOptions));
app.use(compression());

// Request parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
app.use(morgan(nodeEnv === "development" ? "dev" : "combined"));

// Static files configuration
app.use("/static", (_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Disposition", "inline");
  next();
});
app.use("/static", express.static(staticDir));

// API Documentation
if (nodeEnv !== "production") {
  app.use(apiDocsUrl, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
}

// Health check routes
app.get(`${serverUrlPrefix}/`, (_req, res) => {
  responseSender(res, 200, "OK");
});

app.get(`${serverUrlPrefix}/health`, (_req, res) => {
  responseSender(res, 200, "API is running.");
});

// API Routes
app.use(`${serverUrlPrefix}/admin`, adminRouter);
app.use(`${serverUrlPrefix}/auth`, authRouter);
app.use(`${serverUrlPrefix}/blog`, blogRouter);
app.use(`${serverUrlPrefix}/cart`, cartRouter);
app.use(`${serverUrlPrefix}/client`, clientRouter);
app.use(`${serverUrlPrefix}/coupon`, couponRouter);
app.use(`${serverUrlPrefix}/courier`, courierRouter);
app.use(`${serverUrlPrefix}/customer`, customerRouter);
app.use(`${serverUrlPrefix}/faq`, faqRouter);
app.use(`${serverUrlPrefix}/inquery`, inqueryRouter);
app.use(`${serverUrlPrefix}/job`, jobRouter);
app.use(`${serverUrlPrefix}/media`, mediaRouter);
app.use(`${serverUrlPrefix}/newsletter`, newsletterRouter);
app.use(`${serverUrlPrefix}/order`, orderRouter);
app.use(`${serverUrlPrefix}/product-category`, productCategoryRouter);
app.use(`${serverUrlPrefix}/product-review`, productReviewRouter);
app.use(`${serverUrlPrefix}/product`, productRouter);
app.use(`${serverUrlPrefix}/staff`, staffRouter);
app.use(`${serverUrlPrefix}/transaction`, transactionRouter);

// Error handling
app.use(notFoundController);
app.use(errorController);

export default app;
