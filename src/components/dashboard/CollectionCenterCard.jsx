import React from 'react';

const CollectionCenterCard = ({ center, t, StatusIcon }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-semibold text-gray-900">{center.name}</h4>
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${center.statusColor}`}>
        {StatusIcon && <StatusIcon className="w-4 h-4" />}
        <span>{t(`status.${center.status}`)}</span>
      </span>
    </div>
    <div className="space-y-2 text-sm text-gray-600">
      <div className="flex items-center space-x-2">
        <span>{center.locationLabel} • {center.distance}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span>{center.contact}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Capacity:</span>
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: center.capacity }}></div>
          </div>
          <span className="font-medium">{center.capacity}</span>
        </div>
      </div>
    </div>
  </div>
);

export default CollectionCenterCard;
