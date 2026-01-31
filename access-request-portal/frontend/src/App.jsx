import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import RequesterDashboard from './pages/RequesterDashboard';
import ApproverDashboard from './pages/ApproverDashboard';

// Home redirect component
const Home = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate dashboard based on role
  return <Navigate to={user.role === 'REQUESTER' ? '/requester' : '/approver'} replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/requester"
            element={
              <ProtectedRoute requiredRole="REQUESTER">
                <RequesterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/approver"
            element={
              <ProtectedRoute requiredRole="APPROVER">
                <ApproverDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Home />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
