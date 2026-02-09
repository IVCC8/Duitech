/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // role: 'admin' | 'seller' | 'client' | null
    const [user, setUser] = useState(null);

    const login = (username, password) => {
        if (username === 'admin' && password === 'admin') {
            setUser({ role: 'admin', name: 'Admin User', title: 'Gerente General' });
            return true;
        } else if (username === 'vendedor' && password === 'vendedor') {
            setUser({ role: 'seller', name: 'Vendedor', title: 'Ventas Mostrador' });
            return true;
        } else if (username === 'cliente' && password === 'cliente') {
            setUser({ role: 'client', name: 'Cliente Invitado', title: 'Usuario Registrado' });
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
