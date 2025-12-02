-- Clear seller test data
-- Run this script in your MySQL database tool

-- 1. Store address IDs to delete later (since we must delete seller first)
CREATE TEMPORARY TABLE IF NOT EXISTS temp_addresses AS
SELECT pickupaddress_id FROM seller WHERE email IN ('scsofien@gmail.com', 'ds.ls.fbi@gmail.com');

-- 2. Delete dependent tables
DELETE FROM seller_subscription WHERE seller_id IN (
    SELECT id FROM seller WHERE email IN ('scsofien@gmail.com', 'ds.ls.fbi@gmail.com')
);

DELETE FROM product WHERE seller_id IN (
    SELECT id FROM seller WHERE email IN ('scsofien@gmail.com', 'ds.ls.fbi@gmail.com')
);

DELETE FROM verification_code WHERE email IN ('scsofien@gmail.com', 'ds.ls.fbi@gmail.com');

-- 3. Delete the sellers (removes FK constraint on address)
DELETE FROM seller WHERE email IN ('scsofien@gmail.com', 'ds.ls.fbi@gmail.com');

-- 4. Delete the orphaned addresses
DELETE FROM address WHERE id IN (SELECT pickupaddress_id FROM temp_addresses);

-- 5. Clean up
DROP TEMPORARY TABLE IF EXISTS temp_addresses;

-- Verify deletion
SELECT COUNT(*) as remaining_sellers FROM seller WHERE email IN ('scsofien@gmail.com', 'ds.ls.fbi@gmail.com');
