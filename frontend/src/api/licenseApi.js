const API_BASE_URL = 'http://localhost:5000/api/license';

export const fetchLicenseApplications = async (signal) => {
  const response = await fetch(`${API_BASE_URL}/admin/applications`, { signal });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to load license applications');
  }
  return response.json();
};

export const updateLicenseStatus = async (applicationId, status, details) => {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, ...details }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update status to ${status}`);
  }
  return response.json();
};

export const fetchDocument = async (applicationId, documentType) => {
  const response = await fetch(`${API_BASE_URL}/document/${applicationId}/${documentType}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to load document');
  }
  return response.json();
};
