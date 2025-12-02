import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Package, MapPin, CreditCard, Calendar, ArrowLeft } from 'lucide-react';
import './OrderDetails.css';
import './Orders.css'; // Import shared styles for status badges

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [canceling, setCanceling] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await api.get(`/api/orders/${orderId}?t=${new Date().getTime()}`);
            setOrder(response.data);
        } catch (error) {
            console.error("Error fetching order details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        setCanceling(true);
        try {
            await api.put(`/api/orders/${orderId}/cancel`);
            // Refresh order details
            await fetchOrderDetails();
            alert('Order cancelled successfully');
        } catch (error) {
            console.error("Error cancelling order", error);
            alert('Failed to cancel order. Please try again.');
        } finally {
            setCanceling(false);
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

    if (loading) return (
        <div className="order-details-container">
            <div className="details-card skeleton" style={{ height: '400px' }}></div>
        </div>
    );

    if (!order) return <div className="order-details-container text-center">Order not found</div>;

    return (
        <div className="order-details-container">
            <button
                onClick={() => navigate('/orders')}
                className="back-btn"
            >
                <ArrowLeft size={16} />
                Back to Orders
            </button>

            <div className="details-card">
                {/* Header */}
                <div className="details-header">
                    <div className="header-info">
                        <h1>
                            Order #{order.id}
                            <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                                {order.orderStatus}
                            </span>
                        </h1>
                        <p className="header-meta">
                            <Calendar size={16} />
                            Placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
                        <button
                            onClick={handleCancelOrder}
                            disabled={canceling}
                            className="cancel-btn"
                        >
                            {canceling ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                    )}
                </div>

                <div className="details-content">
                    {/* Order Items */}
                    <div className="items-section">
                        <h2 className="section-title">
                            <Package size={20} className="text-primary" />
                            Order Items
                        </h2>
                        <div className="items-list">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="detail-item">
                                    <img
                                        src={(item.product.images && item.product.images.length > 0) ? item.product.images[0] : (item.product.imageUrl || 'https://via.placeholder.com/100')}
                                        alt={item.product.title}
                                        className="detail-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                                        }}
                                    />
                                    <div className="detail-info">
                                        <h3 className="detail-name">{item.product.title}</h3>
                                        <p className="detail-meta">Size: {item.size || 'N/A'}</p>
                                        <div className="detail-price-row">
                                            <p className="detail-meta">Qty: {item.quantity}</p>
                                            <p className="detail-price">
                                                {item.discountedPrice !== undefined && item.discountedPrice !== null
                                                    ? item.discountedPrice
                                                    : item.price || item.sellingPrice || '0.00'}TND
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="info-sidebar">
                        {/* Shipping Address */}
                        <div className="info-card">
                            <h3 className="section-title">
                                <MapPin size={18} />
                                Shipping Address
                            </h3>
                            <div className="info-text">
                                <p className="highlight">{order.shippingAddress?.name}</p>
                                <p>{order.shippingAddress?.address}</p>
                                <p>{order.shippingAddress?.locality}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                                <p className="highlight mt-2">{order.shippingAddress?.mobile}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="info-card">
                            <h3 className="section-title">
                                <CreditCard size={18} />
                                Payment Details
                            </h3>
                            <div className="info-text">
                                <div className="flex justify-between mb-2">
                                    <span>Status</span>
                                    <span className={`payment-status ${order.paymentStatus === 'COMPLETED' ? 'completed' : 'pending'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Method</span>
                                    <span className="highlight">{order.paymentDetails?.paymentMethod || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="price-summary">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>{order.totalMrpPrice}TND</span>
                                </div>
                                <div className="summary-row">
                                    <span>Discount</span>
                                    <span className="discount-text">-{order.totalMrpPrice - order.totalSellingPrice}TND</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>{order.totalSellingPrice}TND</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
