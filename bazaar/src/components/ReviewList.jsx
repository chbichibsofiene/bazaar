import React, { useState } from 'react';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import { Edit2, Trash2, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ConfirmModal from './ConfirmModal';
import './ReviewList.css';

const ReviewList = ({ reviews, productId, onReviewsChanged }) => {
    const { user } = useAuth();
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [deletingReviewId, setDeletingReviewId] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const handleDeleteClick = (reviewId) => {
        console.log('Delete button clicked for review:', reviewId);
        setReviewToDelete(reviewId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!reviewToDelete) return;

        console.log('User confirmed deletion, sending request...');
        setDeletingReviewId(reviewToDelete);
        try {
            const response = await api.delete(`/api/reviews/${reviewToDelete}`);
            console.log('Delete response:', response);
            if (onReviewsChanged) {
                onReviewsChanged();
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            console.error('Error response:', error.response);
            alert('Failed to delete review. Please try again.');
        } finally {
            setDeletingReviewId(null);
            setReviewToDelete(null);
        }
    };

    const handleEditComplete = () => {
        setEditingReviewId(null);
        if (onReviewsChanged) {
            onReviewsChanged();
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="reviews-empty">
                <p>No reviews yet. Be the first to review this product!</p>
            </div>
        );
    }

    return (
        <>
            <div className="reviews-list">
                {reviews.map((review) => {
                    const isOwnReview = user && review.user?.id === user.id;
                    const isEditing = editingReviewId === review.id;

                    if (isEditing) {
                        return (
                            <ReviewForm
                                key={review.id}
                                productId={productId}
                                existingReview={review}
                                onReviewSubmitted={handleEditComplete}
                            />
                        );
                    }

                    return (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="review-user-info">
                                    <div className="review-avatar">
                                        <User className="avatar-icon" />
                                    </div>
                                    <div className="review-meta">
                                        <div className="review-user-rating">
                                            <h4 className="review-user-name">
                                                {review.user?.fullName || 'Anonymous'}
                                            </h4>
                                            <StarRating rating={review.rating} readonly size="sm" />
                                        </div>
                                        <p className="review-date">
                                            {formatDate(review.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {isOwnReview && (
                                    <div className="review-actions">
                                        <button
                                            onClick={() => setEditingReviewId(review.id)}
                                            className="review-action-btn review-edit-btn"
                                            title="Edit review"
                                        >
                                            <Edit2 className="action-icon" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(review.id)}
                                            disabled={deletingReviewId === review.id}
                                            className="review-action-btn review-delete-btn"
                                            title="Delete review"
                                        >
                                            <Trash2 className="action-icon" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="review-text">{review.reviewText}</p>

                            {/* Review Images */}
                            {review.productImages && review.productImages.length > 0 && (
                                <div className="review-images">
                                    {review.productImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Review image ${index + 1}`}
                                            className="review-image"
                                            onClick={() => setLightboxImage(image)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Lightbox for full-size image view */}
            {lightboxImage && (
                <div className="review-lightbox" onClick={() => setLightboxImage(null)}>
                    <button
                        className="lightbox-close"
                        onClick={() => setLightboxImage(null)}
                    >
                        <X className="close-icon" />
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Review image full size"
                        className="lightbox-image"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setReviewToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Review?"
                message="Are you sure you want to delete this review? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
};

export default ReviewList;
