const db = require('../config/db');

exports.createOrder = async (req, res) => {
    try {
        const { userId, carBrand, carId, price } = req.body;

        if (!userId || !carId) {
            return res.status(400).json({ message: 'Thiếu thông tin người dùng hoặc xe!' });
        }

        // 1. Tạo đơn hàng mới trong bảng orders
        const [orderResult] = await db.query(
            'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
            [userId, price, 'completed']
        );

        const orderId = orderResult.insertId;

        // 2. Lưu chi tiết sản phẩm vào bảng order_items
        await db.query(
            'INSERT INTO order_items (order_id, car_brand, car_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?, ?)',
            [orderId, carBrand || 'unknown', carId, 1, price]
        );

        res.status(201).json({
            success: true,
            message: '🎉 Đặt mua xe thành công và đã lưu vào Database!',
            orderId: orderId
        });

    } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi xử lý đơn hàng!' });
    }
};