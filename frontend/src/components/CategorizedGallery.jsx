import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';

const CategorizedGallery = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Fetch categories with image counts
  const fetchCategoryImages = useCallback(async (categoryId) => {
    if (!categoryId) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}/images?active=true`);
      if (response.ok) {
        const data = await response.json();
        setImages(data.data.images || []);
      }
    } catch (error) {
      console.error('Error fetching category images:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories/with-counts?active=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
        
        // Auto-select first category with images
        const categoryWithImages = data.data.find(cat => cat.active_image_count > 0);
        if (categoryWithImages) {
          setSelectedCategory(categoryWithImages);
          fetchCategoryImages(categoryWithImages.id);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [fetchCategoryImages]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setExpandedCategory(null);
    fetchCategoryImages(category.id);
  };

  // Handle expand/collapse for mobile
  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Gallery</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of images organized by categories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
              
              {/* Mobile Category Dropdown */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => toggleCategoryExpand('mobile')}
                  className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                >
                  <span className="font-medium">
                    {selectedCategory ? selectedCategory.name : 'Select Category'}
                  </span>
                  {expandedCategory === 'mobile' ? 
                    <ChevronUp className="w-5 h-5" /> : 
                    <ChevronDown className="w-5 h-5" />
                  }
                </button>
                
                {expandedCategory === 'mobile' && (
                  <div className="mt-2 bg-white border rounded-lg shadow-lg">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => {
                          handleCategorySelect(category);
                          toggleCategoryExpand(null);
                        }}
                        className={`w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 ${
                          selectedCategory?.id === category.id ? 'bg-blue-50 text-blue-600' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-gray-500">
                            {category.active_image_count}
                          </span>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Category List */}
              <div className="hidden lg:block space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory?.id === category.id
                        ? 'bg-blue-100 text-blue-600 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-gray-500">
                        {category.active_image_count}
                      </span>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-500">{category.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Images Grid */}
          <div className="lg:col-span-3">
            {selectedCategory && (
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedCategory.name}
                </h3>
                {selectedCategory.description && (
                  <p className="text-gray-600">{selectedCategory.description}</p>
                )}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map(image => (
                  <div
                    key={image.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                      <img
                        src={image.image_url || '/api/placeholder/400/300'}
                        alt={image.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/400/300';
                          e.target.alt = 'Image not available';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {image.title}
                      </h4>
                      {image.description && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {image.description}
                        </p>
                      )}
                      <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                        <span>
                          {new Date(image.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <ImageIcon className="w-4 h-4 mr-1" />
                          {image.category_name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedCategory ? (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No images found</h3>
                <p className="text-gray-600">
                  There are no active images in the "{selectedCategory.name}" category yet.
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Select a category</h3>
                <p className="text-gray-600">
                  Choose a category from the left to view images.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorizedGallery;