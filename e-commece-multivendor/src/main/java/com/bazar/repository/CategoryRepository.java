package com.bazar.repository;

import com.bazar.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByCategoryId(String categoryId);

    // Search categories by name or category ID
    Page<Category> findByNameContainingOrCategoryIdContaining(String name, String categoryId, Pageable pageable);

    List<Category> findByLevel(Integer level);

    // Hierarchical queries
    List<Category> findByParentCategoryId(Long parentId);

    List<Category> findByParentCategoryIdAndLevel(Long parentId, Integer level);

    List<Category> findByLevelOrderByNameAsc(Integer level);

    boolean existsByParentCategoryId(Long parentId);

    List<Category> findByParentCategoryIsNull();
}
