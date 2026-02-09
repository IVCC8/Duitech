import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState('admin');
    const [pass, setPass] = useState('admin');
    const [error, setError] = useState('');

    useEffect(() => {
        if (window.AOS) {
            window.AOS.init({ duration: 1000, once: true });
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(user, pass);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div id="login-screen" className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="login-card shadow-lg p-5 border-0 rounded-4 bg-white" data-aos="zoom-in" style={{ maxWidth: '450px', width: '90%' }}>
                <div className="text-center mb-4">
                    <div className="bg-primary bg-gradient w-16 h-16 rounded-circle d-flex align-items-center justify-center mx-auto mb-3 shadow">
                        <i className="fas fa-microchip text-white text-3xl"></i>
                    </div>
                    <h1 className="h2 fw-extrabold text-dark m-0">Dui Tech</h1>
                    <p className="text-muted">Sistema ERP Integral</p>
                </div>
                
                {error && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small fw-bold" data-aos="shake">
                        <i className="fas fa-exclamation-circle text-danger"></i> {error}
                    </div>
                )}

                <form id="loginForm" onSubmit={handleSubmit} className="d-grid gap-4">
                    <div className="form-group">
                        <label className="form-label small fw-bold text-muted text-uppercase tracking-wider">Usuario</label>
                        <input 
                            type="text" 
                            id="username"
                            className="form-control form-control-lg border-2" 
                            placeholder="Usuario"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label small fw-bold text-muted text-uppercase tracking-wider">Contraseña</label>
                        <input 
                            type="password" 
                            id="password"
                            className="form-control form-control-lg border-2" 
                            placeholder="********"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg fw-bold shadow-sm py-3 mt-2">
                        Ingresar al Sistema <i className="fas fa-arrow-right ms-2 small"></i>
                    </button>
                </form>
                
                <div className="mt-5 pt-4 border-top">
                    <p className="text-center small text-muted fw-bold text-uppercase tracking-widest mb-3" style={{ fontSize: '10px' }}>Demo Access</p>
                    <div className="d-grid gap-2">
                         <div className="small bg-light p-2 rounded d-flex justify-content-between px-3">
                            <span className="text-muted fw-bold">Admin:</span>
                            <code className="text-primary fw-bold">admin / admin</code>
                         </div>
                         <div className="small bg-light p-2 rounded d-flex justify-content-between px-3">
                            <span className="text-muted fw-bold">Vendedor:</span>
                            <code className="text-primary fw-bold">vendedor / vendedor</code>
                         </div>
                         <div className="small bg-light p-2 rounded d-flex justify-content-between px-3">
                            <span className="text-muted fw-bold">Cliente:</span>
                            <code className="text-primary fw-bold">cliente / cliente</code>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
