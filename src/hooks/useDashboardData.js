
import { useState } from 'react';

const initialData = {
  metrics: {
    totalRevenue: 2850000,
    paddyProcessed: 15420,
    activeContracts: 12,
    completedOrders: 89
  },
  marketPrices: [
    { variety: 'kekulu', price: 95, change: 2.5, trend: 'up' },
    { variety: 'samba', price: 88, change: -1.2, trend: 'down' },
    { variety: 'nadu', price: 82, change: 0.8, trend: 'up' },
    { variety: 'basmati', price: 125, change: 3.1, trend: 'up' }
  ],
  collectionCenters: [
    { id: 1, name: 'Ratnapura Collection Hub', location: 'ratnapura', status: 'active', capacity: '85%', distance: '12 km', contact: '+94 45 222 3344' },
    { id: 2, name: 'Embilipitiya Center', location: 'embilipitiya', status: 'active', capacity: '60%', distance: '28 km', contact: '+94 47 567 8901' },
    { id: 3, name: 'Balangoda Processing', location: 'balangoda', status: 'pending', capacity: '40%', distance: '35 km', contact: '+94 45 123 4567' }
  ],
  recentOrders: [
    { id: 'ORD-2024-001', customer: 'Perera Brothers Ltd', variety: 'kekulu', quantity: '500 kg', status: 'processing', date: '2024-08-20', value: 47500 },
    { id: 'ORD-2024-002', customer: 'Silva Rice Traders', variety: 'samba', quantity: '750 kg', status: 'completed', date: '2024-08-19', value: 66000 },
    { id: 'ORD-2024-003', customer: 'Modern Food Corp', variety: 'basmati', quantity: '300 kg', status: 'delivered', date: '2024-08-18', value: 37500 }
  ]
};

const useDashboardData = () => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError(null);
      // Optionally update data here
    } catch {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refreshData };
};

export default useDashboardData;
