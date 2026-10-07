const nodemailer = require('nodemailer');
require('dotenv').config();

// Cấu hình transporter lấy thông tin từ file .env
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Hàm gửi mã OTP
const sendOTP = async (toEmail, username, otp) => {
    const mailOptions = {
        from: `"Car Showroom 🚗" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Mã xác thực OTP đăng ký tài khoản',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 10px;">
                <h2 style="color: #38bdf8; margin-bottom: 10px;">🏎️ CAR SHOWROOM</h2>
                <p>Xin chào <b>${username}</b>,</p>
                <p>Mã xác thực OTP để hoàn tất đăng ký tài khoản của bạn là:</p>
                <div style="background-color: #1e293b; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="color: #38bdf8; font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otp}</span>
                </div>
                <p>Mã này có hiệu lực trong <b>5 phút</b>. Vui lòng không tiết lộ mã cho bất kỳ ai.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };