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

  return (
    <div className="bg-green-50 p-6 rounded-xl shadow-lg border border-green-200">
      {/* Page heading with icon */}
      <h1 className="text-3xl font-bold mb-6 text-green-800 flex items-center gap-3">
        <BellIcon className="h-8 w-8 text-green-600" />
        Notifications
      </h1>

      {/* Show message if no notifications */}
      {notifications.length === 0 ? (
        <p className="text-gray-500 italic">🎉 No new notifications!</p>
      ) : (
        <div className="space-y-4">
          {/* Render each notification */}
          {notifications.map((note) => (
            <div
              key={note.id}
              className="bg-white border border-green-300 rounded-lg p-5 shadow-md hover:shadow-xl transition duration-300 relative"
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
              <h2 className="text-lg font-semibold text-green-700">{note.title}</h2>
              <p className="text-gray-700">{note.message}</p>
              <p className="text-sm text-green-600 mt-2">📅 {note.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;