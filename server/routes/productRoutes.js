const express = require('express');
const {
    getProducts, addProduct, getProductById, updateProduct, deleteProduct,
    getCategories, addCategory, updateCategory, deleteCategory
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Product Routes
router.route('/')
    .get(protect, getProducts)
    .post(protect, addProduct);

router.route('/:id')
    .get(protect, getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

// Category Routes
router.route('/categories')
    .get(protect, getCategories)
    .post(protect, addCategory);

router.route('/categories/:id')
    .put(protect, updateCategory)
    .delete(protect, deleteCategory);

module.exports = router;
