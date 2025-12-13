const db = require('./src/config/database');
const fs = require('fs');

async function checkMillData() {
    try {
        let output = '';

        // Check mills in Ampara
        const [mills] = await db.execute(`
            SELECT 
                id, 
                business_name, 
                mill_capacity, 
                business_type, 
                COALESCE(mill_district, district) as district 
            FROM users 
            WHERE COALESCE(mill_district, district) = ? 
            AND business_type IN ('private', 'government')
        `, ['Ampara']);

        output += '=== Mills in Ampara ===\n';
        output += JSON.stringify(mills, null, 2) + '\n\n';

        // Check stock summary for these mills
        if (mills.length > 0) {
            const millIds = mills.map(m => m.id);
            const [stock] = await db.execute(`
                SELECT mill_id, paddy_type, paddy_condition, total_quantity
                FROM stock_summary
                WHERE mill_id IN (${millIds.join(',')})
            `);
            output += '=== Stock Summary ===\n';
            output += JSON.stringify(stock, null, 2) + '\n';
        }

        fs.writeFileSync('mill_data_output.txt', output);
        console.log('Output written to mill_data_output.txt');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkMillData();
