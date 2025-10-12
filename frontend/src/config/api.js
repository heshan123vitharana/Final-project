// Centralized API configuration
export const API_BASE_URL = 'http://localhost:5000';
export const API_ENDPOINTS = {
  admin: `${API_BASE_URL}/api/admin`,
  license: `${API_BASE_URL}/api/license`,
  licenses: `${API_BASE_URL}/api/licenses`,
  profile: `${API_BASE_URL}/api/profile`,
  prices: `${API_BASE_URL}/api/prices`,
  stock: `${API_BASE_URL}/api/stock`,
  gallery: `${API_BASE_URL}/api/gallery`,
};

export default API_BASE_URL;
