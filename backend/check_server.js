const fetch = require('node-fetch');

async function check() {
    try {
        console.log('Checking http://localhost:5000/api/regional-officers/prices...');
        const res = await fetch('http://localhost:5000/api/regional-officers/prices', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' } // No auth, should return 401 if route exists, 404 if not
        });
        console.log('Status:', res.status);
        if (res.status === 404) {
            console.log('Confirmed: Route not found (404)');
        } else if (res.status === 401) {
            console.log('Confirmed: Route exists (401 Unauthorized)');
        } else {
            console.log('Unexpected status:', res.status);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

check();
