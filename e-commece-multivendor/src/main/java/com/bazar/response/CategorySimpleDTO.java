package com.bazar.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategorySimpleDTO {
    private Long id;
    private String name;
    private Integer level;
    private Long parentCategoryId;
}
