const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dang ky Routes
app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Backend Server is running!');
});

module.exports = app;