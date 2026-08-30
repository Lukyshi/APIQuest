import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import { useAuthStore } from '../features/auth/authStore';

// Pages
import HomePage        from '../features/home/HomePage';
import LoginPage       from '../features/auth/LoginPage';
import RegisterPage    from '../features/auth/RegisterPage';
import ConceptsPage    from '../features/concepts/ConceptsPage';
import ConceptDetailPage from '../features/concepts/ConceptDetailPage';
import SandboxPage     from '../features/sandbox/SandboxPage';
import ChallengesPage  from '../features/challenges/ChallengesPage';
import ChallengePage   from '../features/challenges/ChallengePage';
import DashboardPage   from '../features/progress/DashboardPage';
import LeaderboardPage from '../features/leaderboard/LeaderboardPage';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        </Route>

        {/* App layout */}
        <Route element={<AppLayout />}>
          <Route index            element={<HomePage />} />
          <Route path="/concepts" element={<ConceptsPage />} />
          <Route path="/concepts/:slug" element={<ConceptDetailPage />} />
          <Route path="/sandbox"  element={<SandboxPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/challenges/:id" element={<ChallengePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
