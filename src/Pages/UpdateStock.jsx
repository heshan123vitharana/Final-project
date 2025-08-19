import { useState, useEffect } from "react";

// ✅ Simulated DB prices (PaddyType + Condition)
const paddyPrices = {
  "Nadu - White": { Wet: 80, Dry: 85 },
  "Nadu - Red": { Wet: 85, Dry: 90 },
  "Samba": { Wet: 95, Dry: 100 },
  "Kiri Samba": { Wet: 115, Dry: 120 },
};

const paddyTypes = ["Nadu - White", "Nadu - Red", "Samba", "Kiri Samba"];
const paddyStates = ["Wet", "Dry"];

const UpdateStock = () => {
  const [formData, setFormData] = useState({
    farmerId: "",
    farmerName: "",
    accountNumber: "",
    quantity: "",
    paddyType: "",
    paddyState: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [unitPrice, setUnitPrice] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [notification, setNotification] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Update unit price automatically when PaddyType & PaddyState are selected
  useEffect(() => {
    if (formData.paddyType && formData.paddyState) {
      const price =
        paddyPrices[formData.paddyType]?.[formData.paddyState] || 0;
      setUnitPrice(price);
    } else {
      setUnitPrice(0);
    }
  }, [formData.paddyType, formData.paddyState]);

  // ✅ Calculate total amount
  const totalAmount =
    formData.quantity && unitPrice
      ? parseFloat(formData.quantity) * unitPrice
      : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleConfirm = () => {
    setShowPopup(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Simulate successful submission
    const success = Math.random() > 0.3;

    if (success) {
      setNotification("✅ Stock data successfully added!");
      console.log("Stock Added:", { ...formData, unitPrice, totalAmount });

      setFormData({
        farmerId: "",
        farmerName: "",
        accountNumber: "",
        quantity: "",
        paddyType: "",
        paddyState: "",
        date: new Date().toISOString().split("T")[0],
      });
      setUnitPrice(0);
    } else {
      setNotification("❌ Stock data update unsuccessful!");
    }

    setTimeout(() => setNotification(""), 4000);
  };

  const handleCancel = () => setShowPopup(false);

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Top Notification */}
      {notification && (
        <div
          className={`fixed top-2 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-md z-50
          ${notification.includes("❌") ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
        >
          {notification}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-green-700 border-b-4 border-green-300 pb-2">
        🌾 Update Paddy Stock
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md border border-green-200 max-w-3xl mx-auto"
      >
        {/* Farmer ID */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Farmer ID</label>
          <input
            type="text"
            name="farmerId"
            value={formData.farmerId}
            onChange={handleChange}
            placeholder="Enter Farmer ID"
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          />
        </div>

        {/* Farmer Name */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Farmer Name</label>
          <input
            type="text"
            name="farmerName"
            value={formData.farmerName}
            onChange={handleChange}
            placeholder="Enter Farmer Name"
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          />
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setFormData({ ...formData, accountNumber: value });
            }}
            placeholder="Enter Account Number"
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Quantity (MT)</label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, "");
              setFormData({ ...formData, quantity: value });
            }}
            placeholder="Enter Quantity in MT"
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          />
        </div>

        {/* Paddy Type */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Paddy Type</label>
          <select
            name="paddyType"
            value={formData.paddyType}
            onChange={handleChange}
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          >
            <option value="">Select Paddy Type</option>
            {paddyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Paddy Condition */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Condition</label>
          <select
            name="paddyState"
            value={formData.paddyState}
            onChange={handleChange}
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          >
            <option value="">Select Condition</option>
            {paddyStates.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          />
        </div>

        {/* Unit Price */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Unit Price (Rs./MT)</label>
          <input
            type="text"
            value={unitPrice ? unitPrice.toFixed(2) : ""}
            readOnly
            className="w-full p-3 border border-green-300 rounded-lg bg-gray-100 text-green-800 font-semibold"
          />
        </div>

        {/* Total Amount */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-green-800">Total Amount (Rs.)</label>
          <input
            type="text"
            value={totalAmount.toFixed(2)}
            readOnly
            className="w-full p-3 border border-green-300 rounded-lg bg-gray-100 text-green-800 font-semibold"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Confirm Entry
          </button>
        </div>
      </form>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-green-200 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-green-300">
            <h2 className="text-xl font-bold text-green-800 mb-4">Confirm Stock Entry</h2>
            <ul className="space-y-2 text-sm text-green-900 mb-4">
              <li><strong>Farmer ID:</strong> {formData.farmerId}</li>
              <li><strong>Farmer Name:</strong> {formData.farmerName}</li>
              <li><strong>Account Number:</strong> {formData.accountNumber}</li>
              <li><strong>Quantity:</strong> {formData.quantity} MT</li>
              <li><strong>Paddy Type:</strong> {formData.paddyType}</li>
              <li><strong>Condition:</strong> {formData.paddyState}</li>
              <li><strong>Date:</strong> {formData.date}</li>
              <li><strong>Unit Price:</strong> Rs.{unitPrice.toFixed(2)}</li>
              <li><strong>Total Amount:</strong> Rs.{totalAmount.toFixed(2)}</li>
            </ul>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateStock;
