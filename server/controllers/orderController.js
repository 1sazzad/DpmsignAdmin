// server/controllers/orderController.js
const db = require('../config/db');

exports.getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const filterStatus = req.query.status; // e.g., 'order-request-received'
        const filterPaymentStatus = req.query.paymentStatus; // e.g., 'pending'

        let whereClauses = [];
        let queryParams = [];

        if (filterStatus) {
            whereClauses.push('o.status = ?');
            queryParams.push(filterStatus);
        }
        if (filterPaymentStatus) {
            whereClauses.push('o.paymentStatus = ?');
            queryParams.push(filterPaymentStatus);
        }

        const whereCondition = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const baseQuery = 'FROM `Orders` o ' +
                          'LEFT JOIN `Customers` cust ON o.customerId = cust.customerId ' +
                          'LEFT JOIN `Staff` s ON o.staffId = s.staffId ';

        const dataQuery = 'SELECT o.orderId, o.customerName, o.customerEmail, o.customerPhone, o.orderTotalPrice, o.status, o.paymentStatus, o.deliveryMethod, o.method, o.createdAt, ' +
                          'cust.name as registeredCustomerName, s.name as staffName ' +
                          baseQuery + whereCondition +
                          'ORDER BY o.createdAt DESC LIMIT ? OFFSET ?';
        queryParams.push(limit, offset);

        const [orders] = await db.query(dataQuery, queryParams);

        const countQuery = 'SELECT COUNT(o.orderId) as totalOrders ' + baseQuery + whereCondition;
        // Reset queryParams for count query (without limit/offset)
        let countQueryParams = [];
        if (filterStatus) countQueryParams.push(filterStatus);
        if (filterPaymentStatus) countQueryParams.push(filterPaymentStatus);

        const [[{ totalOrders }]] = await db.query(countQuery, countQueryParams);

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
    const { orderId } = req.params;
    try {
        const [orders] = await db.query(
            'SELECT o.*, cust.name as registeredCustomerName, cust.email as registeredCustomerEmail, s.name as staffName, ' +
            'coup.code as couponCode, cour.name as courierName ' +
            'FROM `Orders` o ' +
            'LEFT JOIN `Customers` cust ON o.customerId = cust.customerId ' +
            'LEFT JOIN `Staff` s ON o.staffId = s.staffId ' +
            'LEFT JOIN `Coupons` coup ON o.couponId = coup.couponId ' +
            'LEFT JOIN `Couriers` cour ON o.courierId = cour.courierId ' +
            'WHERE o.orderId = ?',
            [orderId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const order = orders[0];

        const [items] = await db.query(
            'SELECT oi.*, p.name as productName, p.sku as productSku, pv.productVariantId as variantInfo ' + // Assuming ProductVariants has more info to join on
            'FROM `OrderItems` oi ' +
            'JOIN `Products` p ON oi.productId = p.productId ' +
            'LEFT JOIN `ProductVariants` pv ON oi.productVariantId = pv.productVariantId ' +
            'WHERE oi.orderId = ?',
            [orderId]
        );
        order.items = items;

        // Optionally, fetch OrderImages
        const [images] = await db.query('SELECT imageName FROM `OrderImages` WHERE orderId = ?', [orderId]);
        order.images = images.map(img => img.imageName);

        res.json(order);
    } catch (error) {
        console.error('GetOrderById error:', error);
        res.status(500).json({ message: 'Server error fetching order details', error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    const allowedStatuses = [
        'order-request-received','consultation-in-progress','order-canceled','awaiting-advance-payment',
        'advance-payment-received','design-in-progress','awaiting-design-approval','production-started',
        'production-in-progress','ready-for-delivery','out-for-delivery','order-completed'
    ];
    if (!allowedStatuses.includes(status)) {
       return res.status(400).json({ message: `Invalid status value. Allowed: ${allowedStatuses.join(', ')}` });
    }

    try {
        const [result] = await db.query('UPDATE `Orders` SET status = ?, updatedAt = NOW() WHERE orderId = ?', [status, orderId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found or status unchanged' });
        }
        // TODO: Potentially add an entry to AuditLogs table here
        res.json({ message: 'Order status updated successfully', orderId, status });
    } catch (error) {
        console.error('UpdateOrderStatus error:', error);
        res.status(500).json({ message: 'Server error updating order status', error: error.message });
    }
};

// Placeholder for createOrder - more aligned with user's schema
exports.createOrder = async (req, res) => {
    const {
        customerId,
        customerName, customerEmail, customerPhone,
        staffId,
        couponId,
        billingAddress, additionalNotes,
        method = 'offline',
        deliveryMethod = 'shop-pickup',
        paymentMethod,
        paymentStatus = 'pending',
        courierId, courierAddress,
        items
    } = req.body;

    if (!staffId || !items || items.length === 0 || !customerPhone) {
        return res.status(400).json({ message: 'Staff ID, items, and customer phone are required.' });
    }
    if (!customerId && (!customerName || !customerEmail)) {
        return res.status(400).json({ message: 'Customer ID or Name & Email are required.'});
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        let currentCustomerId = customerId;
        // TODO: If customerId is null, you might want to find existing customer by email/phone or create a new one in Customers table.
        // This logic is simplified here.

        let calculatedTotalPrice = 0;
        for (const item of items) {
            if (item.price === undefined || item.quantity === undefined) {
                throw new Error('Each item must have price and quantity.');
            }
            calculatedTotalPrice += parseFloat(item.price) * parseInt(item.quantity, 10);
        }

        // TODO: Apply coupon discount if couponId is valid and criteria met

        const orderData = {
            customerId: currentCustomerId,
            customerName: customerName || (currentCustomerId ? null : 'Guest'),
            customerEmail: customerEmail || (currentCustomerId ? null : 'guest@example.com'),
            customerPhone,
            staffId,
            couponId: couponId || null,
            billingAddress: billingAddress || 'N/A',
            additionalNotes: additionalNotes || null,
            method,
            deliveryMethod,
            status: 'order-request-received',
            currentStatus: 'Order placed by admin/staff.',
            paymentMethod: paymentMethod || 'cod-payment',
            paymentStatus,
            courierId: deliveryMethod === 'courier' ? courierId : null,
            courierAddress: deliveryMethod === 'courier' ? courierAddress : null,
            orderTotalPrice: calculatedTotalPrice,
            deliveryDate: req.body.deliveryDate || null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const [orderResult] = await connection.query('INSERT INTO `Orders` SET ?', orderData);
        const newOrderId = orderResult.insertId;

        for (const item of items) {
            const orderItemData = {
                orderId: newOrderId,
                productId: item.productId,
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                size: item.size || null,
                widthInch: item.widthInch || null,
                heightInch: item.heightInch || null,
                price: item.price,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await connection.query('INSERT INTO `OrderItems` SET ?', orderItemData);
            // TODO: Implement stock update on Products/ProductVariants table if applicable
        }

        // TODO: If order includes images (OrderImages table), handle their upload and association.

        await connection.commit();
        res.status(201).json({ message: 'Order created successfully', orderId: newOrderId, orderTotalPrice: calculatedTotalPrice });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('CreateOrder error:', error);
        res.status(500).json({ message: 'Server error creating order', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};
