import { useState, memo } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Save } from 'lucide-react'

// Memoized price card component for better performance
const PriceCard = memo(({ riceType, currentPrice, onPriceChange, isUpdating }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 transform-gpu">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{riceType}</h3>
      <DollarSign className="w-6 h-6 text-green-600" />
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Price (LKR per kg)
        </label>
        <input
          type="number"
          value={currentPrice}
          onChange={(e) => onPriceChange(riceType, parseFloat(e.target.value) || 0)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          step="0.50"
          min="0"
          disabled={isUpdating}
        />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Last updated: Today</span>
        <div className="flex items-center text-green-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>+2.5%</span>
        </div>
      </div>
    </div>
  </div>
))

const PriceManagement = () => {
  const [prices, setPrices] = useState({
    'Nadu - White': 125.50,
    'Nadu - Red': 130.75,
    'Samba': 140.25,
    'Kiri Samba': 165.00
  })
  
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastSaved, setLastSaved] = useState(new Date())

  const handlePriceChange = (riceType, newPrice) => {
    setPrices(prev => ({
      ...prev,
      [riceType]: newPrice
    }))
  }

  const handleSaveAll = async () => {
    setIsUpdating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setLastSaved(new Date())
    setIsUpdating(false)
    
    // Show success notification
    const notification = document.createElement('div')
    notification.innerHTML = `
      <div class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          Prices updated successfully!
        </div>
      </div>
    `
    document.body.appendChild(notification)
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification)
      }
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Price Management</h2>
            <p className="text-sm text-gray-600">
              Last saved: {lastSaved.toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isUpdating}
            className="btn-smooth inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Prices</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Price Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(prices).map(([riceType, price]) => (
          <PriceCard
            key={riceType}
            riceType={riceType}
            currentPrice={price}
            onPriceChange={handlePriceChange}
            isUpdating={isUpdating}
          />
        ))}
      </div>

      {/* Price History Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 chart-container">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Trends (Last 7 Days)</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-2" />
            <p>Price trend chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Average Market Price</p>
                <p className="text-2xl font-bold text-green-800">LKR 140.38</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Weekly Change</p>
                <p className="text-2xl font-bold text-blue-800">+5.2%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Market Volatility</p>
                <p className="text-2xl font-bold text-yellow-800">Low</p>
              </div>
              <TrendingDown className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

PriceCard.displayName = 'PriceCard'

export default memo(PriceManagement)