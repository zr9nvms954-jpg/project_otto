// 1. TRẠNG THÁI HỆ THỐNG (STATE - Rỗng chờ Backend)
const state = {
    page: "dashboard",
    brands: [], cars: [], inventory: [], orders: [], users: [], reviews: [],
    charts: { sales: null, revenue: null, orders: null }
};

// 2. KHỞI TẠO APP
document.addEventListener("DOMContentLoaded", () => {
    setupUI(); setupForms(); renderAll(); 
    // Bỏ comment dòng dưới khi có API:
    // loadAllDataFromAPI(); 
});

// 3. ĐIỀU HƯỚNG & GIAO DIỆN (UI)
function setupUI() {
    document.querySelectorAll(".nav-item").forEach(i => i.addEventListener("click", () => goTo(i.dataset.page)));
    document.getElementById("mobileMenu")?.addEventListener("click", () => toggleSidebar(true));
    document.getElementById("overlay")?.addEventListener("click", () => toggleSidebar(false));
    document.querySelectorAll(".modal-backdrop").forEach(b => b.addEventListener("click", e => { if (e.target === b) closeModal(b.id); }));
    
    // Nút tiện ích
    document.getElementById("notificationBtn")?.addEventListener("click", () => showToast("Không có thông báo mới."));
    document.getElementById("logoutBtn")?.addEventListener("click", () => showToast("Chờ API đăng xuất..."));
}

function goTo(page) {
    if (!page) return; state.page = page;
    document.querySelectorAll(".nav-item").forEach(x => x.classList.toggle("active", x.dataset.page === page));
    document.querySelectorAll(".page").forEach(x => x.classList.toggle("active", x.id === page));
    toggleSidebar(false); window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleSidebar(show) {
    document.getElementById("sidebar")?.classList.toggle("open", show);
    document.getElementById("overlay")?.classList.toggle("show", show);
}

window.openModal = id => document.getElementById(id)?.classList.add("open");
window.closeModal = id => document.getElementById(id)?.classList.remove("open");
window.showToast = msg => { 
    const t = document.getElementById("toast"); if(!t) return; 
    t.querySelector("span").textContent = msg; t.classList.add("show"); 
    clearTimeout(window.tTimer); window.tTimer = setTimeout(() => t.classList.remove("show"), 2600); 
};

// 4. XỬ LÝ FORM THÊM/SỬA (CRUD LOGIC)
function setupForms() {
    // Form thêm Hãng
    document.getElementById("brandForm")?.addEventListener("submit", e => {
        e.preventDefault(); const fd = new FormData(e.target), name = fd.get("brandName"), country = fd.get("country");
        if (!name || !country) return showToast("Vui lòng điền đủ thông tin.");
        // Gắn API POST ở đây. Tạm thời đẩy vào State:
        state.brands.push({ id: Date.now(), name, country, status: fd.get("status"), models: 0, createdAt: new Date().toLocaleDateString() });
        e.target.reset(); closeModal("brandModal"); renderBrands(); showToast("Đã thêm hãng xe.");
    });

    // Form thêm Xe
    document.getElementById("carForm")?.addEventListener("submit", e => {
        e.preventDefault(); const fd = new FormData(e.target), model = fd.get("modelName"), price = fd.get("price");
        if (!model || !price) return showToast("Vui lòng điền đủ thông tin.");
        // Gắn API POST ở đây. Tạm thời đẩy vào State:
        state.cars.push({ id: Date.now(), modelName: model, price, year: fd.get("year"), status: fd.get("status") });
        e.target.reset(); closeModal("carModal"); renderCars(); showToast("Đã thêm xe.");
    });
}

// Hàm Xóa (Gọi từ nút thùng rác trên bảng)
window.deleteItem = (type, id) => {
    if (confirm("Xác nhận xóa bản ghi này?")) {
        state[type] = state[type].filter(item => item.id !== id);
        renderAll(); showToast("Đã xóa thành công.");
        // Gắn API DELETE ở đây
    }
};

// 5. RENDER DỮ LIỆU RA BẢNG (HTML DOM)
function renderAll() { renderBrands(); renderCars(); renderOrders(); /* renderUsers(); renderReviews(); */ }

function getTbody(tableId) { 
    return document.querySelector(`#${tableId} tbody`); 
}

function emptyRow(cols, msg) { 
    return `<tr><td colspan="${cols}" style="text-align:center; padding:20px; color:#718096">${msg}</td></tr>`; 
}

function renderBrands() {
    const tbody = getTbody("brandsTable"); if (!tbody) return;
    if (state.brands.length === 0) return tbody.innerHTML = emptyRow(7, "Chưa có hãng xe nào.");
    tbody.innerHTML = state.brands.map(b => `<tr>
        <td><b>${b.name}</b></td><td>${b.country}</td><td>${b.models}</td>
        <td><span class="badge ${b.status === 'Active' ? 'success' : 'neutral'}">${b.status}</span></td>
        <td>${b.createdAt}</td>
        <td class="row-actions">
            <button class="row-btn" onclick="openModal('brandModal')"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="row-btn delete" onclick="deleteItem('brands', ${b.id})"><i class="fa-regular fa-trash-can"></i></button>
        </td>
    </tr>`).join('');
}

function renderCars() {
    const tbody = getTbody("carsTable"); if (!tbody) return;
    if (state.cars.length === 0) return tbody.innerHTML = emptyRow(8, "Chưa có mẫu xe nào.");
    tbody.innerHTML = state.cars.map(c => `<tr>
        <td><b>${c.modelName}</b></td><td>${c.price}</td><td>${c.year}</td>
        <td><span class="badge ${c.status === 'Available' ? 'success' : 'neutral'}">${c.status}</span></td>
        <td class="row-actions">
            <button class="row-btn delete" onclick="deleteItem('cars', ${c.id})"><i class="fa-regular fa-trash-can"></i></button>
        </td>
    </tr>`).join('');
}

function renderOrders() {
    const tbody = getTbody("ordersTable"), recentTbody = getTbody("recentOrders");
    const noData = emptyRow(8, "Chưa có đơn hàng nào.");
    if (tbody) tbody.innerHTML = state.orders.length ? "" /* Map giống trên */ : noData;
    if (recentTbody) recentTbody.innerHTML = state.orders.length ? "" : emptyRow(6, "Chưa có đơn hàng.");
}

// 6. LỚP GIAO TIẾP MÁY CHỦ (API LAYER)
const API = {
    baseURL: "http://localhost:3000", // Đổi thành link thật sau
    async request(endpoint, method = "GET", data = null) {
        const options = { method, headers: data ? { "Content-Type": "application/json" } : {} };
        if (data) options.body = JSON.stringify(data);
        const res = await fetch(`${this.baseURL}${endpoint}`, options);
        if (!res.ok) throw new Error(`Lỗi gọi API: ${endpoint}`);
        return res.json();
    },
    get(ep) { return this.request(ep); },
    post(ep, data) { return this.request(ep, "POST", data); },
    delete(ep) { return this.request(ep, "DELETE"); }
};

// Hàm tải dữ liệu tổng
async function loadAllDataFromAPI() {
    try {
        const [brands, cars, orders] = await Promise.all([
            API.get("/api/brands"), API.get("/api/cars"), API.get("/api/orders")
        ]);
        state.brands = brands || []; state.cars = cars || []; state.orders = orders || [];
        renderAll();
    } catch (e) {
        showToast("Chưa kết nối được Backend.");
        console.error(e);
    }
}