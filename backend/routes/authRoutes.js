const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route Đăng ký: POST /api/auth/register
router.post('/register', authController.register);

// Route Đăng nhập: POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;