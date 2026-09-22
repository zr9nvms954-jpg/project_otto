document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CHỈ CHẠY 1 LẦN DUY NHẤT KHI KHỞI ĐỘNG/MỞ WEB
    // ==========================================
    const welcomeAudio = document.getElementById('welcomeAudio');

    // Kiểm tra xem đã từng phát câu chào trong lần mở web này chưa
    const hasWelcomed = sessionStorage.getItem('hasWelcomed');

    if (!hasWelcomed) {
        function playWelcomeSound() {
            if (welcomeAudio) {
                welcomeAudio.currentTime = 0;
                welcomeAudio.play().then(() => {
                    // Khi phát thành công -> Đánh dấu là ĐÃ CHÀO RỒI
                    sessionStorage.setItem('hasWelcomed', 'true');
                }).catch(error => {
                    console.log("Trình duyệt chặn autoplay, chờ tương tác...");
                });
            }
        }

        // Thử phát ngay khi vừa load web
        playWelcomeSound();

        // Trường hợp trình duyệt chặn tự phát, chờ click/chạm lần đầu tiên
        const handleFirstInteraction = () => {
            if (welcomeAudio && !sessionStorage.getItem('hasWelcomed')) {
                welcomeAudio.currentTime = 0;
                welcomeAudio.play().then(() => {
                    sessionStorage.setItem('hasWelcomed', 'true');
                }).catch(e => console.log(e));
            }
            // Hủy sự kiện để không bao giờ nhận click này nữa
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
    }


    // ==========================================
    // 2. PHÁT VIDEO + AUDIO KHI HOVER XE (GIỮ NGUYÊN)
    // ==========================================
    const carCards = document.querySelectorAll('.car-card');

    carCards.forEach(card => {
        const video = card.querySelector('.hover-video');
        const audioId = card.getAttribute('data-audio');
        const audio = audioId ? document.getElementById(audioId) : null;

        if (video) {
            card.addEventListener('mouseenter', () => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Video phát tự động bị trình duyệt chặn:", error);
                    });
                }
                
                if (audio) {
                    audio.currentTime = 0;
                    audio.play().catch(error => {
                        console.log("Audio phát tự động bị trình duyệt chặn:", error);
                    });
                }
            });

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