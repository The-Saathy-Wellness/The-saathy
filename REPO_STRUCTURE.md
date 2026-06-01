# Saathy Repository Structure Documentation

## Overview

This monorepo follows a modular structure optimized for MVP development with clear team ownership boundaries. The structure supports independent deployment while maintaining shared types and utilities.

## Complete Repository Tree

```
The-saathy/
├── frontend/                          # React/Next.js Frontend Application
│   ├── app/                          # Next.js app directory (if using App Router)
│   ├── pages/                        # Page components and routing
│   ├── components/                   # Reusable UI components
│   │   ├── auth/                    # Authentication UI components
│   │   ├── common/                  # Shared UI components (Button, Card, etc.)
│   │   ├── layout/                  # Layout components (Header, Sidebar, etc.)
│   │   └── wellness/                # Domain-specific components
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts              # Authentication hook
│   │   ├── useApi.ts               # API call hook
│   │   └── useWellness.ts          # Domain-specific hooks
│   ├── services/                    # API service layer
│   │   ├── api.ts                  # Axios/Fetch instance configuration
│   │   ├── auth.service.ts         # Auth API calls
│   │   └── wellness.service.ts     # Domain API calls
│   ├── store/                       # State management (Redux/Zustand)
│   │   ├── slices/                 # Redux slices or store modules
│   │   ├── auth.store.ts           # Auth state
│   │   └── app.store.ts            # Global app state
│   ├── utils/                       # Utility functions
│   │   ├── constants.ts            # Frontend constants
│   │   └── helpers.ts              # Helper functions
│   ├── styles/                      # Global styles and themes
│   │   ├── globals.css
│   │   └── tailwind.config.js
│   ├── types/                       # Frontend-specific types
│   │   └── index.ts
│   ├── public/                      # Static assets
│   │   └── images/
│   ├── .env.example                # Example environment variables
│   ├── .env.local                  # Local development (gitignored)
│   ├── .env.development            # Development environment
│   ├── .env.production             # Production environment
│   ├── next.config.js              # Next.js configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── package.json
│   └── README.md                   # Frontend setup guide
│
├── backend/                         # Node.js/Express Backend
│   ├── src/
│   │   ├── main.ts                 # Application entry point
│   │   ├── server.ts               # Express server setup
│   │   ├── config/                 # Configuration files
│   │   │   ├── env.ts              # Environment variables
│   │   │   ├── database.ts         # Database connection
│   │   │   └── server.ts           # Server configuration
│   │   ├── routes/                 # API route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── wellness.routes.ts
│   │   │   └── ai.routes.ts
│   │   ├── controllers/            # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── wellness.controller.ts
│   │   │   └── ai.controller.ts
│   │   ├── services/               # Business logic layer
│   │   │   ├── auth.service.ts
│   │   │   ├── wellness.service.ts
│   │   │   └── ai.service.ts
│   │   ├── repositories/           # Database access layer (DAL)
│   │   │   ├── user.repository.ts
│   │   │   ├── wellness.repository.ts
│   │   │   └── base.repository.ts
│   │   ├── middleware/             # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── requestLogger.ts
│   │   ├── validators/             # Input validation & schemas
│   │   │   ├── auth.validators.ts
│   │   │   └── wellness.validators.ts
│   │   ├── utils/                  # Utility functions
│   │   │   ├── jwt.ts              # JWT utilities
│   │   │   ├── crypto.ts           # Encryption utilities
│   │   │   └── helpers.ts
│   │   ├── types/                  # Shared backend types
│   │   │   └── index.ts
│   │   └── exceptions/             # Custom exceptions
│   │       └── AppError.ts
│   ├── drizzle/                    # Drizzle ORM configuration
│   │   ├── schema/                 # Database schema definitions
│   │   │   ├── users.ts
│   │   │   ├── wellness.ts
│   │   │   └── index.ts
│   │   ├── migrations/             # Database migrations
│   │   │   └── 0001_initial.sql
│   │   ├── seeds/                  # Database seed scripts
│   │   │   └── seed.ts
│   │   └── drizzle.config.ts       # Drizzle configuration
│   ├── tests/                      # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── setup.ts
│   ├── .env.example
│   ├── .env.local
│   ├── .env.development
│   ├── .env.production
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── ai/                             # AI Services & Integrations
│   ├── src/
│   │   ├── main.ts                 # AI service entry point
│   │   ├── providers/              # AI provider integrations
│   │   │   ├── gemini.provider.ts  # Gemini API integration
│   │   │   ├── openai.provider.ts  # OpenAI API integration
│   │   │   └── base.provider.ts    # Base provider interface
│   │   ├── services/               # AI service implementations
│   │   │   ├── chat.service.ts     # Chat/conversation service
│   │   │   ├── wellness.service.ts # Wellness AI analysis
│   │   │   └── rag.service.ts      # RAG (Retrieval Augmented Generation)
│   │   ├── prompts/                # Prompt templates & engineering
│   │   │   ├── wellness.prompts.ts
│   │   │   ├── coaching.prompts.ts
│   │   │   └── system.prompts.ts
│   │   ├── memory/                 # Conversation memory management
│   │   │   ├── memory.manager.ts
│   │   │   └── context.manager.ts
│   │   ├── evaluators/             # Response evaluation & quality
│   │   │   ├── response.evaluator.ts
│   │   │   └── quality.metrics.ts
│   │   ├── tools/                  # AI tool definitions (function calling)
│   │   │   ├── wellness.tools.ts
│   │   │   └── tools.registry.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── parsing.ts
│   ├── tests/
│   │   └── providers.test.ts
│   ├── .env.example
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── shared/                         # Shared Code & Types
│   ├── types/                      # Shared TypeScript types
│   │   ├── api.types.ts           # API request/response types
│   │   ├── domain.types.ts        # Business domain types
│   │   ├── auth.types.ts          # Authentication types
│   │   └── index.ts
│   ├── constants/                 # Shared constants
│   │   ├── api.constants.ts       # API endpoints, status codes
│   │   ├── errors.constants.ts    # Error codes & messages
│   │   └── index.ts
│   ├── utils/                     # Shared utility functions
│   │   ├── validation.ts          # Validation utilities
│   │   ├── formatting.ts          # Data formatting
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                           # Documentation
│   ├── architecture/               # Architecture & design docs
│   │   ├── ARCHITECTURE.md         # High-level architecture
│   │   ├── DATA_FLOW.md            # Data flow diagrams
│   │   └── DECISIONS.md            # Architecture Decision Records
│   ├── api/                        # API documentation
│   │   ├── AUTH.md                 # Authentication endpoints
│   │   ├── WELLNESS.md             # Wellness endpoints
│   │   └── AI.md                   # AI service endpoints
│   ├── database/                   # Database documentation
│   │   ├── SCHEMA.md               # Database schema overview
│   │   ├── MIGRATIONS.md           # Migration guide
│   │   └── relationships.md        # Entity relationships
│   ├── ai/                         # AI documentation
│   │   ├── PROMPTS.md              # Prompt engineering guide
│   │   ├── PROVIDERS.md            # AI provider setup
│   │   └── BEST_PRACTICES.md       # AI service best practices
│   ├── deployment/                 # Deployment guides
│   │   ├── FRONTEND.md             # Frontend deployment
│   │   ├── BACKEND.md              # Backend deployment
│   │   └── DOCKER.md               # Docker setup
│   ├── team/                       # Team & process docs
│   │   ├── ONBOARDING.md           # Developer onboarding
│   │   ├── CONTRIBUTING.md         # Contributing guidelines
│   │   └── WORKFLOW.md             # Development workflow
│   └── README.md
│
├── infrastructure/                 # Infrastructure & DevOps
│   ├── docker/
│   │   ├── Dockerfile.frontend
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.ai
│   │   └── docker-compose.yml
│   ├── kubernetes/                 # K8s manifests (optional for MVP)
│   │   └── README.md
│   ├── github-actions/             # CI/CD workflows
│   │   ├── frontend-deploy.yml
│   │   ├── backend-deploy.yml
│   │   ├── ai-deploy.yml
│   │   └── tests.yml
│   ├── terraform/                  # IaC configuration (optional)
│   │   └── README.md
│   ├── scripts/
│   │   ├── setup-dev.sh            # Local development setup
│   │   ├── migrate-db.sh           # Database migration runner
│   │   └── seed-db.sh              # Database seed runner
│   └── README.md
│
├── .github/                        # GitHub configuration
│   ├── workflows/                  # CI/CD workflows
│   │   ├── tests.yml
│   │   ├── deploy-staging.yml
│   │   ├── deploy-production.yml
│   │   └── lint-and-format.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug.md
│   │   ├── feature.md
│   │   └── database_migration.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── dependabot.yml
│
├── .gitignore                      # Git ignore rules
├── .editorconfig                   # Editor configuration
├── .prettierrc                      # Prettier formatting config
├── .eslintrc.js                    # ESLint configuration
├── lerna.json                      # Monorepo configuration (optional)
├── package.json                    # Root package.json
├── README.md                       # Main documentation
├── CONTRIBUTING.md                 # Contribution guidelines
├── CODE_OF_CONDUCT.md              # Code of conduct
└── LICENSE                         # Project license
```

