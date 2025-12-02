import React, { useState, useEffect } from 'react';
import { Search, Eye, Pencil, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './AdminPages.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = { page, size: 10 };
            if (search) params.search = search;

            const response = await api.get('/admin/products', { params });
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const handleEdit = (product) => {
        setEditingProduct({ ...product });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(`/admin/products/${editingProduct.id}`, editingProduct);
            toast.success('Product updated successfully');
            setShowEditModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        }
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/admin/products/${productToDelete.id}`);
            toast.success('Product deleted successfully');
            setShowDeleteModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            if (error.response?.status === 500) {
                toast.error('Cannot delete this product. It may have orders associated with it.');
            } else {
                toast.error('Failed to delete product');
            }
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Product Management</h1>
            </div>

            <div className="admin-filters">
                <div className="search-wrapper">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by product title..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Seller</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8">No products found</td></tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="product-info">
                                            <span className="primary-text">{product.title}</span>
                                            <span className="secondary-text">{product.color || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>{product.seller?.sellerName || 'N/A'}</td>
                                    <td>{product.category?.name || 'N/A'}</td>
                                    <td>
                                        <div className="product-info">
                                            <span className="primary-text">{product.sellingPrice}TND</span>
                                            <span className="secondary-text line-through">{product.mrpPrice}TND</span>
                                        </div>
                                    </td>
                                    <td>{product.quantity}</td>
                                    <td className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleViewDetails(product)} className="action-btn view" title="View Details">
                                                <Eye size={18} />
                                            </button>
                                            <button onClick={() => handleEdit(product)} className="action-btn edit" title="Edit">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(product)} className="action-btn delete" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedProduct && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>Product Details</h3>
                            <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            {selectedProduct.images && selectedProduct.images.length > 0 && (
                                <div className="mb-6">
                                    <img src={selectedProduct.images[0]} alt={selectedProduct.title} className="w-full h-64 object-contain rounded-lg bg-gray-50" />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold mb-3 text-gray-900">Basic Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-500">Title:</span> <span className="font-medium">{selectedProduct.title}</span></p>
                                        <p><span className="text-gray-500">Description:</span> <span className="font-medium">{selectedProduct.description}</span></p>
                                        <p><span className="text-gray-500">Color:</span> <span className="font-medium">{selectedProduct.color || 'N/A'}</span></p>
                                        <p><span className="text-gray-500">Sizes:</span> <span className="font-medium">{selectedProduct.sizes || 'N/A'}</span></p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold mb-3 text-gray-900">Pricing & Inventory</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-500">MRP:</span> <span className="font-medium">{selectedProduct.mrpPrice}TND</span></p>
                                        <p><span className="text-gray-500">Selling Price:</span> <span className="font-medium">{selectedProduct.sellingPrice}TND</span></p>
                                        <p><span className="text-gray-500">Discount:</span> <span className="font-medium">{selectedProduct.discountPercentage}%</span></p>
                                        <p><span className="text-gray-500">Quantity:</span> <span className="font-medium">{selectedProduct.quantity}</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h4 className="font-bold mb-3 text-gray-900">Other Details</h4>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <p><span className="text-gray-500">Category:</span> <br /><span className="font-medium">{selectedProduct.category?.name || 'N/A'}</span></p>
                                    <p><span className="text-gray-500">Seller:</span> <br /><span className="font-medium">{selectedProduct.seller?.sellerName || 'N/A'}</span></p>
                                    <p><span className="text-gray-500">Ratings:</span> <br /><span className="font-medium">{selectedProduct.numRatings} reviews</span></p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowDetailsModal(false)} className="btn-cancel">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingProduct && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Product</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input type="text" value={editingProduct.title || ''} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} className="form-input" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea value={editingProduct.description || ''} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="form-textarea" rows="3" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">MRP Price</label>
                                    <input type="number" value={editingProduct.mrpPrice || 0} onChange={(e) => setEditingProduct({ ...editingProduct, mrpPrice: parseFloat(e.target.value) })} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Selling Price</label>
                                    <input type="number" value={editingProduct.sellingPrice || 0} onChange={(e) => setEditingProduct({ ...editingProduct, sellingPrice: parseFloat(e.target.value) })} className="form-input" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Quantity</label>
                                    <input type="number" value={editingProduct.quantity || 0} onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) })} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Color</label>
                                    <input type="text" value={editingProduct.color || ''} onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })} className="form-input" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Sizes</label>
                                <input type="text" value={editingProduct.sizes || ''} onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value })} className="form-input" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowEditModal(false)} className="btn-cancel">Cancel</button>
                            <button onClick={handleSaveEdit} className="btn-save">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && productToDelete && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Product</h3>
                            <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="text-gray-600">Are you sure you want to delete product <strong>{productToDelete.title}</strong>? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowDeleteModal(false)} className="btn-cancel">Cancel</button>
                            <button onClick={handleConfirmDelete} className="btn-delete">Delete Product</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
