# API Quest — System Implementation & Architecture Guide

> Cross-references:
> - Backend: [BACKEND_DOCUMENTATION.md](./backend/BACKEND_DOCUMENTATION.md) | [BACKEND_IMPLEMENTATION.md](./backend/BACKEND_IMPLEMENTATION.md)
> - Frontend: [FRONTEND_DOCUMENTATION.md](./frontend/FRONTEND_DOCUMENTATION.md) | [FRONTEND_IMPLEMENTATION.md](./frontend/FRONTEND_IMPLEMENTATION.md)

---

## 1. System Overview

**API Quest** is an interactive, gamified educational platform built to teach, compare, and practice modern API paradigms: **REST**, **SOAP**, and **GraphQL**, alongside foundational API topics such as Authentication, Rate Limiting, Pagination, Webhooks, and Error Handling.

The system combines:
1. **Interactive Concept Modules:** Deep dive technical comparisons and architecture diagrams.
2. **Interactive Challenge Map:** Progressive difficulty quizzes with level gates and unlockable nodes.
3. **Mission Control Debugger:** Real-world API debugging scenarios evaluated against strict API contracts.
4. **Live Multi-Protocol Sandbox:** Real-time proxy console for executing REST, GraphQL, and SOAP requests.
5. **Arcade Progression Engine:** XP points, dynamic player levels, daily streaks, achievement badges, and a global leaderboard.

---

## 2. High-Level Architecture

```mermaid
flowchart TB
    subgraph ClientLayer ["Client Layer (Browser)"]
        SPA["React 19 SPA (Vite)"]
        ZustandStore["Zustand Store (localStorage)"]
        ReactQuery["TanStack React Query Cache"]
        SPA <--> ZustandStore
        SPA <--> ReactQuery
    end

    subgraph GatewayLayer ["API & Gateway (Port 5000)"]
        ExpressApp["Express.js Server"]
        AuthMiddleware["JWT Authentication Middleware"]
        RateLimiters["express-rate-limit Limiters"]
        ZodValidators["Zod Schema Validation Factory"]
        
        ExpressApp --> RateLimiters
        RateLimiters --> AuthMiddleware
        AuthMiddleware --> ZodValidators
    end

    subgraph ServiceLayer ["Backend Service Engine"]
        AuthService["Auth Service (bcrypt)"]
        ChallengeService["Challenge Service"]
        MissionService["Mission Engine (Evaluation & Hints)"]
        ProgressService["Progress & Streak Engine"]
        SandboxService["Sandbox Proxy Service"]
    end

    subgraph DataLayer ["Data & External Integration"]
        PrismaORM["Prisma ORM (PostgreSQL 16)"]
        PostgresDB[(PostgreSQL Database)]
        ExtREST["REST Sandbox (JSONPlaceholder)"]
        ExtGraphQL["GraphQL Sandbox (Trevor Blades API)"]
        ExtSOAP["SOAP Sandbox (DNE Online Calculator)"]
    end

    SPA -- "Axios (Bearer JWT)" --> ExpressApp
    ZodValidators --> ServiceLayer
    
    ServiceLayer --> PrismaORM
    PrismaORM --> PostgresDB
    
    SandboxService -- "HTTP GET/POST" --> ExtREST
    SandboxService -- "POST { query }" --> ExtGraphQL
    SandboxService -- "POST SOAP Envelope" --> ExtSOAP
    MissionService -- "Proxy Verification" --> ExtREST
```

---

## 3. End-to-End System Workflows

### 3.1 Authentication & Session Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Player
    participant UI as React UI (LoginPage)
    participant Store as Zustand authStore
    participant API as Express /api/auth
    participant DB as PostgreSQL (Prisma)

    Player->>UI: Enter credentials & submit
    UI->>UI: Verify honeypot (_hp_trap is empty)
    UI->>API: POST /api/auth/login { email, password }
    API->>DB: User.findUnique({ email })
    DB-->>API: User record with passwordHash
    API->>API: bcrypt.compare(password, passwordHash)
    API->>API: Generate Access (15m) & Refresh (7d) JWTs
    API-->>UI: 200 { user, accessToken, refreshToken }
    UI->>Store: setAuth(user, access, refresh)
    Store->>Store: Persist to localStorage ('apiquest-auth')
    UI-->>Player: Toast welcome & redirect to /hub
