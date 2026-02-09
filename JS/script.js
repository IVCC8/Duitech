
// --- DATOS SIMULADOS (MOCK DATA) ---
// Datos simulados de inventario
let products = [
    { id: 1, name: "Laptop Dell XPS 13", price: 25000, stock: 12, brand: "Dell", category: "Laptops" },
    { id: 2, name: "Monitor Samsung 24\"", price: 4500, stock: 8, brand: "Samsung", category: "Monitores" },
    { id: 3, name: "Teclado Mecánico RGB", price: 1200, stock: 25, brand: "Logitech", category: "Accesorios" },
    { id: 4, name: "Mouse Inalámbrico", price: 850, stock: 30, brand: "Logitech", category: "Accesorios" },
    { id: 5, name: "Impresora HP LaserJet", price: 6000, stock: 5, brand: "HP", category: "Impresoras" },
    { id: 6, name: "Cable HDMI 2m", price: 250, stock: 100, brand: "Genérico", category: "Cables" },
    { id: 7, name: "Disco SSD 1TB", price: 2800, stock: 15, brand: "Kingston", category: "Almacenamiento" },
    { id: 8, name: "Tablet Samsung Tab S7", price: 15000, stock: 0, brand: "Samsung", category: "Tablets" }
];

let cart = [];
let currentUserRole = 'admin'; // 'admin' | 'seller' | 'client'

// Datos simulados de Clientes
let customersData = [
    { id: 1, name: "Juan Pérez", email: "juan.perez@email.com", total: 45200, lastBuy: "Hoy", status: "Activo", type: "Regular" },
    { id: 2, name: "Maria Gomez", email: "maria.g@email.com", total: 12500, lastBuy: "20 Oct", status: "Activo", type: "VIP" },
    { id: 3, name: "TecnoSolutions SA", email: "contacto@tecnosol.com", total: 150000, lastBuy: "15 Sep", status: "Corporativo", type: "Corporativo" },
    { id: 4, name: "Luis Ramirez", email: "lramirez@mail.com", total: 0, lastBuy: "-", status: "Prospecto", type: "Regular" }
];

// --- VARIABLES GLOBALES DEL DOM ---
const loginForm = document.getElementById('loginForm');
const loginScreen = document.getElementById('login-screen');
const appContainer = document.getElementById('app-container');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

// --- LÓGICA DE AUTENTICACIÓN Y ROLES ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // 1. Capturamos los elementos por su ID nuevo
    const userInput = document.getElementById('username');
    const passInput = document.getElementById('password');

    // 2. Verificamos que existan (para evitar errores si el HTML está mal)
    if (!userInput || !passInput) {
        console.error("Error: No encuentro los campos 'username' o 'password' en el HTML.");
        alert("Error técnico: Faltan IDs en el HTML.");
        return;
    }

    // 3. Obtenemos los valores y quitamos espacios en blanco accidentales (.trim)
    const user = userInput.value.trim();
    const pass = passInput.value.trim();

    console.log("Intentando login con:", user, pass); 

    if (user === 'admin' && pass === 'admin') {
        loginSuccess('admin', 'Admin User', 'Gerente General');
    } else if (user === 'vendedor' && pass === 'vendedor') {
        loginSuccess('seller', 'Vendedor', 'Ventas Mostrador');
    } else if (user === 'cliente' && pass === 'cliente') {
        loginSuccess('client', 'Cliente Invitado', 'Usuario Registrado');
    } else {
        alert("Credenciales incorrectas.");
    }
});

function loginSuccess(role, name, jobTitle) {
    currentUserRole = role;
    
    // Actualizar perfil en Sidebar
    document.querySelector('.user-profile div div').innerText = name;
    document.querySelector('.user-profile div small').innerText = jobTitle;
    
    // Configurar menú según rol
    configureSidebar(role);

    // Transición
    loginScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
    
    // Redirigir al dashboard correcto o vista principal
    router('dashboard');
}

function configureSidebar(role) {
    // Definir modulos por rol
    const adminModules = ['nav-dashboard', 'nav-inventory', 'nav-orders', 'nav-customers', 'nav-finance', 'nav-docs'];
    const sellerModules = ['nav-dashboard', 'nav-my-orders', 'nav-profile', 'nav-support'];
    const clientModules = ['nav-dashboard', 'nav-catalog', 'nav-client-orders', 'nav-account-statement', 'nav-profile', 'nav-support'];
    
    // Ocultar todo primero
    const allNavs = document.querySelectorAll('.nav-links li');
    allNavs.forEach(li => li.classList.add('hidden'));

    // Mostrar segun rol
    if (role === 'admin') {
        adminModules.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.remove('hidden');
        });
    } else if (role === 'seller') {
        sellerModules.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.remove('hidden');
        });
    } else if (role === 'client') {
        clientModules.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.remove('hidden');
        });
    }
}

function logout() {
    loginScreen.classList.remove('hidden');
    appContainer.classList.add('hidden');
    loginForm.reset();
    currentUserRole = '';
}

