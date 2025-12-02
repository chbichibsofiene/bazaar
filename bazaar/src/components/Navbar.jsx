import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart, User, Menu, X, Package, LogOut, UserCircle, LayoutDashboard, Store } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsUserMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-text">Bazaar</span>
                    <span className="logo-dot"></span>
                </Link>

                {/* Search Bar */}
                <div className="navbar-search">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search for products, brands and more..."
                        className="search-input"
                    />
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    {user?.role === 'ROLE_SELLER' && (
                        <Link to="/seller/dashboard" className="nav-link">
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </Link>
                    )}

                    {user?.role === 'ROLE_ADMIN' && (
                        <Link to="/admin/dashboard" className="nav-link">
                            <LayoutDashboard size={20} />
                            <span>Admin</span>
                        </Link>
                    )}

                    {(!user || (user.role !== 'ROLE_SELLER' && user.role !== 'ROLE_ADMIN')) && (
                        <Link to="/seller/signup" className="nav-link">
                            <Store size={20} />
                            <span>Become Seller</span>
                        </Link>
                    )}

                    <Link to="/products" className="nav-link">
                        <Package size={20} />
                        <span>Products</span>
                    </Link>

                    <Link to="/cart" className="nav-link cart-link">
                        <div className="cart-icon-wrapper">
                            <ShoppingCart size={20} />
                            <span className="cart-badge">0</span>
                        </div>
                        <span>Cart</span>
                    </Link>

                    {user ? (
                        <div className="user-menu">
                            <button
                                className="user-button"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                <User size={20} />
                                <span>{user.fullName || user.email}</span>
                            </button>
                            {isUserMenuOpen && (
                                <>
                                    <div
                                        className="dropdown-overlay"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    ></div>
                                    <div className="dropdown-menu">
                                        <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                                            <UserCircle size={18} />
                                            <span>Profile</span>
                                        </Link>
                                        <Link to="/orders" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                                            <Package size={18} />
                                            <span>Orders</span>
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button onClick={handleLogout} className="dropdown-item logout">
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="nav-link login-btn">Login</Link>
                            <Link to="/signup" className="nav-link signup-btn">Sign Up</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    {user?.role === 'ROLE_SELLER' && (
                        <Link to="/seller/dashboard" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </Link>
                    )}
                    {user?.role === 'ROLE_ADMIN' && (
                        <Link to="/admin/dashboard" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
                            <LayoutDashboard size={20} />
                            <span>Admin</span>
                        </Link>
                    )}
                    {(!user || (user.role !== 'ROLE_SELLER' && user.role !== 'ROLE_ADMIN')) && (
                        <Link to="/seller/signup" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
                            <Store size={20} />
                            <span>Become Seller</span>
                        </Link>
                    )}
                    <Link to="/products" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
                        <Package size={20} />
                        <span>Products</span>
                    </Link>
                    <Link to="/cart" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
                        <ShoppingCart size={20} />
                        <span>Cart</span>
                    </Link>
                    {user ? (
                        <>
                            <Link to="/profile" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
                                <UserCircle size={20} />
                                <span>Profile</span>
                            </Link>
                            <Link to="/orders" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
                                <Package size={20} />
                                <span>Orders</span>
                            </Link>
                            <button onClick={handleLogout} className="mobile-menu-item logout">
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            <Link to="/signup" className="mobile-menu-item signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
