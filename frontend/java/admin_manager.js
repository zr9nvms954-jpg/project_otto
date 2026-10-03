/* ==========================================================================
   AUTO-NEXUS ADMIN MANAGER - HELIOS PURPLE SYSTEM LOGIC & CHARTS
   ========================================================================== */

const BASE_URL = 'http://localhost:5001';

let globalOrders = [];
let globalCars = [];
let charts = {}; // Lưu trữ instances của Chart.js để hủy/vẽ lại dễ dàng

/* --------------------------------------------------------------------------
   1. KHỞI TẠO HỆ THỐNG & POLLING REALTIME
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initSidebarMobile();
    initTableSearch();

    await fetchAllData();
    setInterval(fetchAllData, 3000); // Tự động đồng bộ với MySQL mỗi 3s
});

async function fetchAllData() {
    await Promise.all([loadOrders(), loadCars()]);
}

const formatVND = (amount) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) || 0);

/* --------------------------------------------------------------------------
   2. TRUY VẤN & RENDER DỮ LIỆU ĐƠN HÀNG (ORDERS)
   -------------------------------------------------------------------------- */
async function loadOrders() {
    try {
        const res = await fetch(`${BASE_URL}/api/orders?_t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        
        const data = await res.json();
        if (Array.isArray(data)) {
            globalOrders = data;
            renderStats();
            renderOrdersTables();
            updateCharts();
        }
    } catch (err) {
        console.error('Lỗi lấy dữ liệu đơn hàng:', err.message);
    }
}

function renderOrdersTables() {
    const ordersBody = document.getElementById('ordersBody');
    const recentOrders = document.getElementById('recentOrders');

    if (!ordersBody) return;

    if (globalOrders.length === 0) {
        ordersBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:var(--text-muted);">Chưa có đơn hàng trong Database.</td></tr>`;
        return;
    }

    const rowHTML = (o) => `
        <tr>
            <td>#${o.order_id}</td>
            <td>${o.user_id || 'N/A'}</td>
            <td><strong>${o.fullname && o.fullname !== 'NULL' ? o.fullname : 'Chưa cập nhật'}</strong></td>
            <td>${o.phone && o.phone !== 'NULL' ? o.phone : 'Chưa cập nhật'}</td>
            <td>${o.address && o.address !== 'NULL' ? o.address : 'Chưa cập nhật'}</td>
            <td style="color: var(--accent-magenta); font-weight: 700;">${formatVND(o.total_amount)}</td>
            <td><span class="badge badge-success">${o.status || 'Completed'}</span></td>
            <td>${o.order_date || ''}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="showToast('Xem chi tiết đơn #${o.order_id}')">
                    <i class="fa-solid fa-eye"></i>
                </button>
            </td>
        </tr>`;

    ordersBody.innerHTML = globalOrders.map(rowHTML).join('');

    if (recentOrders) {
        recentOrders.innerHTML = [...globalOrders].reverse().slice(0, 5).map(o => `
            <tr>
                <td>#${o.order_id}</td>
                <td>${o.fullname && o.fullname !== 'NULL' ? o.fullname : 'Chưa cập nhật'}</td>
                <td>${o.phone && o.phone !== 'NULL' ? o.phone : 'Chưa cập nhật'}</td>
                <td>${o.address && o.address !== 'NULL' ? o.address : 'Chưa cập nhật'}</td>
                <td style="color: var(--accent-magenta); font-weight: 700;">${formatVND(o.total_amount)}</td>
                <td><span class="badge badge-success">${o.status || 'Completed'}</span></td>
                <td>${o.order_date || ''}</td>
            </tr>
        `).join('');
    }
}

/* --------------------------------------------------------------------------
   3. TRUY VẤN & RENDER DỮ LIỆU XE (CARS)
   -------------------------------------------------------------------------- */
async function loadCars() {
    try {
        const brands = ['audi', 'bmw', 'bugatti', 'ferrari', 'lamborghini', 'mec'];
        const resSingle = await fetch(`${BASE_URL}/api/cars?_t=${Date.now()}`, { cache: 'no-store' });

        if (resSingle.ok) {
            const data = await resSingle.json();
            if (Array.isArray(data)) globalCars = data;
        } else {
            const requests = brands.map(b =>
                fetch(`${BASE_URL}/api/cars/${b}?_t=${Date.now()}`, { cache: 'no-store' })
                    .then(r => r.ok ? r.json() : [])
                    .then(list => list.map(car => ({ ...car, brand: car.brand || b })))
                    .catch(() => [])
            );
            const results = await Promise.all(requests);
            globalCars = results.flat();
        }

        renderCarsTable();
        renderPopularCars();
        renderStats();
    } catch (err) {
        console.error('Lỗi lấy dữ liệu xe:', err.message);
    }
}

function renderCarsTable() {
    const carsBody = document.querySelector('#carsTable tbody');
    if (!carsBody) return;

    if (globalCars.length === 0) {
        carsBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--text-muted);">Chưa có dữ liệu xe từ Database.</td></tr>`;
        return;
    }

    carsBody.innerHTML = globalCars.map(car => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${car.image_url ? `<img src="${car.image_url}" style="width: 40px; height: 26px; object-fit: cover; border-radius: 4px;">` : ''}
                    <strong>${car.name || car.car_name || car.model || 'Xe cao cấp'}</strong>
                </div>
            </td>
            <td><span class="badge badge-warning">${(car.brand || 'AUTO').toUpperCase()}</span></td>
            <td style="color: var(--accent-magenta); font-weight: 700;">${formatVND(car.price || car.gia)}</td>
            <td>${car.year || car.nam_san_xuat || '2026'}</td>
            <td>${car.fuel || car.nhien_lieu || 'Xăng / Điện'}</td>
            <td>${car.transmission || car.hop_so || 'Tự động'}</td>
            <td><span class="badge badge-success">${car.status || 'Còn hàng'}</span></td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="showToast('Chỉnh sửa thông tin xe')">
                    <i class="fa-solid fa-pen"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderPopularCars() {
    const popularList = document.getElementById('popularCarsList');
    if (!popularList) return;

    const listData = globalCars.slice(0, 4);
    popularList.innerHTML = listData.map(car => `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--border-color);">
            <div>
                <strong style="display:block; font-size:13px; color:#fff;">${car.name || car.car_name || car.model}</strong>
                <span style="font-size:11px; color:var(--text-muted);">${(car.brand || 'AUTO').toUpperCase()}</span>
            </div>
            <span style="color:var(--accent-purple); font-weight:700; font-size:12px;">${formatVND(car.price || car.gia)}</span>
        </div>
    `).join('');
}

/* --------------------------------------------------------------------------
   4. RENDER DASHBOARD STATS CARDS
   -------------------------------------------------------------------------- */
function renderStats() {
    const totalOrders = globalOrders.length;
    const totalRevenue = globalOrders.reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
    const totalUsers = new Set(globalOrders.map(o => o.user_id)).size;
    const totalCarsCount = globalCars.length;

    const updateText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    updateText('stat-orders', totalOrders);
    updateText('stat-revenue', formatVND(totalRevenue));
    updateText('stat-users', totalUsers);
    updateText('stat-cars', totalCarsCount);

    updateText('rep-revenue', formatVND(totalRevenue));
    updateText('rep-orders', totalOrders);
    updateText('rep-cars', totalOrders);
    updateText('rep-users', totalUsers);
}

/* --------------------------------------------------------------------------
   5. VẼ BIỂU ĐỒ HELIOS PURPLE GLOW (CHART.JS)
   -------------------------------------------------------------------------- */
function updateCharts() {
    if (globalOrders.length === 0) return;

    // Helper tạo gradient Tím Neon
    const createGradient = (ctx) => {
        const g = ctx.createLinearGradient(0, 0, 0, 250);
        g.addColorStop(0, 'rgba(217, 70, 239, 0.4)');
        g.addColorStop(1, 'rgba(168, 85, 247, 0.0)');
        return g;
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: '#9a8fae' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
            y: { ticks: { color: '#9a8fae' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
        }
    };

    // 1. Sales Chart (Line Chart)
    const salesCanvas = document.getElementById('salesChart');
    if (salesCanvas) {
        const ctx = salesCanvas.getContext('2d');
        if (charts.sales) charts.sales.destroy();

        charts.sales = new Chart(ctx, {
            type: 'line',
            data: {
                labels: globalOrders.map(o => `Đơn #${o.order_id}`),
                datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: globalOrders.map(o => Number(o.total_amount)),
                    borderColor: '#d946ef',
                    borderWidth: 3,
                    backgroundColor: createGradient(ctx),
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#a855f7',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 7
                }]
            },
            options: commonOptions
        });
    }

    // 2. Revenue Streams Chart (Bar Chart)
    const reportCanvas = document.getElementById('reportRevenueChart');
    if (reportCanvas) {
        const ctx2 = reportCanvas.getContext('2d');
        if (charts.report) charts.report.destroy();

        const userMap = {};
        globalOrders.forEach(o => {
            const name = (o.fullname && o.fullname !== 'NULL') ? o.fullname : `User #${o.user_id}`;
            userMap[name] = (userMap[name] || 0) + Number(o.total_amount);
        });

        charts.report = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Object.keys(userMap),
                datasets: [{
                    label: 'Chi tiêu',
                    data: Object.values(userMap),
                    backgroundColor: ['#a855f7', '#d946ef', '#ec4899', '#8b5cf6', '#6366f1'],
                    borderRadius: 8
                }]
            },
            options: commonOptions
        });
    }

    // 3. Orders Analytics Chart (Doughnut Chart)
    const ordersCanvas = document.getElementById('ordersChart');
    if (ordersCanvas) {
        const ctx3 = ordersCanvas.getContext('2d');
        if (charts.orders) charts.orders.destroy();

        charts.orders = new Chart(ctx3, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending', 'Cancelled'],
                datasets: [{
                    data: [globalOrders.length, 0, 0],
                    backgroundColor: ['#4ade80', '#facc15', '#f87171'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#f3f0f8', font: { size: 12 } }
                    }
                },
                cutout: '70%'
            }
        });
    }
}

/* --------------------------------------------------------------------------
   6. ĐIỀU HƯỚNG, TÌM KIẾM, MODAL & UTILS
   -------------------------------------------------------------------------- */
function initNavigation() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', () => goTo(item.getAttribute('data-page')));
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/HE-thong/TRANG-CHU.html';
        });
    }
}

function goTo(pageId) {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${pageId}"]`)?.classList.add('active');

    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId)?.classList.add('active');

    document.getElementById('sidebar')?.classList.remove('active');
    document.getElementById('overlay')?.classList.remove('active');
}

function initSidebarMobile() {
    const mobileMenuBtn = document.getElementById('mobileMenu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

// Bộc lọc tìm kiếm realtime trong bảng
function initTableSearch() {
    document.querySelectorAll('.page-search').forEach(input => {
        input.addEventListener('input', (e) => {
            const tableId = e.target.getAttribute('data-table');
            const filter = e.target.value.toLowerCase();
            const rows = document.querySelectorAll(`#${tableId} tbody tr`);

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    });
}

// Modal Toggle
function openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
}

// Toast Thông Báo Phát Sáng
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.querySelector('span').innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}