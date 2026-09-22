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

