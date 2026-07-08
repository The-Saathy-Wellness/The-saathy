# Implementation Log

This file tracks fast implementation decisions and fixes made during the MVP push.

## 2026-06-29

- Added this implementation log so quick changes are recorded in the repository.
- Fixed the login form to match the actual passwordless auth behavior:
  - Renamed the email field label from `Nickname` to `Email`.
  - Changed the placeholder to `you@example.com`.
  - Removed the unused password and "keep me logged in" controls from the magic-link form.
  - Changed the submit label from `Login` to `Send magic link`.
  - Added a visible `Continue as guest` action wired to the existing anonymous sign-in flow.
- Fixed guest continuity flow in `apps/frontend/src/pages/Login.tsx`:
  - Check for an existing device fingerprint before writing the current anonymous session fingerprint.
  - Compare against `guestSessionId`, which is the field returned by the backend.
- Aligned `apps/frontend/src/pages/Register.tsx` with the rest of the frontend by defaulting
  `VITE_API_BASE_URL` to `http://localhost:3001` for local development.
- Verification:
  - `npm run build -w @saathy/shared` passed.
  - `npm run build -w frontend` passed.
  - `npm run build -w backend` passed.
  - Frontend build still reports existing CSS `@import` ordering warnings and a large bundle warning.
- Implemented MVP backend and AI runtime:
  - Added optional backend AI env settings for `local`, `openai`, and `openrouter` providers.
  - Added `apps/backend/src/services/safety.ts` for basic crisis/self-harm/abuse/panic detection.
  - Added `apps/backend/src/services/aiProvider.ts` with local fallback plus OpenAI/OpenRouter chat completion support.
  - Added `POST /api/v1/ai/chat` for authenticated AI companion messages.
  - Added `GET /api/v1/ai/sessions` for authenticated AI chat session listing.
  - Added encrypted `ai_chat_messages` schema and migration support.
  - Added `apps/backend/src/api/wellness/wellness.routes.ts` for memory, journal, daily pulse, listeners, and circles.
  - Wired AI and wellness routes into `apps/backend/src/index.ts`.
  - Added `apps/backend/drizzle/0002_mvp_backend_ai.sql` to align guest continuity columns and add encrypted chat messages.
  - Connected dashboard Saathy AI chat to the backend endpoint with a frontend fallback message.
- Verification after backend/AI implementation:
  - `npm run build -w backend` passed.
  - `npm run build -w frontend` passed.
- Switched planned AI runtime to Gemini:
  - Added `gemini` as a supported `AI_PROVIDER`.
  - Added `GEMINI_API_KEY` and `GEMINI_MODEL` backend env settings.
  - Defaulted `.env.example` to `AI_PROVIDER=gemini` and `GEMINI_MODEL=gemini-2.5-flash`.
  - Implemented Gemini `models.generateContent` support in `apps/backend/src/services/aiProvider.ts`.
- Fixed Register Google OAuth redirect to match Login and return users to `/dashboard`.
- Removed the dashboard inline Google Fonts `@import` from `Dashboard.tsx` and moved global font imports above Tailwind in `global.css`; Vite/PostCSS import-order warnings are now resolved.
- Wired the dashboard header controls:
  - Search now opens a quick-jump/results dropdown for pages, journals, listeners, experts, and circles.
  - Enter on the search input opens the first matching result.
  - Notification bell now opens an actionable notifications panel and clears the unread badge when viewed.
- Added `apps/backend/scripts/apply-migrations.mjs` as a direct SQL migration helper for Supabase setup when `drizzle-kit push` cannot introspect through the selected connection.
- Added a demo-safe backend fallback while Supabase Postgres credentials are being resolved:
  - `requireAuth` now continues after a valid Supabase token even if custom profile lookup fails.
  - `/api/v1/ai/chat` can return a non-persistent Gemini response if database writes fail.
- Prepared deployment configuration:
  - Added backend production `start` script.
  - Added `render.yaml` for Render backend + frontend services.
  - Added `DEPLOYMENT.md` with required environment variables, Supabase redirect settings, and migration steps.
  - Added `apps/frontend/.env.example`.
- Wired support interactions that were previously static:
  - Listener cards now open a lightweight private listener chat panel.
  - Chat rooms now open an in-page moderated room panel with anonymous message input.
  - Expert call cards now show a booking confirmation panel.
