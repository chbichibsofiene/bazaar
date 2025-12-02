-- SQL Script to Create Admin User
-- Run this in your MySQL database (bazaar_db)

-- First, you need to create a BCrypt hash for your password
-- You can use an online BCrypt generator or the backend to generate it
-- For password "admin123", the BCrypt hash is:
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCy

-- Insert admin user
INSERT INTO user (email, full_name, mobile, password, role)
VALUES (
    'admin@bazaar.com',
    'Admin User',
    '1234567890',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCy',  -- password: admin123
    'ROLE_ADMIN'
);

-- Verify the admin user was created
SELECT id, email, full_name, role FROM user WHERE role = 'ROLE_ADMIN';
