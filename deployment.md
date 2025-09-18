# 🚀 Deployment Guide

## Quick Setup

1. **Run automated setup:**
   ```bash
   npm run deploy:setup
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase and Gemini API credentials

3. **Choose deployment method:**

### Option A: Development (Direct API)
- Keep `VITE_GEMINI_API_KEY` in your `.env`
- Deploy directly to GitHub Pages

### Option B: Production (Cloudflare Worker)
- Run: `npm run worker:create`
- Follow the worker setup instructions
- Use `VITE_WORKER_URL` instead of `VITE_GEMINI_API_KEY`

## Manual Deployment Steps

### 1. Install Dependencies
```bash
npm install
npm install -g gh-pages wrangler
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Build and Deploy
```bash
npm run build
npm run deploy
```

### 4. Configure GitHub Pages
- Go to Repository Settings → Pages
- Set source to "Deploy from a branch"
- Set branch to "gh-pages" and folder to "/ (root)"

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `VITE_GEMINI_API_KEY` | Google Gemini API key | ✅* |
| `VITE_WORKER_URL` | Cloudflare Worker URL | ✅* |
| `VITE_ADMIN_PASSWORD` | Admin password (default: admin123) | ❌ |

*Choose either `VITE_GEMINI_API_KEY` OR `VITE_WORKER_URL`

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

- ✅ Never commit `.env` file
- ✅ Use Cloudflare Workers for production
- ✅ Keep API keys secure
- ✅ Use strong admin passwords
