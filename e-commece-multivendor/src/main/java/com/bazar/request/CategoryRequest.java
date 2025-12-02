package com.bazar.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotNull(message = "Category name is required")
    private String name;

    private String image;

    @NotNull(message = "Level is required")
    @Min(value = 1, message = "Level must be between 1 and 3")
    @Max(value = 3, message = "Level must be between 1 and 3")
    private Integer level;

    private Long parentCategoryId;
}
