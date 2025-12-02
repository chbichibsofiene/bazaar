package com.bazar.controller;

import com.bazar.model.Discussion;
import com.bazar.model.Product;
import com.bazar.model.User;
import com.bazar.service.DiscussionService;
import com.bazar.service.ProductService;
import com.bazar.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class DiscussionController {

    private final DiscussionService discussionService;
    private final UserService userService;
    private final ProductService productService;

    @PostMapping("/products/{productId}/discussions")
    public ResponseEntity<Discussion> createDiscussion(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long productId,
            @RequestBody Map<String, String> request) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Product product = productService.findProductById(productId);
        String content = request.get("content");

        Discussion discussion = discussionService.createDiscussion(product, user, content);
        return ResponseEntity.ok(discussion);
    }

    @GetMapping("/products/{productId}/discussions")
    public ResponseEntity<List<Discussion>> getDiscussionsByProductId(@PathVariable Long productId) {
        List<Discussion> discussions = discussionService.getDiscussionsByProductId(productId);
        return ResponseEntity.ok(discussions);
    }
}
