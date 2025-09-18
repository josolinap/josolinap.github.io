#!/usr/bin/env node

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
const wranglerConfig = `name = "ai-notes-proxy"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
GEMINI_API_KEY = "your-gemini-api-key-here"
`;

fs.writeFileSync(path.join(workerDir, 'wrangler.toml'), wranglerConfig);

// Create worker source
const workerSrcDir = path.join(workerDir, 'src');
if (!fs.existsSync(workerSrcDir)) {
  fs.mkdirSync(workerSrcDir);
}

const workerCode = `export default {
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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
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
`;

fs.writeFileSync(path.join(workerSrcDir, 'index.js'), workerCode);

// Create deployment instructions
const deployInstructions = `# Cloudflare Worker Deployment

## Prerequisites
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

## Setup
1. Edit `wrangler.toml` and replace `your-gemini-api-key-here` with your actual Gemini API key
2. Login to Cloudflare: `wrangler auth login`
3. Deploy: `wrangler deploy`
4. Copy the worker URL and add it to your .env file as VITE_WORKER_URL

## Commands
- Deploy: `wrangler deploy`
- View logs: `wrangler tail`
- Delete: `wrangler delete`
`;

fs.writeFileSync(path.join(workerDir, 'README.md'), deployInstructions);

console.log('✅ Cloudflare Worker setup complete!');
console.log('📁 Worker files created in:', workerDir);
console.log('📖 See', path.join(workerDir, 'README.md'), 'for deployment instructions');
