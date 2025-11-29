const fetch = require('node-fetch');

async function test() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch('http://localhost:5000/api/regional-officers/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'testofficer', password: 'password123', district: 'Colombo' })
        });
        const loginData = await loginRes.json();
        console.log('Login Result:', loginData.message || loginData);
        const token = loginData.token;

        if (!token) {
            console.error('Login failed');
            return;
        }

        // 2. Add Price
        console.log('Adding price...');
        const addRes = await fetch('http://localhost:5000/api/regional-officers/prices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                paddy_type: 'Test Paddy',
                paddy_condition: 'Dry',
                price_per_kg: 100,
                effective_date: '2023-10-27'
            })
        });
        const addData = await addRes.json();
        console.log('Add Price Result:', addData);
        const priceId = addData.id;

        if (!priceId) {
            console.error('Failed to add price');
            return;
        }

        // 3. Get Prices
        console.log('Fetching prices...');
        const getRes = await fetch('http://localhost:5000/api/regional-officers/prices', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const prices = await getRes.json();
        console.log(`Fetched ${prices.length} prices`);
        const myPrice = prices.find(p => p.id === priceId);
        console.log('My Price:', myPrice);

        if (!myPrice) {
            console.error('Price not found in list');
            return;
        }

        // 4. Update Price
        console.log('Updating price...');
        const updateRes = await fetch(`http://localhost:5000/api/regional-officers/prices/${priceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                price_per_kg: 110
            })
        });
        console.log('Update Price Result:', await updateRes.json());

        // 5. Verify Update
        console.log('Verifying update...');
        const getRes2 = await fetch('http://localhost:5000/api/regional-officers/prices', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const prices2 = await getRes2.json();
        const myPrice2 = prices2.find(p => p.id === priceId);
        console.log('Updated Price Value:', myPrice2.price_per_kg);

        if (parseFloat(myPrice2.price_per_kg) !== 110) {
            console.error('Update verification failed');
        } else {
            console.log('Update verified successfully');
        }

        // 6. Delete Price
        console.log('Deleting price...');
        const deleteRes = await fetch(`http://localhost:5000/api/regional-officers/prices/${priceId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Delete Price Result:', await deleteRes.json());

        // 7. Verify Delete
        console.log('Verifying delete...');
        const getRes3 = await fetch('http://localhost:5000/api/regional-officers/prices', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const prices3 = await getRes3.json();
        const myPrice3 = prices3.find(p => p.id === priceId);

        if (!myPrice3) {
            console.log('Delete verified successfully');
        } else {
            console.error('Delete verification failed');
        }

    } catch (err) {
        console.error('Test Error:', err);
    }
}

test();
