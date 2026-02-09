import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
const Sidebar = ({ isOpen, setOpen }) => {
    const closeSidebar = () => {
        if (window.innerWidth < 768) {
            setOpen(false);
        }
    };

    const { user } = useAuth();
    const role = user?.role;

    const allLinks = [
        { to: "/dashboard", icon: <i className="fas fa-chart-line"></i>, label: "Dashboard", roles: ['admin', 'seller', 'client'], id: 'nav-dashboard' },
        { to: "/inventory", icon: <i className="fas fa-boxes"></i>, label: "Inventario", roles: ['admin'], id: 'nav-inventory' },
        { to: "/my-sales", icon: <i className="fas fa-cash-register"></i>, label: "Mis Ventas", roles: ['seller'], id: 'nav-my-sales' },
        { to: "/orders", icon: <i className="fas fa-truck-loading"></i>, label: "Gestión Ordenes", roles: ['admin'], id: 'nav-orders' },
        { to: "/customers", icon: <i className="fas fa-users"></i>, label: "Clientes (CRM)", roles: ['admin', 'seller'], id: 'nav-customers' },

        { to: "/finance", icon: <i className="fas fa-file-invoice-dollar"></i>, label: "Finanzas", roles: ['admin'], id: 'nav-finance' },
        { to: "/docs", icon: <i className="fas fa-book"></i>, label: "Documentación", roles: ['admin'], id: 'nav-docs' },
        { to: "/catalog", icon: <i className="fas fa-store"></i>, label: "Catálogo", roles: ['client'], id: 'nav-catalog' },
        { to: "/client-orders", icon: <i className="fas fa-shopping-bag"></i>, label: "Mis Compras", roles: ['client'], id: 'nav-client-orders' },
        { to: "/account-statement", icon: <i className="fas fa-file-invoice-dollar"></i>, label: "Estado de Cuenta", roles: ['client'], id: 'nav-account-statement' },
        { to: "/profile", icon: <i className="fas fa-user-circle"></i>, label: "Mi Perfil", roles: ['seller', 'client'], id: 'nav-profile' },
        { to: "/support", icon: <i className="fas fa-headset"></i>, label: "Ayuda y Soporte", roles: ['seller', 'client'], id: 'nav-support' },
    ];

    const { logout } = useAuth();
    const links = allLinks.filter(link => link.roles.includes(role));

    return (
        <nav className={`sidebar ${isOpen ? 'open' : ''} fixed md:relative z-30 h-full`} id="sidebar">
            <div className="brand">
                <i className="fas fa-microchip"></i> Dui Tech ERP
            </div>
            <ul className="nav-links">
                {links.map((link) => (
                    <li key={link.to} id={link.id} className="p-0">
                        <NavLink 
                            to={link.to} 
                            onClick={closeSidebar}
                            className={({ isActive }) => 
                                `flex items-center gap-[10px] w-full h-full px-6 py-3 transition-all ${isActive ? 'active' : ''}`
                            }
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
            <div className="user-profile">
                <div className="avatar">
                    {user?.name?.charAt(0)}
                </div>
                <div>
                    <div>{user?.name}</div>
                    <small>{user?.title}</small>
                </div>
                <i className="fas fa-sign-out-alt logout-btn" onClick={logout}></i>
            </div>
        </nav>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default Sidebar;
