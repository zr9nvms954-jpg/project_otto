const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'db', // Sửa từ 'localhost' thành 'db'
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword', // Sửa mật khẩu khớp với docker-compose
    database: process.env.DB_NAME || 'car_showroom',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test 
db.getConnection()
    .then(connection => {
        console.log('✅ Đã kết nối thành công tới Database MySQL!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
    });

module.exports = db;