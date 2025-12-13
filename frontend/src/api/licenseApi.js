const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/license';

export const fetchLicenseApplications = async (signal) => {
  const response = await fetch(`${API_BASE_URL}/admin/applications`, { signal });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to load license applications');
  }
  const data = await response.json();
  console.log('📥 admin applications payload:', data);
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.applications)) {
    return data.applications;
  }
  return [];
};

export const updateLicenseStatus = async (applicationId, status, details) => {
  console.log(`🔄 Updating license ${applicationId} to ${status}`, details);
  
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, ...details }),
  });
  
  console.log(`📡 Response status: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Status update failed:', errorData);
    throw new Error(errorData.message || `Failed to update status to ${status}`);
  }
  
  const data = await response.json();
  console.log('✅ Status update successful:', data);
  return data;
};

export const fetchDocument = async (applicationId, documentType) => {
  const response = await fetch(`${API_BASE_URL}/document/${applicationId}/${documentType}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to load document');
  }
  const data = await response.json();
  console.log(`📥 admin document payload (${documentType}):`, data);
  return data;
};
