document.addEventListener('DOMContentLoaded', () => {
    const carCards = document.querySelectorAll('.car-card');

    // 1. Kích hoạt hiệu ứng hiện card khi cuộn tới
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    // 2. Lắng nghe Scroll Observer & Xử lý Hover Video
    carCards.forEach(card => {
        observer.observe(card);

        const video = card.querySelector('.hover-video');

        if (video) {
            video.muted = true; // Bắt buộc muted để autoplay/play JS hoạt động

            card.addEventListener('mouseenter', () => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Trình duyệt chặn phát video:", error);
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
});