package com.bazar.service;

import com.bazar.model.Product;
import com.bazar.model.Review;
import com.bazar.model.User;
import com.bazar.request.CreateReviewRequest;

import java.util.List;

public interface ReviewService {
    Review createReview(CreateReviewRequest req, User user, Product product) throws Exception;

    List<Review> getReviewsByProductId(Long productId);

    Review updateReview(Long reviewId, String reviewText, double reviewRating, List<String> productImages, Long userId)
            throws Exception;

    void deleteReview(Long reviewId, Long userId) throws Exception;

    Review getReviewById(Long reviewId) throws Exception;

    Review getUserReviewForProduct(Long productId, Long userId);
}
