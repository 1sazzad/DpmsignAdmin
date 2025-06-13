// server/controllers/productController.js
const db = require('../config/db');
// Helper function to generate slugs (simple version)
const generateSlug = (name) => {
  if (!name) return ''; // Handle cases where name might be undefined or null
  return name.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

// Products
exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const [products] = await db.query(
            'SELECT p.productId, p.name, p.slug, p.basePrice, p.isActive, p.sku, pc.name as categoryName, pc.slug as categorySlug FROM `Products` p ' +
            'LEFT JOIN `ProductCategories` pc ON p.categoryId = pc.categoryId ' +
            'ORDER BY p.createdAt DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        const [[{ 'COUNT(*)': totalProducts }]] = await db.query('SELECT COUNT(*) FROM `Products`');

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
    const {
        name, description, sku, basePrice, minOrderQuantity = 1,
        discountStart, discountEnd, discountPercentage,
        pricingType = 'flat', isActive = true, categoryId
    } = req.body;

    if (!name || basePrice === undefined || !sku || !pricingType) { // basePrice can be 0
        return res.status(400).json({ message: 'Name, SKU, Base Price, and Pricing Type are required' });
    }

    const slug = req.body.slug || generateSlug(name);

    try {
        // Check if SKU or Slug already exists to ensure uniqueness
        const [existingProduct] = await db.query('SELECT productId FROM `Products` WHERE slug = ? OR sku = ?', [slug, sku]);
        if (existingProduct.length > 0) {
            return res.status(409).json({ message: 'Product with this SKU or Slug already exists.' });
        }

        const [result] = await db.query(
            'INSERT INTO `Products` (name, description, slug, sku, basePrice, minOrderQuantity, discountStart, discountEnd, discountPercentage, pricingType, isActive, categoryId, createdAt, updatedAt) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
            [name, description, slug, sku, basePrice, minOrderQuantity, discountStart || null, discountEnd || null, discountPercentage || null, pricingType, isActive, categoryId || null]
        );
        res.status(201).json({ productId: result.insertId, name, slug, sku, basePrice });
    } catch (error) {
        console.error('AddProduct error:', error);
        res.status(500).json({ message: 'Server error adding product', error: error.message });
    }
};

exports.getProductBySlug = async (req, res) => { // Changed from Id to Slug for more SEO friendly URLs
    try {
        const [products] = await db.query(
            'SELECT p.*, pc.name as categoryName, pc.slug as categorySlug FROM `Products` p ' +
            'LEFT JOIN `ProductCategories` pc ON p.categoryId = pc.categoryId WHERE p.slug = ?',
            [req.params.slug]
        );
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // TODO: Optionally fetch ProductImages, ProductAttributes, ProductVariants here
        res.json(products[0]);
    } catch (error) {
        console.error('GetProductBySlug error:', error);
        res.status(500).json({ message: 'Server error fetching product', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const { productId } = req.params; // Expecting productId in URL param for update
    const {
        name, description, sku, basePrice, minOrderQuantity,
        discountStart, discountEnd, discountPercentage,
        pricingType, isActive, categoryId
    } = req.body;

    let slug = req.body.slug;
    if (name && !req.body.slug_provided_explicitly) { // If name changes and no new slug provided, regenerate slug
        slug = generateSlug(name);
    }


    try {
         // Check for SKU/Slug collision if they are being changed
        if (slug || sku) {
            let collisionCheckQuery = 'SELECT productId FROM `Products` WHERE (';
            const params = [];
            if (slug) {
                collisionCheckQuery += 'slug = ?';
                params.push(slug);
            }
            if (sku) {
                if (slug) collisionCheckQuery += ' OR ';
                collisionCheckQuery += 'sku = ?';
                params.push(sku);
            }
            collisionCheckQuery += ') AND productId != ?';
            params.push(productId);

            const [existingProduct] = await db.query(collisionCheckQuery, params);
            if (existingProduct.length > 0) {
                return res.status(409).json({ message: 'Another product with this SKU or Slug already exists.' });
            }
        }

        // Build query dynamically - more robust approach needed for partial updates
        // For now, assuming all relevant fields are passed or handled by client
        const fieldsToUpdate = {
            name, description, slug, sku, basePrice, minOrderQuantity,
            discountStart, discountEnd, discountPercentage,
            pricingType, isActive, categoryId, updatedAt: new Date()
        };
        // Filter out undefined values to allow partial updates without overwriting with null
        Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);
        if (Object.keys(fieldsToUpdate).length === 1 && fieldsToUpdate.updatedAt) { // Only updatedAt
             return res.status(400).json({ message: "No fields to update provided."});
        }


        const [result] = await db.query(
            'UPDATE `Products` SET ? WHERE productId = ?',
            [fieldsToUpdate, productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' }); // Or no actual change if data is same
        }
        res.json({ message: 'Product updated successfully', productId });
    } catch (error) {
        console.error('UpdateProduct error:', error);
        res.status(500).json({ message: 'Server error updating product', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { productId } = req.params; // Expecting productId in URL param
    try {
        const [result] = await db.query('DELETE FROM `Products` WHERE productId = ?', [productId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('DeleteProduct error:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ message: 'Cannot delete product. It is referenced in other records (e.g., orders).' });
        }
        res.status(500).json({ message: 'Server error deleting product', error: error.message });
    }
};

// Categories
exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT categoryId, name, slug, parentCategoryId, createdAt FROM `ProductCategories` ORDER BY name ASC');
        res.json(categories);
    } catch (error) {
        console.error('GetCategories error:', error);
        res.status(500).json({ message: 'Server error fetching categories', error: error.message });
    }
};

exports.addCategory = async (req, res) => {
    const { name, parentCategoryId } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }
    const slug = req.body.slug || generateSlug(name);

    try {
        const [existingCat] = await db.query('SELECT categoryId FROM `ProductCategories` WHERE slug = ?', [slug]);
        if (existingCat.length > 0) {
            return res.status(409).json({ message: 'Category with this slug already exists.' });
        }

        const [result] = await db.query(
            'INSERT INTO `ProductCategories` (name, slug, parentCategoryId, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
            [name, slug, parentCategoryId || null]
        );
        res.status(201).json({ categoryId: result.insertId, name, slug, parentCategoryId });
    } catch (error) {
        console.error('AddCategory error:', error);
        res.status(500).json({ message: 'Server error adding category', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name, parentCategoryId } = req.body;

    if (!name && parentCategoryId === undefined && !req.body.slug) { // Check if any updatable field is provided
         return res.status(400).json({ message: 'Please provide data to update (name, slug, or parentCategoryId).' });
    }

    let slug = req.body.slug;
    if (name && !req.body.slug_provided_explicitly) { // If name changes and no new slug provided, regenerate slug
        slug = generateSlug(name);
    }

    try {
        if (slug) { // Check for slug collision only if slug is being set/changed
            const [existingCat] = await db.query('SELECT categoryId FROM `ProductCategories` WHERE slug = ? AND categoryId != ?', [slug, categoryId]);
            if (existingCat.length > 0) {
                return res.status(409).json({ message: 'Another category with this slug already exists.' });
            }
        }

        const fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (slug) fieldsToUpdate.slug = slug;
        if (parentCategoryId !== undefined) fieldsToUpdate.parentCategoryId = parentCategoryId || null;
        fieldsToUpdate.updatedAt = new Date();

        if (Object.keys(fieldsToUpdate).length === 1 && fieldsToUpdate.updatedAt) { // Only updatedAt means no actual data fields
             return res.status(400).json({ message: "No updatable fields provided or new values are same as current."});
        }


        const [result] = await db.query(
            'UPDATE `ProductCategories` SET ? WHERE categoryId = ?',
            [fieldsToUpdate, categoryId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found or no changes made' });
        }
        res.json({ message: 'Category updated successfully', categoryId });
    } catch (error) {
        console.error('UpdateCategory error:', error);
        res.status(500).json({ message: 'Server error updating category', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const [children] = await db.query('SELECT categoryId FROM `ProductCategories` WHERE parentCategoryId = ?', [categoryId]);
        if (children.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category. It is a parent to other categories. Please reassign or delete child categories first.' });
        }

        const [products] = await db.query('SELECT productId FROM `Products` WHERE categoryId = ?', [categoryId]);
        if (products.length > 0) {
            // This check depends on the desired behavior. The schema had ON DELETE SET NULL for Products.categoryId.
            // If products referencing this category should have their categoryId set to NULL, this check might be altered or removed.
            // If we want to prevent deletion if products are assigned, this is correct.
            return res.status(400).json({ message: `Cannot delete category. It is assigned to ${products.length} product(s). Please reassign products first.` });
        }

        const [result] = await db.query('DELETE FROM `ProductCategories` WHERE categoryId = ?', [categoryId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('DeleteCategory error:', error);
        // ER_ROW_IS_REFERENCED_2 might still occur if other tables reference ProductCategories directly
        // and those constraints are RESTRICT.
        res.status(500).json({ message: 'Server error deleting category', error: error.message });
    }
};
