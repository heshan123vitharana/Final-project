// frontend/src/components/DynamicPriceSelector.jsx
import React, { useState, useEffect } from 'react';

const DynamicPriceSelector = ({ 
  millDistrict, 
  paddyType, 
  paddyCondition, 
  onPriceSelect, 
  selectedPriceId,
  className = "" 
}) => {
  const [availablePrices, setAvailablePrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch prices when district, type, or condition changes
  useEffect(() => {
    if (!millDistrict || !paddyType || !paddyCondition) {
      setAvailablePrices([]);
      return;
    }

    fetchPrices();
  }, [millDistrict, paddyType, paddyCondition]);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        district: millDistrict,
        paddyType: paddyType,
        condition: paddyCondition
      });

      console.log('🔄 Fetching prices for:', { millDistrict, paddyType, paddyCondition });

      const response = await fetch(`http://localhost:5000/api/prices/by-district-type?${params}`);
      const result = await response.json();

      if (result.success) {
        setAvailablePrices(result.data);
        console.log(`✅ Found ${result.data.length} price options`);
        
        // Auto-select first price if only one option available
        if (result.data.length === 1 && onPriceSelect) {
          onPriceSelect(result.data[0]);
        }
      } else {
        setError(result.message || 'Failed to fetch prices');
        setAvailablePrices([]);
      }
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError('Network error while fetching prices');
      setAvailablePrices([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e) => {
    const priceId = parseInt(e.target.value);
    const selectedPrice = availablePrices.find(price => price.id === priceId);
    
    if (selectedPrice && onPriceSelect) {
      onPriceSelect(selectedPrice);
    }
  };

  if (!millDistrict || !paddyType || !paddyCondition) {
    return (
      <div className="text-gray-500 text-sm p-3 bg-gray-50 rounded border">
        Please select mill district, paddy type, and condition first to see available prices.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-3 bg-blue-50 rounded border">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-blue-700">Loading prices for {millDistrict}...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm p-3 bg-red-50 rounded border">
        <div className="font-medium">Error loading prices:</div>
        <div>{error}</div>
        <button 
          onClick={fetchPrices}
          className="mt-2 text-blue-600 hover:text-blue-800 underline text-xs"
        >
          Try again
        </button>
      </div>
    );
  }

  if (availablePrices.length === 0) {
    return (
      <div className="text-amber-600 text-sm p-3 bg-amber-50 rounded border">
        <div className="font-medium">No prices available</div>
        <div>
          No prices found for {paddyType} ({paddyCondition}) in {millDistrict} district.
        </div>
        <div className="text-xs mt-1 text-gray-600">
          Contact admin to add pricing for this combination.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <select
        value={selectedPriceId || ''}
        onChange={handlePriceChange}
        className={`w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500 ${className}`}
        required
      >
        <option value="">Select Price Option</option>
        {availablePrices.map((price) => (
          <option key={price.id} value={price.id}>
            Rs. {price.pricePerKg.toFixed(2)}/kg 
            {price.effectiveDate && ` (Effective: ${new Date(price.effectiveDate).toLocaleDateString()})`}
          </option>
        ))}
      </select>
      
      {availablePrices.length > 1 && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          💡 <strong>Tip:</strong> {availablePrices.length} price options available for {paddyType} ({paddyCondition}) in {millDistrict}.
          Prices range from Rs. {Math.min(...availablePrices.map(p => p.pricePerKg)).toFixed(2)} to Rs. {Math.max(...availablePrices.map(p => p.pricePerKg)).toFixed(2)} per kg.
        </div>
      )}
    </div>
  );
};

export default DynamicPriceSelector;