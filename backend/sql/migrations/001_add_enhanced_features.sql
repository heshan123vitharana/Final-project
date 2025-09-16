-- backend/sql/migrations/001_add_enhanced_features.sql
-- Migration script for all enhanced features

-- 1. Add password management fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_change_required BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_expires_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP NULL;

-- 2. Create districts reference table
CREATE TABLE IF NOT EXISTS sri_lanka_districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    province VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create district paddy prices table
CREATE TABLE IF NOT EXISTS district_paddy_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL,
    paddy_type ENUM('Nadu - White', 'Nadu - Red', 'Samba', 'Kiri Samba') NOT NULL,
    paddy_condition ENUM('Wet', 'Dry') NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL,
    effective_date DATE NOT NULL,
    created_by INT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_district_type (district_name, paddy_type),
    INDEX idx_status_date (status, effective_date)
);

-- 4. Add certificate fields to mill_licenses table
ALTER TABLE mill_licenses ADD COLUMN IF NOT EXISTS license_number VARCHAR(50) UNIQUE;
ALTER TABLE mill_licenses ADD COLUMN IF NOT EXISTS certificate_path VARCHAR(255);
ALTER TABLE mill_licenses ADD COLUMN IF NOT EXISTS certificate_generated_at TIMESTAMP NULL;

-- 5. Insert Sri Lankan districts data
INSERT IGNORE INTO sri_lanka_districts (name, province) VALUES
('Colombo', 'Western Province'),
('Gampaha', 'Western Province'),
('Kalutara', 'Western Province'),
('Kandy', 'Central Province'),
('Matale', 'Central Province'),
('Nuwara Eliya', 'Central Province'),
('Galle', 'Southern Province'),
('Matara', 'Southern Province'),
('Hambantota', 'Southern Province'),
('Jaffna', 'Northern Province'),
('Kilinochchi', 'Northern Province'),
('Mannar', 'Northern Province'),
('Mullaitivu', 'Northern Province'),
('Vavuniya', 'Northern Province'),
('Puttalam', 'North Western Province'),
('Kurunegala', 'North Western Province'),
('Anuradhapura', 'North Central Province'),
('Polonnaruwa', 'North Central Province'),
('Badulla', 'Uva Province'),
('Monaragala', 'Uva Province'),
('Ratnapura', 'Sabaragamuwa Province'),
('Kegalle', 'Sabaragamuwa Province'),
('Ampara', 'Eastern Province'),
('Batticaloa', 'Eastern Province'),
('Trincomalee', 'Eastern Province');

-- 6. Insert sample district paddy prices
INSERT IGNORE INTO district_paddy_prices 
(district_name, paddy_type, paddy_condition, price_per_kg, effective_date) VALUES
('Hambantota', 'Nadu - White', 'Dry', 85.00, CURDATE()),
('Hambantota', 'Nadu - White', 'Wet', 75.00, CURDATE()),
('Hambantota', 'Kiri Samba', 'Dry', 95.00, CURDATE()),
('Hambantota', 'Kiri Samba', 'Wet', 85.00, CURDATE()),
('Colombo', 'Nadu - White', 'Dry', 90.00, CURDATE()),
('Colombo', 'Nadu - White', 'Wet', 80.00, CURDATE()),
('Kandy', 'Samba', 'Dry', 100.00, CURDATE()),
('Kandy', 'Samba', 'Wet', 90.00, CURDATE()),
('Galle', 'Nadu - Red', 'Dry', 88.00, CURDATE()),
('Galle', 'Nadu - Red', 'Wet', 78.00, CURDATE()),
('Kurunegala', 'Kiri Samba', 'Dry', 92.00, CURDATE()),
('Kurunegala', 'Kiri Samba', 'Wet', 82.00, CURDATE());