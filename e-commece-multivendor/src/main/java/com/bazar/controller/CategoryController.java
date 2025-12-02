package com.bazar.controller;

import com.bazar.model.Category;
import com.bazar.response.CategoryTreeDTO;
import com.bazar.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getAllParentCategories() {
        List<Category> categories = categoryService.getAllParentCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{parentId}/children")
    public ResponseEntity<List<Category>> getChildCategories(@PathVariable Long parentId) {
        List<Category> children = categoryService.getChildCategories(parentId);
        return ResponseEntity.ok(children);
    }

    @GetMapping("/{childId}/subcategories")
    public ResponseEntity<List<Category>> getSubCategories(@PathVariable Long childId) {
        List<Category> subCategories = categoryService.getSubCategories(childId);
        return ResponseEntity.ok(subCategories);
    }

    @GetMapping("/tree")
    public ResponseEntity<List<CategoryTreeDTO>> getCategoryTree() {
        List<CategoryTreeDTO> tree = categoryService.getCategoryTree();
        return ResponseEntity.ok(tree);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }
}
