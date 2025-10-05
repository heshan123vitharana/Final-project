import { useState, useEffect, useCallback } from 'react'
import { Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

const createEmptyLeadershipForm = () => ({
  name: '',
  position: '',
  bio: '',
  image: null,
  twitter: '',
  linkedin: '',
  email: '',
  order_position: '1',
  is_active: true
})

const LeadershipModal = ({ isOpen, onClose, leader, onSave, existingLeaders = [] }) => {
  const [formData, setFormData] = useState(createEmptyLeadershipForm())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate next available order position
  const getNextAvailableOrder = useCallback(() => {
    const usedOrders = existingLeaders
      .filter(l => l.id !== leader?.id)
      .map(l => l.order_index || 0)
    
    let nextOrder = 1
    while (usedOrders.includes(nextOrder)) {
      nextOrder++
    }
    return nextOrder
  }, [existingLeaders, leader])

  useEffect(() => {
    if (isOpen) {
      if (leader) {
        setFormData({
          name: leader.name || '',
          position: leader.position || '',
          bio: leader.bio || '',
          image: null,
          twitter: leader.twitter_url || '',
          linkedin: leader.linkedin_url || '',
          email: leader.email || '',
          order_position:
            leader.order_index !== undefined && leader.order_index !== null
              ? String(leader.order_index)
              : '1',
          is_active: leader.is_active !== undefined ? Boolean(leader.is_active) : true
        })
      } else {
        // For new members, suggest the next available order
        const nextOrder = getNextAvailableOrder()
        setFormData({
          ...createEmptyLeadershipForm(),
          order_position: String(nextOrder)
        })
      }
    }
  }, [isOpen, leader, getNextAvailableOrder])

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, is_active: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { name, position } = formData
    if (!name || !position) {
      toast.error('Name and position are required')
      setIsSubmitting(false)
      return
    }

    try {
      console.log('LeadershipModal: Submitting form data:', formData)
      await onSave(formData, leader?.id)
      onClose()
    } catch (error) {
      console.error('LeadershipModal: Error in handleSubmit:', error)
      toast.error(error.message || 'Failed to save leadership member')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">
            {leader ? 'Edit Leadership Member' : 'Add Leadership Member'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biography
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Brief biography or description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {leader && leader.image_url && (
              <div className="mt-2">
                <img
                  src={`http://localhost:5000${leader.image_url}`}
                  alt="Current"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <p className="text-sm text-gray-500 mt-1">Current image</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter URL
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order *
              </label>
              <input
                type="number"
                name="order_position"
                min="1"
                value={formData.order_position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {(() => {
                  const takenOrders = existingLeaders
                    .filter(l => l.id !== leader?.id)
                    .map(l => l.order_index)
                    .filter(o => o)
                    .sort((a, b) => a - b)
                  
                  if (takenOrders.length === 0) {
                    return 'No orders taken yet. You can use any number.'
                  }
                  
                  const isCurrentTaken = takenOrders.includes(parseInt(formData.order_position))
                  
                  return (
                    <span className={isCurrentTaken ? 'text-red-600 font-medium' : ''}>
                      {isCurrentTaken ? '⚠️ This order is already taken! ' : '✓ Available. '}
                      Taken: {takenOrders.join(', ')}
                    </span>
                  )
                })()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="is_active"
                value={formData.is_active ? 'true' : 'false'}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:bg-green-300"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : (leader ? 'Update' : 'Create')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeadershipModal
