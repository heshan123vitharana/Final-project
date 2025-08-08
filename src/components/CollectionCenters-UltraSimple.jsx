import React, { useState, useEffect } from 'react';
import PageTitle from './PageTitle';

const CollectionCenters = () => {
  // Simple state - no complex hooks
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredCenters, setFilteredCenters] = useState([]);

  // Static data - no useMemo
  const centers = [
    {
      id: 1,
      name: "Colombo Main Collection Center",
      district: "Colombo",
      province: "Western",
      address: "No. 123, Galle Road, Colombo 03",
      phone: "+94 11 234 5678",
      email: "colombo@pmb.gov.lk",
      capacity: "5,000 MT",
      currentStock: "3,200 MT",
      status: "Active",
      facilities: ["Modern Storage", "Quality Testing Lab", "Vehicle Parking"],
      rating: 4.8
    },
    {
      id: 2,
      name: "Kandy Regional Center",
      district: "Kandy",
      province: "Central",
      address: "No. 45, Peradeniya Road, Kandy",
      phone: "+94 81 223 4567",
      email: "kandy@pmb.gov.lk",
      capacity: "3,500 MT",
      currentStock: "2,100 MT",
      status: "Active",
      facilities: ["Climate Control", "Processing Unit", "Farmer Rest Area"],
      rating: 4.6
    },
    {
      id: 3,
      name: "Anuradhapura Regional Hub",
      district: "Anuradhapura",
      province: "North Central",
      address: "Paddy Marketing Complex, New Town",
      phone: "+94 25 222 3456",
      email: "anuradhapura@pmb.gov.lk",
      capacity: "8,000 MT",
      currentStock: "5,800 MT",
      status: "Active",
      facilities: ["Large Scale Storage", "Advanced Milling", "Quality Control"],
      rating: 4.9
    },
    {
      id: 4,
      name: "Jaffna Northern Center",
      district: "Jaffna",
      province: "Northern",
      address: "Agricultural Park, Kokuvil",
      phone: "+94 21 222 3456",
      email: "jaffna@pmb.gov.lk",
      capacity: "4,000 MT",
      currentStock: "0 MT",
      status: "Under Maintenance",
      facilities: ["Storage Units", "Basic Testing"],
      rating: 4.0
    },
    {
      id: 5,
      name: "Matara Southern Hub",
      district: "Matara",
      province: "Southern",
      address: "Coastal Highway, Matara South",
      phone: "+94 41 222 9012",
      email: "matara@pmb.gov.lk",
      capacity: "3,500 MT",
      currentStock: "1,800 MT",
      status: "Active",
      facilities: ["Coastal Storage", "Transport Hub", "Quality Control"],
      rating: 4.4
    }
  ];

  // Apply filters whenever state changes
  useEffect(() => {
    console.log('=== FILTERING ===');
    console.log('Search:', searchTerm);
    console.log('District:', selectedDistrict);
    console.log('Status:', selectedStatus);

    let result = centers;

    // Search filter
    if (searchTerm && searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(center => {
        const matchName = center.name.toLowerCase().includes(search);
        const matchDistrict = center.district.toLowerCase().includes(search);
        const matchAddress = center.address.toLowerCase().includes(search);
        return matchName || matchDistrict || matchAddress;
      });
      console.log('After search filter:', result.length);
    }

    // District filter
    if (selectedDistrict && selectedDistrict !== '') {
      result = result.filter(center => center.district === selectedDistrict);
      console.log('After district filter:', result.length);
    }

    // Status filter
    if (selectedStatus && selectedStatus !== '') {
      result = result.filter(center => center.status === selectedStatus);
      console.log('After status filter:', result.length);
    }

    console.log('Final result:', result.length);
    setFilteredCenters(result);
  }, [searchTerm, selectedDistrict, selectedStatus]);

  // Get unique districts
  const districts = [...new Set(centers.map(c => c.district))].sort();

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Page Title */}
        <PageTitle 
          title="Collection Centers Network" 
          subtitle="Modern facilities across Sri Lanka"
          description="Find and connect with our collection centers nationwide"
        />

        {/* SEARCH AND FILTERS - ULTRA SIMPLE */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Search & Filter Centers</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">🔍 Search Centers</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  console.log('Search input changed:', e.target.value);
                  setSearchTerm(e.target.value);
                }}
                placeholder="Type to search..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📍 Select District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  console.log('District changed:', e.target.value);
                  setSelectedDistrict(e.target.value);
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">⚡ Status Filter</label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  console.log('Status changed:', e.target.value);
                  setSelectedStatus(e.target.value);
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          {/* Clear Filters & View Toggle */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                console.log('Clearing all filters');
                setSearchTerm('');
                setSelectedDistrict('');
                setSelectedStatus('');
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
            >
              🗑️ Clear All Filters
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                🔲 Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                📋 List
              </button>
            </div>
          </div>

          {/* DEBUG INFO */}
          <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
            <p className="text-sm font-mono">
              <strong>DEBUG:</strong> Search: "{searchTerm}" | District: "{selectedDistrict}" | Status: "{selectedStatus}" | 
              Results: {filteredCenters.length}/{centers.length}
            </p>
          </div>
        </div>

        {/* RESULTS DISPLAY */}
        {filteredCenters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Centers Found</h3>
            <p className="text-gray-600 mb-6">
              No collection centers match your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDistrict('');
                setSelectedStatus('');
              }}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold"
            >
              Show All Centers
            </button>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-6'
          }`}>
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                className={`bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-shadow p-6 ${
                  viewMode === 'list' ? 'flex items-center space-x-6' : ''
                }`}
              >
                {/* Status Badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                  center.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {center.status}
                </div>

                {/* Center Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{center.name}</h3>
                  <p className="text-gray-600 mb-2">📍 {center.district}, {center.province}</p>
                  <p className="text-gray-600 mb-2">🏠 {center.address}</p>
                  <p className="text-gray-600 mb-2">📞 {center.phone}</p>
                  <p className="text-gray-600 mb-4">📧 {center.email}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Capacity</p>
                      <p className="text-lg font-bold text-blue-600">{center.capacity}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Current Stock</p>
                      <p className="text-lg font-bold text-green-600">{center.currentStock}</p>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">Facilities:</p>
                    <div className="flex flex-wrap gap-2">
                      {center.facilities.map((facility, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        const address = encodeURIComponent(center.address);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                      }}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 font-semibold"
                    >
                      🗺️ Directions
                    </button>
                    <button
                      onClick={() => window.open(`tel:${center.phone}`)}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 font-semibold"
                    >
                      📞 Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-6">Network Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{centers.length}</p>
              <p className="text-gray-600">Total Centers</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {centers.filter(c => c.status === 'Active').length}
              </p>
              <p className="text-gray-600">Active Centers</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{districts.length}</p>
              <p className="text-gray-600">Districts Covered</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{filteredCenters.length}</p>
              <p className="text-gray-600">Currently Showing</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionCenters;
