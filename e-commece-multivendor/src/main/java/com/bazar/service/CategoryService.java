package com.bazar.service;

import com.bazar.model.Category;
import com.bazar.request.CategoryRequest;
import com.bazar.response.CategoryTreeDTO;

import java.util.List;

public interface CategoryService {

    /**
     * Get all parent categories (level 1)
     */
    List<Category> getAllParentCategories();

    /**
     * Get child categories (level 2) under a parent
     */
    List<Category> getChildCategories(Long parentId);

    /**
     * Get sub-categories (level 3) under a child category
     */
    List<Category> getSubCategories(Long childId);

    /**
     * Get complete category tree with all levels
     */
    List<CategoryTreeDTO> getCategoryTree();

    /**
     * Get single category by ID
     */
    Category getCategoryById(Long id);

    /**
     * Create a new category with validation
     */
    Category createCategory(CategoryRequest request) throws Exception;

    /**
     * Update existing category
     */
    Category updateCategory(Long id, CategoryRequest request) throws Exception;

    /**
     * Delete category (only if no children or products)
     */
    void deleteCategory(Long id) throws Exception;

    /**
     * Get all categories (for admin)
     */
    List<Category> getAllCategories();
}
