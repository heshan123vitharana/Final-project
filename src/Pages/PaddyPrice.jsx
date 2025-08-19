import { useState, useEffect } from "react";

// PaddyPrice component: displays current paddy prices with filter options
const PaddyPrice = () => {
  // State for selected paddy type and condition filters
  const [selectedType, setSelectedType] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  // Sample Paddy Price Data (replace with API data in production)
  const paddyPrices = [
    { type: "Samba", condition: "Dry", price: 120 },
    { type: "Samba", condition: "Wet", price: 100 },
    { type: "Nadu", condition: "Dry", price: 110 },
    { type: "Nadu", condition: "Wet", price: 90 },
    { type: "Kiri Samba", condition: "Dry", price: 150 },
    { type: "Kiri Samba", condition: "Wet", price: 130 },
  ];

  // Set page title on mount
  useEffect(() => {
    document.title = "Paddy Prices";
  }, []);

  // Filter prices based on selected type and condition
  const filteredPrices = paddyPrices.filter(
    (price) =>
      (selectedType === "" || price.type === selectedType) &&
      (selectedCondition === "" || price.condition === selectedCondition)
  );

  // Get unique paddy types and conditions for filter dropdowns
  const uniqueTypes = [...new Set(paddyPrices.map((p) => p.type))];
  const uniqueConditions = [...new Set(paddyPrices.map((p) => p.condition))];

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-6 text-green-700 border-b-4 border-green-300 pb-2">
        📊 Current Paddy Prices
      </h1>

      {/* Filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-lg shadow-md border border-green-200">
        {/* Paddy type filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-green-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Paddy Types</option>
          {uniqueTypes.map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Condition filter */}
        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="border border-green-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Conditions</option>
          {uniqueConditions.map((cond, idx) => (
            <option key={idx} value={cond}>
              {cond}
            </option>
          ))}
        </select>
      </div>

      {/* Prices table */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-green-200 bg-white">
        <table className="w-full table-auto">
          <thead className="bg-green-200 text-green-900">
            <tr>
              <th className="border px-4 py-2 text-left">Paddy Type</th>
              <th className="border px-4 py-2 text-left">Condition</th>
              <th className="border px-4 py-2 text-left">Price per kg (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrices.length > 0 ? (
              filteredPrices.map((p, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-white even:bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <td className="border px-4 py-2">{p.type}</td>
                  <td className="border px-4 py-2">{p.condition}</td>
                  <td className="border px-4 py-2 font-semibold text-green-700">
                    Rs. {p.price}.00
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-4 text-green-700 italic"
                >
                  No data available for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaddyPrice;