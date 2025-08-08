import React, { useState, useEffect } from 'react';
import PageTitle from './PageTitle';

const CollectionCenters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [showAllCenters, setShowAllCenters] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('collection-centers');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  // Sample data for collection centers
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
      capacity: "Large",
      capacityMT: "5000 MT/month",
      operatingHours: "6:00 AM - 6:00 PM",
      services: ["Quality Testing", "Storage", "Processing", "Export Facilitation"],
      established: "1985",
      rating: 4.8
    },
    {
      id: 2,
      name: "Kandy Central Hub",
      district: "Kandy",
      province: "Central",
      address: "No. 456, Peradeniya Road, Kandy",
      phone: "+94 81 234 5678",
      email: "kandy@pmb.gov.lk",
      status: "Active",
      capacity: "Medium",
      capacityMT: "3000 MT/month",
      operatingHours: "7:00 AM - 5:00 PM",
      services: ["Quality Testing", "Storage", "Processing", "Training"],
      established: "1978",
      rating: 4.6
    },
    {
      id: 3,
      name: "Galle Southern Terminal",
      district: "Galle",
      province: "Southern",
      address: "No. 789, Matara Road, Galle",
      phone: "+94 91 234 5678",
      email: "galle@pmb.gov.lk",
      status: "Active",
      capacity: "Medium",
      capacityMT: "2500 MT/month",
      operatingHours: "6:30 AM - 5:30 PM",
      services: ["Quality Testing", "Storage", "Export Processing"],
      established: "1982",
      rating: 4.4
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
      capacity: "Large",
      capacityMT: "4000 MT/month",
      operatingHours: "5:30 AM - 7:00 PM",
      services: ["Quality Testing", "Storage", "Processing", "Farmer Training"],
      established: "1975",
      rating: 4.9
    }
  ];

  // Extract unique values for filters
  const districts = [...new Set(centers.map(c => c.district))].sort();
  const provinces = [...new Set(centers.map(c => c.province))].sort();
  const capacityTypes = [...new Set(centers.map(c => c.capacity))].sort();
  const statusTypes = [...new Set(centers.map(c => c.status))].sort();

  // Filter centers based on search and filter criteria
  const getFilteredCenters = () => {
    if (showAllCenters) {
      return centers;
    }

    let filtered = centers;
    const hasSearchCriteria = searchTerm || selectedDistrict || selectedProvince || selectedStatus || selectedCapacity;
    
    if (!hasSearchCriteria) {
      return [];
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(center =>
        center.name.toLowerCase().includes(search) ||
        center.district.toLowerCase().includes(search) ||
        center.province.toLowerCase().includes(search) ||
        center.address.toLowerCase().includes(search) ||
        center.services.some(service => service.toLowerCase().includes(search))
      );
    }

    if (selectedDistrict) {
      filtered = filtered.filter(center => center.district === selectedDistrict);
    }

    if (selectedProvince) {
      filtered = filtered.filter(center => center.province === selectedProvince);
    }

    if (selectedStatus) {
      filtered = filtered.filter(center => center.status === selectedStatus);
    }

    if (selectedCapacity) {
      filtered = filtered.filter(center => center.capacity === selectedCapacity);
    }

    return filtered;
  };

  const filteredCenters = getFilteredCenters();

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('');
    setSelectedProvince('');
    setSelectedStatus('');
    setSelectedCapacity('');
    setShowAllCenters(false);
  };

  const handleViewAllCenters = () => {
    clearAllFilters();
    setShowAllCenters(true);
  };

  return (
    <section id="collection-centers" className="relative min-h-screen py-20">
      <PageTitle title="Collection Centers" />
      
      {/* Professional Background matching other pages */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 overflow-hidden"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-transparent to-green-500/15"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center bg-emerald-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <span className="text-emerald-200 font-semibold">🏢 Find Collection Centers</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Collection <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">Centers</span>
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">Use our advanced search to locate collection centers by your preferences</p>
        </div>

        {/* Search and Filter Section */}
        <div className={`bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-12 shadow-2xl transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by center name, district, province, or services..."
                className="w-full px-6 py-4 pl-14 text-lg bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-2xl focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 transition-all duration-300"
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* District Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-3">📍 District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Province Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-3">🗺️ Province</label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300"
              >
                <option value="">All Provinces</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-3">⚡ Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300"
              >
                <option value="">All Status</option>
                {statusTypes.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Capacity Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-3">📦 Capacity</label>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300"
              >
                <option value="">All Capacities</option>
                {capacityTypes.map(capacity => (
                  <option key={capacity} value={capacity}>{capacity} Scale</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={clearAllFilters}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              🗑️ Clear Filters
            </button>
            <button
              onClick={handleViewAllCenters}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              👁️ View All Centers
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Results Header */}
          {(filteredCenters.length > 0 || showAllCenters) && (
            <div className="bg-emerald-500/20 backdrop-blur-sm rounded-2xl border border-emerald-400/30 p-6 mb-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">
                  📋 Search Results: {filteredCenters.length} {filteredCenters.length === 1 ? 'center' : 'centers'} found
                </h3>
                <div className="text-emerald-200">
                  {searchTerm && <span className="bg-emerald-600/50 px-3 py-1 rounded-full mr-2">🔍 "{searchTerm}"</span>}
                  {selectedDistrict && <span className="bg-emerald-600/50 px-3 py-1 rounded-full mr-2">📍 {selectedDistrict}</span>}
                  {selectedProvince && <span className="bg-emerald-600/50 px-3 py-1 rounded-full mr-2">🗺️ {selectedProvince}</span>}
                  {selectedStatus && <span className="bg-emerald-600/50 px-3 py-1 rounded-full mr-2">⚡ {selectedStatus}</span>}
                  {selectedCapacity && <span className="bg-emerald-600/50 px-3 py-1 rounded-full mr-2">📦 {selectedCapacity}</span>}
                  {showAllCenters && <span className="bg-emerald-600/50 px-3 py-1 rounded-full">👁️ All Centers</span>}
                </div>
              </div>
            </div>
          )}

          {/* No Results State */}
          {filteredCenters.length === 0 && !showAllCenters && (searchTerm || selectedDistrict || selectedProvince || selectedStatus || selectedCapacity) && (
            <div className="text-center py-20">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-12 max-w-2xl mx-auto">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-3xl font-bold text-white mb-4">No Centers Found</h3>
                <p className="text-emerald-200 text-lg mb-8">
                  No collection centers match your current search criteria. Try adjusting your filters or search terms.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={clearAllFilters}
                    className="block mx-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    🔄 Clear All Filters
                  </button>
                  <button
                    onClick={handleViewAllCenters}
                    className="block mx-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    👁️ View All Centers
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Centers Grid */}
          {filteredCenters.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredCenters.map((center) => (
                <div
                  key={center.id}
                  className="group bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl hover:bg-white/20 hover:border-emerald-400/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                >
                  {/* Center Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">🏢</div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors duration-300">
                          {center.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-emerald-200">⭐⭐⭐⭐⭐</span>
                          <span className="text-emerald-300 text-sm">({center.rating})</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-full">
                      {center.status}
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-emerald-100">
                      <span className="mr-3">📍</span>
                      <span className="text-sm">{center.address}</span>
                    </div>
                    <div className="flex items-center text-emerald-100">
                      <span className="mr-3">🗺️</span>
                      <span className="text-sm">{center.district}, {center.province}</span>
                    </div>
                    <div className="flex items-center text-emerald-100">
                      <span className="mr-3">📦</span>
                      <span className="text-sm">{center.capacityMT} - {center.capacity} Scale</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-6">
                    <h4 className="text-emerald-200 font-semibold mb-3">Services Offered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {center.services.map((service, idx) => (
                        <span key={idx} className="bg-emerald-600/30 text-emerald-100 px-3 py-1 rounded-full text-xs">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm text-emerald-100">
                    <div className="flex items-center">
                      <span className="mr-3">📞</span>
                      <span>{center.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3">✉️</span>
                      <span>{center.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3">⏰</span>
                      <span>{center.operatingHours}</span>
                    </div>
                  </div>

                  {/* Established Year */}
                  <div className="mt-4 pt-4 border-t border-emerald-400/20">
                    <div className="flex justify-between items-center text-emerald-200 text-sm">
                      <span>Established: {center.established}</span>
                      <span className="font-semibold">{center.rating}⭐</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CollectionCenters;
