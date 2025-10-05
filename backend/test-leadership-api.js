const fetch = require('node-fetch');

async function testLeadershipAPI() {
  try {
    console.log('🧪 Testing Leadership API...');
    
    const response = await fetch('http://localhost:5000/api/leadership');
    
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLeadershipAPI();