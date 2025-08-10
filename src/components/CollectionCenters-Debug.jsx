import React, { useState } from 'react';

const CollectionCentersDebug = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const centers = [
    {
      id: 1,
      name: "Colombo Main Collection Center",
      district: "Colombo",
      province: "Western",
      manager: "Mr. K.D. Silva",
      services: ["Quality Testing", "Storage", "Processing"]
    },
    {
      id: 2,
      name: "Kandy Hill Center",
      district: "Kandy",
      province: "Central",
      manager: "Ms. P. Fernando",
      services: ["Quality Testing", "Storage"]
    },
    {
      id: 3,
      name: "Galle Southern Center",
      district: "Galle",
      province: "Southern",
      manager: "Mr. R. Perera",
      services: ["Storage", "Export Facilitation"]
    }
  ];

  const filteredCenters = centers.filter(center => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      center.name.toLowerCase().includes(search) ||
      center.district.toLowerCase().includes(search) ||
      center.province.toLowerCase().includes(search) ||
      center.manager.toLowerCase().includes(search) ||
      center.services.some(service => service.toLowerCase().includes(search))
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-8">Search Debug Test</h1>
        
        {/* Simple Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              console.log('Search changed to:', e.target.value);
              console.log('Filtered results:', centers.filter(c => 
                !e.target.value || 
                c.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                c.district.toLowerCase().includes(e.target.value.toLowerCase())
              ).length);
            }}
            placeholder="Type to search (try: Colombo, Kandy, Galle, Silva, Storage)..."
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
          />
          <div className="mt-2 text-sm text-gray-600">
            Search term: "{searchTerm}" | Results: {filteredCenters.length} of {centers.length}
          </div>
        </div>

        {/* Simple Results */}
        <div className="space-y-4">
          {filteredCenters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-red-600">No results found for "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredCenters.map(center => (
              <div key={center.id} className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{center.name}</h3>
                <p className="text-gray-600 mb-1">📍 {center.district}, {center.province}</p>
                <p className="text-gray-600 mb-2">👤 Manager: {center.manager}</p>
                <p className="text-gray-600">🔧 Services: {center.services.join(', ')}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionCentersDebug;
