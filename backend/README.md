# API Quest Backend

Node.js + Express + Prisma backend for API Quest.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env from example
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT secrets

# 3. Push schema to database & generate Prisma client
npm run db:push

# 4. Seed with concepts + challenges
npm run db:seed

# 5. Start dev server
npm run dev
```

## API Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | /api/auth/register | - |
| POST | /api/auth/login | - |
| POST | /api/auth/refresh | - |
| GET | /api/users/me | ✓ |
| GET | /api/concepts | - |
| GET | /api/concepts/:slug | - |
| POST | /api/sandbox/rest | optional |
| POST | /api/sandbox/graphql | optional |
| POST | /api/sandbox/soap | optional |
| GET | /api/challenges?concept=rest | - |
| GET | /api/challenges/:id | - |
| POST | /api/challenges/:id/submit | optional |
| GET | /api/progress/me | ✓ |
| GET | /api/leaderboard | - |
| GET | /api/health | - |

## Folder Structure

```
src/
├── config/      # env loader, Prisma client singleton
├── modules/     # auth, users, concepts, sandbox, challenges, progress, leaderboard
├── middlewares/ # JWT auth, error handler, Zod validator
├── utils/       # ApiError, asyncHandler, logger
└── routes/      # root router mounts all modules
```

## Scripts

```bash
npm run dev        # nodemon dev server
npm run db:push    # apply schema to DB (no migration history)
npm run db:migrate # create migration file + apply
npm run db:seed    # seed concepts + challenges
npm run db:studio  # open Prisma Studio GUI
npm run db:reset   # drop + repush + reseed
```