// --- NAVEGACIÓN (ROUTER) ---
function router(view) {
    // Protección de rutas: Si un usuario intenta ir a Finanzas, lo mandamos al Dashboard
    if ((currentUserRole === 'seller' || currentUserRole === 'client') && ['finance', 'docs', 'customers', 'inventory', 'orders'].includes(view)) {
        alert("Acceso denegado: Se requieren permisos de administrador.");
        return;
    }

    const content = document.getElementById('content-area');
    const title = document.getElementById('page-title');
    
    // Actualizar link activo
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    const activeLink = document.getElementById('nav-' + view);
    if (activeLink) activeLink.classList.add('active');

    // Cerrar sidebar en móvil al navegar
    if (window.innerWidth <= 768) sidebar.classList.remove('open');

    switch(view) {
        case 'dashboard':
            title.innerText = "Dashboard General - ACTUALIZADO";
            renderDashboard(content);
            break;
        case 'inventory':
            title.innerText = "Gestión de Inventario";
            renderInventory(content);
            break;
        case 'orders':
            title.innerText = "Gestión de Ordenes";
            renderOrders(content);
            break;
        case 'customers':
            title.innerText = "Clientes (CRM)";
            renderCustomers(content);
            break;
        case 'finance':
            title.innerText = "Finanzas y Contabilidad";
            renderFinance(content);
            break;
        case 'docs':
            title.innerText = "Documentación";
            renderDocs(content);
            break;
        case 'my-orders':
            title.innerText = "Mis Pedidos Pasados";
            renderMyOrders(content);
            break;
        case 'profile':
            title.innerText = "Mi Perfil";
            renderProfile(content);
            break;
        case 'support':
            title.innerText = "Centro de Ayuda";
            renderSupport(content);
            break;
        case 'catalog':
            title.innerText = "Catálogo de Productos";
            renderCatalog(content); // Assuming a renderCatalog function exists
            break;
        case 'client-orders':
            title.innerText = "Mis Compras";
            renderClientOrders(content); 
            break;
        case 'account-statement':
            title.innerText = "Estado de Cuenta";
            renderAccountStatement(content);
            break;
    }
}

// --- RENDERIZADO DE VISTAS ---