---

## Folder Explanations by Team

### **Frontend Team Ownership**

```
frontend/
├── components/        # Shared UI components
├── pages/            # Page routing and views
├── hooks/            # React hooks for logic reuse
├── services/         # API integration layer
├── store/            # State management (Redux/Zustand)
├── styles/           # Global styling & theme
└── utils/            # Frontend utilities
```

**Responsibilities:**
- Building responsive React/Next.js UI
- Form handling and validation
- Authentication UI flows
- API integration via services layer
- State management with Redux or Zustand
- Component library maintenance

**Key Technologies:**
- Next.js 14+ with TypeScript
- Tailwind CSS or styled-components
- Redux Toolkit or Zustand
- React Query for async state

---

### **Backend Team Ownership**

```
backend/
├── src/
│   ├── routes/       # API endpoint definitions
│   ├── controllers/  # Request handlers
│   ├── services/     # Business logic
│   ├── repositories/ # Database access (DAL)
│   ├── middleware/   # Express middleware
│   └── validators/   # Input validation
├── drizzle/
│   ├── schema/       # Database schema
│   ├── migrations/   # Schema migrations
│   └── seeds/        # Test data
└── tests/
```

**Responsibilities:**
- RESTful API development
- Database schema design & migrations
- Business logic implementation
- Authentication & authorization
- Error handling & validation
- Testing & documentation

