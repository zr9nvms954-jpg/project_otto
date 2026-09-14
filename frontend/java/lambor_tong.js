document.addEventListener('DOMContentLoaded', () => {
    
    // 1. TỰ ĐỘNG PHÁT ÂM THANH ĐỘNG CƠ (ENGINE SOUND)
    const audio = document.getElementById("engine-sound");

    if (audio) {
        // Thử tự động phát tiếng nổ ngay khi nạp trang
        audio.play().catch(() => {
            // Nếu trình duyệt chặn Autoplay, phát âm thanh ngay khi người dùng click / chạm / bấm phím
            const playAudio = () => {
                audio.play();
                ['click', 'touchstart', 'keydown'].forEach(evt => 
                    document.removeEventListener(evt, playAudio)
                );
            };

            ['click', 'touchstart', 'keydown'].forEach(evt => 
                document.addEventListener(evt, playAudio)
            );
        });
    }

    // 2. XỬ LÝ HOVER XEM TRƯỚC VIDEO CHO XE (.CAR-CARD)
    document.querySelectorAll('.car-card').forEach(card => {
        const video = card.querySelector('.hover-video');
        if (!video) return;

        // Rê chuột vào: Phát video xem trước
        card.addEventListener('mouseenter', () => {
            video.play()?.catch(err => console.log("Autoplay video bị chặn:", err));
        });

        // Rời chuột ra: Dừng video và tua lại từ đầu (0s)
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });

});