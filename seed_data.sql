-- Insert Admin User
INSERT INTO user (id, email, full_name, mobile, password, role)
VALUES (
    1,
    'admin@bazaar.com',
    'Admin User',
    '1234567890',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCy', -- admin123
    0 -- ROLE_ADMIN
);

-- Insert Seller
INSERT INTO seller (id, email, password, seller_name, mobile, role, account_status, is_email_verified)
VALUES (
    1,
    'seller@bazaar.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCy', -- admin123
    'Test Seller',
    '9876543210',
    2, -- ROLE_SELLER
    1, -- ACTIVE
    1  -- true
);
