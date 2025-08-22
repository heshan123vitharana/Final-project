import React from 'react';

const QuickActionButton = ({ label, onClick, primary = false }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 border-dashed transition-colors ${
      primary 
        ? 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700' 
        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
    }`}
  >
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default QuickActionButton;
