import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import useLocalStorage from '../hooks/useLocalStorage';

const Profile = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const isClient = user?.role === 'client';

    const [profile, setProfile] = useLocalStorage(`duitech_profile_${user?.role}`, {
        name: user?.name || 'Usuario',
        email: user?.email || (isClient ? "cliente@gmail.com" : "vendedor@duitech.com"),
        phone: isClient ? "+52 55 1234 5678" : "Matutino (8am - 4pm)",
        address: isClient ? "Av. Reforma 222, CDMX" : "Oficina Central"
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        addNotification({
            title: 'Perfil Actualizado',
            text: 'Tus cambios han sido guardados exitosamente.',
            type: 'success'
        });
    };

    return (
        <div className="container-fluid p-0 d-flex justify-content-center pt-4">
            <div className="card border-0 shadow-lg overflow-hidden" data-aos="zoom-in" style={{ maxWidth: '700px', width: '100%', borderRadius: '20px' }}>
                <div className="p-5 pb-4 bg-primary bg-gradient text-white">
                    <div className="d-flex align-items-center gap-4">
                        <div className="avatar w-24 h-24 display-4 fw-bold shadow-lg bg-white text-primary d-flex align-items-center justify-content-center rounded-circle border border-4 border-primary-subtle">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="fw-extrabold m-0">{user?.name}</h2>
                            <p className="opacity-75 mb-2">{isClient ? 'Nivel: Oro (VIP)' : `Colaborador Dui Tech • ID: #8842`}</p>
                            <span className="badge bg-white text-primary fw-bold px-3 py-2 rounded-pill shadow-sm">
                                <i className={`fas ${isClient ? 'fa-user-check' : 'fa-id-badge'} me-2`}></i>
                                {isClient ? 'Cuenta Verificada' : 'Perfil Activo'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-5 pt-4">
                    <div className="row g-4 mb-5" data-aos="fade-up" data-aos-delay="200">
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-bold text-muted text-uppercase tracking-wider mb-2">
                                <i className="fas fa-envelope text-primary me-2"></i> Correo Electrónico
                            </label>
                            <input 
                                name="email"
                                className="form-control form-control-lg bg-light border-0 fw-bold text-dark" 
                                value={profile.email} 
                                onChange={handleChange}
                            />
                        </div>
                         <div className="col-12 col-md-6">
                            <label className="form-label small fw-bold text-muted text-uppercase tracking-wider mb-2">
                                <i className={`fas ${isClient ? 'fa-phone' : 'fa-clock'} text-primary me-2`}></i> {isClient ? 'Teléfono de Contacto' : 'Turno Asignado'}
                            </label>
                            <input 
                                name="phone"
                                className="form-control form-control-lg bg-light border-0 fw-bold text-dark" 
                                value={profile.phone} 
                                onChange={handleChange}
                            />
                        </div>
                        {isClient && (
                             <div className="col-12">
                                 <label className="form-label small fw-bold text-muted text-uppercase tracking-wider mb-2">
                                     <i className="fas fa-map-marker-alt text-primary me-2"></i> Dirección Principal de Envío
                                 </label>
                                 <div className="input-group">
                                     <input 
                                        name="address"
                                        className="form-control form-control-lg bg-light border-0 fw-bold text-dark" 
                                        value={profile.address}
                                        onChange={handleChange} 
                                    />
                                     <button className="btn btn-light border-0"><i className="fas fa-edit text-muted"></i></button>
                                 </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-top d-flex justify-content-between align-items-center" data-aos="fade-up" data-aos-delay="300">
                        <div className="small text-muted">
                            <i className="fas fa-shield-alt me-1"></i> Datos protegidos por Dui Tech Privacy
                        </div>
                        <button 
                            className="btn btn-primary btn-lg px-5 fw-bold shadow-sm rounded-pill d-flex align-items-center gap-2" 
                            onClick={handleSave}
                        >
                            {isClient ? 'Guardar Cambios' : 'Actualizar Perfil'} <i className="fas fa-chevron-right small"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
