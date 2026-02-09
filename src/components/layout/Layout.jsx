import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Layout = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();

    const path = location.pathname;
    
    const titles = {
        '/dashboard': 'Dashboard Global',
        '/inventory': 'Gestión de Inventario',
        '/orders': 'Gestión de Órdenes',
        '/my-sales': 'Terminal de Ventas / POS',
        '/customers': 'CRM Clientes',
        '/finance': 'Control Financiero',
        '/docs': 'Documentación Técnica',
        '/catalog': 'Catálogo de Productos',
        '/client-orders': 'Mis Pedidos realizados',
        '/account-statement': 'Estado de Cuenta',
        '/profile': 'Configuración de Perfil',
        '/support': 'Soporte al Cliente'
    };
    const pageTitle = titles[path] || 'Dui Tech ERP';

    const unreadCount = notifications.filter(n => n.unread).length;

    // Cerrar notificaciones al cambiar de ruta e inicializar AOS
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setNotificationsOpen(false);
            if (window.AOS) {
                window.AOS.init({
                    duration: 800,
                    once: false,
                    mirror: true
                });
                window.AOS.refresh();
            }
        }, 0);
        return () => clearTimeout(timeoutId);
    }, [location.pathname]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div id="app-container">
            {/* El sidebar se mantiene en todas las vistas */}
            <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
            
            <main className="main-content">
                <header className="header">
                    <div className="flex items-center gap-4">
                        <button id="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <h2 id="page-title">{pageTitle}</h2>
                    </div>
                    
                    <div className="actions flex items-center gap-4">
                        {/* Campana de Notificaciones - Estética Premium */}
                        <div className="relative">
                            <button 
                                type="button"
                                className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 relative ${
                                    notificationsOpen 
                                    ? 'bg-primary text-white shadow-lg ring-4 ring-primary/10' 
                                    : 'bg-white text-gray-400 hover:text-primary hover:bg-gray-50 border border-gray-100 shadow-sm'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setNotificationsOpen(!notificationsOpen);
                                }}
                                style={{ zIndex: 9001 }}
                            >
                                <i className={`fas fa-bell ${unreadCount > 0 && !notificationsOpen ? 'animate-bounce-subtle text-accent' : ''} text-lg`}></i>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                        </div>


                        <span className="date-display hidden md:block">
                            <i className="far fa-calendar-alt mr-2 opacity-50"></i>
                            {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </header>

                {/* Overlay invisible para cerrar el dropdown - Z-index intermedio para cubrir header(500) pero estar bajo botón(9001) y menú(9999) */}
                {notificationsOpen && (
                    <div 
                        className="fixed inset-0 z-[400] bg-transparent" 
                        onClick={() => {
                            setNotificationsOpen(false);
                        }}
                    ></div>
                )}

                {/* Dropdown de Notificaciones - CENTRADO EXPLÍCITO */}
                {notificationsOpen && (
                    <div 
                        style={{ 
                            position: 'fixed', 
                            top: '80px', 
                            left: 0, 
                            width: '100%', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            zIndex: 9999, 
                            pointerEvents: 'none' 
                        }}
                    >
                        <div 
                            className="bg-white border-0 rounded-4 overflow-hidden animate-zoom-in shadow-2xl"
                            style={{ 
                                width: '400px', 
                                maxWidth: 'calc(100vw - 2rem)', 
                                pointerEvents: 'auto',
                                maxHeight: '80vh',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Cabecera con paleta Dui Tech */}
                            <div className="p-4 bg-primary text-white text-center flex-shrink-0">
                                <h4 className="fw-extrabold m-0 mb-1">Centro de Notificaciones</h4>
                                <p className="small opacity-75 mb-3">Mantente al día con la actividad de tu ERP</p>
                                <div className="d-flex justify-content-center gap-2">
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                                            className="btn btn-sm btn-light rounded-pill px-3 fw-bold text-primary shadow-sm"
                                            style={{ fontSize: '11px' }}
                                        >
                                            <i className="fas fa-check-double me-1"></i> Todo leído
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="overflow-y-auto scrollbar-thin flex-grow">
                                {notifications.length === 0 ? (
                                    <div className="p-5 text-center py-5 bg-light/30">
                                        <div className="bg-white shadow-sm w-16 h-16 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                                            <i className="fas fa-bell-slash text-muted fs-4"></i>
                                        </div>
                                        <h6 className="fw-bold text-primary">¡Todo al día!</h6>
                                        <p className="small text-muted mb-0">No tienes notificaciones pendientes.</p>
                                    </div>
                                ) : (
                                    <div className="d-grid shadow-inner">
                                        {notifications.map((n) => (
                                            <div 
                                                key={n.id} 
                                                className={`p-3 border-bottom transition-all position-relative ${n.unread ? 'bg-primary-subtle' : 'bg-white'}`}
                                                style={{ borderLeft: n.unread ? '4px solid var(--color-accent)' : '4px solid transparent' }}
                                            >
                                                <div className="d-flex gap-3">
                                                    <div className={`w-11 h-11 rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center shadow-sm ${
                                                        n.type === 'order' ? 'bg-primary text-white' : 
                                                        n.type === 'stock' ? 'bg-danger text-white' : 
                                                        'bg-secondary text-white'
                                                    }`}>
                                                        <i className={`fas ${
                                                            n.type === 'order' ? 'fa-shopping-cart' : 
                                                            n.type === 'stock' ? 'fa-box-open' : 
                                                            'fa-info-circle'
                                                            } fs-6`}></i>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                                            <div className={`fw-bold small truncate m-0 ${n.unread ? 'text-primary' : 'text-dark'}`} style={{ fontSize: '0.85rem' }}>
                                                                {n.title}
                                                            </div>
                                                            <div className="d-flex gap-1 ms-2">
                                                                {n.unread && (
                                                                    <button 
                                                                        className="btn btn-sm btn-link p-1 text-primary hover-lift"
                                                                        onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                                                                        title="Marcar como leído"
                                                                    >
                                                                        <i className="fas fa-check-circle"></i>
                                                                    </button>
                                                                )}
                                                                <button 
                                                                    className="btn btn-sm btn-link p-1 text-danger opacity-75 hover-opacity-100 hover-lift"
                                                                    onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                                                                    title="Eliminar"
                                                                >
                                                                    <i className="fas fa-trash-alt"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-muted mb-2 line-clamp-2" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                                                            {n.text}
                                                        </p>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <span className="fw-bold text-uppercase text-muted" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>
                                                                <i className="far fa-clock me-1"></i> {n.time}
                                                            </span>
                                                            {n.unread && <span className="badge bg-danger rounded-pill" style={{ fontSize: '8px', padding: '2px 5px' }}>Nuevo</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-light text-center border-top flex-shrink-0">
                                <button className="btn btn-link btn-sm fw-bold text-decoration-none text-primary text-uppercase tracking-widest p-0" style={{ fontSize: '10px' }}>
                                    Ver todas las notificaciones <i className="fas fa-chevron-right ms-1"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div id="content-area" className="view-container">
                    {/* El Outlet renderiza cualquier sección/página: Vendedor, Cliente o Admin */}
                    <div className="max-w-[1400px] mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Backdrop para móvil */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-[40] bg-black/50 backdrop-blur-sm md:hidden" 
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Layout;
