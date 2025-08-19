// Import icons and React hooks
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

// Initial notification data (could be replaced by API data)
const initialNotifications = [
  {
    id: 1,
    title: "New paddy price updated",
    message: "Samba - LKR 120/kg",
    date: "2025-08-06",
  },
  {
    id: 2,
    title: "Payment deadline extended",
    message: "New deadline: 2025-08-15",
    date: "2025-08-05",
  },
];

const Notifications = () => {
  // State for notification list
  const [notifications, setNotifications] = useState(initialNotifications);

  // Update browser tab title with notification count
  useEffect(() => {
    document.title = `Dashboard | Notifications (${notifications.length})`;
  }, [notifications]);

  // Remove notification by id
  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((note) => note.id !== id));
  };

  // Clear all notifications
  const clearAll = () => setNotifications([]);

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-green-700 border-b-4 border-green-300 pb-2 flex items-center gap-3">
        <BellIcon className="h-8 w-8 text-green-600" />
        Notifications
        {/* Count badge */}
        {notifications.length > 0 && (
          <span className="ml-2 bg-green-600 text-white text-sm px-2 py-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </h1>

      {/* Clear All button */}
      {notifications.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:text-red-800 transition"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Notification List */}
      <div className="rounded-lg shadow-md border border-green-200 bg-white p-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 italic text-center py-6">
            🎉 No new notifications!
          </p>
        ) : (
          <div className="space-y-4">
            {notifications.map((note) => (
              <div
                key={note.id}
                className="border border-green-200 rounded-lg p-5 bg-green-50 hover:bg-green-100 transition relative"
              >
                {/* Dismiss button */}
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition duration-200"
                  onClick={() => dismissNotification(note.id)}
                  aria-label="Dismiss notification"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Notification content */}
                <h2 className="text-lg font-semibold text-green-700">
                  {note.title}
                </h2>
                <p className="text-gray-700">{note.message}</p>
                <p className="text-sm text-green-600 mt-2">📅 {note.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
