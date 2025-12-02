import React from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

const StarRating = ({ rating = 0, onRatingChange = null, readonly = false, size = 'md' }) => {
    const sizeClasses = {
        sm: 'star-sm',
        md: 'star-md',
        lg: 'star-lg'
    };

    const handleClick = (index) => {
        if (!readonly && onRatingChange) {
            onRatingChange(index + 1);
        }
    };

    return (
        <div className="star-rating-container">
            {[0, 1, 2, 3, 4].map((index) => (
                <Star
                    key={index}
                    className={`star-icon ${sizeClasses[size]} ${rating > index ? 'star-filled' : 'star-empty'
                        } ${!readonly && onRatingChange ? 'star-interactive' : ''}`}
                    onClick={() => handleClick(index)}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
};

export default StarRating;
