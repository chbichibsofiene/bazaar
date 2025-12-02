package com.bazar.service.impl;

import com.bazar.model.Product;
import com.bazar.model.Review;
import com.bazar.model.User;
import com.bazar.repository.ReviewRepository;
import com.bazar.request.CreateReviewRequest;
import com.bazar.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;

    @Override
    public Review createReview(CreateReviewRequest req, User user, Product product) throws Exception {
        // Check if user has already reviewed this product
        Optional<Review> existingReview = reviewRepository.findByProduct_IdAndUser_Id(product.getId(), user.getId());
        if (existingReview.isPresent()) {
            throw new Exception("You have already reviewed this product. You can edit or delete your existing review.");
        }

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setReviewText(req.getReviewText());
        review.setRating(req.getReviewRating());
        review.setProductImages(req.getProductImages());
        product.getReviews().add(review);
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Override
    public Review updateReview(Long reviewId, String reviewText, double reviewRating, List<String> productImages,
            Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if (review.getUser().getId().equals(userId)) {
            review.setReviewText(reviewText);
            review.setRating(reviewRating);
            if (productImages != null) {
                review.setProductImages(productImages);
            }
            return reviewRepository.save(review);
        }
        throw new Exception("You are not authorized to update this review");
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if (!review.getUser().getId().equals(userId)) {
            throw new Exception("You are not authorized to delete this review");
        }
        // Remove review from product's collection before deleting
        if (review.getProduct() != null) {
            review.getProduct().getReviews().remove(review);
        }
        reviewRepository.delete(review);
    }

    @Override
    public Review getReviewById(Long reviewId) throws Exception {
        return reviewRepository.findById(reviewId).orElseThrow(() -> new Exception("Review not found"));
    }

    @Override
    public Review getUserReviewForProduct(Long productId, Long userId) {
        return reviewRepository.findByProduct_IdAndUser_Id(productId, userId).orElse(null);
    }
}
