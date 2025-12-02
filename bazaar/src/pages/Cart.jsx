import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package, Tag } from 'lucide-react';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const response = await api.get('/api/cart');
            setCart(response.data);
        } catch (error) {
            console.error("Error fetching cart", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (cartItemId, quantity) => {
        if (quantity < 1) return;
        try {
            await api.put(`/api/cart/item/${cartItemId}`, { quantity });
            fetchCart();
        } catch (error) {
            console.error("Error updating cart item", error);
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            await api.delete(`/api/cart/item/${cartItemId}`);
            fetchCart();
        } catch (error) {
            console.error("Error removing cart item", error);
        }
    };

    if (!user) {
        return (
            <div className="cart-empty-state">
                <div className="empty-state-content">
                    <ShoppingBag className="empty-icon" />
                    <h2>Please login to view your cart</h2>
                    <p>Sign in to see items you may have added previously.</p>
                    <Link to="/login" className="btn-primary">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="cart-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        return (
            <div className="cart-empty-state">
                <div className="empty-state-content">
                    <ShoppingBag className="empty-icon" />
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/products" className="btn-primary">
                        <ShoppingBag size={20} />
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <div className="cart-wrapper">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <p className="cart-item-count">
                        <Package size={20} />
                        {cart.totalItem} {cart.totalItem === 1 ? 'item' : 'items'}
                    </p>
                </div>

                <div className="cart-content">
                    {/* Cart Items */}
                    <div className="cart-items-section">
                        {cart.cartItems.map((item, index) => (
                            <div key={item.id} className="cart-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="item-image-wrapper">
                                    <img
                                        src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'https://via.placeholder.com/150'}
                                        alt={item.product.title}
                                        className="item-image"
                                    />
                                </div>

                                <div className="item-details">
                                    <div className="item-info">
                                        <Link to={`/product/${item.product.id}`} className="item-title">
                                            {item.product.title}
                                        </Link>
                                        <div className="item-meta">
                                            {item.product.brand && (
                                                <span className="item-brand">{item.product.brand}</span>
                                            )}
                                            {item.size && (
                                                <span className="item-size">Size: {item.size}</span>
                                            )}
                                        </div>
                                        <div className="item-price">
                                            <span className="current-price">{item.sellingPrice}TND</span>
                                            {item.product.mrpPrice > item.sellingPrice && (
                                                <span className="original-price">{item.product.mrpPrice}TND</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="item-actions">
                                        <div className="quantity-controls">
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemoveItem(item.id)}
                                            title="Remove item"
                                        >
                                            <Trash2 size={18} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <div className="summary-card">
                            <h2 className="summary-title">Order Summary</h2>

                            <div className="summary-details">
                                <div className="summary-row">
                                    <span className="summary-label">Subtotal ({cart.totalItem} items)</span>
                                    <span className="summary-value">{cart.totalPrice}TND</span>
                                </div>
                                <div className="summary-row discount-row">
                                    <span className="summary-label">
                                        <Tag size={16} />
                                        Discount
                                    </span>
                                    <span className="summary-value discount">-{(cart.totalMrPrice - cart.totalAmount).toFixed(2)}TND</span>
                                </div>
                                <div className="summary-row total-row">
                                    <span className="summary-label">Order Total</span>
                                    <span className="summary-value total">{cart.totalAmount}TND</span>
                                </div>
                            </div>

                            <button
                                className="checkout-btn"
                                onClick={() => navigate('/checkout')}
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight size={20} />
                            </button>

                            <div className="security-badges">
                                <span className="badge">🔒 Secure Checkout</span>
                                <span className="badge">✓ Free Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
