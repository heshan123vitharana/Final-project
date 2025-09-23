const mysql = require('mysql2/promise');

async function addTestLicenses() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'paddy_management'
  });

  const testLicenses = [
    {
      user_id: 2,
      application_number: 'PMB-APP-2024-001',
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@example.com',
      phone: '0771234567',
      business_name: 'Golden Rice Mill',
      business_type: 'private',
      city: 'Kandy',
      district: 'Kandy',
      license_type: 'Rice Mill License',
      mill_capacity: '500 bags per day',
      comments: 'New rice mill application for central region',
      status: 'pending'
    },
    {
      user_id: 2,
      application_number: 'PMB-APP-2024-002',
      first_name: 'Kamala',
      last_name: 'Fernando',
      email: 'kamala.fernando@example.com',
      phone: '0771234568',
      business_name: 'Lanka Mills Private Ltd',
      business_type: 'private',
      city: 'Gampaha',
      district: 'Gampaha',
      license_type: 'Rice Mill License',
      mill_capacity: '1000 bags per day',
      comments: 'Expansion of existing mill operations',
      status: 'pending'
    },
    {
      user_id: 2,
      application_number: 'PMB-APP-2024-003',
      first_name: 'Sunil',
      last_name: 'Perera',
      email: 'sunil.perera@example.com',
      phone: '0771234569',
      business_name: 'Heritage Rice Mills',
      business_type: 'private',
      city: 'Colombo',
      district: 'Colombo',
      license_type: 'Rice Mill License',
      mill_capacity: '750 bags per day',
      comments: 'Modern rice processing facility with advanced technology',
      status: 'approved',
      license_number: 'PMB/ML/2024/001',
      approved_date: '2024-01-15',
      approval_comments: 'All requirements met, license approved'
    }
  ];

  for (const license of testLicenses) {
    const [result] = await connection.execute(`
      INSERT INTO mill_licenses (
        user_id, application_number, first_name, last_name, email, phone,
        business_name, business_type, city, district, license_type,
        mill_capacity, comments, status, license_number, approved_date,
        approval_comments, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      license.user_id, license.application_number,
      license.first_name, license.last_name,
      license.email, license.phone,
      license.business_name, license.business_type,
      license.city, license.district,
      license.license_type, license.mill_capacity,
      license.comments, license.status,
      license.license_number || null,
      license.approved_date || null,
      license.approval_comments || null
    ]);

    console.log(`Test license application created: ${license.application_number} (ID: ${result.insertId})`);
  }

  await connection.end();
  console.log('All test license applications created successfully!');
}

addTestLicenses().catch(console.error);