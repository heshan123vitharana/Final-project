-- Sample paddy price data for testing
INSERT INTO paddy_prices (
    district, province, market, variety, type, 
    price_per_kg, previous_price, currency, trend,
    price_change, availability, status, description,
    created_at, updated_at
) VALUES 
('Colombo', 'Western', 'Colombo Center', 'Red Rice', 'Local', 250.00, 245.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'Red Rice - Local variety from Colombo', NOW(), NOW()),
('Kandy', 'Central', 'Kandy Center', 'White Rice', 'Keeri Samba', 270.00, 265.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'White Rice - Premium Keeri Samba', NOW(), NOW()),
('Gampaha', 'Western', 'Gampaha Center', 'Red Rice', 'Nadu', 240.00, 242.00, 'LKR', 'falling', -2.00, 'Available', 'Active', 'Red Rice - Nadu variety', NOW(), NOW()),
('Matara', 'Southern', 'Matara Center', 'White Rice', 'Samba', 260.00, 255.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'White Rice - Samba variety', NOW(), NOW()),
('Anuradhapura', 'North Central', 'Anuradhapura Center', 'Red Rice', 'Local', 235.00, 235.00, 'LKR', 'stable', 0.00, 'Available', 'Active', 'Red Rice - Local variety from Anuradhapura', NOW(), NOW()),
('Kurunegala', 'North Western', 'Kurunegala Center', 'White Rice', 'Basmati', 290.00, 285.00, 'LKR', 'rising', 5.00, 'Limited', 'Active', 'White Rice - Premium Basmati', NOW(), NOW()),
('Ratnapura', 'Sabaragamuwa', 'Ratnapura Center', 'Red Rice', 'Pachchaperumal', 280.00, 275.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'Red Rice - Pachchaperumal variety', NOW(), NOW()),
('Badulla', 'Uva', 'Badulla Center', 'White Rice', 'Keeri Samba', 275.00, 270.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'White Rice - Premium Keeri Samba from Uva', NOW(), NOW());
