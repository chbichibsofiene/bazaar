import React, { useState } from 'react';
import StarRating from './StarRating';
import api from '../services/api';
import { Upload, X } from 'lucide-react';
import './ReviewForm.css';

const ReviewForm = ({ productId, onReviewSubmitted, existingReview = null }) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [reviewText, setReviewText] = useState(existingReview?.reviewText || '');
    const [images, setImages] = useState(existingReview?.productImages || []);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const maxImages = 5;

        if (images.length + files.length > maxImages) {
            setError(`You can only upload up to ${maxImages} images`);
            return;
        }

        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Each image must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });

        e.target.value = ''; // Reset input
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (!reviewText.trim()) {
            setError('Please write a review');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const payload = {
                reviewRating: rating,
                reviewText: reviewText.trim(),
                productImages: images
            };

            if (existingReview) {
                // Update existing review
                await api.patch(`/api/reviews/${existingReview.id}`, payload);
            } else {
                // Create new review
                await api.post(`/api/products/${productId}/reviews`, payload);
            }

            setRating(0);
            setReviewText('');
            setImages([]);
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3 className="review-form-title">
                {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>

            {error && (
                <div className="review-form-error">
                    {error}
                </div>
            )}

            <div className="review-form-section">
                <label className="review-form-label">Your Rating</label>
                <StarRating rating={rating} onRatingChange={setRating} size="lg" />
            </div>

            <div className="review-form-section">
                <label htmlFor="reviewText" className="review-form-label">
                    Your Review
                </label>
                <textarea
                    id="reviewText"
                    rows="4"
                    className="review-form-textarea"
                    placeholder="Share your thoughts about this product..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    disabled={submitting}
                />
            </div>

            {/* Image Upload Section */}
            <div className="review-form-section">
                <label className="review-form-label">Add Photos (Optional)</label>

                <div className="review-images-preview">
                    {images.map((image, index) => (
                        <div key={index} className="review-image-item">
                            <img
                                src={image}
                                alt={`Review ${index + 1}`}
                                className="review-image-thumbnail"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="review-image-remove"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}

                    {images.length < 5 && (
                        <label className="review-image-upload">
                            <Upload className="upload-icon" />
                            <span className="upload-text">Upload</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={submitting}
                            />
                        </label>
                    )}
                </div>
                <p className="review-form-hint">
                    Upload up to 5 images (max 5MB each)
                </p>
            </div>

            <div className="review-form-actions">
                <button
                    type="submit"
                    disabled={submitting}
                    className="review-submit-btn"
                >
                    {submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
                </button>
                {existingReview && onReviewSubmitted && (
                    <button
                        type="button"
                        onClick={onReviewSubmitted}
                        className="review-cancel-btn"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default ReviewForm;
