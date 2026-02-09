import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SalesChart from '../components/charts/SalesChart';
import CategoryChart from '../components/charts/CategoryChart';
import { productsData } from '../context/mockData';
import StatCard from '../components/ui/StatCard';
import { useNotifications } from '../context/NotificationContext';
import { useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialOrders } from '../context/mockData';



const ActivityItem = ({ time, text, icon, dark }) => (
    <div className={`d-flex gap-3 mb-3 pb-3 ${dark ? 'border-white/10' : 'border-light'} border-bottom last:border-0`}>
        <div className={`w-8 h-8 rounded-circle d-flex align-items-center justify-content-center shrink-0 ${dark ? 'bg-white/10 text-white' : 'bg-primary-subtle text-primary'}`}>
            <i className={`fas ${icon} small`}></i>
        </div>
        <div>
            <div className={`fw-bold small ${dark ? 'text-white' : 'text-dark'}`}>{text}</div>
            <div className={`x-small ${dark ? 'text-white-50' : 'text-muted'}`}>{time}</div>
        </div>
    </div>
);

const Dashboard = () => {

    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    const role = user?.role;
    
    // Global shared states for synchronization
    const [products] = useLocalStorage('duitech_inventory', productsData);
    const [orders] = useLocalStorage('duitech_orders', initialOrders);


    useEffect(() => {
        // Notificación de bienvenida genuina al entrar al dashboard
        addNotification({
            title: 'Sesión Iniciada',
            text: `Bienvenido al panel de ${role}. Tu conexión es segura.`,
            type: 'system'
        });
    }, [addNotification, role]); // Solo al montar o si cambia el rol

    if (role === 'admin') return <AdminDashboard products={products} orders={orders} addNotification={addNotification} />;
    if (role === 'seller') return <SellerDashboard products={products} orders={orders} navigate={navigate} addNotification={addNotification} />;
    if (role === 'client') return <ClientDashboard orders={orders} navigate={navigate} addNotification={addNotification} />;




    return <div>Cargando...</div>;
};

