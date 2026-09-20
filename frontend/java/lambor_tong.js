document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("engine-sound");

    // Chỉ chạy audio khi thẻ audio tồn tại và src không bị rỗng hoặc '/'
    if (audio && audio.getAttribute("src") && audio.getAttribute("src") !== "/") {
        const playAudio = () => {
            audio.play().catch(() => {});
            document.removeEventListener("click", playAudio);
            document.removeEventListener("touchstart", playAudio);
            document.removeEventListener("keydown", playAudio);
        };
        audio.play().catch(() => {
            document.addEventListener("click", playAudio, { once: true });
            document.addEventListener("touchstart", playAudio, { once: true });
            document.addEventListener("keydown", playAudio, { once: true });
        });
    }

    const cards = document.querySelectorAll(".car-card");

    cards.forEach(function (card) {
        const video = card.querySelector(".hover-video");
        if (!video) return;
        // Cấu hình bắt buộc để trình duyệt cho phép tự động phát video
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;

        // Khi rê chuột vào xe
        card.addEventListener("mouseenter", function () {
            // Đặt thời gian về giây đầu tiên
            video.currentTime = 0;

            // Thực hiện phát video (Đã bỏ video.load() gây đứng/treo video)
            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise.catch(function (error) {
                    console.warn("Không thể phát video:", error);
                });
            }
        });

        // Khi rời chuột khỏi xe
        card.addEventListener("mouseleave", function () {
            video.pause();

            try {
                video.currentTime = 0;
            } catch (error) {
                console.warn("Không thể reset video:", error);
            }
        });
    });

});