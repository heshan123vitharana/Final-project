import { useState, useEffect, useCallback } from 'react'
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
import { RefreshCw, TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react'

const INITIAL_DATA = {
  privateVsGovernmentStock: [],
  stockByDistrict: [],
  stockByMill: [],
  summary: {
    totalStock: 0,
    totalCapacity: 0,
    utilizationRate: 0,
    activeMills: 0
  }
}

const StockDashboard = () => {
  const [data, setData] = useState(INITIAL_DATA)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY

  const fetchOverview = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsRefreshing(true)
    }

    try {
      setError(null)
      const headers = adminApiKey ? { 'x-admin-key': adminApiKey } : undefined
      const response = await fetch(`${apiBaseUrl}/api/admin/stock-overview`, { headers })

      if (!response.ok) {
        throw new Error('Failed to fetch stock overview data')
      }

      const result = await response.json()
      const overview = result?.data || INITIAL_DATA

      setData({
        privateVsGovernmentStock: overview.privateVsGovernmentStock || [],
        stockByDistrict: overview.stockByDistrict || [],
        stockByMill: overview.stockByMill || [],
        summary: {
          totalStock: overview.summary?.totalStock ?? 0,
          totalCapacity: overview.summary?.totalCapacity ?? 0,
          utilizationRate: overview.summary?.utilizationRate ?? 0,
          activeMills: overview.summary?.activeMills ?? (overview.stockByMill?.length || 0)
        }
      })

      const updatedTimestamp = overview.lastUpdated || new Date().toISOString()
      setLastUpdated(updatedTimestamp)
    } catch (fetchError) {
      console.error('Stock overview fetch error:', fetchError)
      setError(fetchError.message || 'Unable to load stock overview.')
    } finally {
      if (!silent) {
        setIsRefreshing(false)
      }
    }
  }, [adminApiKey, apiBaseUrl])

  useEffect(() => {
    fetchOverview()
  }, [fetchOverview])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOverview({ silent: true })
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchOverview])

  const totalStock = data.summary.totalStock || 0
  const totalCapacity = data.summary.totalCapacity || 0
  const utilizationRate = data.summary.utilizationRate || 0
  const activeMills = data.summary.activeMills || data.stockByMill.length

  const privateVsGovernmentStock = data.privateVsGovernmentStock.length
    ? data.privateVsGovernmentStock
    : [
        { name: 'Private Mills', current: 0, capacity: 0, percentage: 0 },
        { name: 'Government Mills', current: 0, capacity: 0, percentage: 0 }
      ]

  const pieData = privateVsGovernmentStock.map((entry) => ({
    name: entry.name,
    value: entry.current,
    color: entry.name === 'Private Mills' ? '#22C55E' : '#3B82F6'
  }))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Real-time Stock Monitoring</h2>
            <p className="text-sm text-gray-600">
              {lastUpdated
                ? `Last updated: ${new Date(lastUpdated).toLocaleString()}`
                : 'Awaiting first data sync...'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-3">
            {error && (
              <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={() => fetchOverview()}
              disabled={isRefreshing}
              className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stock</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalStock.toLocaleString()} MT
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
                {totalCapacity.toLocaleString()} MT
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
              <p className="text-2xl font-bold text-gray-800">{utilizationRate}%</p>
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
              <p className="text-2xl font-bold text-gray-800">{activeMills}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Private vs Government Stock Levels
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={privateVsGovernmentStock} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                formatter={(value) => {
                  const numericValue = Number(value || 0)
                  return [`${numericValue.toLocaleString()} MT`]
                }}
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
                formatter={(value, name) => {
                  const numericValue = Number(value || 0)
                  return [`${numericValue.toLocaleString()} MT`, name]
                }}
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

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Stock Distribution Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                  const safePercent = Number.isFinite(percent) ? percent * 100 : 0
                  return `${name}: ${safePercent.toFixed(1)}%`
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => {
                  const numericValue = Number(value || 0)
                  return [`${numericValue.toLocaleString()} MT`, 'Stock']
                }}
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
                formatter={(value) => {
                  const numericValue = Number(value || 0)
                  return [`${numericValue}%`, 'Utilization']
                }}
                labelFormatter={(label) => `Mill: ${label}`}
              />
              <Bar dataKey="utilization" radius={[0, 4, 4, 0]}>
                {data.stockByMill.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.type === 'Private' ? '#22C55E' : '#3B82F6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Mill Status</h3>

        {data.stockByMill.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-8">
            No mill stock data available yet. New entries will appear here automatically.
          </div>
        ) : (
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
                    <span className="font-medium">{mill.stock.toLocaleString()} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="font-medium">{mill.capacity.toLocaleString()} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilization:</span>
                    <span
                      className={`font-medium ${
                        mill.utilization > 85
                          ? 'text-red-600'
                          : mill.utilization > 70
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {mill.utilization}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StockDashboard
