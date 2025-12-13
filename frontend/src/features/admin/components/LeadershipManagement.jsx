import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash, Save, X, User, Upload, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const LeadershipManagement = () => {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingLeader, setEditingLeader] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const fetchLeaders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/leadership');
      if (!response.ok) {
        throw new Error('Failed to fetch leadership data.');
      }
      const data = await response.json();
      setLeaders(data.data || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaders();
  }, [fetchLeaders]);

  const handleCreate = () => {
    // Calculate the next unique order number based on existing leaders
    const maxOrder = leaders.length > 0
      ? Math.max(...leaders.map(leader => leader.order_index || 0))
      : 0;

    setEditingLeader({
      name: '',
      role: '',
      email: '',
      linkedin_url: '',
      twitter_url: '',
      image_file: null,
      is_active: true,
      order_index: maxOrder + 1,
    });
    setIsCreating(true);
  };

  const handleEdit = (leader) => {
    setEditingLeader({ ...leader, image_file: null });
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingLeader(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!editingLeader) return;

    // Validate that order_index is unique (excluding current leader if editing)
    const duplicateOrder = leaders.find(
      leader =>
        leader.order_index === editingLeader.order_index &&
        leader.id !== editingLeader.id
    );

    if (duplicateOrder) {
      toast.error(`Order number ${editingLeader.order_index} is already used by ${duplicateOrder.name}. Please choose a unique order number.`);
      return;
    }

    const formData = new FormData();
    Object.keys(editingLeader).forEach(key => {
      if (key === 'image_file' && editingLeader[key]) {
        formData.append('image', editingLeader[key]);
      } else if (editingLeader[key] !== null && editingLeader[key] !== undefined) {
        formData.append(key, editingLeader[key]);
      }
    });

    const url = isCreating
      ? 'http://localhost:5000/api/leadership'
      : `http://localhost:5000/api/leadership/${editingLeader.id}`;
    const method = isCreating ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save leader.');
      }

      toast.success(`Leader ${isCreating ? 'created' : 'updated'} successfully!`);
      setEditingLeader(null);
      setIsCreating(false);
      fetchLeaders();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/leadership/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete leader.');
        }
        toast.success('Leader deleted successfully!');
        fetchLeaders();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingLeader(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setEditingLeader(prev => ({
      ...prev,
      image_file: e.target.files[0],
    }));
  };

  const handleReorder = async (newLeaders) => {
    try {
      // Update order_index for all leaders based on their new position
      const updates = newLeaders.map((leader, index) => ({
        id: leader.id,
        order_index: index + 1
      }));

      // Send batch update to backend
      const response = await fetch('http://localhost:5000/api/leadership/batch-update-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order.');
      }

      toast.success('Order updated successfully!');
      fetchLeaders();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDragStart = (e, leader) => {
    setDraggedItem(leader);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, leader) => {
    e.preventDefault();
    setDragOverItem(leader);
  };

  const handleDragEnd = () => {
    if (draggedItem && dragOverItem && draggedItem.id !== dragOverItem.id) {
      const sortedLeaders = [...leaders].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      const draggedIndex = sortedLeaders.findIndex(l => l.id === draggedItem.id);
      const dragOverIndex = sortedLeaders.findIndex(l => l.id === dragOverItem.id);

      const newLeaders = [...sortedLeaders];
      const [removed] = newLeaders.splice(draggedIndex, 1);
      newLeaders.splice(dragOverIndex, 0, removed);

      setLeaders(newLeaders);
      handleReorder(newLeaders);
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading leadership team...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Leadership Team</h1>
        {!editingLeader && (
          <button
            onClick={handleCreate}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Member
          </button>
        )}
      </div>

      {editingLeader ? (
        <EditForm
          leader={editingLeader}
          onSave={handleSave}
          onCancel={handleCancel}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          isCreating={isCreating}
        />
      ) : (
        <LeaderList
          leaders={leaders}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          draggedItem={draggedItem}
          dragOverItem={dragOverItem}
        />
      )}
    </div>
  );
};

const LeaderList = ({ leaders, onEdit, onDelete, onDragStart, onDragOver, onDragEnd, draggedItem, dragOverItem }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {leaders
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .map(leader => (
        <div
          key={leader.id}
          draggable
          onDragStart={(e) => onDragStart(e, leader)}
          onDragOver={(e) => onDragOver(e, leader)}
          onDragEnd={onDragEnd}
          className={`group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-300 cursor-move ${draggedItem?.id === leader.id ? 'opacity-50' : ''
            } ${dragOverItem?.id === leader.id ? 'border-green-500 border-2' : ''
            }`}
        >
          {/* Drag Handle */}
          <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>

          {/* Order Badge - Modern Design */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <span className="text-[10px] opacity-75">Order:</span>
              <span>{leader.order_index || 0}</span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Profile Image - Larger and Centered */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-green-100 group-hover:ring-green-300 transition-all duration-300 bg-gradient-to-br from-gray-100 to-gray-200">
                  {leader.image_url ? (
                    <img
                      src={`http://localhost:5000${leader.image_url}`}
                      alt={leader.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                      <User className="w-16 h-16 text-green-400" />
                    </div>
                  )}
                </div>
                {/* Status Indicator */}
                <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-white shadow-md ${leader.is_active ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
              </div>
            </div>

            {/* Member Info - Centered */}
            <div className="text-center space-y-2">
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-green-700 transition-colors">
                {leader.name}
              </h3>
              <p className="text-green-600 font-semibold text-sm uppercase tracking-wide">
                {leader.role}
              </p>
              <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {leader.email}
              </p>

              {/* Status Badge */}
              <div className="flex justify-center pt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${leader.is_active
                    ? 'bg-green-100 text-green-800 ring-1 ring-green-200'
                    : 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-1.5 ${leader.is_active ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  {leader.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Modern Floating Design */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex justify-center gap-3">
              <button
                onClick={() => onEdit(leader)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Edit size={16} />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <button
                onClick={() => onDelete(leader.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Trash size={16} />
                <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
  </div>
);

const EditForm = ({ leader, onSave, onCancel, onInputChange, onFileChange, isCreating }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold mb-4">{isCreating ? 'Add New Member' : 'Edit Member'}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="name"
        value={leader.name}
        onChange={onInputChange}
        placeholder="Name"
        className="p-2 border rounded w-full"
      />
      <input
        type="text"
        name="role"
        value={leader.role}
        onChange={onInputChange}
        placeholder="Role"
        className="p-2 border rounded w-full"
      />
      <input
        type="email"
        name="email"
        value={leader.email}
        onChange={onInputChange}
        placeholder="Email"
        className="p-2 border rounded w-full"
      />
      <input
        type="text"
        name="linkedin_url"
        value={leader.linkedin_url}
        onChange={onInputChange}
        placeholder="LinkedIn URL"
        className="p-2 border rounded w-full"
      />
      <input
        type="text"
        name="twitter_url"
        value={leader.twitter_url}
        onChange={onInputChange}
        placeholder="Twitter URL"
        className="p-2 border rounded w-full"
      />
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
        <input
          type="number"
          name="order_index"
          value={leader.order_index}
          onChange={onInputChange}
          placeholder="Order"
          min="1"
          className="p-2 border rounded w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Lower numbers appear first. Each leader should have a unique order number.
        </p>
      </div>
      <div className="md:col-span-2 flex items-center space-x-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            checked={leader.is_active}
            onChange={onInputChange}
            className="form-checkbox h-5 w-5 text-green-600"
          />
          <span className="ml-2 text-gray-700">Active</span>
        </label>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
        <div className="flex items-center">
          <label className="cursor-pointer flex items-center px-4 py-2 bg-white text-blue-500 rounded-lg shadow-md border border-blue-500 hover:bg-blue-500 hover:text-white">
            <Upload size={18} className="mr-2" />
            <span>{leader.image_file ? 'File Selected' : 'Choose File'}</span>
            <input type="file" name="image_file" onChange={onFileChange} className="hidden" />
          </label>
          {leader.image_file && <span className="ml-3">{leader.image_file.name}</span>}
          {!isCreating && leader.image_url && (
            <img src={`http://localhost:5000${leader.image_url}`} alt="Current" className="w-12 h-12 rounded-full ml-4 object-cover" />
          )}
        </div>
      </div>
    </div>
    <div className="flex justify-end mt-6 space-x-3">
      <button
        onClick={onCancel}
        className="flex items-center bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
      >
        <X size={20} className="mr-2" />
        Cancel
      </button>
      <button
        onClick={onSave}
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
      >
        <Save size={20} className="mr-2" />
        Save
      </button>
    </div>
  </div>
);

export default LeadershipManagement;
