import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { RefreshCw, TrendingUp, TrendingDown, Activity } from 'lucide-react'

// Mock data for stock monitoring - simplified version
const generateMockData = () => {
  const baseData = {
    privateVsGovernmentStock: [
      { name: 'Private Mills', current: 12500, capacity: 15000, percentage: 83 },
      { name: 'Government Mills', current: 8200, capacity: 10000, percentage: 82 }
    ],
    stockByDistrict: [
      { district: 'Colombo', private: 3200, government: 2100, total: 5300 },
      { district: 'Kurunegala', private: 2800, government: 1900, total: 4700 },
      { district: 'Anuradhapura', private: 2200, government: 1800, total: 4000 },
      { district: 'Polonnaruwa', private: 1900, government: 1400, total: 3300 },
      { district: 'Gampaha', private: 1500, government: 1000, total: 2500 }
    ],
    stockByMill: [
      { mill: 'Green Valley', stock: 1200, capacity: 1500, utilization: 80, type: 'Private' },
      { mill: 'Sri Lanka Rice', stock: 950, capacity: 1200, utilization: 79, type: 'Government' },
      { mill: 'Golden Grain', stock: 800, capacity: 1000, utilization: 80, type: 'Private' }
    ]
  }
  
  return baseData
}

const StockDashboard = () => {
  const [data, setData] = useState(() => generateMockData())
  const [lastUpdated, setLastUpdated] = useState(() => new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasError, setHasError] = useState(false)

  const updateData = useCallback(() => {
    try {
      setIsRefreshing(true)
      setHasError(false)
      
      // Simulate data update with slight variations
      const timeout = setTimeout(() => {
        const newData = generateMockData()
        setData(newData)
        setLastUpdated(new Date())
        setIsRefreshing(false)
      }, 500)
      
      return () => clearTimeout(timeout)
    } catch (error) {
      console.error('Error updating data:', error)
      setHasError(true)
      setIsRefreshing(false)
    }
  }, [])

  // Auto-refresh data every 60 seconds
  useEffect(() => {
    const interval = setInterval(updateData, 60000)
    return () => clearInterval(interval)
  }, [updateData])

  const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  const getTotalStock = useMemo(() => {
    if (!data?.privateVsGovernmentStock) return 0
    return data.privateVsGovernmentStock.reduce((sum, item) => sum + (item.current || 0), 0)
  }, [data.privateVsGovernmentStock])

  const getTotalCapacity = useMemo(() => {
    if (!data?.privateVsGovernmentStock) return 0
    return data.privateVsGovernmentStock.reduce((sum, item) => sum + (item.capacity || 0), 0)
  }, [data.privateVsGovernmentStock])

  const getUtilizationRate = useMemo(() => {
    const totalStock = getTotalStock
    const totalCapacity = getTotalCapacity
    return totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0
  }, [getTotalStock, getTotalCapacity])

  // Add data validation
  if (!data || !data.stockByDistrict || !data.privateVsGovernmentStock || !data.stockByMill) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-4" />
          <p>Loading stock data...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-center text-red-500">
          <p>Error loading stock dashboard</p>
          <button 
            onClick={() => {
              setHasError(false)
              updateData()
            }}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Real-time Stock Monitoring</h2>
            <p className="text-sm text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={updateData}
            disabled={isRefreshing}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isRefreshing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stock</p>
              <p className="text-2xl font-bold text-gray-800">
                {getTotalStock.toLocaleString()} MT
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-800">
                {getTotalCapacity.toLocaleString()} MT
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilization Rate</p>
              <p className="text-2xl font-bold text-gray-800">{getUtilizationRate}%</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Mills</p>
              <p className="text-2xl font-bold text-gray-800">{data.stockByMill?.length || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock by District - Simplified */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Stock Distribution by District (Top 5)
          </h3>
          {data.stockByDistrict && data.stockByDistrict.length > 0 ? (
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer>
                <BarChart 
                  data={data.stockByDistrict} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="district" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [`${value.toLocaleString()} MT`, name]}
                  />
                  <Legend />
                  <Bar 
                    dataKey="private" 
                    stackId="a" 
                    fill="#22C55E" 
                    name="Private (MT)"
                  />
                  <Bar 
                    dataKey="government" 
                    stackId="a" 
                    fill="#3B82F6" 
                    name="Government (MT)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <p>No district data available</p>
            </div>
          )}
        </div>

        {/* Stock Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Stock Distribution Overview
          </h3>
          {data.privateVsGovernmentStock && data.privateVsGovernmentStock.length >= 2 ? (
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.privateVsGovernmentStock.map(item => ({
                      name: item.name,
                      value: item.current
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.privateVsGovernmentStock.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} MT`, 'Stock']}
                    contentStyle={{
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No stock distribution data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Live Status Indicators */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Mill Status</h3>
        {data.stockByMill && data.stockByMill.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.stockByMill.map((mill) => (
              <div key={mill.mill} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{mill.mill}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    mill.type === 'Private' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {mill.type}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Current Stock:</span>
                    <span className="font-medium">{mill.stock} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="font-medium">{mill.capacity} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilization:</span>
                    <span className={`font-medium ${
                      mill.utilization > 85 ? 'text-red-600' : 
                      mill.utilization > 70 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {mill.utilization}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p>No mill status data available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StockDashboard
