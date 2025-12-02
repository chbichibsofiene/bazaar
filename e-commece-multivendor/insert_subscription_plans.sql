-- Insert default subscription plans
INSERT INTO subscription_plan (id, plan_type, name, price, max_products) VALUES
(1, 'FREE', 'Free Plan', 0, 2),
(2, 'BEGINNER', 'Beginner Plan', 1000, 10),
(3, 'INTERMEDIATE', 'Intermediate Plan', 5000, 100),
(4, 'PRO', 'Pro Plan', 10000, 1000);

-- Update the sequence if needed (for MySQL/MariaDB)
-- ALTER TABLE subscription_plan AUTO_INCREMENT = 5;
