-- Create database for Success Life Coaching Academy
CREATE DATABASE IF NOT EXISTS successlife_coaching_academy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user if it doesn't exist
CREATE USER IF NOT EXISTS 'successlife_coaching'@'localhost' IDENTIFIED BY 'successlifecoaching@2026';

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON successlife_coaching_academy.* TO 'successlife_coaching'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Verify database was created
SHOW DATABASES LIKE 'successlife_coaching_academy';

-- Verify user permissions
SHOW GRANTS FOR 'successlife_coaching'@'localhost';