**Key Technologies:**
- Node.js 18+ with TypeScript
- Express.js
- Drizzle ORM
- PostgreSQL via Supabase
- Jest for testing

---

### **AI Team Ownership**

```
ai/
├── src/
│   ├── providers/    # Gemini & OpenAI integrations
│   ├── services/     # AI service implementations
│   ├── prompts/      # Prompt engineering & templates
│   ├── memory/       # Conversation state management
│   ├── evaluators/   # Quality & response evaluation
│   └── tools/        # AI tool/function definitions
└── tests/
```

**Responsibilities:**
- AI provider integration (Gemini, OpenAI)
- Prompt engineering & optimization
- Conversation management & memory
- Response quality evaluation
- Tool/function calling setup
- Testing AI outputs

**Key Technologies:**
- Gemini API & SDK
- OpenAI API & SDK
- LangChain (optional)
- TypeScript

---

### **Shared Team Ownership** (All Teams)

```
shared/
├── types/       # Common TypeScript interfaces
├── constants/   # Shared constants & enums
└── utils/       # Cross-cutting utilities
```

**Responsibilities:**
- Defining API contract types
- Business domain types
- Error codes and messages
- Shared validation logic

---

## Environment Management

### Frontend (.env files)

```env
# .env.local (Development - gitignored)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_APP_ENV=development

# .env.development (Checked in)
NEXT_PUBLIC_API_BASE_URL=https://api-dev.saathy.com
NEXT_PUBLIC_APP_ENV=development

# .env.production (Checked in)
NEXT_PUBLIC_API_BASE_URL=https://api.saathy.com
NEXT_PUBLIC_APP_ENV=production
```

### Backend (.env files)

```env
# .env.local (Development - gitignored)
DATABASE_URL=postgresql://user:password@localhost:5432/saathy_dev
JWT_SECRET=dev-secret-key-change-in-production
NODE_ENV=development
GEMINI_API_KEY=your-key
OPENAI_API_KEY=your-key

# .env.development
DATABASE_URL=postgresql://user:password@dev-db:5432/saathy_dev
NODE_ENV=development

# .env.production
DATABASE_URL=postgresql://user:password@prod-db:5432/saathy
NODE_ENV=production
```

### Secrets Management

**Development:**
- Store `.env.local` locally (gitignored)
- Use environment-specific files for defaults

**Staging/Production:**
- Use GitHub Secrets for CI/CD
- Use Supabase environment variables
- Use cloud provider secrets management (AWS Secrets Manager, etc.)

**Never commit:**
- API keys
- Database passwords
- JWT secrets
- Private tokens

---

## Team Ownership Matrix

| Area | Team | Primary | Secondary |
|------|------|---------|-----------|
| Frontend Code | Frontend | ✓ | DevOps |
| API Design | Backend | ✓ | Frontend |
| Database Schema | Backend | ✓ | AI (for RAG) |
| Authentication | Backend | ✓ | Frontend |
| AI Services | AI | ✓ | Backend |
| DevOps/CI-CD | Backend/DevOps | ✓ | All |
| Shared Types | Backend | ✓ | Frontend, AI |
| Documentation | All | ✓ | - |

---

## Branch Naming Conventions

```
main                    # Production branch (protected)
develop                 # Development integration branch (protected)
feature/*              # Feature development
  feature/auth-setup
  feature/wellness-dashboard
  feature/ai-coaching
hotfix/*               # Production hotfixes
  hotfix/auth-bug
bugfix/*               # Bug fixes on develop
  bugfix/validation-error
docs/*                 # Documentation updates
  docs/api-guide
refactor/*             # Code refactoring
  refactor/db-queries
chore/*                # Maintenance tasks
  chore/update-dependencies
```

---

## MVP-Friendly Recommendations

### Start Small, Scale Later
1. Use PostgreSQL with Drizzle ORM (simpler than Prisma for team coordination)
2. Monorepo with shared types only (not shared components initially)
3. Docker Compose for local dev (not K8s initially)
4. GitHub Actions for CI/CD (no external tools initially)

### Team Coordination
1. Clear PR review process (see PULL_REQUEST_PROCESS.md)
2. Regular sync on database schema changes
3. API contract defined first before implementation
4. Shared Slack channel for blockers

### Development Velocity
1. Feature flags for incomplete features
2. Database migrations must be reversible
3. API versioning from day 1 (v1, v2)
4. Automated testing gates on main/develop

### Code Quality
1. Pre-commit hooks (lint, format, type check)
2. Branch protection rules enforcing tests & reviews
3. Automated dependency updates via Dependabot
4. Regular tech debt cleanup sprints

