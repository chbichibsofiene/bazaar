import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import SubscriptionDashboard from '../../components/subscription/SubscriptionDashboard';
import SubscriptionModal from '../../components/subscription/SubscriptionModal';
import { TrendingUp, Package, ShoppingCart, DollarSign, RefreshCw, Clock, Star } from 'lucide-react';
import './SellerDashboard.css';

const SellerDashboard = () => {
    const [report, setReport] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

    useEffect(() => {
        fetchDashboardData();
        checkSubscription();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [reportRes, topProductsRes, recentOrdersRes] = await Promise.all([
                api.get('/sellers/report'),
                api.get('/sellers/analytics/top-products?limit=5'),
                api.get('/sellers/analytics/recent-orders?limit=5')
            ]);

            setReport(reportRes.data);
            setTopProducts(topProductsRes.data);
            setRecentOrders(recentOrdersRes.data);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const checkSubscription = async () => {
        try {
            const response = await api.get('/api/seller/subscription/current');
            if (!response.data || response.data?.plan?.planType === 'FREE') {
                setIsSubscriptionModalOpen(true);
            }
        } catch (error) {
            console.error("Error fetching subscription", error);
            setIsSubscriptionModalOpen(true);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: '#f59e0b',
            CONFIRMED: '#3b82f6',
            SHIPPED: '#8b5cf6',
            DELIVERED: '#10b981',
            CANCELLED: '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;
    if (!report) return <div className="error">Failed to load report</div>;

    return (
        <div className="seller-dashboard">
            <SubscriptionDashboard onUpgrade={() => setIsSubscriptionModalOpen(true)} />

            {/* Quick Stats */}
            <div className="stats-grid">
                <div className="stat-card earnings">
                    <div className="stat-icon">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Earnings</h3>
                        <p className="stat-value">{report.totalEarnings}TND</p>
                        <span className="stat-label">Revenue generated</span>
                    </div>
                </div>

                <div className="stat-card sales">
                    <div className="stat-icon">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Sales</h3>
                        <p className="stat-value">{report.totalSales}</p>
                        <span className="stat-label">Items sold</span>
                    </div>
                </div>

                <div className="stat-card orders">
                    <div className="stat-icon">
                        <ShoppingCart size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="stat-value">{report.totalOrders}</p>
                        <span className="stat-label">Orders received</span>
                    </div>
                </div>

                <div className="stat-card refunds">
                    <div className="stat-icon">
                        <RefreshCw size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Refunds</h3>
                        <p className="stat-value">{report.totalRefunds}TND</p>
                        <span className="stat-label">Amount refunded</span>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="analytics-section">
                {/* Top Selling Products */}
                <div className="analytics-card">
                    <div className="card-header">
                        <h2><Star size={20} /> Top Selling Products</h2>
                    </div>
                    <div className="top-products-grid">
                        {topProducts.length > 0 ? (
                            topProducts.map((product) => (
                                <div key={product.productId} className="product-card">
                                    <div className="product-image">
                                        {product.productImage ? (
                                            <img src={product.productImage} alt={product.productName} />
                                        ) : (
                                            <div className="no-image">
                                                <Package size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h4>{product.productName}</h4>
                                        <div className="product-stats">
                                            <div className="stat">
                                                <span className="label">Revenue</span>
                                                <span className="value">{product.revenue}TND</span>
                                            </div>
                                            <div className="stat">
                                                <span className="label">Sales</span>
                                                <span className="value">{product.totalSales} units</span>
                                            </div>
                                            <div className="stat">
                                                <span className="label">Orders</span>
                                                <span className="value">{product.orderCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <Package size={48} />
                                <p>No sales data available yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="analytics-card">
                    <div className="card-header">
                        <h2><Clock size={20} /> Recent Orders</h2>
                    </div>
                    <div className="orders-list">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <div key={order.id} className="order-item">
                                    <div className="order-id">
                                        <span className="label">Order ID</span>
                                        <span className="value">#{order.orderId}</span>
                                    </div>
                                    <div className="order-details">
                                        <div className="detail">
                                            <span className="label">Items</span>
                                            <span className="value">{order.totalItem}</span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Amount</span>
                                            <span className="value">{order.totalSellingPrice}TND</span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Status</span>
                                            <span
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Date</span>
                                            <span className="value">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <ShoppingCart size={48} />
                                <p>No orders yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <SubscriptionModal
                open={isSubscriptionModalOpen}
                onClose={() => setIsSubscriptionModalOpen(false)}
            />
        </div>
    );
};

export default SellerDashboard;
