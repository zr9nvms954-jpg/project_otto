const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Lấy token từ header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Định dạng: "Bearer <TOKEN>"

    if (!token) {
        return res.status(401).json({
            message: 'Truy cập bị từ chối! Bạn vui lòng đăng nhập trước khi xem sản phẩm.'
        });
    }

    try {
        // Xác thực token hợp lệ
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'car_showroom_secret_key_2026');
        req.user = verified; // Lưu thông tin user đã đăng nhập vào request
        next(); // Cho phép tiếp tục đi vào lấy dữ liệu xe
    } catch (error) {
        res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!' });
    }
};