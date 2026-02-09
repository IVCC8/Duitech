import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { initialTickets } from '../context/mockData';
import useLocalStorage from '../hooks/useLocalStorage';

const Support = () => {
    const { addNotification } = useNotifications();
    const [tickets, setTickets] = useLocalStorage('duitech_tickets', initialTickets);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        priority: 'Media'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTicket = {
            id: (Math.floor(Math.random() * 9000) + 1000).toString(),
            subject: formData.subject,
            date: 'Ahora',
            status: 'Abierto',
            priority: formData.priority
        };
        setTickets([newTicket, ...tickets]);
        setFormData({ subject: '', message: '', priority: 'Media' });
        addNotification({
            title: 'Ticket Creado',
            text: 'Tu solicitud ha sido enviada al equipo de soporte.',
            type: 'success'
        });
    };

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Centro de Soporte</h2>
                <p className="text-muted fs-5">Resuelve tus dudas o contacta con nuestro equipo técnico especializado.</p>
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-5" data-aos="fade-right">
                    <div className="card border-0 shadow-sm h-100 p-4">
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-3">
                            <span className="bg-primary-subtle text-primary p-2 rounded-circle">
                                <i className="fas fa-question-circle"></i>
                            </span>
                            Preguntas Frecuentes
                        </h4>
                        <div className="d-grid gap-3">
                            <div className="p-3 bg-light rounded-3 hover-lift cursor-pointer border-start border-primary border-4" onClick={() => addNotification({ title: 'Ayuda', text: 'Abriendo guía: Cómo reimprimir un ticket.', type: 'info' })}>
                                <div className="fw-bold text-dark mb-1">¿Cómo reimprimir un ticket?</div>
                                <p className="small text-muted mb-0">Ve a Historial de Ventas y haz clic en el icono de impresora.</p>
                            </div>
                            <div className="p-3 bg-light rounded-3 hover-lift cursor-pointer" onClick={() => addNotification({ title: 'Ayuda', text: 'Solucionando problemas de red...', type: 'info' })}>
                                <div className="fw-bold text-dark mb-1">Error de Conexión</div>
                                <p className="small text-muted mb-0">Verifica tu conexión local y reinicia la terminal de red.</p>
                            </div>
                            <div className="p-3 bg-light rounded-3 hover-lift cursor-pointer text-primary fw-bold" onClick={() => addNotification({ title: 'Guías', text: 'Redirigiendo a la base de conocimientos...', type: 'info' })}>
                                Ver todas las guías <i className="fas fa-external-link-alt ms-1 small"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-7" data-aos="fade-left">
                    <div className="card border-0 shadow-sm p-4">
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-3">
                            <span className="bg-accent-subtle text-accent p-2 rounded-circle">
                                <i className="fas fa-headset"></i>
                            </span>
                            Contactar Soporte
                        </h4>
                        <form id="supportForm" className="row g-4" onSubmit={handleSubmit}>
                            <div className="col-12">
                                <label className="form-label fw-bold">Asunto de la consulta</label>
                                <input 
                                    name="subject"
                                    className="form-control form-control-lg border-2" 
                                    placeholder="Ej: Falla en escáner de red" 
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold">Prioridad</label>
                                <select 
                                    name="priority"
                                    className="form-select border-2"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                >
                                    <option value="Baja">Baja</option>
                                    <option value="Media">Media</option>
                                    <option value="Alta">Alta</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold">Detalle del problema</label>
                                <textarea 
                                    name="message"
                                    className="form-control border-2" 
                                    rows="4" 
                                    placeholder="Describe brevemente lo que ocurre..." 
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary btn-lg px-5 fw-bold shadow-sm">
                                    Enviar Ticket <i className="fas fa-paper-plane ms-2 small"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm p-4 mt-4" data-aos="fade-up">
                <h4 className="fw-bold mb-4"><i className="fas fa-ticket-alt text-primary me-2"></i> Mis Solicitudes Recientes</h4>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr className="small text-muted">
                                <th>ID</th>
                                <th>Asunto</th>
                                <th>Fecha</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket.id}>
                                    <td className="fw-bold">#{ticket.id}</td>
                                    <td>{ticket.subject}</td>
                                    <td className="small text-muted">{ticket.date}</td>
                                    <td>
                                        <span className={`badge bg-${ticket.priority === 'Alta' ? 'danger' : ticket.priority === 'Media' ? 'warning text-dark' : 'info'} rounded-pill`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td><span className="badge bg-light text-dark border">{ticket.status}</span></td>
                                </tr>
                            ))}
                            {tickets.length === 0 && <tr><td colSpan="5" className="text-center py-3 text-muted">No tienes solicitudes pendientes.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Support;
