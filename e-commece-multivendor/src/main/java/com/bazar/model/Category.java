package com.bazar.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(exclude = { "childCategories" })
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Column(unique = true)
    private String categoryId;

    @NotNull
    private String name;

    @Column(columnDefinition = "TEXT")
    private String image;

    @ManyToOne
    @JoinColumn(name = "parent_category_id")
    private Category parentCategory;

    @OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL)
    private List<Category> childCategories = new ArrayList<>();

    @NotNull
    private Integer level; // 1 = Parent, 2 = Child, 3 = Sub-category

    // Helper methods
    public boolean isParent() {
        return level != null && level == 1;
    }

    public boolean isChild() {
        return level != null && level == 2;
    }

    public boolean isSubCategory() {
        return level != null && level == 3;
    }

    public String getCategoryPath() {
        if (parentCategory == null) {
            return name;
        }
        return parentCategory.getCategoryPath() + " > " + name;
    }

    public boolean hasChildren() {
        return childCategories != null && !childCategories.isEmpty();
    }
}
