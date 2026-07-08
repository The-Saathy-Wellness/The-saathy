# Deployment Guide

This repo is deploy-ready as a split web app:

- `apps/backend`: Express API service
- `apps/frontend`: Vite static site
- `packages/shared`: shared TypeScript/Zod package

## Recommended Path: Render

The included `render.yaml` defines:

- `saathy-backend`: Node web service
- `saathy-frontend`: static site

Connect the GitHub repo to Render and create services from the blueprint.

If Render says a root directory such as `saathy-backend` does not exist, open the
service settings and clear the Root Directory field. This monorepo deploys from
the repository root, not from a `saathy-backend` folder. The backend code is in
`apps/backend`.

## Backend Environment

Set these on the Render backend service:

```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://vnzjntpeldsesgzshceu.supabase.co
SUPABASE_ANON_KEY=your_publishable_or_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_backend_only_service_role_or_secret_key
DATABASE_URL=your_supabase_pooler_postgres_url
JWT_SECRET=your_legacy_jwt_secret
ENCRYPTION_KEY=64_hex_characters
ALLOWED_ORIGINS=https://your-frontend-domain.onrender.com
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Use the Supabase transaction/session pooler URL for `DATABASE_URL`.

## Frontend Environment

Set these on the Render static site:

```env
VITE_SUPABASE_URL=https://vnzjntpeldsesgzshceu.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_or_anon_key
VITE_API_BASE_URL=https://your-backend-domain.onrender.com
```

## Supabase Auth URLs

After Render creates the frontend URL, update Supabase:

- Site URL: `https://your-frontend-domain.onrender.com`
- Redirect URLs:
  - `https://your-frontend-domain.onrender.com/dashboard`
  - `https://your-frontend-domain.onrender.com/**`

If Google OAuth is enabled, keep the Supabase callback URL in Google Cloud:

```text
https://vnzjntpeldsesgzshceu.supabase.co/auth/v1/callback
```

## Database Migration

After `DATABASE_URL` works, run migrations locally or in a one-off Render shell:

```powershell
cd apps/backend
node scripts/apply-migrations.mjs
```

## Local Production Smoke Test

```powershell
npm.cmd run build
npm.cmd run start -w backend
```

Then verify:

```text
http://localhost:3001/health
```
