// Category Controller for Gallery Management

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    console.log('📂 Fetching all categories...');
    
    let query = 'SELECT * FROM gallery_categories WHERE 1=1';
    let params = [];

    // Filter by active status if specified
    if (req.query.active !== undefined) {
      query += ' AND is_active = ?';
      params.push(req.query.active === 'true' ? 1 : 0);
    }

    query += ' ORDER BY sort_order ASC, name ASC';

    const [rows] = await req.db.execute(query, params);
    
    console.log(`Found ${rows.length} categories`);
    
    res.json({
      success: true,
      data: rows,
      total: rows.length
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📂 Fetching category ID: ${id}`);

    const [rows] = await req.db.execute(
      'SELECT * FROM gallery_categories WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
};

// Create new category
const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image_url, sort_order, is_active } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Generate slug if not provided
    const finalSlug = slug || name.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    console.log(`📂 Creating new category: ${name} (${finalSlug})`);

    const [result] = await req.db.execute(`
      INSERT INTO gallery_categories (
        name, slug, description, image_url, sort_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      name,
      finalSlug,
      description || null,
      image_url || null,
      sort_order || 0,
      is_active !== undefined ? (is_active === 'true' || is_active === true ? 1 : 0) : 1
    ]);

    // Fetch the created category
    const [newCategory] = await req.db.execute(
      'SELECT * FROM gallery_categories WHERE id = ?',
      [result.insertId]
    );

    console.log(`✅ Category created with ID: ${result.insertId}`);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory[0]
    });

  } catch (error) {
    console.error('Error creating category:', error);
    
    // Handle duplicate name/slug error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Category name or slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image_url, sort_order, is_active } = req.body;

    console.log(`📂 Updating category ID: ${id}`);

    // Check if category exists
    const [existingCategory] = await req.db.execute(
      'SELECT * FROM gallery_categories WHERE id = ?',
      [id]
    );

    if (existingCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Generate slug if provided name but no slug
    let finalSlug = slug;
    if (name && !slug) {
      finalSlug = name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const [result] = await req.db.execute(`
      UPDATE gallery_categories SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = ?,
        image_url = ?,
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name || null,
      finalSlug || null,
      description !== undefined ? description : existingCategory[0].description,
      image_url !== undefined ? image_url : existingCategory[0].image_url,
      sort_order !== undefined ? sort_order : null,
      is_active !== undefined ? (is_active === 'true' || is_active === true ? 1 : 0) : null,
      id
    ]);

    // Fetch updated category
    const [updatedCategory] = await req.db.execute(
      'SELECT * FROM gallery_categories WHERE id = ?',
      [id]
    );

    console.log(`✅ Category updated: ${updatedCategory[0].name}`);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory[0]
    });

  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Category name or slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`📂 Deleting category ID: ${id}`);

    // Check if category exists
    const [existingCategory] = await req.db.execute(
      'SELECT * FROM gallery_categories WHERE id = ?',
      [id]
    );

    if (existingCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has images
    const [imagesCount] = await req.db.execute(
      'SELECT COUNT(*) as count FROM gallery_images WHERE category_id = ?',
      [id]
    );

    if (imagesCount[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It contains ${imagesCount[0].count} images. Please reassign or delete the images first.`
      });
    }

    await req.db.execute('DELETE FROM gallery_categories WHERE id = ?', [id]);

    console.log(`✅ Category deleted: ${existingCategory[0].name}`);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};

// Get images by category
const getImagesByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📂 Fetching images for category ID: ${id}`);

    // Get category info
    const [category] = await req.db.execute(
      'SELECT * FROM gallery_categories WHERE id = ?',
      [id]
    );

    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get images for this category
    let query = `
      SELECT gi.*, gc.name as category_name, gc.slug as category_slug
      FROM gallery_images gi
      LEFT JOIN gallery_categories gc ON gi.category_id = gc.id
      WHERE gi.category_id = ?
    `;
    let params = [id];

    // Filter by active status if specified
    if (req.query.active !== undefined) {
      query += ' AND gi.is_active = ?';
      params.push(req.query.active === 'true' ? 1 : 0);
    }

    query += ' ORDER BY gi.created_at DESC';

    const [images] = await req.db.execute(query, params);

    console.log(`Found ${images.length} images in category: ${category[0].name}`);

    res.json({
      success: true,
      data: {
        category: category[0],
        images: images,
        total: images.length
      }
    });

  } catch (error) {
    console.error('Error fetching images by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch images for category',
      error: error.message
    });
  }
};

// Get categories with image counts
const getCategoriesWithCounts = async (req, res) => {
  try {
    console.log('📂 Fetching categories with image counts...');
    
    const query = `
      SELECT 
        gc.*,
        COUNT(gi.id) as image_count,
        COUNT(CASE WHEN gi.is_active = 1 THEN 1 END) as active_image_count
      FROM gallery_categories gc
      LEFT JOIN gallery_images gi ON gc.id = gi.category_id
      WHERE gc.is_active = 1
      GROUP BY gc.id
      ORDER BY gc.sort_order ASC, gc.name ASC
    `;

    const [rows] = await req.db.execute(query);

    console.log(`Found ${rows.length} categories with image counts`);

    res.json({
      success: true,
      data: rows,
      total: rows.length
    });

  } catch (error) {
    console.error('Error fetching categories with counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories with counts',
      error: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getImagesByCategory,
  getCategoriesWithCounts
};