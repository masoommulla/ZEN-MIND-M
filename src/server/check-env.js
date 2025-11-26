#!/usr/bin/env node

/**
 * Environment Variables Checker
 * Run this script to verify all required environment variables are set
 * Usage: node check-env.js
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Checking Environment Variables...\n');

// Required environment variables
const requiredVars = [
  { name: 'MONGODB_URI', description: 'MongoDB connection string' },
  { name: 'JWT_SECRET', description: 'JWT secret key for authentication' },
  { name: 'FRONTEND_URL', description: 'Frontend URL for CORS' },
  { name: 'BREVO_API_KEY', description: 'Brevo API key for emails' },
  { name: 'BREVO_SENDER_EMAIL', description: 'Verified sender email' }
];

// Optional but recommended environment variables
const optionalVars = [
  { name: 'PORT', description: 'Server port', default: '5000' },
  { name: 'NODE_ENV', description: 'Environment mode', default: 'development' },
  { name: 'CLIENT_URL', description: 'Alternative frontend URL for CORS', default: 'Same as FRONTEND_URL' },
  { name: 'BREVO_SENDER_NAME', description: 'Email sender name', default: 'ZenMind Team' },
  { name: 'JWT_EXPIRE', description: 'JWT token expiration', default: '30d' },
  { name: 'RATE_LIMIT_WINDOW_MS', description: 'Rate limit window', default: '900000' },
  { name: 'RATE_LIMIT_MAX_REQUESTS', description: 'Max requests per window', default: '100' },
  { name: 'JITSI_DOMAIN', description: 'Jitsi video domain', default: '8x8.vc' },
  { name: 'TZ', description: 'Timezone for cron jobs', default: 'Asia/Kolkata' }
];

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('📋 REQUIRED Variables:\n');
requiredVars.forEach(({ name, description }) => {
  const value = process.env[name];
  if (!value) {
    console.log(`❌ ${name}`);
    console.log(`   ${description}`);
    console.log(`   Status: MISSING\n`);
    hasErrors = true;
  } else {
    // Mask sensitive values
    let displayValue = value;
    if (name.includes('SECRET') || name.includes('KEY') || name.includes('PASSWORD')) {
      displayValue = value.substring(0, 10) + '...' + value.substring(value.length - 5);
    } else if (name === 'MONGODB_URI') {
      displayValue = value.substring(0, 30) + '...';
    }
    console.log(`✅ ${name}`);
    console.log(`   ${description}`);
    console.log(`   Value: ${displayValue}\n`);
  }
});

// Check optional variables
console.log('\n📋 OPTIONAL Variables (will use defaults if not set):\n');
optionalVars.forEach(({ name, description, default: defaultValue }) => {
  const value = process.env[name];
  if (!value) {
    console.log(`⚠️  ${name}`);
    console.log(`   ${description}`);
    console.log(`   Status: Not set (will use default: ${defaultValue})\n`);
    hasWarnings = true;
  } else {
    console.log(`✅ ${name}`);
    console.log(`   ${description}`);
    console.log(`   Value: ${value}\n`);
  }
});

// Validation checks
console.log('\n🔍 VALIDATION Checks:\n');

// Check JWT_SECRET length
const jwtSecret = process.env.JWT_SECRET;
if (jwtSecret) {
  if (jwtSecret.length < 32) {
    console.log('⚠️  JWT_SECRET is too short (should be at least 32 characters)');
    hasWarnings = true;
  } else {
    console.log('✅ JWT_SECRET length is adequate');
  }
}

// Check MongoDB URI format
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.log('❌ MONGODB_URI format is invalid (should start with mongodb:// or mongodb+srv://)');
    hasErrors = true;
  } else {
    console.log('✅ MONGODB_URI format is valid');
  }
}

// Check URL formats
const frontendUrl = process.env.FRONTEND_URL;
if (frontendUrl) {
  if (!frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://')) {
    console.log('⚠️  FRONTEND_URL should start with http:// or https://');
    hasWarnings = true;
  } else if (frontendUrl.endsWith('/')) {
    console.log('⚠️  FRONTEND_URL should not end with a trailing slash');
    hasWarnings = true;
  } else {
    console.log('✅ FRONTEND_URL format is valid');
  }
}

// Check email format
const senderEmail = process.env.BREVO_SENDER_EMAIL;
if (senderEmail) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(senderEmail)) {
    console.log('⚠️  BREVO_SENDER_EMAIL format looks invalid');
    hasWarnings = true;
  } else {
    console.log('✅ BREVO_SENDER_EMAIL format is valid');
  }
}

// Check NODE_ENV
const nodeEnv = process.env.NODE_ENV;
if (nodeEnv && nodeEnv !== 'development' && nodeEnv !== 'production' && nodeEnv !== 'test') {
  console.log('⚠️  NODE_ENV should be one of: development, production, test');
  hasWarnings = true;
} else {
  console.log('✅ NODE_ENV is valid');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 SUMMARY:\n');

if (hasErrors) {
  console.log('❌ Configuration has ERRORS - app may not start properly');
  console.log('   Please fix the missing required variables above.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Configuration has WARNINGS - app will start but may have issues');
  console.log('   Consider reviewing the warnings above.\n');
  process.exit(0);
} else {
  console.log('✅ All environment variables are properly configured!');
  console.log('   Your app is ready to deploy.\n');
  process.exit(0);
}
