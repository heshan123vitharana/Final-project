const db = require('../config/database');
const bcrypt = require('bcryptjs');

const RegionalOfficer = {
    create: async (officerData) => {
        const { username, password, district, email } = officerData;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const [result] = await db.execute(
                'INSERT INTO regional_officers (username, password, district, email) VALUES (?, ?, ?, ?)',
                [username, hashedPassword, district, email]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    findByUsername: async (username) => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM regional_officers WHERE username = ?',
                [username]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    getAll: async () => {
        try {
            const [rows] = await db.execute(
                'SELECT id, username, district, email, created_at FROM regional_officers ORDER BY created_at DESC'
            );
            return rows;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, updateData) => {
        const { district, email, password } = updateData;
        let query = 'UPDATE regional_officers SET district = ?, email = ?';
        let params = [district, email];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        params.push(id);

        try {
            const [result] = await db.execute(query, params);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const [result] = await db.execute(
                'DELETE FROM regional_officers WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = RegionalOfficer;
