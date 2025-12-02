package com.bazar.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryTreeDTO {
    private Long id;
    private String categoryId;
    private String name;
    private String image;
    private Integer level;
    private String categoryPath;
    private List<CategoryTreeDTO> children = new ArrayList<>();
}
