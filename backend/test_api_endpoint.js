const http = require('http');

// First, we need to login to get a token
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

console.log('=== Testing Regional Officer API ===\n');
console.log('Step 1: Logging in...\n');

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
        console.log('✅ Login successful');
        console.log('Token:', loginResponse.token.substring(0, 20) + '...\n');

        // Now test the active-mills endpoint
        console.log('Step 2: Fetching active mills...\n');

        const millsOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/regional-officers/active-mills',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${loginResponse.token}`
            }
        };

        const millsReq = http.request(millsOptions, (millsRes) => {
            let millsBody = '';

            millsRes.on('data', (chunk) => {
                millsBody += chunk;
            });

            millsRes.on('end', () => {
                console.log('Status Code:', millsRes.statusCode);
                console.log('Response:\n');

                if (millsRes.statusCode === 200) {
                    const response = JSON.parse(millsBody);
                    console.log(JSON.stringify(response, null, 2));
                    console.log(`\n✅ Found ${response.count} mills`);
                } else {
                    console.error('❌ Error:', millsBody);
                }

                process.exit(0);
            });
        });

        millsReq.on('error', (error) => {
            console.error('Request error:', error);
            process.exit(1);
        });

        millsReq.end();
    });
});

loginReq.on('error', (error) => {
    console.error('Login request error:', error);
    process.exit(1);
});

loginReq.write(loginData);
loginReq.end();
