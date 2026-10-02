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
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    const cards = Array.from(track.children);
    const wrapper = document.querySelector('.carousel-3d-wrapper');

    const totalCards = cards.length;
    const angleIncrement = 360 / totalCards;
    
    // Tăng bán kính vòng xoay 3D giúp các Card mở rộng khoảng cách, không bị chồng đè
    const radius = 780; 

    let targetAngle = 0;
    let currentAngle = 0;
    let startX = 0;
    let isDragging = false;
    let previousAngle = 0;

    // Thuật toán Lerp mượt mà (Linear Interpolation)
    function render() {
        // Tạo quán tính lướt êm ái
        currentAngle += (targetAngle - currentAngle) * 0.08;

        cards.forEach((card, index) => {
            const cardAngle = angleIncrement * index + currentAngle;
            card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;

            // Làm mờ và làm ẩn các thẻ ở phía sau
            let normalized = (cardAngle % 360 + 360) % 360;
            if (normalized > 180) normalized = 360 - normalized;

            // Tính toán độ mờ mượt theo góc nhìn
            if (normalized > 80) {
                card.style.opacity = Math.max(0, 1 - (normalized - 80) / 40);
                card.style.pointerEvents = 'none';
            } else {
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
            }
        });

        requestAnimationFrame(render);
    }

    // Bắt đầu vòng lặp Render mượt bằng GPU
    requestAnimationFrame(render);

    // Sự kiện Kéo/Trượt
    function handleStart(e) {
        isDragging = true;
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        previousAngle = targetAngle;
    }

    function handleMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const deltaX = currentX - startX;
        
        // Độ nhạy trượt
        targetAngle = previousAngle + deltaX * 0.22;
    }

    function handleEnd() {
        isDragging = false;
    }

    // Gắn sự kiện Chuột (Desktop)
    wrapper.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    // Gắn sự kiện Cảm ứng (Mobile)
    wrapper.addEventListener('touchstart', handleStart);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    // Tự động phát Video khi di chuột qua thẻ xe
    cards.forEach(card => {
        const video = card.querySelector('.hover-video');
        if (video) {
            card.addEventListener('mouseenter', () => video.play().catch(() => {}));
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
});document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.car-card');

    // Tự động phát video xem trước mượt mà khi rế chuột vào từng xe
    cards.forEach(card => {
        const video = card.querySelector('.hover-video');
        if (video) {
            card.addEventListener('mouseenter', () => {
                video.play().catch(() => {});
            });
            
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
});