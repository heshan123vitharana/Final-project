const http = require('http');

// Test function
function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/prices',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response body:', data);
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    process.exit(1);
  });

  req.end();
}

// Test if server is running at all
const testRoot = () => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Root endpoint status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Root response:', data);
      console.log('\nNow testing /api/prices...');
      testAPI();
    });
  });

  req.on('error', (e) => {
    console.error(`Server not responding: ${e.message}`);
    console.error('Make sure the backend server is running on port 5000');
    process.exit(1);
  });

  req.end();
};

console.log('Testing API endpoints...');
testRoot();
