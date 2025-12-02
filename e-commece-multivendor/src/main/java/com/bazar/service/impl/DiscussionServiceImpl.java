package com.bazar.service.impl;

import com.bazar.model.Discussion;
import com.bazar.model.Product;
import com.bazar.model.User;
import com.bazar.repository.DiscussionRepository;
import com.bazar.service.DiscussionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiscussionServiceImpl implements DiscussionService {

    private final DiscussionRepository discussionRepository;

    @Override
    public Discussion createDiscussion(Product product, User user, String content) {
        Discussion discussion = new Discussion();
        discussion.setProduct(product);
        discussion.setUser(user);
        discussion.setContent(content);
        discussion.setCreatedAt(LocalDateTime.now());
        return discussionRepository.save(discussion);
    }

    @Override
    public List<Discussion> getDiscussionsByProductId(Long productId) {
        return discussionRepository.findByProductId(productId);
    }
}
