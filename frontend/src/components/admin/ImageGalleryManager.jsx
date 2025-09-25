import { useState, useEffect, useCallback } from 'react'
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
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories?active=true')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  // Fetch all categories with counts (for category management)
  const fetchCategoriesWithCounts = useCallback(async () => {
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
  }, [])

  // Fetch all images
  const fetchImages = useCallback(async () => {
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
  }, [selectedCategoryFilter])

  // Fetch services and excellence
  const fetchServices = useCallback(async () => {
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
  }, [])

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
  }, [activeTab, fetchCategories, fetchImages, fetchCategoriesWithCounts, fetchServices])

  useEffect(() => {
    if (activeTab === 'images') {
      fetchImages()
    }
  }, [selectedCategoryFilter, activeTab, fetchImages])

  // ================ IMAGE FUNCTIONS ================

  const handleFileUpload = async (files) => {
    const newFiles = Array.from(files)
    setUploadingFiles(newFiles.map(file => ({ file, progress: 0, id: Date.now() + Math.random() })))

    for (const fileObj of newFiles) {
      try {
        const formData = new FormData()
        formData.append('image', fileObj.file)

        const response = await fetch('http://localhost:5000/api/gallery', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          // Update progress to 100%
          setUploadingFiles(prev => prev.map(f => 
            f.file === fileObj.file ? { ...f, progress: 100 } : f
          ))
          
          toast.success(`${fileObj.file.name} uploaded successfully`)
          fetchImages()
        } else {
          throw new Error('Upload failed')
        }
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(`Failed to upload ${fileObj.file.name}`)
      }
    }

    // Clear upload files after 2 seconds
    setTimeout(() => {
      setUploadingFiles([])
    }, 2000)
  }

  const handleDeleteImage = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Image deleted successfully')
        fetchImages()
      } else {
        throw new Error('Failed to delete image')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete image')
    }
  }

  const handleUpdateImage = async (e) => {
    e.preventDefault()

    if (!editingImage?.id) return

    try {
      const response = await fetch(`http://localhost:5000/api/gallery/${editingImage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          is_active: formData.isActive
        })
      })

      if (response.ok) {
        toast.success('Image updated successfully')
        closeModal()
        fetchImages()
      } else {
        throw new Error('Failed to update image')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update image')
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
    setEditingImage(null)
    setFormData({ title: '', description: '', isActive: true })
  }

  // ================ SERVICE FUNCTIONS ================

  const handleServiceInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setServiceFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFeatureChange = (index, value) => {
    setServiceFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  const addFeature = () => {
    setServiceFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const removeFeature = (index) => {
    setServiceFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleServiceSubmit = async (e) => {
    e.preventDefault()

    try {
      const submitData = new FormData()
      Object.keys(serviceFormData).forEach(key => {
        if (key === 'features') {
          submitData.append(key, JSON.stringify(serviceFormData[key].filter(f => f.trim())))
        } else if (key === 'image' && serviceFormData[key]) {
          submitData.append(key, serviceFormData[key])
        } else {
          submitData.append(key, serviceFormData[key])
        }
      })

      const url = editingService 
        ? `http://localhost:5000/api/services-excellence/${editingService.id}`
        : 'http://localhost:5000/api/services-excellence'
      
      const method = editingService ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: submitData
      })

      if (!response.ok) {
        throw new Error(`Failed to ${editingService ? 'update' : 'create'} item`)
      }

      const result = await response.json()
      
      if (editingService) {
        setServices(prev => prev.map(s => s.id === editingService.id ? result.data : s))
        toast.success('Item updated successfully')
      } else {
        setServices(prev => [...prev, result.data])
        toast.success('Item created successfully')
      }
      
      closeServiceModal()
    } catch (error) {
      console.error('Service operation error:', error)
      toast.error(error.message || `Failed to ${editingService ? 'update' : 'create'} item`)
    }
  }

  const handleDeleteService = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/services-excellence/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

      setServices(prev => prev.filter(s => s.id !== id))
      toast.success('Item deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete item')
    }
  }

  const closeServiceModal = () => {
    setServiceModalOpen(false)
    setEditingService(null)
    setServiceFormData({
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

  const openServiceModal = (service = null) => {
    if (service) {
      setEditingService(service)
      setServiceFormData({
        title: service.title || '',
        description: service.description || '',
        type: service.type || 'service',
        icon: service.icon || '',
        image: null,
        features: service.features || [''],
        priority: service.priority || 1,
        isActive: service.is_active !== undefined ? service.is_active : true
      })
    } else {
      resetServiceForm()
    }
    setServiceModalOpen(true)
  }

  const resetServiceForm = () => {
    setServiceFormData({
      title: '',
      description: '',
      type: 'service',
      icon: '',
      image: null,
      features: [''],
      priority: 1,
      isActive: true
    })
    setEditingService(null)
  }

  // ================ CATEGORY MANAGEMENT FUNCTIONS ================
  
  const handleCategoryInputChange = (field, value) => {
    setCategoryFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    
    if (!categoryFormData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      const method = editingCategory ? 'PUT' : 'POST'
      const url = editingCategory 
        ? `http://localhost:5000/api/categories/${editingCategory.id}`
        : 'http://localhost:5000/api/categories'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryFormData)
      })

      if (!response.ok) {
        throw new Error('Failed to save category')
      }

      const result = await response.json()
      
      if (editingCategory) {
        toast.success('Category updated successfully')
      } else {
        toast.success('Category created successfully')
      }
      
      resetCategoryForm()
      setCategoryModalOpen(false)
      fetchCategoriesWithCounts()
    } catch (error) {
      console.error('Category save error:', error)
      toast.error('Failed to save category')
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      toast.success('Category deleted successfully')
      fetchCategoriesWithCounts()
    } catch (error) {
      console.error('Delete category error:', error)
      toast.error('Failed to delete category')
    }
  }

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      slug: '',
      description: '',
      sort_order: 0,
      is_active: true
    })
    setEditingCategory(null)
  }

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setCategoryFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        sort_order: category.sort_order || 0,
        is_active: category.is_active !== undefined ? category.is_active : true
      })
    } else {
      resetCategoryForm()
    }
    setCategoryModalOpen(true)
  }

  const closeCategoryModal = () => {
    setCategoryModalOpen(false)
    resetCategoryForm()
  }

  // ================ COMPONENT RENDER ================

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'images' && <ImageGalleryContent />}
          {activeTab === 'categories' && <CategoryManagementContent />}
          {activeTab === 'services' && <ServicesExcellenceContent />}
        </div>
      </div>
    </div>
  )

  // ================ IMAGE GALLERY CONTENT ================
  function ImageGalleryContent() {
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
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-800">Image Gallery</h3>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {selectedCategoryFilter && (
                <button
                  onClick={() => setSelectedCategoryFilter('')}
                  className="text-gray-500 hover:text-gray-700"
                  title="Clear filter"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Upload Button */}
            <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer inline-flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadingFiles.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Uploading Files</h4>
            {uploadingFiles.map(file => (
              <div key={file.id} className="mb-2 last:mb-0">
                <div className="flex justify-between text-sm text-blue-700 mb-1">
                  <span>{file.file.name}</span>
                  <span>{file.progress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Images Grid/List */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
          {(images || []).length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium">No images found</p>
              <p className="text-sm">Upload some images to get started</p>
            </div>
          ) : (
            (images || []).map(image => (
              <div key={image.id} className={`bg-white rounded-lg border hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'}`}>
                {viewMode === 'grid' ? (
                  <>
                    <div className="aspect-square relative group">
                      <img
                        src={image.image_url}
                        alt={image.title || 'Gallery image'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.svg'
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedImage(image)
                              setIsModalOpen(true)
                            }}
                            className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingImage(image)
                              setFormData({
                                title: image.title || '',
                                description: image.description || '',
                                category_id: image.category_id || '',
                                isActive: image.is_active
                              })
                              setIsModalOpen(true)
                            }}
                            className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {!image.is_active && (
                        <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                          Inactive
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                        {image.title || 'Untitled'}
                      </h3>
                      {image.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {image.description}
                        </p>
                      )}
                      {image.category_name && (
                        <div className="mb-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {image.category_name}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Image</span>
                        <span>{new Date(image.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={image.image_url}
                      alt={image.title || 'Gallery image'}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.svg'
                      }}
                    />
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {image.title || 'Untitled'}
                          </h3>
                          {image.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {image.description}
                            </p>
                          )}
                          {image.category_name && (
                            <div className="mt-1">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {image.category_name}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{new Date(image.created_at).toLocaleDateString()}</span>
                            {!image.is_active && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1 ml-4">
                          <button
                            onClick={() => {
                              setSelectedImage(image)
                              setIsModalOpen(true)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingImage(image)
                              setFormData({
                                title: image.title || '',
                                description: image.description || '',
                                category_id: image.category_id || '',
                                isActive: image.is_active
                              })
                              setIsModalOpen(true)
                            }}
                            className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal for viewing/editing images */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold">
                  {editingImage ? 'Edit Image' : 'Image Details'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {selectedImage && !editingImage && (
                  <div className="space-y-4">
                    <img
                      src={selectedImage.image_url}
                      alt={selectedImage.title || 'Gallery image'}
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.svg'
                      }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {selectedImage.title || 'Untitled'}
                      </h4>
                      {selectedImage.description && (
                        <p className="text-gray-600 mb-4">
                          {selectedImage.description}
                        </p>
                      )}
                      {selectedImage.category_name && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-700">Category: </span>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {selectedImage.category_name}
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span className={`ml-2 font-medium ${selectedImage.is_active ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedImage.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <span className="ml-2 font-medium">
                            {new Date(selectedImage.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="ml-2 font-medium">
                            {selectedImage.file_size ? `${(selectedImage.file_size / 1024).toFixed(1)} KB` : 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {editingImage && (
                  <form onSubmit={handleUpdateImage} className="space-y-4">
                    <div>
                      <img
                        src={editingImage.image_url}
                        alt={editingImage.title || 'Gallery image'}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.svg'
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter image title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter image description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category_id || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select a category (optional)</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Active (visible to public)
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ================ CATEGORY MANAGEMENT CONTENT ================
  function CategoryManagementContent() {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin h-8 w-8 text-green-600" />
          <span className="ml-2 text-gray-600">Loading categories...</span>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Category Management</h3>
          <button
            onClick={() => openCategoryModal()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
          >
            <Folder className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No categories found</p>
              <button
                onClick={() => openCategoryModal()}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create First Category
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Images</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map(category => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">/{category.slug}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 max-w-md">
                        <p className="truncate">{category.description || 'No description'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {category.image_count || 0} images
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          category.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openCategoryModal(category)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Edit category"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Modal */}
        {categoryModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
              </div>
              
              <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.name}
                    onChange={(e) => handleCategoryInputChange('name', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.slug}
                    onChange={(e) => handleCategoryInputChange('slug', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Auto-generated from name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={(e) => handleCategoryInputChange('description', e.target.value)}
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={categoryFormData.sort_order}
                    onChange={(e) => handleCategoryInputChange('sort_order', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="category-active"
                    checked={categoryFormData.is_active}
                    onChange={(e) => handleCategoryInputChange('is_active', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="category-active" className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeCategoryModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {editingCategory ? 'Update' : 'Create'} Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ================ SERVICES & EXCELLENCE CONTENT ================
  function ServicesExcellenceContent() {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin h-8 w-8 text-green-600" />
          <span className="ml-2 text-gray-600">Loading services...</span>
        </div>
      )
    }

    const filteredServices = serviceType === 'all' 
      ? (services || [])
      : (services || []).filter(service => service.type === serviceType)

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-800">Services & Excellence</h3>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="services">All Types</option>
              {serviceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => openServiceModal()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium">No items found</p>
              <p className="text-sm">Add services and excellence items to showcase your organization</p>
            </div>
          ) : (
            filteredServices.map(service => (
              <div key={service.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{service.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        {serviceTypes.find(t => t.value === service.type)?.label || service.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {service.is_active ? (
                      <CheckCircle className="h-5 w-5 text-green-600" title="Active" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-red-600" title="Inactive" />
                    )}
                  </div>
                </div>

                {service.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                )}

                {service.features && service.features.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Star className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                      {service.features.length > 3 && (
                        <li className="text-xs text-gray-500">
                          +{service.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Priority: {service.priority || 1}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openServiceModal(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Item"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Service Modal */}
        {serviceModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold">
                  {editingService ? 'Edit Item' : 'Add Item'}
                </h3>
                <button
                  onClick={closeServiceModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleServiceSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={serviceFormData.title}
                      onChange={handleServiceInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={serviceFormData.type}
                      onChange={handleServiceInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      {serviceTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={serviceFormData.description}
                    onChange={handleServiceInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      name="icon"
                      value={serviceFormData.icon}
                      onChange={handleServiceInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select an icon</option>
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>
                          {icon} {icon}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <input
                      type="number"
                      name="priority"
                      value={serviceFormData.priority}
                      onChange={handleServiceInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  {serviceFormData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={`Feature ${index + 1}`}
                      />
                      {serviceFormData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-green-600 hover:text-green-700 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, image: e.target.files[0] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="service_is_active"
                    name="isActive"
                    checked={serviceFormData.isActive}
                    onChange={handleServiceInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="service_is_active" className="ml-2 block text-sm text-gray-900">
                    Active (visible to public)
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeServiceModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingService ? 'Update' : 'Create'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default ImageGalleryManager