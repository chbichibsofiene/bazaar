package com.bazar.model;

import com.bazar.domain.AccountStatus;
import com.bazar.domain.User_Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

public class Seller {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private Long id;
    private String sellerName;
    private String mobile;
    @Column(unique = true, nullable = false)
    private String email;
    private String password;
    @Embedded
    private BusinessDetails businessDetails = new BusinessDetails();
    @Embedded
    private BankDetails bankDetails = new BankDetails();
    @OneToOne(cascade = CascadeType.ALL)
    private Address pickupaddress = new Address();
    private String GSTIN;
    private User_Role role = User_Role.ROLE_SELLER;

    private boolean isEmailVerified = false;
    private AccountStatus accountStatus = AccountStatus.PENDING_VERIFICATION;

    @OneToOne(mappedBy = "seller", cascade = CascadeType.ALL)
    private SellerSubscription subscription;

}
