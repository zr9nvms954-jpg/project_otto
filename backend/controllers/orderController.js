/* ==========================================================================
   AUTO-NEXUS ADMIN MANAGER - JAVASCRIPT LOGIC & CHARTS (AUTO REFRESH FIXED)
   ========================================================================== */

// 1. DỮ LIỆU DỰ PHÒNG TỪ BẢNG car_showroom.orders
const DEFAULT_ORDERS_DATA = [
    { order_id: 1, user_id: 6, fullname: 'Chưa cập nhật', phone: 'Chưa cập nhật', address: 'Chưa cập nhật', total_amount: 12000000000, status: 'completed', order_date: '2026-09-23 00:36:49' },
    { order_id: 2, user_id: 6, fullname: 'Chưa cập nhật', phone: 'Chưa cập nhật', address: 'Chưa cập nhật', total_amount: 60000000000, status: 'completed', order_date: '2026-09-23 00:41:33' },
    { order_id: 3, user_id: 5, fullname: 'hellotest23864', phone: '0367823165', address: 'Hà Nội', total_amount: 465000000, status: 'completed', order_date: '2026-09-23 00:44:17' },
    { order_id: 4, user_id: 7, fullname: 'checkmuasam12', phone: '0399217441', address: 'Xuân Phương, Hà Nội', total_amount: 2500000000, status: 'completed', order_date: '2026-09-23 00:47:23' },
    { order_id: 5, user_id: 2, fullname: 'Test123467890', phone: '1234567890', address: 'Tp.HCM', total_amount: 450000000, status: 'completed', order_date: '2026-09-23 00:52:31' },
    { order_id: 6, user_id: 5, fullname: 'hellotest23864', phone: '0399217661', address: 'Nghệ An', total_amount: 560000000, status: 'completed', order_date: '2026-09-23 01:42:30' }
];

const BASE_URL = 'http://localhost:5000';

let globalOrders = [];
let globalCars = [];
let salesChartInstance = null;
let reportRevenueChartInstance = null;
let ordersChartInstance = null;

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) || 0);
}

/* --------------------------------------------------------------------------
   2. KHỞI TẠO VÀ TỰ ĐỘNG CẬP NHẬT (POLLING)
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initSidebarMobile();

    // Tải dữ liệu lần đầu
    await fetchAllData();

    // TỰ ĐỘNG CẬP NHẬT DỮ LIỆU MỖI 5 GIÂY (Giúp nhận đơn hàng mới ngay lập tức)
    setInterval(async () => {
        await fetchAllData();
    }, 5000);
});

async function fetchAllData() {
    await Promise.all([loadOrdersData(), loadCarsData()]);
}

// Hàm fetch Orders chống Cache hoàn toàn
async function loadOrdersData() {
    try {
        // Thêm timestamp ?_t=... để xóa triệt để Cache của Browser
        const response = await fetch(`${BASE_URL}/api/orders?_t=${Date.now()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store' // Ngăn chặn Browser lưu cache
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        globalOrders = (Array.isArray(data) && data.length > 0) ? data : DEFAULT_ORDERS_DATA;
    } catch (error) {
        console.warn('Lỗi fetch API Orders:', error);
        if (globalOrders.length === 0) globalOrders = DEFAULT_ORDERS_DATA;
    }

    renderDashboardStats();
    renderOrdersTable();
    initCharts();
}

// Hàm fetch Cars chống Cache
async function loadCarsData() {
    try {
        const response = await fetch(`${BASE_URL}/api/cars?_t=${Date.now()}`, {
            cache: 'no-store'
        });
        if (response.ok) {
            globalCars = await response.json();
        } else {
            const brands = ['audi', 'bmw', 'bugatti', 'ferrari', 'lamborghini', 'mec'];
            const carRequests = brands.map(brand =>
                fetch(`${BASE_URL}/api/cars_${brand}?_t=${Date.now()}`, { cache: 'no-store' })
                    .then(res => res.ok ? res.json() : [])
                    .then(data => data.map(car => ({ ...car, brand: brand })))
                    .catch(() => [])
            );
            const results = await Promise.all(carRequests);
            globalCars = results.flat();
        }
    } catch (error) {
        console.warn('Lỗi fetch API Cars:', error);
    }

    renderCarsTable();
    renderDashboardStats();
}

/* --------------------------------------------------------------------------
   3. RENDER THỐNG KÊ (STATS CARDS)
   -------------------------------------------------------------------------- */
