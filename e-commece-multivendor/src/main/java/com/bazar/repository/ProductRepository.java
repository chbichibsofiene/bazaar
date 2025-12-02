package com.bazar.repository;

import com.bazar.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findBySellerId(Long id);

    @Query("SELECT p FROM Product p " +
            "WHERE (:query IS NULL " +
            "   OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "   OR LOWER(p.category.name) LIKE LOWER(CONCAT('%', :query, '%'))" +
            ")")
    List<Product> searchProduct(@Param("query") String query);

    // Search products by title with pagination
    Page<Product> findByTitleContaining(String title, Pageable pageable);

    // Product statistics queries
    Long countBySellerId(Long sellerId);

    @Query("SELECT COALESCE(SUM(p.sellingPrice * p.quantity), 0.0) FROM Product p WHERE p.seller.id = :sellerId")
    Double sumStockValueBySellerId(@Param("sellerId") Long sellerId);

    Long countBySellerIdAndQuantityLessThan(Long sellerId, int quantity);

    Long countBySellerIdAndQuantity(Long sellerId, int quantity);

    // Category-related queries
    Long countByCategoryId(Long categoryId);
}
