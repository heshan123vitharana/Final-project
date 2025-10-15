import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash, Save, X, User, Upload, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';

const LeadershipManagement = () => {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingLeader, setEditingLeader] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleAutoReorder = async () => {
    if (!window.confirm('This will automatically reassign order numbers (1, 2, 3...) to all leaders based on their current order. Continue?')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/leadership/reorder', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reorder leaders.');
      }

      const data = await response.json();
      toast.success(`Successfully reordered ${data.updated} leaders!`);
      fetchLeaders();
    } catch (err) {
      toast.error(err.message);
    }
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
          <div className="flex space-x-3">
            <button
              onClick={handleAutoReorder}
              className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition-colors"
              title="Automatically fix duplicate order numbers"
            >
              <ArrowUpDown size={20} className="mr-2" />
              Auto-Reorder
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Member
            </button>
          </div>
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
        <LeaderList leaders={leaders} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

const LeaderList = ({ leaders, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {leaders
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .map(leader => (
      <div key={leader.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col relative">
        {/* Order Badge */}
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          Order: {leader.order_index || 0}
        </div>
        
        <div className="flex-grow flex items-center mt-2">
          <div className="w-24 h-24 rounded-full overflow-hidden mr-4 flex-shrink-0 bg-gray-200">
            {leader.image_url ? (
              <img
                src={`http://localhost:5000${leader.image_url}`}
                alt={leader.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="font-bold text-lg text-gray-900">{leader.name}</h3>
            <p className="text-gray-600">{leader.role}</p>
            <p className="text-sm text-gray-500">{leader.email}</p>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                leader.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {leader.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => onEdit(leader)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(leader.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-full"
          >
            <Trash size={18} />
          </button>
        </div>
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
