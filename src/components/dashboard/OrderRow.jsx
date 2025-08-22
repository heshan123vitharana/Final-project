import React from 'react';

const OrderRow = ({ order, t, StatusIcon }) => (
  <tr className="border-t border-gray-100 hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">{order.id}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{order.customer}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{t(`riceVarieties.${order.variety}`)}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{order.quantity}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
        {StatusIcon && <StatusIcon className="w-4 h-4" />}
        <span>{t(`status.${order.status}`)}</span>
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{order.value}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-500">{order.date}</div>
    </td>
  </tr>
);

export default OrderRow;
