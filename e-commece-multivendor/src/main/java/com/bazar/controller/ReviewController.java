package com.bazar.controller;

import com.bazar.model.Review;
import com.bazar.model.User;
import com.bazar.request.CreateReviewRequest;
import com.bazar.response.ApiResponse;
import com.bazar.service.ProductService;
import com.bazar.service.ReviewService;
import com.bazar.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReviewController {
    private final ReviewService reviewService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<Review>> getReviewsByProductId(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Review> writeReview(@RequestHeader("Authorization") String jwt,
            @PathVariable Long productId,
            @RequestBody CreateReviewRequest req) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        var product = productService.findProductById(productId);
        Review review = reviewService.createReview(req, user, product);
        return ResponseEntity.ok(review);
    }

    @PatchMapping("/reviews/{reviewId}")
    public ResponseEntity<Review> updateReview(@RequestHeader("Authorization") String jwt,
            @PathVariable Long reviewId,
            @RequestBody CreateReviewRequest req) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Review review = reviewService.updateReview(reviewId, req.getReviewText(), req.getReviewRating(),
                req.getProductImages(), user.getId());
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(@RequestHeader("Authorization") String jwt,
            @PathVariable Long reviewId) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        reviewService.deleteReview(reviewId, user.getId());
        ApiResponse res = new ApiResponse();
        res.setMessage("Review deleted successfully");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/products/{productId}/reviews/user")
    public ResponseEntity<Review> getUserReviewForProduct(@RequestHeader("Authorization") String jwt,
            @PathVariable Long productId) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Review review = reviewService.getUserReviewForProduct(productId, user.getId());
        return ResponseEntity.ok(review);
    }
}
