import React, { useState } from 'react';
import PageTitle from './PageTitle';

const CollectionCenters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const centers = [
    {
      id: 1,
      name: "Colombo Main Collection Center",
      district: "Colombo",
      province: "Western",
      address: "No. 123, Galle Road, Colombo 03",
      phone: "+94 11 234 5678",
      email: "colombo@pmb.gov.lk",
      status: "Active",
      capacity: "5000 MT/month",
      operatingHours: "6:00 AM - 6:00 PM",
      services: ["Quality Testing", "Storage", "Processing", "Export Facilitation"]
    },
    {
      id: 2,
      name: "Kandy Regional Center",
      district: "Kandy",
      province: "Central",
      address: "No. 456, Peradeniya Road, Kandy",
      phone: "+94 81 234 5678",
      email: "kandy@pmb.gov.lk",
      status: "Active",
      capacity: "3000 MT/month",
      operatingHours: "6:00 AM - 6:00 PM",
      services: ["Quality Testing", "Storage", "Processing"]
    },
    {
      id: 3,
      name: "Galle Southern Hub",
      district: "Galle",
      province: "Southern",
      address: "No. 789, Matara Road, Galle",
      phone: "+94 91 234 5678",
      email: "galle@pmb.gov.lk",
      status: "Under Maintenance",
      capacity: "2500 MT/month",
      operatingHours: "Temporarily Closed",
      services: ["Storage", "Processing"]
    }
  ];

  const districts = [...new Set(centers.map(c => c.district))].sort();

  const filteredCenters = centers.filter(center => {
    const matchesSearch = !searchTerm || 
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = !selectedDistrict || center.district === selectedDistrict;
    const matchesStatus = !selectedStatus || center.status === selectedStatus;
    
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const handleSearchInput = (e) => {
    console.log('Search input changed to:', e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleDistrictSelect = (e) => {
    console.log('District changed to:', e.target.value);
    setSelectedDistrict(e.target.value);
  };

  const handleStatusSelect = (e) => {
    console.log('Status changed to:', e.target.value);
    setSelectedStatus(e.target.value);
  };

  const clearFilters = () => {
    console.log('Clearing all filters');
    setSearchTerm('');
    setSelectedDistrict('');
    setSelectedStatus('');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <PageTitle 
        title="Collection Centers Network"
        subtitle="Find your nearest PMB collection center for paddy and rice services"
        theme="professional"
      />

      {/* Debug Section */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        marginBottom: '20px', 
        borderRadius: '10px',
        border: '2px solid #007bff'
      }}>
        <h3>🔍 Search & Filter Debug Panel</h3>
        <p><strong>Search Term:</strong> "{searchTerm}"</p>
        <p><strong>Selected District:</strong> "{selectedDistrict}"</p>
        <p><strong>Selected Status:</strong> "{selectedStatus}"</p>
        <p><strong>Results:</strong> {filteredCenters.length} of {centers.length} centers</p>
        
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={() => setSearchTerm('test')}
            style={{ margin: '5px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Set Search to "test"
          </button>
          <button 
            onClick={() => setSelectedDistrict('Colombo')}
            style={{ margin: '5px', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Set District to "Colombo"
          </button>
          <button 
            onClick={clearFilters}
            style={{ margin: '5px', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Search Controls */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        marginBottom: '30px', 
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>🔍 Find Centers Near You</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* Search Input */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
              🔍 Search Centers
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInput}
              onInput={handleSearchInput}
              placeholder="Type to search centers..."
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                console.log('Search input focused');
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ddd';
              }}
            />
          </div>

          {/* District Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
              📍 Select District
            </label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictSelect}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: 'white',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                console.log('District dropdown focused');
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ddd';
              }}
            >
              <option value="">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
              ⚡ Status Filter
            </label>
            <select
              value={selectedStatus}
              onChange={handleStatusSelect}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: 'white',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                console.log('Status dropdown focused');
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ddd';
              }}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={clearFilters}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🗑️ Clear All Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>
          📋 Results: {filteredCenters.length} centers found
        </h3>
        
        {filteredCenters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No Centers Found</h3>
            <p style={{ color: '#888' }}>Try adjusting your search criteria</p>
            <button
              onClick={clearFilters}
              style={{
                marginTop: '15px',
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {filteredCenters.map(center => (
              <div 
                key={center.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  padding: '20px',
                  backgroundColor: '#fafafa'
                }}
              >
                <h4 style={{ color: '#333', marginBottom: '10px' }}>{center.name}</h4>
                <p style={{ color: '#666', marginBottom: '5px' }}>📍 {center.district}, {center.province}</p>
                <p style={{ color: '#666', marginBottom: '5px' }}>📞 {center.phone}</p>
                <p style={{ color: '#666', marginBottom: '5px' }}>⚡ {center.capacity}</p>
                <p style={{ color: '#666', marginBottom: '10px' }}>🕐 {center.operatingHours}</p>
                
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: center.status === 'Active' ? '#28a745' : '#ffc107',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {center.status === 'Active' ? '✅' : '⚠️'} {center.status}
                </div>

                <div style={{ marginTop: '15px' }}>
                  <strong>Services:</strong>
                  <div style={{ marginTop: '5px' }}>
                    {center.services.map((service, index) => (
                      <span 
                        key={index}
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '11px',
                          margin: '2px',
                          fontWeight: 'bold'
                        }}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionCenters;
