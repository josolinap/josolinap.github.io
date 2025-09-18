# My personal GitHub Pages site
# josolinap.github.io

Personal site powered by **React + Vite + Supabase + AI**.  
The site shows floating notes/ideas in the center — some are just thoughts, others link to blog posts or projects. Notes are stored in **Supabase** (acting as a lightweight CMS) and may be analyzed/expanded by an AI API.

---

## 🚀 Features
- **Floating notes display** (text or linked to blog/projects).  
- Notes are fetched from **Supabase** in real time.  
- Notes can be **plain text** or **clickable links** (e.g., blog/portfolio).  
- Planned: AI integration to analyze, remix, or expand notes.  

---

## 🛠️ Tech Stack
- **Frontend:** React + Vite  
- **Database / CMS:** Supabase (Postgres with Row Level Security + policies)  
- **Hosting:** GitHub Pages (custom domain: `josolinap.dedyn.io`)  
- **AI Provider:** Google AI Studio (Gemini) / OpenAI / Groq (choose one)  

---

## ⚙️ Setup

### 1. Clone the repo
```bash
git clone https://github.com/josolinap/josolinap.github.io
cd josolinap.github.io

2. Install dependencies
npm install

3. Configure environment variables
Create a .env file in the project root:
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_AI_API_KEY=your-ai-api-key

(Keep .env private — never commit it. Only commit .env.example.)

4. Run locally
npm run dev

5. Deploy to GitHub Pages
npm run build
npm run deploy
