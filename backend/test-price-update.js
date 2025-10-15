const http = require('http');

const data = JSON.stringify({
  price: 155.50
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/prices/1',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🔧 Sending PUT request to update price...');

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('📨 Response status:', res.statusCode);
    console.log('📨 Response body:', responseData);
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error);
});

req.write(data);
req.end();
