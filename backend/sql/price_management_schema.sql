-- Enhanced price management schema
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
    INDEX idx_status_date (status, effective_date),
    FOREIGN KEY (district_name) REFERENCES sri_lanka_districts(name) ON UPDATE CASCADE,
    FOREIGN KEY (created_by) REFERENCES admin(id) ON DELETE SET NULL
);

-- Sample data for testing
INSERT INTO district_paddy_prices 
(district_name, paddy_type, paddy_condition, price_per_kg, effective_date) VALUES
('Hambantota', 'Nadu - White', 'Dry', 85.00, CURDATE()),
('Hambantota', 'Nadu - White', 'Wet', 75.00, CURDATE()),
('Hambantota', 'Kiri Samba', 'Dry', 95.00, CURDATE()),
('Hambantota', 'Kiri Samba', 'Wet', 85.00, CURDATE()),
('Colombo', 'Nadu - White', 'Dry', 90.00, CURDATE()),
('Colombo', 'Nadu - White', 'Wet', 80.00, CURDATE()),
('Kandy', 'Samba', 'Dry', 100.00, CURDATE()),
('Kandy', 'Samba', 'Wet', 90.00, CURDATE());