import React, { useState } from 'react';
import PageTitle from './PageTitle';

const CollectionCenters = () => {
  // Simple state management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Static centers data - moved outside component to prevent re-creation
  const centers = [
    {
      id: 1,
      name: "Colombo Main Collection Center",
      district: "Colombo",
      province: "Western",
      address: "No. 123, Galle Road, Colombo 03",
      phone: "+94 11 234 5678",
      email: "colombo@pmb.gov.lk",
      status: "Active",
      capacity: "5000 MT/month",
      operatingHours: "6:00 AM - 6:00 PM",
      services: ["Quality Testing", "Storage", "Processing", "Export Facilitation"]
    },
    {
      id: 2,
      name: "Kandy Regional Center",
      district: "Kandy",
      province: "Central",
      address: "No. 456, Peradeniya Road, Kandy",
      phone: "+94 81 234 5678",
      email: "kandy@pmb.gov.lk",
      status: "Active",
      capacity: "3000 MT/month",
      operatingHours: "6:00 AM - 6:00 PM",
      services: ["Quality Testing", "Storage", "Processing"]
    },
    {
      id: 3,
      name: "Galle Southern Hub",
      district: "Galle",
      province: "Southern",
      address: "No. 789, Matara Road, Galle",
      phone: "+94 91 234 5678",
      email: "galle@pmb.gov.lk",
      status: "Under Maintenance",
      capacity: "2500 MT/month",
      operatingHours: "Temporarily Closed",
      services: ["Storage", "Processing"]
    },
    {
      id: 4,
      name: "Anuradhapura North Center",
      district: "Anuradhapura",
      province: "North Central",
      address: "No. 321, New Town Road, Anuradhapura",
      phone: "+94 25 234 5678",
      email: "anuradhapura@pmb.gov.lk",
      status: "Active",
      capacity: "4000 MT/month",
      operatingHours: "5:30 AM - 7:00 PM",
      services: ["Quality Testing", "Storage", "Processing", "Farmer Training"]
    },
    {
      id: 5,
      name: "Hambantota Export Terminal",
      district: "Hambantota",
      province: "Southern",
      address: "No. 654, Port Access Road, Hambantota",
      phone: "+94 47 234 5678",
      email: "hambantota@pmb.gov.lk",
      status: "Active",
      capacity: "6000 MT/month",
      operatingHours: "24/7 Operations",
      services: ["Storage", "Processing", "Export Facilitation", "Container Loading"]
    }
  ];

  // Extract unique districts for dropdown
  const districts = [...new Set(centers.map(c => c.district))].sort();

  // Filtering function - simple and direct
  const getFilteredCenters = () => {
    let result = centers;
    
    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(center =>
        center.name.toLowerCase().includes(search) ||
        center.district.toLowerCase().includes(search) ||
        center.address.toLowerCase().includes(search)
      );
    }
    
    // District filter
    if (selectedDistrict) {
      result = result.filter(center => center.district === selectedDistrict);
    }
    
    // Status filter
    if (selectedStatus) {
      result = result.filter(center => center.status === selectedStatus);
    }
    
    console.log('🔍 Filtered results:', result.length, 'centers found');
    return result;
  };

  // Event handlers
  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log('🔍 Search changed:', value);
    setSearchTerm(value);
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    console.log('📍 District changed:', value);
    setSelectedDistrict(value);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    console.log('⚡ Status changed:', value);
    setSelectedStatus(value);
  };

  const handleClearFilters = () => {
    console.log('🗑️ Clearing all filters');
    setSearchTerm('');
    setSelectedDistrict('');
    setSelectedStatus('');
  };

  // Get filtered centers for display
  const filteredCenters = getFilteredCenters();

  return (
    <div className="py-16 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 min-h-screen">
      <div className="container mx-auto px-4">
        
        <PageTitle 
          title="Collection Centers Network"
          subtitle="Find your nearest PMB collection center for paddy and rice services"
          theme="professional"
        />

        {/* Search and Filter Controls */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12 border border-green-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔍 Find Centers Near You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            {/* Search Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">🔍 Search Centers</label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Type to search..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📍 Select District</label>
              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
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
                onChange={handleStatusChange}
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
              onClick={handleClearFilters}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold"
            >
              🗑️ Clear All Filters
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📋 Grid View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📝 List View
              </button>
            </div>
          </div>

          {/* Search Results Summary */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-semibold">
              📊 Search Results: {filteredCenters.length} of {centers.length} centers found
              {searchTerm && <span className="text-blue-600"> (searching: "{searchTerm}")</span>}
              {selectedDistrict && <span className="text-blue-600"> (district: {selectedDistrict})</span>}
              {selectedStatus && <span className="text-blue-600"> (status: {selectedStatus})</span>}
            </p>
          </div>
        </div>

        {/* Results Display */}
        {filteredCenters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Centers Found</h3>
            <p className="text-gray-600 mb-6">No collection centers match your current search criteria.</p>
            <button
              onClick={handleClearFilters}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
            >
              🔄 Clear Filters & Show All
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "space-y-6"
          }>
            {filteredCenters.map((center) => (
              <div 
                key={center.id} 
                className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-300 ${
                  viewMode === 'list' ? 'flex items-center p-6 space-x-6' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View Layout
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        center.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {center.status === 'Active' ? '✅' : '⚠️'} {center.status}
                      </div>
                      <div className="text-2xl">🏢</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{center.name}</h3>
                    <p className="text-gray-600 mb-3">📍 {center.district}, {center.province}</p>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">📍 Address:</span> {center.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">📞 Phone:</span> {center.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">⚡ Capacity:</span> {center.capacity}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">🕐 Hours:</span> {center.operatingHours}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="font-semibold text-gray-700 mb-2">🛠️ Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {center.services.map((service, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-sm">
                        📞 Contact
                      </button>
                      <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold text-sm">
                        🗺️ Directions
                      </button>
                    </div>
                  </>
                ) : (
                  // List View Layout
                  <>
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                        🏢
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800 truncate">{center.name}</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ${
                          center.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {center.status === 'Active' ? '✅' : '⚠️'} {center.status}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-2">📍 {center.district}, {center.province} • 📞 {center.phone}</p>
                      <p className="text-sm text-gray-600 mb-2">⚡ {center.capacity} • 🕐 {center.operatingHours}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {center.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {service}
                          </span>
                        ))}
                        {center.services.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                            +{center.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-sm">
                        📞 Contact
                      </button>
                      <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold text-sm">
                        🗺️ Directions
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Additional Information */}
        <div className="mt-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">ℹ️ Important Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Required Documents</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• National Identity Card</li>
                <li>• Land Ownership Certificate</li>
                <li>• Paddy Cultivation Certificate</li>
                <li>• Bank Account Details</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">⏰ General Operating Hours</h3>
              <div className="text-gray-700 space-y-2">
                <p><span className="font-semibold">Monday - Friday:</span> 6:00 AM - 6:00 PM</p>
                <p><span className="font-semibold">Saturday:</span> 6:00 AM - 2:00 PM</p>
                <p><span className="font-semibold">Sunday:</span> Closed (except emergency)</p>
                <p className="text-sm text-blue-600 mt-2">* Hours may vary by location</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 font-semibold text-center">
              ⚠️ Please call ahead to confirm availability and bring all required documents for smooth processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCenters;
