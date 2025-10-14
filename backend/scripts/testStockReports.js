require('dotenv').config();
const StockModel = require('../models/stockModel');

async function main() {
  try {
    const result = await StockModel.getAllStockReports({ limit: 5 });
    console.log('Reports:', result);
  } catch (error) {
    console.error('Error retrieving reports:', error);
  } finally {
    process.exit(0);
  }
}

main();
