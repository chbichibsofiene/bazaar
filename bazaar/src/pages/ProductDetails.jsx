import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import StarRating from '../components/StarRating';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import DiscussionSection from '../components/DiscussionSection';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userReview, setUserReview] = useState(null);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        fetchReviews();
        if (user) {
            fetchUserReview();
        }
    }, [id, user]);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/api/products/${id}/reviews`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }

        try {
            const addItemRequest = {
                productId: product.id,
                size: selectedSize || '',
                quantity: quantity
            };
            console.log('Adding to cart:', addItemRequest);
            console.log('Product data:', product);
            await api.put('/api/cart/add', addItemRequest);
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to add item to cart';
            alert(`Failed to add item to cart: ${errorMessage}`);
        }
    };

    const handleReviewSubmitted = () => {
        setShowReviewForm(false);
        fetchReviews();
        if (user) {
            fetchUserReview();
        }
    };

    const fetchUserReview = async () => {
        try {
            const response = await api.get(`/api/products/${id}/reviews/user`);
            console.log('User review response:', response.data);
            // Check if response.data is actually a review or null/empty
            if (response.data && response.data.id) {
                setUserReview(response.data);
            } else {
                setUserReview(null);
            }
        } catch (error) {
            console.log('No existing review for user (expected for new reviews)');
            // User hasn't reviewed this product yet
            setUserReview(null);
        }
    };

    const calculateAverageRating = () => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.rating] = (distribution[review.rating] || 0) + 1;
        });
        return distribution;
    };

    if (loading) {
        return (
            <div className="product-details-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-not-found">
                <h2>Product not found</h2>
            </div>
        );
    }

    const images = product.images && product.images.length > 0
        ? product.images
        : ['https://via.placeholder.com/600'];

    const colors = product.color ? [product.color] : ['White', 'Black', 'Gray'];
    const sizes = product.sizes
        ? (typeof product.sizes === 'string' ? product.sizes.split(',').map(s => s.trim()) : product.sizes.map(s => typeof s === 'string' ? s : s.name))
        : ['40', '40.5', '41', '42', '42.5', '43', '44'];

    const ratingDistribution = getRatingDistribution();
    const totalReviews = reviews.length;

    return (
        <div className="product-details-container">
            <div className="product-details-content">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <a href="/">Home</a>
                    <ChevronRight size={16} />
                    <a href="/products">Products</a>
                    <ChevronRight size={16} />
                    <span>{product.title}</span>
                </nav>

                <div className="product-main">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img src={images[selectedImage]} alt={product.title} />
                            {product.discountPercent > 0 && (
                                <span className="discount-badge-large">
                                    -{product.discountPercent}%
                                </span>
                            )}
                        </div>
                        <div className="thumbnail-gallery">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img src={image} alt="" />
                                </button>
                            ))}
                            {images.length > 4 && (
                                <div className="thumbnail-more">+5 more</div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info-section">
                        <div className="product-brand">{product.brand}</div>
                        <h1 className="product-name">{product.title}</h1>

                        {/* Rating */}
                        <div className="product-rating-summary">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={i < Math.round(calculateAverageRating()) ? 'star-filled' : 'star-empty'}
                                    />
                                ))}
                            </div>
                            <span className="rating-text">{totalReviews} Reviews</span>
                        </div>

                        {/* Price */}
                        <div className="product-price-section">
                            <span className="current-price">{product.sellingPrice || product.mrpPrice} TND</span>
                            {product.discountPercentage > 0 && (
                                <span className="original-price">{product.mrpPrice} TND</span>
                            )}
                        </div>

                        {/* Color Selection */}
                        <div className="product-option">
                            <div className="option-header">
                                <span className="option-label">Color</span>
                                <span className="option-value">{selectedColor || colors[0]}</span>
                            </div>
                            <div className="color-options">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        className={`color-btn ${selectedColor === color || (!selectedColor && color === colors[0]) ? 'active' : ''}`}
                                        onClick={() => setSelectedColor(color)}
                                        title={color}
                                    >
                                        <div className={`color-swatch color-${color.toLowerCase()}`}></div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="product-option">
                            <div className="option-header">
                                <span className="option-label">Size</span>
                                <span className="option-value">{selectedSize || 'EU Men'}</span>
                            </div>
                            <div className="size-options">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button className="add-to-cart-btn" onClick={handleAddToCart}>
                            <ShoppingCart size={20} />
                            Add to cart
                        </button>

                        {/* Delivery Info */}
                        <div className="delivery-info">
                            <Truck size={18} />
                            <span>Free delivery on orders over 50 TND</span>
                        </div>

                        {/* Features */}
                        <div className="product-features">
                            <div className="feature-item">
                                <Shield size={20} />
                                <span>Secure Payment</span>
                            </div>
                            <div className="feature-item">
                                <RotateCcw size={20} />
                                <span>Easy Returns</span>
                            </div>
                            <div className="feature-item">
                                <Truck size={20} />
                                <span>Fast Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="product-tabs">
                    <div className="tabs-header">
                        <button
                            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                            onClick={() => setActiveTab('details')}
                        >
                            Details
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`}
                            onClick={() => setActiveTab('discussion')}
                        >
                            Discussion
                        </button>
                    </div>

                    <div className="tabs-content">
                        {activeTab === 'details' && (
                            <div className="tab-panel">
                                <div className="product-description">
                                    {product.description && product.description.trim() !== '' ? (
                                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                    ) : (
                                        <p className="no-description">No description available for this product.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="tab-panel reviews-panel">
                                <div className="reviews-summary">
                                    <div className="rating-overview">
                                        <div className="average-rating">
                                            <div className="rating-stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={24}
                                                        className={i < Math.round(calculateAverageRating()) ? 'star-filled' : 'star-empty'}
                                                    />
                                                ))}
                                            </div>
                                            <div className="rating-number">{calculateAverageRating()}</div>
                                        </div>

                                        <div className="rating-bars">
                                            {[5, 4, 3, 2, 1].map((rating) => {
                                                const count = ratingDistribution[rating] || 0;
                                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                                return (
                                                    <div key={rating} className="rating-bar-row">
                                                        <span className="rating-label">{rating}</span>
                                                        <div className="rating-bar">
                                                            <div
                                                                className="rating-bar-fill"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="rating-count">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Show Write Review button only if user hasn't reviewed */}
                                {user && !userReview && (
                                    <button
                                        onClick={() => setShowReviewForm(!showReviewForm)}
                                        className="write-review-btn"
                                    >
                                        {showReviewForm ? 'Cancel' : 'Write a Review'}
                                    </button>
                                )}

                                {/* Show review form only if user hasn't reviewed */}
                                {showReviewForm && user && !userReview && (
                                    <div className="review-form-container">
                                        <ReviewForm
                                            productId={id}
                                            onReviewSubmitted={handleReviewSubmitted}
                                        />
                                    </div>
                                )}

                                {reviewsLoading ? (
                                    <div className="reviews-loading">
                                        <div className="loading-spinner"></div>
                                    </div>
                                ) : (
                                    <ReviewList
                                        reviews={reviews}
                                        productId={id}
                                        onReviewsChanged={fetchReviews}
                                    />
                                )}

                                {!user && (
                                    <div className="login-prompt">
                                        <p>
                                            Please{' '}
                                            <button onClick={() => navigate('/login')}>
                                                log in
                                            </button>
                                            {' '}to write a review
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'discussion' && (
                            <div className="tab-panel">
                                <DiscussionSection productId={id} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
