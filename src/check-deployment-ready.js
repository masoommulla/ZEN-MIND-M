#!/usr/bin/env node

console.log('\n🔍 Checking ZEN-MIND Deployment Readiness...\n');

let allGood = true;

// Check 1: Config.ts has fallback
const fs = require('fs');
const configContent = fs.readFileSync('./config.ts', 'utf8');
if (configContent.includes('|| \'https://backend-xtbv.onrender.com/api\'')) {
  console.log('✅ config.ts has fallback for VITE_API_URL');
} else {
  console.log('❌ config.ts missing fallback');
  allGood = false;
}

// Check 2: vite-env.d.ts exists
if (fs.existsSync('./vite-env.d.ts')) {
  console.log('✅ vite-env.d.ts exists');
} else {
  console.log('❌ vite-env.d.ts missing');
  allGood = false;
}

// Check 3: Backend models exist
const backendModels = [
  './server/models/Therapist.js',
  './server/models/Appointment.js'
];

backendModels.forEach(model => {
  if (fs.existsSync(model)) {
    console.log(`✅ ${model} exists`);
  } else {
    console.log(`❌ ${model} missing`);
    allGood = false;
  }
});

// Check 4: Backend routes exist
const backendRoutes = [
  './server/routes/therapistAuth.js',
  './server/routes/therapistManagement.js',
  './server/routes/booking.js'
];

backendRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route} exists`);
  } else {
    console.log(`❌ ${route} missing`);
    allGood = false;
  }
});

// Check 5: Therapist seeder exists
if (fs.existsSync('./server/utils/therapistSeeder.js')) {
  console.log('✅ Therapist seeder exists');
} else {
  console.log('❌ Therapist seeder missing');
  allGood = false;
}

// Check 6: Package.json has razorpay
const packageJson = JSON.parse(fs.readFileSync('./server/package.json', 'utf8'));
if (packageJson.dependencies.razorpay) {
  console.log('✅ Razorpay package added to dependencies');
} else {
  console.log('❌ Razorpay package missing from dependencies');
  allGood = false;
}

// Check 7: .env.example files exist
if (fs.existsSync('./.env.example') && fs.existsSync('./server/.env.example')) {
  console.log('✅ .env.example files exist');
} else {
  console.log('❌ .env.example files missing');
  allGood = false;
}

// Check 8: Auth middleware supports therapists
const authMiddleware = fs.readFileSync('./server/middleware/auth.js', 'utf8');
if (authMiddleware.includes('decoded.role === \'therapist\'')) {
  console.log('✅ Auth middleware supports therapists');
} else {
  console.log('❌ Auth middleware doesn\'t support therapists');
  allGood = false;
}

// Final verdict
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ ALL CHECKS PASSED! Ready for deployment! 🚀');
  console.log('\nNext steps:');
  console.log('1. git add . && git commit -m "feat: Therapist booking system"');
  console.log('2. git push origin main');
  console.log('3. Add Razorpay keys to Render environment');
  console.log('4. Run: cd server && npm run seed:therapists');
} else {
  console.log('❌ SOME CHECKS FAILED! Fix errors before deployment.');
  process.exit(1);
}
console.log('='.repeat(50) + '\n');