function renderDashboard(container) {
    // Actualizar fecha en el header
    const dateEl = document.querySelector('.date-display');
    if (dateEl) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        dateEl.innerText = new Date().toLocaleDateString('es-ES', options);
    }

    // --- VISTA ESPECÍFICA PARA VENDEDOR (SELLER) ---
    if (currentUserRole === 'seller') {
        const salesTarget = 5000;
        const currentSales = 4200;
        const progress = Math.min((currentSales / salesTarget) * 100, 100);

        container.innerHTML = 
            '<div class="info-section">' +
                '<h2>Panel de Vendedor</h2>' +
                '<p>Bienvenido de nuevo. Aquí tienes un resumen de tu actividad hoy.</p>' +
            '</div>' +
            
            '<div class="stats-grid">' +
                '<div class="stat-card">' +
                     '<h3><i class="fas fa-wallet"></i> Ventas de Hoy</h3>' +
                     '<div class="value">$ ' + currentSales.toLocaleString() + '</div>' +
                     '<div style="margin-top:10px; background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden;">' +
                        '<div style="width:' + progress + '%; background:var(--color-success, #166534); height:100%;"></div>' +
                     '</div>' +
                     '<small class="text-muted">' + progress.toFixed(0) + '% de la meta diaria ($5,000)</small>' +
                '</div>' +

                '<div class="stat-card" style="cursor:pointer; transition: transform 0.2s;" onclick="router(\'my-orders\')">' +
                   '<h3 style="color: var(--color-primary);"><i class="fas fa-cash-register"></i> Nuevo Pedido</h3>' +
                   '<div class="value" style="font-size: 1.2rem; margin-top: 10px;">Ir al POS</div>' +
                   '<small class="text-muted">Procesar nueva venta</small>' +
                '</div>' +
                
                '<div class="stat-card" style="cursor:pointer; transition: transform 0.2s;" onclick="router(\'my-orders\')">' +
                   '<h3 style="color: var(--color-secondary);"><i class="fas fa-clipboard-list"></i> Historial</h3>' +
                   '<div class="value" style="font-size: 1.2rem; margin-top: 10px;">Mis Pedidos</div>' +
                   '<small class="text-muted">Ver estado de entregas</small>' +
                '</div>' +
            '</div>' +

            '<div class="dashboard-grid">' +
                '<div class="chart-card">' +
                    '<h4><i class="fas fa-filter text-primary"></i> Pipeline de Prospección Digital</h4>' +
                    '<div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; text-align:center; margin-top:1rem;">' +
                        '<div style="background:#e0f2fe; padding:10px; border-radius:8px;">' +
                            '<div style="font-weight:bold; color:#0369a1;">125</div>' +
                            '<small style="font-size:0.7rem;">Leads</small>' +
                        '</div>' +
                        '<div style="background:#e0f7fa; padding:10px; border-radius:8px;">' +
                            '<div style="font-weight:bold; color:#006064;">42</div>' +
                            '<small style="font-size:0.7rem;">Seguimiento</small>' +
                        '</div>' +
                        '<div style="background:#fff3e0; padding:10px; border-radius:8px;">' +
                            '<div style="font-weight:bold; color:#e65100;">18</div>' +
                            '<small style="font-size:0.7rem;">Cotización</small>' +
                        '</div>' +
                        '<div style="background:#e8f5e9; padding:10px; border-radius:8px;">' +
                            '<div style="font-weight:bold; color:#1b5e20;">9</div>' +
                            '<small style="font-size:0.7rem;">Cierres</small>' +
                        '</div>' +
                    '</div>' +
                    '<button class="btn-primary" style="margin-top:1rem; width:100%; font-size:0.8rem;" onclick="alert(\'CRM Sincronizado con éxito\')">Sincronizar CRM</button>' +
                '</div>' +
                '<div class="chart-card">' +
                    '<h4><i class="fas fa-history"></i> Actividad Reciente</h4>' +
                    '<ul class="activity-log">' +
                        '<li class="activity-item"><span class="activity-time">10:45</span> <span>Venta #1024 - Laptop Dell XPS 13</span></li>' +
                        '<li class="activity-item"><span class="activity-time">09:30</span> <span>Inicio de sesión en caja 1</span></li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
            
            '<div class="dashboard-grid">' +
                '<div class="chart-card">' +
                    '<h4>Accesos Rápidos</h4>' +
                    '<div style="display:flex; flex-direction:column; gap:10px; margin-top:1rem;">' +
                        '<button class="btn-primary" onclick="alert(\'Función: Reportar incidencia técnica\')"><i class="fas fa-tools"></i> Soporte</button>' +
                        '<button class="btn-secondary" onclick="alert(\'Función: Solicitar cambio de turno\')"><i class="fas fa-user-clock"></i> Mi Turno</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
        return;
    }
      // --- VISTA ESPECÍFICA PARA CLIENTE ---
    if (currentUserRole === 'client') {
        container.innerHTML = 
            '<div class="info-section">' +
                '<h2>Resumen de Cuenta</h2>' +
                '<p>Hola, Cliente. Aquí está tu balance y actividad reciente.</p>' +
            '</div>' +
            
            '<div class="stats-grid">' +
                 // Balance General Simplificado en Dashboard
                '<div class="stat-card" style="border-left-color: var(--color-primary); cursor:pointer;" onclick="router(\'account-statement\')">' +
                     '<h3>Balance General</h3>' +
                     '<div style="display:flex; justify-content:space-between; margin-top:10px;">' +
                        '<span>Crédito:</span> <span class="text-success">$12,000</span>' +
                     '</div>' +
                     '<div style="display:flex; justify-content:space-between;">' +
                        '<span>Deuda:</span> <span class="text-danger">$4,500</span>' +
                     '</div>' +
                     '<small class="text-muted">Ver detalle completo</small>' +
                '</div>' +

                '<div class="stat-card" onclick="router(\'client-orders\')" style="cursor:pointer;">' +
                   '<h3><i class="fas fa-shopping-bag"></i> Actividad Reciente</h3>' +
                   '<div class="value" style="font-size: 1.2rem; margin-top: 10px;">Ultima compra: Ayer</div>' +
                   '<small class="text-muted">3 pedidos este mes</small>' +
                '</div>' +

                 '<div class="stat-card" onclick="router(\'catalog\')" style="cursor:pointer;">' +
                   '<h3><i class="fas fa-store"></i> Catálogo</h3>' +
                   '<div class="value" style="font-size: 1.2rem; margin-top: 10px;">Ver Ofertas</div>' +
                   '<small class="text-muted">Nuevos productos agregados</small>' +
                '</div>' +
            '</div>' +

            '<div class="dashboard-grid">' +
                '<div class="chart-card">' +
                    '<h4><i class="fas fa-history"></i> Mi Actividad de Sesión</h4>' +
                    '<ul class="activity-log" style="margin-top:1rem;">' +
                        '<li class="activity-item">' +
                            '<span class="activity-time">Ahora</span>' +
                            '<span>Inicio de sesión exitoso</span>' +
                        '</li>' +
                        '<li class="activity-item">' +
                            '<span class="activity-time">Ayer 14:30</span>' +
                            '<span>Compra realizada #9001 ($8,500)</span>' +
                        '</li>' +
                        '<li class="activity-item">' +
                            '<span class="activity-time">01 Feb</span>' +
                            '<span>Actualización de perfil</span>' +
                        '</li>' +
                    '</ul>' +
                '</div>' +
            '</div>';
        return;
    }

    // --- VISTA PARA ADMINISTRADOR ---
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockProducts = products.filter(p => p.stock < 5);
    const lowStockCount = lowStockProducts.length;
    
    // Tarjeta financiera (Admin)
    const financialCard = 
        '<div class="stat-card">' +
             '<h3>Ventas del Día</h3>' +
             '<div class="value">$ 45,200</div>' +
             '<small class="text-success"><i class="fas fa-arrow-up"></i> 12% vs ayer</small>' +
        '</div>'; 

    container.innerHTML = 
        '<div class="info-section">' +
            '<h2>Bienvenido, Administrador</h2>' +
            '<p>Visión general del rendimiento del negocio.</p>' +
        '</div>' +

        '<div class="stats-grid">' +
            financialCard +
            '<div class="stat-card ' + (lowStockCount > 0 ? 'alert' : '') + '">' +
                '<h3>Stock Bajo</h3>' +
                '<div class="value">' + lowStockCount + '</div>' +
                '<small class="' + (lowStockCount > 0 ? 'text-danger' : 'text-muted') + '">' +
                    (lowStockCount > 0 ? 'Items requieren atención' : 'Niveles óptimos') +
                '</small>' +
            '</div>' +
            '<div class="stat-card">' +
                '<h3>Total Unidades</h3>' +
                '<div class="value">' + totalStock + '</div>' +
                '<small class="text-muted">Valor inv: $ ' + (totalStock * 1500).toLocaleString() + '</small>' +
            '</div>' +
            '<div class="stat-card">' +
                '<h3>Usuarios Activos</h3>' +
                '<div class="value">3</div>' +
                '<small class="text-success">2 Vendedores, 1 Admin</small>' +
            '</div>' +
        '</div>' +
        
        '<div class="dashboard-grid">' +
            '<div class="dashboard-col">' +
                '<div class="chart-card">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">' +
                        '<h4>Finanzas (Semana)</h4>' +
                        '<select class="form-control" style="width: auto; padding: 5px; font-size: 0.8rem;"><option>Últimos 7 días</option><option>Este Mes</option></select>' +
                    '</div>' +
                    '<div class="chart-container">' +
                        '<canvas id="salesChart"></canvas>' +
                    '</div>' +
                '</div>' +
                 '<div class="data-table-container">' +
                    '<div class="toolbar">' +
                        '<h4>Top 5 Productos Más Vendidos</h4>' +
                        '<button class="btn-sm btn-secondary"><i class="fas fa-download"></i> Exportar</button>' +
                    '</div>' +
                    '<table>' +
                        '<thead><tr><th>Producto</th><th>Vendidos</th><th>Tendencia</th></tr></thead>' +
                        '<tbody>' +
                            '<tr><td><strong>iPhone 13 Pro</strong></td><td>12</td><td><span class="text-success"><i class="fas fa-level-up-alt"></i> +5%</span></td></tr>' +
                            '<tr><td><strong>Laptop Dell XPS</strong></td><td>8</td><td><span class="text-success"><i class="fas fa-level-up-alt"></i> +2%</span></td></tr>' +
                            '<tr><td><strong>Monitor LG</strong></td><td>15</td><td><span class="text-muted"><i class="fas fa-minus"></i> 0%</span></td></tr>' +
                            '<tr><td><strong>Cable HDMI</strong></td><td>45</td><td><span class="text-success"><i class="fas fa-level-up-alt"></i> +8%</span></td></tr>' +
                            '<tr><td><strong>Mouse mx</strong></td><td>20</td><td><span class="text-danger"><i class="fas fa-level-down-alt"></i> -3%</span></td></tr>' +
                        '</tbody>' +
                    '</table>' +
                '</div>' +
            '</div>' +
            
            '<div class="dashboard-col">' +
                '<div class="chart-card">' +
                     '<h4>Distribución de Inventario</h4>' +
                    '<div class="chart-container">' +
                        '<canvas id="categoryChart"></canvas>' +
                    '</div>' +
                '</div>' +
                
                '<div class="chart-card">' +
                    '<h4><i class="fas fa-bell"></i> Sucesos Recientes</h4>' +
                    '<ul class="activity-log">' +
                        '<li class="activity-item"><span class="activity-time">10:45</span> <span>Nueva venta: Factura #1024</span></li>' +
                        '<li class="activity-item"><span class="activity-time">10:15</span> <span>Stock actualizado: iPhone 13</span></li>' +
                        '<li class="activity-item"><span class="activity-time">09:30</span> <span>Inicio de turno: Vendedor 1</span></li>' +
                        '<li class="activity-item"><span class="activity-time">09:00</span> <span>Cierre de caja ayer: Ok</span></li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
        '</div>';

    // Inicializar Gráficas (Solo si existen los canvas)
    setTimeout(() => {
        initDashboardCharts();
    }, 100);
}

function initDashboardCharts() {
    const salesCtx = document.getElementById('salesChart');
    const catCtx = document.getElementById('categoryChart');

    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'bar',
            data: {
                labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
                datasets: [
                    {
                        label: 'Ingresos ($)',
                        data: [12000, 19000, 3000, 5000, 22000, 35000, 45200],
                        backgroundColor: '#0C324A',
                        borderRadius: 4
                    },
                    {
                        label: 'Costos ($)',
                        data: [8000, 12000, 2000, 3000, 15000, 25000, 30000],
                        backgroundColor: '#C11720',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
                    x: { grid: { display: false } }
                },
                plugins: { legend: { position: 'top' } }
            }
        });
    }

    if (catCtx) {
        // Datos dinámicos de categorías
        const categories = {};
        products.forEach(p => {
             categories[p.category] = (categories[p.category] || 0) + p.stock;
        });

        new Chart(catCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: [
                        '#0C324A', '#C11720', '#679CBC', '#FEF1D5', '#1e293b'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { position: 'right' } 
                },
                cutout: '70%'
            }
        });
    }
}

function renderInventory(container) {
    const addBtn = currentUserRole === 'admin' 
        ? '<button class="btn-primary" style="width: auto;" onclick="openModal()"><i class="fas fa-plus"></i> Nuevo Producto</button>' 
        : '';

    container.innerHTML = 
        '<div class="data-table-container">' +
            '<div class="toolbar">' +
                '<div style="display:flex; gap:10px; align-items:center;">' + 
                    '<input type="text" id="searchInv" class="form-control" style="width: 250px;" placeholder="Buscar..." onkeyup="filterInventory(this.value)">' +
                    '<button class="btn-sm btn-secondary" onclick="alert(\'Generando CSV...\')"><i class="fas fa-file-csv"></i> CSV</button>' +
                    '<button class="btn-sm btn-secondary" onclick="alert(\'Generando Reporte PDF...\')"><i class="fas fa-file-pdf"></i> PDF</button>' +
                '</div>' +
                addBtn +
            '</div>' +
            '<table id="invTable">' +
                '<thead>' +
                    '<tr>' +
                        '<th>Nombre</th>' +
                        '<th>Categoría</th>' +
                        '<th>Precio</th>' +
                        '<th>Stock</th>' +
                        (currentUserRole === 'admin' ? '<th>Acciones</th>' : '') +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    getInventoryRows(products) +
                '</tbody>' +
            '</table>' +
        '</div>';
}

