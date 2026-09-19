/*
    CHỨC NĂNG CHUYỂN ĐỔI GIỮA ĐĂNG NHẬP VÀ ĐĂNG KÝ (SLIDE FORM)
*/
// 1. Tìm và lưu lại phần tử khung chứa chính (có id="container")
const container = document.getElementById('container');
// 2. Tìm nút bấm "Đăng ký" (có id="register")
const registerBtn = document.getElementById('register');
// 3. Tìm nút bấm "Đăng nhập" (có id="login")
const loginBtn = document.getElementById('login');
/* 
   XỬ LÝ KHI NGƯỜI DÙNG CLICK VÀO NÚT "ĐĂNG KÝ"
*/
registerBtn.addEventListener('click', () => {
    // Thêm class "active" vào khung container.
    // Trong CSS, class "active" này sẽ kích hoạt hiệu ứng trượt/xoay 
    // để làm ẩn form Đăng nhập và hiện form Đăng ký ra.
    container.classList.add("active");
});
/* 
   XỬ LÝ KHI NGƯỜI DÙNG CLICK VÀO NÚT "ĐĂNG NHẬP"
*/
loginBtn.addEventListener('click', () => {
    // Xóa class "active" khỏi khung container.
    // Khi mất class này, CSS sẽ trả giao diện về trạng thái ban đầu 
    // (hiển thị form Đăng nhập).
    container.classList.remove("active");
});