document.addEventListener('DOMContentLoaded', () => {

    // 
    // 1. CHỈ CHẠY 1 LẦN DUY NHẤT KHI KHỞI ĐỘNG/MỞ WEB
    // 
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


    // 
    // 2. PHÁT VIDEO + AUDIO KHI HOVER XE (GIỮ NGUYÊN)
    // 
   // Tìm tất cả các thẻ xe có class '.car-card' trên trang
const carCards = document.querySelectorAll('.car-card');

// Duyệt qua từng thẻ xe để cài đặt hiệu ứng riêng cho từng chiếc
carCards.forEach(card => {
    // Tìm video xem trước nằm bên trong thẻ xe hiện tại
    const video = card.querySelector('.hover-video');
    
    // Đọc thuộc tính 'data-audio' ở HTML để lấy ID của file âm thanh tương ứng
    const audioId = card.getAttribute('data-audio');
    
    // Nếu có audioId thì tìm đúng phần tử âm thanh (tiếng động cơ) theo ID đó
    const audio = audioId ? document.getElementById(audioId) : null;

    // Chỉ xử lý nếu thẻ xe đó có chứa video
    if (video) {
        // Khi người dùng rê (hover) chuột vào thẻ xe
        card.addEventListener('mouseenter', () => {
            // Cho video bắt đầu phát
            const playPromise = video.play();
            if (playPromise !== undefined) {
                // Bắt lỗi nếu trình duyệt chặn tự động phát video
                playPromise.catch(error => {
                    console.log("Video phát tự động bị trình duyệt chặn:", error);
                });
            }
            
            // Nếu chiếc xe này có file âm thanh động cơ đi kèm
            if (audio) {
                audio.currentTime = 0; // Tua âm thanh về giây đầu tiên
                // Phát tiếng động cơ xe (và bắt lỗi nếu bị chặn)
                audio.play().catch(error => {
                    console.log("Audio phát tự động bị trình duyệt chặn:", error);
                });
            }
        });

        // Khi người dùng di chuột ra khỏi thẻ xe
        card.addEventListener('mouseleave', () => {
            video.pause();           // Tạm dừng video
            video.currentTime = 0;   // Tua video về giây đầu tiên
            
            if (audio) {
                audio.pause();       // Tắt tiếng động cơ
                audio.currentTime = 0; // Tua âm thanh về giây đầu tiên
            }
        });
    }
});
    });

