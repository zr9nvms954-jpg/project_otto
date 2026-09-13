function goToStep2() {
    const name = document.getElementById('buyer-name').value.trim();
    const phone = document.getElementById('buyer-phone').value.trim();

    if (!name || !phone) {
        alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
        return;
    }

    document.getElementById('step-1').classList.remove('active');
    document.getElementById('step-2').classList.add('active');

    const bankId = 'MB';
    const accountNo = '8888999999';
    const amount = '50000000';
    const memo = 'NEXUS EVEREST 7731';

    const qrApiUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(memo)}&accountName=AUTO%20NEXUS%20VIETNAM`;
    document.getElementById('vietqr-img').src = qrApiUrl;
}

function simulatePaymentVerification() {
    const phone = document.getElementById('buyer-phone').value;
    document.getElementById('display-buyer-phone').innerText = phone;

    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-3').classList.add('active');
}

function copyValue(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text);
    alert('Đã sao chép: ' + text);
}