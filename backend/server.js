require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});

// check lỗi ngầm, không để Node.js tự động thoát
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Lỗi Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Lỗi Uncaught Exception:', err);
});