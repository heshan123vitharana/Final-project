import React from 'react';
import MillRegistration from '../MillPages/MillRegistration.jsx';

// Test component to directly test MillRegistration with mock data
const TestMillRegistration = () => {
  const mockUserData = {
    user: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@mill.lk',
      phone: '0771234567',
      business_name: 'Doe Rice Mill',
      business_type: 'private'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Mill Registration Test Page</h1>
        <p className="mb-4 text-gray-600">Testing the updated completeness bar with real database API calls</p>
      </div>
      <MillRegistration userData={mockUserData} />
    </div>
  );
};

export default TestMillRegistration;