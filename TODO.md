# TODO — AI Notes + 3D Website

## ✅ Done
- [x] Set up Vite + React app
- [x] Installed Supabase client
- [x] Created `notes` table in Supabase
- [x] Connected frontend to Supabase
- [x] Installed Gemini CLI
- [x] Scaffolded `src/lib/ai.js` and hooked into Gemini API
- [x] Displayed first note + AI analysis in `App.jsx`

---

## 🔜 Next Steps

### Phase 1 — Core AI flow
- [x] Fix `ai.js` to use `VITE_GEMINI_API_KEY` (✅ in local dev, ⚠️ insecure for production)
- [x] Improve AI output parsing → structured JSON (summary, keywords, sentiment)
- [x] Add error handling + loading states in UI
- [x] Add a button to re-analyze a random note

### Phase 2 — Visual layer
- [x] Install `@react-three/fiber` and `@react-three/drei`
- [x] Create a `<Scene />` component with a rotating 3D object or text
- [x] Animate AI keywords → floating around the object, fading in/out
- [x] Clickable keywords → if note has a link → open in new tab; else → show as popup

### Phase 3 — CMS-like control
- [x] Add ability to insert new notes via frontend → saves to Supabase
- [x] Auto-refresh scene when new note is added
- [x] Add categories/tags → group notes visually
- [x] Add a “surprise me” mode → AI picks a random note

### Phase 4 — Deployment
- [ ] Set up custom domain `josolinap.dedyn.io`
- [ ] Decide hosting: GitHub Pages (static) vs. Netlify (serverless proxy support)
- [ ] If GitHub Pages → move AI call to serverless proxy (Cloudflare Workers, Netlify Functions, or Supabase Edge Functions)
- [- ] Hide Gemini API key in serverless function (no client exposure)
- [ ] Deploy 🚀

---

## 🛠️ Future Ideas
- [x] Sentiment-based coloring of words (positive = green, negative = red)
- [ ] Export daily AI summaries of notes
- [ ] Voice synthesis (notes read out loud)
- [ ] VR/AR view of floating notes
