const API_URL = 'http://localhost:5000/api/auth'; // Đã sửa cổng thành 5000

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerForm = document.getElementById('register-form');
    const otpForm = document.getElementById('otp-form');
    const btnBack = document.getElementById('btn-back-register');
    const loginForm = document.getElementById('login-form');

    // 1. BẤM SIGN UP -> GỬI MÃ OTP VỀ EMAIL
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending OTP...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_URL}/request-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('📩 ' + (data.message || 'Mã OTP đã được gửi về Email!'));

                    // Chuyển sang form OTP
                    registerForm.style.display = 'none';
                    if (otpForm) {
                        otpForm.style.display = 'flex';
                        otpForm.style.flexDirection = 'column';
                        otpForm.style.alignItems = 'center';
                        otpForm.style.justifyContent = 'center';
                    }
                } else {
                    alert('⚠️ ' + data.message);
                }
            } catch (error) {
                console.error('Lỗi khi gửi OTP:', error);
                alert('❌ Không thể kết nối tới Server Backend!');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // 2. NÚT QUAY LẠI TỪ FORM OTP
    if (btnBack && registerForm && otpForm) {
        btnBack.addEventListener('click', () => {
            otpForm.style.display = 'none';
            registerForm.style.display = 'flex';
        });
    }

    // 3. BẤM VERIFY & REGISTER -> XÁC THỰC MÃ OTP
    if (otpForm) {
        otpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const otp = document.getElementById('otp-code').value.trim();

            if (otp.length !== 6) {
                alert('⚠️ Vui lòng nhập đủ 6 chữ số OTP!');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password, otp })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('🎉 ' + (data.message || 'Đăng ký tài khoản thành công!'));

                    registerForm.reset();
                    otpForm.reset();
                    otpForm.style.display = 'none';
                    registerForm.style.display = 'flex';

                    if (container) container.classList.remove("active");
                } else {
                    alert('⚠️ ' + data.message);
                }
            } catch (error) {
                console.error('Lỗi API:', error);
                alert('❌ Không thể kết nối tới Server Backend!');
            }
        });
    }

    // 4. XỬ LÝ ĐĂNG NHẬP
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('🎉 ' + data.message);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'SHOPPING.html';
                } else {
                    alert('⚠️ ' + data.message);
                }
            } catch (error) {
                console.error('Lỗi API:', error);
                alert('❌ Không thể kết nối tới Server Backend!');
            }
        });
    }
});