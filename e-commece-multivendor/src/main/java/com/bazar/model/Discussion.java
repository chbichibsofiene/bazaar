package com.bazar.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Discussion {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String content;

    @ManyToOne
    private User user;

    @JsonIgnore
    @ManyToOne
    private Product product;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
