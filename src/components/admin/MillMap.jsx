import { useState } from 'react'
import { MapPin, Factory, Package, Info } from 'lucide-react'

// Mock data for mill locations in Sri Lanka
const millLocations = [
  {
    id: 1,
    name: 'Green Valley Rice Mill',
    district: 'Colombo',
    coordinates: { x: 45, y: 75 }, // Relative position on SVG map
    currentStock: 1200,
    capacity: 1500,
    emptyCapacity: 300,
    type: 'Private',
    status: 'Active',
    contact: '+94771234567'
  },
  {
    id: 2,
    name: 'Sri Lanka Rice Processing',
    district: 'Kurunegala',
    coordinates: { x: 40, y: 55 },
    currentStock: 950,
    capacity: 1200,
    emptyCapacity: 250,
    type: 'Government',
    status: 'Active',
    contact: '+94777654321'
  },
  {
    id: 3,
    name: 'Golden Grain Mills',
    district: 'Anuradhapura',
    coordinates: { x: 45, y: 35 },
    currentStock: 800,
    capacity: 1000,
    emptyCapacity: 200,
    type: 'Private',
    status: 'Active',
    contact: '+94712345678'
  },
  {
    id: 4,
    name: 'National Paddy Mill',
    district: 'Polonnaruwa',
    coordinates: { x: 55, y: 40 },
    currentStock: 750,
    capacity: 900,
    emptyCapacity: 150,
    type: 'Government',
    status: 'Active',
    contact: '+94751234567'
  },
  {
    id: 5,
    name: 'Paddy Processing Center',
    district: 'Gampaha',
    coordinates: { x: 42, y: 70 },
    currentStock: 650,
    capacity: 800,
    emptyCapacity: 150,
    type: 'Private',
    status: 'Active',
    contact: '+94761234567'
  },
  {
    id: 6,
    name: 'Central Rice Mill',
    district: 'Kandy',
    coordinates: { x: 50, y: 60 },
    currentStock: 550,
    capacity: 700,
    emptyCapacity: 150,
    type: 'Government',
    status: 'Maintenance',
    contact: '+94781234567'
  },
  {
    id: 7,
    name: 'Southern Rice Complex',
    district: 'Galle',
    coordinates: { x: 38, y: 85 },
    currentStock: 420,
    capacity: 600,
    emptyCapacity: 180,
    type: 'Private',
    status: 'Active',
    contact: '+94791234567'
  },
  {
    id: 8,
    name: 'Eastern Mill Corporation',
    district: 'Batticaloa',
    coordinates: { x: 65, y: 50 },
    currentStock: 380,
    capacity: 500,
    emptyCapacity: 120,
    type: 'Government',
    status: 'Active',
    contact: '+94701234567'
  }
]

const MillMap = () => {
  const [selectedMill, setSelectedMill] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [mills] = useState(millLocations)

  const filteredMills = mills.filter(mill => 
    filterType === 'all' || mill.type.toLowerCase() === filterType
  )

  const handleMillClick = (mill) => {
    setSelectedMill(mill)
    setShowModal(true)
  }

  const getMillColor = (mill) => {
    if (mill.status === 'Maintenance') return '#EF4444' // Red
    return mill.type === 'Private' ? '#22C55E' : '#3B82F6' // Green for Private, Blue for Government
  }

  const getUtilizationPercentage = (mill) => {
    return Math.round((mill.currentStock / mill.capacity) * 100)
  }


  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Mill Locations Map</h2>
            <p className="text-sm text-gray-600">Interactive map of rice mills across Sri Lanka</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter by Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Mills</option>
                <option value="private">Private Mills</option>
                <option value="government">Government Mills</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Private Mills</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Government Mills</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Under Maintenance</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="relative">
            {/* Simplified Sri Lanka Map SVG */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-96 border border-gray-200 rounded-lg bg-blue-50"
            >
              {/* Sri Lanka outline (simplified) */}
              <path
                d="M30,20 L35,15 L45,12 L55,15 L65,18 L70,25 L72,35 L70,45 L68,55 L65,65 L60,75 L55,85 L50,90 L45,88 L40,85 L35,80 L32,70 L30,60 L28,50 L30,40 L30,30 Z"
                fill="#E0F2FE"
                stroke="#0369A1"
                strokeWidth="1"
              />
              
              {/* Mill locations */}
              {filteredMills.map((mill) => (
                <g key={mill.id}>
                  <circle
                    cx={mill.coordinates.x}
                    cy={mill.coordinates.y}
                    r="3"
                    fill={getMillColor(mill)}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-4 transition-all duration-200"
                    onClick={() => handleMillClick(mill)}
                  />
                  
                  {/* Mill name on hover */}
                  <text
                    x={mill.coordinates.x}
                    y={mill.coordinates.y - 6}
                    textAnchor="middle"
                    className="text-xs fill-gray-700 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                    fontSize="3"
                  >
                    {mill.name}
                  </text>
                </g>
              ))}
            </svg>
            
            {/* Overlay instructions */}
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Info size={16} />
                <span>Click on mill markers to view details</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mill List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Mill Directory ({filteredMills.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredMills.map((mill) => (
              <div
                key={mill.id}
                onClick={() => handleMillClick(mill)}
                className="border border-gray-200 rounded-lg p-3 hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div
                      className="w-3 h-3 rounded-full mt-1"
                      style={{ backgroundColor: getMillColor(mill) }}
                    ></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 truncate">
                      {mill.name}
                    </h4>
                    <p className="text-xs text-gray-500">{mill.district}</p>
                    <div className="text-xs text-gray-600 mt-1">
                      <div className="flex justify-between">
                        <span>Stock:</span>
                        <span className="font-medium">{mill.currentStock} MT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilization:</span>
                        <span className="font-medium">{getUtilizationPercentage(mill)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mill Details Modal */}
      {showModal && selectedMill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Mill Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Info size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Mill Header */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center space-x-3">
                  <Factory className="w-8 h-8 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{selectedMill.name}</h4>
                    <p className="text-sm text-gray-600">{selectedMill.district} District</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedMill.type === 'Private' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedMill.type}
                  </span>
                  
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedMill.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedMill.status}
                  </span>
                </div>
              </div>

              {/* Stock Information */}
              <div>
                <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Stock Information
                </h5>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Stock:</span>
                    <span className="font-medium text-gray-800">{selectedMill.currentStock} MT</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Capacity:</span>
                    <span className="font-medium text-gray-800">{selectedMill.capacity} MT</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Empty Capacity:</span>
                    <span className="font-medium text-green-600">{selectedMill.emptyCapacity} MT</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Utilization Rate:</span>
                    <span className={`font-medium ${
                      getUtilizationPercentage(selectedMill) > 85 ? 'text-red-600' : 
                      getUtilizationPercentage(selectedMill) > 70 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getUtilizationPercentage(selectedMill)}%
                    </span>
                  </div>
                  
                  {/* Utilization Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${getUtilizationPercentage(selectedMill)}%`,
                        backgroundColor: getMillColor(selectedMill)
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Contact Information
                </h5>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-800">{selectedMill.contact}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="font-medium text-gray-800">{selectedMill.district}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  View Reports
                </button>
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Contact Mill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MillMap
