document.addEventListener('DOMContentLoaded', () => {
    // Tự động tìm tất cả các khung xe có trên trang web
    const carCards = document.querySelectorAll('.car-card');

    carCards.forEach(card => {
        const video = card.querySelector('.hover-video');

        if (video) {
            // Khi di chuột vào thẻ xe: Tự động phát video
            card.addEventListener('mouseenter', () => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Video phát tự động bị trình duyệt chặn:", error);
                    });
                }
            });

            // Khi rời chuột khỏi thẻ xe: Dừng video và tua lại từ đầu
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Tự động tìm tất cả các khung xe có trên trang web
    const carCards = document.querySelectorAll('.car-card');

    carCards.forEach(card => {
        const video = card.querySelector('.hover-video');
        const audioId = card.getAttribute('data-audio'); // Lấy ID audio từ data-audio
        const audio = audioId ? document.getElementById(audioId) : null;

        if (video) {
            // Khi di chuột vào thẻ xe: Tự động phát video + audio
            card.addEventListener('mouseenter', () => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Video phát tự động bị trình duyệt chặn:", error);
                    });
                }
                
                // Phát audio
                if (audio) {
                    audio.currentTime = 0;
                    audio.play().catch(error => {
                        console.log("Audio phát tự động bị trình duyệt chặn:", error);
                    });
                }
            });

            // Khi rời chuột khỏi thẻ xe: Dừng video + audio
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
                
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        }
    });
});

// KỊCH BẢN GIẢ LẬP PHÂN QUYỀN (MOCK AUTH)
document.addEventListener('DOMContentLoaded', () => {
    // THAY ĐỔI BIẾN NÀY ĐỂ TEST ('guest', 'customer', hoặc 'admin')
    let currentRole = 'customer'; 

    // Lấy các nút theo ID
    const btnAdminClient = document.getElementById('btn-admin-client');
    const btnAdminManager = document.getElementById('btn-admin-manager');
    const btnAccount = document.getElementById('btn-account');

    // Mặc định luôn ẩn nút Admin Manager khi mới vào trang (đề phòng HTML chưa có class hidden)
    if (btnAdminManager) {
        btnAdminManager.classList.add('hidden');
    }

    // 1. NẾU LÀ CHỦ (ADMIN) ĐĂNG NHẬP
    if (currentRole === 'admin') {
        if (btnAdminManager) btnAdminManager.classList.remove('hidden'); 
        if (btnAdminClient) btnAdminClient.classList.add('hidden');  
        
        if (btnAccount) {
            btnAccount.innerHTML = 'Chào, Admin'; 
            btnAccount.href = '#'; 
            
            // THÊM ĐOẠN NÀY VÀO ĐỂ TẠO SỰ KIỆN KHI BẤM
            btnAccount.addEventListener('click', function(event) {
                event.preventDefault(); // Ngăn trình duyệt nhảy trang
                
                // Giả lập hiện một menu hoặc hỏi đăng xuất
                let xacNhan = confirm('Bạn đang bấm vào Menu Tài Khoản.\nBạn có muốn Đăng xuất không?');
                
                if (xacNhan) {
                    alert('Đã đăng xuất thành công! Trả về giao diện Khách.');
                    // (Sau này Backend sẽ xóa Token ở đây)
                }
            });
        }
    }
    // 2. NẾU LÀ KHÁCH HÀNG ĐĂNG NHẬP
    else if (currentRole === 'customer') {
        if (btnAdminClient) btnAdminClient.classList.add('hidden'); // Ẩn luôn nút Admin cũ
        
        if (btnAccount) {
            btnAccount.innerHTML = 'Hồ Sơ Của Tôi';
            btnAccount.href = '/HE-thong/ADMIN.html';
        }
    } 
    // 3. NẾU CHƯA ĐĂNG NHẬP (GUEST)
    else {
        if (btnAdminClient) btnAdminClient.classList.add('hidden'); // Giấu nút Admin
        // Nút Account giữ nguyên chữ "Account" như trong HTML gốc
    }
});