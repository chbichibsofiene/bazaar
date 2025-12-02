package com.bazar.service.impl;

import com.bazar.model.Category;
import com.bazar.repository.CategoryRepository;
import com.bazar.repository.ProductRepository;
import com.bazar.request.CategoryRequest;
import com.bazar.response.CategoryTreeDTO;
import com.bazar.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public List<Category> getAllParentCategories() {
        return categoryRepository.findByLevelOrderByNameAsc(1);
    }

    @Override
    public List<Category> getChildCategories(Long parentId) {
        return categoryRepository.findByParentCategoryIdAndLevel(parentId, 2);
    }

    @Override
    public List<Category> getSubCategories(Long childId) {
        return categoryRepository.findByParentCategoryIdAndLevel(childId, 3);
    }

    @Override
    public List<CategoryTreeDTO> getCategoryTree() {
        List<Category> parentCategories = getAllParentCategories();
        return parentCategories.stream()
                .map(this::buildCategoryTree)
                .collect(Collectors.toList());
    }

    private CategoryTreeDTO buildCategoryTree(Category category) {
        CategoryTreeDTO dto = new CategoryTreeDTO();
        dto.setId(category.getId());
        dto.setCategoryId(category.getCategoryId());
        dto.setName(category.getName());
        dto.setImage(category.getImage());
        dto.setLevel(category.getLevel());
        dto.setCategoryPath(category.getCategoryPath());

        // Recursively build children
        List<Category> children = categoryRepository.findByParentCategoryId(category.getId());
        dto.setChildren(children.stream()
                .map(this::buildCategoryTree)
                .collect(Collectors.toList()));

        return dto;
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    @Transactional
    public Category createCategory(CategoryRequest request) throws Exception {
        // Validate level
        if (request.getLevel() < 1 || request.getLevel() > 3) {
            throw new Exception("Level must be between 1 and 3");
        }

        // Validate parent category based on level
        if (request.getLevel() == 1) {
            // Parent categories should not have a parent
            if (request.getParentCategoryId() != null) {
                throw new Exception("Parent categories (level 1) cannot have a parent category");
            }
        } else {
            // Child and sub-categories must have a parent
            if (request.getParentCategoryId() == null) {
                throw new Exception("Level " + request.getLevel() + " categories must have a parent category");
            }

            // Validate parent exists and has correct level
            Category parent = getCategoryById(request.getParentCategoryId());
            int expectedParentLevel = request.getLevel() - 1;

            if (parent.getLevel() != expectedParentLevel) {
                throw new Exception("Parent category must be level " + expectedParentLevel +
                        " for a level " + request.getLevel() + " category");
            }
        }

        Category category = new Category();
        category.setCategoryId(generateCategoryId());
        category.setName(request.getName());
        category.setImage(request.getImage());
        category.setLevel(request.getLevel());

        if (request.getParentCategoryId() != null) {
            Category parent = getCategoryById(request.getParentCategoryId());
            category.setParentCategory(parent);
        }

        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Category updateCategory(Long id, CategoryRequest request) throws Exception {
        Category category = getCategoryById(id);

        // Update name and image
        category.setName(request.getName());
        category.setImage(request.getImage());

        // Note: We don't allow changing level or parent after creation
        // to maintain data integrity

        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) throws Exception {
        Category category = getCategoryById(id);

        // Check if category has children
        if (categoryRepository.existsByParentCategoryId(id)) {
            throw new Exception("Cannot delete category with child categories. Delete children first.");
        }

        // Check if category has products
        long productCount = productRepository.countByCategoryId(id);
        if (productCount > 0) {
            throw new Exception("Cannot delete category with " + productCount + " products assigned. " +
                    "Reassign products first.");
        }

        categoryRepository.delete(category);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    private String generateCategoryId() {
        return "CAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
