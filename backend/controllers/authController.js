const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/sendEmail');

// Bộ nhớ tạm lưu OTP trong RAM (Key: email, Value: { username, email, password, otp, expiresAt })
const otpStore = new Map();

// ==========================================
// 1. BƯỚC 1: YÊU CẦU GỬI MÃ OTP VỀ EMAIL
// ==========================================
exports.requestOTP = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
        }

        // 1. Kiểm tra tài khoản/email đã tồn tại trong DB chưa (Giữ nguyên logic cũ)
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Tên tài khoản hoặc Email đã tồn tại!' });
        }

        // 2. Tạo mã OTP 6 số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // Mã có hiệu lực trong 5 phút

        // 3. Lưu tạm thông tin người dùng + OTP vào RAM
        otpStore.set(email, { username, email, password, otp, expiresAt });

        // 4. Gọi hàm gửi email
        await sendOTP(email, username, otp);

        res.status(200).json({ message: 'Mã OTP đã được gửi về Email của bạn!' });

    } catch (error) {
        console.error('Lỗi Server khi gửi OTP:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ: ' + error.message });
    }
};

// ==========================================
// 2. BƯỚC 2: XÁC THỰC OTP & LƯU VÀO DATABASE
// ==========================================
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Vui lòng nhập mã OTP!' });
        }

        const record = otpStore.get(email);

        if (!record) {
            return res.status(400).json({ message: 'Không tìm thấy yêu cầu OTP hoặc mã đã hết hạn!' });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'Mã OTP đã hết hạn! Vui lòng lấy mã mới.' });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ message: 'Mã OTP không chính xác!' });
        }

        // Mã OTP hợp lệ -> Lấy thông tin tài khoản đã lưu tạm
        const { username, password } = record;

        // Mã hóa mật khẩu (Giữ nguyên logic cũ của bạn)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Thêm tài khoản vào CSDL MySQL (Giữ nguyên logic cũ của bạn)
        await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // Xóa OTP khỏi bộ nhớ tạm sau khi đăng ký thành công
        otpStore.delete(email);

        res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });

    } catch (error) {
        console.error('Lỗi Server khi xác thực OTP:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ: ' + error.message });
    }
};

// ==========================================
// 3. ĐĂNG NHẬP (GIỮ NGUYÊN 100% LOGIC CỦA BẠN)
// ==========================================
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu!' });
        }

        // Tìm user theo username hoặc email
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không đúng!' });
        }

        const user = users[0];

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không đúng!' });
        }

        // Tạo Token xác thực
        const token = jwt.sign(
            { id: user.user_id, username: user.username },
            process.env.JWT_SECRET || 'car_showroom_secret_key_2026',
            { expiresIn: '24h' }
        );

        // Trả thông tin
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