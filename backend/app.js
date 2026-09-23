const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ĐK
app.use('/api/auth', authRoutes);

// lấy API
app.get('/api/cars', async (req, res) => {
    try {
        const tables = [
            { name: 'cars_audi', brand: 'audi' },
            { name: 'cars_bmw', brand: 'bmw' },
            { name: 'cars_bugatti', brand: 'bugatti' },
            { name: 'cars_ferrari', brand: 'ferrari' },
            { name: 'cars_lamborghini', brand: 'lamborghini' },
            { name: 'cars_mec', brand: 'mec' }
        ];

        let allCars = [];

        for (const tbl of tables) {
            try {
                const [rows] = await db.query(`SELECT * FROM ${tbl.name}`);
                // Chuẩn hóa dữ liệu
                const formattedRows = rows.map(item => ({
                    id: item.id || item.car_id,
                    brand: tbl.brand,
                    name: item.name || item.car_name || item.title || 'Siêu Xe',
                    price: item.price || item.car_price || 0,
                    image_url: item.image_url || item.image || item.picture || item.img || ''
                }));
                allCars = allCars.concat(formattedRows);
            } catch (tblErr) {
                console.warn(`⚠️ Bảng ${tbl.name} chưa đúng tên cột hoặc chưa có dữ liệu:`, tblErr.message);
            }
        }

        // Đã sửa: Trả về mảng trực tiếp để frontend admin_manager.js đọc được
        res.json(allCars);
    } catch (error) {
        console.error('Lỗi tổng thể khi lấy danh sách xe:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu xe' });
    }
});

// Đã thêm: API lấy danh sách đơn hàng cho file admin_manager.js
app.get('/api/orders', async (req, res) => {
    try {
        const [orders] = await db.query('SELECT * FROM orders ORDER BY order_id DESC');
        res.json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu đơn hàng' });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { userId, carBrand, carId, price, fullname, phone, address } = req.body;

        if (!userId || !carId) {
            return res.status(400).json({ message: 'Thiếu thông tin mua hàng!' });
        }

        const [orderResult] = await db.query(
            'INSERT INTO orders (user_id, fullname, phone, address, total_amount, status) VALUES (?, ?, ?, ?, ?, ?)',
            [
                userId,
                fullname || null,
                phone || null,
                address || null,
                price,
                'completed'
            ]
        );

        const orderId = orderResult.insertId;

        await db.query(
            'INSERT INTO order_items (order_id, car_brand, car_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?, ?)',
            [orderId, carBrand || 'unknown', carId, 1, price]
        );

        res.status(201).json({
            success: true,
            message: '🎉 Đặt mua xe thành công! Đã lưu đơn hàng vào Database.'
        });
    } catch (error) {
        console.error('Lỗi tạo đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng: ' + error.message });
    }
});

// Test 
app.get('/', (req, res) => {
    res.send('Backend Server is running!');
});

module.exports = app;