import React from 'react';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="product-card" onClick={handleClick}>
            <div className="product-image-container">
                <img src={product.imageUrl} alt={product.title} className="product-image" />
            </div>
            <div className="product-info">
                <h3 className="product-brand">{product.brand}</h3>
                <h2 className="product-title">{product.title}</h2>
                <div className="product-price">
                    <span className="current-price">{product.discountedPrice}TND</span>
                    {product.discountPersent > 0 && (
                        <>
                            <span className="original-price">{product.price}TND</span>
                            <span className="discount-tag">{product.discountPersent}% OFF</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
