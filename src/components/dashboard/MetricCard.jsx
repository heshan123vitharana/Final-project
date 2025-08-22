import React from 'react';

const MetricCard = ({ title, value, subtitle, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
  {/* Icon removed to resolve unused variable lint error */}
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {trend && (
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {/* You can import TrendingUp icon in Dashboard.jsx and pass as prop */}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  </div>
);

export default MetricCard;
