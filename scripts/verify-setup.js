#!/usr/bin/env node

/**
 * Setup Verification Script
 * Run this to verify your Gemini + Firebolt + Gmail setup
 * 
 * Usage: node scripts/verify-setup.js
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_ENV_VARS = ['GEMINI_API_KEY'];
const OPTIONAL_ENV_VARS = [
  'NEXT_PUBLIC_APP_URL',
  'FIREBOLT_CLIENT_ID',
  'FIREBOLT_CLIENT_SECRET',
  'FIREBOLT_ACCOUNT',
  'FIREBOLT_DATABASE',
  'GMAIL_CLIENT_ID',
  'GMAIL_CLIENT_SECRET',
  'GMAIL_REFRESH_TOKEN'
];

console.log('\n🔍 Multi-Agent Workshop Setup Verification\n');
console.log('='.repeat(50));

// Check Node version
const nodeVersion = process.version;
const [major] = nodeVersion.slice(1).split('.').map(Number);
console.log(`\n✓ Node.js version: ${nodeVersion}`);
if (major < 18) {
  console.log('  ⚠️  Warning: Node.js 18+ recommended');
} else {
  console.log('  ✓ Version OK');
}

// Check package.json exists
const packagePath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packagePath)) {
  console.log('\n❌ package.json not found!');
  process.exit(1);
}
console.log('\n✓ package.json found');

// Check dependencies
const pkg = require(packagePath);
const requiredDeps = [
  '@google/generative-ai',
  'next',
  'react',
  'react-dom'
];

console.log('\n📦 Checking Dependencies:');
let missingDeps = [];
requiredDeps.forEach(dep => {
  if (pkg.dependencies[dep]) {
    console.log(`  ✓ ${dep}: ${pkg.dependencies[dep]}`);
  } else {
    console.log(`  ❌ ${dep}: MISSING`);
    missingDeps.push(dep);
  }
});

if (missingDeps.length > 0) {
  console.log('\n⚠️  Missing dependencies detected. Run: npm install');
}

// Check .env.local
const envPath = path.join(process.cwd(), '.env.local');
console.log('\n🔐 Environment Configuration:');

if (!fs.existsSync(envPath)) {
  console.log('  ❌ .env.local not found!');
  console.log('  📝 Create .env.local with:');
  console.log('     GEMINI_API_KEY=your_key_here');
  console.log('     NEXT_PUBLIC_APP_URL=http://localhost:3000');
  console.log('\n  See GEMINI-FIREBOLT-SETUP.md for details');
} else {
  console.log('  ✓ .env.local found');
  
  // Parse env file
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  // Check required vars
  console.log('\n  Required Variables:');
  REQUIRED_ENV_VARS.forEach(varName => {
    if (envVars[varName] && envVars[varName] !== 'your_gemini_api_key_here') {
      console.log(`    ✓ ${varName}: Set (${envVars[varName].substring(0, 10)}...)`);
    } else {
      console.log(`    ❌ ${varName}: NOT SET or using placeholder`);
    }
  });
  
  // Check optional vars
  console.log('\n  Optional Variables (for production):');
  OPTIONAL_ENV_VARS.forEach(varName => {
    if (envVars[varName]) {
      const value = envVars[varName];
      const display = value.length > 20 ? `${value.substring(0, 15)}...` : value;
      console.log(`    ✓ ${varName}: ${display}`);
    } else {
      console.log(`    - ${varName}: Not set (using defaults)`);
    }
  });
}

// Check key files exist
console.log('\n📁 Checking Project Structure:');
const keyFiles = [
  'src/lib/services/gemini.ts',
  'src/lib/services/firebolt-mcp.ts',
  'src/lib/services/gmail.ts',
  'src/lib/agents/orchestrator.ts',
  'src/lib/agents/analytics.ts',
  'src/lib/agents/report.ts',
  'src/app/page.tsx',
  'src/app/workshop/page.tsx'
];

keyFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
  }
});

// Final summary
console.log('\n' + '='.repeat(50));
console.log('\n📋 Setup Summary:\n');

const hasNodeModules = fs.existsSync(path.join(process.cwd(), 'node_modules'));
const hasEnv = fs.existsSync(envPath);
const hasGeminiKey = hasEnv && fs.readFileSync(envPath, 'utf-8').includes('GEMINI_API_KEY=') && 
                     !fs.readFileSync(envPath, 'utf-8').includes('your_gemini_api_key_here');

if (hasNodeModules && hasEnv && hasGeminiKey) {
  console.log('✅ Setup looks good! You can now run:');
  console.log('   npm run dev');
  console.log('\n   Then visit: http://localhost:3000');
} else {
  console.log('⚠️  Setup incomplete. Next steps:\n');
  
  if (!hasNodeModules) {
    console.log('   1. Run: npm install');
  }
  if (!hasEnv) {
    console.log('   2. Create .env.local file');
  }
  if (!hasGeminiKey) {
    console.log('   3. Add your Gemini API key to .env.local');
  }
  
  console.log('\n   See GEMINI-FIREBOLT-SETUP.md for detailed instructions');
}

console.log('\n' + '='.repeat(50) + '\n');
