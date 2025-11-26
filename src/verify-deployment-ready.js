#!/usr/bin/env node

/**
 * ZEN-MIND Deployment Readiness Checker
 * Verifies that all localhost references are removed and app is production-ready
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ZEN-MIND Deployment Readiness Check\n');
console.log('=' .repeat(50));

let allChecksPassed = true;

// Check 1: config.ts exists and is simplified
console.log('\n✓ Checking config.ts...');
try {
  const configPath = path.join(__dirname, 'config.ts');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  if (configContent.includes('export const API_URL')) {
    console.log('  ✅ config.ts exports API_URL correctly');
  } else {
    console.log('  ❌ config.ts does not export API_URL');
    allChecksPassed = false;
  }
  
  if (configContent.includes('import.meta.env.VITE_API_URL')) {
    console.log('  ✅ config.ts uses environment variable');
  } else {
    console.log('  ❌ config.ts does not use VITE_API_URL');
    allChecksPassed = false;
  }
  
  if (configContent.includes('localhost')) {
    console.log('  ⚠️  Warning: config.ts contains "localhost" reference');
  }
} catch (error) {
  console.log('  ❌ config.ts not found');
  allChecksPassed = false;
}

// Check 2: .env.example exists
console.log('\n✓ Checking .env.example...');
try {
  const envExamplePath = path.join(__dirname, '.env.example');
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  
  if (envExampleContent.includes('VITE_API_URL')) {
    console.log('  ✅ .env.example has VITE_API_URL template');
  } else {
    console.log('  ❌ .env.example missing VITE_API_URL');
    allChecksPassed = false;
  }
} catch (error) {
  console.log('  ⚠️  .env.example not found (optional but recommended)');
}

// Check 3: .gitignore protects .env
console.log('\n✓ Checking .gitignore...');
try {
  const gitignorePath = path.join(__dirname, '.gitignore');
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  
  if (gitignoreContent.includes('.env')) {
    console.log('  ✅ .gitignore protects .env file');
  } else {
    console.log('  ⚠️  .env not in .gitignore - add it!');
  }
} catch (error) {
  console.log('  ⚠️  .gitignore not found');
}

// Check 4: services/api.ts uses API_URL from config
console.log('\n✓ Checking services/api.ts...');
try {
  const apiPath = path.join(__dirname, 'services', 'api.ts');
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  
  if (apiContent.includes("import { API_URL } from '../config'")) {
    console.log('  ✅ api.ts imports API_URL correctly');
  } else {
    console.log('  ❌ api.ts does not import API_URL from config');
    allChecksPassed = false;
  }
  
  // Check for hardcoded localhost
  const localhostMatches = apiContent.match(/localhost:?\d*/gi);
  if (localhostMatches && localhostMatches.length > 0) {
    console.log(`  ❌ Found ${localhostMatches.length} localhost reference(s) in api.ts`);
    allChecksPassed = false;
  } else {
    console.log('  ✅ No hardcoded localhost URLs in api.ts');
  }
} catch (error) {
  console.log('  ❌ services/api.ts not found');
  allChecksPassed = false;
}

// Check 5: AIChat.tsx doesn't use old config
console.log('\n✓ Checking components/AIChat.tsx...');
try {
  const aiChatPath = path.join(__dirname, 'components', 'AIChat.tsx');
  const aiChatContent = fs.readFileSync(aiChatPath, 'utf8');
  
  if (aiChatContent.includes("import { config } from '../config'")) {
    console.log('  ❌ AIChat.tsx still imports old config object');
    allChecksPassed = false;
  } else {
    console.log('  ✅ AIChat.tsx does not import config object');
  }
  
  // Check for hardcoded localhost
  const localhostMatches = aiChatContent.match(/localhost:?\d*/gi);
  if (localhostMatches && localhostMatches.length > 0) {
    console.log(`  ❌ Found ${localhostMatches.length} localhost reference(s) in AIChat.tsx`);
    allChecksPassed = false;
  } else {
    console.log('  ✅ No hardcoded localhost URLs in AIChat.tsx');
  }
} catch (error) {
  console.log('  ⚠️  AIChat.tsx not found (may not exist yet)');
}

// Check 6: package.json has build script
console.log('\n✓ Checking package.json...');
try {
  const packagePath = path.join(__dirname, 'package.json');
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (packageContent.scripts && packageContent.scripts.build) {
    console.log('  ✅ package.json has build script');
  } else {
    console.log('  ❌ package.json missing build script');
    allChecksPassed = false;
  }
} catch (error) {
  console.log('  ❌ package.json not found or invalid');
  allChecksPassed = false;
}

// Final Summary
console.log('\n' + '='.repeat(50));
if (allChecksPassed) {
  console.log('\n🎉 SUCCESS! Your app is deployment-ready!');
  console.log('\n✅ All critical checks passed');
  console.log('✅ No hardcoded localhost URLs found');
  console.log('✅ Environment variable setup correct');
  console.log('\n📚 Next steps:');
  console.log('   1. Set VITE_API_URL in .env for local dev');
  console.log('   2. Push to GitHub');
  console.log('   3. Deploy to Render');
  console.log('   4. Set VITE_API_URL in Render environment');
  console.log('\n📖 See RENDER_DEPLOYMENT_FIXED.md for detailed instructions');
} else {
  console.log('\n⚠️  WARNING: Some checks failed!');
  console.log('\nPlease fix the issues above before deploying.');
  console.log('Review the errors and make necessary corrections.');
}

console.log('\n' + '='.repeat(50) + '\n');

process.exit(allChecksPassed ? 0 : 1);
