import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Filter, X, ChevronLeft, ChevronRight, Star, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [viewMode, setViewMode] = useState('grid');

    // Filter states
    const queryParams = new URLSearchParams(location.search);
    const [filters, setFilters] = useState({
        category: queryParams.get('category') || '',
        minPrice: queryParams.get('minPrice') || '',
        maxPrice: queryParams.get('maxPrice') || '',
        sort: queryParams.get('sort') || 'price_low',
        pageNumber: parseInt(queryParams.get('pageNumber')) || 0,
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [location.search]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(location.search);
            const response = await api.get(`/products?${params.toString()}`);
            setProducts(response.data.content || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.sort) params.set('sort', filters.sort);
        params.set('pageNumber', 0);
        navigate(`/products?${params.toString()}`);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            sort: 'price_low',
            pageNumber: 0,
        });
        navigate('/products');
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(location.search);
        params.set('pageNumber', newPage);
        navigate(`/products?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="product-list-container">
            <div className="product-list-content">
                {/* Header */}
                <div className="product-list-header">
                    <div>
                        <h1 className="page-title">All Products</h1>
                        <p className="page-subtitle">
                            {loading ? 'Loading...' : `${products.length} products found`}
                        </p>
                    </div>

                    <div className="header-actions">
                        {/* View Mode Toggle */}
                        <div className="view-toggle">
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid size={20} />
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={20} />
                            </button>
                        </div>

                        {/* Mobile Filter Button */}
                        <button
                            className="mobile-filter-btn"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={20} />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                <div className="product-list-main">
                    {/* Filters Sidebar */}
                    <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
                        <div className="filters-header">
                            <h3>
                                <Filter size={20} />
                                <span>Filters</span>
                            </h3>
                            <button className="close-filters" onClick={() => setShowFilters(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="filters-content">
                            {/* Category Filter */}
                            <div className="filter-group">
                                <label className="filter-label">Category</label>
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    className="filter-select"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.categoryId}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="filter-group">
                                <label className="filter-label">Price Range</label>
                                <div className="price-inputs">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                        className="price-input"
                                    />
                                    <span className="price-separator">-</span>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                        className="price-input"
                                    />
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="filter-group">
                                <label className="filter-label">Sort By</label>
                                <select
                                    name="sort"
                                    value={filters.sort}
                                    onChange={handleFilterChange}
                                    className="filter-select"
                                >
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="popular">Most Popular</option>
                                </select>
                            </div>

                            <div className="filter-actions">
                                <button onClick={applyFilters} className="apply-filters-btn">
                                    Apply Filters
                                </button>
                                <button onClick={clearFilters} className="clear-filters-btn">
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="products-section">
                        {loading ? (
                            <div className={`products-grid ${viewMode}`}>
                                {[...Array(12)].map((_, i) => (
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
                        ) : products.length === 0 ? (
                            <div className="no-products">
                                <h3>No products found</h3>
                                <p>Try adjusting your filters or search criteria.</p>
                                <button onClick={clearFilters} className="btn btn-primary">
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={`products-grid ${viewMode}`}>
                                    {products.map((product) => (
                                        <Link key={product.id} to={`/product/${product.id}`} className="product-card-link">
                                            <div className="product-card">
                                                <div className="product-image-wrapper">
                                                    <img
                                                        src={product.images?.[0] || 'https://via.placeholder.com/300'}
                                                        alt={product.title}
                                                        className="product-image"
                                                    />
                                                    {product.discountPercentage > 0 && (
                                                        <span className="discount-badge">
                                                            -{product.discountPercentage}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="product-card-info">
                                                    <p className="product-brand">{product.brand}</p>
                                                    <h3 className="product-title">{product.title}</h3>
                                                    <div className="product-card-footer">
                                                        <div className="product-pricing">
                                                            <span className="product-price">{product.sellingPrice} TND</span>
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
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            onClick={() => handlePageChange(filters.pageNumber - 1)}
                                            disabled={filters.pageNumber <= 0}
                                            className="pagination-btn"
                                        >
                                            <ChevronLeft size={20} />
                                            <span>Previous</span>
                                        </button>

                                        <div className="pagination-info">
                                            <span>Page {filters.pageNumber + 1} of {totalPages}</span>
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(filters.pageNumber + 1)}
                                            disabled={filters.pageNumber >= totalPages - 1}
                                            className="pagination-btn"
                                        >
                                            <span>Next</span>
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
