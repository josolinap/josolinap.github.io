# Cloudflare Worker Deployment

## Prerequisites
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

## Setup
1. Edit `wrangler.toml` and replace `your-gemini-api-key-here` with your actual Gemini API key
2. Login to Cloudflare: `wrangler auth login`
3. Deploy: `wrangler deploy`
4. Copy the worker URL and add it to your .env file as VITE_WORKER_URL

## Features
- Enhanced error handling with detailed error responses
- Automatic logging for debugging
- Proper CORS support for all environments

## Error Handling
This worker provides detailed error information:
- If Gemini API returns an error, the worker will relay the exact status and response details
- All errors include JSON formatted responses with error messages and details
- Console logging helps with debugging worker issues

## Commands
- Deploy: `wrangler deploy`
- View logs: `wrangler tail`
- Delete: `wrangler delete`
