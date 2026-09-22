const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ĐĂNG KÝ
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
        }

        // 1. Kiểm tra xem username hoặc email đã tồn tại chưa
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Tên tài khoản hoặc Email đã tồn tại!' });
        }

        // 2. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Thêm tài khoản mới vào DB
        await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });

    } catch (error) {
        console.error('Lỗi Server khi Đăng ký:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ: ' + error.message });
    }
};

// ĐĂNG NHẬP
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu!' });
        }

        // 1. Tìm user theo username hoặc email
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không đúng!' });
        }

        const user = users[0];

        // 2. So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không đúng!' });
        }

        // 3. Tạo Token xác thực (Dùng cột user_id chuẩn trong MySQL Workbench)
        const token = jwt.sign(
            { id: user.user_id, username: user.username },
            process.env.JWT_SECRET || 'car_showroom_secret_key_2026',
            { expiresIn: '24h' }
        );

        // 4. Trả về thông tin User chứa đúng user_id để LocalStorage lưu giữ
        res.json({
            message: 'Đăng nhập thành công!',
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Lỗi Server khi Đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ: ' + error.message });
    }
};