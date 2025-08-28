import { useState, useEffect } from "react";

// Simulated Paddy Price Database (can be replaced with API call)
const paddyPrices = {
  North: {
    "Nadu - White": { Wet: 82, Dry: 87 },
    "Nadu - Red": { Wet: 88, Dry: 92 },
    Samba: { Wet: 97, Dry: 102 },
    "Kiri Samba": { Wet: 118, Dry: 123 },
  },
  South: {
    "Nadu - White": { Wet: 80, Dry: 85 },
    "Nadu - Red": { Wet: 85, Dry: 90 },
    Samba: { Wet: 95, Dry: 100 },
    "Kiri Samba": { Wet: 115, Dry: 120 },
  },
  Central: {
    "Nadu - White": { Wet: 83, Dry: 88 },
    "Nadu - Red": { Wet: 86, Dry: 91 },
    Samba: { Wet: 96, Dry: 101 },
    "Kiri Samba": { Wet: 116, Dry: 121 },
  },
};

// Dropdown options for regions, paddy types, and states
const regions = ["North", "South", "Central"];
const paddyTypes = ["Nadu - White", "Nadu - Red", "Samba", "Kiri Samba"];
const paddyStates = ["Wet", "Dry"];

const MillUpdateStock = ({ userData }) => {
  // State for form fields
  const [formData, setFormData] = useState({
    farmer_id: "",
    farmer_name: "",
    quantity: "",
    region: "",
    paddy_type: "",
    paddy_condition: "",
    entry_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // State for calculated unit price
  const [unitPrice, setUnitPrice] = useState(0);
  // State for showing confirmation popup
  const [showPopup, setShowPopup] = useState(false);
  // State for notification message
  const [notification, setNotification] = useState("");
  // State for loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set page title on mount
  useEffect(() => {
    document.title = "Dashboard | Update Stock";
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate unit price based on region, paddy type, and state
  useEffect(() => {
    if (formData.region && formData.paddy_type && formData.paddy_condition) {
      const price =
        paddyPrices[formData.region]?.[formData.paddy_type]?.[formData.paddy_condition] || 0;
      setUnitPrice(price);
    } else {
      setUnitPrice(0);
    }
  }, [formData.region, formData.paddy_type, formData.paddy_condition]);

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
      const token = userData?.token;
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const stockData = {
        farmer_id: formData.farmer_id,
        farmer_name: formData.farmer_name,
        paddy_type: formData.paddy_type,
        paddy_condition: formData.paddy_condition,
        quantity: parseFloat(formData.quantity),
        region: formData.region,
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
        console.log("Stock Added:", result.data);

        // Reset form
        setFormData({
          farmer_id: "",
          farmer_name: "",
          quantity: "",
          region: "",
          paddy_type: "",
          paddy_condition: "",
          entry_date: new Date().toISOString().split("T")[0],
          notes: "",
        });
        setUnitPrice(0);
      } else {
        setNotification(`❌ ${result.message || 'Failed to add stock data'}`);
        console.error('Stock addition error:', result);
      }
    } catch (error) {
      console.error('Stock addition error:', error);
      setNotification("❌ Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
      // Hide notification after 4 seconds
      setTimeout(() => setNotification(""), 4000);
    }
  };

  // Handle cancel in popup
  const handleCancel = () => setShowPopup(false);

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

        {/* Region dropdown */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500"
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
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
              <p className="text-sm font-semibold text-green-800">Unit Price</p>
              <p className="text-xl font-bold text-green-900">
                LKR {unitPrice.toFixed(2)}/kg
              </p>
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
              <p><strong>Region:</strong> {formData.region}</p>
              <p><strong>Quantity:</strong> {formData.quantity} kg</p>
              <p><strong>Unit Price:</strong> LKR {unitPrice.toFixed(2)}/kg</p>
              <p><strong>Total Amount:</strong> LKR {totalAmount.toFixed(2)}</p>
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