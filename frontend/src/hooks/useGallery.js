import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

// Custom hook for gallery data management
export const useGallery = (options = {}) => {
  const {
    category = null,
    status = 'active',
    featured = null,
    limit = null,
    autoRefresh = false,
    refreshInterval = 30000 // 30 seconds
  } = options;

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byCategory: {}
  });

  // Fetch gallery images
  const fetchImages = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (status) params.append('status', status);
      if (featured !== null) params.append('featured', featured);

      const response = await fetch(`${API_BASE_URL}/gallery?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch images');
      }

      let filteredImages = data.data || [];

      // Apply client-side limit if specified
      if (limit && limit > 0) {
        filteredImages = filteredImages.slice(0, limit);
      }

      setImages(filteredImages);

      // Update stats
      const allImages = data.data || [];
      const uniqueCategories = [...new Set(allImages.map(img => img.category).filter(Boolean))];
      const categoryStats = {};

      uniqueCategories.forEach(cat => {
        categoryStats[cat] = allImages.filter(img => img.category === cat).length;
      });

      setStats({
        total: allImages.length,
        active: allImages.filter(img => img.is_active !== 0).length,
        inactive: allImages.filter(img => img.is_active === 0).length,
        byCategory: categoryStats
      });

      setCategories(uniqueCategories);

    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError(err.message);
      setImages([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [category, status, featured, limit]);

  // Get images by category with fallback to placeholder
  const getImagesByCategory = useCallback((targetCategory, count = 8) => {
    const categoryImages = images.filter(img =>
      img.category === targetCategory && img.is_active !== 0
    );

    // If we don't have enough images in this category, fill with other active images
    if (categoryImages.length < count) {
      const otherImages = images.filter(img =>
        img.category !== targetCategory && img.is_active !== 0
      );
      return [...categoryImages, ...otherImages].slice(0, count);
    }

    return categoryImages.slice(0, count);
  }, [images]);

  // Get featured images (could be used for "Our Latest Creations")
  const getFeaturedImages = useCallback((count = 8) => {
    // Priority: featured images first, then most recent active images
    const featuredImages = images.filter(img =>
      img.is_featured === 1 && img.is_active !== 0
    );

    if (featuredImages.length >= count) {
      return featuredImages.slice(0, count);
    }

    // Fill remaining with most recent active images
    const recentImages = images
      .filter(img => img.is_active !== 0 && img.is_featured !== 1)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return [...featuredImages, ...recentImages].slice(0, count);
  }, [images]);

  // Get images ensuring all categories are represented
  const getRepresentativeImages = useCallback((count = 8) => {
    const predefinedCategories = [
      'Mill Operations',
      'Rice Production',
      'Quality Control',
      'Storage Facilities',
      'Equipment',
      'Events',
      'Awards',
      'General'
    ];

    let representativeImages = [];
    const usedImageIds = new Set();

    // First, try to get one image from each category
    predefinedCategories.forEach(category => {
      const categoryImage = images.find(img =>
        img.category === category &&
        img.is_active !== 0 &&
        !usedImageIds.has(img.id)
      );

      if (categoryImage && representativeImages.length < count) {
        representativeImages.push(categoryImage);
        usedImageIds.add(categoryImage.id);
      }
    });

    // Fill remaining slots with most recent active images
    if (representativeImages.length < count) {
      const remainingImages = images
        .filter(img => img.is_active !== 0 && !usedImageIds.has(img.id))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const needed = count - representativeImages.length;
      representativeImages.push(...remainingImages.slice(0, needed));
    }

    return representativeImages;
  }, [images]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchImages(false); // Don't show loading spinner on refresh
  }, [fetchImages]);

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    fetchImages();

    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        refresh();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchImages, autoRefresh, refreshInterval, refresh]);

  return {
    images,
    loading,
    error,
    categories,
    stats,
    fetchImages,
    refresh,
    getImagesByCategory,
    getFeaturedImages,
    getRepresentativeImages
  };
};

// Optimized hook specifically for "Our Latest Creations" section
export const useLatestCreations = (count = 8) => {
  const {
    loading,
    error,
    getRepresentativeImages,
    refresh
  } = useGallery({
    status: 'active',
    autoRefresh: true,
    refreshInterval: 60000 // 1 minute refresh for latest creations
  });

  const latestCreations = getRepresentativeImages(count);

  return {
    images: latestCreations,
    loading,
    error,
    refresh,
    hasImages: latestCreations.length > 0
  };
};
