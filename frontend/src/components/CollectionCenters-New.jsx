import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PageTitle from './PageTitle';

const CollectionCenters = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Enhanced collection centers data
  const centers = useMemo(() => [
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
      facilities: ["Modern Storage", "Quality Testing Lab", "Vehicle Parking", "Drying Equipment", "Packaging Unit"],
      coordinates: "6.9271° N, 79.8612° E",
      manager: "Mr. K.P. Silva",
      operatingHours: "6:00 AM - 6:00 PM",
      establishedYear: 1985,
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
      facilities: ["Climate Control", "Processing Unit", "Farmer Rest Area", "Quality Testing"],
      coordinates: "7.2906° N, 80.6337° E",
      manager: "Ms. A.M. Perera",
      operatingHours: "6:00 AM - 6:00 PM",
      establishedYear: 1992,
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
      facilities: ["Large Scale Storage", "Advanced Milling", "Quality Control", "Transport Hub"],
      coordinates: "8.3114° N, 80.4037° E",
      manager: "Mr. S.R. Fernando",
      operatingHours: "5:30 AM - 7:00 PM",
      establishedYear: 1978,
      rating: 4.9
    },
    {
      id: 4,
      name: "Polonnaruwa Collection Point",
      district: "Polonnaruwa",
      province: "North Central",
      address: "Agricultural Zone, Kaduruwela",
      phone: "+94 27 222 7890",
      email: "polonnaruwa@pmb.gov.lk",
      capacity: "6,000 MT",
      currentStock: "4,200 MT",
      status: "Active",
      facilities: ["Modern Storage", "Quality Testing", "Transport Coordination"],
      coordinates: "7.9403° N, 81.0188° E",
      manager: "Mrs. N.K. Jayasinghe",
      operatingHours: "6:00 AM - 6:00 PM",
      establishedYear: 1988,
      rating: 4.5
    },
    {
      id: 5,
      name: "Batticaloa Eastern Center",
      district: "Batticaloa",
      province: "Eastern",
      address: "Paddy Board Complex, Kallady",
      phone: "+94 65 222 5678",
      email: "batticaloa@pmb.gov.lk",
      capacity: "4,500 MT",
      currentStock: "2,900 MT",
      status: "Active",
      facilities: ["Secure Storage", "Quality Testing", "Coastal Transport"],
      coordinates: "7.7102° N, 81.6924° E",
      manager: "Mr. T.M. Rajesh",
      operatingHours: "6:00 AM - 6:00 PM",
      establishedYear: 1995,
      rating: 4.3
    },
    {
      id: 6,
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
      coordinates: "5.9485° N, 80.5353° E",
      manager: "Ms. P.L. Mendis",
      operatingHours: "6:00 AM - 6:00 PM",
      establishedYear: 1990,
      rating: 4.4
    },
    {
      id: 7,
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
      coordinates: "9.6615° N, 80.0255° E",
      manager: "Mr. K. Kumar",
      operatingHours: "Temporarily Closed",
      establishedYear: 1987,
      rating: 4.0
    },
    {
      id: 8,
      name: "Kurunegala Processing Center",
      district: "Kurunegala",
      province: "North Western",
      address: "Industrial Estate, Kurunegala",
      phone: "+94 37 222 1234",
      email: "kurunegala@pmb.gov.lk",
      capacity: "7,500 MT",
      currentStock: "5,100 MT",
      status: "Active",
      facilities: ["Advanced Processing", "Large Storage", "Quality Lab", "Packaging"],
      coordinates: "7.4863° N, 80.3647° E",
      manager: "Mrs. R.S. Wijesinghe",
      operatingHours: "5:30 AM - 7:00 PM",
      establishedYear: 1982,
      rating: 4.7
    }
  ], []);

  // Get unique districts and provinces
  const districts = useMemo(() => 
    [...new Set(centers.map(center => center.district))].sort(),
    [centers]
  );

  // Filter centers based on search criteria
  const filteredCenters = useMemo(() => {
    return centers.filter(center => {
      const matchesSearch = !searchTerm || 
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDistrict = !selectedDistrict || center.district === selectedDistrict;
      const matchesStatus = !selectedStatus || center.status === selectedStatus;
      
      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }, [centers, searchTerm, selectedDistrict, selectedStatus]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeCenters = centers.filter(c => c.status === 'Active').length;
    const totalCapacity = centers.reduce((sum, center) => {
      return sum + parseFloat(center.capacity.replace(/,/g, '').replace(' MT', ''));
    }, 0);
    const currentStock = centers.reduce((sum, center) => {
      return sum + parseFloat(center.currentStock.replace(/,/g, '').replace(' MT', ''));
    }, 0);
    
    return {
      totalCenters: centers.length,
      activeCenters,
      totalCapacity: totalCapacity.toLocaleString(),
      currentStock: currentStock.toLocaleString(),
      utilizationRate: Math.round((currentStock / totalCapacity) * 100)
    };
  }, [centers]);

  // Event handlers
  const handleCenterClick = useCallback((center) => {
    setSelectedCenter(center);
  }, []);

  const handleContactClick = useCallback((center) => {
    setSelectedCenter(center);
    setShowContactModal(true);
  }, []);

  const handleGetDirections = useCallback((center) => {
    const encodedAddress = encodeURIComponent(center.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedDistrict('');
    setSelectedStatus('');
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Title */}
        <div className="text-center mb-16">
          <PageTitle 
            title="Collection Centers Network" 
            subtitle="Modern facilities across Sri Lanka serving farmers nationwide"
            description="Discover our strategically located collection centers equipped with state-of-the-art facilities for paddy storage, processing, and quality control."
          />
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-5a1 1 0 011-1h4a1 1 0 011 1v5" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.totalCenters}</p>
            <p className="text-sm text-gray-600 font-medium">Total Centers</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.activeCenters}</p>
            <p className="text-sm text-gray-600 font-medium">Active Centers</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-green-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.totalCapacity}</p>
            <p className="text-sm text-gray-600 font-medium">Total Capacity (MT)</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-green-100">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.currentStock}</p>
            <p className="text-sm text-gray-600 font-medium">Current Stock (MT)</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-green-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.utilizationRate}%</p>
            <p className="text-sm text-gray-600 font-medium">Utilization Rate</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-green-100">
          <div className="flex flex-col lg:flex-row gap-6 items-end">
            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Centers
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, district, or address..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                />
                <svg className="w-5 h-5 text-green-500 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* District Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Grid View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedDistrict || selectedStatus) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-green-600">{filteredCenters.length}</span> of {centers.length} centers
            </p>
          </div>
        </div>

        {/* Centers Display */}
        {filteredCenters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Centers Found</h3>
            <p className="text-gray-600 mb-6">No collection centers match your current search criteria.</p>
            <button
              onClick={clearFilters}
              className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }>
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                className={`bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group ${
                  viewMode === 'list' ? 'flex flex-col lg:flex-row' : ''
                }`}
              >
                {/* Center Image Placeholder */}
                <div className={`bg-gradient-to-br from-green-400 to-green-600 ${
                  viewMode === 'list' ? 'lg:w-72 lg:flex-shrink-0' : 'h-48'
                } rounded-t-2xl ${viewMode === 'list' ? 'lg:rounded-l-2xl lg:rounded-tr-none' : ''} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <svg className="w-16 h-16 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-5a1 1 0 011-1h4a1 1 0 011 1v5" />
                  </svg>
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    center.status === 'Active'
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {center.status}
                  </div>
                </div>

                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Center Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                        {center.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{center.district}, {center.province}</span>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">{center.rating}</span>
                    </div>
                  </div>

                  {/* Center Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Capacity</p>
                        <p className="text-sm font-bold text-gray-800">{center.capacity}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Current Stock</p>
                        <p className="text-sm font-bold text-gray-800">{center.currentStock}</p>
                      </div>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Facilities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {center.facilities.slice(0, viewMode === 'list' ? 6 : 4).map((facility, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-200"
                        >
                          {facility}
                        </span>
                      ))}
                      {center.facilities.length > (viewMode === 'list' ? 6 : 4) && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{center.facilities.length - (viewMode === 'list' ? 6 : 4)} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleGetDirections(center)}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" />
                      </svg>
                      Directions
                    </button>
                    <button
                      onClick={() => handleContactClick(center)}
                      className="flex-1 border-2 border-green-600 text-green-600 py-3 px-4 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Map Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">Collection Centers Map</h3>
            <p className="text-gray-600 text-center mb-8">
              Interactive map showing all collection center locations across Sri Lanka
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-blue-50 h-96 flex items-center justify-center relative">
            {/* Map Placeholder */}
            <div className="text-center">
              <svg className="w-20 h-20 mx-auto mb-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" />
              </svg>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Interactive Map</h4>
              <p className="text-gray-600 mb-6 max-w-md">
                Explore detailed locations of all collection centers with real-time information and navigation capabilities.
              </p>
              <button className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center mx-auto">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Launch Full Map
              </button>
            </div>
            
            {/* Map markers representation */}
            <div className="absolute inset-0 pointer-events-none">
              {filteredCenters.slice(0, 6).map((center, index) => (
                <div
                  key={center.id}
                  className="absolute w-4 h-4 bg-red-500 rounded-full shadow-lg animate-pulse"
                  style={{
                    left: `${20 + (index % 3) * 30}%`,
                    top: `${30 + Math.floor(index / 3) * 40}%`,
                  }}
                  title={center.name}
                >
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 bg-opacity-30 rounded-full animate-ping"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedCenter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedCenter.name}</h3>
                  <p className="text-gray-600">{selectedCenter.district}, {selectedCenter.province}</p>
                </div>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 text-lg">Contact Information</h4>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Phone</p>
                      <a href={`tel:${selectedCenter.phone}`} className="text-gray-800 hover:text-green-600 transition-colors font-medium">
                        {selectedCenter.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Email</p>
                      <a href={`mailto:${selectedCenter.email}`} className="text-gray-800 hover:text-blue-600 transition-colors font-medium">
                        {selectedCenter.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Address</p>
                      <p className="text-gray-800 font-medium">{selectedCenter.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 text-lg">Center Details</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Manager:</span>
                      <span className="font-medium text-gray-800">{selectedCenter.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operating Hours:</span>
                      <span className="font-medium text-gray-800">{selectedCenter.operatingHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Established:</span>
                      <span className="font-medium text-gray-800">{selectedCenter.establishedYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium text-green-600">{selectedCenter.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Stock:</span>
                      <span className="font-medium text-blue-600">{selectedCenter.currentStock}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 text-lg mb-3">Available Facilities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCenter.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full font-medium border border-green-200"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => handleGetDirections(selectedCenter)}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" />
                  </svg>
                  Get Directions
                </button>
                <button
                  onClick={() => window.open(`tel:${selectedCenter.phone}`)}
                  className="flex-1 border-2 border-green-600 text-green-600 py-3 px-6 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CollectionCenters;
