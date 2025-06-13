const db = require('../config/db');

exports.getOrders = async (req, res) => {
    try {
        // Example: Implement basic pagination and filtering by status
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;
        const status = req.query.status; // e.g., 'Pending', 'Shipped'

        let query = 'SELECT o.*, c.name as customer_name, c.email as customer_email FROM orders o LEFT JOIN customers c ON o.customer_id = c.id';
        let countQuery = 'SELECT COUNT(*) FROM orders o';
        const queryParams = [];
        const countQueryParams = [];

        if (status) {
            query += ' WHERE o.status = ?';
            countQuery += ' WHERE o.status = ?';
            queryParams.push(status);
            countQueryParams.push(status);
        }

        query += ' ORDER BY o.order_date DESC LIMIT ? OFFSET ?';
        queryParams.push(limit, offset);

        const [orders] = await db.query(query, queryParams);
        const [[{ 'COUNT(*)': totalOrders }]] = await db.query(countQuery, countQueryParams);

        // For each order, fetch its items (can be N+1, optimize in production if needed)
        for (const order of orders) {
            const [items] = await db.query(
                'SELECT oi.*, p.name as product_name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
                [order.id]
            );
            order.items = items;
        }

        res.json({
            data: orders,
            page,
            limit,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders
        });
    } catch (error) {
        console.error('GetOrders error:', error);
        res.status(500).json({ message: 'Server error fetching orders', error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const [orders] = await db.query('SELECT o.*, c.name as customer_name, c.email as customer_email FROM orders o LEFT JOIN customers c ON o.customer_id = c.id WHERE o.id = ?', [req.params.id]);
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const order = orders[0];

        const [items] = await db.query(
            'SELECT oi.*, p.name as product_name, p.image_url as product_image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
            [order.id]
        );
        order.items = items;

        res.json(order);
    } catch (error) {
        console.error('GetOrderById error:', error);
        res.status(500).json({ message: 'Server error fetching order details', error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }
    // Add validation for allowed status values if necessary
    // const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    // if (!allowedStatuses.includes(status)) {
    //    return res.status(400).json({ message: 'Invalid status value' });
    // }

    try {
        const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found or status unchanged' });
        }
        res.json({ message: 'Order status updated successfully', id: req.params.id, status });
    } catch (error) {
        console.error('UpdateOrderStatus error:', error);
        res.status(500).json({ message: 'Server error updating order status', error: error.message });
    }
};

// TODO: Add createOrder endpoint - this would be more complex:
// - Start a transaction
// - Create the order in `orders` table
// - For each item in the order:
//   - Check product stock
//   - Insert into `order_items` table
//   - Decrement product stock_quantity in `products` table
// - Commit transaction if all good, rollback if any error
// - Example:
/*
exports.createOrder = async (req, res) => {
    const { customer_id, items, shipping_address, billing_address, notes } = req.body;
    // Basic validation
    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    let connection;
    try {
        connection = await db.getConnection(); // Get a connection from the pool
        await connection.beginTransaction();

        let totalAmount = 0;
        for (const item of items) {
            const [products] = await connection.query('SELECT price, stock_quantity FROM products WHERE id = ? FOR UPDATE', [item.product_id]);
            if (products.length === 0) {
                throw new Error(`Product with ID ${item.product_id} not found.`);
            }
            const product = products[0];
            if (product.stock_quantity < item.quantity) {
                throw new Error(`Not enough stock for product ID ${item.product_id}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`);
            }
            totalAmount += product.price * item.quantity;
        }

        const orderResult = await connection.query(
            'INSERT INTO orders (customer_id, total_amount, shipping_address, billing_address, notes, status) VALUES (?, ?, ?, ?, ?, ?)',
            [customer_id || null, totalAmount, shipping_address, billing_address, notes, 'Pending']
        );
        const orderId = orderResult[0].insertId;

        for (const item of items) {
            const [products] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]); // Fetch price again or trust client? For safety, fetch.
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, products[0].price]
            );
            await connection.query(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Order created successfully', orderId });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('CreateOrder error:', error);
        res.status(500).json({ message: 'Server error creating order', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};
*/
