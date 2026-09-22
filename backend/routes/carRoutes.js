const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const verifyToken = require('../middleware/authMiddleware'); // Import Middleware bảo vệ

// Chỉ cho phép xem danh sách xe sau khi đăng nhập
router.get('/:brand', verifyToken, carController.getCarsByBrand);

router.get('/:brand/:id', verifyToken, carController.getCarById);

module.exports = router;