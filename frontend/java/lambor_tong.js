document.addEventListener('DOMContentLoaded', () => {
    // Tìm tất cả các thẻ chứa xe có class .car-card
    const carCards = document.querySelectorAll('.car-card');

    carCards.forEach(card => {
        // Tìm thẻ video bên trong thẻ xe
        const video = card.querySelector('.hover-video');

        if (video) {
            // Khi di chuột vào thẻ xe: Tự động phát video
            card.addEventListener('mouseenter', () => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Phát video tự động bị trình duyệt chặn:", error);
                    });
                }
            });

            // Khi rời chuột khỏi thẻ xe: Dừng video và tua lại từ đầu (0s)
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
});