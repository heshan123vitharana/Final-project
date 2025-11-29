const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api/regional-officers';
const TEST_OFFICER = {
    username: 'test_officer_001',
    password: 'password123',
    district: 'Colombo',
    email: 'test@example.com'
};

async function verifyRegionalOfficerFeature() {
    console.log('🚀 Starting Regional Officer Feature Verification...');
    let officerId = null;

    try {
        // 1. Create Officer
        console.log('\n1. Testing Create Officer...');
        let createRes = await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_OFFICER)
        });
        let createData = await createRes.json();

        if (createRes.ok) {
            console.log('✅ Officer created:', createData);
            officerId = createData.officerId;
        } else if (createData.message === 'Username already exists') {
            console.log('⚠️ Officer already exists, attempting to find...');
            const getAllRes = await fetch(API_URL);
            const officers = await getAllRes.json();
            const existing = officers.find(o => o.username === TEST_OFFICER.username);
            if (existing) {
                officerId = existing.id;
                console.log('✅ Found existing officer ID:', officerId);
            } else {
                throw new Error('Could not find existing officer');
            }
        } else {
            throw new Error(createData.message || 'Create failed');
        }

        // 2. Login
        console.log('\n2. Testing Login...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: TEST_OFFICER.username,
                password: TEST_OFFICER.password,
                district: TEST_OFFICER.district
            })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
        console.log('✅ Login successful:', loginData.message);
        if (!loginData.token) throw new Error('No token received');

        // 3. Get All Officers
        console.log('\n3. Testing Get All Officers...');
        const getAllRes = await fetch(API_URL);
        const officers = await getAllRes.json();
        console.log(`✅ Fetched ${officers.length} officers`);
        const createdOfficer = officers.find(o => o.id === officerId);
        if (!createdOfficer) throw new Error('Created officer not found in list');
        console.log('✅ Verified officer in list');

        // 4. Update Officer
        console.log('\n4. Testing Update Officer...');
        const updateRes = await fetch(`${API_URL}/${officerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                district: 'Gampaha',
                email: 'updated@example.com'
            })
        });
        const updateData = await updateRes.json();
        if (!updateRes.ok) throw new Error(updateData.message || 'Update failed');
        console.log('✅ Update successful:', updateData.message);

        // Verify update
        const verifyUpdateRes = await fetch(API_URL);
        const updatedOfficers = await verifyUpdateRes.json();
        const updatedOfficer = updatedOfficers.find(o => o.id === officerId);
        if (updatedOfficer.district !== 'Gampaha') throw new Error('District not updated');
        console.log('✅ Verified updated district');

        // 5. Delete Officer
        console.log('\n5. Testing Delete Officer...');
        const deleteRes = await fetch(`${API_URL}/${officerId}`, {
            method: 'DELETE'
        });
        const deleteData = await deleteRes.json();
        if (!deleteRes.ok) throw new Error(deleteData.message || 'Delete failed');
        console.log('✅ Delete successful:', deleteData.message);

        // Verify delete
        const finalRes = await fetch(API_URL);
        const finalOfficers = await finalRes.json();
        if (finalOfficers.find(o => o.id === officerId)) throw new Error('Officer still exists after delete');
        console.log('✅ Verified officer deletion');

        console.log('\n✨ All tests passed successfully!');

    } catch (error) {
        console.error('\n❌ Verification Failed:', error.message);
    }
}

verifyRegionalOfficerFeature();
