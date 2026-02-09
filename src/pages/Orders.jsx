import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext'; 
import { initialOrders } from '../context/mockData';
import useLocalStorage from '../hooks/useLocalStorage';

const Orders = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    
    const [orders, setOrders] = useLocalStorage('duitech_orders', initialOrders);
    const [search, setSearch] = useState('');

    const updateOrderStatus = (id, newStatus) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        addNotification({
            title: 'Orden Actualizada',
            text: `La orden #${id} ahora está ${newStatus}.`,
            type: 'info'
        });
    };


    const handleNewOrder = () => {
        const newOrder = {
            id: (Math.floor(Math.random() * 9000) + 1000).toString(),
            client: 'Cliente Nuevo S.A.',
            date: 'Ahora',
            total: 0,
            status: 'Pendiente'
        };
        setOrders([newOrder, ...orders]);
        addNotification({
            title: 'Orden Creada',
            text: `Nueva orden #${newOrder.id} generada exitosamente.`,
            type: 'success'
        });
    };

    const handleViewDetail = (id) => {
        addNotification({
            title: 'Detalle de Orden',
            text: `Visualizando detalles completos de la orden #${id}`,
            type: 'info'
        });
    };

    const filteredOrders = orders.filter(o => 
        o.id.includes(search) || o.client.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Gestión de Ordenes</h2>
                <p className="text-muted fs-5">Seguimiento de pedidos, estados de envío y logística de entrega.</p>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="100">
                    <div className="card border-0 shadow-sm p-4 h-100 border-start border-warning border-4">
                        <h3 className="h6 fw-bold text-muted text-uppercase mb-3 d-flex align-items-center gap-2">
                            <i className="fas fa-clock text-warning"></i> Ordenes Pendientes
                        </h3>
                        <div className="display-5 fw-extrabold text-dark mb-2">12</div>
                        <p className="small text-muted mb-0">Pendientes de validación</p>
                    </div>
                </div>
                <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="200">
                    <div className="card border-0 shadow-sm p-4 h-100 border-start border-primary border-4">
                        <h3 className="h6 fw-bold text-muted text-uppercase mb-3 d-flex align-items-center gap-2">
                            <i className="fas fa-truck text-primary"></i> En Logística
                        </h3>
                        <div className="display-5 fw-extrabold text-dark mb-2">5</div>
                        <p className="small text-muted mb-0">En ruta de entrega</p>
                    </div>
                </div>
                <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="300">
                    <div className="card border-0 shadow-sm p-4 h-100 border-start border-success border-4">
                        <h3 className="h6 fw-bold text-muted text-uppercase mb-3 d-flex align-items-center gap-2">
                            <i className="fas fa-check-double text-success"></i> Entregas Hoy
                        </h3>
                        <div className="display-5 fw-extrabold text-success mb-2">24</div>
                        <p className="small text-success fw-bold mb-0">+10% vs ayer</p>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm overflow-hidden" data-aos="fade-up">
                <div className="card-header bg-white border-0 p-4">
                    <div className="row g-3 align-items-center">
                        <div className="col-12 col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-0"><i className="fas fa-search text-muted"></i></span>
                                <input 
                                    type="text" 
                                    placeholder="Buscar ID o Cliente..." 
                                    className="form-control bg-light border-0"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-auto ms-auto d-flex gap-2">
                            <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                                <i className="fas fa-filter"></i> Filtrar
                            </button>
                            {user?.role === 'admin' && (
                                <button 
                                    className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm fw-bold"
                                    onClick={handleNewOrder}
                                >
                                    <i className="fas fa-plus-circle"></i> Nueva Orden
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Cliente / Destinatario</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th className="pe-4 text-end">Acciones</th>
                            </tr>
                        </thead>
                       <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="ps-4"><span className="badge bg-light text-dark border">#{order.id}</span></td>
                                    <td>
                                        <div className="fw-bold text-dark">{order.client}</div>
                                    </td>
                                    <td className="text-muted small">{order.date}</td>
                                    <td className="fw-extrabold text-primary">$ {order.total.toLocaleString()}</td>
                                    <td>
                                        <select 
                                            className={`form-select form-select-sm border-0 fw-bold rounded-pill text-center ${
                                                order.status === 'Pendiente' ? 'bg-warning-subtle text-warning' : 
                                                order.status === 'Entregado' ? 'bg-success-subtle text-success' : 
                                                'bg-primary-subtle text-primary'
                                            }`}
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            style={{ fontSize: '10px', width: 'fit-content' }}
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="En Preparación">Preparando</option>
                                            <option value="Enviado">Enviado</option>
                                            <option value="Entregado">Entregado</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </select>
                                    </td>

                                    <td className="pe-4 text-end">
                                        <button 
                                            className="btn btn-light btn-sm rounded-circle shadow-sm" 
                                            title="Ver Detalle"
                                            onClick={() => handleViewDetail(order.id)}
                                        >
                                            <i className="fas fa-eye text-primary"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                       </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
