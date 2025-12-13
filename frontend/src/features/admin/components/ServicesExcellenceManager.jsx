import { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Award,
  Star,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload
} from 'lucide-react'
import toast from 'react-hot-toast'

const ServicesExcellenceManager = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [activeTab, setActiveTab] = useState('services')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'service', // 'service' or 'excellence'
    icon: '',
    image: null,
    features: [''],
    priority: 1,
    isActive: true
  })

  const serviceTypes = [
    { value: 'service', label: 'Service', icon: '🏢' },
    { value: 'excellence', label: 'Excellence', icon: '🏆' },
    { value: 'achievement', label: 'Achievement', icon: '🎯' },
    { value: 'certification', label: 'Certification', icon: '📜' }
  ]

  const iconOptions = [
    '🏢', '🏭', '🌾', '🚛', '⚖️', '🔬', '📊', '💼',
    '🏆', '🥇', '⭐', '💎', '🎯', '📈', '✅', '🔒',
    '📜', '🎖️', '🏅', '🌟', '💯', '📋', '🛡️', '🎪'
  ]

  // Fetch all services and excellence items
  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/services-excellence')

      if (!response.ok) {
        throw new Error('Failed to fetch items')
      }

      const data = await response.json()
      setServices(data.data || [])
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error('Failed to load services and excellence data')
    } finally {
      setLoading(false)
    }
  }

  // Create new item
  const handleCreate = async () => {
    try {
      const submitData = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          submitData.append(key, JSON.stringify(formData[key].filter(f => f.trim())))
        } else if (key === 'image' && formData[key]) {
          submitData.append(key, formData[key])
        } else {
          submitData.append(key, formData[key])
        }
      })

      const response = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/services-excellence', {
        method: 'POST',
        body: submitData
      })

      if (!response.ok) {
        throw new Error('Failed to create item')
      }

      const result = await response.json()
      setServices(prev => [...prev, result.data])
      toast.success('Item created successfully')
      closeModal()
    } catch (error) {
      console.error('Error creating item:', error)
      toast.error('Failed to create item')
    }
  }

  // Update item
  const handleUpdate = async (id) => {
    try {
      const submitData = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          submitData.append(key, JSON.stringify(formData[key].filter(f => f.trim())))
        } else if (key === 'image' && formData[key] && typeof formData[key] !== 'string') {
          submitData.append(key, formData[key])
        } else if (key !== 'image') {
          submitData.append(key, formData[key])
        }
      })

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/services-excellence/${id}`, {
        method: 'PUT',
        body: submitData
      })

      if (!response.ok) {
        throw new Error('Failed to update item')
      }

      const result = await response.json()
      setServices(prev => prev.map(item => item.id === id ? result.data : item))
      toast.success('Item updated successfully')
      closeModal()
    } catch (error) {
      console.error('Error updating item:', error)
      toast.error('Failed to update item')
    }
  }

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/services-excellence/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

      setServices(prev => prev.filter(item => item.id !== id))
      toast.success('Item deleted successfully')
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Failed to delete item')
    }
  }

  // Toggle active status
  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/services-excellence/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      const result = await response.json()
      setServices(prev => prev.map(item => item.id === id ? result.data : item))
      toast.success(`Item ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  // Update priority/order
  const updatePriority = async (id, newPriority) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/services-excellence/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ priority: newPriority })
      })

      if (!response.ok) {
        throw new Error('Failed to update priority')
      }

      const result = await response.json()
      setServices(prev => prev.map(item => item.id === id ? result.data : item))
    } catch (error) {
      console.error('Error updating priority:', error)
      toast.error('Failed to update priority')
    }
  }

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service.id)
      setFormData({
        title: service.title || '',
        description: service.description || '',
        type: service.type || 'service',
        icon: service.icon || '',
        image: service.image || null,
        features: service.features && Array.isArray(service.features) ? service.features : [''],
        priority: service.priority || 1,
        isActive: service.isActive !== false
      })
    } else {
      setEditingService(null)
      setFormData({
        title: '',
        description: '',
        type: 'service',
        icon: '',
        image: null,
        features: [''],
        priority: 1,
        isActive: true
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingService(null)
    setFormData({
      title: '',
      description: '',
      type: 'service',
      icon: '',
      image: null,
      features: [''],
      priority: 1,
      isActive: true
    })
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const updateFeature = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const filteredServices = services.filter(service =>
    activeTab === 'services' ? service.type === 'service' : service.type !== 'service'
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-green-600" />
        <span className="ml-2 text-gray-600">Loading services & excellence data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Services & Excellence Management</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchItems}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => openModal()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'services'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('excellence')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'excellence'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Excellence & Achievements
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-800">{services.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Items</p>
              <p className="text-2xl font-bold text-gray-800">
                {services.filter(s => s.isActive !== false).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Services</p>
              <p className="text-2xl font-bold text-gray-800">
                {services.filter(s => s.type === 'service').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Excellence</p>
              <p className="text-2xl font-bold text-gray-800">
                {services.filter(s => s.type !== 'service').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services/Excellence List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {activeTab === 'services' ? 'Services' : 'Excellence & Achievements'}
        </h3>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No {activeTab === 'services' ? 'services' : 'excellence items'} found. Add some items to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredServices
              .sort((a, b) => (a.priority || 0) - (b.priority || 0))
              .map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon/Image */}
                      <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-2xl">{item.icon || '📋'}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-800">{item.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            serviceTypes.find(t => t.value === item.type)?.value === 'service'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {serviceTypes.find(t => t.value === item.type)?.label || item.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>

                        {item.features && Array.isArray(item.features) && item.features.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.features.slice(0, 3).map((feature, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                            {item.features.length > 3 && (
                              <span className="text-xs text-gray-500">+{item.features.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {/* Priority Controls */}
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => updatePriority(item.id, (item.priority || 0) - 1)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <span className="text-xs text-gray-500 text-center">{item.priority || 0}</span>
                        <button
                          onClick={() => updatePriority(item.id, (item.priority || 0) + 1)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <button
                        onClick={() => openModal(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleActiveStatus(item.id, item.isActive)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                        title={item.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {item.isActive !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">
                {editingService ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter title"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {serviceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className="grid grid-cols-8 gap-2 mb-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`p-2 text-xl border rounded hover:bg-gray-50 ${
                        formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Or enter custom icon/emoji"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter feature"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Feature
                  </button>
                </div>
              </div>

              {/* Priority & Active Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editingService ? handleUpdate(editingService) : handleCreate()}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingService ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServicesExcellenceManager
