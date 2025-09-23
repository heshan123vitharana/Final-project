import { useState, useEffect, useMemo, useCallback } from "react";

// Dropdown options for paddy types and states
const paddyTypes = ["Nadu - White", "Nadu - Red", "Samba", "Kiri Samba"];
const paddyStates = ["Wet", "Dry"];

const MillUpdateStock = ({ userData }) => {
  // Get effective user data with fallback to session storage
  const effectiveUserData = useMemo(() => {
    if (userData) return userData;
    
    try {
      const sessionData = sessionStorage.getItem('millOwnerData');
      if (sessionData) {
        return JSON.parse(sessionData);
      }
    } catch (error) {
      console.error("Error parsing session data:", error);
    }
    
    return null;
  }, [userData]);

  // State for form fields
  const [formData, setFormData] = useState({
    farmer_id: "",
    farmer_name: "",
    quantity: "",
    paddy_type: "",
    paddy_condition: "",
    entry_date: new Date().toISOString().split("T")[0],
    notes: "",
    price_per_kg: "", // Add price field to form data
    manual_price: "", // Manual price input when no prices available
  });

  // State for calculated unit price
  const [unitPrice, setUnitPrice] = useState(0);
  // State for available prices based on user's mill district
  const [availablePrices, setAvailablePrices] = useState([]);
  // State for loading prices
  const [loadingPrices, setLoadingPrices] = useState(false);
  // State for current user data
  const [currentUser, setCurrentUser] = useState(null);
  // State for showing confirmation popup
  const [showPopup, setShowPopup] = useState(false);
  // State for notification message
  const [notification, setNotification] = useState("");
  // State for loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user data from session with fallback - now using effectiveUserData
  const getCurrentUserData = useCallback(() => {
    try {
      // Use effectiveUserData as primary source
      if (effectiveUserData) {
        return effectiveUserData;
      }

      // Fallback to session storage parsing
      let user = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');

      // If millOwnerData doesn't have mill_district, try userData from props
      if (!user.mill_district && userData?.mill_district) {
        user = { ...user, ...userData };
      }

      return user;
    } catch (error) {
      console.error('Error getting current user data:', error);
      return effectiveUserData || {};
    }
  }, [effectiveUserData, userData]);

  // Fetch prices from API based on filters
  const fetchPrices = async (district, variety = null, type = null) => {
    try {
      setLoadingPrices(true);

      let url = `http://localhost:5000/api/prices?status=Active&sortBy=updated_at&sortOrder=DESC`;

      if (district && district !== 'All Districts') {
        url += `&district=${encodeURIComponent(district)}`;
      }
      if (variety && variety !== 'All Varieties') {
        url += `&variety=${encodeURIComponent(variety)}`;
      }
      if (type && type !== 'All Types') {
        url += `&type=${encodeURIComponent(type)}`;
      }


      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setAvailablePrices(result.data);
      } else {
        console.error('Price fetch failed:', result.message);
        setAvailablePrices([]);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      setAvailablePrices([]);
    } finally {
      setLoadingPrices(false);
    }
  };

  // Set page title and load user data on mount
  useEffect(() => {
    document.title = "Dashboard | Update Stock";

    // Get current user data with comprehensive logging
    const user = getCurrentUserData();
    setCurrentUser(user);

    // Fetch initial prices for user's mill district
    if (user?.mill_district) {
      fetchPrices(user.mill_district);
    }
  }, [userData, getCurrentUserData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // When price is selected, update unit price
    if (name === 'price_per_kg') {
      const selectedPrice = availablePrices.find(price => price.id === parseInt(value));
      if (selectedPrice) {
        setUnitPrice(selectedPrice.pricePerKg);
        // Clear manual price when dropdown price is selected
        setFormData(prev => ({ ...prev, [name]: value, manual_price: "" }));
        return;
      } else {
        setUnitPrice(0);
      }
    }

    // When manual price is entered, update unit price
    if (name === 'manual_price') {
      const price = parseFloat(value);
      if (!isNaN(price) && price > 0) {
        setUnitPrice(price);
        // Clear dropdown selection when manual price is entered
        setFormData(prev => ({ ...prev, [name]: value, price_per_kg: "" }));
        return;
      } else {
        setUnitPrice(0);
      }
    }
  };

  // Re-fetch prices when paddy type or condition changes
  useEffect(() => {
    if (currentUser?.mill_district && (formData.paddy_type || formData.paddy_condition)) {
      // Refetching prices for current user mill district and form data

      // Create mapping for variety names
      const varietyMapping = {
        'Nadu - White': 'Nadu',
        'Nadu - Red': 'Red Nadu',
        'Samba': 'Samba',
        'Kiri Samba': 'Keeri Samba'
      };

      const mappedVariety = varietyMapping[formData.paddy_type] || formData.paddy_type;
      fetchPrices(currentUser.mill_district, mappedVariety, formData.paddy_condition);
    } else if (!currentUser?.mill_district) {
      // Cannot fetch prices - no mill district available
    }
  }, [formData.paddy_type, formData.paddy_condition, currentUser?.mill_district]);

  // Calculate total amount
  const totalAmount =
    formData.quantity && unitPrice ? parseFloat(formData.quantity) * unitPrice : 0;

  // Handle form submit (show confirmation popup)
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  // Handle confirmation of stock entry
  const handleConfirm = async () => {
    setShowPopup(false);
    setIsSubmitting(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      // Try multiple sources for the token
      let token = userData?.token;

      // If no token in userData, try sessionStorage
      if (!token) {
        const millOwnerData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
        token = millOwnerData.token;
      }

      // If still no token, try authToken or other common keys
      if (!token) {
        token = sessionStorage.getItem('authToken') || sessionStorage.getItem('token');
      }

      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const stockData = {
        farmer_id: formData.farmer_id,
        farmer_name: formData.farmer_name,
        paddy_type: formData.paddy_type,
        paddy_condition: formData.paddy_condition,
        quantity: parseFloat(formData.quantity),
        entry_date: formData.entry_date,
        price_per_kg: unitPrice,
        notes: formData.notes
      };

      const response = await fetch('http://localhost:5000/api/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(stockData)
      });

      const result = await response.json();

      if (response.ok) {
        setNotification("✅ Stock data successfully added!");

        // Reset form
        setFormData({
          farmer_id: "",
          farmer_name: "",
          quantity: "",
          paddy_type: "",
          paddy_condition: "",
          entry_date: new Date().toISOString().split("T")[0],
          notes: "",
          price_per_kg: "",
          manual_price: "",
        });
        setUnitPrice(0);
        setAvailablePrices([]);
      } else {
        // Handle specific error messages
        if (result.errors && Array.isArray(result.errors)) {
          setNotification(`❌ Validation Error: ${result.errors.join(', ')}`);
        } else if (result.message) {
          setNotification(`❌ ${result.message}`);
        } else {
          setNotification('❌ Failed to add stock data');
        }
        console.error('Stock addition error:', result);
      }
    } catch (error) {
      console.error('Stock addition error:', error);
      if (error.message.includes('Authentication token')) {
        setNotification("❌ Please log in again to add stock data.");
      } else {
        setNotification("❌ Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      // Hide notification after 4 seconds
      setTimeout(() => setNotification(""), 4000);
    }
  };

  // Handle cancel in popup
  const handleCancel = () => setShowPopup(false);

  // Show loading state if no user data available
  if (!effectiveUserData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          color: '#92400e',
          padding: '16px',
          borderRadius: '8px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Loading Update Stock...</h2>
          <p>Please wait while we load the stock update page.</p>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>
            If this persists, please <a href="/" style={{ color: '#0066cc' }}>return to home</a> and log in again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Notification message */}
      {notification && (
        <div
          className={`fixed top-2 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-md z-50 ${
            notification.includes("❌") ? "bg-red-600 text-white" : "bg-green-600 text-white"
          }`}
        >
          {notification}
        </div>
      )}

      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-6 text-green-700 border-b-4 border-green-300 pb-2">
        🌾 Update Paddy Stock
      </h1>
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm font-medium">
          📍 <strong>Note:</strong> Paddy prices are automatically calculated based on your mill district location for accurate regional pricing.
        </p>
      </div>

      {/* Stock update form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md border border-green-200 max-w-3xl mx-auto"
      >
        {/* Farmer ID input */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Farmer ID</label>
          <input
            type="text"
            name="farmer_id"
            value={formData.farmer_id}
            onChange={handleChange}
            placeholder="Enter Farmer ID"
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500"
          />
        </div>

        {/* Farmer Name input */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Farmer Name</label>
          <input
            type="text"
            name="farmer_name"
            value={formData.farmer_name}
            onChange={handleChange}
            placeholder="Enter Farmer Name"
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500"
          />
        </div>

        {/* Quantity input */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">
            Quantity (kg)
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity in kg"
            required
            min="0"
            step="0.01"
            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500"
          />
        </div>

        {/* Date input */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Entry Date</label>
          <input
            type="date"
            name="entry_date"
            value={formData.entry_date}
            onChange={handleChange}
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500"
          />
        </div>

        {/* User's Mill District (Display Only) */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Your Mill District</label>
          <div className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
            <span className="font-medium">
              {currentUser?.mill_district || userData?.mill_district || 'Mill District not available'}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              {currentUser?.mill_district || userData?.mill_district ?
                '(Paddy prices are based on your mill district)' :
                '(Please update your profile with mill district information)'
              }
            </span>
          </div>
          {!currentUser?.mill_district && !userData?.mill_district && (
            <p className="text-xs text-red-600 mt-1">
              ⚠️ Mill District information is required for accurate price calculation. Please update your profile.
            </p>
          )}
        </div>

        {/* Paddy Type dropdown */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Paddy Type</label>
          <select
            name="paddy_type"
            value={formData.paddy_type}
            onChange={handleChange}
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500"
          >
            <option value="">Select Paddy Type</option>
            {paddyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Paddy State dropdown */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">
            Paddy Condition
          </label>
          <select
            name="paddy_condition"
            value={formData.paddy_condition}
            onChange={handleChange}
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500"
          >
            <option value="">Select Condition</option>
            {paddyStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Unit Price Selection */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1 text-green-800">
            Unit Price (LKR/kg) - Based on your mill district: {currentUser?.mill_district || 'Unknown'}
          </label>
          {loadingPrices ? (
            <div className="w-full p-3 border border-green-300 rounded-lg bg-gray-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-2"></div>
              Loading available prices...
            </div>
          ) : availablePrices.length > 0 ? (
            <>
              <select
                name="price_per_kg"
                value={formData.price_per_kg}
                onChange={handleChange}
                required={!formData.manual_price}
                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500"
              >
                <option value="">Select Price Option</option>
                {availablePrices.map((price) => (
                  <option key={price.id} value={price.id}>
                    {price.variety} ({price.type}) - LKR {price.pricePerKg}/kg
                    {price.market && ` - ${price.market}`}
                    {price.trend === 'rising' && ' ⬆️'}
                    {price.trend === 'falling' && ' ⬇️'}
                    {price.trend === 'stable' && ' ➡️'}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-600 mt-1">
                {availablePrices.length} price option{availablePrices.length !== 1 ? 's' : ''} available based on your selection
              </p>
            </>
          ) : formData.paddy_type && formData.paddy_condition ? (
            <>
              <div className="mb-3 p-3 border border-orange-300 rounded-lg bg-orange-50 text-orange-800 text-center">
                ⚠️ No prices available for {formData.paddy_type} ({formData.paddy_condition}) in {currentUser?.mill_district || 'your mill district'}
                <br />
                <span className="text-sm">Please enter the unit price manually below</span>
              </div>
              <input
                type="number"
                name="manual_price"
                value={formData.manual_price}
                onChange={handleChange}
                placeholder="Enter unit price (LKR/kg)"
                required
                min="0"
                step="0.01"
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-blue-50"
              />
              <p className="text-xs text-blue-600 mt-1">
                💡 Manual price entry - this price will be saved for this transaction
              </p>
            </>
          ) : (
            <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-center">
              Please select paddy type and condition to see available prices or enter manual price
            </div>
          )}
        </div>

        {/* Notes input */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1 text-green-800">Notes (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any additional notes"
            rows="3"
            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500"
          />
        </div>

        {/* Price display */}
        <div className="md:col-span-2 bg-green-100 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm font-semibold text-green-800">Selected Unit Price</p>
              <p className="text-xl font-bold text-green-900">
                LKR {unitPrice.toFixed(2)}/kg
              </p>
              {formData.manual_price ? (
                <p className="text-xs text-blue-700 mt-1">
                  💡 Manual Entry
                </p>
              ) : formData.price_per_kg && availablePrices.length > 0 && (() => {
                const selectedPrice = availablePrices.find(p => p.id === parseInt(formData.price_per_kg));
                return selectedPrice ? (
                  <p className="text-xs text-green-700 mt-1">
                    {selectedPrice.market}
                    {selectedPrice.trend === 'rising' && ' (📈 Rising)'}
                    {selectedPrice.trend === 'falling' && ' (📉 Falling)'}
                    {selectedPrice.trend === 'stable' && ' (➡️ Stable)'}
                  </p>
                ) : null;
              })()}
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Quantity</p>
              <p className="text-xl font-bold text-green-900">
                {formData.quantity || 0} kg
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Total Amount</p>
              <p className="text-xl font-bold text-green-900">
                LKR {totalAmount.toFixed(2)}
              </p>
              {formData.quantity && unitPrice > 0 && (
                <p className="text-xs text-green-700 mt-1">
                  {formData.quantity} kg × LKR {unitPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding Stock...' : 'Add Stock Entry'}
          </button>
        </div>
      </form>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-green-700">Confirm Stock Entry</h2>
            <div className="space-y-2 mb-4 text-sm">
              <p><strong>Farmer ID:</strong> {formData.farmer_id}</p>
              <p><strong>Farmer Name:</strong> {formData.farmer_name}</p>
              <p><strong>Paddy Type:</strong> {formData.paddy_type}</p>
              <p><strong>Condition:</strong> {formData.paddy_condition}</p>
              <p><strong>Mill District:</strong> {currentUser?.mill_district || 'Unknown'}</p>
              <p><strong>Quantity:</strong> {formData.quantity} kg</p>
              {(() => {
                if (formData.manual_price) {
                  return (
                    <p><strong>Price Source:</strong> <span className="text-blue-600">💡 Manual Entry</span></p>
                  );
                }
                const selectedPrice = availablePrices.find(p => p.id === parseInt(formData.price_per_kg));
                return selectedPrice ? (
                  <>
                    <p><strong>Market Source:</strong> {selectedPrice.market}</p>
                    <p><strong>Price Trend:</strong> {selectedPrice.trend === 'rising' ? '📈 Rising' : selectedPrice.trend === 'falling' ? '📉 Falling' : '➡️ Stable'}</p>
                  </>
                ) : null;
              })()}
              <p><strong>Unit Price:</strong> LKR {unitPrice.toFixed(2)}/kg</p>
              <p><strong>Total Amount:</strong> <span className="text-green-600 font-bold">LKR {totalAmount.toFixed(2)}</span></p>
              <p><strong>Date:</strong> {formData.entry_date}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MillUpdateStock;