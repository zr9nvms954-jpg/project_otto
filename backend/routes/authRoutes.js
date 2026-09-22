const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// đk
// Route: /api/auth/register
router.post('/register', authController.register);
// ĐN
// Route: /api/auth/login
router.post('/login', authController.login);

module.exports = router;