const bcrypt = require('bcrypt');
const db = require('../database');

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);
       
        // First, let's test if we can query the table at all
        try {
            const testQuery = 'SELECT COUNT(*) as total FROM admin';
            const [countResult] = await db.execute(testQuery);
            console.log('Total admin records:', countResult[0].total);
        } catch (testError) {
            console.log('Count query failed:', testError.message);
            return res.status(500).json({ message: 'Database connection error', error: testError.message });
        }
       
        // Query to get admin by email - ONLY select columns that exist
        const query = 'SELECT id, username, email, password, status FROM admin WHERE email = ? AND status = ?';
        console.log('Executing query:', query);
        console.log('With parameters:', [email, 'active']);
       
        const [rows] = await db.execute(query, [email, 'active']);
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

        const passwordMatches = await bcrypt.compare(password, admin.password);
        if (!passwordMatches) {
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

const getReport = async (req, res) => {
    try {
        const { reportType, from, to, region } = req.query;

        // Basic validation
        if (!reportType || !from || !to) {
            return res.status(400).json({ message: 'Missing required query parameters: reportType, from, to' });
        }

        let query = '';
        const params = [from, to];

        switch (reportType) {
            case 'licenses':
                query = `
                    SELECT 
                        status, 
                        COUNT(*) as value,
                        (SELECT COUNT(*) FROM licenses WHERE application_date BETWEEN ? AND ?) as total
                    FROM licenses 
                    WHERE application_date BETWEEN ? AND ?
                `;
                params.push(from, to, from, to);

                if (region && region !== 'All Regions') {
                    query += ' AND district = ?';
                    params.push(region.replace(' Province', ''));
                }
                query += ' GROUP BY status';
                break;
            
            case 'stock':
                query = `
                    SELECT 
                        s.paddy_type as category, 
                        SUM(s.quantity) as value,
                        (SELECT SUM(quantity) FROM stock WHERE last_updated BETWEEN ? AND ?) as total
                    FROM stock s
                    WHERE s.last_updated BETWEEN ? AND ?
                `;
                params.push(from, to, from, to);
                // Region filtering for stock would require joins, simplified for now
                query += ' GROUP BY s.paddy_type';
                break;

            default: {
                // Return mock data for other report types for now
                console.log(`No specific query for report type: ${reportType}. Returning mock data.`);
                const mockData = getMockDataForReport(reportType);
                if (mockData) {
                    return res.status(200).json(mockData);
                }
                return res.status(404).json({ message: 'Report type not found' });
            }
        }

        const [rows] = await db.execute(query, params);

        if (rows.length === 0) {
            return res.status(200).json({ summary: {}, breakdown: [] });
        }

        const total = rows[0].total || rows.reduce((sum, row) => sum + row.value, 0);

        const breakdown = rows.map(row => ({
            category: row.status || row.category,
            value: row.value,
            percentage: total > 0 ? ((row.value / total) * 100).toFixed(2) : 0
        }));

        const summary = breakdown.reduce((acc, item) => {
            acc[item.category.toLowerCase()] = item.value;
            return acc;
        }, { totalApplications: total });
        
        res.status(200).json({ summary, breakdown });

    } catch (error) {
        console.error('Error in getReport:', error);
        res.status(500).json({
            message: 'Failed to generate report',
            error: error.message
        });
    }
};

// Helper for mock data
const getMockDataForReport = (reportType) => {
    const mockReportData = {
        production: {
          summary: { monthlyProduction: 5240, dailyAverage: 169, targetAchievement: 87, qualityGrade: 'A+' },
          breakdown: [
            { category: 'Premium Grade', value: 2100, percentage: 40 },
            { category: 'Standard Grade', value: 2040, percentage: 39 },
            { category: 'Commercial Grade', value: 1100, percentage: 21 }
          ]
        },
        financial: {
          summary: { totalRevenue: 2450000, totalCosts: 1890000, profit: 560000, profitMargin: 23 },
          breakdown: [
            { category: 'Processing Revenue', value: 1470000, percentage: 60 },
            { category: 'Storage Revenue', value: 735000, percentage: 30 },
            { category: 'Other Revenue', value: 245000, percentage: 10 }
          ]
        },
        mills: {
          summary: { totalMills: 8, activeMills: 7, averageUtilization: 83, topPerformer: 'Green Valley Rice Mill' },
          breakdown: [
            { category: 'High Performance (>85%)', value: 3, percentage: 38 },
            { category: 'Good Performance (70-85%)', value: 4, percentage: 50 },
            { category: 'Low Performance (<70%)', value: 1, percentage: 12 }
          ]
        }
    };
    return mockReportData[reportType];
};


module.exports = {
    adminLogin,
    getReport
};