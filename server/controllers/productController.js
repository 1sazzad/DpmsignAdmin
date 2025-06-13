const db = require('../config/db');

// Products
exports.getProducts = async (req, res) => {
    try {
        // Example: Implement basic pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const [products] = await db.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
        const [[{ 'COUNT(*)': totalProducts }]] = await db.query('SELECT COUNT(*) FROM products');

        res.json({
            data: products,
            page,
            limit,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (error) {
        console.error('GetProducts error:', error);
        res.status(500).json({ message: 'Server error fetching products', error: error.message });
    }
};

exports.addProduct = async (req, res) => {
    const { name, description, price, stock_quantity, category_id, image_url } = req.body;
    if (!name || price === undefined) { // Add more validation as needed
        return res.status(400).json({ message: 'Name and price are required' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, stock_quantity || 0, category_id || null, image_url || null]
        );
        res.status(201).json({ id: result.insertId, name, description, price, stock_quantity, category_id, image_url });
    } catch (error) {
        console.error('AddProduct error:', error);
        res.status(500).json({ message: 'Server error adding product', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const [products] = await db.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(products[0]);
    } catch (error) {
        console.error('GetProductById error:', error);
        res.status(500).json({ message: 'Server error fetching product', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const { name, description, price, stock_quantity, category_id, image_url } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?, image_url = ? WHERE id = ?',
            [name, description, price, stock_quantity, category_id, image_url, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found or no changes made' });
        }
        res.json({ message: 'Product updated successfully', id: req.params.id });
    } catch (error) {
        console.error('UpdateProduct error:', error);
        res.status(500).json({ message: 'Server error updating product', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('DeleteProduct error:', error);
        res.status(500).json({ message: 'Server error deleting product', error: error.message });
    }
};

// Categories
exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(categories);
    } catch (error) {
        console.error('GetCategories error:', error);
        res.status(500).json({ message: 'Server error fetching categories', error: error.message });
    }
};

exports.addCategory = async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }
    try {
        const [result] = await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description || null]);
        res.status(201).json({ id: result.insertId, name, description });
    } catch (error) {
        console.error('AddCategory error:', error);
         if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Category with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error adding category', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    const { name, description } = req.body;
    if (!name) { // Name is usually key, but allow updating description only if name not provided
         return res.status(400).json({ message: 'Category name is required for update' });
    }
    try {
        const [result] = await db.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found or no changes made' });
        }
        res.json({ message: 'Category updated successfully', id: req.params.id });
    } catch (error) {
        console.error('UpdateCategory error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Another category with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error updating category', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        // Consider checking if category is in use by products before deleting, or handle via DB constraints (ON DELETE SET NULL)
        const [result] = await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('DeleteCategory error:', error);
        // Handle foreign key constraint errors if a category is in use
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ message: 'Cannot delete category. It is currently assigned to one or more products.' });
        }
        res.status(500).json({ message: 'Server error deleting category', error: error.message });
    }
};
