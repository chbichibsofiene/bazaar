import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AddProduct from './AddProduct';
import './SellerProducts.css';
import SubscriptionDashboard from '../../components/subscription/SubscriptionDashboard';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const { jwt } = useSelector((store) => store.auth);

    useEffect(() => {
        fetchProducts();
        fetchStatistics();
        fetchSubscription();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/api/sellers/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching seller products", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await api.get('/api/sellers/products/statistics');
            setStatistics(response.data);
        } catch (error) {
            console.error("Error fetching product statistics", error);
        }
    };

    const fetchSubscription = async () => {
        try {
            const response = await axios.get('http://localhost:5454/api/seller/subscription/current', {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            setSubscription(response.data);
        } catch (error) {
            console.error('Error fetching subscription:', error);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/api/sellers/products/${productId}`);
                setProducts(products.filter(p => p.id !== productId));
            } catch (error) {
                console.error("Error deleting product", error);
            }
        }
    };

    const handleProductAdded = (newProduct) => {
        setProducts([newProduct, ...products]);
        fetchStatistics(); // Refresh stats
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowEditModal(true);
    };

    const handleProductUpdated = (updatedProduct) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const canAddProduct = () => {
        if (!subscription) return false;
        if (!subscription.plan) return false;
        if (subscription.plan.maxProducts === null) return true;
        // We can use statistics.totalProducts if available, or products.length
        const currentCount = statistics ? statistics.totalProducts : products.length;
        return currentCount < subscription.plan.maxProducts;
    };

    return (
        <div className="seller-products">
            <div className="page-header">
                <h2>My Products</h2>
                <button
                    className={`add-product-btn ${!canAddProduct() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                        if (canAddProduct()) {
                            setShowAddModal(true);
                        } else {
                            alert("You have reached the product limit for your current plan. Please upgrade to add more products.");
                        }
                    }}
                    disabled={!canAddProduct()}
                >
                    Add New Product
                </button>
            </div>

            <SubscriptionDashboard />

            {statistics && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon products">
                            <i className="fas fa-box"></i>
                        </div>
                        <div className="stat-info">
                            <h3>Total Products</h3>
                            <p>{statistics.totalProducts}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon value">
                            <i className="fas fa-dollar-sign"></i>
                        </div>
                        <div className="stat-info">
                            <h3>Total Stock Value</h3>
                            <p>{statistics.totalStockValue?.toFixed(2)}TND</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon warning">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="stat-info">
                            <h3>Low Stock Items</h3>
                            <p>{statistics.lowStockCount}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon danger">
                            <i className="fas fa-times-circle"></i>
                        </div>
                        <div className="stat-info">
                            <h3>Out of Stock</h3>
                            <p>{statistics.outOfStockCount}</p>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loading">Loading products...</div>
            ) : (
                <div className="products-table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <img src={product.images?.[0]} alt={product.title} className="table-img" />
                                    </td>
                                    <td>
                                        <div className="product-title-cell">
                                            <span className="title">{product.title}</span>
                                        </div>
                                    </td>
                                    <td>{product.category?.name}</td>
                                    <td>
                                        <div className="price-cell">
                                            <span className="current">{product.sellingPrice}TND</span>
                                            {product.discountPercentage > 0 && <span className="original">{product.mrpPrice}TND</span>}
                                        </div>
                                    </td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="action-btn edit" onClick={() => handleEdit(product)}>
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDelete(product.id)}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showAddModal && (
                <AddProduct
                    onClose={() => setShowAddModal(false)}
                    onProductAdded={handleProductAdded}
                />
            )}

            {showEditModal && editingProduct && (
                <AddProduct
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingProduct(null);
                    }}
                    onProductAdded={handleProductUpdated}
                    editMode={true}
                    initialData={editingProduct}
                />
            )}
        </div>
    );
};

export default SellerProducts;
