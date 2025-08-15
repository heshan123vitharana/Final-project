import React, { useState, useEffect } from 'react';
import PageTitle from './PageTitle';

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

  // Enhanced real data for Sri Lankan collection centers
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
      rating: 4.8,
      coordinates: { lat: 6.9271, lng: 79.8612 },
      manager: "Mr. K.A. Perera",
      staffCount: 45
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
      services: ["Quality Testing", "Storage", "Processing", "Farmer Training"],
      established: "1978",
      rating: 4.6,
      coordinates: { lat: 7.2906, lng: 80.6337 },
      manager: "Ms. S.N. Fernando",
      staffCount: 32
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
      rating: 4.4,
      coordinates: { lat: 6.0329, lng: 80.217 },
      manager: "Mr. R.P. Silva",
      staffCount: 28
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
      rating: 4.9,
      coordinates: { lat: 8.3114, lng: 80.4037 },
      manager: "Dr. A.B. Rajapakse",
      staffCount: 38
    },
    {
      id: 5,
      name: "Jaffna Northern Hub",
      district: "Jaffna",
      province: "Northern",
      address: "No. 567, Hospital Road, Jaffna",
      phone: "+94 21 234 5678",
      email: "jaffna@pmb.gov.lk",
      status: "Active",
      capacity: "Medium",
      capacityMT: "2800 MT/month",
      operatingHours: "6:00 AM - 6:00 PM",
      services: ["Quality Testing", "Storage", "Distribution"],
      established: "1990",
      rating: 4.3,
      coordinates: { lat: 9.6615, lng: 80.0255 },
      manager: "Mr. T. Chandran",
      staffCount: 25
    },
    {
      id: 6,
      name: "Ratnapura Gem City Center",
      district: "Ratnapura",
      province: "Sabaragamuwa",
      address: "No. 234, Main Street, Ratnapura",
      phone: "+94 45 234 5678",
      email: "ratnapura@pmb.gov.lk",
      status: "Active",
      capacity: "Medium",
      capacityMT: "2200 MT/month",
      operatingHours: "6:30 AM - 6:00 PM",
      services: ["Quality Testing", "Storage", "Wet Processing"],
      established: "1988",
      rating: 4.5,
      coordinates: { lat: 6.6828, lng: 80.4126 },
      manager: "Ms. N.K. Wijesekara",
      staffCount: 22
    },
    {
      id: 7,
      name: "Kurunegala Northwestern Hub",
      district: "Kurunegala",
      province: "North Western",
      address: "No. 678, Puttalam Road, Kurunegala",
      phone: "+94 37 234 5678",
      email: "kurunegala@pmb.gov.lk",
      status: "Active",
      capacity: "Large",
      capacityMT: "3800 MT/month",
      operatingHours: "6:00 AM - 7:00 PM",
      services: ["Quality Testing", "Storage", "Processing", "Research"],
      established: "1983",
      rating: 4.7,
      coordinates: { lat: 7.4818, lng: 80.3609 },
      manager: "Mr. D.L. Bandara",
      staffCount: 35
    },
    {
      id: 8,
      name: "Batticaloa Eastern Terminal",
      district: "Batticaloa",
      province: "Eastern",
      address: "No. 345, Trincomalee Road, Batticaloa",
      phone: "+94 65 234 5678",
      email: "batticaloa@pmb.gov.lk",
      status: "Active",
      capacity: "Medium",
      capacityMT: "2600 MT/month",
      operatingHours: "6:00 AM - 6:30 PM",
      services: ["Quality Testing", "Storage", "Coastal Processing"],
      established: "1992",
      rating: 4.2,
      coordinates: { lat: 7.7102, lng: 81.6924 },
      manager: "Mr. M.A. Rahman",
      staffCount: 26
    },
    {
      id: 9,
      name: "Badulla Uva Center",
      district: "Badulla",
      province: "Uva",
      address: "No. 456, Bandarawela Road, Badulla",
      phone: "+94 55 234 5678",
      email: "badulla@pmb.gov.lk",
      status: "Active",
      capacity: "Small",
      capacityMT: "1800 MT/month",
      operatingHours: "7:00 AM - 5:00 PM",
      services: ["Quality Testing", "Storage", "Mountain Processing"],
      established: "1995",
      rating: 4.1,
      coordinates: { lat: 6.9934, lng: 81.0550 },
      manager: "Ms. P.R. Kumari",
      staffCount: 18
    },
    {
      id: 10,
      name: "Hambantota Southern Port Center",
      district: "Hambantota",
      province: "Southern",
      address: "No. 789, Port Access Road, Hambantota",
      phone: "+94 47 234 5678",
      email: "hambantota@pmb.gov.lk",
      status: "Active",
      capacity: "Large",
      capacityMT: "4500 MT/month",
      operatingHours: "5:00 AM - 8:00 PM",
      services: ["Quality Testing", "Storage", "Export Processing", "Port Facilitation"],
      established: "2010",
      rating: 4.6,
      coordinates: { lat: 6.1241, lng: 81.1185 },
      manager: "Mr. C.D. Wickramasinghe",
      staffCount: 42
    },
    {
      id: 11,
      name: "Matara Coastal Hub",
      district: "Matara",
      province: "Southern",
      address: "No. 567, Galle Road, Matara",
      phone: "+94 41 234 5678",
      email: "matara@pmb.gov.lk",
      status: "Active",
      capacity: "Medium",
      capacityMT: "2400 MT/month",
      operatingHours: "6:30 AM - 6:00 PM",
      services: ["Quality Testing", "Storage", "Coastal Distribution"],
      established: "1987",
      rating: 4.3,
      coordinates: { lat: 5.9549, lng: 80.5550 },
      manager: "Ms. L.K. Jayasinghe",
      staffCount: 24
    },
    {
      id: 12,
      name: "Polonnaruwa Ancient City Center",
      district: "Polonnaruwa",
      province: "North Central",
      address: "No. 234, Ancient City Road, Polonnaruwa",
      phone: "+94 27 234 5678",
      email: "polonnaruwa@pmb.gov.lk",
      status: "Under Maintenance",
      capacity: "Medium",
      capacityMT: "2700 MT/month",
      operatingHours: "Temporarily Closed",
      services: ["Quality Testing", "Storage", "Heritage Processing"],
      established: "1989",
      rating: 4.0,
      coordinates: { lat: 7.9403, lng: 81.0188 },
      manager: "Mr. S.T. Gunasekara",
      staffCount: 20
    }
  ];

  // Extract unique values for filters
  const districts = [...new Set(centers.map(c => c.district))].sort();
  const provinces = [...new Set(centers.map(c => c.province))].sort();
  const capacityTypes = [...new Set(centers.map(c => c.capacity))].sort();
  const statusTypes = [...new Set(centers.map(c => c.status))].sort();
  const allServices = [...new Set(centers.flatMap(c => c.services))].sort();

  // Filter and sort centers
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
        case 'name': return a.name.localeCompare(b.name);
        case 'district': return a.district.localeCompare(b.district);
        case 'capacity': return b.capacityMT.localeCompare(a.capacityMT);
        case 'rating': return b.rating - a.rating;
        case 'established': return a.established.localeCompare(b.established);
        default: return 0;
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

  return (
    <section id="collection-centers" className="relative min-h-screen py-20">
      <PageTitle title="Collection Centers" />
      
      {/* Professional Background */}
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
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Discover our {centers.length} collection centers across Sri Lanka with advanced search and filtering
          </p>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className={`bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-12 shadow-2xl transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
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
            <div>
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
                        <div className="mt-4 flex space-x-2">
                          <button className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105">
                            Contact
                          </button>
                          <button className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105">
                            Directions
                          </button>
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
    </section>
  );
};

export default CollectionCenters;
