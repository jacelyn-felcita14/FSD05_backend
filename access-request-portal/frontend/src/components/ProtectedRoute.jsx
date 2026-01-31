import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="auth-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user's actual role
        const redirectPath = user.role === 'REQUESTER' ? '/requester' : '/approver';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
