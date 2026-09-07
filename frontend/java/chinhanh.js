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