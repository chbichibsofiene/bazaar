package com.bazar.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopSellingProductDTO {
    private Long productId;
    private String productName;
    private String productImage;
    private Long totalSales;
    private Long revenue;
    private Integer orderCount;
}
