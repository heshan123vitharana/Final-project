-- Add mill_district column to users table
ALTER TABLE users ADD COLUMN mill_district VARCHAR(100) DEFAULT NULL AFTER mill_location;

-- Update existing users with mill_district = district if needed (optional)
-- UPDATE users SET mill_district = district WHERE mill_district IS NULL;