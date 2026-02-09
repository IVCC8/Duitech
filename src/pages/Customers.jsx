import { useState } from 'react';
import { customersData } from '../context/mockData';
import Modal from '../components/ui/Modal';
import { useNotifications } from '../context/NotificationContext';
import useLocalStorage from '../hooks/useLocalStorage';

const Customers = () => {


    const { addNotification } = useNotifications();
    const [customers, setCustomers] = useLocalStorage('duitech_customers', customersData);
    const [search, setSearch] = useState('');


    const [isModalOpen, setIsModalOpen] = useState(false);

    const filtered = customers.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddCustomer = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const customerId = formData.get('id');

        if (customerId) {
            // Edit mode
            setCustomers(customers.map(c => c.id === Number(customerId) ? {
                ...c,
                name: formData.get('name'),
                email: formData.get('email'),
                type: formData.get('type')
            } : c));
            addNotification({ title: 'Cliente Actualizado', text: `Datos de ${formData.get('name')} guardados.`, type: 'success' });
        } else {
            // Add mode
            const newCustomer = {
                id: Date.now(),
                name: formData.get('name'),
                email: formData.get('email'),
                type: formData.get('type'),
                total: 0,
                lastBuy: '-',
                status: 'Prospecto'
            };
            setCustomers([...customers, newCustomer]);
            addNotification({ title: 'Cliente Registrado', text: `${newCustomer.name} ha sido añadido.`, type: 'success' });
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`¿Eliminar al cliente ${name}?`)) {
            setCustomers(customers.filter(c => c.id !== id));
            addNotification({ title: 'Cliente Eliminado', text: 'Registro removido.', type: 'info' });
        }
    };

    const [editingCustomer, setEditingCustomer] = useState(null);

    const openEditModal = (customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingCustomer(null);
        setIsModalOpen(true);
    };

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Directorio de Clientes</h2>
                <p className="text-muted fs-5">Gestiona la base de datos de clientes, segmentación por tipo y seguimiento de compras.</p>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-md-6" data-aos="zoom-in" data-aos-delay="100">
                    <div className="card border-0 shadow-sm p-4 h-100 border-start border-primary border-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="h6 fw-bold text-muted text-uppercase mb-2">Total Registrados</h3>
                                <div className="display-6 fw-extrabold text-dark">{customers.length}</div>
                                <p className="small text-muted mb-0 mt-2"><i className="fas fa-database me-1"></i> Base de datos activa</p>
                            </div>
                            <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                                <i className="fas fa-users fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6" data-aos="zoom-in" data-aos-delay="200">
                    <div className="card border-0 shadow-sm p-4 h-100 border-start border-success border-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="h6 fw-bold text-muted text-uppercase mb-2">Clientes Activos</h3>
                                <div className="display-6 fw-extrabold text-dark">{customers.filter(c => c.status === 'Activo' || c.status === 'Corporativo').length}</div>
                                <p className="small text-success fw-bold mb-0 mt-2"><i className="fas fa-check-circle me-1"></i> Compras en último mes</p>
                            </div>
                            <div className="bg-success-subtle text-success p-3 rounded-circle">
                                <i className="fas fa-user-check fa-2x"></i>
                            </div>
                        </div>
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
                                    placeholder="Buscar por nombre o email..." 
                                    className="form-control bg-light border-0"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-auto ms-auto">
                            <button 
                                className="btn btn-primary d-flex align-items-center gap-2 px-4 fw-bold shadow-sm" 
                                onClick={openAddModal}
                            >
                                <i className="fas fa-user-plus"></i> Alta de Cliente
                            </button>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Nombre del Cliente</th>
                                <th>Contacto / Email</th>
                                <th>Perfil</th>
                                <th>Facturación Total</th>

                                <th className="pe-4">Estado Actual</th>
                                <th className="text-end pe-4">Acciones</th>
                            </tr>
                        </thead>
                         <tbody>
                            {filtered.map(c => (
                                <tr key={c.id}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="w-10 h-10 bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center font-bold">
                                                {c.name.charAt(0)}
                                            </div>
                                            <div className="fw-bold text-dark">{c.name}</div>
                                        </div>
                                    </td>
                                    <td className="text-muted small">{c.email}</td>
                                    <td>
                                        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '10px' }}>
                                            {c.type}
                                        </span>
                                    </td>
                                    <td className="fw-extrabold text-primary">$ {c.total.toLocaleString()}</td>
                                    <td className="pe-4">
                                        <span className={`badge ${c.status === 'Activo' || c.status === 'Corporativo' ? 'bg-success-subtle text-success border-success-subtle' : 'bg-warning-subtle text-warning border-warning-subtle'} border px-3 py-2 rounded-pill fw-bold`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="pe-4 text-end">
                                        <button className="btn btn-light btn-sm me-2" onClick={() => openEditModal(c)}><i className="fas fa-edit text-primary"></i></button>
                                        <button className="btn btn-light btn-sm" onClick={() => handleDelete(c.id, c.name)}><i className="fas fa-trash text-danger"></i></button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-5 text-center bg-light">
                                        <div className="py-4">
                                            <i className="fas fa-users-slash display-4 text-muted opacity-25 mb-3 d-block"></i>
                                            <h5 className="text-muted">No se encontraron resultados</h5>
                                            <p className="small text-muted">Intenta con otros criterios de búsqueda</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                         </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCustomer ? "Editar Cliente" : "Nuevo Registro de Cliente"}>
                <form id="customerForm" onSubmit={handleAddCustomer} className="row g-4 p-2">
                    <input type="hidden" name="id" value={editingCustomer?.id || ''} />
                    <div className="col-12">
                        <label className="form-label fw-bold">Nombre Completo / Razón Social</label>
                        <input name="name" required className="form-control form-control-lg" defaultValue={editingCustomer?.name} placeholder="Ej: Tech Solutions S.A." />
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-bold">Correo Electrónico de Contacto</label>
                        <input name="email" type="email" required className="form-control" defaultValue={editingCustomer?.email} placeholder="ejemplo@correo.com" />
                    </div>
                     <div className="col-12">
                        <label className="form-label fw-bold">Tipo de Cliente / Segmento</label>
                        <select name="type" className="form-select" defaultValue={editingCustomer?.type || 'Regular'}>
                            <option value="Regular">Cliente Regular</option>
                            <option value="VIP">Cliente VIP (Preferencial)</option>
                            <option value="Corporativo">Cuenta Corporativa</option>
                        </select>
                    </div>
                    <div className="col-12 mt-5 text-end">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-light px-4 me-2">Cancelar</button>
                        <button type="submit" className="btn btn-primary px-5 fw-bold shadow-sm">Guardar Cliente</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Customers;
