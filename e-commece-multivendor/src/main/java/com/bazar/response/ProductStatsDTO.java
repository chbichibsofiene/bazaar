package com.bazar.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductStatsDTO {
    private Long totalProducts;
    private Double totalStockValue;
    private Long lowStockCount;
    private Long outOfStockCount;
}
