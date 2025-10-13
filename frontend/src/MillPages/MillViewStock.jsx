import { useState, useEffect, useCallback } from "react";

const MillViewStock = ({ userData }) => {
  // State for stock data
  const [stockEntries, setStockEntries] = useState([]);
  const [stockSummary, setStockSummary] = useState([]);
  const [stockStats, setStockStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State for filters
  const [filters, setFilters] = useState({
    paddy_type: "",
    paddy_condition: "",
    region: "",
    date_from: "",
    date_to: ""
  });

  // State for view mode
  const [viewMode, setViewMode] = useState("entries"); // "entries", "summary", "stats"

  // Set page title on mount
  useEffect(() => {
    document.title = "Dashboard | View Stock";
  }, []);

  // Fetch stock data
  const fetchStockData = useCallback(async () => {
    try {
      setLoading(true);
      const token = userData?.token;
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const endpoints = [
        { url: `/api/stock/entries?${queryParams.toString()}`, key: 'entries' },
        { url: '/api/stock/summary', key: 'summary' },
        { url: '/api/stock/stats', key: 'stats' }
      ];

      const results = await Promise.all(
        endpoints.map(endpoint =>
          fetch(`http://localhost:5000${endpoint.url}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(res => res.json())
        )
      );

      setStockEntries(results[0].data || []);
      setStockSummary(results[1].data || []);
      setStockStats(results[2].data || {});
      setError("");
    } catch (error) {
      console.error('Fetch stock data error:', error);
      setError(`Failed to load stock data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [userData?.token, filters, setLoading, setStockEntries, setStockSummary, setStockStats, setError]);

  // Load data on component mount and filter changes
  useEffect(() => {
    if (userData?.token) {
      fetchStockData();
    }
  }, [userData?.token, filters, fetchStockData]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      paddy_type: "",
      paddy_condition: "",
      region: "",
      date_from: "",
      date_to: ""
    });
  };

  // Delete stock entry
  const deleteStockEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stock entry?')) return;
    
    try {
      const token = userData?.token;
      const response = await fetch(`http://localhost:5000/api/stock/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchStockData(); // Refresh data
        alert('Stock entry deleted successfully');
      } else {
        const result = await response.json();
        alert(`Failed to delete: ${result.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Network error occurred');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-green-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-700">Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-6 text-green-700 border-b-4 border-green-300 pb-2">
        📊 View Paddy Stock
      </h1>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* View mode tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-green-100 rounded-lg p-1">
          {[
            { key: "entries", label: "Stock Entries", icon: "📋" },
            { key: "summary", label: "Stock Summary", icon: "📊" },
            { key: "stats", label: "Statistics", icon: "📈" }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                viewMode === key
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-green-700 hover:bg-green-200'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters (only for entries view) */}
      {viewMode === "entries" && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow border border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paddy Type</label>
              <select
                name="paddy_type"
                value={filters.paddy_type}
                onChange={handleFilterChange}
                className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
              >
                <option value="">All Types</option>
                <option value="Nadu - White">Nadu - White</option>
                <option value="Nadu - Red">Nadu - Red</option>
                <option value="Samba">Samba</option>
                <option value="Kiri Samba">Kiri Samba</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                name="paddy_condition"
                value={filters.paddy_condition}
                onChange={handleFilterChange}
                className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
              >
                <option value="">All Conditions</option>
                <option value="Wet">Wet</option>
                <option value="Dry">Dry</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                name="region"
                value={filters.region}
                onChange={handleFilterChange}
                className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
              >
                <option value="">All Regions</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="Central">Central</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                name="date_from"
                value={filters.date_from}
                onChange={handleFilterChange}
                className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                name="date_to"
                value={filters.date_to}
                onChange={handleFilterChange}
                className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
          
          <div className="mt-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === "entries" && (
        <div className="bg-white rounded-lg shadow border border-green-200 overflow-hidden">
          <div className="p-4 bg-green-50 border-b border-green-200">
            <h3 className="text-lg font-semibold text-green-700">
              Stock Entries ({stockEntries.length})
            </h3>
          </div>
          
          {stockEntries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No stock entries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-green-700 font-semibold min-w-[100px]">Date</th>
                    <th className="px-4 py-3 text-left text-green-700 font-semibold min-w-[120px]">Farmer</th>
                    <th className="px-6 py-3 text-left text-green-700 font-semibold min-w-[120px]">Type</th>
                    <th className="px-4 py-3 text-left text-green-700 font-semibold min-w-[110px]">Condition</th>
                    <th className="px-6 py-3 text-left text-green-700 font-semibold min-w-[200px]">Location</th>
                    <th className="px-4 py-3 text-left text-green-700 font-semibold min-w-[90px]">Quantity</th>
                    <th className="px-4 py-3 text-left text-green-700 font-semibold min-w-[90px]">Price/kg</th>
                    <th className="px-4 py-3 text-left text-green-700 font-semibold min-w-[90px]">Total</th>
                    <th className="px-4 py-3 text-left text-green-700 font-semibold min-w-[90px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stockEntries.map((entry, index) => (
                    <tr key={entry.id} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                      <td className="px-4 py-3">{new Date(entry.entry_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{entry.farmer_name}</div>
                          <div className="text-sm text-gray-500">ID: {entry.farmer_id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3">{entry.paddy_type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded ${
                          entry.paddy_condition === 'Wet' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.paddy_condition}
                        </span>
                      </td>
                      <td className="px-6 py-3">{entry.region}</td>
                      <td className="px-4 py-3">{entry.quantity} kg</td>
                      <td className="px-4 py-3">LKR {parseFloat(entry.price_per_kg).toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold">LKR {parseFloat(entry.total_amount).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteStockEntry(entry.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                          title="Delete Entry"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {viewMode === "summary" && (
        <div className="bg-white rounded-lg shadow border border-green-200">
          <div className="p-4 bg-green-50 border-b border-green-200">
            <h3 className="text-lg font-semibold text-green-700">Stock Summary</h3>
          </div>
          
          {stockSummary.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No stock summary available</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stockSummary.map((item, index) => (
                  <div key={index} className="border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-green-800">{item.paddy_type}</h4>
                        <p className="text-sm text-gray-600">{item.region} - {item.paddy_condition}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        item.paddy_condition === 'Wet' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.paddy_condition}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-green-600">{item.total_quantity} kg</p>
                      <p className="text-xs text-gray-500">
                        Last updated: {new Date(item.last_updated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* General Stats */}
          <div className="bg-white rounded-lg shadow border border-green-200 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Total Entries</h3>
              <p className="text-3xl font-bold text-green-600">
                {stockStats.general?.total_entries || 0}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-green-200 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Total Quantity</h3>
              <p className="text-3xl font-bold text-green-600">
                {parseFloat(stockStats.general?.total_quantity || 0).toFixed(0)} kg
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-green-200 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Total Value</h3>
              <p className="text-3xl font-bold text-green-600">
                LKR {parseFloat(stockStats.general?.total_value || 0).toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-green-200 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Total Farmers</h3>
              <p className="text-3xl font-bold text-green-600">
                {stockStats.general?.total_farmers || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MillViewStock;
