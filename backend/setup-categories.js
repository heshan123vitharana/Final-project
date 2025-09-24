const mysql = require('mysql2/promise');
require('dotenv').config();

async function createCategoriesTable() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paddy_management',
      connectionLimit: 10,
    });

    console.log('🔧 Creating gallery categories table...');
    
    // Create gallery_categories table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS gallery_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        image_url VARCHAR(500),
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Gallery categories table created');

    // Insert default categories
    const defaultCategories = [
      { name: 'General', slug: 'general', description: 'General gallery images' },
      { name: 'Products', slug: 'products', description: 'Product images' },
      { name: 'Services', slug: 'services', description: 'Service related images' },
      { name: 'Events', slug: 'events', description: 'Event photos' },
      { name: 'Team', slug: 'team', description: 'Team member photos' }
    ];

    for (let i = 0; i < defaultCategories.length; i++) {
      const category = defaultCategories[i];
      try {
        await pool.execute(`
          INSERT INTO gallery_categories (name, slug, description, sort_order)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE description = VALUES(description)
        `, [category.name, category.slug, category.description, i + 1]);
        console.log(`✅ Added category: ${category.name}`);
      } catch (error) {
        if (!error.message.includes('Duplicate entry')) {
          console.error(`Error adding category ${category.name}:`, error.message);
        }
      }
    }

    // Update gallery_images table to use category_id instead of category string
    try {
      await pool.execute(`
        ALTER TABLE gallery_images 
        ADD COLUMN category_id INT,
        ADD FOREIGN KEY (category_id) REFERENCES gallery_categories(id)
      `);
      console.log('✅ Added category_id column to gallery_images');
    } catch (error) {
      if (!error.message.includes('Duplicate column') && !error.message.includes('already exists')) {
        console.error('Error adding category_id column:', error.message);
      } else {
        console.log('ℹ️ category_id column already exists');
      }
    }

    // Update existing records to use category_id
    const [generalCategory] = await pool.execute(`
      SELECT id FROM gallery_categories WHERE slug = 'general' LIMIT 1
    `);
    
    if (generalCategory.length > 0) {
      await pool.execute(`
        UPDATE gallery_images 
        SET category_id = ? 
        WHERE category_id IS NULL
      `, [generalCategory[0].id]);
      console.log('✅ Updated existing images to use General category');
    }

    // Check final structure
    const [categoryRows] = await pool.execute('SELECT * FROM gallery_categories ORDER BY sort_order');
    console.log('\nCreated categories:');
    console.table(categoryRows);

    await pool.end();
    console.log('✅ Categories setup complete');
    
  } catch (error) {
    console.error('❌ Error setting up categories:', error);
  }
}

createCategoriesTable();
