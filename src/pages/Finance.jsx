import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { initialOrders } from '../context/mockData';
import useLocalStorage from '../hooks/useLocalStorage';

const Finance = () => {
    const { addNotification } = useNotifications();
    const [orders] = useLocalStorage('duitech_orders', initialOrders);
    const [year, setYear] = useState('2026');

    const handleDownload = () => {
        addNotification({
            title: 'Generando Reporte',
            text: `Preparando balance financiero del año ${year}...`,
            type: 'info'
        });
        setTimeout(() => {
            addNotification({ title: 'Descarga Lista', text: 'El reporte se ha guardado en tu dispositivo.', type: 'success' });
        }, 1500);
    };

    const totalIncome = orders.reduce((acc, o) => acc + o.total, 0);
    const estimatedExpenses = totalIncome * 0.35;
    const profit = totalIncome - estimatedExpenses;

    const stats = {
        income: `$ ${totalIncome.toLocaleString()}`,
        expenses: `$ ${estimatedExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        profit: `$ ${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        growth: '+12.5%'
    };



    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Análisis Financiero</h2>
                <p className="text-muted fs-5">Monitorea el rendimiento económico, gastos operativos y utilidad neta en tiempo real.</p>
            </div>

            <div className="row g-4 mb-5">
                 <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="100">
                    <div className="card border-0 shadow-sm p-4 h-100 border-start border-success border-4">
                        <h3 className="h6 fw-bold text-muted text-uppercase mb-3 d-flex align-items-center gap-2">
                            <i className="fas fa-arrow-up text-success"></i> Ingresos ({year})
                        </h3>
                        <div className="display-5 fw-extrabold text-dark mb-2">{stats.income}</div>
                        <p className="small text-success fw-bold mb-0"><i className="fas fa-caret-up me-1"></i> {stats.growth} vs anterior</p>
                    </div>
                </div>
                <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="200">
                    <div className="card border-0 shadow-sm p-4 h-100 border-start border-danger border-4">
                        <h3 className="h6 fw-bold text-muted text-uppercase mb-3 d-flex align-items-center gap-2">
                            <i className="fas fa-arrow-down text-danger"></i> Gastos Operativos
                        </h3>
                        <div className="display-5 fw-extrabold text-dark mb-2">{stats.expenses}</div>
                        <p className="small text-muted mb-0">Incluye nómina y servicios</p>
                    </div>
                </div>
                <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="300">
                    <div className="card border-0 shadow-sm p-4 h-100 border-start border-primary border-4">
                        <h3 className="h6 fw-bold text-muted text-uppercase mb-3 d-flex align-items-center gap-2">
                            <i className="fas fa-chart-line text-primary"></i> Utilidad Neta
                        </h3>
                        <div className="display-5 fw-extrabold text-primary mb-2">{stats.profit}</div>
                        <p className="small text-success fw-bold mb-0"><i className="fas fa-pie-chart me-1"></i> Margen saludable del 64%</p>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm overflow-hidden" data-aos="fade-up">
                <div className="card-header bg-white border-0 p-4">
                    <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
                        <i className="fas fa-chart-area text-primary"></i> Balance General Anual
                    </h4>
                </div>
                <div className="card-body p-5 text-center bg-light bg-gradient">
                    <div className="py-5">
                        <i className="fas fa-chart-area display-1 text-primary opacity-10 mb-4 d-block"></i>
                        <h5 className="text-dark fw-bold">Proyección Financiera Proactiva</h5>
                        <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
                            Esta sección visualiza el histórico de balances. En la versión completa, integra datos reales de facturación y costos.
                        </p>
                        <div className="d-flex justify-content-center gap-3 mt-4">
                            <select className="form-select w-auto" value={year} onChange={(e) => setYear(e.target.value)}>
                                <option value="2026">2026 (Actual)</option>
                                <option value="2025">2025 (Histórico)</option>
                            </select>
                            <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={handleDownload}>Descargar Reporte Anual</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finance;
