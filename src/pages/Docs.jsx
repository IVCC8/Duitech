import { useNotifications } from '../context/NotificationContext';

const Docs = () => {
    const { addNotification } = useNotifications();

    const handleDownload = (e, filename) => {
        e.preventDefault();
        addNotification({
            title: 'Descarga Iniciada',
            text: `Descargando "${filename}"...`,
            type: 'info'
        });
        // Simulando delay
        setTimeout(() => {
             addNotification({
                title: 'Descarga Completa',
                text: `El archivo "${filename}" se ha guardado exitosamente.`,
                type: 'success'
            });
        }, 2000);
    };

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Documentación</h2>
                <p className="text-muted fs-5">Guías de usuario y especificaciones técnicas de Dui Tech ERP v1.0</p>
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-6" data-aos="fade-right" data-aos-delay="100">
                    <div className="card border-0 shadow-sm h-100 p-4">
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-3">
                            <span className="bg-primary-subtle text-primary p-2 rounded-3">
                                <i className="fas fa-book"></i>
                            </span>
                            Guías de Usuario
                        </h4>
                        <div className="list-group list-group-flush">
                            <div className="list-group-item px-0 border-0 mb-2">
                                <a href="#" onClick={(e) => handleDownload(e, 'Manual de Ventas (POS).pdf')} className="d-flex align-items-center gap-3 text-decoration-none hover-lift">
                                    <div className="bg-light p-2 rounded text-danger">
                                        <i className="fas fa-file-pdf"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold text-dark">Manual de Ventas (POS)</div>
                                        <div className="text-muted small">Instrucciones para terminal de venta • 1.2MB</div>
                                    </div>
                                    <i className="fas fa-download text-muted small"></i>
                                </a>
                            </div>
                            <div className="list-group-item px-0 border-0 mb-2">
                                <a href="#" onClick={(e) => handleDownload(e, 'Gestión de Inventarios.pdf')} className="d-flex align-items-center gap-3 text-decoration-none hover-lift">
                                    <div className="bg-light p-2 rounded text-danger">
                                        <i className="fas fa-file-pdf"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold text-dark">Gestión de Inventarios</div>
                                        <div className="text-muted small">Control de stock y almacén • 0.8MB</div>
                                    </div>
                                    <i className="fas fa-download text-muted small"></i>
                                </a>
                            </div>
                             <div className="list-group-item px-0 border-0">
                                <a href="#" onClick={(e) => handleDownload(e, 'Administración de Usuarios.pdf')} className="d-flex align-items-center gap-3 text-decoration-none hover-lift">
                                    <div className="bg-light p-2 rounded text-danger">
                                        <i className="fas fa-file-pdf"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold text-dark">Administración de Usuarios</div>
                                        <div className="text-muted small">Permisos y seguridad • 0.5MB</div>
                                    </div>
                                    <i className="fas fa-download text-muted small"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6" data-aos="fade-left" data-aos-delay="200">
                    <div className="card border-0 shadow-sm h-100 p-4">
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-3">
                            <span className="bg-accent-subtle text-accent p-2 rounded-3">
                                <i className="fas fa-code"></i>
                            </span>
                            API & Sistema
                        </h4>
                        <div className="d-grid gap-4">
                            <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                                <span className="small fw-bold text-muted text-uppercase">Versión de Producción</span>
                                <span className="badge bg-success px-3 py-2 rounded-pill shadow-sm">v1.0.2 Stable</span>
                            </div>
                            <div className="p-3 bg-light rounded-3">
                                <span className="small d-block fw-bold text-muted text-uppercase mb-2">Endpoint de Pedidos</span>
                                <code className="text-primary fw-bold" style={{ wordBreak: 'break-all' }}>https://api.duitech.erp/v1/orders</code>
                            </div>
                            <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                                <span className="small fw-bold text-muted text-uppercase">Estado del Servidor</span>
                                <span className="text-success fw-bold d-flex align-items-center gap-2">
                                    <span className="d-inline-block bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                                    En Línea
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Docs;
