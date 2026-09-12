const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const typingContainer = document.getElementById('typingContainer');

// Tự động điều chỉnh chiều cao textarea theo nội dung
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight - 16) + 'px';
});

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Thêm tin nhắn người dùng
    appendMessage(text, 'user');
    userInput.value = '';
    userInput.style.height = '24px';

    // 2. Hiện hiệu ứng gõ phím của Bot
    showTyping(true);

    // 3. Giả lập gọi API (Bạn của bạn sẽ thay đoạn này bằng API thực tế)
    setTimeout(() => {
        showTyping(false);
        appendMessage("Đây là phản hồi mẫu! Bạn của bạn hãy gọi API thực tế ở vị trí này trong file script.js.", 'assistant');
    }, 1200);
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    
    const avatarIcon = sender === 'user' ? 'fa-user' : 'fa-robot';
    
    msgDiv.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid ${avatarIcon}"></i></div>
        <div>
            <div class="msg-content">${escapeHtml(text)}</div>
            <span class="msg-time">${getCurrentTime()}</span>
        </div>
    `;

    chatMessages.insertBefore(msgDiv, typingContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping(show) {
    typingContainer.style.display = show ? 'flex' : 'none';
    chatMessages.appendChild(typingContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}