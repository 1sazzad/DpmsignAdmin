"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = exports.allowedOrigins = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = __importDefault(require("../config/swagger.config"));
const dotenv_config_1 = require("../config/dotenv.config");
const util_1 = require("../util");
const admin_route_1 = __importDefault(require("../routes/admin.route"));
const notFound_controller_1 = __importDefault(require("../controller/notFound.controller"));
const error_controller_1 = __importDefault(require("../controller/error.controller"));
const staff_route_1 = __importDefault(require("../routes/staff.route"));
const newsletter_route_1 = __importDefault(require("../routes/newsletter.route"));
const inquery_route_1 = __importDefault(require("../routes/inquery.route"));
const customer_route_1 = __importDefault(require("../routes/customer.route"));
const faq_route_1 = __importDefault(require("../routes/faq.route"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const product_category_route_1 = __importDefault(require("../routes/product-category.route"));
const product_route_1 = __importDefault(require("../routes/product.route"));
const product_review_route_1 = __importDefault(require("../routes/product-review.route"));
const coupon_route_1 = __importDefault(require("../routes/coupon.route"));
const order_route_1 = __importDefault(require("../routes/order.route"));
const media_route_1 = __importDefault(require("../routes/media.route"));
const blog_route_1 = __importDefault(require("../routes/blog.route"));
const job_route_1 = __importDefault(require("../routes/job.route"));
const client_route_1 = __importDefault(require("../routes/client.route"));
const cart_route_1 = __importDefault(require("../routes/cart.route"));
const courier_route_1 = __importDefault(require("../routes/courier.route"));
const transaction_route_1 = __importDefault(require("../routes/transaction.route"));
const app = (0, express_1.default)();
exports.allowedOrigins = dotenv_config_1.apiWhitelistedDomains;
exports.corsOptions = {
    origin: (origin, callback) => {
        console.log("Incoming request origin:", origin);
        if (!origin || exports.allowedOrigins?.includes(origin)) {
            callback(null, true); // Allow the origin
        }
        else {
            callback(new Error("Not allowed by CORS")); // Reject the origin
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(cors(corsOptions));
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/static", (_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Content-Disposition", "inline"); // Ensure correct file handling
    next();
});
app.use("/static", express_1.default.static(dotenv_config_1.staticDir));
// Swagger UI setup
app.use(dotenv_config_1.apiDocsUrl, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.default));
// ping route to check the api heartbeat
app.get(`${dotenv_config_1.serverUrlPrefix}/`, (req, res) => {
    (0, util_1.responseSender)(res, 200, "OK");
});
// health check
app.get(`${dotenv_config_1.serverUrlPrefix}/health`, (req, res) => {
    (0, util_1.responseSender)(res, 200, "API is running.");
});
// restrict disallowed origin request
// app.use((req, res, next) => {
// 	const origin = req.get("Origin");
// 	// Allow health check route
// 	if (req.path === `${serverUrlPrefix}/health`) {
// 		return next();
// 	}
// 	// Block requests without an Origin header or with an invalid Origin
// 	if (!origin || !allowedOrigins.includes(origin)) {
// 		return responseSender(res, 403, "Access forbidden");
// 	}
// 	next();
// });
// auth routes
app.use(`${dotenv_config_1.serverUrlPrefix}/auth`, auth_route_1.default);
// admin routes
app.use(`${dotenv_config_1.serverUrlPrefix}/admin`, admin_route_1.default);
// staff routes
app.use(`${dotenv_config_1.serverUrlPrefix}/staff`, staff_route_1.default);
// newsletter routes
app.use(`${dotenv_config_1.serverUrlPrefix}/newsletter`, newsletter_route_1.default);
// inquery routes
app.use(`${dotenv_config_1.serverUrlPrefix}/inquery`, inquery_route_1.default);
// customer routes
app.use(`${dotenv_config_1.serverUrlPrefix}/customer`, customer_route_1.default);
// faq routes
app.use(`${dotenv_config_1.serverUrlPrefix}/faq`, faq_route_1.default);
// product category routes
app.use(`${dotenv_config_1.serverUrlPrefix}/product-category`, product_category_route_1.default);
// product review routes
app.use(`${dotenv_config_1.serverUrlPrefix}/product-review`, product_review_route_1.default);
// coupon routes
app.use(`${dotenv_config_1.serverUrlPrefix}/coupon`, coupon_route_1.default);
// product routes
app.use(`${dotenv_config_1.serverUrlPrefix}/product`, product_route_1.default);
// order routes
app.use(`${dotenv_config_1.serverUrlPrefix}/order`, order_route_1.default);
// media routes
app.use(`${dotenv_config_1.serverUrlPrefix}/media`, media_route_1.default);
// blog routes
app.use(`${dotenv_config_1.serverUrlPrefix}/blog`, blog_route_1.default);
// job routes
app.use(`${dotenv_config_1.serverUrlPrefix}/job`, job_route_1.default);
// client routes
app.use(`${dotenv_config_1.serverUrlPrefix}/client`, client_route_1.default);
// cart routes
app.use(`${dotenv_config_1.serverUrlPrefix}/cart`, cart_route_1.default);
// courier routes
app.use(`${dotenv_config_1.serverUrlPrefix}/courier`, courier_route_1.default);
// transaction routes
app.use(`${dotenv_config_1.serverUrlPrefix}/transaction`, transaction_route_1.default);
// 404 middleware
app.use(notFound_controller_1.default);
// global error controller
app.use(error_controller_1.default);
exports.default = app;
