/*
*/

// Sự kiện này đảm bảo: Chờ cho toàn bộ giao diện HTML tải xong xuôi 
// thì mới bắt đầu chạy các đoạn code JavaScript bên dưới (tránh lỗi không tìm thấy giao diện).
document.addEventListener("DOMContentLoaded", () => {
    initAccountTabs();  // Kích hoạt chức năng chuyển tab (Hồ sơ, Mật khẩu, v.v.)
    initProfileForm();   // Kích hoạt chức năng xử lý Form thông tin cá nhân
    initPasswordForm();  // Kích hoạt chức năng xử lý Form đổi mật khẩu
    initNotification();  // Kích hoạt nút bấm xem Thông báo
    initCurrentYear();   // Tự động điền năm hiện tại vào chân trang (Footer)
});
/* 
   1. CHỨC NĂNG CHUYỂN TAB CÀI ĐẶT TÀI KHOẢN (ACCOUNT TABS)
*/
function initAccountTabs() {
    // Tìm tất cả các nút bấm menu bên thanh bên (Sidebar)
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    // Tìm tất cả các khung nội dung (Panel) tương ứng
    const accountPanels = document.querySelectorAll(".account-panel");

    // Kiểm tra an toàn: Nếu trên trang không có menu hoặc không có khung nội dung thì dừng lại luôn.
    if (sidebarItems.length === 0 || accountPanels.length === 0) return;

    // Lặp qua từng nút menu để gán sự kiện khi người dùng click vào
    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            // Lấy tên tab đích được lưu trong thuộc tính data-target (Ví dụ: "profile" hoặc "password")
            const target = item.dataset.target;

            /* XỬ LÝ SỰ KIỆN NỔI NÚT MENU ĐƯỢC CHỌN */
            // Xóa trạng thái "active" (đang chọn) khỏi tất cả các nút menu
            sidebarItems.forEach(menuItem => menuItem.classList.remove("active"));
            // Thêm lại trạng thái "active" vào duy nhất nút vừa được click
            item.classList.add("active");

            /* XỬ LÝ HIỂN THỊ KHUNG NỘI DUNG TƯƠNG ỨNG */
            accountPanels.forEach(panel => {
                // Ẩn tất cả các khung nội dung đi
                panel.classList.remove("active");
                
                // Nếu khung nội dung có data-panel trùng với tab người dùng vừa chọn -> Cho hiển thị lên
                if (panel.dataset.panel === target) {
                    panel.classList.add("active");
                }
            });
        });
    });
}


/* 
   2. CHỨC NĂNG LƯU THÔNG TIN CÁ NHÂN (PROFILE FORM)
*/
function initProfileForm() {
    // Tìm form có ID là "profileForm" trong HTML
    const form = document.getElementById("profileForm");
    // Nếu không tìm thấy form này trên trang hiện tại thì bỏ qua
    if (!form) return;
    // Lắng nghe sự kiện người dùng bấm nút "Lưu / Đổi thông tin" (Submit form)
    form.addEventListener("submit", event => {
        // Ngăn trình duyệt tự động load lại trang web (Hành vi mặc định của Form HTML)
        event.preventDefault();
        /*
            BACKEND SAU NÀY:
            const formData = new FormData(form);
            fetch('/api/update-profile', { method: 'POST', body: formData })
        */
        // Thông báo tạm thời cho người dùng
        showToast("Thông tin đã sẵn sàng để kết nối backend.");
    });
}
/* 
   3. CHỨC NĂNG ĐỔI MẬT KHẨU (PASSWORD FORM)
*/
function initPasswordForm() {
    // Tìm form đổi mật khẩu
    const form = document.getElementById("passwordForm");
    if (!form) return;

    // Lắng nghe sự kiện khi nhấn nút "Đổi mật khẩu"
    form.addEventListener("submit", event => {
        // Ngăn tải lại trang
        event.preventDefault();
        // Lấy 3 ô nhập liệu: Mật khẩu hiện tại, Mật khẩu mới, Xác nhận mật khẩu mới
        const currentPassword = document.getElementById("currentPassword");
        const newPassword = document.getElementById("newPassword");
        const confirmPassword = document.getElementById("confirmPassword");
        // Kiểm tra an toàn: Nếu thiếu 1 trong 3 ô nhập liệu thì ngưng xử lý
        if (!currentPassword || !newPassword || !confirmPassword) return;
        // KIỂM TRA BẢO MẬT BAN ĐẦU:
        // So sánh giá trị ô "Mật khẩu mới" và "Xác nhận mật khẩu"
        if (newPassword.value !== confirmPassword.value) {
            showToast("Mật khẩu xác nhận không trùng khớp.");
            return; // Dừng lại, không cho gửi đi
        }
        /*
            BACKEND SAU NÀY:
            Gửi dữ liệu qua API để lưu mật khẩu mới vào cơ sở dữ liệu.
        */
        showToast("Form đổi mật khẩu đã sẵn sàng để kết nối backend.");
    });
}
/*  
   4. CHỨC NĂNG XEM THÔNG BÁO (NOTIFICATION)
*/
function initNotification() {
    // Tìm nút quả chuông / nút thông báo
    const button = document.getElementById("notificationButton");
    if (!button) return;
    // Khi người dùng click vào nút thông báo
    button.addEventListener("click", () => {
        /*
            BACKEND SAU NÀY:
            Gọi API lấy danh sách các thông báo mới nhất gửi về giao diện.
        */
        showToast("Thông báo sẽ được backend cung cấp sau.");
    });
}
/* 
   5. TỰ ĐỘNG CẬP NHẬT NĂM NĂM HỆ THỐNG (CURRENT YEAR) 
*/
function initCurrentYear() {
    // Tìm vị trí hiển thị năm ở chân trang (Footer)
    const year = document.getElementById("currentYear");
    if (!year) return;
    // Lấy năm hiện tại của máy tính/hệ thống và điền vào HTML (Ví dụ: 2026)
    year.textContent = new Date().getFullYear();
}

/* 
   6. TẠO HỘP THÔNG BÁO NỔI GÓC MÀN HÌNH (TOAST NOTIFICATION) 
*/
function showToast(message) {
    // Tìm phần tử hiển thị thông báo
    const toast = document.getElementById("toast");
    if (!toast) return;

    // Gán nội dung chữ cần thông báo
    toast.textContent = message;

    // Xóa lớp "hidden" (ẩn) để ô thông báo hiện ra màn hình
    toast.classList.remove("hidden");

    // Xóa bộ đếm thời gian cũ (nếu người dùng click liên tục nhiều lần)
    clearTimeout(showToast.timer);

    // Đặt hẹn giờ: Tự động thêm lại lớp "hidden" để ẩn thông báo sau 2.5 giây (2500 miligiây)
    showToast.timer = setTimeout(() => {
        toast.classList.add("hidden");
    }, 2500);
}