function getInventoryRows(data) {
    return data.map(p => {
        const actions = currentUserRole === 'admin' 
            ? '<td>' +
                 '<button class="btn-sm btn-edit" title="Editar"><i class="fas fa-edit"></i></button>' +
                 '<button class="btn-sm btn-delete" title="Eliminar"><i class="fas fa-trash"></i></button>' +
               '</td>' 
            : '';

        return '<tr>' +
            '<td><strong>' + p.name + '</strong><br><small>' + p.model + '</small></td>' +
            '<td>' + p.category + '</td>' +
            '<td>$' + p.price.toLocaleString() + '</td>' +
            '<td><span class="badge ' + (p.stock < 5 ? 'badge-low' : 'badge-ok') + '">' + p.stock + ' u.</span></td>' +
            actions +
        '</tr>';
    }).join('');
}

function filterInventory(text) {
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(text.toLowerCase()) || 
        p.brand.toLowerCase().includes(text.toLowerCase()) ||
        p.model.toLowerCase().includes(text.toLowerCase())
    );
    document.querySelector('#invTable tbody').innerHTML = getInventoryRows(filtered);
}

function renderOrders(container) {
    container.innerHTML = 
        '<div class="stats-grid">' +
            '<div class="stat-card">' +
                 '<h3>Ordenes Pendientes</h3>' +
                 '<div class="value">12</div>' +
                 '<small class="text-danger">Requieren envío hoy</small>' +
            '</div>' +
            '<div class="stat-card">' +
                 '<h3>En Proceso</h3>' +
                 '<div class="value">5</div>' +
                 '<small class="text-muted">En preparación</small>' +
            '</div>' +
            '<div class="stat-card">' +
                 '<h3>Completadas (Hoy)</h3>' +
                 '<div class="value">24</div>' +
                 '<small class="text-success">Todo entregado</small>' +
            '</div>' +
        '</div>' +
        '<div class="data-table-container">' +
            '<div class="toolbar">' +
                '<input type="text" class="form-control" style="width: 300px;" placeholder="Buscar ID o Cliente...">' +
                '<div style="display:flex; gap:10px;">' +
                    '<button class="btn-sm btn-secondary">Filtrar por Estado</button>' +
                    '<button class="btn-primary">Nueva Orden Manual</button>' +
                '</div>' +
            '</div>' +
            '<table>' +
                '<thead><tr><th>ID</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>' +
                '<tbody>' +
                     '<tr><td>#1055</td><td>TechCorp Inc</td><td>Hoy 11:30</td><td>$ 15,200</td><td><span class="badge badge-low">Pendiente</span></td><td><button class="btn-sm btn-edit">Procesar</button></td></tr>' +
                     '<tr><td>#1054</td><td>Juan Cliente</td><td>Hoy 10:45</td><td>$ 4,500</td><td><span class="badge" style="background:#e0f2fe; color:#0369a1;">En Preparación</span></td><td><button class="btn-sm btn-edit">Ver</button></td></tr>' +
                     '<tr><td>#1053</td><td>Maria Ventas</td><td>Hoy 09:15</td><td>$ 1,200</td><td><span class="badge badge-ok">Enviado</span></td><td><button class="btn-sm btn-edit">Detalles</button></td></tr>' +
                     '<tr><td>#1052</td><td>Local Mostrador</td><td>Ayer 18:00</td><td>$ 350</td><td><span class="badge badge-ok">Entregado</span></td><td><button class="btn-sm btn-edit">Factura</button></td></tr>' +
                '</tbody>' +
            '</table>' +
        '</div>';
}

