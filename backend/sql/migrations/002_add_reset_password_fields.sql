-- Add reset password fields to users table
ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE users ADD COLUMN reset_token_expires DATETIME DEFAULT NULL;

-- Add index for reset token lookups
CREATE INDEX idx_users_reset_token ON users(reset_token);