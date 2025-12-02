import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight, Star, Zap, Shield, Truck, HeadphonesIcon } from 'lucide-react';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data.content || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const categories = [
        { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&w=500&q=60', gradient: 'from-blue-500 to-purple-600' },
        { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=60', gradient: 'from-pink-500 to-rose-600' },
        { name: 'Home & Living', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=500&q=60', gradient: 'from-green-500 to-teal-600' },
        { name: 'Books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=60', gradient: 'from-amber-500 to-orange-600' },
    ];

    const features = [
        { icon: Truck, title: 'Free Shipping', description: 'On orders over 50TND' },
        { icon: Shield, title: 'Secure Payment', description: '100% secure transactions' },
        { icon: HeadphonesIcon, title: '24/7 Support', description: 'Dedicated support team' },
        { icon: Zap, title: 'Fast Delivery', description: 'Quick and reliable' },
    ];

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <Zap size={16} />
                        <span>Summer Collection 2025</span>
                    </div>
                    <h1 className="hero-title">
                        Discover Amazing
                        <span className="gradient-text"> Products</span>
                    </h1>
                    <p className="hero-description">
                        Shop the latest trends in fashion, electronics, and more.
                        Get exclusive deals and free shipping on orders over 50TND.
                    </p>
                    <div className="hero-actions">
                        <Link to="/products" className="btn btn-primary hero-btn">
                            <span>Shop Now</span>
                            <ArrowRight size={20} />
                        </Link>
                        <Link to="/products" className="btn btn-secondary hero-btn">
                            <span>Explore Categories</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <div className="feature-icon">
                            <feature.icon size={24} />
                        </div>
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-description">{feature.description}</p>
                    </div>
                ))}
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="section-header">
                    <h2 className="section-title">Shop by Category</h2>
                    <p className="section-subtitle">Explore our wide range of products</p>
                </div>
                <div className="categories-grid">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to={`/products?category=${category.name}`}
                            className="category-card"
                        >
                            <div className="category-image-wrapper">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="category-image"
                                />
                                <div className={`category-overlay bg-gradient-to-br ${category.gradient}`}></div>
                            </div>
                            <div className="category-content">
                                <h3 className="category-name">{category.name}</h3>
                                <div className="category-arrow">
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="products-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">Featured Products</h2>
                        <p className="section-subtitle">Handpicked items just for you</p>
                    </div>
                    <Link to="/products" className="view-all-link">
                        <span>View All</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {loading ? (
                    <div className="products-grid">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="product-skeleton">
                                <div className="skeleton-image"></div>
                                <div className="skeleton-content">
                                    <div className="skeleton-line skeleton-title"></div>
                                    <div className="skeleton-line skeleton-text"></div>
                                    <div className="skeleton-line skeleton-price"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.slice(0, 8).map((product) => (
                            <Link key={product.id} to={`/product/${product.id}`} className="product-card">
                                <div className="product-image-container">
                                    <img
                                        src={product.images?.[0] || 'https://via.placeholder.com/300'}
                                        alt={product.title}
                                        className="product-image"
                                    />
                                    {product.discountPercent > 0 && (
                                        <span className="discount-badge">
                                            -{product.discountPercent}%
                                        </span>
                                    )}
                                    <div className="product-overlay">
                                        <button className="quick-view-btn">Quick View</button>
                                    </div>
                                </div>
                                <div className="product-info">
                                    <p className="product-brand">{product.brand}</p>
                                    <h3 className="product-title">{product.title}</h3>
                                    <div className="product-footer">
                                        <div className="product-pricing">
                                            <span className="product-price">{product.sellingPrice || product.mrpPrice} TND</span>
                                            {product.discountPercentage > 0 && (
                                                <span className="product-original-price">{product.mrpPrice} TND</span>
                                            )}
                                        </div>
                                        <div className="product-rating">
                                            <Star className="star-icon" size={16} />
                                            <span>4.5</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
