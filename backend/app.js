const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const db = require('./config/db'); // Kết nối Database từ file db.js

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dang ky Routes
app.use('/api/auth', authRoutes);

// --- 1. API LẤY AN TOÀN TOÀN BỘ XE TỪ CÁC BẢNG ---
app.get('/api/cars', async (req, res) => {
    try {
        const tables = [
            { name: 'cars_audi', brand: 'audi' },
            { name: 'cars_bmw', brand: 'bmw' },
            { name: 'cars_bugatti', brand: 'bugatti' },
            { name: 'cars_ferrari', brand: 'ferrari' },
            { name: 'cars_lamborghini', brand: 'lamborghini' },
            { name: 'cars_mec', brand: 'mec' } // ✅ Tên bảng cars_mec chuẩn MySQL Workbench
        ];

        let allCars = [];

        for (const tbl of tables) {
            try {
                const [rows] = await db.query(`SELECT * FROM ${tbl.name}`);
                // Chuẩn hóa dữ liệu trả về cho Frontend
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

        res.json({ success: true, data: allCars });
    } catch (error) {
        console.error('Lỗi tổng thể khi lấy danh sách xe:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu xe' });
    }
});

// --- 2. API TẠO ĐƠN HÀNG LƯU VÀO MYSQL (BẢNG orders VÀ order_items) ---
app.post('/api/orders', async (req, res) => {
    try {
        // Lấy thêm fullname, phone, address gửi từ CHECKOUT.html
        const { userId, carBrand, carId, price, fullname, phone, address } = req.body;

        if (!userId || !carId) {
            return res.status(400).json({ message: 'Thiếu thông tin mua hàng!' });
        }

        // Tạo đơn hàng chính trong bảng orders (Đã bổ sung lưu fullname, phone, address)
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

        // Lưu chi tiết xe được mua vào bảng order_items
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

// Test Route
app.get('/', (req, res) => {
    res.send('Backend Server is running!');
});

module.exports = app;