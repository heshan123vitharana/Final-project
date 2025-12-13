// frontend/src/services/api.js
import toast from 'react-hot-toast';

// Define the base URL for the API.
// In a real application, this should come from an environment variable.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api';

/**
 * A helper function to handle fetch requests and responses.
 * @param {string} url - The URL to fetch.
 * @param {object} options - The options for the fetch request.
 * @returns {Promise<any>} - The JSON response from the API.
 */
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);

    // If the response is not OK, parse the error message and throw an error.
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    // If the response is successful, parse and return the JSON data.
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    // Re-throw the error so it can be caught by the calling function.
    throw error;
  }
};

// --- Image Gallery API ---

export const fetchImages = (categoryId = '') => {
  const url = categoryId ? `/gallery?category_id=${categoryId}` : '/gallery';
  return apiRequest(url).then(data => data.data || []);
};

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', file.name || 'Untitled Image');
  return apiRequest('/gallery', { method: 'POST', body: formData });
};

export const updateImage = (id, imageData) => {
  return apiRequest(`/gallery/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(imageData),
  });
};

export const deleteImage = (id) => {
  return apiRequest(`/gallery/${id}`, { method: 'DELETE' });
};

// --- Category API ---

export const fetchActiveCategories = () => {
  return apiRequest('/categories?active=true').then(data => data.data || []);
};

export const fetchCategoriesWithCounts = () => {
  return apiRequest('/categories/with-counts').then(data => data.data || []);
};

export const submitCategory = (formData, editingCategory) => {
  const method = editingCategory ? 'PUT' : 'POST';
  const url = editingCategory ? `/categories/${editingCategory.id}` : '/categories';
  return apiRequest(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
};

export const deleteCategory = (id) => {
  return apiRequest(`/categories/${id}`, { method: 'DELETE' });
};

// --- Services & Excellence API ---

export const fetchServices = () => {
  return apiRequest('/services-excellence').then(data => data.data || []);
};

export const submitService = (formData, editingService) => {
  const submitData = {
    ...formData,
    features: formData.features.filter(feature => feature.trim() !== ''),
  };

  const method = editingService ? 'PUT' : 'POST';
  const url = editingService ? `/services-excellence/${editingService.id}` : '/services-excellence';

  return apiRequest(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submitData),
  });
};

export const deleteService = (id, sourceTable) => {
  const url = `/services-excellence/${id}?source_table=${sourceTable || 'services'}`;
  return apiRequest(url, { method: 'DELETE' });
};

// --- Leadership API ---

export const fetchLeadership = () => {
  // Add a cache-busting parameter to ensure fresh data
  return apiRequest(`/leadership?_t=${Date.now()}`).then(data => data.data || []);
};

export const reorderLeadership = () => {
  return apiRequest('/leadership/reorder', { method: 'POST' });
};

export const deleteLeadership = (id) => {
  return apiRequest(`/leadership/${id}`, { method: 'DELETE' });
};

export const submitLeadership = (formDataValues, editingLeader, existingLeaders) => {
  const { name, position, bio, twitter, linkedin, email, order_position, is_active, image } = formDataValues;

  if (!name || !position) {
    return Promise.reject(new Error('Name and position are required'));
  }

  const orderPositionValue = parseInt(order_position, 10);
  const normalizedOrderPosition = isNaN(orderPositionValue) || orderPositionValue < 1 ? 1 : orderPositionValue;

  const orderTaken = existingLeaders.some(
    leader => leader.order_index === normalizedOrderPosition && leader.id !== editingLeader?.id
  );

  if (orderTaken) {
    return Promise.reject(new Error(`Order position ${normalizedOrderPosition} is already taken.`));
  }

  const formData = new FormData();
  formData.append('name', name.trim());
  formData.append('position', position.trim());
  formData.append('bio', (bio || '').trim());
  formData.append('twitter', (twitter || '').trim());
  formData.append('linkedin', (linkedin || '').trim());
  formData.append('email', (email || '').trim());
  formData.append('order_position', normalizedOrderPosition.toString());
  formData.append('is_active', is_active ? '1' : '0');

  if (image instanceof File) {
    formData.append('image', image);
  }

  const method = editingLeader ? 'PUT' : 'POST';
  const url = editingLeader ? `/leadership/${editingLeader.id}` : '/leadership';

  return apiRequest(url, { method, body: formData });
};
