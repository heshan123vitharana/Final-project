// Generate a secure JWT secret
const crypto = require('crypto');

const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('\n========================================');
console.log('  SECURE JWT SECRET GENERATOR');
console.log('========================================\n');
console.log('Your secure JWT secret:');
console.log('\x1b[32m%s\x1b[0m', jwtSecret);
console.log('\n========================================');
console.log('Copy this value and use it as JWT_SECRET');
console.log('in your backend environment variables');
console.log('========================================\n');
