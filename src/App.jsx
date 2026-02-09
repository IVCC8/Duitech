import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Finance from './pages/Finance';
import Docs from './pages/Docs';
import Profile from './pages/Profile';
import Support from './pages/Support';
import Catalog from './pages/Catalog';
import AccountStatement from './pages/AccountStatement';
import MySales from './pages/MySales';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/my-sales" element={<MySales />} /> 
              <Route path="/client-orders" element={<Orders />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/account-statement" element={<AccountStatement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/support" element={<Support />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
