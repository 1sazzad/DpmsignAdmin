// server/routes/productRoutes.js
const express = require('express');
const {
    getProducts, addProduct, getProductBySlug, updateProduct, deleteProduct,
    getCategories, addCategory, updateCategory, deleteCategory
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Product Routes
router.route('/')
    .get(protect, getProducts) // GET /api/v1/products (with pagination query params)
    .post(protect, addProduct); // POST /api/v1/products

router.route('/:slug') // GET /api/v1/products/some-product-slug
    .get(protect, getProductBySlug);

// Routes for product CUD operations that use productId
router.route('/id/:productId') // PUT /api/v1/products/id/123
    .put(protect, updateProduct)
    .delete(protect, deleteProduct); // DELETE /api/v1/products/id/123


// Category Routes
router.route('/categories') // GET /api/v1/products/categories
    .get(protect, getCategories)
    .post(protect, addCategory); // POST /api/v1/products/categories

router.route('/categories/:categoryId') // PUT /api/v1/products/categories/1
    .put(protect, updateCategory)
    .delete(protect, deleteCategory); // DELETE /api/v1/products/categories/1

module.exports = router;
