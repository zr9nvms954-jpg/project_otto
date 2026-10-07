const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. Route yêu cầu gửi mã OTP (Bước 1 Đăng ký)
router.post('/request-otp', authController.requestOTP);

// 2. Route xác thực mã OTP & tạo tài khoản (Bước 2 Đăng ký)
router.post('/verify-otp', authController.verifyOTP);

// 3. Route Đăng nhập
router.post('/login', authController.login);

module.exports = router;