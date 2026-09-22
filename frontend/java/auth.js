const API_URL = 'http://localhost:5000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. XỬ LÝ ĐĂNG KÝ (REGISTER) ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('🎉 ' + data.message);
                    window.location.href = 'login.html'; // Đăng ký xong chuyển sang trang đăng nhập
                } else {
                    alert('⚠️ ' + data.message);
                }
            } catch (error) {
                console.error('Lỗi API:', error);
                alert('❌ Không thể kết nối tới Server Backend!');
            }
        });
    }

    // --- 2. XỬ LÝ ĐĂNG NHẬP (LOGIN) ---
    const loginForm = document.getElementById('login-form');
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

                    // Lưu Token và thông tin User vào bộ nhớ trình duyệt (localStorage)
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Chuyển sang Trang Chủ xem xe
                    window.location.href = 'TRANG-CHU.html';
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