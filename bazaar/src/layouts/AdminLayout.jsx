import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Store, LogOut, Package, Tags } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import './AdminLayout.css';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();

    useEffect(() => {
        // Don't redirect while still loading
        if (loading) {
            return;
        }

        // Check if user is logged in and has ADMIN role
        if (!user) {
            navigate('/login');
        } else if (user.role !== 'ROLE_ADMIN') {
            navigate('/');
        }
    }, [user, loading, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Show loading state while fetching user
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if user is not admin
    if (!user || user.role !== 'ROLE_ADMIN') {
        return null;
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Sellers', href: '/admin/sellers', icon: Store },
        { name: 'Categories', href: '/admin/categories', icon: Tags },
        { name: 'Products', href: '/admin/products', icon: Package },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Bazaar Admin</h2>
                </div>
                <nav className="sidebar-nav">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                            >
                                <item.icon />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="admin-content">
                <header className="admin-header">
                    <h1>{navigation.find(item => item.href === location.pathname)?.name || 'Admin'}</h1>
                    <div className="header-actions">
                        <div className="admin-profile">
                            <div className="avatar">A</div>
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

export default AdminLayout;
