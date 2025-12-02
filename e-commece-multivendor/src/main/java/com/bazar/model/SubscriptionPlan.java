package com.bazar.model;

import com.bazar.domain.PlanType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscriptionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.STRING)
    private PlanType planType;

    private String name;
    private long price; // In cents if using Stripe, or just standard currency unit
    private Integer maxProducts; // Null for unlimited

    // Helper to check if unlimited
    public boolean isUnlimited() {
        return maxProducts == null;
    }
}
