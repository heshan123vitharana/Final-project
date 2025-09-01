import { useState } from 'react'
import {
  Edit3,
  Check,
  X,
  DollarSign,
  TrendingUp,
  History,
  Filter,
  Plus,
  Calendar,
  MapPin
} from 'lucide-react'

// Initial price data with real PMB data
const initialPrices = [
  {
    id: 1,
    variety: 'Nadu(Sudu)',
    type: 'Thetha Wee',
    currentPrice: 150.00,
    previousPrice: 145.00,
    unit: 'LKR/kg',
    lastUpdated: '2025-02-06',
    status: 'Active',
    description: 'Premium white rice, highest quality grade',
    district: 'Colombo'
  },
  {
    id: 2,
    variety: 'Nadu(Sudu)',
    type: 'Thetha Wee',
    currentPrice: 138.00,
    previousPrice: 135.00,
    unit: 'LKR/kg',
    lastUpdated: '2025-02-06',
    status: 'Active',
    description: 'High quality white rice, Grade 1 standard',
    district: 'Gampaha'
  },
  {
    id: 3,
    variety: 'Nadu(Sudu)',
    type: 'Thetha Wee',
    currentPrice: 125.00,
    previousPrice: 123.00,
    unit: 'LKR/kg',
    lastUpdated: '2025-02-06',
    status: 'Active',
    description: 'Standard quality white rice, Grade 2',
    district: 'Kalutara'
  },
  {
    id: 4,
    variety: 'Nadu(Sudu)',
    type: 'Thetha Wee',
    currentPrice: 115.00,
    previousPrice: 113.00,
    unit: 'LKR/kg',
    lastUpdated: '2025-02-06',
    status: 'Active',
    description: 'Basic quality white rice, Grade 3',
    district: 'Kandy'
  },
  {
    id: 5,
    variety: 'Nadu(Sudu)',
    type: 'Wiyali Wee',
    currentPrice: 165.00,
    previousPrice: 160.00,
    unit: 'LKR/kg',
    lastUpdated: '2025-02-06',
    status: 'Active',
    description: 'Premium red rice, highest quality grade',
    district: 'Anuradhapura'
  },
  {
    id: 6,
    variety: 'Nadu(Sudu)',
    type: 'Wiyali Wee',
    currentPrice: 152.00,
    previousPrice: 148.00,
    unit: 'LKR/kg',
    lastUpdated: '2025-02-06',
    status: 'Active',
    description: 'High quality red rice, Grade 1 standard',
    district: 'Polonnaruwa'
  },
  {
    id: 7,
    variety: 'Nadu(Sudu)',
    type: 'Wiyali Wee',
    currentPrice: 138.00,
    previousPrice: 135.00,
    unit: 'LKR/kg',
    lastUpdated: '2025-02-06',
    status: 'Active',
    description: 'Standard quality red rice, Grade 2',
    district: 'Kurunegala'
  },
  {
    id: 8,
    variety: 'Nadu(Sudu)',
    type: 'Wiyali Wee',
    currentPrice: 128.00,
    previousPrice: 125.00,
    unit: 'LKR/kg',
    lastUpdated: '2025-02-06',
    status: 'Active',
    description: 'Basic quality red rice, Grade 3',
    district: 'Matale'
  },
  {
    id: 9,
    variety: 'Mixed Variety',
    type: 'Standard',
    currentPrice: 105.00,
    previousPrice: 102.00,
    unit: 'LKR/kg',
    lastUpdated: '2025-02-06',
    status: 'Active',
    description: 'Mixed paddy varieties, standard processing',
    district: 'Batticaloa'
  },
  {
    id: 10,
    variety: 'Nadu',
    type: 'Premium',
    currentPrice: 88.00,
    previousPrice: 85.00,
    unit: 'LKR/kg',
    lastUpdated: '2025-02-05',
    status: 'Active',
    description: 'Traditional Nadu variety, premium grade',
    district: 'Polonnaruwa'
  }
]