function renderDashboardStats() {
    const totalOrders = globalOrders.length;
    const totalRevenue = globalOrders.reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
    const totalUsers = new Set(globalOrders.map(o => o.user_id)).size;
    const totalCarsCount = globalCars.length;

    const statOrders = document.getElementById('stat-orders');
    const statRevenue = document.getElementById('stat-revenue');
    const statUsers = document.getElementById('stat-users');
    const statCars = document.getElementById('stat-cars');

    if (statOrders) statOrders.innerText = totalOrders;
    if (statRevenue) statRevenue.innerText = formatCurrency(totalRevenue);
    if (statUsers) statUsers.innerText = totalUsers;
    if (statCars) statCars.innerText = totalCarsCount;

    const repRevenue = document.getElementById('rep-revenue');
    const repOrders = document.getElementById('rep-orders');
    const repCars = document.getElementById('rep-cars');
    const repUsers = document.getElementById('rep-users');

    if (repRevenue) repRevenue.innerText = formatCurrency(totalRevenue);
    if (repOrders) repOrders.innerText = totalOrders;
    if (repCars) repCars.innerText = totalCarsCount || totalOrders;
    if (repUsers) repUsers.innerText = totalUsers;
}

/* --------------------------------------------------------------------------
   4. RENDER BẢNG ĐƠN HÀNG VÀ BẢNG XE
   -------------------------------------------------------------------------- */
