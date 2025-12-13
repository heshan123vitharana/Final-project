const http = require('http');
const jwt = require('jsonwebtoken');

const loginData = JSON.stringify({
    username: 'ampara',
    password: 'password123',
    district: 'Ampara'
});

const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/regional-officers/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

console.log('=== Checking JWT Token District ===\n');

const loginReq = http.request(loginOptions, (loginRes) => {
    let loginBody = '';

    loginRes.on('data', (chunk) => {
        loginBody += chunk;
    });

    loginRes.on('end', () => {
        if (loginRes.statusCode !== 200) {
            console.error('Login failed:', loginRes.statusCode);
            console.error(loginBody);
            process.exit(1);
        }

        const loginResponse = JSON.parse(loginBody);
        const token = loginResponse.token;

        // Decode the token
        const decoded = jwt.decode(token);

        console.log('JWT Payload:');
        console.log(JSON.stringify(decoded, null, 2));
        console.log('\nDistrict in token:', decoded.district);
        console.log('Expected district: Ampara');
        console.log('Match?', decoded.district === 'Ampara');

        process.exit(0);
    });
});

loginReq.on('error', (error) => {
    console.error('Login request error:', error);
    process.exit(1);
});

loginReq.write(loginData);
loginReq.end();
