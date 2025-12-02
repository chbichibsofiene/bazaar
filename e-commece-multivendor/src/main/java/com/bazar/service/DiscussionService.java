package com.bazar.service;

import com.bazar.model.Discussion;
import com.bazar.model.Product;
import com.bazar.model.User;

import java.util.List;

public interface DiscussionService {
    Discussion createDiscussion(Product product, User user, String content);

    List<Discussion> getDiscussionsByProductId(Long productId);
}