```

---

### 3.2 Challenge Progression & Answer Evaluation

```mermaid
sequenceDiagram
    autonumber
    actor Player
    participant UI as ChallengePage
    participant API as Challenge Controller
    participant Engine as Challenge Service
    participant Progress as Progress Model
    participant DB as PostgreSQL

    Player->>UI: Select option & click "Submit Answer"
    UI->>API: POST /api/challenges/:id/submit { optionId } [Bearer Token]
    API->>Engine: submit(challengeId, optionId, userId)
    Engine->>DB: Challenge.findByIdWithAnswers(challengeId)
    Engine->>DB: CompletedChallenge.findUnique({ userId, challengeId })
    Note over Engine: Snapshot alreadyCorrect before recording attempt
    Engine->>DB: CompletedChallenge.upsert({ isCorrect, completedAt })
    
    alt isCorrect AND NOT alreadyCorrect (First Correct Completion)
        Engine->>Progress: addXp(userId, xpReward)
        Progress->>DB: Increment xpTotal, recalculate level
        Engine->>Progress: updateStreak(userId)
        Progress->>DB: Calculate day difference, update streakCount
        Engine->>Progress: checkAndAwardBadges(userId)
        Progress->>DB: UserBadge.createMany() if criteria met
        Engine-->>API: Return { isCorrect: true, xpAwarded, newBadges, progress }
    else Already Answered Correctly Prior
        Engine-->>API: Return { isCorrect: true, xpAwarded: 0, newBadges: [] }
    else Incorrect Answer
        Engine-->>API: Return { isCorrect: false, xpAwarded: 0, explanation }
    end

    API-->>UI: 200 JSON Response
    UI->>UI: Invalidate ['progress'], ['challenges'] queries
    UI-->>Player: Update HUD XP bar, unlock next nodes, show explanation
```

---

### 3.3 Interactive Mission Execution & Verification

```mermaid
sequenceDiagram
    autonumber
    actor Player
    participant UI as MissionPage
    participant API as Mission Controller
    participant Engine as Mission Service
    participant LiveSandbox as External REST API
    participant DB as PostgreSQL

    Player->>UI: Click "Test Request" (Dry Run)
    UI->>API: POST /api/sandbox/rest { method, path, headers, body }
    API->>LiveSandbox: Execute HTTP call
    LiveSandbox-->>API: Status code, headers, response body
    API-->>UI: 200 { status, data, timing }
    UI-->>Player: Render live HTTP response inspector

    Player->>UI: Click "Submit Mission"
    UI->>API: POST /api/missions/:id/submit { submission, hintsUsed }
    API->>Engine: submit(missionId, submission, userId)
    Engine->>LiveSandbox: Proxy request to sandbox endpoint
    LiveSandbox-->>Engine: sandboxResponse
    Engine->>Engine: evaluate(submission, expectedOutcome, sandboxResponse)
    Note over Engine: Check Method -> Endpoint -> Headers -> Body Keys -> Status Range
    
    alt Mission Passed
        Engine->>Engine: Calculate XP penalty based on hintsUsed
        Engine->>DB: Record MissionAttempt upsert
        Engine->>DB: Increment missionsCompleted or bugsFixed
        Engine-->>API: Return { passed: true, feedback, xpAwarded, coinReward }
    else Mission Failed
        Engine-->>API: Return { passed: false, feedback, errorCategory }
    end

    API-->>UI: 200 Evaluation Outcome
    alt Passed
        UI-->>Player: Trigger MissionCompleteModal & play victory audio/visuals
    else Failed
        UI-->>Player: Display educational error category feedback
    end
```

---

## 4. System Progression Formulas & Rules

### 4.1 Level Calculation Formula
Levels increment for every 100 total XP earned:

$$\text{Level} = \max\left(1, \left\lfloor\frac{\text{xpTotal}}{100}\right\rfloor + 1\right)$$

- **0 – 99 XP:** Level 1
- **100 – 199 XP:** Level 2
- **200 – 299 XP:** Level 3
- Current Level Progress Bar: `xpTotal % 100`

---

### 4.2 Daily Streak Rules
Streaks are updated when a player completes any qualifying activity (first-time challenge or mission passing):

$$\Delta_{\text{days}} = \text{CalendarDays}(\text{now}) - \text{CalendarDays}(\text{lastActivity})$$

- $\Delta_{\text{days}} = 0$: Same day activity. Streak count remains unchanged.
- $\Delta_{\text{days}} = 1$: Consecutive day activity. `streakCount += 1`.
- $\Delta_{\text{days}} > 1$ or `lastActivity == null`: Streak broken or first activity. `streakCount = 1`.

---

### 4.3 Mission Hint XP Penalty Formula
Hints are progressively penalized to encourage independent problem-solving:

$$\text{Penalty} = \begin{cases} 0, & \text{if } \text{hintsUsed} \le 1 \\ \min\left((\text{hintsUsed} - 1) \times 10, \lfloor \text{xpReward} \times 0.25 \rfloor\right), & \text{if } \text{hintsUsed} > 1 \end{cases}$$

$$\text{Final XP} = \max\left(\text{xpReward} - \text{Penalty}, \lceil \text{xpReward} \times 0.5 \rceil\right)$$

- The **first hint** (`index: 0`) is always free.
- Subsequent hints deduct **10 XP** each.
- Maximum deduction is capped at **25%** of the mission reward.
- Passing players are guaranteed at least **50%** of the original XP reward.

---

### 4.4 Badge Trigger Matrix

| Badge Code | Badge Title | Requirement | Verification Trigger |
|---|---|---|---|
| `first_blood` | First Blood | Complete any 1 challenge correctly | Challenge / Mission submission |
| `rest_rookie` | REST Rookie | Complete 1 correct challenge in REST protocol | Challenge submission |
| `soap_slinger` | SOAP Slinger | Complete 1 correct challenge in SOAP protocol | Challenge submission |
| `graphql_guru` | GraphQL Guru | Complete 1 correct challenge in GraphQL protocol | Challenge submission |
| `century` | Century Club | Reach 100+ Total XP | Challenge / Mission submission |
| `legend` | Temple Legend | Reach 500+ Total XP | Challenge / Mission submission |

---

## 5. Environment Variables & Configuration

### 5.1 Backend (`backend/.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
DATABASE_URL="postgresql://apiquest:apiquest_secret@localhost:5432/apiquest?schema=public"

