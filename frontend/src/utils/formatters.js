export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatWeight = (weight) => {
  if (weight >= 1000) {
    return `${(weight / 1000).toFixed(1)}t`;
  }
  return `${weight}kg`;
};

export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusIcon = (status, icons) => {
  const iconMap = {
    active: icons.CheckCircle,
    pending: icons.Clock,
    completed: icons.CheckCircle,
    processing: icons.Activity,
    delivered: icons.Truck
  };
  return iconMap[status] || icons.AlertCircle;
};
