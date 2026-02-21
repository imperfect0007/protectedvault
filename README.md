# ProtectedVault

A simple vault for your academic work. No accounts, no lengthy sign-ups — just a Vault ID and password.

**Features:** Quick Pad (code-friendly editor with auto-save), Structured Notes (multiple notes + PDFs), built-in PDF viewing, Terms & Privacy acceptance before creating a vault, dark/light theme.

**Stack:** React (Vite) + TypeScript, Node.js (Express), Supabase (PostgreSQL + Storage).

---

## Local development

### Prerequisites

- Node.js 18+
- npm

### Setup

1. **Backend**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env: set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
   npm install
   npm run build
   npm run dev
   ```

   Backend runs at `http://localhost:3001`.

2. **Frontend** (new terminal)

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Frontend runs at `http://localhost:5173` and proxies `/api` to the backend.

3. **Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - Run the SQL from the project (tables: `vaults`, `quickpad`, `files`; storage bucket `pdfs`).
   - Copy project URL and **service role** key into `backend/.env`.

---

## Production build (single server)

If you run frontend and backend on the same server:

```bash
cd frontend && npm run build
cd ../backend && npm run build && npm start
```

The backend serves the built frontend from `frontend/dist` and handles `/api` routes. Set `PORT` and `NODE_ENV=production` in `backend/.env`.

---

## Deploy frontend to Vercel

1. Push this repo to GitHub (see [Git setup](#git-setup) below).

2. In [Vercel](https://vercel.com): **Add New Project** → Import your repo.

3. **Project settings:**
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Environment variables** (if your API is on a different host):
   - `VITE_API_URL` = your backend base URL (e.g. `https://your-backend.up.railway.app`). Do **not** include `/api` — the app adds it. Omit if the same server serves both.

5. Deploy. Your frontend will be live at `https://your-app.vercel.app`.

---

## Deploy backend on Render

1. Go to [Render](https://render.com) → **Dashboard** → **New** → **Web Service**.

2. Connect your GitHub repo (`imperfect0007/protectedvault`).

3. **Settings:**
   - **Name:** e.g. `protectedvault-api`
   - **Region:** choose one
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance type:** Free (or paid if you need more)

4. **Environment** (Add Environment Variables):
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key (from Project Settings → API)
   - `JWT_SECRET` = a long random string (e.g. 32+ chars)
   - `NODE_ENV` = `production`
   - **If your frontend is on Vercel**, add:
     - `CORS_ORIGIN` = `https://your-app.vercel.app` (your Vercel URL, no trailing slash)

   Render sets `PORT` automatically — do not override it unless you need to.

5. Click **Create Web Service**. After the first deploy, note your backend URL (e.g. `https://protectedvault-api.onrender.com`).

6. In your **Vercel** project (frontend), add an environment variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://protectedvault-api.onrender.com` (your Render URL, no `/api`)
   Then redeploy the frontend so it uses the new API URL.

**Optional:** The repo includes a `render.yaml` (Blueprint). In Render use **New** → **Blueprint**, connect this repo, and create the web service from the spec (build/start run from repo root via the root `package.json`). Set the secret env vars in the dashboard. If you create a **Web Service** manually instead, leave **Root Directory** empty and use **Build Command:** `npm run build`, **Start Command:** `npm start`.

---

## Git setup

From the project root (e.g. `C:\Users\hp\Desktop\no need`):

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/imperfect0007/protectedvault.git
git push -u origin main
```

**Note:** `.env` is in `.gitignore` — never commit secrets. Use `.env.example` as a template and set real values in your deployment dashboard (Vercel, Railway, etc.).

---

## Project structure

```
backend/          # Express API, Supabase, PDF compression
  src/
    index.ts
    db.ts
    middleware/auth.ts
    routes/       # vault, quickpad, files
frontend/         # React + Vite, Monaco editor
  src/
    App.tsx
    api.ts
    pages/        # VaultAccess, VaultDashboard, About, Privacy, Terms
    components/
    styles/
```

---

## License

MIT
