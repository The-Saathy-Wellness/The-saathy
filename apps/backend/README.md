# Saathy Backend

Express + TypeScript API for Saathy's Supabase-backed auth sync, AI companion chat,
encrypted emotional memory, journals, daily pulse, listeners, and circles.

## Local Development

```powershell
cd apps/backend
copy .env.example .env
npm.cmd run dev
```

Required values are documented in `.env.example`. Set `AI_PROVIDER=local` for no-key
development, or use `gemini`, `openai`, or `openrouter` with the matching API key.

## Key Endpoints

- `GET /health`
- `POST /api/v1/auth/sync`
- `POST /api/v1/ai/chat`
- `GET /api/v1/ai/sessions`
- `POST /api/v1/wellness/memory`
- `GET /api/v1/wellness/memory`
- `POST /api/v1/wellness/journals`
- `GET /api/v1/wellness/journals`
- `POST /api/v1/wellness/daily-pulse`
- `GET /api/v1/wellness/daily-pulse`
- `GET /api/v1/wellness/listeners`
- `GET /api/v1/wellness/circles`
