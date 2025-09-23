-- Add districts reference table for validation
CREATE TABLE IF NOT EXISTS sri_lanka_districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    province VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sri Lankan districts
INSERT INTO sri_lanka_districts (name, province) VALUES
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

-- Add foreign key constraint to users table (optional, for data integrity)
-- ALTER TABLE users ADD CONSTRAINT fk_mill_district 
-- FOREIGN KEY (mill_district) REFERENCES sri_lanka_districts(name);