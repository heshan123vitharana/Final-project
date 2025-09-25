import { useState, useEffect } from 'react'
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit,
  Eye,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Plus,
  Grid,
  List,
  Folder,
  Award,
  Star,
  ArrowUp,
  ArrowDown,
  EyeOff
} from 'lucide-react'
import toast from 'react-hot-toast'

const ImageGalleryManager = () => {
  // Active tab state
  const [activeTab, setActiveTab] = useState('images')
  
  // Images state
  const [images, setImages] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingImage, setEditingImage] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('')

  // Categories state
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  // Services & Excellence state
  const [services, setServices] = useState([])
  const [editingService, setEditingService] = useState(null)
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const [serviceType, setServiceType] = useState('services')

  // Form states for images
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    isActive: true
  })

  // Form states for categories
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true
  })

  // Form states for services & excellence
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    type: 'service',
    icon: '',
    image: null,
    features: [''],
    priority: 1,
    isActive: true
  })

  const tabs = [
    { id: 'images', label: 'Image Gallery', icon: ImageIcon },
    { id: 'categories', label: 'Categories', icon: Folder },
    { id: 'services', label: 'Services & Excellence', icon: Award }
  ]

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

  // ================ FETCH FUNCTIONS ================

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories?active=true')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Fetch all categories with counts (for category management)
  const fetchCategoriesWithCounts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/categories/with-counts')
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      
      const data = await response.json()
      setCategories(data.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  // Fetch all images
  const fetchImages = async () => {
    console.log('🔍 Fetching images...')
    try {
      setLoading(true)
      let url = 'http://localhost:5000/api/gallery'
      if (selectedCategoryFilter) {
        url += `?category_id=${selectedCategoryFilter}`
      }
      
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = await response.json()
      console.log('📥 Received images:', data.data?.length || 0, 'images')
      setImages(data.data || [])
    } catch (error) {
      console.error('Error fetching images:', error)
      toast.error('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  // Fetch services and excellence
  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/services-excellence')

      if (!response.ok) {
        throw new Error('Failed to fetch items')
      }

      const data = await response.json()
      setServices(data.data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Failed to load services and excellence data')
    } finally {
      setLoading(false)
    }
  }

  // ================ EFFECTS ================

  useEffect(() => {
    if (activeTab === 'images') {
      fetchCategories()
      fetchImages()
    } else if (activeTab === 'categories') {
      fetchCategoriesWithCounts()
    } else if (activeTab === 'services') {
      fetchServices()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'images') {
      fetchImages()
    }
  }, [selectedCategoryFilter])

  // Upload new images
  const handleFileUpload = async (files) => {
    const newFiles = Array.from(files)
    setUploadingFiles(newFiles.map(file => ({ file, progress: 0, id: Date.now() + Math.random() })))

    // Get default category (General)
    const defaultCategory = categories.find(cat => cat.slug === 'general') || categories[0]

    for (const file of newFiles) {
      try {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('title', file.name.split('.')[0])
        formData.append('category_id', defaultCategory?.id || '')
        formData.append('status', 'active')
        formData.append('is_active', 'true')

        const response = await fetch('http://localhost:5000/api/gallery', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }

        const result = await response.json()
        toast.success(`${file.name} uploaded successfully`)

        // Update images list by adding the new image
        setImages(prev => [...prev, result.data])

      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    setUploadingFiles([])
    // Refresh the entire gallery to ensure consistency
    fetchImages()
  }

  // Delete image
  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/gallery/${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      setImages(prev => prev.filter(img => img.id !== imageId))
      toast.success('Image deleted successfully')
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    }
  }

  // Update image details
  const handleUpdate = async (imageId, updateData) => {
    console.log('🔄 Updating image:', imageId, updateData);
    
    // Validate required data
    if (!imageId) {
      console.error('❌ No image ID provided for update');
      toast.error('Invalid image ID');
      return;
    }
    
    if (!updateData || !updateData.title?.trim()) {
      console.error('❌ Title is required for update');
      toast.error('Title is required');
      return;
    }
    
    try {
      // Transform camelCase to snake_case for backend compatibility
      const backendData = {
        title: updateData.title.trim(),
        description: updateData.description?.trim() || null,
        category_id: updateData.category_id || null,
        is_active: Boolean(updateData.isActive),
        status: updateData.isActive ? 'active' : 'inactive'
      };
      console.log('📤 Sending to backend:', backendData);

      const response = await fetch(`http://localhost:5000/api/gallery/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backendData)
      });

      console.log('📥 Backend response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Backend error:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Backend response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Update failed');
      }
      
      // Update the images list with the new data
      setImages(prev => prev.map(img => img.id === imageId ? result.data : img));
      
      // Also update the selectedImage if it's the one being edited
      if (selectedImage && selectedImage.id === imageId) {
        setSelectedImage(result.data);
      }
      
      toast.success('Image updated successfully');
      setEditingImage(null);
      setFormData({ title: '', description: '', category: '', isActive: true });
      
      // Refresh the gallery to ensure consistency
      console.log('🔄 Refreshing gallery after update...');
      await fetchImages();
      
    } catch (error) {
      console.error('❌ Error updating image:', error);
      toast.error(`Failed to update image: ${error.message}`);
    }
  }

  // Toggle image active status
  const toggleActiveStatus = async (imageId, currentStatus) => {
    try {
      await handleUpdate(imageId, { isActive: !currentStatus })
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const openModal = (image, action = 'view') => {
    setSelectedImage(image)
    setIsModalOpen(true)

    if (action === 'edit') {
      setEditingImage(image.id)
      setFormData({
        title: image.title || '',
        description: image.description || '',
        category_id: image.category_id || '',
        isActive: image.is_active !== 0 // Convert database 0/1 to boolean
      })
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
    setEditingImage(null)
    setFormData({ title: '', description: '', category_id: '', isActive: true })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-green-600" />
        <span className="ml-2 text-gray-600">Loading gallery...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Image Gallery Management</h2>
          <div className="flex items-center space-x-4">
            {/* Category Filter */}
            <div className="min-w-[200px]">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchImages}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Upload Images</p>
            <p className="text-sm text-gray-500">
              Click to select files or drag and drop multiple images here
            </p>
          </label>
        </div>

        {/* Upload Progress */}
        {uploadingFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadingFiles.map(fileUpload => (
              <div key={fileUpload.id} className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ width: '50%' }}></div>
                </div>
                <span className="text-sm text-gray-600">{fileUpload.file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ImageIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Images</p>
              <p className="text-2xl font-bold text-gray-800">{images.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Images</p>
              <p className="text-2xl font-bold text-gray-800">
                {images.filter(img => img.is_active !== 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Inactive Images</p>
              <p className="text-2xl font-bold text-gray-800">
                {images.filter(img => img.is_active === 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Grid className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-800">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Images Grid/List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Gallery Images</h3>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No images in gallery. Upload some images to get started.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
            {images.map((image) => (
              <div key={image.id} className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex items-center' : ''}`}>
                <div className={viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square'}>
                  <img
                    src={image.image_url || '/api/placeholder/300/300'}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800 truncate">{image.title}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs ${image.is_active !== 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {image.is_active !== 0 ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  {image.category_name && (
                    <p className="text-sm text-gray-600 mb-2">{image.category_name}</p>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(image.created_at || Date.now()).toLocaleDateString()}
                    </span>

                    <div className="flex space-x-1">
                      <button
                        onClick={() => openModal(image, 'view')}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal(image, 'edit')}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleActiveStatus(image.id, image.is_active)}
                        className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                        title={image.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {image.is_active !== 0 ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">
                {editingImage ? 'Edit Image' : 'Image Details'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div>
                  <img
                    src={selectedImage.image_url || '/api/placeholder/400/400'}
                    alt={selectedImage.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                {/* Image Details/Edit Form */}
                <div>
                  {editingImage ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={formData.category_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="mr-2"
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={() => handleUpdate(selectedImage.id, formData)}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingImage(null)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">{selectedImage.title}</h4>
                        {selectedImage.description && (
                          <p className="text-gray-600 mb-4">{selectedImage.description}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Category:</span>
                          <p className="text-gray-600">{selectedImage.category || 'Uncategorized'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <p className={selectedImage.is_active !== 0 ? 'text-green-600' : 'text-red-600'}>
                            {selectedImage.is_active !== 0 ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Upload Date:</span>
                          <p className="text-gray-600">
                            {new Date(selectedImage.created_at || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">File Size:</span>
                          <p className="text-gray-600">{selectedImage.file_size || 'Unknown'}</p>
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={() => openModal(selectedImage, 'edit')}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Image
                        </button>
                        <button
                          onClick={() => handleDelete(selectedImage.id)}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGalleryManager