const API_URL = 'http://localhost:5001/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');

    //đk
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
                    registerForm.reset();

                    // Đăng ký xong về đăng nhập
                    if (container) {
                        container.classList.remove("active");
                    }
                } else {
                    alert('⚠️ ' + data.message);
                }
            } catch (error) {
                console.error('Lỗi API:', error);
                alert('❌ Không thể kết nối tới Server Backend!');
            }
        });
    }

    //ĐN
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

                    // Lưu 
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // đường dẫn
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