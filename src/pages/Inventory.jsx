import { useState } from 'react';
import { productsData } from '../context/mockData';
import Modal from '../components/ui/Modal';
import useLocalStorage from '../hooks/useLocalStorage';

import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
const Inventory = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const isAdmin = user?.role === 'admin';
    const [products, setProducts] = useLocalStorage('duitech_inventory', productsData);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handleDeleteProduct = (id, name) => {
        if (window.confirm(`¿Estás seguro de eliminar "${name}" del inventario?`)) {
            setProducts(products.filter(p => p.id !== id));
            addNotification({
                title: 'Producto Eliminado',
                text: `El producto "${name}" ha sido removido.`,
                type: 'info'
            });
        }
    };

    const handleExport = (type) => {
        addNotification({
            title: 'Exportación Iniciada',
            text: `Generando reporte de inventario en ${type}...`,
            type: 'success'
        });
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newProduct = {
            id: Date.now(),
            name: formData.get('name'),
            brand: formData.get('brand'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            model: formData.get('model')
        };
        setProducts([...products, newProduct]);
        addNotification({
            title: 'Inventario Actualizado',
            text: `Se ha agregado "${newProduct.name}" al catálogo con stock de ${newProduct.stock}u.`,
            type: 'stock'
        });
        setIsModalOpen(false);
    };

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Gestión de Almacén</h2>
                <p className="text-muted fs-5">Monitorea niveles de stock, registra nuevos ingresos y gestiona el catálogo de hardware.</p>
            </div>

            <div className="card border-0 shadow-sm overflow-hidden" data-aos="fade-up">
                <div className="card-header bg-white border-0 p-4">
                    <div className="row g-3 align-items-center">
                        <div className="col-12 col-md-5">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-0"><i className="fas fa-search text-muted"></i></span>
                                <input 
                                    type="text" 
                                    placeholder="Nombre, marca o categoría..." 
                                    className="form-control bg-light border-0"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-auto ms-auto d-flex gap-2">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleExport('EXCEL')}>
                                <i className="fas fa-file-csv me-2"></i> EXCEL
                            </button>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleExport('PDF')}>
                                <i className="fas fa-file-pdf me-2"></i> PDF
                            </button>
                            {isAdmin && (
                                <button 
                                    className="btn btn-primary d-flex align-items-center gap-2 px-4 fw-bold"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <i className="fas fa-plus"></i> Registrar
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light border-top border-bottom">
                            <tr>
                                <th className="ps-4 py-3">Información del Producto</th>
                                <th className="py-3">Categoría</th>
                                <th className="py-3">Precio Unitario</th>
                                <th className="py-3">Stock Disponible</th>
                                {isAdmin && <th className="pe-4 py-3 text-end">Gestión</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.map(p => (
                                <tr key={p.id}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-subtle text-primary rounded d-flex items-center justify-center border border-primary-subtle">
                                                <i className="fas fa-desktop"></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{p.name}</div>
                                                <div className="small text-muted">{p.brand} • {p.model || 'Sin modelo'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 rounded-pill fw-bold">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="fw-bold text-primary">$ {p.price.toLocaleString()}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="flex-1 bg-light rounded-pill overflow-hidden" style={{ height: '6px', minWidth: '80px' }}>
                                                <div 
                                                    className={`h-100 ${p.stock < 10 ? 'bg-danger' : 'bg-success'}`} 
                                                    style={{ width: `${Math.min((p.stock/50)*100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className={`small fw-bold ${p.stock < 10 ? 'text-danger' : 'text-success'}`}>
                                                {p.stock} u.
                                            </span>
                                        </div>
                                    </td>
                                    {isAdmin && (
                                        <td className="pe-4 text-end">
                                            <div className="btn-group">
                                                <button className="btn btn-light btn-sm" title="Editar"><i className="fas fa-edit text-primary"></i></button>
                                                <button 
                                                    className="btn btn-light btn-sm" 
                                                    title="Eliminar"
                                                    onClick={() => handleDeleteProduct(p.id, p.name)}
                                                >
                                                    <i className="fas fa-trash text-danger"></i>
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={isAdmin ? 5 : 4} className="p-5 text-center bg-light">
                                        <div className="py-4">
                                            <i className="fas fa-search display-4 text-muted opacity-25 mb-3 d-block"></i>
                                            <h5 className="text-muted">No se encontraron productos</h5>
                                            <p className="small text-muted">Intenta con otros criterios de búsqueda</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="p-4 border-top bg-light d-flex justify-content-between align-items-center">
                        <small className="text-muted">Mostrando {paginatedProducts.length} de {filteredProducts.length} productos</small>
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-white border shadow-sm btn-sm"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <span className="btn btn-white border shadow-sm btn-sm disabled fw-bold text-primary">{page}</span>
                            <button 
                                className="btn btn-white border shadow-sm btn-sm"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Producto">
                <form onSubmit={handleAddProduct} className="row g-4 p-2">
                    <div className="col-md-8">
                        <label className="form-label fw-bold">Nombre del Producto</label>
                        <input name="name" required className="form-control" placeholder="Ej: Monitor Gamer LG 27\" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Modelo</label>
                        <input name="model" required className="form-control" placeholder="X-200" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Marca</label>
                        <input name="brand" required className="form-control" placeholder="Samsung, Dell, etc." />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Categoría</label>
                        <select name="category" className="form-select">
                            <option>Laptops</option>
                            <option>Monitores</option>
                            <option>Accesorios</option>
                            <option>Componentes</option>
                            <option>Periféricos</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Precio Unitario ($)</label>
                        <input name="price" type="number" min="0" step="0.01" required className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Stock Inicial</label>
                        <input name="stock" type="number" min="0" required className="form-control" />
                    </div>
                    <div className="col-12 mt-5 text-end">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-light px-4 me-2">Cerrar</button>
                        <button type="submit" className="btn btn-primary px-5 fw-bold">Guardar Producto</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Inventory;
