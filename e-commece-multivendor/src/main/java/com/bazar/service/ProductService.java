package com.bazar.service;

import com.bazar.exceptions.ProductException;
import com.bazar.model.Product;
import com.bazar.model.Seller;
import com.bazar.request.CreateProductRequest;
import com.bazar.response.ProductStatsDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    public Product createProduct(CreateProductRequest req, Seller seller);

    public void deleteProduct(Long productId) throws ProductException;

    public Product updateProduct(Long productId, Product product) throws ProductException;

    Product findProductById(Long productId) throws ProductException;

    List<Product> searchProducts(String query);

    public Page<Product> getAllProducts(String category, String brand, String colors, String sizes, Integer minPrice,
            Integer maxPrice, Integer minDiscount, String sort, String stock, Integer pageNumber, Integer pageSize);

    List<Product> getProductsBySellerId(Long sellerId);

    ProductStatsDTO getProductStatsBySellerId(Long sellerId);
}
