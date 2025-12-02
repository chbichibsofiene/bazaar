package com.bazar.service.impl;

import com.bazar.exceptions.ProductException;
import com.bazar.model.Category;
import com.bazar.model.Product;
import com.bazar.model.Seller;
import com.bazar.repository.CategoryRepository;
import com.bazar.repository.ProductRepository;
import com.bazar.request.CreateProductRequest;
import com.bazar.response.ProductStatsDTO;
import com.bazar.service.ProductService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Product createProduct(CreateProductRequest req, Seller seller) {
        Category category1 = categoryRepository.findByCategoryId((req.getCategory()));
        if (category1 == null) {
            Category category = new Category();
            category.setCategoryId(req.getCategory());
            category.setName(req.getCategory()); // Set name same as ID
            category.setLevel(1);
            category1 = categoryRepository.save(category);

        }
        Category category2 = categoryRepository.findByCategoryId((req.getCategory2()));
        if (category2 == null) {
            Category category = new Category();
            category.setCategoryId(req.getCategory2());
            category.setName(req.getCategory2()); // Set name same as ID
            category.setLevel(2);
            category.setParentCategory(category1);
            category2 = categoryRepository.save(category);

        }
        Category category3 = categoryRepository.findByCategoryId((req.getCategory3()));
        if (category3 == null) {
            Category category = new Category();
            category.setCategoryId(req.getCategory3());
            category.setName(req.getCategory3()); // Set name same as ID
            category.setLevel(3);
            category.setParentCategory(category2);
            category3 = categoryRepository.save(category);

        }
        int discountPercentage = calculateDiscountPercentage(req.getMrpPrice(), req.getSellingPrice());
        Product product = new Product();
        product.setSeller(seller);
        product.setCategory(category3);
        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setMrpPrice(req.getMrpPrice());
        product.setSellingPrice(req.getSellingPrice());
        product.setColor(req.getColor());
        product.setImages(req.getImages());
        product.setCreatedAt(LocalDate.from(LocalDateTime.now()));
        product.setSizes(req.getSize());
        product.setDiscountPercentage(discountPercentage);
        product = productRepository.save(product);

        return product;
    }

    private int calculateDiscountPercentage(int mrpPrice, int sellingPrice) {
        if (mrpPrice <= 0) {
            throw new IllegalArgumentException("MRP price must be greater than zero");
        }
        double discount = mrpPrice - sellingPrice;
        double discountPercentage = (discount / mrpPrice) * 100;
        return (int) discountPercentage;
    }

    @Override
    public void deleteProduct(Long productId) throws ProductException {
        Product product = findProductById(productId);
        productRepository.delete(product);

    }

    @Override
    public Product updateProduct(Long productId, Product product) throws ProductException {
        findProductById(productId);
        product.setId(productId);
        return productRepository.save(product);
    }

    @Override
    public Product findProductById(Long productId) throws ProductException {
        return productRepository.findById(productId).orElseThrow(() -> new ProductException("Product not found"));
    }

    @Override
    public List<Product> searchProducts(String query) {

        return productRepository.searchProduct(query);
    }

    @Override
    public Page<Product> getAllProducts(String category, String brand, String colors, String sizes, Integer minPrice,
            Integer maxPrice, Integer minDiscount, String sort, String stock, Integer pageNumber, Integer pageSize) {
        Specification<Product> spec = ((root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (category != null) {
                Join<Object, Object> categoryJoin = root.join("category");
                predicates.add(criteriaBuilder.equal(categoryJoin.get("categoryId"), category));
            }
            if (colors != null) {
                predicates.add(criteriaBuilder.equal(root.get("color"), colors));
            }
            if (sizes != null) {
                predicates.add(criteriaBuilder.like(root.get("sizes"), "%" + sizes + "%"));
            }
            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
            }
            if (minDiscount != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("discountPercentage"), minDiscount));
            }
            if (sizes != null) {
                predicates.add(criteriaBuilder.like(root.get("sizes"), "%" + sizes + "%"));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
        Pageable pageable;
        if (sort != null && !sort.isEmpty()) {
            pageable = switch (sort) {
                case "price_low" ->
                    PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.by("sellingPrice").ascending());
                case "price_high" ->
                    PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.by("sellingPrice").descending());
                default -> PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.unsorted());
            };
        } else {
            pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.unsorted());
        }
        return productRepository.findAll(spec, pageable);
    }

    @Override
    public List<Product> getProductsBySellerId(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    @Override
    public ProductStatsDTO getProductStatsBySellerId(Long sellerId) {
        Long totalProducts = productRepository.countBySellerId(sellerId);
        Double totalStockValue = productRepository.sumStockValueBySellerId(sellerId);
        Long lowStockCount = productRepository.countBySellerIdAndQuantityLessThan(sellerId, 10);
        Long outOfStockCount = productRepository.countBySellerIdAndQuantity(sellerId, 0);

        return new ProductStatsDTO(totalProducts, totalStockValue, lowStockCount, outOfStockCount);
    }
}
