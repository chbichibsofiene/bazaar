import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Eye, Send } from 'lucide-react';
import './SellerOrders.css';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sendingDelivery, setSendingDelivery] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, statusFilter]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/api/seller/orders');
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching seller orders", error);
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        if (statusFilter === 'ALL') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.orderStatus === statusFilter));
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.patch(`/api/seller/orders/${orderId}/status/${newStatus}`);
            fetchOrders();
        } catch (error) {
            console.error("Error updating order status", error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await api.delete(`/api/seller/orders/${orderId}/delete`);
                fetchOrders();
            } catch (error) {
                console.error("Error deleting order", error);
            }
        }
    };

    const handleSendToDelivery = async (orderId) => {
        if (window.confirm("Send this order to delivery service? The order will be marked as SHIPPED.")) {
            setSendingDelivery(orderId);
            try {
                await api.post(`/api/seller/orders/${orderId}/send-to-delivery`);
                alert("Order sent to delivery successfully!");
                fetchOrders();
            } catch (error) {
                console.error("Error sending order to delivery", error);
                alert("Failed to send order to delivery. Please try again.");
            } finally {
                setSendingDelivery(null);
            }
        }
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="seller-orders">
            <div className="page-header">
                <h2>Orders</h2>
                <div className="filter-section">
                    <label htmlFor="status-filter">Filter by Status:</label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-filter-select"
                    >
                        <option value="ALL">All Orders</option>
                        <option value="PENDING">Pending</option>
                        <option value="PLACED">Placed</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading orders...</div>
            ) : (
                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>
                                        <div className="order-product">
                                            {order.orderItems && order.orderItems.length > 0 && (
                                                <>
                                                    <img src={order.orderItems[0].product.images?.[0]} alt="" className="table-img" />
                                                    <span>{order.orderItems[0].product.title}</span>
                                                    {order.orderItems.length > 1 && <span className="more-items">+{order.orderItems.length - 1} more</span>}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td>{order.user?.fullName}</td>
                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="view-btn"
                                                onClick={() => openOrderDetails(order)}
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            {order.orderStatus === 'CONFIRMED' && (
                                                <button
                                                    className="delivery-btn"
                                                    onClick={() => handleSendToDelivery(order.id)}
                                                    disabled={sendingDelivery === order.id}
                                                    title="Send to Delivery"
                                                >
                                                    {sendingDelivery === order.id ? (
                                                        'Sending...'
                                                    ) : (
                                                        <>
                                                            <Send size={16} />
                                                            <span>Send to Delivery</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className="status-select"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="PLACED">Placed</option>
                                                <option value="CONFIRMED">Confirmed</option>
                                                <option value="SHIPPED">Shipped</option>
                                                <option value="DELIVERED">Delivered</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>

                                            {order.orderStatus === 'CANCELLED' && (
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="delete-btn"
                                                    title="Delete Order"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedOrder && (
                <div className="modal-overlay" onClick={closeOrderDetails}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Order Details #{selectedOrder.id}</h3>
                            <button className="close-btn" onClick={closeOrderDetails}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="order-section">
                                <h4>Customer Information</h4>
                                <p><strong>Name:</strong> {selectedOrder.user?.fullName}</p>
                                <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                                <p><strong>Phone:</strong> {selectedOrder.user?.mobile}</p>
                            </div>

                            <div className="order-section">
                                <h4>Shipping Address</h4>
                                <p>{selectedOrder.shippingAddress?.name}</p>
                                <p>{selectedOrder.shippingAddress?.streetAddress}</p>
                                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                                <p>{selectedOrder.shippingAddress?.mobile}</p>
                            </div>

                            <div className="order-section">
                                <h4>Order Items</h4>
                                <div className="order-items-list">
                                    {selectedOrder.orderItems?.map((item, index) => (
                                        <div key={index} className="order-item-detail">
                                            <img src={item.product.images?.[0]} alt={item.product.title} className="item-img" />
                                            <div className="item-info">
                                                <p className="item-title">{item.product.title}</p>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Price: {item.sellingPrice}TND</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="order-section">
                                <h4>Payment Details</h4>
                                <p><strong>Total Amount:</strong> {selectedOrder.totalSellingPrice}TND</p>
                                <p><strong>Status:</strong> {selectedOrder.paymentDetails?.status}</p>
                                <p><strong>Method:</strong> {selectedOrder.paymentDetails?.paymentMethod}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeOrderDetails}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerOrders;
