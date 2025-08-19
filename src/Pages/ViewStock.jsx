import { useState } from "react";

const ViewStock = () => {
  // Dummy Stock Data
  const stockData = [
    {
      farmerId: "F001",
      farmerName: "Kamal Perera",
      paddyType: "Samba",
      condition: "Dry",
      quantity: 1500, // kg
      date: "2025-08-06",
    },
    {
      farmerId: "F002",
      farmerName: "Nimal Silva",
      paddyType: "Nadu",
      condition: "Wet",
      quantity: 1000, // kg
      date: "2025-08-05",
    },
    {
      farmerId: "F003",
      farmerName: "Sunil Fernando",
      paddyType: "Samba",
      condition: "Wet",
      quantity: 1200, // kg
      date: "2025-08-04",
    },
  ];

  const [filters, setFilters] = useState({
    farmerId: "",
    paddyType: "",
    condition: "",
    date: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredData = stockData.filter(
    (stock) =>
      stock.farmerId.toLowerCase().includes(filters.farmerId.toLowerCase()) &&
      stock.paddyType.toLowerCase().includes(filters.paddyType.toLowerCase()) &&
      stock.condition.toLowerCase().includes(filters.condition.toLowerCase()) &&
      stock.date.includes(filters.date)
  );

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-700 border-b-4 border-green-300 pb-2">
        📦 View Stock Records
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-lg shadow-md border border-green-200">
        <input
          type="text"
          name="farmerId"
          value={filters.farmerId}
          onChange={handleChange}
          placeholder="Search by Farmer ID"
          className="border border-green-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <select
          name="paddyType"
          value={filters.paddyType}
          onChange={handleChange}
          className="border border-green-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Paddy Types</option>
          <option value="Nadu - Red">Nadu - Red</option>
          <option value="Nadu - White">Nadu - White</option>
          <option value="Samba">Samba</option>
          <option value="Kiri Samba">Kiri Samba</option>
        </select>
        <select
          name="condition"
          value={filters.condition}
          onChange={handleChange}
          className="border border-green-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Conditions</option>
          <option value="Dry">Dry</option>
          <option value="Wet">Wet</option>
        </select>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="border border-green-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-green-200 bg-white">
        <table className="w-full table-auto">
          <thead className="bg-green-200 text-green-900">
            <tr>
              <th className="border px-4 py-2">Farmer ID</th>
              <th className="border px-4 py-2">Farmer Name</th>
              <th className="border px-4 py-2">Paddy Type</th>
              <th className="border px-4 py-2">Condition</th>
              <th className="border px-4 py-2">Quantity (MT)</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((stock, index) => (
                <tr
                  key={index}
                  className="odd:bg-white even:bg-green-50 hover:bg-green-100 text-center transition-colors"
                >
                  <td className="border px-4 py-2">{stock.farmerId}</td>
                  <td className="border px-4 py-2">{stock.farmerName}</td>
                  <td className="border px-4 py-2">{stock.paddyType}</td>
                  <td className="border px-4 py-2">{stock.condition}</td>
                  {/* Convert kg → MT (divide by 1000) */}
                  <td className="border px-4 py-2">{(stock.quantity / 1000).toFixed(2)}</td>
                  <td className="border px-4 py-2">{stock.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4 text-green-700 italic"
                >
                  No records match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewStock;
