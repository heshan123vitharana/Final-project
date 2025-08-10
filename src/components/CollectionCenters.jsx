import React, { useState, useEffect, useRef } from 'react';
import centersData from '../data/collectionCenters.json';

const CollectionCenters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showAllCenters, setShowAllCenters] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const districtRef = useRef(null);

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

  // Close district dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (showDistrictDropdown && districtRef.current && !districtRef.current.contains(e.target)) {
        setShowDistrictDropdown(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onClick);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onClick);
    };
  }, [showDistrictDropdown]);

  // Load centers from JSON data file
  const centers = centersData;

  // Extract unique values for filters
  const districts = [...new Set(centers.map(c => c.district))].sort();
  const provinces = [...new Set(centers.map(c => c.province))].sort();
  const capacityTypes = [...new Set(centers.map(c => c.capacity))].sort();
  const statusTypes = [...new Set(centers.map(c => c.status))].sort();
  const allServices = [...new Set(centers.flatMap(c => c.services))].sort();

  // Filter and sort centers - FIXED VERSION
  const getFilteredCenters = () => {
    let filtered = centers;

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(center =>
        center.name.toLowerCase().includes(search) ||
        center.district.toLowerCase().includes(search) ||
        center.province.toLowerCase().includes(search) ||
        center.address.toLowerCase().includes(search) ||
        center.manager.toLowerCase().includes(search) ||
        center.services.some(service => service.toLowerCase().includes(search))
      );
    }

    // Apply other filters
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
    if (selectedService) {
      filtered = filtered.filter(center => center.services.includes(selectedService));
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'district':
          return a.district.localeCompare(b.district);
        case 'capacity': {
          const parseCap = (s) => {
            if (!s) return 0;
            const m = String(s).match(/(\d+(?:\.\d+)?)\s*MT/i);
            return m ? parseFloat(m[1]) : 0;
          };
          return parseCap(b.capacityMT) - parseCap(a.capacityMT);
        }
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'established':
          return String(a.established || '').localeCompare(String(b.established || ''));
        default:
          return 0;
      }
    });

    return showAllCenters ? filtered : filtered.slice(0, 6);
  };

  const filteredCenters = getFilteredCenters();

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('');
    setSelectedProvince('');
    setSelectedStatus('');
    setSelectedCapacity('');
    setSelectedService('');
    setShowAllCenters(false);
  };

  const handleViewAllCenters = () => {
    setShowAllCenters(true);
  };

  // Get capacity color
  const getCapacityColor = (capacity) => {
    switch (capacity) {
      case 'Large': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Small': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Under Maintenance': return 'bg-orange-500';
      case 'Inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Add Center feature removed as requested

  return (
    <section id="collection-centers" className="relative min-h-screen py-20">
      {/* Professional Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 overflow-hidden pointer-events-none"></div>
  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-transparent to-green-500/15 pointer-events-none"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

  <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center bg-emerald-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <span className="text-emerald-200 font-semibold">🏢 Find Collection Centers</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Collection <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">Centers</span>
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Discover our {centers.length} collection centers across Sri Lanka with advanced search and filtering
          </p>
        </div>

        {/* Enhanced Search and Filter Section */}
  <div className={`relative z-20 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-12 shadow-2xl transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Search Bar with Real-time Search */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by center name, district, province, manager, or services..."
                className="w-full px-6 py-4 pl-14 text-lg bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-2xl focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 transition-all duration-300"
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {/* District Filter */}
            <div className="relative" ref={districtRef}>
              <label className="block text-emerald-200 font-semibold mb-2 text-sm">📍 District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>

              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDistrictDropdown((v) => !v)}
                  className="px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  + Add District
                </button>
                {selectedDistrict && (
                  <span className="text-xs text-emerald-200">Selected: {selectedDistrict}</span>
                )}
              </div>

              {showDistrictDropdown && (
                <div className="absolute z-50 mt-2 w-full max-h-64 overflow-auto bg-white text-gray-800 rounded-xl shadow-xl border border-emerald-200 pointer-events-auto">
                  {districts.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => { setSelectedDistrict(d); setShowDistrictDropdown(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-emerald-50 ${selectedDistrict === d ? 'bg-emerald-100 font-semibold' : ''}`}
                    >
                      {d}
                    </button>
                  ))}
                  <div className="border-t">
                    <button
                      type="button"
                      onClick={() => { setSelectedDistrict(''); setShowDistrictDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Clear selection
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Province Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-2 text-sm">🗺️ Province</label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="">All Provinces</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-2 text-sm">⚡ Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="">All Status</option>
                {statusTypes.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Capacity Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-2 text-sm">📦 Capacity</label>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="">All Capacities</option>
                {capacityTypes.map(capacity => (
                  <option key={capacity} value={capacity}>{capacity}</option>
                ))}
              </select>
            </div>

            {/* Service Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-2 text-sm">🔧 Services</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="">All Services</option>
                {allServices.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-2 text-sm">📊 Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="name">Name</option>
                <option value="district">District</option>
                <option value="capacity">Capacity</option>
                <option value="rating">Rating</option>
                <option value="established">Established</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 rounded-xl transition-all duration-300 hover:scale-105"
              >
                🗑️ Clear Filters
              </button>
              
              <button
                onClick={handleViewAllCenters}
                className="px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded-xl transition-all duration-300 hover:scale-105"
              >
                👁️ View All Centers
              </button>

              {/* Show All toggle in filters as requested */}
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-emerald-100 text-sm">
                <input type="checkbox" checked={showAllCenters} onChange={(e) => setShowAllCenters(e.target.checked)} className="accent-emerald-500" />
                Show all centers
              </label>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/10 rounded-xl border border-white/20 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-emerald-200 hover:bg-white/10'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-emerald-200 hover:bg-white/10'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Results Counter */}
            <div className="text-emerald-200 font-semibold">
              {filteredCenters.length} of {centers.length} centers
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {filteredCenters.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-emerald-500/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Centers Found</h3>
              <p className="text-emerald-200 mb-6">Try adjusting your search criteria or filters</p>
              <button
                onClick={clearAllFilters}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300 hover:scale-105"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <>
              {/* Centers Grid/List */}
              <div className={`${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                : 'space-y-6'
              } mb-12`}>
                {filteredCenters.map((center, index) => (
                  <div 
                    key={center.id} 
                    className={`group ${viewMode === 'list' ? 'flex' : ''} bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl border border-emerald-200 hover:border-emerald-300 transition-all duration-500 hover:-translate-y-2 transform`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Center Content */}
                    <div className={`${viewMode === 'list' ? 'flex-1' : ''} p-6`}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                            {center.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{center.district}, {center.province}</span>
                          </div>
                        </div>
                        
                        {/* Status & Rating */}
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`${getStatusColor(center.status)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                            {center.status}
                          </span>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-700">{center.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Capacity</p>
                          <div className="flex items-center space-x-2">
                            <span className={`${getCapacityColor(center.capacity)} w-3 h-3 rounded-full`}></span>
                            <span className="text-sm font-semibold text-gray-700">{center.capacity}</span>
                          </div>
                          <p className="text-xs text-gray-500">{center.capacityMT}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Manager</p>
                          <p className="text-sm font-semibold text-gray-700">{center.manager}</p>
                          <p className="text-xs text-gray-500">{center.staffCount} staff</p>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Services</p>
                        <div className="flex flex-wrap gap-2">
                          {center.services.slice(0, viewMode === 'list' ? 6 : 3).map((service, idx) => (
                            <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                              {service}
                            </span>
                          ))}
                          {center.services.length > (viewMode === 'list' ? 6 : 3) && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                              +{center.services.length - (viewMode === 'list' ? 6 : 3)} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="border-t pt-4">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{center.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{center.operatingHours}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Est. {center.established}</span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <a
                            href={`tel:${center.phone.replace(/\s+/g, '')}`}
                            className="px-4 py-2 text-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                          >
                            Call
                          </a>
                          <a
                            href={`mailto:${center.email}`}
                            className="px-4 py-2 text-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                          >
                            Email
                          </a>
                          <a
                            href={`https://www.google.com/maps?q=${encodeURIComponent(center.address)}${center.coordinates ? `@${center.coordinates.lat},${center.coordinates.lng},15z` : ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                          >
                            Directions
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {!showAllCenters && filteredCenters.length >= 6 && (
                <div className="text-center">
                  <button
                    onClick={handleViewAllCenters}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                  >
                    View All {centers.length} Centers
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

  {/* Add Center feature removed as requested */}
    </section>
  );
};

export default CollectionCenters;
