import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './SellerLayout.css';

const SellerLayout = () => {
    const { user, jwt, logout, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!loading && !jwt) {
            navigate('/seller/login');
        }
        // Redirect if user is not a seller
        if (!loading && user && user.role !== 'ROLE_SELLER') {
            navigate('/');
        }
    }, [jwt, user, loading, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/seller/login');
    };

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!jwt || !user || user.role !== 'ROLE_SELLER') {
        return null;
    }

    return (
        <div className="seller-layout">
            <aside className="seller-sidebar">
                <div className="sidebar-header">
                    <h2>Seller Hub</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/seller/dashboard" className="nav-item">
                        <i className="fas fa-home"></i> Dashboard
                    </Link>
                    <Link to="/seller/products" className="nav-item">
                        <i className="fas fa-box"></i> Products
                    </Link>
                    <Link to="/seller/orders" className="nav-item">
                        <i className="fas fa-shopping-bag"></i> Orders
                    </Link>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </aside>
            <main className="seller-content">
                <header className="seller-header">
                    <h1>Dashboard</h1>
                    <div className="header-actions">
                        <div className="seller-profile">
                            <div className="avatar">S</div>
                        </div>
                    </div>
                </header>
                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SellerLayout;
