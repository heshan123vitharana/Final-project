const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api/regional-officers';
const TEST_OFFICER = {
    username: 'test_officer_prices',
    password: 'password123',
    district: 'Kandy', // Different district to avoid conflicts
    email: 'test_prices@example.com'
};

async function verifyPricesRoute() {
    console.log('🚀 Starting Prices Route Verification...');

    try {
        // 1. Create/Login Officer
        console.log('\n1. Authenticating...');
        let token = null;

        // Try login first
        let loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: TEST_OFFICER.username,
                password: TEST_OFFICER.password,
                district: TEST_OFFICER.district
            })
        });

        if (loginRes.ok) {
            const data = await loginRes.json();
            token = data.token;
            console.log('✅ Login successful');
        } else {
            // Try create if login fails
            console.log('⚠️ Login failed, attempting to create officer...');
            const createRes = await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(TEST_OFFICER)
            });

            if (createRes.ok || createRes.status === 400) { // 400 might mean already exists but wrong password/district in previous attempt, but let's assume success or we can retry login
                // If created, we need to login to get token
                loginRes = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: TEST_OFFICER.username,
                        password: TEST_OFFICER.password,
                        district: TEST_OFFICER.district
                    })
                });
                const data = await loginRes.json();
                if (!loginRes.ok) throw new Error('Login failed after creation: ' + data.message);
                token = data.token;
                console.log('✅ Created and Logged in');
            } else {
                throw new Error('Failed to create officer');
            }
        }

        if (!token) throw new Error('No token obtained');

        // 2. Fetch Prices
        console.log('\n2. Fetching Prices...');
        const pricesRes = await fetch(`${API_URL}/prices`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (pricesRes.ok) {
            const prices = await pricesRes.json();
            console.log('✅ Prices fetched successfully');
            console.log('Number of price entries:', prices.length);
            console.log('Response:', JSON.stringify(prices, null, 2));
        } else {
            console.error('❌ Failed to fetch prices:', pricesRes.status, pricesRes.statusText);
            const text = await pricesRes.text();
            console.error('Response body:', text);
        }

    } catch (error) {
        console.error('\n❌ Verification Failed:', error.message);
    }
}

verifyPricesRoute();
