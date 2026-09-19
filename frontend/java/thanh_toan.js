
/* 
 XÁC NHẬN THÔNG TIN VÀ TẠO MÃ QR
*/
function goToStep2() {
    // Lấy nội dung người dùng nhập vào ô "Họ tên" và dùng .trim() để cắt bỏ khoảng trắng thừa (nếu có) ở 2 đầu
    const name = document.getElementById('buyer-name').value.trim();
    
    // Lấy nội dung người dùng nhập vào ô "Số điện thoại" và cũng cắt bỏ khoảng trắng thừa
    const phone = document.getElementById('buyer-phone').value.trim();

    // KIỂM TRA NHẬP LIỆU: 
    // Dấu ! có nghĩa là "Không/Rỗng". 
    // Nếu chưa nhập Tên BẬT HOẶC (||) chưa nhập Số điện thoại -> Bật thông báo yêu cầu nhập đầy đủ
    if (!name || !phone) {
        alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
        return; // Dừng hàm lại ngay tại đây, không cho chuyển sang bước tiếp theo
    }

    // CHUYỂN GIAO DIỆN (BẬT/TẮT CÁC BƯỚC):
    // Ẩn màn hình Bước 1 (bằng cách bóc nhãn class 'active' ra)
    document.getElementById('step-1').classList.remove('active');
    
    // Hiện màn hình Bước 2 (bằng cách dán nhãn class 'active' vào)
    document.getElementById('step-2').classList.remove('active') // (Lưu ý: dòng bên trên trong code gốc dùng add)
    document.getElementById('step-2').classList.add('active');

    // THÔNG TIN TÀI KHOẢN NGÂN HÀNG CỐ ĐỊNH NẰM TRONG CODE:
    const bankId = 'MB';                   // Mã ngân hàng (Ngân hàng Quân Đội MBBank)
    const accountNo = '8888999999';         // Số tài khoản ngân hàng
    const amount = '50000000';              // Số tiền cần chuyển (Ví dụ: 50.000.000 VNĐ đặt cọc)
    const memo = 'NEXUS EVEREST 7731';      // Nội dung chuyển khoản

    // TỰ ĐỘNG TẠO ĐƯỜNG DẪN ẢNH MÃ QR TỪ DỊCH VỤ VIETQR:
    // encodeURIComponent(memo) giúp chuyển nội dung có khoảng trắng/chữ tiếng Việt thành dạng link hợp lệ
    const qrApiUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(memo)}&accountName=AUTO%20NEXUS%20VIETNAM`;
    
    // Gán đường dẫn ảnh vừa tạo vào thẻ <img> có id="vietqr-img" trên trang để hiển thị mã QR ra màn hình
    document.getElementById('vietqr-img').src = qrApiUrl;
}
/* 
   2. BƯỚC 2 -> BƯỚC 3: GIẢ LẬP XÁC NHẬN ĐÃ CHUYỂN TIỀN
*/
function simulatePaymentVerification() {
    // Lấy lại số điện thoại người dùng đã nhập ở Bước 1
    const phone = document.getElementById('buyer-phone').value; 
    // Điền số điện thoại đó vào vị trí hiển thị kết quả ở Bước 3 (thẻ có id="display-buyer-phone")
    document.getElementById('display-buyer-phone').innerText = phone;
    // CHUYỂN GIAO DIỆN:
    // Ẩn màn hình Bước 2 (Chuyển khoản)
    document.getElementById('step-2').classList.remove('active');
    // Hiện màn hình Bước 3 (Hoàn tất / Thành công)
    document.getElementById('step-3').classList.add('active');
}
/* 
   3. CHỨC NĂNG SAO CHÉP NHANH (COPY TO CLIPBOARD)
   Giúp người dùng bấm nút là tự copy Số tài khoản hoặc Nội dung chuyển khoản
*/
function copyValue(elementId) {
    // Lấy đoạn văn bản nằm bên trong phần tử có ID truyền vào (Ví dụ: Số tài khoản)
    const text = document.getElementById(elementId).innerText;   
    // Lệnh của trình duyệt giúp tự động lưu đoạn văn bản đó vào bộ nhớ tạm (Khay nhớ tạm)
    navigator.clipboard.writeText(text);
    // Bật thông báo nhỏ cho người dùng biết đã copy thành công
    alert('Đã sao chép: ' + text);
}