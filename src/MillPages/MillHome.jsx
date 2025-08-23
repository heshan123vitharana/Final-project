// src/MillPages/MillHome.jsx
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

const MillHome = () => {
  // Set page title on mount
  useEffect(() => {
    document.title = "Dashboard | Home";
  }, []);

  const [selectedType, setSelectedType] = useState('dry');

  // Sample data
  const dryPaddyData = [
    { variety: 'Nadu', stock: 1200 },
    { variety: 'Samba', stock: 800 },
    { variety: 'Red Rice', stock: 450 },
  ];

  const wetPaddyData = [
    { variety: 'Nadu', stock: 600 },
    { variety: 'Samba', stock: 950 },
    { variety: 'Red Rice', stock: 300 },
  ];

  const chartData = selectedType === 'dry' ? dryPaddyData : wetPaddyData;

  return (
    <div className="p-6">
      {/* Dashboard heading */}
      <h1 className="text-5xl font-bold mb-4 text-green-700">
        Welcome to the Paddy Mill Dashboard
      </h1>

      {/* Dashboard description */}
      <p className="text-xl text-gray-700 mb-6">
        Use the sidebar to navigate through the system and manage mill operations effectively.
      </p>

      {/* Chart type selection buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedType('dry')}
          className={`px-4 py-2 rounded font-semibold border ${
            selectedType === 'dry'
              ? 'bg-green-600 text-white'
              : 'bg-white text-green-700 border-green-600'
          }`}
        >
          Dry Paddy
        </button>
        <button
          onClick={() => setSelectedType('wet')}
          className={`px-4 py-2 rounded font-semibold border ${
            selectedType === 'wet'
              ? 'bg-green-600 text-white'
              : 'bg-white text-green-700 border-green-600'
          }`}
        >
          Wet Paddy
        </button>
      </div>

      {/* Paddy stock bar chart */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
          {selectedType} Paddy Stock Levels by Variety
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="variety" />
            <YAxis 
              label={{ value: 'Stock (MT)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip formatter={(value) => [`${value} MT`, 'Stock']} />
            <Legend />
            <Bar dataKey="stock" fill="#38a169" name="Stock (MT)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MillHome;
