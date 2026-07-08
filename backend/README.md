# Saathy Backend

Node.js/Express backend for Saathy's authentication, user profile, AI companionship, memory, journaling, daily pulse, listener, call, safety, notification, and payment APIs.

## Quick Start

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend runs on `http://localhost:3001` by default.

Set `AI_PROVIDER=mock` to run without external AI keys. Add Supabase, OpenRouter/OpenAI, LiveKit, and Razorpay credentials as those services become available.
