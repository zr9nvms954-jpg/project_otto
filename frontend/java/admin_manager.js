/* ==========================================================================
   AUTO-NEXUS ADMIN MANAGER - JAVASCRIPT LOGIC & CHARTS
   ========================================================================== */

// Base URL Backend NodeJS (Kết nối MySQL car_showroom)
const BASE_URL = 'http://localhost:5000';

let globalOrders = [];
let globalCars = [];
let salesChartInstance = null;
let reportRevenueChartInstance = null;
let ordersChartInstance = null;

// Format tiền tệ VNĐ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) || 0);
}

/* --------------------------------------------------------------------------
   1. KHỞI TẠO VÀ TỰ ĐỘNG CẬP NHẬT TỪ SQL (POLLING)
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initSidebarMobile();

    // Đọc dữ liệu từ Database ngay khi load trang
    await fetchAllDataFromDB();

    // Tự động gọi API quét MySQL mỗi 3 giây để cập nhật tức thì khi có đơn/xe mới
    setInterval(fetchAllDataFromDB, 3000);
});

async function fetchAllDataFromDB() {
    await Promise.all([loadOrdersFromDB(), loadCarsFromDB()]);
}

/* --------------------------------------------------------------------------
   2. TRUY VẤN DỮ LIỆU ĐƠN HÀNG TỪ BẢNG orders
   -------------------------------------------------------------------------- */
async function loadOrdersFromDB() {
    try {
        const response = await fetch(`${BASE_URL}/api/orders?_t=${Date.now()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data)) {
            globalOrders = data;
            renderDashboardStats();
            renderOrdersTable();
            initCharts();
        }
    } catch (error) {
        console.error('Lỗi khi truy vấn dữ liệu đơn hàng từ MySQL:', error.message);
    }
}

/* --------------------------------------------------------------------------
   3. TRUY VẤN DỮ LIỆU XE TỪ 6 BẢNG (audi, bmw, bugatti, ferrari, lamborghini, mec)
   -------------------------------------------------------------------------- */
async function loadCarsFromDB() {
    try {
        // Danh sách 6 hãng tương ứng 6 bảng xe trong database car_showroom
        const brands = ['audi', 'bmw', 'bugatti', 'ferrari', 'lamborghini', 'mec'];

        // Thử gọi API tổng hợp /api/cars trước
        const resSingle = await fetch(`${BASE_URL}/api/cars?_t=${Date.now()}`, { cache: 'no-store' });

        if (resSingle.ok) {
            const data = await resSingle.json();
            if (Array.isArray(data)) globalCars = data;
        } else {
            // Nếu Backend tách riêng 6 route (VD: /api/cars/audi, /api/cars/bmw...)
            const carRequests = brands.map(brand =>
                fetch(`${BASE_URL}/api/cars/${brand}?_t=${Date.now()}`, { cache: 'no-store' })
                    .then(res => res.ok ? res.json() : [])
                    .then(data => data.map(car => ({ ...car, brand: car.brand || brand })))
                    .catch(() => [])
            );

            const results = await Promise.all(carRequests);
            globalCars = results.flat(); // Gộp dữ liệu từ 6 bảng lại thành 1 mảng
        }

        renderCarsTable();
        renderDashboardStats();
    } catch (error) {
        console.error('Lỗi khi truy vấn dữ liệu các hãng xe từ MySQL:', error.message);
    }
}

/* --------------------------------------------------------------------------
   4. RENDER THỐNG KÊ (STATS CARDS)
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
    if (repCars) repCars.innerText = totalCarsCount;
    if (repUsers) repUsers.innerText = totalUsers;
}

/* --------------------------------------------------------------------------
   5. RENDER BẢNG ĐƠN HÀNG VÀ BẢNG XE TỪ MYSQL
   -------------------------------------------------------------------------- */
function renderOrdersTable() {
    const ordersBody = document.getElementById('ordersBody');
    const recentOrders = document.getElementById('recentOrders');

    if (!ordersBody) return;

    if (globalOrders.length === 0) {
        ordersBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 20px; color: #94a3b8;">Đang kết nối lấy dữ liệu đơn hàng từ Database...</td></tr>`;
        return;
    }

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
    const carsBody = document.getElementById('carsBody') || document.querySelector('#cars-table tbody') || document.querySelector('.page#cars tbody');
    if (!carsBody) return;

    if (globalCars.length === 0) {
        carsBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: #94a3b8;">Chưa có dữ liệu xe từ Database.</td></tr>`;
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
      <td><span class="badge badge-info">${(car.brand || car.brand_name || 'AUTO').toUpperCase()}</span></td>
      <td style="color: var(--accent-cyan); font-weight: 700;">${formatCurrency(car.price || car.gia)}</td>
      <td>${car.year || car.nam_san_xuat || '2026'}</td>
      <td>${car.fuel || car.nhien_lieu || 'Xăng / Điện'}</td>
      <td>${car.transmission || car.hop_so || 'Tự động'}</td>
      <td><span class="badge badge-success">${car.status || 'Còn hàng'}</span></td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="showToast('Sửa thông tin xe')">
          <i class="fa-solid fa-pen"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

/* --------------------------------------------------------------------------
   6. VẼ BIỂU ĐỒ BẰNG CHART.JS DỰA TRÊN DỮ LIỆU THỰC
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
   7. ĐIỀU HƯỚNG & TIỆN ÍCH
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