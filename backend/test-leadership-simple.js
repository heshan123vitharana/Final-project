const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testLeadershipAPI() {
  try {
    console.log('🧪 Testing Leadership API...');
    
    // Test GET request
    const response = await fetch('http://localhost:5000/api/leadership');
    const data = await response.json();
    
    console.log('📊 GET /api/leadership response:');
    console.log('Status:', response.status);
    console.log('Success:', data.success);
    console.log('Data length:', data.data?.length || 0);
    console.log('Full response:', JSON.stringify(data, null, 2));
    
    // Test form data creation
    const testFormData = new FormData();
    testFormData.append('name', 'Test Leader');
    testFormData.append('position', 'Test Position');
    testFormData.append('bio', 'Test Bio');
    testFormData.append('email', 'test@example.com');
    testFormData.append('linkedin', 'https://linkedin.com/in/test');
    testFormData.append('twitter', 'https://twitter.com/test');
    testFormData.append('order_position', '1');
    testFormData.append('is_active', 'true');
    
    console.log('\n🧪 Testing POST with form data...');
    const postResponse = await fetch('http://localhost:5000/api/leadership', {
      method: 'POST',
      body: testFormData
    });
    
    const postData = await postResponse.json();
    console.log('📊 POST /api/leadership response:');
    console.log('Status:', postResponse.status);
    console.log('Success:', postData.success);
    console.log('Full response:', JSON.stringify(postData, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testLeadershipAPI();