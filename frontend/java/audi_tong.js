document.addEventListener('DOMContentLoaded', () => {
    const carCards = document.querySelectorAll('.car-card');

    carCards.forEach(card => {
        const video = card.querySelector('.hover-video');

        if (video) {
            // Khi rê chuột vào: Phát video
            card.addEventListener('mouseenter', () => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Video phát tự động bị trình duyệt chặn:", error);
                    });
                }
            });

            // Khi rời chuột ra: Dừng và tua lại từ đầu
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
});