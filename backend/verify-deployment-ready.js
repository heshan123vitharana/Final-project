// Pre-Deployment Verification Script
// Run this before deploying to check if everything is ready

const fs = require('fs');
const path = require('path');

console.log('\n========================================');
console.log('  PRE-DEPLOYMENT VERIFICATION');
console.log('========================================\n');

let allChecksPass = true;

// Check 1: package.json exists
console.log('📦 Checking package.json...');
if (fs.existsSync(path.join(__dirname, 'package.json'))) {
    console.log('✅ package.json found');
} else {
    console.log('❌ package.json not found');
    allChecksPass = false;
}

// Check 2: src/server.js exists
console.log('\n🖥️  Checking server.js...');
if (fs.existsSync(path.join(__dirname, 'src', 'server.js'))) {
    console.log('✅ src/server.js found');
} else {
    console.log('❌ src/server.js not found');
    allChecksPass = false;
}

// Check 3: .env.example exists
console.log('\n📝 Checking .env.example...');
if (fs.existsSync(path.join(__dirname, '.env.example'))) {
    console.log('✅ .env.example found');
} else {
    console.log('⚠️  .env.example not found (optional)');
}

// Check 4: railway.json exists
console.log('\n🚂 Checking railway.json...');
if (fs.existsSync(path.join(__dirname, 'railway.json'))) {
    console.log('✅ railway.json found');
} else {
    console.log('⚠️  railway.json not found (optional)');
}

// Check 5: Read package.json and verify scripts
console.log('\n📜 Checking npm scripts...');
try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

    if (packageJson.scripts && packageJson.scripts.start) {
        console.log('✅ "start" script found:', packageJson.scripts.start);
    } else {
        console.log('❌ "start" script not found in package.json');
        allChecksPass = false;
    }

    // Check dependencies
    console.log('\n📚 Checking key dependencies...');
    const requiredDeps = ['express', 'mysql2', 'cors', 'jsonwebtoken', 'dotenv'];
    const deps = packageJson.dependencies || {};

    requiredDeps.forEach(dep => {
        if (deps[dep]) {
            console.log(`✅ ${dep}: ${deps[dep]}`);
        } else {
            console.log(`❌ ${dep} not found`);
            allChecksPass = false;
        }
    });

} catch (error) {
    console.log('❌ Error reading package.json:', error.message);
    allChecksPass = false;
}

// Check 6: Environment variables checklist
console.log('\n🔐 Environment Variables Checklist:');
console.log('Make sure you have these ready for Railway:');
console.log('  □ NODE_ENV=production');
console.log('  □ PORT=3000');
console.log('  □ DB_HOST');
console.log('  □ DB_USER');
console.log('  □ DB_PASSWORD');
console.log('  □ DB_NAME');
console.log('  □ DB_PORT');
console.log('  □ JWT_SECRET');
console.log('  □ FRONTEND_URL');

// Final summary
console.log('\n========================================');
if (allChecksPass) {
    console.log('✅ ALL CHECKS PASSED!');
    console.log('Your backend is ready for deployment.');
    console.log('\nNext steps:');
    console.log('1. Sign up for Railway');
    console.log('2. Deploy from GitHub');
    console.log('3. Add environment variables');
    console.log('4. Deploy!');
} else {
    console.log('❌ SOME CHECKS FAILED');
    console.log('Please fix the issues above before deploying.');
}
console.log('========================================\n');
