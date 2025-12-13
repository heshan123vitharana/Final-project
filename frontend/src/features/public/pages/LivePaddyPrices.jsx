import { useState, useEffect, useRef } from 'react';

const LivePaddyPrices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedVariety, setSelectedVariety] = useState('');
  const [sortBy, setSortBy] = useState('district');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const districtRef = useRef(null);
  const [selectedType, setSelectedType] = useState(''); // wet or dry
  const [pricesData, setPricesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch prices data from backend
  useEffect(() => {
    const fetchPricesData = async () => {
      try {
        setLoading(true);
        const response = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/prices');
        
        if (response.ok) {
          const data = await response.json();
          const processedData = data.data || data;
          
          // Ensure processedData is an array
          if (Array.isArray(processedData)) {
            setPricesData(processedData);
          } else {
            setPricesData([]);
          }
        } else {
          // Fallback to local data if backend is not available
          const fallbackData = await import('../../../data/paddyPrices.json');
          setPricesData(fallbackData.default);
        }
      } catch {
        // Fallback to local data
        try {
          const fallbackData = await import('../../../data/paddyPrices.json');
          setPricesData(fallbackData.default);
        } catch {
          setError('Failed to load price data');
          setPricesData([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPricesData();
    
    // Set up periodic refresh every 30 seconds to sync with database changes
    const refreshInterval = setInterval(() => {
      fetchPricesData();
    }, 30000); // 30 seconds
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Sample live paddy prices data for Sri Lankan districts
  // Standardized data transformation (matching PriceManagement format)
  const paddyPrices = (pricesData || []).map((p) => {
    const currentPrice = parseFloat(p.pricePerKg || p.currentPrice) || 0;
    const priceChange = parseFloat(p.priceChange || p.change) || 0;
    const previousPrice = parseFloat(p.previousPrice) || (currentPrice - priceChange);
    
    return {
      ...p,
      // Standardized price fields
      currentPrice: currentPrice,
      pricePerKg: currentPrice,
      previousPrice: previousPrice > 0 ? previousPrice : currentPrice,
      priceChange: priceChange,
      change: priceChange, // For compatibility
      
      // Standardized display fields
      unit: p.unit || 'LKR/kg',
      type: p.type || 'Wet',
      variety: p.variety || 'Unknown',
      district: p.district || 'Unknown',
      province: p.province || 'Unknown',
      market: p.market || `${p.district} Center`,
      
      // Trend normalization
      trend: p.trend === 'flat' ? 'stable' : (p.trend === 'rising' ? 'up' : p.trend === 'falling' ? 'down' : p.trend),
      
      // Date formatting
      lastUpdated: p.lastUpdated && /\d{4}-\d{2}-\d{2}T/.test(p.lastUpdated)
        ? new Date(p.lastUpdated).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
        : p.lastUpdated || p.updated_at || '—',
      
      // Calculated fields
      qualityGrade: p.qualityGrade || (currentPrice >= 260 ? 'Premium' : currentPrice >= 240 ? 'Grade A+' : 'Grade A'),
      collectionCenter: p.collectionCenter || `${p.district} Center`,
      availability: p.availability || 'Medium',
      status: p.status || 'Active'
    };
  });

  // Extract unique values for filters with null/undefined safety
  const districts = [...new Set(paddyPrices.map(p => p.district).filter(Boolean))].sort();
  const provinces = [...new Set(paddyPrices.map(p => p.province).filter(Boolean))].sort();
  const varieties = [...new Set(paddyPrices.map(p => p.variety).filter(Boolean))].sort();

  // Filter and sort prices
  const getFilteredAndSortedPrices = () => {
    let filtered = paddyPrices;

    // Text search across multiple fields
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        [p.district, p.province, p.market, p.variety, p.collectionCenter]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(q))
      );
    }

    if (selectedDistrict) {
      filtered = filtered.filter(price => price.district === selectedDistrict);
    }

    if (selectedProvince) {
      filtered = filtered.filter(price => price.province === selectedProvince);
    }

    if (selectedVariety) {
      filtered = filtered.filter(price => price.variety === selectedVariety);
    }
    // Filter by type (wet/dry)
    if (selectedType) {
      filtered = filtered.filter(price => (price.type || '').toLowerCase() === selectedType);
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

  const filteredPricesAll = getFilteredAndSortedPrices();
  const filteredPrices = showAll ? filteredPricesAll : filteredPricesAll.slice(0, 9);

  const clearFilters = () => {
  setSearchTerm('');
    setSelectedDistrict('');
  setSelectedProvince('');
    setSelectedVariety('');
    setSortBy('district');
    setSortOrder('asc');
    setSelectedType('');
  };

  const exportCSV = () => {
    if (!filteredPrices || filteredPrices.length === 0) return;
    const headers = ['District', 'Province', 'Market', 'Variety', 'PricePerKg', 'Trend', 'Change', 'Availability', 'LastUpdated'];
    const rows = filteredPrices.map(p => [
      p.district,
      p.province,
      p.market || '',
      p.variety,
      p.pricePerKg,
      p.trend,
      p.change || 0,
      p.availability,
      p.lastUpdated
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(val => {
        const v = String(val ?? '');
        return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v;
      }).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'paddy-prices.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Manual refresh function for instant data sync
  const handleManualRefresh = async () => {
    console.log('🔄 LivePaddyPrices: Manual refresh triggered');
    try {
      setLoading(true);
      const response = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/prices');
      if (response.ok) {
        const data = await response.json();
        const processedData = data.data || data;
        if (Array.isArray(processedData)) {
          setPricesData(processedData);
          console.log('✅ LivePaddyPrices: Data refreshed successfully');
        }
      }
    } catch (error) {
      console.error('❌ LivePaddyPrices: Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
      case 'rising': return '📈';
      case 'down': 
      case 'falling': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
      case 'rising': return 'text-green-400';
      case 'down':
      case 'falling': return 'text-red-400';
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

  // Safe calculations with error handling - Using ALL database data for statistics
  const calculateAvgPrice = () => {
    try {
      if (paddyPrices.length === 0) return '0';
      const validPrices = paddyPrices.filter(p => p.pricePerKg && !isNaN(p.pricePerKg));
      if (validPrices.length === 0) return '0';
      const average = (validPrices.reduce((sum, p) => sum + p.pricePerKg, 0) / validPrices.length);
      // Average calculated from database prices
      return average.toFixed(2);
    } catch (error) {
      console.error('Error calculating average price:', error);
      return '0';
    }
  };

  const calculateHighestPrice = () => {
    try {
      if (paddyPrices.length === 0) return '0';
      const validPrices = paddyPrices.filter(p => p.pricePerKg && !isNaN(p.pricePerKg));
      if (validPrices.length === 0) return '0';
      const highest = Math.max(...validPrices.map(p => p.pricePerKg));
      // Highest price calculated from database
      return highest.toFixed(2);
    } catch (error) {
      console.error('Error calculating highest price:', error);
      return '0';
    }
  };

  const calculateLowestPrice = () => {
    try {
      if (paddyPrices.length === 0) return '0';
      const validPrices = paddyPrices.filter(p => p.pricePerKg && !isNaN(p.pricePerKg));
      if (validPrices.length === 0) return '0';
      const lowest = Math.min(...validPrices.map(p => p.pricePerKg));
      // Lowest price calculated from database
      return lowest.toFixed(2);
    } catch (error) {
      console.error('Error calculating lowest price:', error);
      return '0';
    }
  };

  const avgPrice = calculateAvgPrice();
  const highestPrice = calculateHighestPrice();
  const lowestPrice = calculateLowestPrice();

  return (
    <section id="live-paddy-prices" className="relative min-h-screen py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 overflow-hidden pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-transparent to-green-500/15 pointer-events-none"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
            <p className="text-white mt-4">Loading live prices...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-200">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Header Section */}
            <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight tracking-tight">
            Live Paddy Prices
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-4">
            Real-time paddy collection prices across all districts in Sri Lanka
          </p>
          <div className="text-emerald-300 text-sm">
              Dataset timestamp: {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
        </div>

        {/* Price Statistics Cards - Database-wide Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-white mb-2">Rs. {avgPrice}</div>
            <div className="text-emerald-200">Average Price</div>
            <div className="text-xs text-emerald-300 mt-1">All {paddyPrices.length} entries</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-green-400 mb-2">Rs. {highestPrice}</div>
            <div className="text-emerald-200">Highest Price</div>
            <div className="text-xs text-emerald-300 mt-1">Database maximum</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center">
            <div className="text-3xl mb-2">📉</div>
            <div className="text-2xl font-bold text-red-400 mb-2">Rs. {lowestPrice}</div>
            <div className="text-emerald-200">Lowest Price</div>
            <div className="text-xs text-emerald-300 mt-1">Database minimum</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center">
            <div className="text-3xl mb-2">🏷️</div>
            <div className="text-2xl font-bold text-yellow-400 mb-2">{filteredPricesAll.length}</div>
            <div className="text-emerald-200">Filtered Results</div>
            <div className="text-xs text-emerald-300 mt-1">of {paddyPrices.length} total</div>
          </div>
        </div>

        {/* Search, Filter and Sort Section */}
  <div className={`relative z-20 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-12 shadow-2xl transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by district, province, market, variety or center..."
                className="w-full px-6 py-3 pl-12 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 transition-all duration-300"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700">🔎</div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >✖</button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <div className="relative" ref={districtRef}>
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

              <div className="mt-2 flex items-center gap-2">
                  {/* Removed '+ Add District' button as requested */}
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
              <label className="block text-emerald-200 font-semibold mb-3">🧪 Type</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300"
              >
                <option value="">All Types</option>
                <option value="wet">Wet</option>
                <option value="dry">Dry</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              🗑️ Clear Filters
            </button>
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              🔄 {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button
              onClick={exportCSV}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              ⬇️ Download CSV
            </button>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-emerald-100 text-sm">
              <input type="checkbox" className="accent-emerald-500" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
              Show all results
            </label>
          </div>
        </div>

        {/* Prices Grid */}
        <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-emerald-500/20 backdrop-blur-sm rounded-2xl border border-emerald-400/30 p-6 mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">
                💰 Price Results: {filteredPricesAll.length} {filteredPricesAll.length === 1 ? 'district' : 'districts'}
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
                      Rs. {(price.pricePerKg || 0).toFixed(2)}
                    </div>
                    <div className={`flex items-center text-sm ${getTrendColor(price.trend)}`}>
                      <span className="mr-1">{getTrendIcon(price.trend)}</span>
                      {price.change !== 0 && (
                        <span>{price.change > 0 ? '+' : ''}{(price.change || 0).toFixed(2)}</span>
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
          </>
        )}
      </div>
    </section>
  );
};

export default LivePaddyPrices;
