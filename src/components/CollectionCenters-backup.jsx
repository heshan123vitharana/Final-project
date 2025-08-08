import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageTitle from './PageTitle';

const CollectionCenters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showAllCenters, setShowAllCenters] = useState(false);
  const { t } = useTranslation();

  // Collection Centers Data
  const centers = useMemo(() => [
    {
      name: "Colombo Main Center",
      district: "Colombo",
      address: "No. 123, Galle Road, Colombo 03",
      phone: "+94 11 234 5678",
      capacity: "5,000 MT",
      facilities: ["Modern Storage", "Quality Testing Lab", "Vehicle Parking"],
      coordinates: "6.9271° N, 79.8612° E",
      status: "Active"
    },
    {
      name: "Kandy Regional Center",
      district: "Kandy",
      address: "No. 45, Peradeniya Road, Kandy",
      phone: "+94 81 223 4567",
      capacity: "3,500 MT",
      facilities: ["Climate Control", "Processing Unit", "Farmer Rest Area"],
      coordinates: "7.2906° N, 80.6337° E",
      status: "Active"
    },
    {
      name: "Anuradhapura Center",
      district: "Anuradhapura",
      address: "No. 78, Main Street, Anuradhapura",
      phone: "+94 25 222 3456",
      capacity: "4,200 MT",
      facilities: ["Bulk Storage", "Weighing Station", "Drying Facility"],
      coordinates: "8.3114° N, 80.4037° E",
      status: "Active"
    },
    {
      name: "Polonnaruwa Center",
      district: "Polonnaruwa",
      address: "No. 12, Batticaloa Road, Polonnaruwa",
      phone: "+94 27 222 4567",
      capacity: "3,800 MT",
      facilities: ["Modern Storage", "Quality Control", "Transportation Hub"],
      coordinates: "7.9403° N, 81.0188° E",
      status: "Active"
    },
    {
      name: "Kurunegala Center",
      district: "Kurunegala",
      address: "No. 56, Puttalam Road, Kurunegala",
      phone: "+94 37 222 5678",
      capacity: "2,900 MT",
      facilities: ["Storage Silos", "Testing Lab", "Farmer Training Hall"],
      coordinates: "7.4818° N, 80.3609° E",
      status: "Active"
    },
    {
      name: "Ampara New Center",
      district: "Ampara",
      address: "No. 89, Colombo Road, Ampara",
      phone: "+94 63 222 6789",
      capacity: "2,500 MT",
      facilities: ["Basic Storage", "Weighing", "Admin Office"],
      coordinates: "7.2980° N, 81.6681° E",
      status: "Under Construction"
    }
  ], []); // Empty dependency array since centers data is static

  // Get unique districts for filter dropdown
  const uniqueDistricts = [t('collection_centers.all_districts'), ...new Set(centers.map(center => center.district))];

  // Filter centers based on search term and selected district
  const filteredCenters = useMemo(() => {
    let filtered = centers;

    // Filter by search term (name, district, or address)
    if (searchTerm) {
      filtered = filtered.filter(center =>
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected district
    if (selectedDistrict !== t('collection_centers.all_districts')) {
      filtered = filtered.filter(center => center.district === selectedDistrict);
    }

    // Show limited results if showAllCenters is false
    return showAllCenters ? filtered : filtered.slice(0, 3);
  }, [searchTerm, selectedDistrict, showAllCenters, centers, t]);

  const getStatusColor = (status) => {
    return status === t('collection_centers.status.active')
      ? "bg-green-100 text-green-800 border-green-200" 
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  return (
    <section id="centers" className="relative py-24 overflow-hidden">
      {/* Professional Hero-style Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/20 via-transparent to-emerald-100/20"></div>
      
      {/* Floating Professional Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-16 w-6 h-14 bg-blue-200/30 rounded-full animate-float-slow transform rotate-12"></div>
        <div className="absolute bottom-32 right-24 w-8 h-16 bg-emerald-200/30 rounded-full animate-float transform -rotate-6"></div>
        <div className="absolute top-1/2 left-8 w-4 h-10 bg-teal-200/25 rounded-full animate-float-reverse transform rotate-45"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Page Title Component */}
        <PageTitle 
          subtitle="Collection Network"
          title="Find Your Nearest Collection Center"
          description="Comprehensive network of modern facilities serving all 25 districts with state-of-the-art storage and quality control systems."
          className="bg-gradient-to-br from-blue-500/5 via-indigo-500/3 to-purple-500/5 mb-8"
          decoratorColor="blue"
          titleClassName="professional-title enhanced-text-display responsive-title-text"
          subtitleClassName="professional-subtitle responsive-subtitle-text"
          descriptionClassName="professional-description enhanced-text-display responsive-description-text"
        />

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('collection_centers.search_label')}</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('collection_centers.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-paddy-green focus:border-transparent transition-all duration-300"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('collection_centers.filter_district')}</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-paddy-green focus:border-transparent transition-all duration-300"
              >
                {uniqueDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Info and Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <div className="text-gray-600 mb-4 sm:mb-0">
              {searchTerm || selectedDistrict !== 'All' ? (
                <span>Found {filteredCenters.length} center(s) matching your criteria</span>
              ) : (
                <span>Showing {showAllCenters ? filteredCenters.length : Math.min(3, filteredCenters.length)} of {centers.length} centers</span>
              )}
            </div>
            
            {/* Show All / Show Less Toggle */}
            {!searchTerm && selectedDistrict === 'All' && (
              <button
                onClick={() => setShowAllCenters(!showAllCenters)}
                className="bg-gradient-to-r from-paddy-green to-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
              >
                {showAllCenters ? 'Show Less' : 'Show All Centers'}
              </button>
            )}

            {/* Clear Filters */}
            {(searchTerm || selectedDistrict !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDistrict('All');
                }}
                className="border-2 border-paddy-green text-paddy-green px-6 py-2 rounded-lg font-semibold hover:bg-paddy-green hover:text-white transition-all duration-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-r from-paddy-green to-green-600 rounded-2xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">{centers.length}</div>
            <div className="text-lg opacity-90">Total Centers</div>
          </div>
          <div className="bg-gradient-to-r from-rice-gold to-yellow-600 rounded-2xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">25</div>
            <div className="text-lg opacity-90">Districts Covered</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">22K+</div>
            <div className="text-lg opacity-90">Total Capacity (MT)</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">5</div>
            <div className="text-lg opacity-90">Active Centers</div>
          </div>
        </div>

        {/* Centers Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {filteredCenters.map((center, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              {/* Header */}
              <div className="bg-gradient-to-r from-paddy-green to-green-600 p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{center.name}</h3>
                    <p className="text-lg opacity-90">{center.district} District</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(center.status)}`}>
                    {center.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-paddy-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600">{center.address}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-paddy-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p className="text-gray-600">{center.phone}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-paddy-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-gray-600">Capacity: <span className="font-semibold text-paddy-green">{center.capacity}</span></p>
                  </div>
                </div>

                {/* Facilities */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Available Facilities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {center.facilities.map((facility, idx) => (
                      <span key={idx} className="px-3 py-1 bg-paddy-green bg-opacity-10 text-paddy-green rounded-full text-sm font-medium">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Coordinates */}
                <div className="text-sm text-gray-500 mb-4">
                  <span className="font-medium">Coordinates:</span> {center.coordinates}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-paddy-green to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105">
                    Get Directions
                  </button>
                  <button className="flex-1 border-2 border-paddy-green text-paddy-green py-3 rounded-lg font-semibold hover:bg-paddy-green hover:text-white transition-all duration-300">
                    Contact Center
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Center Locations Map</h3>
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <svg className="w-16 h-16 mx-auto mb-4 text-paddy-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" />
              </svg>
              <p className="text-lg font-medium">Interactive Map</p>
              <p className="text-sm">Detailed map showing all collection center locations across Sri Lanka</p>
              <button className="mt-4 bg-paddy-green text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                View Full Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionCenters;
