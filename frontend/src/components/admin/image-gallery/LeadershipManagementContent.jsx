// frontend/src/components/admin/image-gallery/LeadershipManagementContent.jsx
import { useState, useCallback, useEffect } from 'react';
import { RefreshCw, ArrowUpDown, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

import LeadershipGrid from './LeadershipGrid';
import LeadershipModal from './LeadershipModal';
import { fetchLeadership as apiFetchLeadership, reorderLeadership, deleteLeadership, submitLeadership } from '../../../services/api';

/**
 * Manages the Leadership Team section in the admin panel.
 * It handles fetching, displaying, adding, editing, and deleting leadership members.
 */
const LeadershipManagementContent = () => {
  // State to hold the list of leadership members
  const [leadership, setLeadership] = useState([]);
  // State to manage the loading status
  const [loading, setLoading] = useState(false);
  // State to hold the currently editing leader
  const [editingLeader, setEditingLeader] = useState(null);
  // State to control the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Fetches the leadership data from the API and updates the state.
   */
  const fetchLeadership = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetchLeadership();
      setLeadership(data);
      toast.success('Leadership data refreshed!');
    } catch (error) {
      toast.error(`Failed to fetch leadership data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchLeadership();
  }, [fetchLeadership]);

  /**
   * Handles the automatic reordering of leadership members.
   */
  const handleAutoReorder = async () => {
    if (!window.confirm('This will automatically reassign order numbers (1, 2, 3...) to all leaders based on their current order. Continue?')) {
      return;
    }
    setLoading(true);
    try {
      const data = await reorderLeadership();
      toast.success(`Successfully reordered ${data.updated} leaders!`);
      fetchLeadership(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Failed to reorder leaders');
      setLoading(false);
    }
  };

  /**
   * Handles deleting a leadership member.
   * @param {object} leader - The leader to delete.
   */
  const handleDelete = async (leader) => {
    if (!window.confirm('Are you sure you want to delete this leadership member?')) return;

    try {
      await deleteLeadership(leader.id);
      toast.success('Leadership member deleted successfully');
      // Remove the deleted member from the local state
      setLeadership(prev => prev.filter(l => l.id !== leader.id));
    } catch (error) {
      toast.error(`Failed to delete member: ${error.message}`);
    }
  };

  /**
   * Handles submitting the form for creating or updating a leader.
   * @param {object} formData - The form data for the leader.
   */
  const handleFormSubmit = async (formData) => {
    try {
      await submitLeadership(formData, editingLeader, leadership);
      toast.success(`Leadership member ${editingLeader ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      fetchLeadership(); // Refresh data
    } catch (error) {
      toast.error(error.message);
      throw error; // Re-throw to notify the modal
    }
  };

  // Opens the modal to add or edit a leader
  const openModal = (leader = null) => {
    setEditingLeader(leader);
    setIsModalOpen(true);
  };

  // Closes the modal
  const closeModal = () => {
    setEditingLeader(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Title and Action Buttons */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-800">Leadership Team</h3>
          {/* Badges showing total, active, and inactive members */}
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
              Total: {leadership.length}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
              Active: {leadership.filter(l => l.is_active).length}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium">
              Inactive: {leadership.filter(l => !l.is_active).length}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Refresh Button */}
          <button
            onClick={fetchLeadership}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center space-x-2"
            title="Refresh data"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          {/* Auto-Reorder Button */}
          <button
            onClick={handleAutoReorder}
            className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
            title="Automatically fix duplicate order numbers"
            disabled={loading}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>Auto-Reorder</span>
          </button>
          {/* Add Member Button */}
          <button
            onClick={() => openModal()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin h-8 w-8 text-green-600" />
          <span className="ml-2 text-gray-600">Loading leadership...</span>
        </div>
      ) : (
        <LeadershipGrid
          leadership={leadership}
          onEdit={openModal}
          onDelete={handleDelete}
        />
      )}

      {/* Modal for Adding/Editing a Leader */}
      {isModalOpen && (
        <LeadershipModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleFormSubmit}
          leader={editingLeader}
          existingLeaders={leadership}
        />
      )}
    </div>
  );
};

export default LeadershipManagementContent;
