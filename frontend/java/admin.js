/* 
   AUTO-NEXUS - DASHBOARD INTERACTIVE ENGINE
    */

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    initSidebarNavigation();
    initLiveSearch();
    initActivityFeedSimulation();
    initTableActions();
    initNotificationSystem();
});

/* 
   1. BIỂU ĐỒ DOANH SỐ & TÌM KIẾM (CHART.JS)
    */
let salesChart = null;

function initChart() {
    const ctx = document.getElementById('carSalesChart')?.getContext('2d');
    if (!ctx) return;

    const gradient1 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, 'rgba(0, 242, 254, 0.4)');
    gradient1.addColorStop(1, 'rgba(0, 242, 254, 0)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, 'rgba(127, 0, 255, 0.4)');
    gradient2.addColorStop(1, 'rgba(127, 0, 255, 0)');

    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9'],
            datasets: [
                {
                    label: 'Lượt Xem / Tìm Kiếm Xe',
                    data: [420, 590, 750, 680, 920, 1100, 1350, 1200, 1540],
                    borderColor: '#00f2fe',
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: gradient1,
                    tension: 0.4
                },
                {
                    label: 'Yêu Cầu Lái Thử',
                    data: [120, 180, 240, 200, 310, 450, 520, 490, 680],
                    borderColor: '#7f00ff',
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: gradient2,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#f1f5f9', font: { family: 'Plus Jakarta Sans' } }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#64748b' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#64748b' }
                }
            }
        }
    });
}

/* 
   2. TÌM KIẾM KẾT QUẢ TRÊN BẢNG (LIVE SEARCH FILTER)
    */
function initLiveSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const tableRows = document.querySelectorAll('.tech-table tbody tr');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();

        tableRows.forEach(row => {
            const textContent = row.textContent.toLowerCase();
            if (textContent.includes(keyword)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

/* 
   3. CHUYỂN ĐỔI TAB SIDEBAR & TRẠNG THÁI ACTIVE
    */
function initSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-menu .nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

/* 
   4. MÔ PHỎNG HOẠT ĐỘNG NGƯỜI DÙNG THỜI GIAN THỰC (REALTIME FEED)
    */
function initActivityFeedSimulation() {
    const logList = document.querySelector('.log-list');
    if (!logList) return;

    const sampleActivities = [
        { icon: 'fa-cart-shopping', color: 'var(--accent-green)', text: '<b>Trần Minh K</b> vừa đặt cọc 50 triệu cho <b>Ford Everest</b>' },
        { icon: 'fa-eye', color: 'var(--primary-cyan)', text: '<b>Lê Thu H</b> đang xem đánh giá <b>Hyundai Tucson 2024</b>' },
        { icon: 'fa-shield-halved', color: 'var(--accent-pink)', text: '<b>Bùi Hoàng L</b> yêu cầu gói thẩm định 160 điểm kỹ thuật' },
        { icon: 'fa-comments-dollar', color: '#ffc107', text: '<b>Đỗ Anh T</b> gửi đề xuất giảm giá 15tr cho <b>Honda CR-V</b>' },
        { icon: 'fa-calendar-check', color: 'var(--accent-purple)', text: '<b>Phạm Ngọc M</b> đặt hẹn giao xe tận nhà' }
    ];

    setInterval(() => {
        const randomItem = sampleActivities[Math.floor(Math.random() * sampleActivities.length)];
        
        const newLog = document.createElement('li');
        newLog.className = 'log-item';
        newLog.style.opacity = '0';
        newLog.style.transform = 'translateY(-10px)';
        newLog.style.transition = 'all 0.5s ease';

        newLog.innerHTML = `
            <div class="log-info">
                <i class="fa-solid ${randomItem.icon}" style="color: ${randomItem.color};"></i>
                <span>${randomItem.text}</span>
            </div>
            <span class="log-time">Vừa xong</span>
        `;

        logList.insertBefore(newLog, logList.firstChild);

        // Animation xuất hiện
        requestAnimationFrame(() => {
            newLog.style.opacity = '1';
            newLog.style.transform = 'translateY(0)';
        });

        // Giữ tối đa 5 item trong danh sách
        if (logList.children.length > 5) {
            logList.removeChild(logList.lastChild);
        }
    }, 7000); // 7 giây thêm 1 hoạt động mới
}

/* 
   5. XỬ LÝ THAO TÁC TRÊN BẢNG (DUYỆT TIN & THÂM ĐỊNH)
    */
function initTableActions() {
    const editIcons = document.querySelectorAll('.tech-table tbody .fa-pen-to-square');

    editIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const userName = row.children[0].querySelector('strong').innerText;
            const carModel = row.children[2].innerText;
            const statusTag = row.children[4].querySelector('.status-tag');

            const confirmAction = confirm(`Bạn muốn thay đổi trạng thái phê duyệt cho tin đăng xe "${carModel}" của khách hàng ${userName}?`);
            
            if (confirmAction) {
                statusTag.className = 'status-tag status-online';
                statusTag.innerText = 'Đã Duyệt';
                showNotification(`Đã cập nhật trạng thái tin đăng của ${userName}!`);
            }
        });
    });
}

/* 
   6. HỆ THỐNG THÔNG BÁO POPUP KHI CÓ THAO TÁC
    */
function initNotificationSystem() {
    const bellIcon = document.querySelector('.action-icon .fa-bell');
    if (bellIcon) {
        bellIcon.parentElement.addEventListener('click', () => {
            showNotification('Bạn có 3 yêu cầu duyệt giá chưa xử lý!');
        });
    }
}

function showNotification(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(13, 22, 41, 0.95);
        border: 1px solid var(--primary-cyan);
        color: #fff;
        padding: 12px 20px;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
        z-index: 1000;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
    `;
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--primary-cyan);"></i> ${message}`;
    
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}