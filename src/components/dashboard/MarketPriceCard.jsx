import React from 'react';

const MarketPriceCard = ({ variety, price, change, trend, t, Icon }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-semibold text-gray-900">{t(`riceVarieties.${variety}`)}</h4>
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {Icon && <Icon className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />}
        <span>{Math.abs(change)}%</span>
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900">{price}/kg</p>
  </div>
);

export default MarketPriceCard;
