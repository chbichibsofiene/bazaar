package com.bazar.service.impl;

import com.bazar.model.HomeCategory;
import com.bazar.repository.HomeCategoryRepository;
import com.bazar.service.HomeCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class HomeCategoryServiceImpl implements HomeCategoryService {
    private final HomeCategoryRepository homeCategoryRepository;
    @Override
    public HomeCategory createHomeCategory(HomeCategory homeCategory) {
        return homeCategoryRepository.save(homeCategory);
    }

    @Override
    public List<HomeCategory> createHomeCategories(List<HomeCategory> homeCategories) {
        if (homeCategoryRepository.findAll().isEmpty())
        {
            return homeCategoryRepository.saveAll(homeCategories);
        }
        return homeCategoryRepository.findAll();
    }

    @Override
    public HomeCategory updateHomeCategory(HomeCategory category, Long id) {
        HomeCategory existingCategory = homeCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HomeCategory not found with id: " + id));
        if (category.getCategoryId()!=null){
            existingCategory.setImage(category.getImage());
        }
        if (category.getCategoryId()!=null){
            existingCategory.setCategoryId(category.getCategoryId());
        }
        return homeCategoryRepository.save(existingCategory);
    }

    @Override
    public List<HomeCategory> getAllHomeCategories() {
        return homeCategoryRepository.findAll();
    }
}