const AdminDashboard = ({ products, orders, addNotification }) => {
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockCount = products.filter(p => p.stock < 5).length;
    const todaySales = orders
        .filter(o => o.date.includes('Hoy') || o.date.includes('Ahora'))
        .reduce((acc, o) => acc + o.total, 0);


    const [tasks, setTasks] = useState([
        { id: 1, text: 'Revisar facturas pendientes', completed: true },
        { id: 2, text: 'Actualizar precios de catálogo', completed: false },
        { id: 3, text: 'Revisar reporte de inventario', completed: false },
        { id: 4, text: 'Cita con proveedor logístico', completed: false, isToday: true }
    ]);
    const [selectedMonth, setSelectedMonth] = useState('Febrero');
    const [systemAlerts, setSystemAlerts] = useState([
        { id: 1, type: 'danger', icon: 'fa-box-open', title: 'Stock Crítico Detectado', text: '3 productos requieren reabastecimiento inmediato', action: 'Ver Productos' },
        { id: 2, type: 'warning', icon: 'fa-credit-card', title: 'Pagos Pendientes', text: '5 clientes con facturas vencidas por $18,500', action: 'Gestionar' },
        { id: 3, type: 'info', icon: 'fa-sync', title: 'Actualización Disponible', text: 'Nueva versión del sistema ERP v2.4.1', action: 'Actualizar' }
    ]);

    const toggleTask = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const removeAlert = (id) => {
        setSystemAlerts(prev => prev.filter(a => a.id !== id));
    };

    const addTask = () => {
        const text = prompt('¿Qué tarea deseas añadir?');
        if (text) {
            setTasks([...tasks, { id: Date.now(), text, completed: false }]);
            addNotification({ title: 'Tarea Añadida', text: 'Se ha registrado la nueva tarea en tu panel.', type: 'info' });
        }
    };

    const handleReport = () => {
        addNotification({ title: 'Reporte Solicitado', text: 'Generando reporte detallado de productos destacados...', type: 'success' });
    };

    const handleViewLog = () => {
        addNotification({ title: 'Abriendo Logs', text: 'Accediendo al historial completo de auditoría y personal...', type: 'info' });
    };

    return (
        <div className="container-fluid p-0">


            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Resumen de Operaciones</h2>
                <p className="text-muted fs-5">Bienvenido de nuevo, Administrador. Así marcha el negocio hoy.</p>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-sm-6 col-xl-3" data-aos="zoom-in" data-aos-delay="100">
                    <StatCard 
                        title="Ingresos del Día" 
                        value={`$ ${todaySales.toLocaleString()}`} 
                        sub={<><i className="fas fa-arrow-up"></i> +12% respecto a ayer</>} 
                        icon="fa-dollar-sign" 
                        trend="up" 
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3" data-aos="zoom-in" data-aos-delay="200">
                    <StatCard 
                        title="Stock Crítico" 
                        value={lowStockCount} 
                        sub={lowStockCount > 0 ? `${lowStockCount} productos requieren reabastecimiento` : "Todo en orden"} 
                        icon="fa-exclamation-triangle" 
                        trend={lowStockCount > 0 ? "down" : "neutral"} 
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3" data-aos="zoom-in" data-aos-delay="300">
                    <StatCard 
                        title="Inventario Total" 
                        value={totalStock.toLocaleString()} 
                        sub={`Unidades físicas en almacén`} 
                        icon="fa-boxes" 
                        trend="neutral" 
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3" data-aos="zoom-in" data-aos-delay="400">
                    <StatCard 
                        title="Vendedores Online" 
                        value="2" 
                        sub="De un total de 5 registrados" 
                        icon="fa-user-tie" 
                        trend="up" 
                    />
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-8" data-aos="fade-right">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h4 className="fw-bold mb-4 flex items-center gap-2">
                                <i className="fas fa-chart-bar text-primary"></i> 
                                Rendimiento Semanal
                            </h4>
                            <div style={{ height: '350px' }}>
                                <SalesChart />
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                             <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold m-0"><i className="fas fa-star text-warning"></i> Productos Destacados</h4>
                                <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={handleReport}>
                                    <i className="fas fa-download me-2"></i> Reporte
                                </button>
                             </div>
                             <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light text-muted">
                                        <tr>
                                            <th>Producto</th>
                                            <th className="text-center">Unidades</th>
                                            <th className="text-end">Crecimiento</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-top-0">
                                        <tr><td><strong>iPhone 13 Pro</strong></td><td className="text-center">12</td><td className="text-end"><span className="badge bg-success-subtle text-success border border-success-subtle"><i className="fas fa-caret-up"></i> +5.2%</span></td></tr>
                                        <tr><td><strong>Laptop Dell XPS</strong></td><td className="text-center">8</td><td className="text-end"><span className="badge bg-success-subtle text-success border border-success-subtle"><i className="fas fa-caret-up"></i> +2.1%</span></td></tr>
                                        <tr><td><strong>Monitor LG Ultra</strong></td><td className="text-center">15</td><td className="text-end"><span className="badge bg-light text-muted border"><i className="fas fa-minus"></i> 0.0%</span></td></tr>
                                        <tr><td><strong>Cable HDMI 4K</strong></td><td className="text-center">45</td><td className="text-end"><span className="badge bg-success-subtle text-success border border-success-subtle"><i className="fas fa-caret-up"></i> +8.4%</span></td></tr>
                                        <tr><td><strong>Mouse Logitech</strong></td><td className="text-center">20</td><td className="text-end"><span className="badge bg-danger-subtle text-danger border border-danger-subtle"><i className="fas fa-caret-down"></i> -3.1%</span></td></tr>
                                    </tbody>
                                </table>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-4" data-aos="fade-left">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h4 className="fw-bold mb-4"><i className="fas fa-chart-pie text-accent"></i> Stock por Categoría</h4>
                            <div style={{ height: '300px' }}>
                                <CategoryChart products={products} />
                            </div>

                        </div>
                    </div>

                    <div className="card border-0 shadow-sm overflow-hidden text-white bg-primary bg-gradient relative mb-4" style={{ minHeight: '300px' }}>
                        <div className="card-body p-4 relative z-10">
                            <h4 className="fw-bold mb-4"><i className="fas fa-history"></i> Auditoría Reciente</h4>
                            <div className="activity-log">
                                <ActivityItem time="10:45" text="Factura #1024 generada" icon="fa-file-invoice" dark />
                                <ActivityItem time="10:15" text="Ajuste stock: iPhone 13" icon="fa-edit" dark />
                                <ActivityItem time="09:30" text="Sesión: Administrador" icon="fa-user-check" dark />
                                <ActivityItem time="09:00" text="Sincronización exitosa" icon="fa-sync" dark />
                            </div>
                        </div>
                        <i className="fas fa-shield-alt absolute -bottom-10 -right-10 text-white opacity-10" style={{ fontSize: '150px' }}></i>
                    </div>

                    <div className="card border-0 shadow-sm p-4" data-aos="zoom-in">
                        <h5 className="fw-bold mb-4"><i className="fas fa-server text-success me-2"></i> Estado del Sistema</h5>
                        <div className="d-grid gap-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small text-muted">Base de Datos</span>
                                <span className="badge bg-success-subtle text-success border border-success-subtle">Online</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small text-muted">Servidor API</span>
                                <span className="badge bg-success-subtle text-success border border-success-subtle">Estable</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small text-muted">Latencia</span>
                                <span className="text-success fw-bold">24ms</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nueva Sección ADMIN: Panel de Tareas y Métricas Proyectadas */}
            <div className="row g-4 mt-2">
                <div className="col-12 col-md-4" data-aos="fade-up">
                    <div className="card border-0 shadow-sm p-4 bg-white h-100">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="fas fa-tasks text-primary"></i> Tareas de Gestión
                        </h5>
                        <div className="list-group list-group-flush">
                            {tasks.map(task => (
                                <div key={task.id} className="list-group-item px-0 border-0 d-flex gap-3 align-items-center">
                                    <input 
                                        className="form-check-input cursor-pointer" 
                                        type="checkbox" 
                                        checked={task.completed} 
                                        onChange={() => toggleTask(task.id)}
                                    />
                                    <span className={`small ${task.completed ? 'text-muted text-decoration-line-through' : 'fw-bold'}`}>
                                        {task.text}
                                    </span>
                                    {task.isToday && <span className="badge bg-danger ms-auto">Hoy</span>}
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-outline-primary btn-sm rounded-pill mt-4 fw-bold hover-lift" onClick={addTask}>Añadir Tarea</button>
                    </div>
                </div>
                <div className="col-12 col-md-8" data-aos="fade-up" data-aos-delay="100">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold m-0"><i className="fas fa-project-diagram text-secondary me-2"></i> Proyecciones de Cierre Mensual</h5>
                            <span className="badge bg-primary px-3 py-2 rounded-pill fw-bold">Faltan 12 días</span>
                        </div>
                        <div className="row g-4">
                            <div className="col-sm-6">
                                <div className="p-3 bg-light rounded-4">
                                    <span className="small text-muted d-block mb-1">Meta de Ventas</span>
                                    <h4 className="fw-bold m-0 text-primary">$1,200,000</h4>
                                    <div className="progress mt-2" style={{ height: '6px' }}>
                                        <div className="progress-bar bg-primary" style={{ width: '65%' }}></div>
                                    </div>
                                    <span className="x-small text-muted">65% completado</span>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="p-3 bg-light rounded-4">
                                    <span className="small text-muted d-block mb-1">Ratio de Conversión</span>
                                    <h4 className="fw-bold m-0 text-success">32.5%</h4>
                                    <div className="progress mt-2" style={{ height: '6px' }}>
                                        <div className="progress-bar bg-success" style={{ width: '32.5%' }}></div>
                                    </div>
                                    <span className="x-small text-muted">Meta: 40%</span>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="p-3 bg-dark text-white rounded-4 d-flex align-items-center justify-content-between">
                                    <div>
                                        <h6 className="fw-bold m-0">Recomendación del sistema</h6>
                                        <p className="x-small text-white-50 m-0">Aumentar stock de periféricos para el fin de semana.</p>
                                    </div>
                                    <i className="fas fa-robot fs-2 opacity-50"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nueva sección para Admin: Actividad de Usuarios */}
            <div className="row g-4 mt-2 mb-5">
                <div className="col-12" data-aos="fade-up">
                    <div className="card border-0 shadow-sm p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0"><i className="fas fa-users-cog text-primary me-2"></i> Actividad de Personal Reciente</h4>
                            <button className="btn btn-sm btn-light border fw-bold text-muted px-3 rounded-pill" onClick={handleViewLog}>Ver Log Completo</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-muted">
                                    <tr className="small">
                                        <th>Usuario</th>
                                        <th>Rol</th>
                                        <th>Acción Realizada</th>
                                        <th>Módulo</th>
                                        <th className="text-end">Hora</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-primary-subtle text-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center fw-bold small">J</div>
                                                <span className="fw-bold small">Juan Pérez</span>
                                            </div>
                                        </td>
                                        <td><span className="badge bg-light text-dark border small">Vendedor</span></td>
                                        <td className="small">Nueva Venta #1055</td>
                                        <td className="small text-muted">Ventas POS</td>
                                        <td className="text-end small text-muted">Hace 5 min</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-danger-subtle text-danger rounded-circle w-8 h-8 d-flex align-items-center justify-content-center fw-bold small">M</div>
                                                <span className="fw-bold small">María Soto</span>
                                            </div>
                                        </td>
                                        <td><span className="badge bg-light text-dark border small">Admin</span></td>
                                        <td className="small">Modificación de Precios</td>
                                        <td className="small text-muted">Inventario</td>
                                        <td className="text-end small text-muted">Hace 18 min</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-secondary-subtle text-secondary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center fw-bold small">R</div>
                                                <span className="fw-bold small">Roberto G.</span>
                                            </div>
                                        </td>
                                        <td><span className="badge bg-light text-dark border small">Vendedor</span></td>
                                        <td className="small">Registro de Nuevo Cliente</td>
                                        <td className="small text-muted">Clientes</td>
                                        <td className="text-end small text-muted">Hace 1 hora</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== MARCADOR: AQUÍ EMPIEZAN LAS NUEVAS SECCIONES ========== */}
            {/* SECCIONES ADMIN ADICIONALES */}


            {/* NUEVA SECCIÓN ADMIN: Análisis de Rentabilidad */}
            <div className="row g-4 mt-2 mb-5">
                <div className="col-12 col-lg-6" data-aos="fade-right">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="fas fa-chart-line text-success"></i> Análisis de Rentabilidad
                        </h4>
                        <div className="row g-3 mb-4">
                            <div className="col-6">
                                <div className="p-3 bg-success-subtle rounded-4 border border-success-subtle">
                                    <div className="small text-muted mb-1">Margen Bruto</div>
                                    <div className="h3 fw-bold text-success m-0">42.5%</div>
                                    <div className="progress mt-2" style={{ height: '4px' }}>
                                        <div className="progress-bar bg-success" style={{ width: '42.5%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 bg-primary-subtle rounded-4 border border-primary-subtle">
                                    <div className="small text-muted mb-1">ROI Mensual</div>
                                    <div className="h3 fw-bold text-primary m-0">28.3%</div>
                                    <div className="progress mt-2" style={{ height: '4px' }}>
                                        <div className="progress-bar bg-primary" style={{ width: '28.3%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-sm align-middle mb-0">
                                <thead className="text-muted small">
                                    <tr>
                                        <th>Categoría</th>
                                        <th className="text-end">Ventas</th>
                                        <th className="text-end">Costo</th>
                                        <th className="text-end">Ganancia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="fw-bold small">Smartphones</td>
                                        <td className="text-end small">$85,000</td>
                                        <td className="text-end small text-muted">$52,000</td>
                                        <td className="text-end small text-success fw-bold">+$33,000</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold small">Laptops</td>
                                        <td className="text-end small">$120,000</td>
                                        <td className="text-end small text-muted">$78,000</td>
                                        <td className="text-end small text-success fw-bold">+$42,000</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold small">Accesorios</td>
                                        <td className="text-end small">$24,500</td>
                                        <td className="text-end small text-muted">$12,000</td>
                                        <td className="text-end small text-success fw-bold">+$12,500</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6" data-aos="fade-left">
                    <div className="card border-0 shadow-sm p-4 h-100 bg-danger-subtle border-start border-danger border-4">
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="fas fa-exclamation-triangle text-danger"></i> Alertas Críticas del Sistema
                        </h4>
                        <div className="d-grid gap-3">
                            {systemAlerts.length === 0 ? (
                                <div className="text-center py-4 bg-white/50 rounded-3">
                                    <i className="fas fa-check-circle text-success fs-2 mb-2"></i>
                                    <p className="mb-0 fw-bold text-success-emphasis">Sin alertas críticas</p>
                                </div>
                            ) : (
                                systemAlerts.map(alert => (
                                    <div key={alert.id} className={`alert alert-${alert.type} mb-0 d-flex align-items-start gap-3 fade show`}>
                                        <i className={`fas ${alert.icon} fs-4 mt-1`}></i>
                                        <div className="flex-grow-1">
                                            <div className="fw-bold">{alert.title}</div>
                                            <div className="small">{alert.text}</div>
                                            <button 
                                                className={`btn btn-sm btn-${alert.type} mt-2 rounded-pill px-3`}
                                                onClick={() => removeAlert(alert.id)}
                                            >
                                                {alert.action}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* NUEVA SECCIÓN ADMIN: Comparativa Mensual */}
            <div className="row g-4 mt-2 mb-5">
                <div className="col-12" data-aos="fade-up">
                    <div className="card border-0 shadow-sm p-4 bg-gradient" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0"><i className="fas fa-calendar-alt text-primary me-2"></i> Comparativa Mensual</h4>
                            <div className="d-flex gap-2">
                                {['Enero', 'Febrero', 'Marzo'].map(month => (
                                    <button 
                                        key={month}
                                        className={`btn btn-sm ${selectedMonth === month ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-3 transition-all`}
                                        onClick={() => setSelectedMonth(month)}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="row g-4">
                            <div className="col-md-3">
                                <div className="bg-white p-3 rounded-4 shadow-sm text-center transition-all animate-fade-in">
                                    <i className="fas fa-shopping-cart text-primary fs-3 mb-2"></i>
                                    <div className="small text-muted mb-1">Ventas Totales</div>
                                    <div className="h4 fw-bold text-dark m-0">
                                        ${selectedMonth === 'Enero' ? '210,000' : selectedMonth === 'Febrero' ? '245,000' : '262,400'}
                                    </div>
                                    <div className="small text-success fw-bold mt-1">
                                        <i className="fas fa-arrow-up"></i> +15.2% vs mes anterior
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="bg-white p-3 rounded-4 shadow-sm text-center">
                                    <i className="fas fa-users text-success fs-3 mb-2"></i>
                                    <div className="small text-muted mb-1">Nuevos Clientes</div>
                                    <div className="h4 fw-bold text-dark m-0">47</div>
                                    <div className="small text-success fw-bold mt-1">
                                        <i className="fas fa-arrow-up"></i> +8.5% vs mes anterior
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="bg-white p-3 rounded-4 shadow-sm text-center">
                                    <i className="fas fa-box text-warning fs-3 mb-2"></i>
                                    <div className="small text-muted mb-1">Productos Vendidos</div>
                                    <div className="h4 fw-bold text-dark m-0">1,284</div>
                                    <div className="small text-danger fw-bold mt-1">
                                        <i className="fas fa-arrow-down"></i> -3.2% vs mes anterior
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="bg-white p-3 rounded-4 shadow-sm text-center">
                                    <i className="fas fa-star text-accent fs-3 mb-2"></i>
                                    <div className="small text-muted mb-1">Satisfacción</div>
                                    <div className="h4 fw-bold text-dark m-0">4.8/5</div>
                                    <div className="small text-success fw-bold mt-1">
                                        <i className="fas fa-arrow-up"></i> +0.3 vs mes anterior
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* NUEVA SECCIÓN ADMIN: Rendimiento del Servidor */}
            <div className="row g-4 mt-2 mb-4">
                <div className="col-12" data-aos="fade-up">
                    <div className="card border-0 shadow-sm p-4 bg-dark text-white">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0"><i className="fas fa-microchip text-accent me-2"></i> Rendimiento del Servidor</h4>
                            <span className="badge bg-success rounded-pill">Óptimo</span>
                        </div>
                        <div className="row g-4 text-center">
                            <div className="col-md-3 border-end border-white/10">
                                <div className="small text-white-50 mb-2">CPU Usage</div>
                                <div className="h3 fw-bold text-accent">12%</div>
                                <div className="progress bg-white/10 mt-2" style={{ height: '4px' }}>
                                    <div className="progress-bar bg-accent" style={{ width: '12%' }}></div>
                                </div>
                            </div>
                            <div className="col-md-3 border-end border-white/10">
                                <div className="small text-white-50 mb-2">Memory</div>
                                <div className="h3 fw-bold text-primary-subtle">4.2/16 GB</div>
                                <div className="progress bg-white/10 mt-2" style={{ height: '4px' }}>
                                    <div className="progress-bar bg-primary" style={{ width: '26%' }}></div>
                                </div>
                            </div>
                            <div className="col-md-3 border-end border-white/10">
                                <div className="small text-white-50 mb-2">Disk I/O</div>
                                <div className="h3 fw-bold text-success">85 MB/s</div>
                                <div className="progress bg-white/10 mt-2" style={{ height: '4px' }}>
                                    <div className="progress-bar bg-success" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="small text-white-50 mb-2">Uptime</div>
                                <div className="h3 fw-bold text-warning">14d 2h</div>
                                <div className="small text-muted">Since last reboot</div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

            {/* NUEVA SECCIÓN ADMIN: Ventas Regionales y Tickets */}
            <div className="row g-4 mt-2 mb-4">
                <div className="col-12 col-md-8" data-aos="fade-right">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h4 className="fw-bold mb-4"><i className="fas fa-globe-americas text-primary me-2"></i> Desempeño Regional</h4>
                        <div className="row g-4 align-items-center">
                            <div className="col-md-5">
                                <div className="text-center p-4 bg-light rounded-circle mx-auto" style={{ width: '200px', height: '200px', position: 'relative' }}>
                                    <i className="fas fa-map-marked-alt text-primary opacity-25" style={{ fontSize: '80px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></i>
                                    <div className="position-relative z-10 d-flex flex-column h-100 justify-content-center">
                                        <div className="display-6 fw-bold text-dark">4</div>
                                        <div className="small text-muted text-uppercase fw-bold">Regiones Activas</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7">
                                <div className="d-flex flex-column gap-3">
                                    <div>
                                        <div className="d-flex justify-content-between small fw-bold mb-1">
                                            <span>Norte (Monterrey)</span>
                                            <span>$450k</span>
                                        </div>
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-primary" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between small fw-bold mb-1">
                                            <span>Centro (CDMX)</span>
                                            <span>$320k</span>
                                        </div>
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-success" style={{ width: '65%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between small fw-bold mb-1">
                                            <span>Occidente (Guadalajara)</span>
                                            <span>$180k</span>
                                        </div>
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-warning" style={{ width: '45%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between small fw-bold mb-1">
                                            <span>Sur (Cancún)</span>
                                            <span>$90k</span>
                                        </div>
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-danger" style={{ width: '25%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4" data-aos="fade-left">
                    <div className="card border-0 shadow-sm p-4 h-100 bg-white border-top border-warning border-4">
                        <h4 className="fw-bold mb-3"><i className="fas fa-ticket-alt text-warning me-2"></i> Tickets Urgentes</h4>
                        <div className="list-group list-group-flush">
                            <a href="#" className="list-group-item list-group-item-action border-0 px-0 d-flex gap-3 align-items-start">
                                <div className="bg-danger-subtle text-danger rounded p-2 mt-1"><i className="fas fa-server"></i></div>
                                <div>
                                    <h6 className="fw-bold mb-1 text-danger">Error de Sincronización</h6>
                                    <p className="small text-muted mb-0">Hace 20 min • Tienda Centro</p>
                                </div>
                            </a>
                            <a href="#" className="list-group-item list-group-item-action border-0 px-0 d-flex gap-3 align-items-start">
                                <div className="bg-warning-subtle text-warning rounded p-2 mt-1"><i className="fas fa-user-lock"></i></div>
                                <div>
                                    <h6 className="fw-bold mb-1 text-dark">Bloqueo de Cuenta</h6>
                                    <p className="small text-muted mb-0">Hace 1h • Vendedor ID #44</p>
                                </div>
                            </a>
                            <a href="#" className="list-group-item list-group-item-action border-0 px-0 d-flex gap-3 align-items-start">
                                <div className="bg-info-subtle text-info rounded p-2 mt-1"><i className="fas fa-credit-card"></i></div>
                                <div>
                                    <h6 className="fw-bold mb-1 text-dark">Fallo en Pasarela</h6>
                                    <p className="small text-muted mb-0">Hace 3h • Pagos Online</p>
                                </div>
                            </a>
                        </div>
                        <button className="btn btn-outline-warning btn-sm w-100 rounded-pill mt-auto fw-bold">Ir a Soporte</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SellerDashboard = ({ products, orders, navigate, addNotification }) => {

    const salesTarget = 5000;
    const currentSales = orders
        .filter(o => o.date.includes('Hoy') || o.date.includes('Ahora'))
        .reduce((acc, o) => acc + o.total, 0);
    const progress = Math.min((currentSales / salesTarget) * 100, 100);

    
    // Estados para calculadora de comisión
    const [calcAmount, setCalcAmount] = useState('');
    const [calcResult, setCalcResult] = useState(0);

    // Estados para calendario
    const [events, setEvents] = useState([
        { id: 1, day: '05', month: 'FEB', title: 'Capacitación: Nuevos Productos Apple', time: '10:00 AM - 12:00 PM', type: 'bg-primary' },
        { id: 2, day: '08', month: 'FEB', title: 'Cierre de Meta Semanal', time: 'Todo el día', type: 'bg-warning' },
        { id: 3, day: '12', month: 'FEB', title: 'Reunión Mensual de Ventas', time: '3:00 PM - 5:00 PM', type: 'bg-secondary' }
    ]);

    const [sellerTasks, setSellerTasks] = useState([
        { id: 1, title: 'Llamar a Pedro Gómez', detail: 'Confirmar pedido #9022' },
        { id: 2, title: 'Enviar catálogo VIP', detail: 'Lucía Méndez' }
    ]);

    const [courses, setCourses] = useState([
        { id: 1, title: 'Técnicas de Cierre Efectivo', progress: 80, icon: 'fa-video', color: 'bg-primary' },
        { id: 2, title: 'Novedades Apple 2026', progress: 0, icon: 'fa-play', color: 'bg-warning' }
    ]);

    // Calcular comisión en tiempo real
    const handleCalcChange = (e) => {
        const val = parseFloat(e.target.value) || 0;
        setCalcAmount(val);
        setCalcResult(val * 0.10);
    };

    const addEvent = () => {
        const newEvent = {
            id: Date.now(),
            day: new Date().getDate(),
            month: 'FEB',
            title: 'Nuevo Evento Personal',
            time: '09:00 AM - 10:00 AM',
            type: 'bg-info'
        };
        setEvents([...events, newEvent]);
    };

    const handleAddTask = () => {
        const title = prompt('Título del seguimiento:');
        if (title) {
            setSellerTasks([...sellerTasks, { id: Date.now(), title, detail: 'Tarea añadida hoy' }]);
            addNotification({ title: 'Seguimiento Agendado', text: `Se ha añadido "${title}" a tu lista.`, type: 'info' });
        }
    };

    const handleTurnAction = (action) => {
        addNotification({ title: 'Acción Registrada', text: `Se ha procesado: ${action}`, type: 'success' });
    };

    const runCourse = (id, title) => {
        setCourses(courses.map(c => c.id === id ? { ...c, progress: Math.min(c.progress + 10, 100) } : c));
        addNotification({ title: 'Academia Tech', text: `Reproduciendo: ${title}...`, type: 'info' });
    };

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Panel de Ventas</h2>
                <p className="text-muted fs-5">Gestiona tus pedidos y revisa tus metas diarias en tiempo real.</p>
            </div>

            <div className="row g-4 mb-5">
                 <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="card h-100 border-0 shadow-sm p-4">
                        <h3 className="d-flex align-items-center gap-2 mb-3 h5 fw-bold text-secondary">
                            <i className="fas fa-wallet"></i> Mi Progreso de Venta
                        </h3>
                        <div className="display-5 fw-bold mb-3 text-dark">$ {currentSales.toLocaleString()}</div>
                        <div className="progress mb-2" style={{ height: '10px' }}>
                            <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-muted small fw-medium text-uppercase tracking-wider">{progress.toFixed(0)}% de la meta diaria</p>
                    </div>
                 </div>

                 <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200">
                    <div 
                        onClick={() => navigate('/my-sales')} 
                        className="card h-100 border-0 shadow-sm p-4 cursor-pointer hover-lift text-center group"
                    >
                        <div className="w-16 h-16 bg-primary-subtle rounded-circle d-flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-all duration-300">
                            <i className="fas fa-cash-register text-primary group-hover:text-white text-2xl"></i>
                        </div>
                        <h3 className="h5 fw-bold text-primary mb-2">Terminal de Venta</h3>
                        <p className="text-muted small">Comenzar a facturar nuevos pedidos ahora mismo.</p>
                        <div className="mt-auto">
                            <span className="btn btn-primary btn-sm rounded-pill px-4">Abrir POS</span>
                        </div>
                    </div>
                 </div>

                 <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="300">
                    <div 
                        onClick={() => navigate('/my-sales')} 
                        className="card h-100 border-0 shadow-sm p-4 cursor-pointer hover-lift text-center group border-bottom border-accent border-4"
                    >
                        <div className="w-16 h-16 bg-accent-subtle rounded-circle d-flex items-center justify-center mx-auto mb-4 group-hover:bg-accent transition-all duration-300">
                            <i className="fas fa-list-check text-accent group-hover:text-white text-2xl"></i>
                        </div>
                        <h3 className="h5 fw-bold text-accent mb-2">Mis Ventas</h3>
                        <p className="text-muted small">Seguimiento de ventas realizadas y metas alcanzadas.</p>
                        <div className="mt-auto">
                            <span className="btn btn-outline-accent btn-sm rounded-pill px-4">Ver Historial</span>
                        </div>
                    </div>
                 </div>
            </div>
            
            <div className="card border-0 shadow-sm p-4 bg-light border-start border-primary border-4 mb-4" data-aos="zoom-in">
                 <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <i className="fas fa-lightbulb text-warning"></i> Tips de Venta del Día
                 </h4>
                 <div className="row">
                    <div className="col-md-9">
                        <p className="text-muted mb-0 leading-relaxed">
                            Recuerda ofrecer <strong>cables HDMI 4K</strong> en cada venta de monitores. 
                            Este mes tenemos un <span className="badge bg-success">15% de comisión extra</span> en accesorios de la marca Logitech.
                        </p>
                    </div>
                    <div className="col-md-3 text-end d-hidden d-md-block">
                        <i className="fas fa-award text-primary opacity-20" style={{ fontSize: '60px' }}></i>
                    </div>
                 </div>
            </div>

            {/* Nueva sección para Seller: Objetivos y Clientes */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-8" data-aos="fade-right">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h4 className="fw-bold mb-4"><i className="fas fa-trophy text-warning me-2"></i> Productos Más Vendidos por Mí</h4>
                        <div className="table-responsive">
                            <table className="table table-sm align-middle mb-0">
                                <thead className="text-muted small">
                                    <tr>
                                        <th>Producto</th>
                                        <th>Vendidos</th>
                                        <th>Total</th>
                                        <th>Comisión</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.slice(0, 3).map((p, idx) => (
                                        <tr key={p.id}>
                                            <td className="fw-bold small">{p.name}</td>
                                            <td className="small">{5 + idx}</td>
                                            <td className="small fw-bold text-dark">$ {p.price.toLocaleString()}</td>
                                            <td className="small text-success fw-bold">+${(p.price * 0.01).toFixed(0)}</td>
                                        </tr>
                                    ))}
                                </tbody>


                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4" data-aos="fade-left">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h4 className="fw-bold mb-3 small text-uppercase tracking-wider text-muted">Próximos Seguimientos</h4>
                        <div className="d-grid gap-3">
                            {sellerTasks.map(task => (
                                <div key={task.id} className="d-flex align-items-center gap-3 p-2 bg-light rounded-3 transition-all hover-lift">
                                    <div className="bg-primary text-white rounded-circle w-10 h-10 d-flex align-items-center justify-content-center flex-shrink-0">
                                        <i className="fas fa-calendar-check x-small"></i>
                                    </div>
                                    <div>
                                        <div className="fw-bold small">{task.title}</div>
                                        <div className="text-muted" style={{ fontSize: '10px' }}>{task.detail}</div>
                                    </div>
                                </div>
                            ))}
                            <button className="btn btn-primary btn-sm rounded-pill mt-2" onClick={handleAddTask}>Agendar Nuevo Task</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nueva sección para Seller: Notificaciones Rápidas y CRM Base */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-md-6" data-aos="fade-up">
                    <div className="card border-0 shadow-sm p-4 bg-white">
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="fas fa-bullseye text-danger"></i> Mi Meta Semanal
                        </h4>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-2 small fw-bold">
                                <span>Volumen de Ventas</span>
                                <span>$4,200 / $5,000</span>
                            </div>
                            <div className="progress rounded-pill shadow-sm" style={{ height: '12px' }}>
                                <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" style={{ width: '84%' }}>84%</div>
                            </div>
                        </div>
                        <div className="row g-2 text-center">
                            <div className="col-4">
                                <div className="bg-light p-2 rounded-3">
                                    <div className="small text-muted x-small">Ventas</div>
                                    <div className="fw-bold">128</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="bg-light p-2 rounded-3">
                                    <div className="small text-muted x-small">Clientes</div>
                                    <div className="fw-bold">45</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="bg-light p-2 rounded-3">
                                    <div className="small text-muted x-small">Retorno</div>
                                    <div className="fw-bold">12%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div className="card border-0 shadow-sm p-4 bg-primary text-white bg-gradient">
                        <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <i className="fas fa-bolt"></i> Acciones del Turno
                        </h4>
                        <div className="d-grid gap-2">
                            <button className="btn btn-light btn-sm text-primary fw-bold rounded-pill text-start p-2 px-3" onClick={() => handleTurnAction('Envío de ofertas')}>
                                <i className="fas fa-envelope-open-text me-2"></i> Enviar ofertas a clientes inactivos
                            </button>
                            <button className="btn btn-light btn-sm text-primary fw-bold rounded-pill text-start p-2 px-3" onClick={() => handleTurnAction('Arqueo de caja')}>
                                <i className="fas fa-file-invoice-dollar me-2"></i> Reportar arqueo de caja parcial
                            </button>
                            <button className="btn btn-light btn-sm text-primary fw-bold rounded-pill text-start p-2 px-3" onClick={() => handleTurnAction('Gasto de insumos')}>
                                <i className="fas fa-plus-circle me-2"></i> Registrar gasto de insumos
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* NUEVA SECCIÓN SELLER: Ranking de Vendedores */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-6" data-aos="fade-right">
                    <div className="card border-0 shadow-sm p-4 h-100 bg-gradient" style={{ background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)' }}>
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="fas fa-medal text-warning"></i> Ranking del Mes
                        </h4>
                        <div className="d-grid gap-3">
                            <div className="d-flex align-items-center gap-3 p-3 bg-warning-subtle rounded-4 border border-warning">
                                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '45px', height: '45px', fontSize: '20px' }}>
                                    1
                                </div>
                                <div className="flex-1">
                                    <div className="fw-bold">María González</div>
                                    <div className="small text-muted">$128,500 en ventas</div>
                                </div>
                                <i className="fas fa-crown text-warning fs-3"></i>
                            </div>
                            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 border">
                                <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                                    2
                                </div>
                                <div className="flex-1">
                                    <div className="fw-bold">Tú (Juan Pérez)</div>
                                    <div className="small text-muted">$84,200 en ventas</div>
                                </div>
                                <span className="badge bg-success rounded-pill">+2 posiciones</span>
                            </div>
                            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4">
                                <div className="bg-light border text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                                    3
                                </div>
                                <div className="flex-1">
                                    <div className="fw-bold">Roberto Sánchez</div>
                                    <div className="small text-muted">$76,800 en ventas</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4">
                                <div className="bg-light border text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                                    4
                                </div>
                                <div className="flex-1">
                                    <div className="fw-bold">Ana Martínez</div>
                                    <div className="small text-muted">$68,400 en ventas</div>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-info mt-3 mb-0 small">
                            <i className="fas fa-info-circle me-2"></i>
                            Te faltan <strong>$44,300</strong> para alcanzar el primer lugar
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6" data-aos="fade-left">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="fas fa-calendar-check text-primary"></i> Calendario de Eventos
                        </h4>
                                    <div className="d-grid gap-3">
                                        {events.map(ev => (
                                            <div key={ev.id} className="d-flex gap-3 p-3 bg-white/10 rounded-4 border border-white/10 animate-fade-in hover-card-lift">
                                                <div className="text-center" style={{ minWidth: '60px' }}>
                                                    <div className={`fw-bold ${ev.type === 'bg-info' ? 'text-info' : 'text-primary'}`} style={{ fontSize: '24px' }}>{ev.day}</div>
                                                    <div className="small text-muted">{ev.month}</div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="fw-bold">{ev.title}</div>
                                                    <div className="small text-muted mb-2"><i className="far fa-clock me-1"></i> {ev.time}</div>
                                                    <span className={`badge ${ev.type}`}>Evento</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        className="btn btn-outline-primary btn-sm rounded-pill mt-3 fw-bold"
                                        onClick={addEvent}
                                    >
                                        <i className="fas fa-plus me-2"></i>Agregar Evento
                                    </button>
                    </div>
                </div>
            </div>

            {/* NUEVA SECCIÓN SELLER: Herramientas Rápidas */}
            <div className="row g-4 mb-5">
                <div className="col-12" data-aos="fade-up">
                    <div className="card border-0 shadow-sm p-4 bg-dark text-white">
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="fas fa-tools text-accent"></i> Herramientas Rápidas
                        </h4>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <div className="bg-white/10 p-4 rounded-4 border border-white/20 h-100">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <i className="fas fa-calculator text-accent fs-2"></i>
                                        <h5 className="fw-bold m-0">Calculadora de Comisión</h5>
                                    </div>
                                    <div className="mb-3">
                                        <label className="small text-white-50 mb-1">Monto de Venta</label>
                                        <input 
                                            type="number" 
                                            className="form-control form-control-sm" 
                                            placeholder="$0.00" 
                                            value={calcAmount}
                                            onChange={handleCalcChange}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center p-2 bg-success rounded-3 transition-all">
                                        <span className="small">Tu comisión (10%):</span>
                                        <span className="fw-bold">${calcResult.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="bg-white/10 p-4 rounded-4 border border-white/20 h-100">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <i className="fas fa-percentage text-warning fs-2"></i>
                                        <h5 className="fw-bold m-0">Descuentos Autorizados</h5>
                                    </div>
                                    <div className="d-grid gap-2">
                                        <div className="d-flex justify-content-between p-2 bg-white/5 rounded-3">
                                            <span className="small">Nivel Bronce:</span>
                                            <span className="badge bg-light text-dark">5%</span>
                                        </div>
                                        <div className="d-flex justify-content-between p-2 bg-white/5 rounded-3">
                                            <span className="small">Nivel Plata:</span>
                                            <span className="badge bg-light text-dark">10%</span>
                                        </div>
                                        <div className="d-flex justify-content-between p-2 bg-white/5 rounded-3">
                                            <span className="small">Nivel Oro:</span>
                                            <span className="badge bg-warning text-dark">15%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="bg-white/10 p-4 rounded-4 border border-white/20 h-100">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <i className="fas fa-qrcode text-primary fs-2"></i>
                                        <h5 className="fw-bold m-0">Código QR de Vendedor</h5>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-white p-3 rounded-3 d-inline-block mb-2">
                                            <i className="fas fa-qrcode text-dark" style={{ fontSize: '80px' }}></i>
                                        </div>
                                        <div className="small text-white-50">Escanea para contacto directo</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* NUEVA SECCIÓN SELLER: Accesos Directos */}
            <div className="row g-4 mt-2 mb-4">
                <div className="col-12" data-aos="fade-up">
                    <div className="card border-0 shadow-sm p-4">
                        <h4 className="fw-bold mb-3"><i className="fas fa-bolt text-warning me-2"></i> Accesos Directos</h4>
                        <div className="d-flex gap-3 flex-wrap">
                            <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => navigate('/catalog')}>
                                <i className="fas fa-search me-2"></i> Buscar Producto
                            </button>
                            <button className="btn btn-outline-success rounded-pill px-4" onClick={() => navigate('/my-sales')}>
                                <i className="fas fa-plus me-2"></i> Nueva Venta
                            </button>
                            <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate('/customers')}>
                                <i className="fas fa-user-plus me-2"></i> Nuevo Cliente
                            </button>
                             <button className="btn btn-outline-danger rounded-pill px-4" onClick={() => addNotification({ title: 'Error Reportado', text: 'Se ha enviado tu reporte al equipo técnico.', type: 'system' })}>
                                <i className="fas fa-bug me-2"></i> Reportar Error
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* NUEVA SECCIÓN SELLER: Academia y Gamification */}
            <div className="row g-4 mt-2 mb-4">
                <div className="col-12 col-lg-8" data-aos="fade-up">
                    <div className="card border-0 shadow-sm p-4 overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0"><i className="fas fa-graduation-cap text-primary me-2"></i> Academia de Ventas</h4>
                            <span className="badge bg-primary">Nuevos Cursos</span>
                        </div>
                        <div className="row g-3">
                            {courses.map(course => (
                                <div key={course.id} className="col-md-6">
                                    <div className="d-flex gap-3 p-3 bg-light rounded-4 hover-lift cursor-pointer" onClick={() => runCourse(course.id, course.title)}>
                                        <div className={`${course.color} ${course.color === 'bg-warning' ? 'text-dark' : 'text-white'} p-3 rounded-3 d-flex align-items-center justify-content-center shadow-sm`} style={{ width: '60px', height: '60px' }}>
                                            <i className={`fas ${course.icon}`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="fw-bold small mb-1">{course.title}</div>
                                            <div className="progress mb-2" style={{ height: '4px' }}>
                                                <div className="progress-bar bg-success transition-all" style={{ width: `${course.progress}%` }}></div>
                                            </div>
                                            <div className="x-small text-muted">{course.progress}% completado</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4" data-aos="fade-up" data-aos-delay="100">
                     <div className="card border-0 shadow-sm p-4 text-center bg-gradient h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <i className="fas fa-medal mb-3 text-warning" style={{ fontSize: '40px' }}></i>
                        <h4 className="fw-bold mb-2">Próximo Logro</h4>
                        <p className="small opacity-75 mb-3">Estás muy cerca de desbloquear "Vendedor Master".</p>
                        <div className="progress bg-white/20 mb-3" style={{ height: '8px' }}>
                             <div className="progress-bar bg-warning" style={{ width: '92%' }}></div>
                        </div>
                        <div className="small fw-bold">92% Completado</div>
                     </div>
                </div>
            </div>

            {/* NUEVA SECCIÓN SELLER: Pipeline de Prospección */}
            <div className="row g-4 mt-2 mb-4">
                <div className="col-12" data-aos="fade-up">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="fas fa-filter text-primary"></i> Pipeline de Prospección Digital
                        </h4>
                        <div className="row g-4 text-center">
                            <div className="col-md-3" data-aos="zoom-in" data-aos-delay="100">
                                <div className="p-4 bg-primary-subtle rounded-4 border border-primary-subtle hover-lift">
                                    <h2 className="fw-bold text-primary m-0">125</h2>
                                    <div className="small text-muted fw-bold mb-1">Leads Nuevos</div>
                                    <div className="progress" style={{ height: '4px' }}>
                                        <div className="progress-bar bg-primary" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3" data-aos="zoom-in" data-aos-delay="200">
                                <div className="p-4 bg-info-subtle rounded-4 border border-info-subtle hover-lift">
                                    <h2 className="fw-bold text-info m-0">42</h2>
                                    <div className="small text-muted fw-bold mb-1">En Seguimiento</div>
                                    <div className="progress" style={{ height: '4px' }}>
                                        <div className="progress-bar bg-info" style={{ width: '40%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3" data-aos="zoom-in" data-aos-delay="300">
                                <div className="p-4 bg-warning-subtle rounded-4 border border-warning-subtle hover-lift">
                                    <h2 className="fw-bold text-warning m-0">18</h2>
                                    <div className="small text-muted fw-bold mb-1">Cotización Enviada</div>
                                    <div className="progress" style={{ height: '4px' }}>
                                        <div className="progress-bar bg-warning" style={{ width: '20%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3" data-aos="zoom-in" data-aos-delay="400">
                                <div className="p-4 bg-success-subtle rounded-4 border border-success-subtle hover-lift">
                                    <h2 className="fw-bold text-success m-0">9</h2>
                                    <div className="small text-muted fw-bold mb-1">Cierres del Mes</div>
                                    <div className="progress" style={{ height: '4px' }}>
                                        <div className="progress-bar bg-success" style={{ width: '10%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-light rounded-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
                            <p className="m-0 small text-muted">
                                <i className="fas fa-info-circle text-primary me-2"></i>
                                Tu tasa de conversión actual es del <strong>7.2%</strong>. Recomendamos priorizar las 18 cotizaciones pendientes.
                            </p>
                            <button 
                                className="btn btn-primary btn-sm rounded-pill px-4 fw-bold shadow-sm"
                                onClick={() => addNotification({ title: 'CRM Sincronizado', text: 'Tus prospectos han sido actualizados con la nube.', type: 'success' })}
                            >
                                Sincronizar CRM
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClientDashboard = ({ orders, navigate, addNotification }) => {
    // Estados para interactividad del cliente

    const myOrders = orders.filter(o => o.clientName === 'Juan Cliente' || o.client === 'Juan Cliente');
    const latestOrder = myOrders[0] || null;

    const [purchaseFilter, setPurchaseFilter] = useState('Últimos 3 meses');
    const [favorites, setFavorites] = useState([1, 2, 3, 4]);

    const handleFavoriteToggle = (id) => {
        if (favorites.includes(id)) {
            setFavorites(prev => prev.filter(fid => fid !== id));
        } else {
            setFavorites(prev => [...prev, id]);
        }
    };

    return (
        <div className="container-fluid p-0">
             {/* Header Principal - Limpio y Profesional */}
             <div className="info-section mb-4" data-aos="fade-down">
                <div className="d-flex justify-content-between align-items-center bg-white p-4 rounded-4 shadow-sm border-start border-primary border-5">
                    <div>
                        <h2 className="display-6 fw-bold text-gradient mb-1">Panel de Control</h2>
                        <p className="text-muted m-0">Hola de nuevo. Aquí tienes un resumen de tu cuenta.</p>
                    </div>
                    <div className="text-end">
                        <div className="d-flex align-items-center gap-3">
                            <div className="text-end d-none d-sm-block">
                                <span className="d-block fw-bold text-dark">Nivel Oro</span>
                                <span className="text-muted small">850 pts para Platino</span>
                            </div>
                            <div className="bg-primary text-white p-3 rounded-circle shadow-sm">
                                <i className="fas fa-crown fa-lg text-warning"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fila de Métricas Rápidas */}
            <div className="row g-4 mb-4" data-aos="fade-up">
                <div className="col-6 col-lg-3">
                    <div className="card border-0 shadow-sm p-3 h-100 text-center hover-lift">
                        <div className="text-muted small fw-bold text-uppercase mb-1">Crédito</div>
                        <div className="h4 fw-extrabold text-success m-0">$12,000</div>
                    </div>
                </div>
                <div className="col-6 col-lg-3">
                    <div className="card border-0 shadow-sm p-3 h-100 text-center hover-lift border-bottom border-danger border-3">
                        <div className="text-muted small fw-bold text-uppercase mb-1">Por Pagar</div>
                        <div className="h4 fw-extrabold text-danger m-0">$1,200</div>
                    </div>
                </div>
                <div className="col-6 col-lg-3">
                    <div className="card border-0 shadow-sm p-3 h-100 text-center hover-lift">
                        <div className="text-muted small fw-bold text-uppercase mb-1">Pedidos Activos</div>
                        <div className="h4 fw-extrabold text-primary m-0">2</div>
                    </div>
                </div>
                <div className="col-6 col-lg-3">
                    <div className="card border-0 shadow-sm p-3 h-100 text-center hover-lift">
                        <div className="text-muted small fw-bold text-uppercase mb-1">Puntos Tech</div>
                        <div className="h4 fw-extrabold text-warning m-0">4,250</div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Columna Principal (Izquierda) */}
                <div className="col-12 col-xl-8">
                    {/* Rastreador de Pedido */}
                    <div className="card border-0 shadow-sm mb-4 overflow-hidden" data-aos="fade-right">
                        <div className="card-header bg-white p-4 border-0">
                            <h5 className="fw-bold m-0"><i className="fas fa-truck text-primary me-2"></i> Seguimiento de Pedido #9022</h5>
                        </div>
                        <div className="card-body p-4 pt-0">
                            <div className="d-flex justify-content-between mb-4 position-relative">
                                {/* Línea de progreso de fondo */}
                                <div className="position-absolute w-100 bg-light" style={{ height: '4px', top: '23px', zIndex: 0 }}></div>
                                <div className="position-absolute bg-primary" style={{ height: '4px', top: '23px', width: '50%', zIndex: 1 }}></div>
                                
                                <div className="text-center position-relative z-10" style={{ width: '25%' }}>
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow" style={{ width: '50px', height: '50px' }}>
                                        <i className="fas fa-file-invoice"></i>
                                    </div>
                                    <div className="small fw-bold">Recibido</div>
                                </div>
                                <div className="text-center position-relative z-10" style={{ width: '25%' }}>
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow" style={{ width: '50px', height: '50px' }}>
                                        <i className="fas fa-box"></i>
                                    </div>
                                    <div className="small fw-bold">Preparando</div>
                                </div>
                                <div className="text-center position-relative z-10" style={{ width: '25%' }}>
                                    <div className="bg-white border text-muted rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '50px', height: '50px' }}>
                                        <i className="fas fa-shipping-fast"></i>
                                    </div>
                                    <div className="small text-muted">En Camino</div>
                                </div>
                                <div className="text-center position-relative z-10" style={{ width: '25%' }}>
                                    <div className="bg-white border text-muted rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '50px', height: '50px' }}>
                                        <i className="fas fa-check-double"></i>
                                    </div>
                                    <div className="small text-muted">Entregado</div>
                                </div>
                            </div>
                            <div className="alert bg-primary-subtle border-0 mb-0 d-flex align-items-center gap-3">
                                <i className="fas fa-info-circle text-primary fs-4"></i>
                                <div className="small text-dark">
                                    {latestOrder 
                                        ? `Tu pedido #${latestOrder.id} está en estado: ${latestOrder.status}.`
                                        : 'No tienes pedidos activos en seguimiento.'}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Pedidos Recientes */}
                    <div className="card border-0 shadow-sm mb-4" data-aos="fade-up">
                        <div className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold m-0"><i className="fas fa-history text-secondary me-2"></i> Mis Pedidos Recientes</h5>
                            <button onClick={() => navigate('/client-orders')} className="btn btn-link btn-sm fw-bold text-decoration-none p-0 text-primary">Ver todos</button>
                        </div>
                        <div className="table-responsive px-4 pb-4">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr className="small text-muted">
                                        <th>ID</th>
                                        <th>Fecha</th>
                                        <th>Total</th>
                                        <th className="text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOrders.slice(0, 3).map(order => (
                                        <tr key={order.id}>
                                            <td className="fw-bold">#{order.id}</td>
                                            <td className="small">{order.date}</td>
                                            <td className="fw-bold">${order.total.toLocaleString()}</td>
                                            <td className="text-center">
                                                <span className={`badge ${
                                                    order.status === 'Pendiente' ? 'bg-primary-subtle text-primary' : 
                                                    order.status === 'Entregado' ? 'bg-success-subtle text-success' : 
                                                    'bg-info-subtle text-info'
                                                } rounded-pill px-3`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {myOrders.length === 0 && <tr><td colSpan="4" className="text-center py-3 text-muted">No tienes pedidos recientes</td></tr>}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>

                {/* Columna Lateral (Derecha) */}
                <div className="col-12 col-xl-4">
                    {/* Atención VIP */}
                    <div className="card border-0 shadow-sm mb-4 bg-primary text-white bg-gradient overflow-hidden relative" data-aos="fade-left">
                        <div className="card-body p-4 relative z-10">
                            <h5 className="fw-bold mb-3"><i className="fas fa-headset me-2"></i> Asistencia VIP</h5>
                            <p className="small opacity-75 mb-4">Tienes un asesor asignado para ayudarte con cualquier duda técnica o financiera.</p>
                            <div className="d-flex align-items-center gap-3 bg-white/10 p-3 rounded-4 mb-4">
                                <img src="https://ui-avatars.com/api/?name=Carlos+Asesor&background=fff&color=0C324A" className="rounded-circle border border-white/20" width="45" alt="Avatar" />
                                <div>
                                    <div className="fw-bold small">Carlos Martínez</div>
                                    <div className="text-white-50" style={{ fontSize: '10px' }}>Asesor de Cuenta Senior</div>
                                </div>
                                <div className="ms-auto">
                                    <span className="badge bg-success rounded-circle p-1"><span className="visually-hidden">Online</span></span>
                                </div>
                            </div>
                            <button onClick={() => navigate('/support')} className="btn btn-light w-100 rounded-pill fw-bold text-primary">Chat Directo</button>
                        </div>
                        <i className="fas fa-user-tie absolute -bottom-5 -right-5 text-white opacity-10" style={{ fontSize: '120px' }}></i>
                    </div>

                    {/* Acciones Rápidas */}
                    <div className="card border-0 shadow-sm mb-4 overflow-hidden" data-aos="fade-left" data-aos-delay="100">
                        <div className="card-header bg-white p-4 border-0">
                            <h5 className="fw-bold m-0">Acciones Directas</h5>
                        </div>
                        <div className="card-body p-4 pt-0">
                            <div className="row g-2">
                                <div className="col-6">
                                    <button onClick={() => navigate('/catalog')} className="btn btn-outline-primary w-100 py-3 rounded-4 d-flex flex-column align-items-center border-2 border-primary-subtle hover-lift">
                                        <i className="fas fa-shopping-cart mb-2 fa-lg"></i>
                                        <span className="small fw-bold">Nuevo Pedido</span>
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button onClick={() => navigate('/account-statement')} className="btn btn-outline-secondary w-100 py-3 rounded-4 d-flex flex-column align-items-center border-2 border-secondary-subtle hover-lift">
                                        <i className="fas fa-file-invoice-dollar mb-2 fa-lg"></i>
                                        <span className="small fw-bold">Mis Pagos</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Banner de Promo */}
                    <div className="card border-0 shadow-sm bg-accent text-white rounded-4 overflow-hidden" data-aos="zoom-in" data-aos-delay="200">
                        <div className="p-4 relative">
                            <span className="badge bg-white text-accent mb-2">Exclusivo VIP</span>
                            <h4 className="fw-bold">Dui Tech Days</h4>
                            <p className="small mb-4 opacity-75">Obtén <strong>10% extra de crédito</strong> por cada compra mayor a $5,000 durante esta semana.</p>
                            <button onClick={() => navigate('/catalog')} className="btn btn-outline-light btn-sm rounded-pill fw-bold px-4">Saber más</button>
                            <i className="fas fa-tags absolute -top-5 -right-5 opacity-20" style={{ fontSize: '80px' }}></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fila Inferior: Seguridad y Noticias + Nueva sección Beneficios Tech */}
            <div className="row g-4 mt-1 mb-5">
                <div className="col-12 col-lg-4" data-aos="fade-up">
                    <div className="card border-0 shadow-sm p-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="fas fa-shield-alt text-primary"></i> Actividad de Seguridad
                        </h5>
                        <div className="table-responsive">
                            <table className="table table-sm table-hover border-0 mb-0">
                                <tbody>
                                    <tr>
                                        <td className="border-0 py-3"><i className="fas fa-sign-in-alt text-success me-3"></i> Login: Chrome en Windows</td>
                                        <td className="border-0 py-3 text-end text-muted small fw-bold">Hoy, 11:01 AM</td>
                                    </tr>
                                    <tr>
                                        <td className="border-0 py-3"><i className="fas fa-key text-warning me-3"></i> Cambio de Pass</td>
                                        <td className="border-0 py-3 text-end text-muted small fw-bold">01 Feb, 09:12 AM</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="card border-0 shadow-sm p-4 h-100 bg-light">
                        <h5 className="fw-bold mb-3">Avisos del Sistema</h5>
                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex gap-3">
                                <div className="bg-white p-2 rounded-3 shadow-sm flex-shrink-0" style={{ height: 'fit-content' }}>
                                    <i className="fas fa-bullhorn text-primary"></i>
                                </div>
                                <div className="small">
                                    <div className="fw-bold">Nuevo Almacén en el Norte</div>
                                    <div className="text-muted">Ahora tus envíos a Monterrey llegarán en 24 horas.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="card border-0 shadow-sm p-4 h-100 bg-dark text-white text-center d-flex flex-column justify-content-center">
                        <div className="mb-3">
                            <i className="fas fa-star text-warning fa-2xl"></i>
                        </div>
                        <h5 className="fw-bold text-accent">Dui Tech Rewards</h5>
                        <p className="small opacity-75 mb-3">Canjea tus 4,250 puntos por cupones de envío gratis o descuentos directos.</p>
                        <button className="btn btn-outline-light btn-sm rounded-pill px-4" onClick={() => addNotification({ title: 'Canje de Puntos', text: 'Cargando catálogo de recompensas disponibles...', type: 'info' })}>Ir a Recompensas</button>
                    </div>
                </div>
            </div>

            {/* NUEVA SECCIÓN CLIENTE: Ofertas Relámpago y Centro de Ayuda */}
            <div className="row g-4 mt-2 mb-5">
                <div className="col-12 col-md-8" data-aos="fade-up">
                    <div className="card border-0 shadow-sm p-4 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0C324A 0%, #2a526d 100%)', color: 'white' }}>
                        <div className="relative z-10">
                            <h4 className="fw-bold mb-2">🔥 ¡Ofertas Relámpago!</h4>
                            <p className="small opacity-75 mb-4">Solo por las próximas 4 horas. ¡Aprovecha estos precios!</p>
                            <div className="row g-3">
                                <div className="col-4">
                                    <div className="bg-white/10 p-2 rounded-3 text-center border border-white/10">
                                        <div className="small x-small text-white-50">SSD 1TB</div>
                                        <div className="fw-bold">$890</div>
                                        <div className="badge bg-danger rounded-pill x-small">-40%</div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="bg-white/10 p-2 rounded-3 text-center border border-white/10">
                                        <div className="small x-small text-white-50">Teclado Mec</div>
                                        <div className="fw-bold">$1,200</div>
                                        <div className="badge bg-danger rounded-pill x-small">-25%</div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="bg-white/10 p-2 rounded-3 text-center border border-white/10">
                                        <div className="small x-small text-white-50">Mouse Gamer</div>
                                        <div className="fw-bold">$450</div>
                                        <div className="badge bg-danger rounded-pill x-small">-50%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <i className="fas fa-bolt absolute -right-5 -bottom-5 text-white opacity-5" style={{ fontSize: '150px' }}></i>
                    </div>
                </div>
                <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="card border-0 shadow-sm p-4 h-100 bg-white border-top border-accent border-4">
                        <h5 className="fw-bold mb-3">¿Necesitas Ayuda?</h5>
                        <p className="small text-muted mb-4">Nuestro equipo de soporte está disponible 24/7 para ti.</p>
                        <div className="d-grid gap-2">
                            <button onClick={() => navigate('/support')} className="btn btn-outline-primary btn-sm rounded-pill fw-bold">Preguntas Frecuentes</button>
                            <button onClick={() => navigate('/support')} className="btn btn-accent btn-sm rounded-pill fw-bold">Hablar con humano</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* NUEVA SECCIÓN CLIENTE: Historial de Compras Detallado */}
            <div className="row g-4 mt-2 mb-5">
                <div className="col-12 col-lg-8" data-aos="fade-right">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0"><i className="fas fa-chart-area text-primary me-2"></i> Análisis de Compras</h4>
                            <select 
                                className="form-select form-select-sm w-auto cursor-pointer"
                                value={purchaseFilter}
                                onChange={(e) => setPurchaseFilter(e.target.value)}
                            >
                                <option>Últimos 3 meses</option>
                                <option>Últimos 6 meses</option>
                                <option>Último año</option>
                            </select>
                        </div>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <div className="p-3 bg-primary-subtle rounded-4 text-center">
                                    <i className="fas fa-shopping-bag text-primary fs-3 mb-2"></i>
                                    <div className="small text-muted mb-1">Total Gastado</div>
                                    <div className="h4 fw-bold text-primary m-0">$48,750</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 bg-success-subtle rounded-4 text-center">
                                    <i className="fas fa-box text-success fs-3 mb-2"></i>
                                    <div className="small text-muted mb-1">Productos Comprados</div>
                                    <div className="h4 fw-bold text-success m-0">23</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 bg-warning-subtle rounded-4 text-center">
                                    <i className="fas fa-receipt text-warning fs-3 mb-2"></i>
                                    <div className="small text-muted mb-1">Ticket Promedio</div>
                                    <div className="h4 fw-bold text-warning m-0">$2,120</div>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-sm align-middle mb-0">
                                <thead className="text-muted small">
                                    <tr>
                                        <th>Categoría</th>
                                        <th className="text-center">Compras</th>
                                        <th className="text-end">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="fw-bold small">Smartphones</td>
                                        <td className="text-center small">5</td>
                                        <td className="text-end small fw-bold">$28,500</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold small">Accesorios</td>
                                        <td className="text-center small">12</td>
                                        <td className="text-end small fw-bold">$8,450</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold small">Laptops</td>
                                        <td className="text-center small">3</td>
                                        <td className="text-end small fw-bold">$11,800</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-4" data-aos="fade-left">
                    <div className="card border-0 shadow-sm p-4 h-100 bg-gradient" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="fas fa-star text-warning"></i> Productos Recomendados
                        </h5>
                        <div className="d-grid gap-3">
                            <div className="bg-white p-3 rounded-4 shadow-sm">
                                <div className="d-flex gap-3">
                                    <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="fas fa-headphones text-primary fs-4"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="fw-bold small">AirPods Pro Gen 2</div>
                                        <div className="text-muted x-small mb-2">Basado en tus compras</div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold text-primary">$4,299</span>
                                            <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => addNotification({ title: 'Producto', text: 'Abriendo detalle de AirPods Pro...', type: 'info' })}>Ver</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-4 shadow-sm">
                                <div className="d-flex gap-3">
                                    <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="fas fa-laptop text-success fs-4"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="fw-bold small">MacBook Air M2</div>
                                        <div className="text-muted x-small mb-2">Popular en tu categoría</div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold text-success">$24,999</span>
                                            <button className="btn btn-sm btn-success rounded-pill px-3" onClick={() => addNotification({ title: 'Producto', text: 'Abriendo detalle de MacBook Air...', type: 'info' })}>Ver</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-4 shadow-sm">
                                <div className="d-flex gap-3">
                                    <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="fas fa-tablet-alt text-warning fs-4"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="fw-bold small">iPad Pro 11"</div>
                                        <div className="text-muted x-small mb-2">Oferta especial</div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold text-warning">$18,499</span>
                                            <button className="btn btn-sm btn-warning rounded-pill px-3" onClick={() => addNotification({ title: 'Producto', text: 'Abriendo detalle de iPad Pro...', type: 'info' })}>Ver</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NUEVA SECCIÓN CLIENTE: Programa de Referidos */}
            <div className="row g-4 mt-2 mb-5">
                <div className="col-12" data-aos="fade-up">
                    <div className="card border-0 shadow-lg p-4 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', color: 'white' }}>
                        <div className="row align-items-center relative z-10">
                            <div className="col-md-8">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="bg-white/20 p-3 rounded-circle">
                                        <i className="fas fa-gift fs-2"></i>
                                    </div>
                                    <div>
                                        <h3 className="fw-bold m-0">Programa de Referidos Dui Tech</h3>
                                        <p className="small opacity-75 m-0">Invita a tus amigos y gana beneficios increíbles</p>
                                    </div>
                                </div>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-4">
                                        <div className="bg-white/10 p-3 rounded-4 border border-white/20 text-center">
                                            <div className="h2 fw-bold m-0">3</div>
                                            <div className="small opacity-75">Amigos Referidos</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="bg-white/10 p-3 rounded-4 border border-white/20 text-center">
                                            <div className="h2 fw-bold m-0">$1,500</div>
                                            <div className="small opacity-75">Crédito Ganado</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="bg-white/10 p-3 rounded-4 border border-white/20 text-center">
                                            <div className="h2 fw-bold m-0">$500</div>
                                            <div className="small opacity-75">Por Cada Referido</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex gap-2 flex-wrap">
                                    <button className="btn btn-light btn-lg rounded-pill px-4 fw-bold" onClick={() => addNotification({ title: 'Compartir', text: 'Enlace de referido generado y copiado.', type: 'success' })}>
                                        <i className="fas fa-share-alt me-2"></i>Compartir mi Código
                                    </button>
                                    <button className="btn btn-outline-light btn-lg rounded-pill px-4 fw-bold">
                                        Ver Términos
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-4 text-center d-none d-md-block">
                                <div className="bg-white p-4 rounded-4 shadow-lg">
                                    <div className="fw-bold text-dark mb-2">Tu Código de Referido</div>
                                    <div className="h1 fw-bold text-primary m-0 font-monospace">DUI2026</div>
                                    <button className="btn btn-sm btn-primary rounded-pill mt-3 px-4" onClick={() => addNotification({ title: 'Código Copiado', text: 'Código DUI2026 listo para pegar.', type: 'info' })}>
                                        <i className="fas fa-copy me-2"></i>Copiar
                                    </button>
                                </div>
                            </div>
                        </div>
                        <i className="fas fa-users absolute -bottom-10 -right-10 text-white opacity-10" style={{ fontSize: '200px' }}></i>
                    </div>
                </div>
            </div>

            {/* NUEVA SECCIÓN CLIENTE: Mis Favoritos */}
            <div className="row g-4 mt-2 mb-4">
                <div className="col-12" data-aos="fade-up">
                    <div className="card border-0 shadow-sm p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0"><i className="fas fa-heart text-danger me-2"></i> Mis Favoritos</h4>
                            <button onClick={() => navigate('/catalog')} className="btn btn-sm btn-link text-decoration-none fw-bold">Ver todos</button>
                        </div>
                        <div className="row g-3">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="col-6 col-md-3" data-aos="zoom-in" data-aos-delay={item * 50}>
                                    <div className="card h-100 border-0 shadow-sm bg-light hover-lift">
                                        <div className="card-body text-center p-3 relative">
                                            <button 
                                                className="absolute top-2 right-2 btn btn-link p-0 text-decoration-none"
                                                onClick={() => handleFavoriteToggle(item)}
                                            >
                                                <i className={`fas fa-heart ${favorites.includes(item) ? 'text-danger' : 'text-muted opacity-25'} fs-5 transition-all`}></i>
                                            </button>
                                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                                                <i className="fas fa-heart text-danger opacity-50"></i>
                                            </div>
                                            <h6 className="fw-bold text-truncate">Producto Favorito {item}</h6>
                                            <div className="text-primary fw-bold small">$1,200</div>
                                            <button className="btn btn-sm btn-primary w-100 rounded-pill mt-2" onClick={() => addNotification({ title: 'Carrito Actualizado', text: 'Producto añadido a tu orden actual.', type: 'success' })}>
                                                {favorites.includes(item) ? 'Comprar' : 'Agregar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default Dashboard;
