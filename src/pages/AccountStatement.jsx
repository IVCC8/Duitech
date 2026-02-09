import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { initialOrders } from '../context/mockData';
import useLocalStorage from '../hooks/useLocalStorage';


const AccountStatement = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [orders] = useLocalStorage('duitech_orders', initialOrders);
    const [filter, setFilter] = useState('all');

    const handleDownload = () => {
        addNotification({
            title: 'Descarga Iniciada',
            text: 'Tu estado de cuenta se está descargando en PDF.',
            type: 'success'
        });
    };

    // Transform real orders into transactions for this user
    const transactions = orders.map((o, idx) => ({
        id: o.id,
        date: o.date,
        concept: `Compra #${o.id}`,
        type: 'debit',
        amount: o.total,
        balance: 20000 - (idx * 5000) // Mock balance calculation
    }));

    if (user?.role === 'admin' || user?.role === 'seller') {
        // Add some mock credits for internal view
        transactions.unshift({ id: 'P-100', date: 'Hoy', concept: 'Ajuste de Saldo', type: 'credit', amount: 5000, balance: 25000 });
    }


    const filteredTransactions = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Estado de Cuenta</h2>
                <p className="text-muted fs-5">Consulta tu balance, línea de crédito y el historial detallado de movimientos.</p>
            </div>

            <div className="row g-4 mb-5">
                 <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="100">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h3 className="h6 fw-bold text-muted text-uppercase mb-3 d-flex align-items-center gap-2">
                            <i className="fas fa-credit-card text-success"></i> Crédito Disponible
                        </h3>
                        <div className="display-5 fw-extrabold text-success mb-2">$ 12,000</div>
                        <p className="small text-muted mb-0">Línea de crédito: <span className="fw-bold">$20,000</span></p>
                    </div>
                 </div>
                 <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="200">
                    <div className="card border-0 shadow-sm p-4 h-100 border-start border-primary border-4">
                        <h3 className="h6 fw-bold text-muted text-uppercase mb-3 d-flex align-items-center gap-2">
                            <i className="fas fa-calendar text-primary"></i> Deuda Total
                        </h3>
                        <div className="display-5 fw-extrabold text-primary mb-2">$ 4,500</div>
                        <p className="small text-danger fw-bold mb-0"><i className="fas fa-clock me-1"></i> Vence el 15/Feb</p>
                    </div>
                 </div>
                 <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="300">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h3 className="h6 fw-bold text-muted text-uppercase mb-3 d-flex align-items-center gap-2">
                            <i className="fas fa-file-invoice-dollar text-secondary"></i> Pagos (Mes)
                        </h3>
                        <div className="display-5 fw-extrabold text-dark mb-2">$ 3,500</div>
                        <p className="small text-success fw-bold mb-0"><i className="fas fa-check-circle me-1"></i> 2 pagos registrados</p>
                    </div>
                 </div>
            </div>

            <div className="card border-0 shadow-sm overflow-hidden" data-aos="fade-up">
                <div className="card-header bg-white border-0 p-4">
                    <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
                        <i className="fas fa-list-ul text-primary"></i> Detalle de Movimientos
                    </h4>
                    <div className="d-flex gap-2 mt-3 mt-md-0">
                        <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} rounded-pill`} onClick={() => setFilter('all')}>Todos</button>
                        <button className={`btn btn-sm ${filter === 'debit' ? 'btn-danger' : 'btn-outline-danger'} rounded-pill`} onClick={() => setFilter('debit')}>Cargos</button>
                        <button className={`btn btn-sm ${filter === 'credit' ? 'btn-success' : 'btn-outline-success'} rounded-pill`} onClick={() => setFilter('credit')}>Abonos</button>
                        <button className="btn btn-sm btn-outline-dark rounded-pill ms-2" onClick={handleDownload}><i className="fas fa-download me-1"></i> PDF</button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Fecha</th>
                                <th>Concepto</th>
                                <th>Cargo</th>
                                <th>Abono</th>
                                <th className="pe-4">Saldo</th>
                            </tr>
                        </thead>
                         <tbody>
                             {filteredTransactions.map(t => (
                                <tr key={t.id}>
                                    <td className="ps-4 text-muted small">{t.date}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className={`bg-${t.type === 'credit' ? 'success' : 'danger'}-subtle text-${t.type === 'credit' ? 'success' : 'danger'} p-1 rounded-circle small`}>
                                                <i className={`fas fa-arrow-${t.type === 'credit' ? 'down' : 'up'}`} style={{ fontSize: '10px' }}></i>
                                            </div>
                                            <span className="fw-bold">{t.concept}</span>
                                        </div>
                                    </td>
                                    <td className={`fw-bold ${t.type === 'debit' ? 'text-danger' : 'text-muted'}`}>
                                        {t.type === 'debit' ? `$ ${t.amount.toLocaleString()}` : '-'}
                                    </td>
                                    <td className={`fw-bold ${t.type === 'credit' ? 'text-success' : 'text-muted'}`}>
                                        {t.type === 'credit' ? `$ ${t.amount.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="pe-4 fw-extrabold text-dark">$ {t.balance.toLocaleString()}</td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccountStatement;