# Authentication Credentials
JWT_ACCESS_SECRET="super_secret_jwt_access_token_key_change_me_32chars"
JWT_REFRESH_SECRET="super_secret_jwt_refresh_token_key_change_me_32chars"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Upstream Sandbox Targets
SANDBOX_REST_BASE_URL="https://jsonplaceholder.typicode.com"
SANDBOX_GRAPHQL_BASE_URL="https://countries.trevorblades.com/graphql"
SANDBOX_SOAP_BASE_URL="http://www.dneonline.com/calculator.asmx"

# Rate Limiting Controls
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
```

### 5.2 Frontend (`frontend/.env`)

```env
# API Gateway Target
VITE_API_BASE_URL="http://localhost:5000/api"
```

---

## 6. Installation & Deployment Guide

### Option A: Docker Compose Quickstart (Recommended)

The repository provides a complete multi-container Docker configuration running PostgreSQL 16, the Express backend, and the Vite frontend.

```bash
# 1. Clone the repository and enter the directory
cd APIQuest

# 2. Launch all services in detached mode
docker compose up -d --build

# 3. View service initialization logs
docker compose logs -f
```

**Services will be live at:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- PostgreSQL: `localhost:5432`

---

### Option B: Manual Local Development Setup

#### 1. Database Setup
Ensure PostgreSQL is running locally and create a database named `apiquest`:
```sql
CREATE DATABASE apiquest;
```

#### 2. Backend Initialization
```bash
cd backend

# Install dependencies
npm install

# Push database schema and seed initial data
npm run db:push
npm run db:seed

# Start backend in development mode (nodemon)
npm run dev
```

#### 3. Frontend Initialization
```bash
cd ../frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

## 7. Security Architecture & Boundary Guarantees

| Security Measure | Implementation Method |
|---|---|
| **Password Hashing** | Bcrypt with 12 computational salt rounds (`auth.service.js`) |
| **Token Architecture** | Short-lived Access Token (15 min) + Refresh Token rotation (7 days) |
| **Anti-Bot Defense** | Client-side invisible honeypot trap input `_hp_trap` on Login and Register forms |
| **Brute-Force Protection** | IP-based rate limiting via `express-rate-limit` (10 register requests / 20 logins per 15 min window) |
| **Sandbox Isolation** | Configurable rate limiting on `/sandbox/*` (30 req / min) to prevent third-party upstream abuse |
| **Information Shielding** | Mission `expectedOutcome` schema is stripped server-side in `mission.service.getById()` |
| **Payload Security** | 1MB JSON body limit on Express parser; strict Zod schema parsing before controller execution |
| **Cross-Origin Security** | Whitelist-only CORS configuration allowing `localhost:*` development origins |

---

## 8. Known Limitations & Architectural Notes

1. **Stateless JWT Blacklisting:** Refresh tokens are verified cryptographically via secret rather than stored in a database table. In the current implementation, revoking a refresh token before its 7-day expiration requires rotating the `JWT_REFRESH_SECRET`.
2. **Third-Party Sandbox Fallbacks:** The SOAP sandbox targets `dneonline.com/calculator.asmx`. If this external HTTP endpoint times out, the backend automatically falls back to an internal arithmetic mock returning synthetic SOAP 1.1 XML to prevent developer blockages.
3. **One-Time Challenge Rewards:** `CompletedChallenge` and `MissionAttempt` records enforce strict single-reward constraints. Users may re-attempt challenges and missions for practice, but XP is permanently awarded only once per unique account.

