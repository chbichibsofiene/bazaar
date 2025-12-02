package com.bazar.controller;

import com.bazar.domain.User_Role;
import com.bazar.model.Category;
import com.bazar.model.User;
import com.bazar.repository.CategoryRepository;
import com.bazar.request.CategoryRequest;
import com.bazar.service.CategoryService;
import com.bazar.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;
    private final UserService userService;

    private void verifyAdminRole(String jwt) throws Exception {
        User currentUser = userService.findUserByJwtToken(jwt);
        if (currentUser.getRole() != User_Role.ROLE_ADMIN) {
            throw new RuntimeException("Access denied. Admin role required.");
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categoryPage;

        if (search != null && !search.isEmpty()) {
            categoryPage = categoryRepository.findByNameContainingOrCategoryIdContaining(search, search, pageable);
        } else {
            categoryPage = categoryRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("categories", categoryPage.getContent());
        response.put("currentPage", categoryPage.getNumber());
        response.put("totalItems", categoryPage.getTotalElements());
        response.put("totalPages", categoryPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<com.bazar.response.CategorySimpleDTO>> getAllCategoriesNoPagination(
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);
        List<Category> categories = categoryService.getAllCategories();

        // Convert to Simple DTOs to avoid recursion/identity issues
        List<com.bazar.response.CategorySimpleDTO> simpleCategories = categories.stream()
                .map(cat -> new com.bazar.response.CategorySimpleDTO(
                        cat.getId(),
                        cat.getName(),
                        cat.getLevel(),
                        cat.getParentCategory() != null ? cat.getParentCategory().getId() : null))
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(simpleCategories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(
            @Valid @RequestBody CategoryRequest request,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        try {
            Category savedCategory = categoryService.createCategory(request);
            return ResponseEntity.ok(savedCategory);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        try {
            Category updatedCategory = categoryService.updateCategory(id, request);
            return ResponseEntity.ok(updatedCategory);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCategory(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        try {
            categoryService.deleteCategory(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Category deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(org.springframework.http.HttpStatus.CONFLICT).body(response);
        }
    }
}
