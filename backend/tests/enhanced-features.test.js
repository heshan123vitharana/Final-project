// backend/tests/enhanced-features.test.js
const request = require('supertest');
const app = require('../server');
const pool = require('../config/database');

describe('Enhanced Features Integration Tests', () => {
    let testUserId;
    let testLicenseId;
    let authToken;

    beforeAll(async () => {
        // Setup test data
        await setupTestData();
    });

    afterAll(async () => {
        // Cleanup test data
        await cleanupTestData();
        await pool.end();
    });

    describe('1. Profile Completeness with mill_district', () => {
        test('should return valid districts list', async () => {
            const response = await request(app)
                .get('/api/profile/districts')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.districts).toBeInstanceOf(Array);
            expect(response.body.districts.length).toBeGreaterThan(0);
            expect(response.body.districts[0]).toHaveProperty('name');
            expect(response.body.districts[0]).toHaveProperty('province');
        });

        test('should calculate completeness with mill_district validation', async () => {
            const response = await request(app)
                .get(`/api/profile/completeness/${testUserId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('completeness');
            expect(response.body).toHaveProperty('personalCompleteness');
            expect(response.body).toHaveProperty('businessCompleteness');
            expect(response.body).toHaveProperty('fieldStatus');
            expect(response.body).toHaveProperty('canApplyForLicense');
        });

        test('should reject invalid mill_district', async () => {
            // Update user with invalid district
            await pool.execute(
                'UPDATE users SET mill_district = ? WHERE id = ?',
                ['Invalid District', testUserId]
            );

            const response = await request(app)
                .get(`/api/profile/completeness/${testUserId}`)
                .expect(200);

            expect(response.body.millDistrictError).toBeTruthy();
            expect(response.body.canApplyForLicense).toBe(false);
        });
    });

    describe('2. Dynamic Paddy Price Selection', () => {
        test('should fetch prices by district and type', async () => {
            const response = await request(app)
                .get('/api/prices/by-district-type')
                .query({
                    district: 'Hambantota',
                    paddyType: 'Nadu - White',
                    condition: 'Dry'
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);
            if (response.body.data.length > 0) {
                expect(response.body.data[0]).toHaveProperty('pricePerKg');
                expect(response.body.data[0]).toHaveProperty('district');
                expect(response.body.data[0]).toHaveProperty('paddyType');
            }
        });

        test('should get paddy types by district', async () => {
            const response = await request(app)
                .get('/api/prices/paddy-types')
                .query({ district: 'Hambantota' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);
        });

        test('should validate price selection', async () => {
            // First get available prices
            const pricesResponse = await request(app)
                .get('/api/prices/by-district-type')
                .query({
                    district: 'Hambantota',
                    paddyType: 'Nadu - White',
                    condition: 'Dry'
                });

            if (pricesResponse.body.data.length > 0) {
                const priceId = pricesResponse.body.data[0].id;

                const response = await request(app)
                    .post('/api/prices/validate')
                    .send({
                        district: 'Hambantota',
                        paddyType: 'Nadu - White',
                        condition: 'Dry',
                        selectedPriceId: priceId
                    })
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.priceData).toHaveProperty('pricePerKg');
            }
        });
    });

    describe('3. Enhanced User Registration with Password Management', () => {
        test('should register user with temporary password', async () => {
            const userData = {
                first_name: 'Test',
                last_name: 'User',
                business_name: 'Test Mill',
                business_type: 'private',
                phone: '+94711234567',
                email: 'test@example.com',
                mill_district: 'Colombo'
            };

            const response = await request(app)
                .post('/api/auth/register-enhanced')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.user).toHaveProperty('id');
            expect(response.body).toHaveProperty('temporaryPasswordSent');
            expect(response.body).toHaveProperty('nextStep');

            // Store for cleanup
            testUserId = response.body.user.id;
        });

        test('should change password successfully', async () => {
            // First create a user with known temporary password
            const tempPassword = 'TempPass123!';
            const hashedPassword = await require('bcryptjs').hash(tempPassword, 12);
            
            await pool.execute(
                'UPDATE users SET password = ?, password_change_required = 1 WHERE id = ?',
                [hashedPassword, testUserId]
            );

            const response = await request(app)
                .post('/api/auth/change-password')
                .send({
                    userId: testUserId,
                    currentPassword: tempPassword,
                    newPassword: 'NewSecure123!',
                    confirmPassword: 'NewSecure123!'
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('successfully');
        });

        test('should reject weak passwords', async () => {
            const response = await request(app)
                .post('/api/auth/change-password')
                .send({
                    userId: testUserId,
                    currentPassword: 'TempPass123!',
                    newPassword: 'weak',
                    confirmPassword: 'weak'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Password must be');
        });
    });

    describe('4. Certificate Generation', () => {
        beforeAll(async () => {
            // Create approved license application for testing
            const [result] = await pool.execute(`
                INSERT INTO mill_licenses (user_id, license_type, application_date, status, approved_date, approved_by)
                VALUES (?, 'standard', NOW(), 'approved', NOW(), 1)
            `, [testUserId]);
            
            testLicenseId = result.insertId;
        });

        test('should generate certificate for approved license', async () => {
            const response = await request(app)
                .get(`/api/certificates/generate/${testLicenseId}`)
                .expect(200);

            expect(response.headers['content-type']).toBe('image/png');
            expect(response.headers['content-disposition']).toContain('attachment');
            expect(response.body).toBeInstanceOf(Buffer);
        });

        test('should retrieve existing certificate', async () => {
            const response = await request(app)
                .get(`/api/certificates/${testLicenseId}`)
                .expect(200);

            expect(response.headers['content-type']).toBe('image/png');
        });

        test('should reject certificate generation for non-approved license', async () => {
            // Create pending license
            const [result] = await pool.execute(`
                INSERT INTO mill_licenses (user_id, license_type, application_date, status)
                VALUES (?, 'standard', NOW(), 'pending')
            `, [testUserId]);

            const pendingLicenseId = result.insertId;

            const response = await request(app)
                .get(`/api/certificates/generate/${pendingLicenseId}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('not approved');
        });
    });

    // Helper functions
    async function setupTestData() {
        // Create test user if not exists
        try {
            const hashedPassword = await require('bcryptjs').hash('TestPass123!', 12);
            const [result] = await pool.execute(`
                INSERT INTO users (first_name, last_name, business_name, business_type, phone, email, password, mill_district)
                VALUES ('Test', 'User', 'Test Mill', 'private', '+94711234567', 'testuser@example.com', ?, 'Hambantota')
            `, [hashedPassword]);
            
            testUserId = result.insertId;
        } catch (error) {
            // User might already exist
            const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', ['testuser@example.com']);
            if (users.length > 0) {
                testUserId = users[0].id;
            }
        }

        // Ensure test districts exist
        await pool.execute(`
            INSERT IGNORE INTO sri_lanka_districts (name, province) VALUES 
            ('Hambantota', 'Southern Province'),
            ('Colombo', 'Western Province')
        `);

        // Ensure test prices exist
        await pool.execute(`
            INSERT IGNORE INTO district_paddy_prices (district_name, paddy_type, paddy_condition, price_per_kg, effective_date)
            VALUES ('Hambantota', 'Nadu - White', 'Dry', 85.00, CURDATE())
        `);
    }

    async function cleanupTestData() {
        // Clean up test data
        if (testUserId) {
            await pool.execute('DELETE FROM mill_licenses WHERE user_id = ?', [testUserId]);
            await pool.execute('DELETE FROM users WHERE id = ?', [testUserId]);
        }
        
        // Clean up test email user
        await pool.execute('DELETE FROM users WHERE email = ?', ['test@example.com']);
    }
});

// Run tests with: npm test -- enhanced-features.test.js