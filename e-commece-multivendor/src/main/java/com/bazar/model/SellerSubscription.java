package com.bazar.model;

import com.bazar.domain.PlanType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SellerSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    @JoinColumn(name = "seller_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Seller seller;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private SubscriptionPlan plan;

    private LocalDate startDate;
    private LocalDate endDate;

    private String stripeSubscriptionId;

    @Enumerated(EnumType.STRING)
    private PlanType planType; // Redundant but useful for quick access

    private boolean isAutoRenewal;

    public boolean isActive() {
        return endDate != null && endDate.isAfter(LocalDate.now());
    }
}
