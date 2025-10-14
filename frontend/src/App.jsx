import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import DashboardPage from './features/dashboard/DashboardPage';
import LimitsPage from './features/limits/LimitsPage';
import ActivityPage from './features/activity/ActivityPage';
import NotificationsPage from './features/notifications/NotificationsPage';
import Profile from './components/Profile/Profile';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const { isAuthenticated } = useAuth();
  useNotifications(); // Enable automatic notifications

  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} 
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/limits"
            element={
              <ProtectedRoute>
                <Layout>
                  <LimitsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <Layout>
                  <ActivityPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Layout>
                  <NotificationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;