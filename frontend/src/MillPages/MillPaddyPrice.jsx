import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';

// Paddy Price page component for Mill Dashboard
const MillPaddyPrice = () => {
  // State for selected variety filter (variety name)
  const [selectedType, setSelectedType] = useState("");
  // State for selected condition filter (Dry/Wet)
  const [selectedCondition, setSelectedCondition] = useState("");
  // State for selected district filter
  const [selectedDistrict, setSelectedDistrict] = useState("");
  // State for live price data from API
  const [paddyPrices, setPaddyPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  // State for database-wide statistics
  const [databaseStats, setDatabaseStats] = useState({
    totalEntries: 0,
    averagePrice: 0,
    highestPrice: 0,
    lowestPrice: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch ALL database prices and calculate statistics on frontend
  const fetchDatabaseStats = async () => {
    try {
      setStatsLoading(true);
      
      // Fetch ALL prices from database (no filtering, no limits)
      const response = await fetch('http://localhost:5000/api/prices');
      
      if (!response.ok) {
        throw new Error('Failed to fetch all prices');
      }
      
      const data = await response.json();
      const allPrices = data.data || [];
      
      if (allPrices.length > 0) {
        // Calculate true database-wide statistics from ALL records
        const prices = allPrices.map(p => parseFloat(p.pricePerKg || p.currentPrice) || 0);
        const validPrices = prices.filter(p => p > 0);
        
        const average = validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;
        const highest = Math.max(...validPrices);
        const lowest = Math.min(...validPrices);
        
        console.log('📊 Calculated database statistics from', validPrices.length, 'prices:');
        console.log('📊 All prices:', validPrices.sort((a, b) => b - a));
        console.log('📊 Average:', average.toFixed(2));
        console.log('📊 Highest:', highest);
        console.log('📊 Lowest:', lowest);
        
        setDatabaseStats({
          totalEntries: allPrices.length,
          averagePrice: parseFloat(average.toFixed(2)),
          highestPrice: highest,
          lowestPrice: lowest
        });
      } else {
        setDatabaseStats({
          totalEntries: 0,
          averagePrice: 0,
          highestPrice: 0,
          lowestPrice: 0
        });
      }
      
    } catch (err) {
      console.error('Failed to fetch database statistics:', err);
      setDatabaseStats({
        totalEntries: 0,
        averagePrice: 0,
        highestPrice: 0,
        lowestPrice: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch prices from backend API
  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/prices');
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      
      const data = await response.json();
      const pricesData = data.data || data;
      
      // Transform API data to match component expectations
      const transformedPrices = (pricesData || []).map(price => ({
        id: price.id,
        variety: price.variety || 'Unknown',
        type: price.type || 'Wet',
        price: parseFloat(price.pricePerKg || price.currentPrice) || 0,
        previousPrice: parseFloat(price.previousPrice) || 0,
        district: price.district || 'Unknown',
        lastUpdated: price.lastUpdated || price.updated_at || new Date().toISOString().split('T')[0],
        description: price.description || '',
        province: price.province || 'Unknown',
        market: price.market || 'Unknown'
      }));
      
      setPaddyPrices(transformedPrices);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch prices:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Set page title on mount and fetch initial data
  useEffect(() => {
    document.title = "Dashboard | Paddy Prices";
    fetchPrices();
    fetchDatabaseStats(); // Fetch statistics on mount
  }, []);

  // Auto-refresh prices and statistics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrices();
      fetchDatabaseStats(); // Also refresh statistics
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter prices based on selected variety, type (Dry/Wet), and district
  const filteredPrices = paddyPrices.filter(
    (price) =>
      (selectedType === "" || price.variety === selectedType) &&
      (selectedCondition === "" || price.type === selectedCondition) &&
      (selectedDistrict === "" || price.district === selectedDistrict)
  );

  // Get unique varieties for dropdown (Nadu, Samba, etc.)
  const uniqueTypes = [...new Set(paddyPrices.map((p) => p.variety))];
  // Get unique types for dropdown (Dry/Wet)
  const uniqueConditions = [...new Set(paddyPrices.map((p) => p.type))];
  // Get unique districts for dropdown
  const uniqueDistricts = [...new Set(paddyPrices.map((p) => p.district))];

  // Calculate filtered results stats for display purposes (unused - reserved for future statistics feature)
  // const calculateFilteredStats = () => {
  //   if (filteredPrices.length === 0) {
  //     return { totalFiltered: 0 };
  //   }
  //   return { totalFiltered: filteredPrices.length };
  // };

  // Calculate filtered statistics (currently unused)
  // const filteredStats = calculateFilteredStats();

  // Get price change direction and percentage
  const getPriceChange = (current, previous) => {
    if (!previous || previous === 0) return { direction: 'neutral', change: 0, percentage: 0 };
    const change = current - previous;
    const percentage = ((change / previous) * 100).toFixed(1);
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      change: Math.abs(change).toFixed(2),
      percentage: Math.abs(percentage)
    };
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Page heading with refresh button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700 border-b-4 border-green-300 pb-2">
          📊 Live Paddy Prices
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={() => {
              fetchPrices();
              fetchDatabaseStats();
            }}
            disabled={loading || statsLoading}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${(loading || statsLoading) ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-4 text-gray-600">Loading latest prices...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={fetchPrices}
              className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Price Statistics Cards */}
      {!loading && !error && (
        <>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-4xl">
              {/* Average Price Card - Compact Beautiful Design */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-blue-500 rounded-lg p-2">
                    {statsLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <BarChart3 className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                    AVG
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-900 mb-1">
                  Rs. {statsLoading ? '...' : databaseStats.averagePrice.toFixed(2)}
                </div>
                <div className="text-xs text-blue-600">
                  Average Price
                </div>
              </div>

              {/* Highest Price Card - Compact Beautiful Design */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-green-500 rounded-lg p-2">
                    {statsLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <TrendingUp className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="text-xs font-medium text-green-600 bg-green-200 px-2 py-1 rounded-full">
                    HIGH
                  </div>
                </div>
                <div className="text-lg font-bold text-green-900 mb-1">
                  Rs. {statsLoading ? '...' : databaseStats.highestPrice.toFixed(2)}
                </div>
                <div className="text-xs text-green-600">
                  Highest Price
                </div>
              </div>

              {/* Lowest Price Card - Compact Beautiful Design */}
              <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-red-500 rounded-lg p-2">
                    {statsLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <TrendingDown className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="text-xs font-medium text-red-600 bg-red-200 px-2 py-1 rounded-full">
                    LOW
                  </div>
                </div>
                <div className="text-lg font-bold text-red-900 mb-1">
                  Rs. {statsLoading ? '...' : databaseStats.lowestPrice.toFixed(2)}
                </div>
                <div className="text-xs text-red-600">
                  Lowest Price
                </div>
              </div>
            </div>
          </div>

      {/* Filter dropdowns for variety, type, and district */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg shadow-md border border-green-200">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-green-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Varieties</option>
          {uniqueTypes.filter(type => type && type !== 'Unknown').map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="border border-green-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Types (Dry/Wet)</option>
          {uniqueConditions.filter(cond => cond && cond !== 'Unknown').map((cond, idx) => (
            <option key={idx} value={cond}>
              {cond}
            </option>
          ))}
        </select>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="border border-green-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Districts</option>
          {uniqueDistricts.filter(district => district && district !== 'Unknown').map((district, idx) => (
            <option key={idx} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

          {/* Enhanced Table displaying filtered paddy prices */}
          <div className="overflow-x-auto rounded-lg shadow-md border border-green-200 bg-white">
            <table className="w-full table-auto">
              <thead className="bg-green-200 text-green-900">
                <tr>
                  <th className="border px-4 py-2 text-left">Variety</th>
                  <th className="border px-4 py-2 text-left">Type</th>
                  <th className="border px-4 py-2 text-left">Current Price (LKR/kg)</th>
                  <th className="border px-4 py-2 text-left">Price Change</th>
                  <th className="border px-4 py-2 text-left">District</th>
                  <th className="border px-4 py-2 text-left">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {/* Render filtered prices or show no data message */}
                {filteredPrices.length > 0 ? (
                  filteredPrices.map((p, idx) => {
                    const priceChange = getPriceChange(p.price, p.previousPrice);
                    return (
                      <tr
                        key={p.id || idx}
                        className="odd:bg-white even:bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <td className="border px-4 py-2 font-medium">{p.variety}</td>
                        <td className="border px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            p.type === 'Dry' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {p.type}
                          </span>
                        </td>
                        <td className="border px-4 py-2 font-semibold text-green-700">
                          Rs. {p.price.toFixed(2)}
                        </td>
                        <td className="border px-4 py-2">
                          {priceChange.direction !== 'neutral' ? (
                            <div className={`flex items-center space-x-1 ${
                              priceChange.direction === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {priceChange.direction === 'up' ? 
                                <TrendingUp className="h-4 w-4" /> : 
                                <TrendingDown className="h-4 w-4" />
                              }
                              <span className="text-sm font-medium">
                                {priceChange.direction === 'up' ? '+' : '-'}Rs. {priceChange.change} ({priceChange.percentage}%)
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No change</span>
                          )}
                        </td>
                        <td className="border px-4 py-2 text-gray-700">{p.district}</td>
                        <td className="border px-4 py-2 text-gray-500 text-sm">{p.lastUpdated}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 text-gray-500 italic"
                    >
                      {loading ? 'Loading prices...' : 'No data available for selected filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MillPaddyPrice;