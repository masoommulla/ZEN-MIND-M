// Quick Environment Variable Checker
// Run this to verify your .env files are set up correctly

const fs = require('fs');
const path = require('path');

console.log('\n🔍 ZEN-MIND Environment Variable Checker\n');
console.log('='.repeat(50));

// Check Frontend .env
console.log('\n📱 FRONTEND (.env)');
console.log('-'.repeat(50));

const frontendEnvPath = path.join(__dirname, '.env');
if (fs.existsSync(frontendEnvPath)) {
  console.log('✅ .env file exists');
  const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
  
  const requiredFrontendVars = [
    'VITE_API_URL',
    'VITE_BOTPRESS_WEBCHAT_URL',
    'VITE_BOTPRESS_CONFIG_URL'
  ];
  
  requiredFrontendVars.forEach(varName => {
    if (frontendEnv.includes(varName)) {
      const match = frontendEnv.match(new RegExp(`${varName}=(.+)`));
      if (match && match[1] && !match[1].includes('your_') && !match[1].includes('YOUR_')) {
        console.log(`✅ ${varName} is set`);
      } else {
        console.log(`⚠️  ${varName} needs to be updated`);
      }
    } else {
      console.log(`❌ ${varName} is missing`);
    }
  });
} else {
  console.log('❌ .env file not found');
  console.log('   Run: cp .env.example .env');
}

// Check Backend .env
console.log('\n🖥️  BACKEND (server/.env)');
console.log('-'.repeat(50));

const backendEnvPath = path.join(__dirname, 'server', '.env');
if (fs.existsSync(backendEnvPath)) {
  console.log('✅ server/.env file exists');
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  
  const requiredBackendVars = {
    'PORT': false,
    'NODE_ENV': false,
    'MONGODB_URI': true,
    'JWT_SECRET': true,
    'BREVO_API_KEY': false,
    'BREVO_SENDER_EMAIL': false,
    'BREVO_SENDER_NAME': false,
    'FRONTEND_URL': false
  };
  
  Object.entries(requiredBackendVars).forEach(([varName, critical]) => {
    if (backendEnv.includes(varName)) {
      const match = backendEnv.match(new RegExp(`${varName}=(.+)`));
      if (match && match[1]) {
        const value = match[1].trim();
        const needsUpdate = value.includes('your_') || 
                          value.includes('YOUR_') || 
                          value.includes('username:password') ||
                          value.includes('change_this');
        
        if (needsUpdate) {
          if (critical) {
            console.log(`❌ ${varName} MUST be updated (currently has placeholder)`);
          } else {
            console.log(`⚠️  ${varName} should be updated`);
          }
        } else {
          console.log(`✅ ${varName} is set`);
        }
      } else {
        console.log(`⚠️  ${varName} is empty`);
      }
    } else {
      console.log(`❌ ${varName} is missing`);
    }
  });
} else {
  console.log('❌ server/.env file not found');
  console.log('   Run: cp server/.env.example server/.env');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📋 SUMMARY\n');

const frontendExists = fs.existsSync(frontendEnvPath);
const backendExists = fs.existsSync(backendEnvPath);

if (frontendExists && backendExists) {
  console.log('✅ Both .env files exist');
  console.log('\n⚠️  IMPORTANT:');
  console.log('   1. Update MONGODB_URI in server/.env');
  console.log('   2. Update JWT_SECRET in server/.env');
  console.log('   3. Update BREVO credentials if using email features');
  console.log('   4. Restart both dev servers after making changes');
  console.log('\n🚀 Next: npm run dev (frontend) and npm start (backend)');
} else {
  console.log('❌ Missing .env files');
  console.log('\n📝 To fix:');
  if (!frontendExists) {
    console.log('   1. Copy .env.example to .env');
  }
  if (!backendExists) {
    console.log('   2. Copy server/.env.example to server/.env');
  }
  console.log('   3. Update the values in both files');
  console.log('   4. Run this script again to verify');
}

console.log('\n' + '='.repeat(50));
console.log('\n💡 For more help, see ENV_ERROR_FIX.md\n');
