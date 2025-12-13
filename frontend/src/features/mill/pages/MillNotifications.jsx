import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showInfoToast, showErrorToast } from '../../../utils/validation';

const MillNotifications = () => {
  // State to hold notifications
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const hasWarnedAboutAuth = useRef(false);
  const navigate = useNavigate();

  const resolveAuthToken = useCallback(() => {
    const storageToken = sessionStorage.getItem('token')
      || sessionStorage.getItem('authToken')
      || localStorage.getItem('token');
    if (storageToken) {
      return storageToken;
    }

    try {
      const sessionData = sessionStorage.getItem('millOwnerData');
      if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        if (parsedSession?.token) {
          return parsedSession.token;
        }
      }
    } catch (error) {
      console.error('Failed to parse mill session storage for token:', error);
    }

    try {
      const localData = localStorage.getItem('millData');
      if (localData) {
        const parsedLocal = JSON.parse(localData);
        if (parsedLocal?.token) {
          return parsedLocal.token;
        }
      }
    } catch (error) {
      console.error('Failed to parse mill local storage for token:', error);
    }

    return null;
  }, []);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      const token = resolveAuthToken();
      if (!token) {
        if (!hasWarnedAboutAuth.current) {
          console.log('No token found, user not logged in');
          showInfoToast('Please sign in again to view notifications.');
          hasWarnedAboutAuth.current = true;
        }
        setLoading(false);
        setNotifications([]);
        return;
      }

      const response = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token expired or invalid
        console.log('Authentication failed, redirecting to login');
        localStorage.removeItem('token');
        showErrorToast('Session expired. Please login again.');
        navigate('/');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.data || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Don't show error toast for initial load failures
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [hasWarnedAboutAuth, navigate, resolveAuthToken]);

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Update page title with notification count
  useEffect(() => {
    document.title = `Dashboard | Notifications (${unreadCount})`;
  }, [unreadCount]);

  // Remove a single notification by id
  const dismissNotification = async (id) => {
    try {
      const token = resolveAuthToken();
      if (!token) {
        showErrorToast('Session expired. Please login again.');
        navigate('/');
        return;
      }
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((note) => note.id !== id));
        showInfoToast('Notification dismissed');
      } else {
        showErrorToast('Failed to dismiss notification');
      }
    } catch (error) {
      console.error('Error dismissing notification:', error);
      showErrorToast('Failed to dismiss notification');
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const token = resolveAuthToken();
      if (!token) {
        showErrorToast('Session expired. Please login again.');
        navigate('/');
        return;
      }
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications((prev) => 
          prev.map((note) => 
            note.id === id ? { ...note, is_read: true } : note
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all notifications?')) {
      return;
    }

    try {
      const token = resolveAuthToken();
      if (!token) {
        showErrorToast('Session expired. Please login again.');
        navigate('/');
        return;
      }
      const response = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/notifications', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
        showSuccessToast('All notifications cleared');
      } else {
        showErrorToast('Failed to clear notifications');
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
      showErrorToast('Failed to clear notifications');
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'price_update':
        return '💰';
      case 'stock_update':
        return '📦';
      case 'license_update':
        return '📋';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="p-6 bg-green-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Header with notification count */}
      <h1 className="text-3xl font-bold mb-6 text-green-700 border-b-4 border-green-300 pb-2 flex items-center gap-3">
        Notifications
        {unreadCount > 0 && (
          <span className="ml-2 bg-green-600 text-white text-sm px-3 py-1 rounded-full">
            {unreadCount} new
          </span>
        )}
      </h1>

      {/* Clear All button, shown only if notifications exist */}
      {notifications.length > 0 && (
        <div className="flex justify-end mb-4">
          <button onClick={clearAll} className="text-sm text-red-600 hover:text-red-800 transition">
            Clear All
          </button>
        </div>
      )}

      {/* Notification List */}
      <div className="rounded-lg shadow-md border border-green-200 bg-white p-4">
        {/* Show message if no notifications */}
        {notifications.length === 0 ? (
          <p className="text-gray-500 italic text-center py-6">🎉 No new notifications!</p>
        ) : (
          <div className="space-y-4">
            {/* Render each notification */}
            {notifications.map((note) => (
              <div
                key={note.id}
                className={`border ${note.is_read ? 'border-gray-200 bg-white' : 'border-green-300 bg-green-50'} rounded-lg p-5 hover:bg-green-100 transition relative cursor-pointer`}
                onClick={() => !note.is_read && markAsRead(note.id)}
              >
                {/* Dismiss button for individual notification */}
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(note.id);
                  }}
                  aria-label="Dismiss notification"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Unread indicator */}
                {!note.is_read && (
                  <div className="absolute top-3 left-3">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </div>
                )}

                {/* Notification content */}
                <div className="ml-8">
                  <h2 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                    <span>{getNotificationIcon(note.type)}</span>
                    {note.title}
                  </h2>
                  <p className="text-gray-700 mt-1">{note.message}</p>
                  <p className="text-sm text-green-600 mt-2">📅 {formatDate(note.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MillNotifications;