function renderOrdersTable() {
    const ordersBody = document.getElementById('ordersBody');
    const recentOrders = document.getElementById('recentOrders');

    if (!ordersBody) return;

    ordersBody.innerHTML = globalOrders.map(order => `
    <tr>
      <td>#${order.order_id}</td>
      <td>${order.user_id}</td>
      <td><strong>${order.fullname && order.fullname !== 'NULL' ? order.fullname : 'Chưa cập nhật'}</strong></td>
      <td>${order.phone && order.phone !== 'NULL' ? order.phone : 'Chưa cập nhật'}</td>
      <td>${order.address && order.address !== 'NULL' ? order.address : 'Chưa cập nhật'}</td>
      <td style="color: var(--accent-cyan); font-weight: 700;">${formatCurrency(order.total_amount)}</td>
      <td><span class="badge badge-success">${order.status || 'completed'}</span></td>
      <td>${order.order_date || ''}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="showToast('Xem chi tiết đơn #${order.order_id}')">
          <i class="fa-solid fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');

    if (recentOrders) {
        const recentData = [...globalOrders].reverse().slice(0, 5);
        recentOrders.innerHTML = recentData.map(order => `
      <tr>
        <td>#${order.order_id}</td>
        <td>${order.fullname && order.fullname !== 'NULL' ? order.fullname : 'Chưa cập nhật'}</td>
        <td>${order.phone && order.phone !== 'NULL' ? order.phone : 'Chưa cập nhật'}</td>
        <td>${order.address && order.address !== 'NULL' ? order.address : 'Chưa cập nhật'}</td>
        <td style="color: var(--accent-cyan); font-weight: 700;">${formatCurrency(order.total_amount)}</td>
        <td><span class="badge badge-success">${order.status || 'completed'}</span></td>
        <td>${order.order_date || ''}</td>
      </tr>
    `).join('');
    }
}

function renderCarsTable() {
    const carsBody = document.getElementById('carsBody') || document.querySelector('#cars-table tbody') || document.querySelector('tbody');
    if (!carsBody) return;

    if (globalCars.length === 0) {
        carsBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: #94a3b8;">Chưa có dữ liệu xe từ API.</td></tr>`;
        return;
    }

    carsBody.innerHTML = globalCars.map(car => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
          ${car.image_url ? `<img src="${car.image_url}" style="width: 45px; height: 30px; object-fit: cover; border-radius: 4px;">` : ''}
          <strong>${car.name || car.car_name || car.model || 'Dòng xe cao cấp'}</strong>
        </div>
      </td>
      <td><span class="badge badge-info">${(car.brand || car.brand_name || 'Xe').toUpperCase()}</span></td>
      <td style="color: var(--accent-cyan); font-weight: 700;">${formatCurrency(car.price || car.gia)}</td>
      <td>${car.year || car.nam_san_xuat || '2026'}</td>
      <td>${car.fuel || car.nhien_lieu || 'Xăng / Điện'}</td>
      <td>${car.transmission || car.hop_so || 'Tự động'}</td>
      <td><span class="badge badge-success">${car.status || 'Còn hàng'}</span></td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="showToast('Cập nhật thông tin xe')">
          <i class="fa-solid fa-pen"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

/* --------------------------------------------------------------------------
   5. VẼ BIỂU ĐỒ BẰNG CHART.JS
   -------------------------------------------------------------------------- */
function initCharts() {
    if (globalOrders.length === 0) return;

    const salesCtx = document.getElementById('salesChart')?.getContext('2d');
    if (salesCtx) {
        if (salesChartInstance) salesChartInstance.destroy();
        salesChartInstance = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: globalOrders.map(o => `Đơn #${o.order_id}`),
                datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: globalOrders.map(o => Number(o.total_amount)),
                    borderColor: '#00f2fe',
                    backgroundColor: 'rgba(0, 242, 254, 0.15)',
                    fill: true,
                    tension: 0.35,
                    pointRadius: 6,
                    pointBackgroundColor: '#00f2fe'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#94a3b8' } } },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: '#26334d' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: '#26334d' } }
                }
            }
        });
    }

    const reportRevenueCtx = document.getElementById('reportRevenueChart')?.getContext('2d');
    if (reportRevenueCtx) {
        if (reportRevenueChartInstance) reportRevenueChartInstance.destroy();

        const userMap = {};
        globalOrders.forEach(o => {
            const name = (o.fullname && o.fullname !== 'NULL') ? o.fullname : `User #${o.user_id}`;
            userMap[name] = (userMap[name] || 0) + Number(o.total_amount);
        });

        reportRevenueChartInstance = new Chart(reportRevenueCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(userMap),
                datasets: [{
                    label: 'Chi tiêu (VNĐ)',
                    data: Object.values(userMap),
                    backgroundColor: ['#00f2fe', '#4facfe', '#7f00ff', '#ffb703'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#94a3b8' } } },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: '#26334d' } }
                }
            }
        });
    }

    const ordersCtx = document.getElementById('ordersChart')?.getContext('2d');
    if (ordersCtx) {
        if (ordersChartInstance) ordersChartInstance.destroy();
        ordersChartInstance = new Chart(ordersCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending', 'Cancelled'],
                datasets: [{
                    data: [globalOrders.length, 0, 0],
                    backgroundColor: ['#00e676', '#ffb703', '#ff4d4d'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
            }
        });
    }
}

/* --------------------------------------------------------------------------
   6. ĐIỀU HƯỚNG & TIỆN ÍCH
   -------------------------------------------------------------------------- */
function initNavigation() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', () => {
            goTo(item.getAttribute('data-page'));
        });
    });
}

function goTo(pageId) {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');

    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('overlay')?.classList.remove('active');
}

function initSidebarMobile() {
    const mobileMenuBtn = document.getElementById('mobileMenu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.querySelector('span').innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}