// --- CRM / CLIENTES ---
function renderCustomers(container) {
    const activeCount = customersData.filter(c => c.status === 'Activo' || c.status === 'Corporativo').length;
    
    container.innerHTML = 
        '<div class="stats-grid">' +
            '<div class="stat-card" style="border-left-color: #8b5cf6;">' +
                 '<h3>Total Clientes</h3>' +
                 '<div class="value">' + customersData.length + '</div>' +
                 '<small class="text-success"><i class="fas fa-arrow-up"></i> Base de datos actualizada</small>' +
            '</div>' +
            '<div class="stat-card" style="border-left-color: #ec4899;">' +
                 '<h3>Clientes Activos</h3>' +
                 '<div class="value">' + activeCount + '</div>' +
                 '<small class="text-muted">Realizaron compras recientes</small>' +
            '</div>' +
        '</div>' +
        '<div class="data-table-container">' +
            '<div class="toolbar">' +
                '<input type="text" class="form-control" style="width: 300px;" placeholder="Buscar cliente..." onkeyup="filterCustomers(this.value)">' +
                '<button class="btn-primary" style="width:auto;" onclick="openCustomerModal()"><i class="fas fa-user-plus"></i> Nuevo Cliente</button>' +
            '</div>' +
            '<table>' +
                '<thead><tr><th>Cliente</th><th>Email</th><th>Tipo</th><th>Total Comprado</th><th>Estado</th></tr></thead>' +
                '<tbody id="customerTableBody">' +
                    getCustomerRows(customersData) +
                '</tbody>' +
            '</table>' +
        '</div>';
}

function getCustomerRows(data) {
    return data.map(c => 
        '<tr>' +
            '<td><strong>' + c.name + '</strong></td>' +
            '<td>' + c.email + '</td>' +
            '<td><span class="badge" style="background:#f3f4f6; color:#374151;">' + c.type + '</span></td>' +
            '<td>$ ' + c.total.toLocaleString() + '</td>' +
            '<td>' + getStatusBadge(c.status) + '</td>' +
        '</tr>'
    ).join('');
}

function getStatusBadge(status) {
    if(status === 'Activo' || status === 'Corporativo') return '<span class="badge badge-ok">' + status + '</span>';
    return '<span class="badge badge-low">' + status + '</span>';
}

function filterCustomers(text) {
    const filtered = customersData.filter(c => 
        c.name.toLowerCase().includes(text.toLowerCase()) || 
        c.email.toLowerCase().includes(text.toLowerCase())
    );
    document.getElementById('customerTableBody').innerHTML = getCustomerRows(filtered);
}

// --- MODAL DE CLIENTES ---
function openCustomerModal() {
    document.getElementById('customerModal').classList.remove('hidden');
}

function closeCustomerModal() {
    document.getElementById('customerModal').classList.add('hidden');
}

// Inicializar listener para el formulario
setTimeout(() => {
    const custForm = document.getElementById('customerForm');
    if(custForm) {
        custForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('custName').value;
            const email = document.getElementById('custEmail').value;
            const type = document.getElementById('custType').value;
            
            const newCustomer = {
                id: customersData.length + 1,
                name: name,
                email: email,
                total: 0,
                lastBuy: "-",
                status: "Prospecto",
                type: type
            };
            
            customersData.push(newCustomer);
            alert("Cliente registrado con éxito");
            closeCustomerModal();
            // Refrescar si estamos en la vista
            const tbody = document.getElementById('customerTableBody');
            if(tbody) tbody.innerHTML = getCustomerRows(customersData);
            custForm.reset();
        });
    }
}, 500);

function renderProfile(container) {
    if (currentUserRole === 'seller') {
        container.innerHTML = 
            '<div class="info-section">' +
                '<div style="display:flex; align-items:center; gap:20px;">' +
                    '<div style="background:var(--color-secondary); width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:2rem;">V</div>' +
                    '<div>' +
                        '<h2>Vendedor Mostrador</h2>' +
                        '<p>ID Empleado: <strong>#8842</strong></p>' +
                        '<span class="badge badge-ok">Activo</span>' +
                    '</div>' +
                '</div>' +
                '<hr style="margin:2rem 0; border:0; border-top:1px solid #ddd;">' +
                '<div class="form-row">' +
                    '<div class="form-group"><label>Email</label><input type="text" class="form-control" value="vendedor@duitech.com" readonly></div>' +
                    '<div class="form-group"><label>Turno</label><input type="text" class="form-control" value="Matutino (8am - 4pm)" readonly></div>' +
                '</div>' +
                '<button class="btn-secondary" onclick="alert(\'Solicitud de cambio enviada\')">Solicitar Cambio de Datos</button>' +
            '</div>';
    } else if (currentUserRole === 'client') {
        container.innerHTML = 
            '<div class="info-section">' +
                '<div style="display:flex; align-items:center; gap:20px;">' +
                    '<div style="background:var(--color-primary); width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:2rem;">C</div>' +
                    '<div>' +
                        '<h2>Cliente Registrado</h2>' +
                        '<p>Nivel: <strong>Oro (VIP)</strong></p>' +
                        '<span class="badge badge-ok">Cuenta Verificada</span>' +
                    '</div>' +
                '</div>' +
                '<hr style="margin:2rem 0; border:0; border-top:1px solid #ddd;">' +
                '<div class="form-row">' +
                    '<div class="form-group"><label>Email</label><input type="text" class="form-control" value="cliente@gmail.com" readonly></div>' +
                    '<div class="form-group"><label>Teléfono</label><input type="text" class="form-control" value="+52 55 1234 5678" readonly></div>' +
                    '<div class="form-group"><label>Dirección de Envío</label><input type="text" class="form-control" value="Av. Reforma 222, CDMX"></div>' +
                '</div>' +
                '<div class="form-actions">' +
                    '<button class="btn-primary" onclick="alert(\'Perfil actualizado\')">Guardar Cambios</button>' +
                '</div>' +
            '</div>';
    }
}

