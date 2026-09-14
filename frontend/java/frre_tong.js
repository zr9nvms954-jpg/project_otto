document.addEventListener('DOMContentLoaded', () => {
    // Tối ưu quét danh sách thẻ xe
    document.querySelectorAll('.car-card').forEach(card => {
        const video = card.querySelector('.hover-video');
        if (!video) return;

        // Phát video mượt mà & bắt lỗi Autoplay gọn gàng
        card.addEventListener('mouseenter', () => {
            video.play().catch(error => console.debug('Video autoplay blocked:', error));
        });

        // Dừng và tua lại từ đầu khi rời chuột
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.car-card').forEach(card => {
        const video = card.querySelector('.hover-video');
        if (!video) return;

        card.addEventListener('mouseenter', () => {
            video.play().catch(error => console.debug('Autoplay blocked:', error));
        });

        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
});