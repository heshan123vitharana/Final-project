// frontend/src/components/DistrictSelector.jsx
import React, { useState, useEffect } from 'react';

const DistrictSelector = ({ value, onChange, name = "mill_district", required = false, className = "" }) => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/profile/districts');
        const result = await response.json();
        
        if (result.success) {
          setDistricts(result.districts);
        } else {
          setError('Failed to load districts');
        }
      } catch (err) {
        console.error('Error fetching districts:', err);
        setError('Network error while loading districts');
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
        <span className="ml-2 text-sm text-gray-600">Loading districts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
        {error}
      </div>
    );
  }

  return (
    <select
      name={name}
      value={value || ''}
      onChange={onChange}
      required={required}
      className={`w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500 ${className}`}
    >
      <option value="">Select Mill District</option>
      {districts.map((district) => (
        <option key={district.name} value={district.name}>
          {district.name} ({district.province})
        </option>
      ))}
    </select>
  );
};

export default DistrictSelector;
