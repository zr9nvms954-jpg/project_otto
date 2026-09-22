const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const verifyToken = require('../middleware/authMiddleware'); // Import Middleware bảo vệ

// Chỉ cho phép xem danh sách xe KHI ĐÃ ĐĂNG NHẬP (Chạy qua verifyToken)
router.get('/:brand', verifyToken, carController.getCarsByBrand);

// Chỉ cho phép xem chi tiết xe KHI ĐÃ ĐĂNG NHẬP
router.get('/:brand/:id', verifyToken, carController.getCarById);

module.exports = router;