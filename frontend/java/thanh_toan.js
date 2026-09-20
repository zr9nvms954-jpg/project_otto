// Cấu hình ngân hàng VietQR
const BANK_CONFIG = {
    BANK_ID: "MB",               // Mã ngân hàng MBBank
    ACCOUNT_NO: "8888999999",     // Số tài khoản
    ACCOUNT_NAME: "AUTO NEXUS VIETNAM",
    AMOUNT: 50000000,             // Số tiền đặt cọc: 50.000.000đ
    TEMPLATE: "compact2"          // Mẫu hiển thị VietQR
};

// 1. Chuyển từ Bước 1 sang Bước 2 (Nhập thông tin -> Quét VietQR)
function goToStep2() {
    const nameInput = document.getElementById('buyer-name');
    const phoneInput = document.getElementById('buyer-phone');

    const name = nameInput ? nameInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";

    if (!name || !phone) {
        alert("Vui lòng nhập đầy đủ Họ tên và Số điện thoại!");
        return;
    }

    // Tạo mã chuyển khoản ngẫu nhiên
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const memo = `NEXUS EVEREST ${randomCode}`;

    // Cập nhật thông tin lên màn hình Bước 2 & Bước 3
    const ndVal = document.getElementById('nd-val');
    const phoneVal = document.getElementById('display-buyer-phone');
    
    if (ndVal) ndVal.innerText = memo;
    if (phoneVal) phoneVal.innerText = phone;

    // Tạo URL ảnh VietQR tự động từ API
    const qrUrl = `https://img.vietqr.io/image/${BANK_CONFIG.BANK_ID}-${BANK_CONFIG.ACCOUNT_NO}-${BANK_CONFIG.TEMPLATE}.png?amount=${BANK_CONFIG.AMOUNT}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(BANK_CONFIG.ACCOUNT_NAME)}`;
    
    const qrImg = document.getElementById('vietqr-img');
    if (qrImg) qrImg.src = qrUrl;

    // Hiển thị Bước 2
    switchStep('step-2');
}

// 2. Chuyển từ Bước 2 sang Bước 3 (Xác nhận hoàn tất)
function simulatePaymentVerification() {
    switchStep('step-3');
}

// 3. Hàm ẩn/hiện các bước thanh toán
function switchStep(stepId) {
    const steps = document.querySelectorAll('.step-panel');
    steps.forEach(step => step.classList.remove('active'));

    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.classList.add('active');
    }
}

// 4. Hàm Copy nhanh Số tài khoản & Nội dung chuyển khoản
function copyValue(elementId) {
    const targetEl = document.getElementById(elementId);
    if (!targetEl) return;

    const textToCopy = targetEl.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert(`Đã sao chép: ${textToCopy}`);
    }).catch(err => {
        console.error("Lỗi khi sao chép: ", err);
    });
}