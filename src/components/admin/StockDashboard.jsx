import { useState, useEffect } from 'react'
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
  Cell,
  LineChart,
  Line
} from 'recharts'
import { RefreshCw, TrendingUp, TrendingDown, Activity } from 'lucide-react'

// Mock data for stock monitoring
const generateMockData = () => ({
  privateVsGovernmentStock: [
    { name: 'Private Mills', current: 12500, capacity: 15000, percentage: 83 },
    { name: 'Government Mills', current: 8200, capacity: 10000, percentage: 82 }
  ],
  stockByDistrict: [
    { district: 'Colombo', private: 3200, government: 2100, total: 5300 },
    { district: 'Kurunegala', private: 2800, government: 1900, total: 4700 },
    { district: 'Anuradhapura', private: 2200, government: 1800, total: 4000 },
    { district: 'Polonnaruwa', private: 1900, government: 1400, total: 3300 },
    { district: 'Gampaha', private: 1500, government: 1000, total: 2500 },
    { district: 'Kalutara', private: 900, government: 0, total: 900 }
  ],
  stockByMill: [
    { mill: 'Green Valley', stock: 1200, capacity: 1500, utilization: 80, type: 'Private' },
    { mill: 'Sri Lanka Rice', stock: 950, capacity: 1200, utilization: 79, type: 'Government' },
    { mill: 'Golden Grain', stock: 800, capacity: 1000, utilization: 80, type: 'Private' },
    { mill: 'National Mill', stock: 750, capacity: 900, utilization: 83, type: 'Government' },
    { mill: 'Paddy Processing', stock: 650, capacity: 800, utilization: 81, type: 'Private' }
  ]
})

const StockDashboard = () => {
  const [data, setData] = useState(generateMockData())
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const updateData = () => {
    setIsRefreshing(true)
    
    // Simulate data update with slight variations
    setTimeout(() => {
      const newData = generateMockData()
      
      // Add some random variation to simulate real-time changes
      newData.privateVsGovernmentStock = newData.privateVsGovernmentStock.map(item => ({
        ...item,
        current: item.current + Math.floor(Math.random() * 200 - 100)
      }))
      
      newData.stockByDistrict = newData.stockByDistrict.map(item => ({
        ...item,
        private: item.private + Math.floor(Math.random() * 100 - 50),
        government: item.government + Math.floor(Math.random() * 100 - 50)
      }))
      
      setData(newData)
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  const getTotalStock = () => {
    return data.privateVsGovernmentStock.reduce((sum, item) => sum + item.current, 0)
  }

  const getTotalCapacity = () => {
    return data.privateVsGovernmentStock.reduce((sum, item) => sum + item.capacity, 0)
  }

  const getUtilizationRate = () => {
    return Math.round((getTotalStock() / getTotalCapacity()) * 100)
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
                {getTotalStock().toLocaleString()} MT
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
                {getTotalCapacity().toLocaleString()} MT
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
              <p className="text-2xl font-bold text-gray-800">{getUtilizationRate()}%</p>
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
              <p className="text-2xl font-bold text-gray-800">{data.stockByMill.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Private vs Government Stock */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Private vs Government Stock Levels
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.privateVsGovernmentStock} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-15}
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
                formatter={(value) => [`${value.toLocaleString()} MT`]}
              />
              <Legend />
              <Bar 
                dataKey="current" 
                fill="#22C55E" 
                name="Current Stock (MT)"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="capacity" 
                fill="#E5E7EB" 
                name="Total Capacity (MT)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock by District */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Stock Distribution by District
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.stockByDistrict} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="district" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
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
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="government" 
                stackId="a" 
                fill="#3B82F6" 
                name="Government (MT)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Stock Distribution Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { 
                    name: 'Private Mills', 
                    value: data.privateVsGovernmentStock[0].current,
                    color: '#22C55E'
                  },
                  { 
                    name: 'Government Mills', 
                    value: data.privateVsGovernmentStock[1].current,
                    color: '#3B82F6'
                  }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: 'Private Mills', value: data.privateVsGovernmentStock[0].current },
                  { name: 'Government Mills', value: data.privateVsGovernmentStock[1].current }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#22C55E' : '#3B82F6'} />
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

        {/* Mill Utilization Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Mill Utilization Rates
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={data.stockByMill}
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                tick={{ fontSize: 12 }} 
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                type="category" 
                dataKey="mill" 
                tick={{ fontSize: 12 }}
                width={75}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}%`, 'Utilization']}
                labelFormatter={(label) => `Mill: ${label}`}
              />
              <Bar 
                dataKey="utilization" 
                fill={(entry) => entry.type === 'Private' ? '#22C55E' : '#3B82F6'}
                radius={[0, 4, 4, 0]}
              >
                {data.stockByMill.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.type === 'Private' ? '#22C55E' : '#3B82F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Status Indicators */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Mill Status</h3>
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
      </div>
    </div>
  )
}

export default StockDashboard
