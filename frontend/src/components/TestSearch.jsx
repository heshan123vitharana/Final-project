import React, { useState } from 'react';

const TestSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  console.log('🔍 Component Rendered - Search:', searchTerm, 'District:', selectedDistrict);

  const handleSearchChange = (e) => {
    console.log('🔍 SEARCH CHANGE EVENT:', e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleDistrictChange = (e) => {
    console.log('📍 DISTRICT CHANGE EVENT:', e.target.value);
    setSelectedDistrict(e.target.value);
  };

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h2>🧪 Search Functionality Test</h2>
      
      <div style={{ marginBottom: '20px', padding: '10px', background: '#ddd' }}>
        <p><strong>Current Values:</strong></p>
        <p>Search Term: "{searchTerm}"</p>
        <p>Selected District: "{selectedDistrict}"</p>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Search Input:</label><br/>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Type here to test..."
          style={{ padding: '10px', fontSize: '16px', width: '300px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>District Select:</label><br/>
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          style={{ padding: '10px', fontSize: '16px', width: '320px' }}
        >
          <option value="">Choose District</option>
          <option value="Colombo">Colombo</option>
          <option value="Kandy">Kandy</option>
          <option value="Galle">Galle</option>
        </select>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => setSearchTerm('test')}
          style={{ padding: '10px', margin: '5px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Set Search to "test"
        </button>
        <button 
          onClick={() => setSelectedDistrict('Colombo')}
          style={{ padding: '10px', margin: '5px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Set District to "Colombo"
        </button>
        <button 
          onClick={() => { setSearchTerm(''); setSelectedDistrict(''); }}
          style={{ padding: '10px', margin: '5px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default TestSearch;
