import React, { useState, useEffect } from 'react';

const LivePaddyPrices = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVariety, setSelectedVariety] = useState('');
  const [sortBy, setSortBy] = useState('district');
  const [sortOrder, setSortOrder] = useState('asc');
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

    const section = document.getElementById('live-paddy-prices');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  // Sample live paddy prices data for Sri Lankan districts
  const paddyPrices = [
    {
      id: 1,
      district: "Ampara",
      province: "Eastern",
      variety: "Nadu",
      pricePerKg: 85.50,
      trend: "up",
      change: 2.5,
      lastUpdated: "2 hours ago",
      collectionCenter: "Ampara Main Center",
      qualityGrade: "Grade A",
      availability: "High"
    },
    {
      id: 2,
      district: "Anuradhapura",
      province: "North Central",
      variety: "Samba",
      pricePerKg: 88.00,
      trend: "stable",
      change: 0.0,
      lastUpdated: "1 hour ago",
      collectionCenter: "Anuradhapura North Center",
      qualityGrade: "Grade A+",
      availability: "High"
    },
    {
      id: 3,
      district: "Badulla",
      province: "Uva",
      variety: "Nadu",
      pricePerKg: 82.75,
      trend: "down",
      change: -1.25,
      lastUpdated: "3 hours ago",
      collectionCenter: "Badulla Highland Center",
      qualityGrade: "Grade A",
      availability: "Medium"
    },
    {
      id: 4,
      district: "Batticaloa",
      province: "Eastern",
      variety: "Samba",
      pricePerKg: 86.25,
      trend: "up",
      change: 1.75,
      lastUpdated: "1 hour ago",
      collectionCenter: "Batticaloa Eastern Hub",
      qualityGrade: "Grade A",
      availability: "High"
    },
    {
      id: 5,
      district: "Colombo",
      province: "Western",
      variety: "Basmati",
      pricePerKg: 125.00,
      trend: "up",
      change: 5.00,
      lastUpdated: "30 minutes ago",
      collectionCenter: "Colombo Main Collection Center",
      qualityGrade: "Premium",
      availability: "Medium"
    },
    {
      id: 6,
      district: "Galle",
      province: "Southern",
      variety: "Nadu",
      pricePerKg: 84.00,
      trend: "stable",
      change: 0.0,
      lastUpdated: "2 hours ago",
      collectionCenter: "Galle Southern Terminal",
      qualityGrade: "Grade A",
      availability: "High"
    },
    {
      id: 7,
      district: "Gampaha",
      province: "Western",
      variety: "Samba",
      pricePerKg: 87.50,
      trend: "up",
      change: 2.00,
      lastUpdated: "45 minutes ago",
      collectionCenter: "Gampaha Regional Center",
      qualityGrade: "Grade A+",
      availability: "Medium"
    },
    {
      id: 8,
      district: "Hambantota",
      province: "Southern",
      variety: "Nadu",
      pricePerKg: 83.25,
      trend: "down",
      change: -0.75,
      lastUpdated: "4 hours ago",
      collectionCenter: "Hambantota Southern Hub",
      qualityGrade: "Grade A",
      availability: "Low"
    },
    {
      id: 9,
      district: "Jaffna",
      province: "Northern",
      variety: "Samba",
      pricePerKg: 89.00,
      trend: "up",
      change: 3.00,
      lastUpdated: "1 hour ago",
      collectionCenter: "Jaffna Northern Center",
      qualityGrade: "Grade A+",
      availability: "High"
    },
    {
      id: 10,
      district: "Kalutara",
      province: "Western",
      variety: "Nadu",
      pricePerKg: 85.75,
      trend: "stable",
      change: 0.0,
      lastUpdated: "2 hours ago",
      collectionCenter: "Kalutara Coastal Center",
      qualityGrade: "Grade A",
      availability: "High"
    },
    {
      id: 11,
      district: "Kandy",
      province: "Central",
      variety: "Red Rice",
      pricePerKg: 110.00,
      trend: "up",
      change: 4.50,
      lastUpdated: "1 hour ago",
      collectionCenter: "Kandy Central Hub",
      qualityGrade: "Premium",
      availability: "Medium"
    },
    {
      id: 12,
      district: "Kurunegala",
      province: "North Western",
      variety: "Nadu",
      pricePerKg: 84.25,
      trend: "up",
      change: 1.25,
      lastUpdated: "2 hours ago",
      collectionCenter: "Kurunegala Regional Hub",
      qualityGrade: "Grade A",
      availability: "High"
    }
  ];

  // Extract unique values for filters
  const districts = [...new Set(paddyPrices.map(p => p.district))].sort();
  const varieties = [...new Set(paddyPrices.map(p => p.variety))].sort();

  // Filter and sort prices
  const getFilteredAndSortedPrices = () => {
    let filtered = paddyPrices;

    if (selectedDistrict) {
      filtered = filtered.filter(price => price.district === selectedDistrict);
    }

    if (selectedVariety) {
      filtered = filtered.filter(price => price.variety === selectedVariety);
    }

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'district':
          aValue = a.district;
          bValue = b.district;
          break;
        case 'price':
          aValue = a.pricePerKg;
          bValue = b.pricePerKg;
          break;
        case 'variety':
          aValue = a.variety;
          bValue = b.variety;
          break;
        case 'change':
          aValue = a.change;
          bValue = b.change;
          break;
        default:
          aValue = a.district;
          bValue = b.district;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
    });

    return filtered;
  };

  const filteredPrices = getFilteredAndSortedPrices();

  const clearFilters = () => {
    setSelectedDistrict('');
    setSelectedVariety('');
    setSortBy('district');
    setSortOrder('asc');
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'stable': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'High': return 'bg-green-500/20 text-green-300 border-green-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
      case 'Low': return 'bg-red-500/20 text-red-300 border-red-400';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400';
    }
  };

  const avgPrice = filteredPrices.length > 0 
    ? (filteredPrices.reduce((sum, p) => sum + p.pricePerKg, 0) / filteredPrices.length).toFixed(2)
    : 0;
  
  const highestPrice = filteredPrices.length > 0 
    ? Math.max(...filteredPrices.map(p => p.pricePerKg)).toFixed(2)
    : 0;
  
  const lowestPrice = filteredPrices.length > 0 
    ? Math.min(...filteredPrices.map(p => p.pricePerKg)).toFixed(2)
    : 0;

  return (
    <section id="live-paddy-prices" className="relative min-h-screen py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 overflow-hidden"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-transparent to-green-500/15"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center bg-emerald-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <span className="text-emerald-200 font-semibold">💰 Live Market Prices</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Live Paddy <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">Prices</span>
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-4">
            Real-time paddy collection prices across all districts in Sri Lanka
          </p>
          <div className="text-emerald-300 text-sm">
            Last Updated: {new Date().toLocaleString('en-US', { 
              dateStyle: 'medium', 
              timeStyle: 'short' 
            })}
          </div>
        </div>

        {/* Price Statistics Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-white mb-2">Rs. {avgPrice}</div>
            <div className="text-emerald-200">Average Price/kg</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-green-400 mb-2">Rs. {highestPrice}</div>
            <div className="text-emerald-200">Highest Price/kg</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center">
            <div className="text-3xl mb-2">📉</div>
            <div className="text-2xl font-bold text-red-400 mb-2">Rs. {lowestPrice}</div>
            <div className="text-emerald-200">Lowest Price/kg</div>
          </div>
        </div>

        {/* Filter and Sort Section */}
        <div className={`bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-12 shadow-2xl transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

            <div>
              <label className="block text-emerald-200 font-semibold mb-3">🌾 Variety</label>
              <select
                value={selectedVariety}
                onChange={(e) => setSelectedVariety(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300"
              >
                <option value="">All Varieties</option>
                {varieties.map(variety => (
                  <option key={variety} value={variety}>{variety}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-emerald-200 font-semibold mb-3">📋 Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300"
              >
                <option value="district">District</option>
                <option value="price">Price</option>
                <option value="variety">Variety</option>
                <option value="change">Price Change</option>
              </select>
            </div>

            <div>
              <label className="block text-emerald-200 font-semibold mb-3">🔄 Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              🗑️ Clear Filters
            </button>
          </div>
        </div>

        {/* Prices Grid */}
        <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-emerald-500/20 backdrop-blur-sm rounded-2xl border border-emerald-400/30 p-6 mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">
                💰 Price Results: {filteredPrices.length} {filteredPrices.length === 1 ? 'district' : 'districts'}
              </h3>
              <div className="text-emerald-200">
                {selectedDistrict && <span className="bg-emerald-600/50 px-3 py-1 rounded-full mr-2">📍 {selectedDistrict}</span>}
                {selectedVariety && <span className="bg-emerald-600/50 px-3 py-1 rounded-full mr-2">🌾 {selectedVariety}</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrices.map((price) => (
              <div
                key={price.id}
                className="group bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-xl hover:bg-white/20 hover:border-emerald-400/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{price.district}</h3>
                    <p className="text-emerald-200 text-sm">{price.province} Province</p>
                  </div>
                  <div className={`px-3 py-1 border rounded-full text-xs font-semibold ${getAvailabilityColor(price.availability)}`}>
                    {price.availability}
                  </div>
                </div>

                <div className="bg-emerald-500/20 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-white">
                      Rs. {price.pricePerKg.toFixed(2)}
                    </div>
                    <div className={`flex items-center text-sm ${getTrendColor(price.trend)}`}>
                      <span className="mr-1">{getTrendIcon(price.trend)}</span>
                      {price.change !== 0 && (
                        <span>{price.change > 0 ? '+' : ''}{price.change.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-emerald-200 text-sm">per kilogram</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-200">🌾 Variety:</span>
                    <span className="text-white font-semibold">{price.variety}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-200">⭐ Grade:</span>
                    <span className="text-white font-semibold">{price.qualityGrade}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-200">🏢 Center:</span>
                    <span className="text-white font-semibold text-xs">{price.collectionCenter}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-400/20">
                  <div className="text-emerald-300 text-xs text-center">
                    Updated: {price.lastUpdated}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl border border-yellow-400/30 p-6 max-w-4xl mx-auto">
            <div className="text-yellow-400 text-2xl mb-3">⚠️</div>
            <h4 className="text-yellow-200 font-semibold mb-2">Price Disclaimer</h4>
            <p className="text-yellow-100 text-sm">
              Prices are indicative and subject to market fluctuations. Please contact respective collection centers for final pricing. 
              The Paddy Marketing Board is not responsible for any transactions based solely on these displayed prices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LivePaddyPrices;
