-- Create user profile photos table with all required columns
CREATE TABLE IF NOT EXISTS user_profile_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    photo_data LONGTEXT NOT NULL, -- Base64 encoded image data
    filename VARCHAR(255),
    file_size INT,
    mime_type VARCHAR(50),
    file_type VARCHAR(10) DEFAULT 'png',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_default BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_photo (user_id)
);