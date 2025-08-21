import React from "react";

const adminNav = [
  { label: "Dashboard", key: "dashboard" },
  { label: "License Requests", key: "license" },
  { label: "Mill Map", key: "map" },
  { label: "Price Management", key: "price" },
  { label: "Stock Dashboard", key: "stock" },
  { label: "Reports", key: "reports" },
];

export default function Sidebar({ active, onSelect, onLogout }) {
  return (
    <aside className="bg-emerald-700 text-white w-64 min-h-screen flex flex-col shadow-xl">
      <div className="p-6 font-bold text-2xl border-b border-emerald-600">Admin Panel</div>
      <nav className="flex-1 py-4">
        {adminNav.map((item) => (
          <button
            key={item.key}
            className={`w-full text-left px-6 py-3 font-medium hover:bg-emerald-600 transition-colors ${active === item.key ? "bg-emerald-800" : ""}`}
            onClick={() => onSelect(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <button
        className="m-6 mt-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
        onClick={onLogout}
      >
        Logout
      </button>
    </aside>
  );
}
