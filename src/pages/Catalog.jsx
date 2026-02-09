import { useState } from 'react';
import { productsData, initialOrders } from '../context/mockData';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import useLocalStorage from '../hooks/useLocalStorage';



const Catalog = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [cartCount, setCartCount] = useState(0);

    const [orders, setOrders] = useLocalStorage('duitech_orders', initialOrders);
    const [inventory] = useLocalStorage('duitech_inventory', productsData);


    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');

    const categories = ['Todas', ...new Set(inventory.map(p => p.category))];

    const filteredProducts = inventory.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });


    const handleAddToCart = (productName) => {
        setCartCount(prev => prev + 1);
        addNotification({
            title: 'Producto Agregado',
            text: `Se añadió "${productName}" a tu carrito de compras.`,
            type: 'order'
        });
    };

    const handleCheckout = () => {
        if (cartCount === 0) return;

        const newOrder = {
            id: (Math.floor(Math.random() * 9000) + 1000).toString(),
            client: user?.name || 'Cliente Invitado',
            clientName: user?.name || 'Cliente Invitado',
            date: 'Ahora',
            total: cartCount * 500, // Simulated total for now
            status: 'Pendiente',
            items: cartCount
        };

        setOrders([newOrder, ...orders]);
        setCartCount(0);
        
        addNotification({
            title: 'Compra Exitosa',
            text: `Tu pedido #${newOrder.id} ha sido registrado.`,
            type: 'success'
        });
    };


    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5 d-flex justify-content-between align-items-center" data-aos="fade-down">
                <div>
                    <h2 className="display-6 fw-bold text-gradient">Catálogo de Productos</h2>
                    <p className="text-muted fs-5">Explora nuestras ofertas y productos disponibles.</p>
                </div>
                <div 
                    className="cart-trigger position-relative cursor-pointer hover-lift p-3 bg-white rounded-circle shadow-sm"
                    onClick={handleCheckout}
                    title="Finalizar Compra"
                >
                    <i className="fas fa-shopping-cart h4 text-primary m-0"></i>
                    {cartCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-accent shadow-sm border border-white">
                            {cartCount}
                        </span>
                    )}
                </div>

            </div>

            <div className="row g-3 mb-5" data-aos="fade-up">
                <div className="col-12 col-md-8">
                    <div className="input-group input-group-lg shadow-sm">
                        <span className="input-group-text bg-white border-0"><i className="fas fa-search text-muted"></i></span>
                        <input 
                            type="text" 
                            className="form-control border-0" 
                            placeholder="Buscar por nombre o marca..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <select 
                        className="form-select form-select-lg border-0 shadow-sm cursor-pointer"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            <div className="row g-4">
                {filteredProducts.length > 0 ? filteredProducts.map((p, index) => (
                    <div key={p.id} className="col-12 col-md-6 col-lg-4 col-xl-3" data-aos="fade-up" data-aos-delay={index * 50}>
                        <div className="card h-100 border-0 shadow-sm overflow-hidden hover-lift transition-all">
                            <div className="card-img-top bg-light p-5 d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                                <i className="fas fa-desktop display-1 text-primary opacity-10"></i>
                                <div className="position-absolute top-0 end-0 p-3">
                                    <span className="badge bg-white text-muted shadow-sm rounded-pill fw-bold border" style={{ fontSize: '10px' }}>{p.brand}</span>
                                </div>
                            </div>
                            <div className="card-body p-4 d-flex flex-column">
                                <span className="small text-accent fw-bold text-uppercase tracking-wider mb-2" style={{ fontSize: '10px' }}>{p.category}</span>
                                <h5 className="card-title fw-bold text-dark mb-3 line-clamp-2">{p.name}</h5>
                                <div className="mt-auto d-flex justify-content-between align-items-center">
                                    <div className="h4 fw-extrabold text-primary mb-0">$ {p.price.toLocaleString()}</div>
                                    <button 
                                        className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
                                        onClick={() => handleAddToCart(p.name)}
                                    >
                                        <i className="fas fa-cart-plus small"></i> Comprar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                 )) : (
                    <div className="col-12 text-center py-5">
                        <div className="bg-light p-5 rounded-4 d-inline-block">
                            <i className="fas fa-search display-4 text-muted mb-3"></i>
                            <h4 className="fw-bold text-muted">No se encontraron productos</h4>
                            <p className="text-muted mb-0">Intenta con otros términos o filtros.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;
