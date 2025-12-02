import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Package, ChevronRight, ShoppingBag, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/api/orders/user');
            // Sort orders by date (newest first)
            const sortedOrders = response.data.sort((a, b) =>
                new Date(b.orderDate) - new Date(a.orderDate)
            );
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Error fetching orders", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'DELIVERED': return 'status-delivered';
            case 'CANCELLED': return 'status-cancelled';
            case 'SHIPPED': return 'status-shipped';
            default: return 'status-pending';
        }
    };

    if (loading) {
        return (
            <div className="orders-container">
                <div className="orders-header">
                    <h1 className="orders-title">My Orders</h1>
                </div>
                <div className="orders-list">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="order-card skeleton" style={{ height: '200px' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1 className="orders-title">My Orders</h1>
                <p className="orders-subtitle">Track and manage your purchases</p>
            </div>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <ShoppingBag className="empty-icon" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
                    <p className="empty-text">Looks like you haven't placed any orders yet.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="btn btn-primary"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <h3>
                                        <Package size={18} />
                                        Order #{order.id}
                                    </h3>
                                    <div className="order-date flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        <span className="text-gray-300">|</span>
                                        <Clock size={14} />
                                        {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                                    {order.orderStatus}
                                </span>
                            </div>

                            <div className="order-items">
                                {order.orderItems.map((item) => (
                                    <div key={item.id} className="order-item">
                                        <img
                                            src={(item.product.images && item.product.images.length > 0) ? item.product.images[0] : (item.product.imageUrl || 'https://via.placeholder.com/100')}
                                            alt={item.product.title}
                                            className="item-image"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                                            }}
                                        />
                                        <div className="item-details">
                                            <h4 className="item-name">{item.product.title}</h4>
                                            <p className="item-meta">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="item-price">
                                            {item.discountedPrice}TND
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="order-total">
                                    Total: <span className="text-primary">{order.totalDiscountedPrice}TND</span>
                                </div>
                                <button
                                    onClick={() => navigate(`/order/${order.id}`)}
                                    className="view-details-btn"
                                >
                                    View Details <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;

