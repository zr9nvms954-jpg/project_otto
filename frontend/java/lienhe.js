document.getElementById('contactForm').addEventListener('submit', function(event) {
  // Ngăn form gửi đi ngay lập tức
  event.preventDefault();

  // Lấy dữ liệu từ các ô nhập
  let fullname = document.getElementById('fullname').value.trim();
  let phone = document.getElementById('phone').value.trim();
  let email = document.getElementById('email').value.trim();
  let topic = document.getElementById('topic').value;
  let message = document.getElementById('message').value.trim();

  let isValid = true;

  // Reset toàn bộ thông báo lỗi cũ
  document.getElementById('nameError').innerText = '';
  document.getElementById('phoneError').innerText = '';
  document.getElementById('emailError').innerText = '';
  document.getElementById('topicError').innerText = '';
  document.getElementById('messageError').innerText = '';

  // 1. Kiểm tra Họ và tên (Không bỏ trống)
  if (fullname === '') {
    document.getElementById('nameError').innerText = 'Vui lòng nhập họ và tên!';
    isValid = false;
  }

  // 2. Kiểm tra Số điện thoại (Không bỏ trống + Đúng 10 chữ số)
  let phonePattern = /^[0-9]{10}$/;
  if (phone === '') {
    document.getElementById('phoneError').innerText = 'Vui lòng nhập số điện thoại!';
    isValid = false;
  } else if (!phonePattern.test(phone)) {
    document.getElementById('phoneError').innerText = 'Số điện thoại phải gồm 10 chữ số!';
    isValid = false;
  }

  // 3. Kiểm tra Email (Không bỏ trống + Đúng định dạng email)
  let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (email === '') {
    document.getElementById('emailError').innerText = 'Vui lòng nhập địa chỉ email!';
    isValid = false;
  } else if (!emailPattern.test(email)) {
    document.getElementById('emailError').innerText = 'Email không hợp lệ (Ví dụ: abc@gmail.com)!';
    isValid = false;
  }

  // 4. Kiểm tra Chủ đề chọn
  if (topic === '') {
    document.getElementById('topicError').innerText = 'Vui lòng chọn một chủ đề!';
    isValid = false;
  }

  // 5. Kiểm tra Nội dung tin nhắn
  if (message === '') {
    document.getElementById('messageError').innerText = 'Vui lòng nhập nội dung tin nhắn!';
    isValid = false;
  }

  // Nếu tất cả ô nhập liệu hợp lệ
  if (isValid) {
    alert('Gửi thông tin liên hệ thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
    this.reset(); // Xóa sạch dữ liệu trên form
  }
});