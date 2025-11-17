// frontend/src/components/admin/image-gallery/ServicesExcellenceContent.jsx
import { useState, useCallback, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, RefreshCw, Award, CheckCircle, EyeOff, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchServices as apiFetchServices,
  submitService,
  deleteService as apiDeleteService,
} from '../../../services/api';
import { SERVICE_TYPES, ICON_OPTIONS } from '../../../utils/constants';

const initialFormData = {
  title: '',
  description: '',
  type: 'service',
  icon: '',
  features: [''],
  priority: 1,
  isActive: true,
};

/**
 * Manages the Services & Excellence section.
 * It handles fetching, displaying, creating, editing, and deleting services.
 */
const ServicesExcellenceContent = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');

  /**
   * Fetches services from the API.
   */
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetchServices();
      setServices(data);
    } catch (error) {
      toast.error(`Failed to fetch services: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  /**
   * Handles changes in the form inputs.
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  /**
   * Handles changes in the features list.
   */
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  /**
   * Adds a new empty feature input field.
   */
  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  /**
   * Removes a feature at a specific index.
   */
  const removeFeature = (index) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  /**
   * Handles form submission for creating or updating a service.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitService(formData, editingService);
      toast.success(`Item ${editingService ? 'updated' : 'created'} successfully`);
      closeModal();
      fetchServices(); // Refresh data
    } catch (error) {
      toast.error(error.message);
    }
  };

  /**
   * Handles deleting a service.
   */
  const handleDelete = async (service) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await apiDeleteService(service.id, service.source_table);
      toast.success('Item deleted successfully');
      setServices(prev => prev.filter(s => s.id !== service.id));
    } catch (error) {
      toast.error(`Failed to delete item: ${error.message}`);
    }
  };

  /**
   * Opens the modal for creating or editing a service.
   */
  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title || '',
        description: service.description || '',
        type: service.type || 'service',
        icon: service.icon || '',
        features: service.features?.length ? service.features : [''],
        priority: service.priority || 1,
        isActive: service.is_active !== undefined ? service.is_active : true,
        source_table: service.source_table, // Keep track of the source table for updates
      });
    } else {
      setEditingService(null);
      setFormData(initialFormData);
    }
    setModalOpen(true);
  };

  /**
   * Closes the modal and resets the form.
   */
  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
    setFormData(initialFormData);
  };

  const filteredServices = serviceTypeFilter === 'all'
    ? services
    : services.filter(service => service.type === serviceTypeFilter);

  return (
    <div className="space-y-6">
      {/* Header with filter and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-800">Services & Excellence</h3>
          <select
            value={serviceTypeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Types</option>
            {SERVICE_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Loading or Grid View */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin h-8 w-8 text-green-600" />
          <span className="ml-2 text-gray-600">Loading services...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium">No items found</p>
              <p className="text-sm">Add services and excellence items to showcase your organization.</p>
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
                        {SERVICE_TYPES.find(t => t.value === service.type)?.label || service.type}
                      </span>
                    </div>
                  </div>
                  {service.is_active ? (
                    <CheckCircle className="h-5 w-5 text-green-600" title="Active" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-red-600" title="Inactive" />
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{service.description}</p>

                {service.features?.length > 0 && (
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
                        <li className="text-xs text-gray-500">+{service.features.length - 3} more features</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">Priority: {service.priority || 1}</div>
                  <div className="flex space-x-1">
                    <button onClick={() => openModal(service)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit Item">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(service)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete Item">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">{editingService ? 'Edit Item' : 'Add Item'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full input" required>
                    {SERVICE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full input" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <select name="icon" value={formData.icon} onChange={handleInputChange} className="w-full input">
                    <option value="">Select an icon</option>
                    {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <input type="number" name="priority" value={formData.priority} onChange={handleInputChange} className="w-full input" min="1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="flex-1 input" />
                    {formData.features.length > 1 && (
                      <button type="button" onClick={() => removeFeature(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addFeature} className="text-green-600 hover:text-green-700 text-sm flex items-center space-x-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Feature</span>
                </button>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="service_is_active" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="h-4 w-4 checkbox" />
                <label htmlFor="service_is_active" className="ml-2 block text-sm text-gray-900">Active (visible to public)</label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{editingService ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesExcellenceContent;
