# API Quest — Frontend Implementation Details

> Cross-references: [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md) | [SYSTEM_IMPLEMENTATION.md](../SYSTEM_IMPLEMENTATION.md)

This document details the code implementations, component patterns, mutation workflows, state interactions, and form protection mechanisms across the API Quest frontend application.

---

## 1. Authentication & Session Implementation

### 1.1 Zustand Store Implementation

**File:** [`src/features/auth/authStore.js`](../../frontend/src/features/auth/authStore.js)

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

      updateUser: (updates) =>
        set({ user: { ...get().user, ...updates } }),
    }),
    {
      name: 'apiquest-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

**Implementation Highlights:**
- **Selective Persistence (`partialize`):** Only serializes the authentication credentials and user profile to `localStorage`. Internal temporary actions are never stored.
- **Atomic Session Updates:** `setAuth` simultaneously writes user metadata, token credentials, and sets `isAuthenticated: true` in a single state change, preventing race conditions during router redirection.

---

### 1.2 Authentication Mutation & Honeypot Defense

**Files:** [`src/features/auth/LoginPage.jsx`](../../frontend/src/features/auth/LoginPage.jsx) and [`src/features/auth/RegisterPage.jsx`](../../frontend/src/features/auth/RegisterPage.jsx)

```javascript
// Honeypot trap state
const [form, setForm] = useState({ email: '', password: '', _hp_trap: '' });

const mutation = useMutation({
  mutationFn: authApi.login,
  onSuccess: (data) => {
    setAuth(data.user, data.accessToken, data.refreshToken);
    toast.success(`Welcome back, Player ${data.user.username}!`);
    navigate(redirectTarget);
  },
  onError: (err) => {
    toast.error(err.response?.data?.message || 'Login failed');
  },
});

const handleSubmit = (e) => {
  e.preventDefault();
  // If automated bots fill the hidden field, silently terminate submission
  if (form._hp_trap) return;
  const { _hp_trap, ...payload } = form;
  mutation.mutate(payload);
};
```

**Security & Anti-Bot Strategy:**
- **Hidden Input Field (`_hp_trap`):** Positioned off-screen with `display: 'none'`, `tabIndex={-1}`, and `autoComplete="off"`. Automated scrapers filling all form inputs hit the trap and get silently dropped without network requests.
- **Query Parameter Preservation (`redirect`):** If a user attempts to access a protected challenge or mission, the router appends `?redirect=/challenges/123`. Upon successful authentication, the user is navigated directly to their intended destination instead of the default hub.

---

### 1.3 Animated Character Stage Integration

**File:** [`src/features/auth/CharacterStage.jsx`](../../frontend/src/features/auth/CharacterStage.jsx)

The authentication layout pairs the form with a high-impact character stage:
- Responsive alignment: Takes 5 columns on desktop grid (`lg:col-span-5`), neatly anchored to the bottom.
- Character asset: Displays `/character.png` with ambient backlighting filters, drop shadows, and scale adjustments to avoid clipping or distortion.
- Aesthetic harmony: Perfectly aligns with the `#78b832` to `#143510` gaming gradient.

---

## 2. Centralized Axios Interceptor Engine

**File:** [`src/lib/axios.js`](../../frontend/src/lib/axios.js)

```javascript
import axios from 'axios';
import { useAuthStore } from '../features/auth/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: Injects current Access Token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor: Seamless Token Refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh`,
          { refreshToken }
        );

        useAuthStore.getState().setTokens(data.data.accessToken, data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original); // Re-run failed request with new access token
      } catch {
        useAuthStore.getState().logout(); // Evict session on invalid refresh token
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Implementation Nuances:**
- **Direct Store Access via `useAuthStore.getState()`:** Interceptors run outside the React render cycle, directly accessing and updating Zustand state without React hooks.
- **Re-entrance Guard (`original._retry`):** Prevents infinite loops if the refresh request itself fails or returns a 401.

---

## 3. Route Guard Implementations

**File:** [`src/app/router.jsx`](../../frontend/src/app/router.jsx)

```javascript
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/hub" replace />;
};

const HomeRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/hub" replace /> : <HomePage />;
};
```

---

## 4. Feature Implementations

### 4.1 Challenges & Quiz Engine

**Files:** [`src/features/challenges/ChallengesPage.jsx`](../../frontend/src/features/challenges/ChallengesPage.jsx) and [`ChallengePage.jsx`](../../frontend/src/features/challenges/ChallengePage.jsx)

#### Level-Locking & Progression Verification
```javascript
const handleChallengeClick = (e, challenge) => {
  if (!isAuthenticated) {
    e.preventDefault();
    setSelectedChallengeId(challenge.id);
    setShowAuthModal(true); // Prompts visitor with modal instead of silent block
    return;
  }

  if (!challenge.isUnlocked && challenge.requiredXp > 0) {
    e.preventDefault();
    alert(`Level Locked! You need ${challenge.requiredXp} total XP to unlock this node.`);
    return;
  }
};
```

#### Answer Submission Mutation
```javascript
const mutation = useMutation({
  mutationFn: ({ id, optionId }) => challengesApi.submit(id, optionId),
  onSuccess: (data) => {
    setResult(data);
    if (data.isCorrect) {
      toast.success(`Correct! +${data.xpAwarded} XP awarded!`);
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    } else {
      toast.error('Incorrect! Try reviewing the concept explanation.');
    }
  },
});
```

---

### 4.2 Interactive Missions & Debugger

**Files:** [`src/features/missions/MissionsPage.jsx`](../../frontend/src/features/missions/MissionsPage.jsx) and [`MissionPage.jsx`](../../frontend/src/features/missions/MissionPage.jsx)

Missions enable hands-on debugging of live API scenarios.

#### Dual-Execution Paradigm:
1. **Live Sandbox Test Execution:** When the user clicks "Test Request", the page executes the request against the live backend sandbox (`POST /sandbox/rest`), updating the in-page response preview with status, headers, and body.
2. **Evaluation Submission:** When the user clicks "Submit Mission", `POST /missions/:id/submit` verifies compliance against the hidden server rules.

#### Hint Unlock Pattern with Progressive Penalty:
```javascript
const handleUnlockHint = async (hintIndex) => {
  try {
    const hintData = await missionsApi.getHint(mission.id, hintIndex);
    setRevealedHints((prev) => ({ ...prev, [hintIndex]: hintData.hint }));
    setHintsUsed((prev) => Math.max(prev, hintIndex + 1));
    toast('Hint unlocked!', { icon: '💡' });
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to unlock hint');
  }
};
```

#### Completion Dialog:
Upon passing, `MissionCompleteModal` renders celebratory audio-visual rewards showing XP awarded, coin reward, and any newly unlocked badges.

---

### 4.3 Sandbox Interactive Console

**File:** [`src/features/sandbox/SandboxPage.jsx`](../../frontend/src/features/sandbox/SandboxPage.jsx)

Provides 3 dedicated protocol workspaces:
1. **REST Console:** Configurable HTTP Method (`GET`, `POST`, `PUT`, `DELETE`), custom path, headers, and JSON body editor.
2. **GraphQL Explorer:** Multi-line query editor with variables JSON panel and real-time syntax checking.
3. **SOAP Calculator:** Visual integer inputs and operation selector generating SOAP 1.1 envelopes on the fly.

Includes copy-to-curl generation and timing telemetry display (`timing.ms`).

---

### 4.4 Dashboard Command Center & Player Profile

**Files:** [`src/features/dashboard/DashboardHomePage.jsx`](../../frontend/src/features/dashboard/DashboardHomePage.jsx) and [`ProfilePage.jsx`](../../frontend/src/features/dashboard/ProfilePage.jsx)

#### Dynamic Level & XP Progress Computation:
```javascript
function XPBar({ xpTotal, className = '' }) {
  const xpInLevel = xpTotal % 100;
  return (
    <div className={`xp-bar ${className}`}>
      <div className="xp-bar-fill" style={{ width: `${xpInLevel}%` }} />
    </div>
  );
}
```

#### Badge Metadata Mapping:
Maps backend badge codes to custom pixel SVGs and display descriptions:
```javascript
const BADGE_META = {
  first_blood:  { icon: PixelFirstBlood, label: 'First Blood',   desc: 'Completed your first quest' },
  rest_rookie:  { icon: PixelLink,       label: 'REST Rookie',    desc: 'Mastered REST API concepts' },
  soap_slinger: { icon: PixelScroll,     label: 'SOAP Slinger',   desc: 'Mastered SOAP protocol' },
  graphql_guru: { icon: PixelBolt,       label: 'GraphQL Guru',   desc: 'Mastered GraphQL queries' },
  century:      { icon: PixelCentury,    label: 'Century',        desc: 'Earned 100+ XP' },
  legend:       { icon: PixelTrophy,     label: 'Legend',         desc: 'Earned 500+ XP' },
};
```

---

### 4.5 Leaderboard Ranking Engine

**File:** [`src/features/leaderboard/LeaderboardPage.jsx`](../../frontend/src/features/leaderboard/LeaderboardPage.jsx)

Renders the top 50 global players:
- Rank 1: Crown icon with glowing amber animation
- Rank 2: Silver pixel award icon
- Rank 3: Bronze pixel award icon
- Ranks 4+: Numbered badges
- Visual breakdown: Level, Total XP, Streak counter (with flame icon), and Bugs fixed counter.

---

## 5. Cookie Consent & Privacy Preference Management

**File:** [`src/components/CookieConsent.jsx`](../../frontend/src/components/CookieConsent.jsx)

- Manages GDPR / CCPA cookie consent via local storage key `apiquest-cookie-consent`.
- Provides both quick action ("Accept All", "Reject Non-Essential") and a granular preference modal triggered globally by `openCookiePreferences()`.

