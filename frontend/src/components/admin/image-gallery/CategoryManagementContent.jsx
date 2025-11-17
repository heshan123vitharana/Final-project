// frontend/src/components/admin/image-gallery/CategoryManagementContent.jsx
import { useState, useCallback, useEffect } from 'react';
import { Folder, Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchCategoriesWithCounts as apiFetchCategories,
  submitCategory,
  deleteCategory as apiDeleteCategory,
} from '../../../services/api';

const initialFormData = {
  name: '',
  slug: '',
  description: '',
  sort_order: 0,
  is_active: true,
};

/**
 * Manages the Categories section.
 * It handles fetching, displaying, creating, editing, and deleting categories.
 */
const CategoryManagementContent = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  /**
   * Fetches categories with image counts from the API.
   */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetchCategories();
      setCategories(data);
    } catch (error) {
      toast.error(`Failed to load categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * Handles form input changes.
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handles form submission for creating or updating a category.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      await submitCategory(formData, editingCategory);
      toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully`);
      closeModal();
      fetchCategories(); // Refresh data
    } catch (error) {
      toast.error(`Failed to save category: ${error.message}`);
    }
  };

  /**
   * Handles deleting a category.
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await apiDeleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories(); // Refresh data
    } catch (error) {
      toast.error(`Failed to delete category: ${error.message}`);
    }
  };

  /**
   * Opens the modal for creating or editing a category.
   */
  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        sort_order: category.sort_order || 0,
        is_active: category.is_active !== undefined ? category.is_active : true,
      });
    } else {
      setEditingCategory(null);
      setFormData(initialFormData);
    }
    setModalOpen(true);
  };

  /**
   * Closes the modal and resets the form.
   */
  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormData(initialFormData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Category Management</h3>
        <button
          onClick={() => openModal()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center space-x-2"
        >
          <Folder className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Loading or Table View */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin h-8 w-8 text-green-600" />
          <span className="ml-2 text-gray-600">Loading categories...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No categories found</p>
              <button onClick={() => openModal()} className="mt-4 btn-primary">
                Create First Category
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="th">Name</th>
                    <th className="th">Description</th>
                    <th className="th">Images</th>
                    <th className="th">Status</th>
                    <th className="th">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map(category => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="td">
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">/{category.slug}</div>
                      </td>
                      <td className="td text-gray-700 max-w-md">
                        <p className="truncate">{category.description || 'No description'}</p>
                      </td>
                      <td className="td">
                        <span className="badge-blue">{category.image_count || 0} images</span>
                      </td>
                      <td className="td">
                        <span className={`badge ${category.is_active ? 'badge-green' : 'badge-red'}`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="td">
                        <div className="flex space-x-2">
                          <button onClick={() => openModal(category)} className="text-blue-600 hover:text-blue-700" title="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-700" title="Delete">
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
      )}

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="input" required />
              </div>
              <div>
                <label className="label">Slug</label>
                <input type="text" value={formData.slug} onChange={(e) => handleInputChange('slug', e.target.value)} className="input" placeholder="Auto-generated from name" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows="3" className="input" />
              </div>
              <div>
                <label className="label">Sort Order</label>
                <input type="number" value={formData.sort_order} onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)} className="input" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="category-active" checked={formData.is_active} onChange={(e) => handleInputChange('is_active', e.target.checked)} className="checkbox" />
                <label htmlFor="category-active" className="label-inline">Active</label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingCategory ? 'Update' : 'Create'} Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagementContent;
