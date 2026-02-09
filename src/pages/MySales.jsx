import { useState } from 'react';
import Modal from '../components/ui/Modal';
import { productsData, initialOrders } from '../context/mockData';
import { useNotifications } from '../context/NotificationContext';
import StatCard from '../components/ui/StatCard';
import useLocalStorage from '../hooks/useLocalStorage';

 
const generateSaleId = () => 'V-' + Math.floor(Math.random() * 9000 + 1000);

const MySales = () => {
    const { addNotification } = useNotifications();
    const [sales, setSales] = useLocalStorage('duitech_orders', initialOrders);
    const [inventory, setInventory] = useLocalStorage('duitech_inventory', productsData);
    const [cart, setCart] = useState([]);
    const [isPosOpen, setIsPosOpen] = useState(false);
    const [search, setSearch] = useState('');

    const addToCart = (product) => {
        const exists = cart.find(item => item.id === product.id);
        if (exists) {
            setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);



    const handleFinalizeSale = (e) => {
        e.preventDefault();
        const clientName = e.target.clientName.value || 'Venta Mostrador';
        
        const newSale = {
            id: generateSaleId(),
            date: 'Ahora',
            client: clientName,
            clientName: clientName,
            total: cartTotal,
            items: cart.reduce((acc, i) => acc + i.qty, 0),
            status: 'Entregado'
        };

        setSales([newSale, ...sales]);
        
        // Update Inventory stocks
        const updatedInventory = inventory.map(item => {
            const cartItem = cart.find(ci => ci.id === item.id);
            if (cartItem) {
                return { ...item, stock: item.stock - cartItem.qty };
            }
            return item;
        });
        setInventory(updatedInventory);

        
        addNotification({
            title: 'Venta Registrada',
            text: `Venta #${newSale.id} por $${cartTotal.toLocaleString()} a ${clientName}.`,
            type: 'order'
        });

        setCart([]);
        setIsPosOpen(false);
    };

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Mis Ventas y Terminal (POS)</h2>
                <p className="text-muted fs-5">Gestiona tus transacciones diarias, realiza nuevas ventas y realiza seguimiento a tus comisiones.</p>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="100">
                    <StatCard 
                        title="Vendido Hoy" 
                        value={`$ ${(sales.filter(s => s.date.includes('Hoy')).reduce((a, b) => a + b.total, 0)).toLocaleString()}`} 
                        sub="Meta diaria: $ 5,000" 
                        icon="fa-money-bill-wave" 
                        trend="up" 
                    />
                </div>
                <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="200">
                    <StatCard 
                        title="Meta Mensual" 
                        value="78%" 
                        sub="Progreso actual" 
                        icon="fa-chart-pie" 
                        trend="neutral" 
                    />
                </div>
                <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="300">
                    <div 
                        onClick={() => setIsPosOpen(true)}
                        className="card h-100 border-0 shadow-sm p-4 bg-primary text-white cursor-pointer hover-lift translate-y-n2"
                    >
                        <div className="d-flex justify-content-between items-start mb-3">
                            <h3 className="h6 fw-bold m-0 text-white-50">Acceso Rápido</h3>
                            <i className="fas fa-keyboard text-white-50"></i>
                        </div>
                        <div className="h2 fw-extrabold mb-1">Abrir POS</div>
                        <p className="small text-white-50 mb-0">Iniciar nueva terminal de venta</p>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm overflow-hidden" data-aos="fade-up">
                <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                    <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
                        <i className="fas fa-history text-primary"></i> Ventas Recientes
                    </h4>
                    <button className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm" onClick={() => setIsPosOpen(true)}>
                        <i className="fas fa-plus"></i> Nueva Venta (F2)
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">ID Venta</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Artículos</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th className="pe-4 text-end">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                <tr key={sale.id}>
                                    <td className="ps-4"><span className="badge bg-light text-dark border fw-bold">#{sale.id}</span></td>
                                    <td className="text-muted small">{sale.date}</td>
                                    <td className="fw-bold text-dark">{sale.client}</td>
                                    <td>{sale.items} u.</td>
                                    <td className="fw-bold text-primary">$ {sale.total.toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${sale.status === 'Completada' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} px-3 py-2 rounded-pill fw-bold border ${sale.status === 'Completada' ? 'border-success-subtle' : 'border-warning-subtle'}`}>
                                            {sale.status}
                                        </span>
                                    </td>
                                    <td className="pe-4 text-end">
                                        <button className="btn btn-light btn-sm text-primary shadow-sm" title="Imprimir Ticket"><i className="fas fa-print"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* POS MODAL */}
            <Modal isOpen={isPosOpen} onClose={() => setIsPosOpen(false)} title="Terminal de Ventas (Point of Sale)">
                <div className="row g-4" style={{ minHeight: '600px' }}>
                    {/* Catalog Section */}
                    <div className="col-12 col-lg-8 d-flex flex-column border-end border-light">
                        <div className="input-group mb-4 shadow-sm">
                            <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted"></i></span>
                            <input 
                                type="text" 
                                placeholder="Escribe para buscar productos..." 
                                className="form-control border-start-0"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '500px' }}>
                            <div className="row g-3">
                                {inventory.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (

                                    <div className="col-6 col-sm-4 col-md-3" key={p.id}>
                                        <div 
                                            className="card h-100 border p-3 hover-lift shadow-none cursor-pointer text-center group"
                                            onClick={() => addToCart(p)}
                                        >
                                            <div className="small fw-extrabold text-muted text-uppercase mb-2" style={{ fontSize: '9px' }}>{p.brand}</div>
                                            <div className="small fw-bold text-dark mb-2 text-truncate">{p.name}</div>
                                            <div className="mt-auto pt-2">
                                                <div className="h6 fw-extrabold text-primary m-0">$ {p.price.toLocaleString()}</div>
                                                <div className="text-[9px] text-muted">Stock: {p.stock}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cart Section */}
                    <div className="col-12 col-lg-4 d-flex flex-column">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><i className="fas fa-shopping-cart text-primary"></i> Venta Actual</h5>
                        <div className="flex-grow-1 overflow-auto bg-light rounded-3 p-3 mb-4" style={{ maxHeight: '400px' }}>
                            {cart.length === 0 ? (
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted py-5 text-center">
                                    <i className="fas fa-cart-plus display-1 opacity-10 mb-3"></i>
                                    <p className="small m-0">Selecciona productos para comenzar</p>
                                </div>
                            ) : (
                                <div className="d-grid gap-2">
                                    {cart.map(item => (
                                        <div key={item.id} className="bg-white border p-2 rounded shadow-sm d-flex justify-content-between align-items-center">
                                            <div className="min-w-0 flex-grow-1 me-2">
                                                <div className="small fw-bold text-dark text-truncate">{item.name}</div>
                                                <div className="text-[10px] text-muted">{item.qty} u. x $ {item.price.toLocaleString()}</div>
                                            </div>
                                            <div className="fw-bold text-primary small">$ {(item.qty * item.price).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mt-auto border-top pt-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="h6 m-0 fw-bold">TOTAL A PAGAR</span>
                                <span className="h4 m-0 fw-extrabold text-primary">$ {cartTotal.toLocaleString()}</span>
                            </div>
                            <form onSubmit={handleFinalizeSale} className="d-grid gap-3">
                                <input name="clientName" placeholder="Nombre del Cliente (Opcional)" className="form-control form-control-lg border-2" />
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg fw-bold shadow-sm py-3"
                                    disabled={cart.length === 0}
                                >
                                    Confirmar Venta (F10)
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MySales;
