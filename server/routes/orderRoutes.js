// server/routes/orderRoutes.js
const express = require('express');
const {
    getOrders, getOrderById, updateOrderStatus, createOrder // Added createOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getOrders)
    .post(protect, createOrder); // Route for creating new orders

router.route('/:orderId') // Parameter name is orderId
    .get(protect, getOrderById);

router.route('/:orderId/status') // Parameter name is orderId
    .put(protect, updateOrderStatus);

module.exports = router;
