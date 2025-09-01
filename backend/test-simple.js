// Simple test for the API
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/prices',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testing API endpoint /api/prices...');

const req = http.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📄 Response body:');
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request error: ${e.message}`);
});

req.setTimeout(5000, () => {
  console.error('❌ Request timeout');
  req.destroy();
});

req.end();