function renderAccountStatement(container) {
    container.innerHTML = 
        '<div class="stats-grid">' +
            '<div class="stat-card">' +
                 '<h3>Crédito Disponible</h3>' +
                 '<div class="value text-success">$ 12,000</div>' +
                 '<small class="text-muted">Línea de crédito autorizada: $20,000</small>' +
            '</div>' +
            '<div class="stat-card">' +
                 '<h3>Deuda Total</h3>' +
                 '<div class="value text-danger">$ 4,500</div>' +
                 '<small class="text-muted">Vence el 15/Feb</small>' +
            '</div>' +
             '<div class="stat-card">' +
                 '<h3>Pagos Realizados (Mes)</h3>' +
                 '<div class="value">$ 3,500</div>' +
                 '<small class="text-success">2 pagos registrados</small>' +
            '</div>' +
        '</div>' + 
        '<div class="data-table-container">' +
            '<div class="toolbar"><h4>Detalle de Movimientos</h4></div>' +
            '<table>' +
                '<thead><tr><th>Fecha</th><th>Concepto</th><th>Cargo</th><th>Abono</th><th>Saldo</th></tr></thead>' +
                '<tbody>' +
                    '<tr><td>01/Feb</td><td>Pago Recibido</td><td>-</td><td>$ 3,500</td><td>$ 4,500</td></tr>' +
                    '<tr><td>28/Ene</td><td>Compra #9001</td><td>$ 8,000</td><td>-</td><td>$ 8,000</td></tr>' +
                '</tbody>' +
            '</table>' +
        '</div>';
}

function renderSupport(container) {
    container.innerHTML = 
        '<div class="dashboard-grid">' +
            '<div class="chart-card">' +
                '<h4><i class="fas fa-question-circle"></i> Preguntas Frecuentes</h4>' +
                '<ul class="activity-log">' +
                    '<li class="activity-item"><a href="#">¿Cómo reimprimir un ticket?</a></li>' +
                    '<li class="activity-item"><a href="#">Error al conectar con el servidor</a></li>' +
                    '<li class="activity-item"><a href="#">Política de devoluciones</a></li>' +
                '</ul>' +
            '</div>' +
            '<div class="chart-card">' +
                '<h4><i class="fas fa-envelope"></i> Contactar Soporte</h4>' +
                '<div class="form-group">' +
                    '<label>Asunto</label>' +
                    '<input type="text" class="form-control" placeholder="Ej: Error en impresora">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label>Detalle</label>' +
                    '<textarea class="form-control" rows="3"></textarea>' +
                '</div>' +
                '<button class="btn-primary" onclick="alert(\'Ticket de soporte creado #9901\')">Enviar Ticket</button>' +
            '</div>' +
        '</div>';
}

// Eliminadas funciones eliminadas previamente


function renderFinance(container) {
    container.innerHTML = 
        '<div class="stats-grid">' +
            '<div class="stat-card">' +
                 '<h3>Ingresos (Mes)</h3>' +
                 '<div class="value text-success">$ 125,400</div>' +
                 '<small class="text-muted">+15% vs mes anterior</small>' +
            '</div>' +
            '<div class="stat-card">' +
                 '<h3>Gastos Operativos</h3>' +
                 '<div class="value text-danger">$ 45,200</div>' +
                 '<small class="text-muted">Incluye nómina y servicios</small>' +
            '</div>' +
            '<div class="stat-card">' +
                 '<h3>Utilidad Neta</h3>' +
                 '<div class="value" style="color:#0C324A;">$ 80,200</div>' +
                 '<small class="text-success">Margen saludable del 64%</small>' +
            '</div>' +
        '</div>' +
        '<div class="dashboard-grid">' +
            '<div class="chart-card">' +
                '<h4>Balance General Anual</h4>' +
                '<div style="height:300px; background:#f8fafc; display:flex; align-items:center; justify-content:center; border:1px dashed #cbd5e1; border-radius:8px;">' +
                    '<p class="text-muted">Gráfica de proyección financiera (Demostración)</p>' +
                '</div>' +
            '</div>' +
        '</div>';
}

function renderDocs(container) {
    container.innerHTML = 
        '<div class="info-section">' +
            '<h2>Documentación del Sistema</h2>' +
            '<p>Guías de usuario y especificaciones técnicas de Dui Tech ERP v1.0</p>' +
        '</div>' +
        '<div class="dashboard-grid">' +
            '<div class="chart-card">' +
                '<h4><i class="fas fa-book"></i> Guías de Usuario</h4>' +
                '<ul class="activity-log" style="margin-top:1rem;">' +
                    '<li class="activity-item"><a href="#">Manual de Ventas (POS)</a> - PDF 1.2MB</li>' +
                    '<li class="activity-item"><a href="#">Gestión de Inventarios</a> - PDF 0.8MB</li>' +
                    '<li class="activity-item"><a href="#">Administración de Usuarios</a> - PDF 0.5MB</li>' +
                '</ul>' +
            '</div>' +
            '<div class="chart-card">' +
                '<h4><i class="fas fa-code"></i> API & Sistema</h4>' +
                '<ul class="activity-log" style="margin-top:1rem;">' +
                    '<li class="activity-item"><span class="badge badge-ok">v1.0.2</span> Versión Actual</li>' +
                    '<li class="activity-item">Endpoint: /api/v1/orders</li>' +
                    '<li class="activity-item">Estado del Servidor: <span class="text-success">En Línea</span></li>' +
                '</ul>' +
            '</div>' +
        '</div>';
}

function renderCatalog(container) {
    container.innerHTML = 
        '<div class="data-table-container">' +
            '<div class="toolbar"><h4>Catálogo de Productos</h4></div>' +
            '<div class="products-grid" style="padding:1rem;">' +
                 products.map(p => 
                    '<div class="product-card">' +
                        '<div class="product-img-placeholder"><i class="fas fa-box fa-2x" style="color: #ccc"></i></div>' +
                        '<h4>' + p.name + '</h4>' +
                        '<p style="color:var(--color-primary); font-weight:bold;">$' + p.price.toLocaleString() + '</p>' +
                        '<button class="btn-primary" style="margin-top:0.5rem; width:100%;">Agregar</button>' +
                    '</div>'
                 ).join('') +
            '</div>' +
        '</div>';
}

function renderClientOrders(container) {
     container.innerHTML = 
        '<div class="data-table-container">' +
            '<div class="toolbar"><h4>Mis Compras Recientes</h4></div>' +
            '<table>' +
                '<thead><tr><th>ID</th><th>Fecha</th><th>Total</th><th>Estatus</th></tr></thead>' +
                '<tbody>' +
                    '<tr><td>#9001</td><td>Hace 2 días</td><td>$ 8,500</td><td><span class="badge badge-ok">Entregado</span></td></tr>' +
                    '<tr><td>#9005</td><td>Hoy</td><td>$ 350</td><td><span class="badge badge-low">En Camino</span></td></tr>' +
                '</tbody>' +
            '</table>' +
        '</div>';
}

function renderMyOrders(container) {
    container.innerHTML = 
        '<div class="data-table-container">' +
            '<div class="toolbar"><h4>Historial de Pedidos</h4></div>' +
            '<table>' +
                '<thead><tr><th>ID Pedido</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>' +
                '<tbody>' +
                    '<tr><td>#1024</td><td>Hoy, 10:45</td><td>Cliente Mostrador</td><td>$ 25,000</td><td><span class="badge badge-ok">Completado</span></td></tr>' +
                    '<tr><td>#1023</td><td>Ayer, 16:20</td><td>Juan Pérez</td><td>$ 8,500</td><td><span class="badge badge-ok">Completado</span></td></tr>' +
                    '<tr><td>#1022</td><td>Ayer, 14:00</td><td>María López</td><td>$ 1,200</td><td><span class="badge badge-low">Pendiente</span></td></tr>' +
                    '<tr><td>#1021</td><td>20 Oct</td><td>Cliente Mostrador</td><td>$ 350</td><td><span class="badge badge-ok">Completado</span></td></tr>' +
                '</tbody>' +
            '</table>' +
        '</div>';
}

// --- LÓGICA DEL MODAL ---
const modal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');

function openModal() { modal.classList.remove('hidden'); }
function closeModal() { modal.classList.add('hidden'); productForm.reset(); }
window.onclick = function(event) { if (event.target == modal) closeModal(); }

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('p_name').value;
    const model = document.getElementById('p_model').value;
    const brand = document.getElementById('p_brand').value;
    const category = document.getElementById('p_category').value;
    const price = parseFloat(document.getElementById('p_price').value);
    const stock = parseInt(document.getElementById('p_stock').value);

    // Validación básica
    if (!name || !model || !brand || isNaN(price) || isNaN(stock)) {
        alert("Por favor completa todos los campos correctamente.");
        return;
    }

    // Agregar producto
    products.push({ 
        id: Date.now(), 
        name, 
        model, 
        brand, 
        category, 
        price, 
        stock, 
        specs: "N/A" 
    });

    // Recargar vista si estamos en inventario
    renderInventory(document.getElementById('content-area'));
    closeModal();
    alert("Producto agregado correctamente");
});

// Sidebar toggle responsive
if (menuToggle) menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));