const PriceManagement = () => {
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [filterDistrict, setFilterDistrict] = useState('all')
  const [filterVariety, setFilterVariety] = useState('all')
  const [prices, setPrices] = useState(initialPrices)
  const [activeTab, setActiveTab] = useState('wiyali')
  const [editingId, setEditingId] = useState(null)
  const [editingPrice, setEditingPrice] = useState('')
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedPriceHistory, setSelectedPriceHistory] = useState(null)
  // Removed unused varietyFilter and gradeFilter
  const [newPrice, setNewPrice] = useState({
    variety: '',
    type: '',
    currentPrice: '',
    district: '',
    description: ''
  })

  // Comprehensive price history data
  const priceHistory = {
    1: [
      { date: '2025-02-06', price: 150.00, change: '+5.00', reason: 'Market demand increase' },
      { date: '2025-02-01', price: 145.00, change: '+2.00', reason: 'Quality premium adjustment' },
      { date: '2025-01-28', price: 143.00, change: '+1.00', reason: 'Regular monthly review' },
      { date: '2025-01-25', price: 142.00, change: '+3.00', reason: 'Supply shortage' },
      { date: '2025-01-20', price: 139.00, change: '-1.00', reason: 'Market stabilization' }
    ],
    2: [
      { date: '2025-02-06', price: 138.00, change: '+3.00', reason: 'Consistent with premium grade' },
      { date: '2025-02-01', price: 135.00, change: '+2.00', reason: 'Quality assessment' },
      { date: '2025-01-28', price: 133.00, change: '+1.50', reason: 'Market alignment' },
      { date: '2025-01-25', price: 131.50, change: '+2.50', reason: 'Grade standardization' },
      { date: '2025-01-20', price: 129.00, change: '+1.00', reason: 'Regular price update' }
    ],
    3: [
      { date: '2025-02-06', price: 125.00, change: '+2.00', reason: 'Mid-grade price adjustment' },
      { date: '2025-02-01', price: 123.00, change: '+1.50', reason: 'Market demand' },
      { date: '2025-01-28', price: 121.50, change: '+1.00', reason: 'Seasonal adjustment' },
      { date: '2025-01-25', price: 120.50, change: '+2.00', reason: 'Supply-demand balance' },
      { date: '2025-01-20', price: 118.50, change: '+0.50', reason: 'Gradual increase' }
    ],
    4: [
      { date: '2025-02-06', price: 115.00, change: '+2.00', reason: 'Basic grade improvement' },
      { date: '2025-02-01', price: 113.00, change: '+1.00', reason: 'Standard adjustment' },
      { date: '2025-01-28', price: 112.00, change: '+1.50', reason: 'Market correction' },
      { date: '2025-01-25', price: 110.50, change: '+1.50', reason: 'Price stabilization' },
      { date: '2025-01-20', price: 109.00, change: '+0.50', reason: 'Minimum price maintenance' }
    ],
    5: [
      { date: '2025-02-06', price: 165.00, change: '+5.00', reason: 'Premium red rice demand' },
      { date: '2025-02-01', price: 160.00, change: '+3.00', reason: 'Health conscious market' },
      { date: '2025-01-28', price: 157.00, change: '+2.00', reason: 'Nutritional value recognition' },
      { date: '2025-01-25', price: 155.00, change: '+4.00', reason: 'Limited supply' },
      { date: '2025-01-20', price: 151.00, change: '+1.00', reason: 'Quality premium' }
    ]
  }

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Moneragala', 'Ratnapura', 'Kegalle'
  ]

  const varieties = [
    'Nadu(Sudu)',
    'Nadu(Rathu)',
    'Samba(Sudu)',
    'Keeri Samba',
    
  ]
  const types = [
    'Wiyali Wee',
    'Thetha Wee'
  ]

  // Removed unused filteredPrices

  const handleEditPrice = (id) => {
    setEditingId(id)
    const price = prices.find(p => p.id === id)
    setEditingPrice(price.currentPrice.toString())
  }

  const handleSavePrice = (id) => {
    const newPriceValue = parseFloat(editingPrice)
    if (isNaN(newPriceValue) || newPriceValue <= 0) {
      alert('Please enter a valid price')
      return
    }

    setPrices(prices.map(price => 
      price.id === id 
        ? { 
            ...price, 
            previousPrice: price.currentPrice,
            currentPrice: newPriceValue,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : price
    ))
    setEditingId(null)
    setEditingPrice('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingPrice('')
  }

  const handleViewHistory = (priceId) => {
    setSelectedPriceHistory(priceHistory[priceId] || [])
    setShowHistoryModal(true)
  }

  const handleAddNewPrice = () => {
  if (!newPrice.variety || !newPrice.type || !newPrice.currentPrice || !newPrice.district) {
      alert('Please fill in all required fields')
      return
    }

    const newId = Math.max(...prices.map(p => p.id)) + 1
    const priceEntry = {
      id: newId,
      variety: newPrice.variety,
      type: newPrice.type,
      currentPrice: parseFloat(newPrice.currentPrice),
      previousPrice: parseFloat(newPrice.currentPrice) - 1,
      unit: 'LKR/kg',
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Active',
      description: newPrice.description || `${newPrice.variety} - ${newPrice.type}`,
      district: newPrice.district
    }

    setPrices([...prices, priceEntry])
    setNewPrice({
      variety: '',
      type: '',
      currentPrice: '',
      district: '',
      description: ''
    })
    setShowPriceModal(false)
  }

  const getPriceChange = (current, previous) => {
    const change = current - previous
    return {
      amount: Math.abs(change).toFixed(2),
      direction: change >= 0 ? 'up' : 'down',
      percentage: ((change / previous) * 100).toFixed(1)
    }
  }

  // Quick summary calculations
  // Removed unused thethaWeeAvg and wiyaliWeeAvg

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Price Management</h2>
        <button
          onClick={() => setShowPriceModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Price</span>
        </button>
      </div>

      {/* Quick Price Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ...existing code... */}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Filters:</span>
          </div>
          <select
            value={filterDistrict}
            onChange={e => setFilterDistrict(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
          >
            <option value="all">All Districts</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          <select
            value={filterVariety}
            onChange={e => setFilterVariety(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
          >
            <option value="all">All Varieties</option>
            {varieties.map(variety => (
              <option key={variety} value={variety}>{variety}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab labels for Wiyali Wee and Theth Wee */}
      <div className="flex space-x-2 mb-4">
        <span
          className={`px-6 py-2 rounded-t-lg font-semibold text-sm cursor-pointer transition-colors ${activeTab === 'wiyali' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setActiveTab('wiyali')}
        >
          Wiyali Wee
        </span>
        <span
          className={`px-6 py-2 rounded-t-lg font-semibold text-sm cursor-pointer transition-colors ${activeTab === 'thetha' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setActiveTab('thetha')}
        >
          Theth Wee
        </span>
      </div>

      {/* Tabbed tables */}
      {activeTab === 'wiyali' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variety</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Change</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prices.filter(p =>
                  p.type === 'Wiyali Wee' &&
                  (filterVariety === 'all' || p.variety === filterVariety) &&
                  (filterDistrict === 'all' || p.district === filterDistrict)
                ).map((price, idx) => {
                  const change = getPriceChange(price.currentPrice, price.previousPrice)
                  return (
                    <tr key={price.id} className={`hover:bg-gray-50 ${idx % 2 === 1 ? 'bg-[#ECFAE5]' : ''}`}> 
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{price.variety}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === price.id ? (
                          <input
                            type="number"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.01"
                            min="0"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-900">
                            {price.currentPrice.toFixed(2)} {price.unit}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center space-x-1 ${change.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {change.direction === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          <span className="text-sm font-medium">{change.direction === 'up' ? '+' : '-'}{change.amount} ({change.percentage}%)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{price.district}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{price.lastUpdated}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {editingId === price.id ? (
                            <>
                              <button onClick={() => handleSavePrice(price.id)} className="text-green-600 hover:text-green-900"><Check className="h-4 w-4" /></button>
                              <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-900"><X className="h-4 w-4" /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditPrice(price.id)} className="text-blue-600 hover:text-blue-900"><Edit3 className="h-4 w-4" /></button>
                              <button onClick={() => handleViewHistory(price.id)} className="text-gray-600 hover:text-gray-900"><History className="h-4 w-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === 'thetha' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variety</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Change</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prices.filter(p =>
                  p.type === 'Thetha Wee' &&
                  (filterVariety === 'all' || p.variety === filterVariety) &&
                  (filterDistrict === 'all' || p.district === filterDistrict)
                ).map((price, idx) => {
                  const change = getPriceChange(price.currentPrice, price.previousPrice)
                  return (
                    <tr key={price.id} className={`hover:bg-gray-50 ${idx % 2 === 1 ? 'bg-[#ECFAE5]' : ''}`}> 
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{price.variety}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === price.id ? (
                          <input
                            type="number"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.01"
                            min="0"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-900">
                            {price.currentPrice.toFixed(2)} {price.unit}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center space-x-1 ${change.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {change.direction === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          <span className="text-sm font-medium">{change.direction === 'up' ? '+' : '-'}{change.amount} ({change.percentage}%)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{price.district}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{price.lastUpdated}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {editingId === price.id ? (
                            <>
                              <button onClick={() => handleSavePrice(price.id)} className="text-green-600 hover:text-green-900"><Check className="h-4 w-4" /></button>
                              <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-900"><X className="h-4 w-4" /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditPrice(price.id)} className="text-blue-600 hover:text-blue-900"><Edit3 className="h-4 w-4" /></button>
                              <button onClick={() => handleViewHistory(price.id)} className="text-gray-600 hover:text-gray-900"><History className="h-4 w-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Price Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Price Entry</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variety *
                </label>
                <select
                  value={newPrice.variety}
                  onChange={(e) => setNewPrice({...newPrice, variety: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Variety</option>
                  {varieties.map(variety => (
                    <option key={variety} value={variety}>{variety}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={newPrice.type}
                  onChange={(e) => setNewPrice({...newPrice, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (LKR/kg) *
                </label>
                <input
                  type="number"
                  value={newPrice.currentPrice}
                  onChange={(e) => setNewPrice({...newPrice, currentPrice: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <select
                  value={newPrice.district}
                  onChange={(e) => setNewPrice({...newPrice, district: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newPrice.description}
                  onChange={(e) => setNewPrice({...newPrice, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Optional description..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPriceModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewPrice}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Price History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Price History</h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedPriceHistory && selectedPriceHistory.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        LKR {entry.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={entry.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                          {entry.change}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {entry.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default PriceManagement