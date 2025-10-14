import { useState, useEffect, useCallback, useRef } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { RefreshCw, TrendingUp, TrendingDown, Activity, AlertTriangle, History, X, Filter } from 'lucide-react'

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
  const [recentEntries, setRecentEntries] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [isSseConnected, setIsSseConnected] = useState(false)
  const [supportsSse, setSupportsSse] = useState(false)
  
  // History modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyEntries, setHistoryEntries] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  
  // Filter state
  const [filterDistrict, setFilterDistrict] = useState('All')
  const [filterBusinessType, setFilterBusinessType] = useState('All')
  
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY
  const eventSourceRef = useRef(null)

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
      setRecentEntries(Array.isArray(overview.recentEntries) ? overview.recentEntries : [])
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
    if (typeof window === 'undefined') {
      return undefined
    }

    if (!('EventSource' in window)) {
      setSupportsSse(false)
      return undefined
    }

    setSupportsSse(true)

    const query = adminApiKey ? `?key=${encodeURIComponent(adminApiKey)}` : ''
    const source = new EventSource(`${apiBaseUrl}/api/admin/stock-stream${query}`)
    eventSourceRef.current = source

    const applyOverview = (overview, timestamp) => {
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
      setLastUpdated(timestamp || new Date().toISOString())
      setError(null)
      setRecentEntries(Array.isArray(overview.recentEntries) ? overview.recentEntries : [])
    }

    const handleUpdate = (event) => {
      try {
        const payload = JSON.parse(event.data || '{}')
        if (!payload || !payload.overview) {
          return
        }
        applyOverview(payload.overview, payload.timestamp)
        if (Array.isArray(payload.recentEntries)) {
          setRecentEntries(payload.recentEntries)
        }
        setIsSseConnected(true)
      } catch (parseError) {
        console.error('Failed to parse stock update payload:', parseError)
      }
    }

    const handleOpen = () => {
      setIsSseConnected(true)
    }

    const handleError = (event) => {
      console.error('Stock update stream error:', event)
      setIsSseConnected(false)
    }

    source.addEventListener('stock-update', handleUpdate)
    source.addEventListener('open', handleOpen)
    source.addEventListener('error', handleError)

    return () => {
      setIsSseConnected(false)
      source.removeEventListener('stock-update', handleUpdate)
      source.removeEventListener('open', handleOpen)
      source.removeEventListener('error', handleError)
      source.close()
      eventSourceRef.current = null
    }
  }, [adminApiKey, apiBaseUrl])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSseConnected) {
        fetchOverview({ silent: true })
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchOverview, isSseConnected])

  const totalStock = data.summary.totalStock || 0
  const totalCapacity = data.summary.totalCapacity || 0
  const utilizationRate = data.summary.utilizationRate || 0
  const activeMills = data.summary.activeMills || data.stockByMill.length

  // Get unique districts for filter
  const availableDistricts = ['All', ...new Set(recentEntries.map(e => e.district).filter(Boolean))]
  
  // Apply filters to recent entries
  const filteredRecentEntries = recentEntries.filter(entry => {
    const districtMatch = filterDistrict === 'All' || entry.district === filterDistrict
    const typeMatch = filterBusinessType === 'All' || 
      (filterBusinessType === 'Private' && entry.businessType?.toLowerCase() === 'private') ||
      (filterBusinessType === 'Government' && entry.businessType?.toLowerCase() === 'government')
    return districtMatch && typeMatch
  })

  const recentEntriesToShow = filteredRecentEntries.slice(0, 10)

  // Fetch full history
  const fetchHistory = useCallback(async () => {
    try {
      setLoadingHistory(true)
      const headers = adminApiKey ? { 'x-admin-key': adminApiKey } : undefined
      const response = await fetch(`${apiBaseUrl}/api/admin/stock-entries?limit=100`, { headers })
      
      if (!response.ok) {
        throw new Error('Failed to fetch history')
      }
      
      const result = await response.json()
      setHistoryEntries(Array.isArray(result.data) ? result.data : [])
      setShowHistoryModal(true)
    } catch (err) {
      console.error('Failed to fetch history:', err)
    } finally {
      setLoadingHistory(false)
    }
  }, [adminApiKey, apiBaseUrl])

  const formatDate = (value, withTime = false) => {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return withTime ? date.toLocaleString() : date.toLocaleDateString()
  }

  const privateVsGovernmentStock = data.privateVsGovernmentStock.length
    ? data.privateVsGovernmentStock
    : [
        { name: 'Private Mills', current: 0, capacity: 0, percentage: 0 },
        { name: 'Government Mills', current: 0, capacity: 0, percentage: 0 }
      ]

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
            {supportsSse && (
              <p className="text-xs text-gray-500 mt-1">
                {isSseConnected ? 'Live updates connected' : 'Live updates reconnecting...'}
              </p>
            )}
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
                fill="#3B82F6"
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
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Recent Stock Submissions</h3>
              <p className="text-sm text-gray-600">Live feed of the latest mill updates across the network.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">Auto-refreshes via live stream</span>
              <button
                onClick={fetchHistory}
                disabled={loadingHistory}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <History className="w-4 h-4" />
                {loadingHistory ? 'Loading...' : 'View Full History'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {availableDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>

            <select
              value={filterBusinessType}
              onChange={(e) => setFilterBusinessType(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Private">Private</option>
              <option value="Government">Government</option>
            </select>

            {(filterDistrict !== 'All' || filterBusinessType !== 'All') && (
              <button
                onClick={() => {
                  setFilterDistrict('All')
                  setFilterBusinessType('All')
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
            
            <span className="text-xs text-gray-500 ml-auto">
              Showing {recentEntriesToShow.length} of {filteredRecentEntries.length} entries
            </span>
          </div>
        </div>

        {recentEntriesToShow.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-6">
            {filterDistrict === 'All' && filterBusinessType === 'All' 
              ? 'No recent submissions detected. New stock updates will appear here instantly.'
              : 'No submissions match the selected filters. Try adjusting your filter criteria.'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentEntriesToShow.map((entry) => {
              const parsedQuantity = Number.isFinite(entry.quantity) ? entry.quantity : Number(entry.quantity || 0)
              const quantity = Number.isFinite(parsedQuantity) ? parsedQuantity : 0
              const businessType = (entry.businessType || '').toLowerCase() === 'government' ? 'Government' : 'Private'

              return (
                <li key={entry.id} className="py-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-800">{entry.millName}</p>
                        <p className="text-xs text-gray-500">
                          {businessType} · {entry.district || 'Unknown district'}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          businessType === 'Government'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {businessType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-700">
                      <div>
                        <span className="font-medium">{quantity.toLocaleString(undefined, { maximumFractionDigits: 2 })} MT</span>
                        <span className="ml-2 text-gray-500">
                          {(entry.paddyType || 'Unknown type')} · {(entry.paddyCondition || 'Unknown condition')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        <p>Entry date: {formatDate(entry.entryDate)}</p>
                        <p>Submitted: {formatDate(entry.createdAt, true)}</p>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
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

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Full Submission History</h3>
                <p className="text-sm text-gray-600 mt-1">Complete record of all stock submissions</p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {historyEntries.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  No submission history available
                </div>
              ) : (
                <div className="space-y-3">
                  {historyEntries.map((entry) => {
                    const parsedQuantity = Number.isFinite(entry.quantity) ? entry.quantity : Number(entry.quantity || 0)
                    const quantity = Number.isFinite(parsedQuantity) ? parsedQuantity : 0
                    const businessType = (entry.businessType || '').toLowerCase() === 'government' ? 'Government' : 'Private'

                    return (
                      <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-semibold text-gray-900">{entry.millName}</p>
                                <p className="text-xs text-gray-500">
                                  {businessType} · {entry.district || 'Unknown district'}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                businessType === 'Government'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {businessType}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Quantity: </span>
                              <span className="font-semibold text-gray-900">
                                {quantity.toLocaleString(undefined, { maximumFractionDigits: 2 })} MT
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Type: </span>
                              <span className="font-medium text-gray-900">
                                {entry.paddyType || 'Unknown'} · {entry.paddyCondition || 'Unknown'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              <p>Entry: {formatDate(entry.entryDate)}</p>
                              <p>Submitted: {formatDate(entry.createdAt, true)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Total entries: <span className="font-semibold">{historyEntries.length}</span>
                </p>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockDashboard
