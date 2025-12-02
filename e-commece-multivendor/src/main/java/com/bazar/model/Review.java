package com.bazar.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private Long id;
    @Column(nullable = false)
    private String reviewText;
    @Column(nullable = false)
    private double rating;
    @ElementCollection
    @Column(length = 1000000)
    private List<String> productImages;
    @JsonIgnore
    @ManyToOne
    private Product product;
    @ManyToOne
    private User user;
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
