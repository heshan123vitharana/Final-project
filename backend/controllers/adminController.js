import { getDB } from '../db.js';

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);
       
        const db = getDB();
        
        // First, let's test if we can query the table at all
        try {
            const testQuery = 'SELECT COUNT(*) as total FROM admin';
            const countResult = await new Promise((resolve, reject) => {
                db.get(testQuery, [], (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                });
            });
            console.log('Total admin records:', countResult.total);
        } catch (testError) {
            console.log('Count query failed:', testError.message);
            return res.status(500).json({ message: 'Database connection error', error: testError.message });
        }
       
        // Query to get admin by email - ONLY select columns that exist
        const query = 'SELECT id, username, email, password, status FROM admin WHERE email = ? AND status = ?';
        console.log('Executing query:', query);
        console.log('With parameters:', [email, 'active']);
       
        const rows = await new Promise((resolve, reject) => {
            db.all(query, [email, 'active'], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
        console.log('Query successful, found records:', rows.length);
       
        if (rows.length === 0) {
            console.log('No admin found with email:', email);
            return res.status(401).json({
                message: 'Login error',
                error: 'Invalid email or password'
            });
        }
       
        const admin = rows[0];
        console.log('Found admin:', { id: admin.id, username: admin.username, email: admin.email });
       
        // Check password (plain text comparison for now)
        if (admin.password !== password) {
            console.log('Password mismatch for email:', email);
            return res.status(401).json({
                message: 'Login error',
                error: 'Invalid email or password'
            });
        }
       
        console.log('Login successful for:', admin.email);
       
        // Return success response
        res.status(200).json({
            message: 'Login successful',
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                status: admin.status
            }
        });
       
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Login error',
            error: error.message
        });
    }
};