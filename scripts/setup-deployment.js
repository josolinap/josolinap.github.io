#!/usr/bin/env node

/**
 * Automated Deployment Setup Script
 * Sets up GitHub Pages deployment with Cloudflare Workers for AI Notes
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 AI Notes - Automated Deployment Setup\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Update package.json with deployment scripts
console.log('📝 Updating package.json with deployment scripts...');
packageJson.scripts = {
  ...packageJson.scripts,
  "deploy": "npm run build && gh-pages -d dist",
  "deploy:setup": "node scripts/setup-deployment.js",
  "worker:create": "node scripts/create-worker.js"
};

// Write back package.json
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// Update vite.config.js for GitHub Pages
console.log('🔧 Updating Vite config for GitHub Pages...');
const viteConfigPath = 'vite.config.js';
let viteConfig = '';

if (fs.existsSync(viteConfigPath)) {
  viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
} else {
  viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;
}

// Update the config for GitHub Pages
viteConfig = viteConfig.replace(
  /export default defineConfig\({/,
  `export default defineConfig({
  base: '/${path.basename(process.cwd())}.github.io/',`
);

fs.writeFileSync(viteConfigPath, viteConfig);

// Create .env.example
console.log('📄 Creating .env.example file...');
const envExample = `# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI Configuration (choose one)
VITE_GEMINI_API_KEY=your-gemini-api-key
# OR (for production with Cloudflare Workers)
VITE_WORKER_URL=https://your-worker.workers.dev

# Admin Password (optional, defaults to admin123)
VITE_ADMIN_PASSWORD=your-admin-password
`;

fs.writeFileSync('.env.example', envExample);

// Create Cloudflare Worker script
console.log('⚡ Creating Cloudflare Worker setup script...');
const workerScript = `#!/usr/bin/env node

/**
 * Cloudflare Worker Setup Script
 * Creates and deploys the AI proxy worker
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌐 Setting up Cloudflare Worker for AI proxy...');

// Create worker directory
const workerDir = 'cloudflare-worker';
if (!fs.existsSync(workerDir)) {
  fs.mkdirSync(workerDir);
}

// Create wrangler.toml
const wranglerConfig = \`name = "ai-notes-proxy"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
GEMINI_API_KEY = "your-gemini-api-key-here"
\`;

fs.writeFileSync(path.join(workerDir, 'wrangler.toml'), wranglerConfig);

// Create worker source
const workerSrcDir = path.join(workerDir, 'src');
if (!fs.existsSync(workerSrcDir)) {
  fs.mkdirSync(workerSrcDir);
}

const workerCode = \`export default {
  async fetch(request, env) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const requestBody = await request.json();

      // Forward the request to Gemini API
      const response = await fetch(
        \`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=\${env.GEMINI_API_KEY}\`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }
  },
};
\`;

fs.writeFileSync(path.join(workerSrcDir, 'index.js'), workerCode);

// Create deployment instructions
const deployInstructions = \`# Cloudflare Worker Deployment

## Prerequisites
- Cloudflare account
- Wrangler CLI: \`npm install -g wrangler\`

## Setup
1. Edit \`wrangler.toml\` and replace \`your-gemini-api-key-here\` with your actual Gemini API key
2. Login to Cloudflare: \`wrangler auth login\`
3. Deploy: \`wrangler deploy\`
4. Copy the worker URL and add it to your .env file as VITE_WORKER_URL

## Commands
- Deploy: \`wrangler deploy\`
- View logs: \`wrangler tail\`
- Delete: \`wrangler delete\`
\`;

fs.writeFileSync(path.join(workerDir, 'README.md'), deployInstructions);

console.log('✅ Cloudflare Worker setup complete!');
console.log('📁 Worker files created in:', workerDir);
console.log('📖 See', path.join(workerDir, 'README.md'), 'for deployment instructions');
`;

fs.writeFileSync('scripts/create-worker.js', workerScript);

// Make scripts executable
try {
  execSync('chmod +x scripts/setup-deployment.js');
  execSync('chmod +x scripts/create-worker.js');
} catch (err) {
  // Ignore on Windows
}

// Create deployment README
console.log('📚 Creating deployment README...');
const deploymentReadme = `# 🚀 Deployment Guide

## Quick Setup

1. **Run automated setup:**
   \`\`\`bash
   npm run deploy:setup
   \`\`\`

2. **Set up environment variables:**
   - Copy \`.env.example\` to \`.env\`
   - Fill in your Supabase and Gemini API credentials

3. **Choose deployment method:**

### Option A: Development (Direct API)
- Keep \`VITE_GEMINI_API_KEY\` in your \`.env\`
- Deploy directly to GitHub Pages

### Option B: Production (Cloudflare Worker)
- Run: \`npm run worker:create\`
- Follow the worker setup instructions
- Use \`VITE_WORKER_URL\` instead of \`VITE_GEMINI_API_KEY\`

## Manual Deployment Steps

### 1. Install Dependencies
\`\`\`bash
npm install
npm install -g gh-pages wrangler
\`\`\`

### 2. Configure Environment
\`\`\`bash
cp .env.example .env
# Edit .env with your credentials
\`\`\`

### 3. Build and Deploy
\`\`\`bash
npm run build
npm run deploy
\`\`\`

### 4. Configure GitHub Pages
- Go to Repository Settings → Pages
- Set source to "Deploy from a branch"
- Set branch to "gh-pages" and folder to "/ (root)"

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`VITE_SUPABASE_URL\` | Your Supabase project URL | ✅ |
| \`VITE_SUPABASE_ANON_KEY\` | Supabase anonymous key | ✅ |
| \`VITE_GEMINI_API_KEY\` | Google Gemini API key | ✅* |
| \`VITE_WORKER_URL\` | Cloudflare Worker URL | ✅* |
| \`VITE_ADMIN_PASSWORD\` | Admin password (default: admin123) | ❌ |

*Choose either \`VITE_GEMINI_API_KEY\` OR \`VITE_WORKER_URL\`

## Troubleshooting

### Build Fails
- Ensure all environment variables are set
- Check that Vite config has correct base path

### API Errors
- Verify Gemini API key is valid
- Check Cloudflare Worker is deployed and accessible

### GitHub Pages Blank
- Ensure build completed successfully
- Check repository name matches vite.config.js base path

## Security Notes

- ✅ Never commit \`.env\` file
- ✅ Use Cloudflare Workers for production
- ✅ Keep API keys secure
- ✅ Use strong admin passwords
`;

fs.writeFileSync('DEPLOYMENT.md', deploymentReadme);

console.log('✅ Deployment setup complete!');
console.log('📁 Created files:');
console.log('  - scripts/create-worker.js');
console.log('  - .env.example');
console.log('  - DEPLOYMENT.md');
console.log('📝 Updated: package.json, vite.config.js');
console.log('\n🚀 Next steps:');
console.log('1. Run: npm run worker:create (for production setup)');
console.log('2. Copy .env.example to .env and fill in your credentials');
console.log('3. Run: npm run deploy');
console.log('4. See DEPLOYMENT.md for detailed instructions');
