const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'paddy_management_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

async function createTable() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected!');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS regional_reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                officer_id INT NOT NULL,
                district VARCHAR(100) NOT NULL,
                report_type VARCHAR(50) NOT NULL,
                report_data JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (officer_id) REFERENCES regional_officers(id) ON DELETE CASCADE
            )
        `;

        console.log('Creating regional_reports table...');
        await connection.execute(createTableQuery);
        console.log('✅ Table regional_reports created successfully (or already exists).');

    } catch (error) {
        console.error('❌ Error creating table:', error);
    } finally {
        if (connection) await connection.end();
    }
}

createTable();
